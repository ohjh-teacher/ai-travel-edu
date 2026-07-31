import { validateManifest } from "../domain/project-schema.mjs";
import { copyTextFile, fromRoot, readJson } from "../infrastructure/file-system.mjs";

export async function loadManifest(root) {
  return validateManifest(await readJson(fromRoot(root, "config/project.manifest.json")));
}
export async function buildProject(root) {
  const manifest = await loadManifest(root);
  const copied = [];
  for (const file of manifest.shared || []) {
    await copyTextFile(fromRoot(root, file.source), fromRoot(root, file.output));
    copied.push(file.output);
  }
  for (const context of manifest.contexts) {
    for (const file of context.files) {
      const source = `${context.sourceRoot}/${file.source}`;
      await copyTextFile(fromRoot(root, source), fromRoot(root, file.output));
      copied.push(file.output);
    }
  }
  return { manifest, copied };
}