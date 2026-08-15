import { lstat, readdir, readFile } from "node:fs/promises";
import path from "node:path";

export interface PublishBundleFile {
  path: string;
  content: string;
  encoding: "base64";
  contentType: string;
}

export interface PublishBundle {
  entryPath: string;
  files: PublishBundleFile[];
  totalBytes: number;
}

export interface BuildPublishBundleOptions {
  entryPath?: string;
}

const IGNORED_DIRECTORIES = new Set([".git", "node_modules", ".wrangler"]);
const IGNORED_FILENAMES = new Set([".DS_Store", ".npmrc", ".yarnrc", ".pnpmrc", "wrangler.json", "wrangler.jsonc", "wrangler.toml"]);
const IGNORED_EXTENSIONS = new Set([".pem", ".key", ".crt", ".p12", ".pfx", ".log"]);

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".wasm": "application/wasm"
};

function contentTypeForPath(filePath: string): string {
  return CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

function normalizeBundlePath(value: string): string | null {
  const normalized = value.replaceAll("\\", "/").split("/").filter(Boolean).join("/");
  if (!normalized || normalized.startsWith("/") || normalized.includes("../") || normalized === ".." || normalized.split("/").includes("..")) {
    return null;
  }
  return normalized;
}

function shouldIgnore(relativePath: string): boolean {
  const parts = relativePath.replaceAll("\\", "/").split("/");
  const fileName = parts.at(-1) ?? "";
  if (parts.some((part) => IGNORED_DIRECTORIES.has(part))) return true;
  if (IGNORED_FILENAMES.has(fileName)) return true;
  if (fileName === ".env" || fileName.startsWith(".env.")) return true;
  if (fileName === ".dev.vars" || fileName.startsWith(".dev.vars.")) return true;
  if (IGNORED_EXTENSIONS.has(path.extname(fileName).toLowerCase())) return true;
  return false;
}

async function walkFiles(root: string, current: string, output: string[]): Promise<void> {
  const entries = await readdir(current, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(current, entry.name);
    const relativePath = path.relative(root, absolutePath);
    if (shouldIgnore(relativePath)) continue;
    if (entry.isDirectory()) {
      await walkFiles(root, absolutePath, output);
      continue;
    }
    if (!entry.isFile()) continue;
    output.push(relativePath);
  }
}

async function bundleFile(absolutePath: string, bundlePath: string): Promise<{ file: PublishBundleFile; byteLength: number }> {
  const content = await readFile(absolutePath);
  return {
    file: {
      path: bundlePath,
      content: content.toString("base64"),
      encoding: "base64",
      contentType: contentTypeForPath(bundlePath)
    },
    byteLength: content.byteLength
  };
}

export async function buildPublishBundle(inputPath: string, options: BuildPublishBundleOptions): Promise<PublishBundle> {
  const resolvedInput = path.resolve(inputPath);
  const stat = await lstat(resolvedInput);

  if (stat.isFile()) {
    const ext = path.extname(resolvedInput).toLowerCase();
    if (ext !== ".html" && ext !== ".htm") {
      throw new Error("single_file_must_be_html");
    }
    const bundled = await bundleFile(resolvedInput, "index.html");
    return {
      entryPath: "index.html",
      files: [bundled.file],
      totalBytes: bundled.byteLength
    };
  }

  if (!stat.isDirectory()) {
    throw new Error("input_path_not_supported");
  }

  const rawEntryPath = options.entryPath?.trim() || "index.html";
  const entryPath = normalizeBundlePath(rawEntryPath);
  if (!entryPath) {
    throw new Error("invalid_entry_path");
  }

  const relativePaths: string[] = [];
  await walkFiles(resolvedInput, resolvedInput, relativePaths);
  relativePaths.sort((left, right) => left.localeCompare(right));

  const files: PublishBundleFile[] = [];
  let totalBytes = 0;
  for (const relativePath of relativePaths) {
    const bundlePath = normalizeBundlePath(relativePath);
    if (!bundlePath) continue;
    const bundled = await bundleFile(path.join(resolvedInput, relativePath), bundlePath);
    files.push(bundled.file);
    totalBytes += bundled.byteLength;
  }

  if (!files.some((file) => file.path === entryPath)) {
    throw new Error("entry_file_missing");
  }

  return { entryPath, files, totalBytes };
}
