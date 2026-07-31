import { fromRoot, readJson, readUtf8, sha256, visibleText, writeUtf8 } from "../infrastructure/file-system.mjs";

export async function createContentLocks(root, manifest) {
  const files = {};
  for (const context of manifest.contexts) {
    for (const file of context.files.filter((entry) => entry.contentLock)) {
      const source = `${context.sourceRoot}/${file.source}`;
      const text = visibleText(await readUtf8(fromRoot(root, source)));
      files[source] = { context: context.id, output: file.output, visibleTextSha256: sha256(text) };
    }
  }
  const lock = { version: 1, generatedAt: new Date().toISOString(), files };
  await writeUtf8(fromRoot(root, "locks/content-lock.json"), `${JSON.stringify(lock, null, 2)}\n`);
  return lock;
}

export async function readContentLocks(root) {
  return readJson(fromRoot(root, "locks/content-lock.json"));
}