export function validateManifest(manifest) {
  if (!manifest || manifest.architectureVersion !== 1) throw new Error("Unsupported project manifest.");
  if (!Array.isArray(manifest.contexts) || manifest.contexts.length === 0) throw new Error("At least one bounded context is required.");
  const ids = new Set();
  const outputs = new Set();
  for (const context of manifest.contexts) {
    if (!context.id || ids.has(context.id)) throw new Error(`Invalid or duplicate context id: ${context.id || "(empty)"}`);
    ids.add(context.id);
    if (!context.sourceRoot || !Array.isArray(context.files)) throw new Error(`Context ${context.id} is incomplete.`);
    for (const file of context.files) {
      if (!file.source || !file.output) throw new Error(`Context ${context.id} contains an incomplete file mapping.`);
      if (outputs.has(file.output)) throw new Error(`Duplicate public output: ${file.output}`);
      outputs.add(file.output);
    }
  }
  for (const file of manifest.shared || []) {
    if (outputs.has(file.output)) throw new Error(`Duplicate shared output: ${file.output}`);
    outputs.add(file.output);
  }
  return manifest;
}