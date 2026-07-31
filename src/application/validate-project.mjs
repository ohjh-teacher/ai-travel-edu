import { access } from "node:fs/promises";
import path from "node:path";
import { loadManifest } from "./build-project.mjs";
import { readContentLocks } from "./content-lock.mjs";
import { fromRoot, readJson, readUtf8, sha256, visibleText } from "../infrastructure/file-system.mjs";

export async function validateProject(root) {
  const manifest = await loadManifest(root);
  const locks = await readContentLocks(root);
  const errors = [];
  const checked = [];
  for (const file of manifest.shared || []) {
    const sourceText = await readUtf8(fromRoot(root, file.source));
    const outputText = await readUtf8(fromRoot(root, file.output));
    if (sha256(sourceText) !== sha256(outputText)) errors.push(`Generated output differs from source: ${file.output}`);
    checked.push(file.output);
  }
  for (const context of manifest.contexts) {
    for (const file of context.files) {
      const source = `${context.sourceRoot}/${file.source}`;
      const sourceText = await readUtf8(fromRoot(root, source));
      const outputText = await readUtf8(fromRoot(root, file.output));
      if (sha256(sourceText) !== sha256(outputText)) errors.push(`Generated output differs from source: ${file.output}`);
      if (file.contentLock) {
        const expected = locks.files?.[source]?.visibleTextSha256;
        const actual = sha256(visibleText(sourceText));
        if (!expected) errors.push(`Missing content lock: ${source}`);
        else if (actual !== expected) errors.push(`Protected content changed without lock approval: ${source}`);
      }
      checked.push(file.output);
    }
  }
  for (const file of manifest.protectedInfrastructure || []) {
    try { await access(fromRoot(root, file)); } catch { errors.push(`Missing protected infrastructure file: ${file}`); }
  }
  const catalog = await readJson(fromRoot(root, manifest.catalog));
  for (const course of catalog.courses || []) {
    try { await access(fromRoot(root, course.route)); } catch { errors.push(`Catalog route is missing: ${course.route}`); }
  }
  for (const output of manifest.projectorOutputs || []) {
    const html = await readUtf8(fromRoot(root, output));
    if (!html.includes("projector.css") || !html.includes("projector-deck")) {
      errors.push(`Projector output is missing shared projector rules: ${output}`);
    }
  }
  const projector = await readUtf8(fromRoot(root, "shared/styles/projector.css"));
  for (const token of ["--projector-title", "--projector-body", "--projector-caption"]) {
    if (!projector.includes(token)) errors.push(`Missing projector typography token: ${token}`);
  }
  if (errors.length) throw new Error(errors.join("\n"));
  return { checked, contexts: manifest.contexts.map((context) => context.id) };
}