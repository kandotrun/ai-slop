import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildPublishBundle } from "../packages/cli/src/bundle";
import { parsePublishArgs, runGigaCli } from "../packages/cli/src/command";

async function tempDir(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "giga-cli-"));
}

async function createFixture(files: Record<string, string | Uint8Array>): Promise<string> {
  const root = await tempDir();
  await Promise.all(Object.entries(files).map(async ([relativePath, content]) => {
    const filePath = path.join(root, relativePath);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, content);
  }));
  return root;
}

describe("giga CLI publish", () => {
  const roots: string[] = [];

  afterEach(async () => {
    vi.unstubAllGlobals();
    await Promise.all(roots.map((root) => rm(root, { recursive: true, force: true })));
    roots.length = 0;
  });

  it("bundles static directories into the one-time agent upload JSON contract", async () => {
    const root = await createFixture({
      "index.html": "<!doctype html><h1>Hello</h1>",
      "assets/app.js": "console.log('ok')",
      "assets/style.css": "body{color:red}",
      ".env": "SECRET=do-not-upload",
      "node_modules/pkg/index.js": "ignored"
    });
    roots.push(root);

    const bundle = await buildPublishBundle(root, { entryPath: "index.html" });

    expect(bundle.entryPath).toBe("index.html");
    expect(bundle.files.map((file) => file.path).sort()).toEqual(["assets/app.js", "assets/style.css", "index.html"]);
    expect(bundle.files.find((file) => file.path === "index.html")?.content).toBe(Buffer.from("<!doctype html><h1>Hello</h1>").toString("base64"));
    expect(bundle.files.find((file) => file.path === "assets/app.js")?.contentType).toBe("text/javascript; charset=utf-8");
    expect(bundle.totalBytes).toBe(Buffer.byteLength("<!doctype html><h1>Hello</h1>") + Buffer.byteLength("console.log('ok')") + Buffer.byteLength("body{color:red}"));
  });

  it("bundles a single html file as index.html", async () => {
    const root = await createFixture({ "landing.html": "<!doctype html><p>Landing</p>" });
    roots.push(root);

    const bundle = await buildPublishBundle(path.join(root, "landing.html"), {});

    expect(bundle.entryPath).toBe("index.html");
    expect(bundle.files).toEqual([
      {
        path: "index.html",
        content: Buffer.from("<!doctype html><p>Landing</p>").toString("base64"),
        encoding: "base64",
        contentType: "text/html; charset=utf-8"
      }
    ]);
  });

  it("rejects non-html single files instead of uploading arbitrary files as index.html", async () => {
    const root = await createFixture({ "README.md": "# Not HTML" });
    roots.push(root);

    await expect(buildPublishBundle(path.join(root, "README.md"), {})).rejects.toThrow("single_file_must_be_html");
  });

  it("excludes package and Cloudflare secret/config dotfiles from directory bundles", async () => {
    const root = await createFixture({
      "index.html": "<!doctype html><h1>Safe</h1>",
      ".npmrc": "registry=https://registry.npmjs.org/",
      ".dev.vars": "LOCAL_ONLY_PLACEHOLDER=example",
      ".wrangler/state.json": "placeholder",
      "wrangler.jsonc": "{\"account_id\":\"internal\"}",
      ".well-known/ai-plugin.json": "{}"
    });
    roots.push(root);

    const bundle = await buildPublishBundle(root, {});

    expect(bundle.files.map((file) => file.path).sort()).toEqual([".well-known/ai-plugin.json", "index.html"]);
  });

  it("refuses a directory without index.html unless --entry is specified", async () => {
    const root = await createFixture({ "public/home.html": "<h1>Home</h1>" });
    roots.push(root);

    await expect(buildPublishBundle(root, {})).rejects.toThrow("entry_file_missing");
    await expect(buildPublishBundle(root, { entryPath: "public/home.html" })).resolves.toMatchObject({ entryPath: "public/home.html" });
  });

  it("parses token, host, entry, json, and dry-run publish arguments", () => {
    const token = ["gut", "abc", "exampleUploadKey"].join("_");

    expect(parsePublishArgs(["publish", "./dist", "--token", token, "--host", "https://example.com/", "--entry", "public/index.html", "--json", "--dry-run"])).toEqual({
      ok: true,
      command: "publish",
      path: "./dist",
      token,
      host: "https://example.com",
      entryPath: "public/index.html",
      json: true,
      dryRun: true
    });
  });

  it("posts the bundle to /api/agent/uploads/{tokenId} without printing the token", async () => {
    const root = await createFixture({ "index.html": "<!doctype html><h1>Ship</h1>" });
    roots.push(root);
    const fetchCalls: Array<{ url: string; init: RequestInit }> = [];
    vi.stubGlobal("fetch", async (url: string | URL | Request, init?: RequestInit) => {
      fetchCalls.push({ url: String(url), init: init ?? {} });
      return new Response(JSON.stringify({
        site: { id: "site_1", slug: "demo", previewUrl: "https://demo.giga-site.com", authMode: "password" },
        revision: { id: "rev_1", entryPath: "index.html", fileCount: 1, byteLength: 27, warnings: [] }
      }), { status: 201, headers: { "Content-Type": "application/json" } });
    });
    const stdout: string[] = [];
    const stderr: string[] = [];
    const token = ["gut", "abc123", "exampleUploadKey"].join("_");

    const exitCode = await runGigaCli(["publish", root, "--token", token, "--host", "https://giga-site.test", "--json"], {
      stdout: (line) => stdout.push(line),
      stderr: (line) => stderr.push(line)
    });

    expect(exitCode).toBe(0);
    expect(fetchCalls).toHaveLength(1);
    expect(fetchCalls[0]?.url).toBe("https://giga-site.test/api/agent/uploads/abc123");
    expect(fetchCalls[0]?.init.method).toBe("POST");
    expect(fetchCalls[0]?.init.headers).toMatchObject({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" });
    const requestBody = JSON.parse(String(fetchCalls[0]?.init.body));
    expect(requestBody).toMatchObject({ entryPath: "index.html", files: [{ path: "index.html", encoding: "base64", contentType: "text/html; charset=utf-8" }] });
    expect(stdout.join("\n")).toContain("https://demo.giga-site.com");
    expect(stdout.join("\n")).not.toContain(token);
    expect(stderr.join("\n")).not.toContain(token);
  });

  it("returns usage error when no token is supplied", async () => {
    const root = await createFixture({ "index.html": "<h1>No token</h1>" });
    roots.push(root);
    const stderr: string[] = [];

    const exitCode = await runGigaCli(["publish", root], { stdout: () => undefined, stderr: (line) => stderr.push(line) });

    expect(exitCode).toBe(1);
    expect(stderr.join("\n")).toContain("GIGA_UPLOAD_TOKEN");
  });

  it("redacts bearer tokens from API error output", async () => {
    const root = await createFixture({ "index.html": "<h1>Error</h1>" });
    roots.push(root);
    const token = ["gut", "abc123", "exampleUploadKey"].join("_");
    vi.stubGlobal("fetch", async () => new Response(JSON.stringify({ error: "upload_token_invalid", details: { token } }), { status: 401, headers: { "Content-Type": "application/json" } }));
    const stderr: string[] = [];

    const exitCode = await runGigaCli(["publish", root, "--token", token], { stdout: () => undefined, stderr: (line) => stderr.push(line) });

    expect(exitCode).toBe(2);
    expect(stderr.join("\n")).toContain("upload_token_invalid");
    expect(stderr.join("\n")).not.toContain(token);
  });

  it("dry-run summarizes the bundle without printing file contents or token secrets", async () => {
    const html = "<!doctype html><h1>Secret-ish local content</h1>";
    const root = await createFixture({ "index.html": html });
    roots.push(root);
    const stdout: string[] = [];
    const token = ["gut", "abc123", "exampleUploadKey"].join("_");

    const exitCode = await runGigaCli(["publish", root, "--token", token, "--dry-run", "--json"], { stdout: (line) => stdout.push(line), stderr: () => undefined });

    expect(exitCode).toBe(0);
    const output = stdout.join("\n");
    expect(output).toContain('"fileCount": 1');
    expect(output).not.toContain(Buffer.from(html).toString("base64"));
    expect(output).not.toContain("Secret-ish local content");
    expect(output).not.toContain(token);
  });
});
