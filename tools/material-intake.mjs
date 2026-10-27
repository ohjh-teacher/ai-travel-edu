import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cacheRoot = path.join(root, "tmp", "material-intake-cache");

function option(args, name) {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  if (!args[index + 1] || args[index + 1].startsWith("--")) {
    throw new Error(`${name} requires a value.`);
  }
  return args[index + 1];
}

async function fileHash(file) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
}

function inside(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative && relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

async function readReceipt(file) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function main() {
  const [command, input, ...args] = process.argv.slice(2);
  if (!["status", "record"].includes(command) || !input) {
    throw new Error("Usage: node tools/material-intake.mjs status|record <input-file> --processor <name-version> [--artifact <cached-output>]");
  }
  const processor = option(args, "--processor");
  if (!processor || !/^[a-z0-9][a-z0-9._-]{0,79}-v\d+$/i.test(processor)) {
    throw new Error("--processor must be a short name with a version, for example pdf-text-v1.");
  }
  const source = path.resolve(input);
  const sourceInfo = await stat(source);
  if (!sourceInfo.isFile()) throw new Error(`Not a file: ${source}`);
  const sourceHash = await fileHash(source);
  const sourceCache = path.join(cacheRoot, sourceHash);
  const receiptPath = path.join(sourceCache, `${processor}.json`);

  if (command === "status") {
    const receipt = await readReceipt(receiptPath);
    let reason = "no-record";
    if (receipt?.sourceHash === sourceHash && receipt?.processor === processor && receipt?.artifact) {
      const artifact = path.resolve(root, receipt.artifact);
      if (inside(sourceCache, artifact)) {
        try {
          if (await fileHash(artifact) === receipt.artifactHash) {
            console.log(JSON.stringify({ status: "reuse", sourceHash, processor, artifact: receipt.artifact }));
            return;
          }
          reason = "cached-output-changed";
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
          reason = "cached-output-missing";
        }
      } else {
        reason = "invalid-record";
      }
    }
    console.log(JSON.stringify({ status: "process", reason, sourceHash, processor, cacheDirectory: path.relative(root, sourceCache).replaceAll(path.sep, "/") }));
    return;
  }

  const artifactValue = option(args, "--artifact");
  if (!artifactValue) throw new Error("record requires --artifact <cached-output>.");
  const artifact = path.resolve(artifactValue);
  if (!inside(sourceCache, artifact)) {
    throw new Error(`Cached output must be inside ${sourceCache}`);
  }
  const artifactInfo = await stat(artifact);
  if (!artifactInfo.isFile()) throw new Error(`Not a file: ${artifact}`);
  const receipt = {
    version: 1,
    sourceHash,
    processor,
    artifact: path.relative(root, artifact).replaceAll(path.sep, "/"),
    artifactHash: await fileHash(artifact),
    artifactBytes: artifactInfo.size,
    recordedAt: new Date().toISOString()
  };
  await mkdir(sourceCache, { recursive: true });
  const temporary = `${receiptPath}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  await rename(temporary, receiptPath);
  console.log(JSON.stringify({ status: "recorded", sourceHash, processor, artifact: receipt.artifact }));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
