import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

export const fromRoot = (root, relativePath) => path.join(root, ...relativePath.split("/"));
export const readUtf8 = (file) => readFile(file, "utf8");
export const readJson = async (file) => JSON.parse(await readUtf8(file));
export async function writeUtf8(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, value, "utf8");
}
export async function copyTextFile(source, output) {
  await writeUtf8(output, await readUtf8(source));
}
export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}
export function visibleText(html) {
  return html
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}