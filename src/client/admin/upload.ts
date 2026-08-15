import { unzipSync } from "fflate";

export interface ClientUploadFile {
  path: string;
  content: string;
  encoding: "base64";
  contentType: string;
  byteLength: number;
}

export type UploadPayload =
  | { kind: "html"; html: string; byteLength: number }
  | { kind: "files"; entryPath: string; files: ClientUploadFile[]; byteLength: number };

function contentTypeFromPath(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html; charset=utf-8";
  if (lower.endsWith(".css")) return "text/css; charset=utf-8";
  if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "text/javascript; charset=utf-8";
  if (lower.endsWith(".json")) return "application/json; charset=utf-8";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".ico")) return "image/x-icon";
  if (lower.endsWith(".woff2")) return "font/woff2";
  if (lower.endsWith(".woff")) return "font/woff";
  if (lower.endsWith(".ttf")) return "font/ttf";
  return "application/octet-stream";
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function shouldIgnoreZipPath(path: string): boolean {
  return !path || path.startsWith("__MACOSX/") || path === ".DS_Store" || path.endsWith("/.DS_Store");
}

function normalizeZipPaths(paths: string[]): Map<string, string> {
  const entries: Array<{ rawPath: string; cleanPath: string }> = [];
  const contentPaths: string[] = [];
  const firstSegments: string[] = [];
  for (const rawPath of paths) {
    const cleanPath = rawPath.replaceAll("\\", "/").replace(/^\/+/, "");
    if (!cleanPath) continue;
    entries.push({ rawPath, cleanPath });
    if (shouldIgnoreZipPath(cleanPath)) continue;
    contentPaths.push(cleanPath);
    const [firstSegment] = cleanPath.split("/");
    if (firstSegment) firstSegments.push(firstSegment);
  }
  const commonRoot = firstSegments.length > 0 && firstSegments.every((segment) => segment === firstSegments[0]) ? firstSegments[0] : null;
  const hasRootIndex = contentPaths.some((path) => path.toLowerCase() === "index.html");
  const map = new Map<string, string>();
  for (const { rawPath, cleanPath } of entries) {
    const normalized = commonRoot && !hasRootIndex && cleanPath.startsWith(`${commonRoot}/`) ? cleanPath.slice(commonRoot.length + 1) : cleanPath;
    map.set(rawPath, normalized);
  }
  return map;
}

export async function prepareFile(file: File): Promise<UploadPayload> {
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".zip")) {
    const unzipped = unzipSync(new Uint8Array(await file.arrayBuffer()));
    const pathMap = normalizeZipPaths(Object.keys(unzipped));
    const files: ClientUploadFile[] = [];
    for (const [rawPath, bytes] of Object.entries(unzipped)) {
      const path = pathMap.get(rawPath) ?? rawPath;
      if (!path || path.endsWith("/") || shouldIgnoreZipPath(path)) {
        continue;
      }
      files.push({
        path,
        content: bytesToBase64(bytes),
        encoding: "base64",
        contentType: contentTypeFromPath(path),
        byteLength: bytes.byteLength
      });
    }
    const entryPath = files.find((item) => item.path.toLowerCase() === "index.html")?.path;
    if (!entryPath) {
      throw new Error("zip_index_html_required");
    }
    return { kind: "files", entryPath, files, byteLength: files.reduce((sum, item) => sum + item.byteLength, 0) };
  }
  const html = await file.text();
  return { kind: "html", html, byteLength: new TextEncoder().encode(html).byteLength };
}

export function expiresAtFromDays(days: string): string | undefined {
  if (days === "none") return undefined;
  const date = new Date();
  date.setDate(date.getDate() + Number.parseInt(days, 10));
  return date.toISOString();
}
