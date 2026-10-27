import { cp, mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifest } from "../src/application/build-project.mjs";
import { validateProject } from "../src/application/validate-project.mjs";
import { coursePrefix, localRoute, validateCourseCatalog } from "../src/domain/course-catalog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const marker = ".release-generated";
const command = process.argv[2] || "validate";

const fromRoot = (relative) => path.resolve(root, relative);
const slash = (value) => value.replaceAll(path.sep, "/");

function within(parent, child) {
  const relative = path.relative(parent, child);
  return relative && relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

function safeRelative(relative) {
  if (!relative || path.isAbsolute(relative) || relative.split(/[\\/]/).includes("..")) {
    throw new Error(`Unsafe publication path: ${relative}`);
  }
  return relative;
}

async function readJson(relative) {
  return JSON.parse(await readFile(fromRoot(relative), "utf8"));
}

function publicationCourses(catalog, publication) {
  const held = publication.heldCourseIds || [];
  if (!Array.isArray(held) || new Set(held).size !== held.length ||
      held.some((id) => !catalog.courses.some((course) => course.id === id && course.status === "published"))) {
    throw new Error("Invalid held course IDs in publication configuration.");
  }
  return catalog.courses.map((course) => held.includes(course.id) ? { ...course, status: "held" } : course);
}

function removeUnpublishedCards(html, page, courses) {
  const byRoute = new Map(courses.map((course) => [course.route, course]));
  return html.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, (anchor) => {
    const href = anchor.match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2];
    const course = byRoute.get(localRoute(href, page));
    return course && course.status !== "published" ? "" : anchor;
  });
}

async function copyEntry(source, target) {
  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target, { recursive: true });
}

async function collectFiles(directory, prefix = "") {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) result.push(...await collectFiles(path.join(directory, entry.name), relative));
    else result.push(relative);
  }
  return result;
}

async function validateDirectory(directory, courses) {
  const files = await collectFiles(directory);
  const available = new Set(files);
  const unpublished = courses.filter((course) => course.status !== "published");
  const errors = [];
  for (const file of files) {
    if (unpublished.some((course) => file === course.route || file.startsWith(coursePrefix(course)))) {
      errors.push(`Unpublished course included: ${file}`);
    }
    if (!file.endsWith(".html")) continue;
    const html = await readFile(path.join(directory, file), "utf8");
    for (const match of html.matchAll(/\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi)) {
      const route = localRoute(match[2], file);
      if (!route) continue;
      if (unpublished.some((course) => route === course.route || route.startsWith(coursePrefix(course)))) {
        errors.push(`Unpublished course linked from ${file}: ${route}`);
      } else if (!available.has(route)) {
        errors.push(`Missing local reference in ${file}: ${route}`);
      }
    }
  }
  if (errors.length) throw new Error(errors.join("\n"));
  return { files: files.length, published: courses.filter((course) => course.status === "published").map((course) => course.id) };
}

async function assertGenerated(directory) {
  if (!within(root, directory)) throw new Error(`Unsafe generated directory: ${directory}`);
  if ((await readFile(path.join(directory, marker), "utf8")) !== "AI_travel_edu release\n") {
    throw new Error(`Refusing to replace an unmanaged directory: ${directory}`);
  }
}

async function build() {
  const manifest = await loadManifest(root);
  const catalog = await readJson("content/catalog.json");
  const publication = await readJson("config/publication.json");
  if (publication.version !== 1 || !Array.isArray(publication.legacyPublicPaths)) throw new Error("Invalid publication configuration.");
  validateCourseCatalog(catalog, manifest);
  const courses = publicationCourses(catalog, publication);

  const unpublished = courses.filter((course) => course.status !== "published");
  const temp = path.join(root, `.dist-build-${process.pid}`);
  await mkdir(temp, { recursive: false });
  await writeFile(path.join(temp, marker), "AI_travel_edu release\n");
  try {
    const mappings = [
      ...(manifest.shared || []),
      ...manifest.contexts.flatMap((context) => context.files.map((file) => ({
        source: `${context.sourceRoot}/${file.source}`,
        output: file.output
      })))
    ];
    for (const mapping of mappings) {
      safeRelative(mapping.source);
      safeRelative(mapping.output);
      if (unpublished.some((course) => mapping.output === course.route || mapping.output.startsWith(coursePrefix(course)))) continue;
      const output = path.join(temp, mapping.output);
      if (["index.html", "special/index.html"].includes(mapping.output)) {
        const html = await readFile(fromRoot(mapping.source), "utf8");
        await mkdir(path.dirname(output), { recursive: true });
        await writeFile(output, removeUnpublishedCards(html, mapping.output, courses), "utf8");
      } else {
        await copyEntry(fromRoot(mapping.source), output);
      }
    }
    for (const relative of publication.legacyPublicPaths) {
      safeRelative(relative);
      await copyEntry(fromRoot(relative), path.join(temp, relative));
    }
    const result = await validateDirectory(temp, courses);
    let backup = null;
    try {
      await stat(dist);
      await assertGenerated(dist);
      backup = path.join(root, `.dist-backup-${process.pid}`);
      await rename(dist, backup);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    try {
      await rename(temp, dist);
    } catch (error) {
      if (backup) await rename(backup, dist);
      throw error;
    }
    if (backup) {
      await assertGenerated(backup);
      await rm(backup, { recursive: true, force: true });
    }
    return result;
  } catch (error) {
    await assertGenerated(temp);
    await rm(temp, { recursive: true, force: true });
    throw error;
  }
}

try {
  if (command === "deploy") {
    const security = await readJson("config/security-rollout.json");
    if (security.status !== "ready-for-hosting") {
      throw new Error("Hosting deployment paused: verify administrator login and Firestore/Storage rules first (docs/admin-security-rollout.md).");
    }
    await validateProject(root);
    const result = await build();
    console.log(`Release prepared for deployment: ${result.files} files; published courses: ${result.published.join(", ")}.`);
  } else if (command === "prepare") {
    await validateProject(root);
    const result = await build();
    console.log(`Release prepared: ${result.files} files; published courses: ${result.published.join(", ")}.`);
  } else if (command === "build") {
    const result = await build();
    console.log(`Release built: ${result.files} files; published courses: ${result.published.join(", ")}.`);
  } else if (command === "validate") {
    const catalog = await readJson("content/catalog.json");
    const publication = await readJson("config/publication.json");
    await assertGenerated(dist);
    const result = await validateDirectory(dist, publicationCourses(catalog, publication));
    console.log(`Release validated: ${result.files} files; published courses: ${result.published.join(", ")}.`);
  } else {
    throw new Error(`Unknown command: ${command}`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
