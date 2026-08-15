import { readFile, writeFile } from "node:fs/promises";

const [path] = process.argv.slice(2);
if (!path) throw new Error("Usage: node strip-trailing-whitespace.mjs <path>");

const source = await readFile(path, "utf8");
const normalized = source.replace(/[\t ]+$/gm, "");
if (source !== normalized) await writeFile(path, normalized);
