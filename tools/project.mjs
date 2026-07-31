import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildProject, loadManifest } from "../src/application/build-project.mjs";
import { createContentLocks } from "../src/application/content-lock.mjs";
import { validateProject } from "../src/application/validate-project.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const command = process.argv[2] || "validate";
try {
  if (command === "build") {
    const result = await buildProject(root);
    console.log(`Built ${result.copied.length} public files.`);
  } else if (command === "lock") {
    const manifest = await loadManifest(root);
    const result = await createContentLocks(root, manifest);
    console.log(`Locked ${Object.keys(result.files).length} protected content files.`);
  } else if (command === "validate") {
    const result = await validateProject(root);
    console.log(`Validated ${result.checked.length} files across ${result.contexts.length} contexts.`);
  } else {
    throw new Error(`Unknown command: ${command}`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}