export function localRoute(reference, page) {
  if (!reference || /^(?:[a-z]+:|#|\/\/)/i.test(reference)) return null;
  const pathname = new URL(reference, `https://site.test/${page}`).pathname;
  const route = decodeURIComponent(pathname).replace(/^\//, "");
  return route.endsWith("/") || !route ? `${route}index.html` : route;
}

export function coursePrefix(course) {
  return course.route.endsWith("/index.html") ? course.route.slice(0, -"index.html".length) : course.route;
}

export function validateCourseCatalog(catalog, manifest) {
  if (!Array.isArray(catalog.courses)) throw new Error("Catalog courses are missing.");
  const ids = new Set();
  const routes = new Set();
  const contexts = new Set(manifest.contexts.map((item) => item.id));
  const outputs = new Set(manifest.contexts.flatMap((context) => context.files.map((file) => file.output)));
  for (const course of catalog.courses) {
    if (!course.id || ids.has(course.id)) throw new Error(`Duplicate or missing course id: ${course.id}`);
    if (!course.route || course.route.startsWith("/") || course.route.split("/").includes("..") || routes.has(course.route)) {
      throw new Error(`Invalid or duplicate course route: ${course.route}`);
    }
    if (!["draft", "review", "published"].includes(course.status)) throw new Error(`Invalid publication status: ${course.id}`);
    if (!["regular", "special"].includes(course.category)) throw new Error(`Invalid course category: ${course.id}`);
    if (!contexts.has(course.sourceContext)) throw new Error(`Unknown source context: ${course.id}`);
    if (!outputs.has(course.route)) throw new Error(`Course route missing from manifest: ${course.route}`);
    ids.add(course.id);
    routes.add(course.route);
  }
  return catalog.courses;
}

export function validateCourseCards(html, page, courses, requireAll = false) {
  const byId = new Map(courses.map((course) => [course.id, course]));
  const seen = new Set();
  for (const anchor of html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)) {
    const opening = anchor[0].slice(0, anchor[0].indexOf(">") + 1);
    const id = opening.match(/\bdata-course-id\s*=\s*(["'])(.*?)\1/i)?.[2];
    if (!id) continue;
    const course = byId.get(id);
    if (!course) throw new Error(`Unknown course card in ${page}: ${id}`);
    if (seen.has(id)) throw new Error(`Duplicate course card in ${page}: ${id}`);
    const href = opening.match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2];
    if (localRoute(href, page) !== course.route) throw new Error(`Course card route mismatch in ${page}: ${id}`);
    seen.add(id);
  }
  if (requireAll) {
    for (const course of courses) if (!seen.has(course.id)) throw new Error(`Course card missing in ${page}: ${course.id}`);
  }
  return seen;
}
