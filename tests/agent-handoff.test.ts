import { describe, expect, it } from "vitest";
import { AGENTS_TXT_PATH, WEBMCP_MANIFEST_PATH, buildAgentSetupManifest, buildAgentSetupPrompt, buildAgentsTxt, buildOneTimeUploadPrompt, buildWebMcpManifest } from "../src/shared/agent-handoff";

describe("agent handoff helpers", () => {
  it("builds copy prompts that ask the user for the subdomain, with public setup URLs", () => {
    const prompt = buildAgentSetupPrompt("https://giga-site.com/");

    expect(prompt).toContain("希望する公開サブドメイン");
    expect(prompt).not.toContain("URLが分かったら");
    expect(prompt).toContain("https://giga-site.com/agents.txt");
    expect(prompt).toContain("https://giga-site.com/api/agent/setup");
    expect(prompt).toContain("APIキー");
  });

  it("builds a machine-readable manifest without trailing slash duplication", () => {
    const manifest = buildAgentSetupManifest("https://giga-site.com/");

    expect(manifest.origin).toBe("https://giga-site.com");
    expect(manifest.docs.agent).toBe(`https://giga-site.com${AGENTS_TXT_PATH}`);
    expect(manifest.docs.webmcp).toBe(`https://giga-site.com${WEBMCP_MANIFEST_PATH}`);
    expect(manifest.cli.package).toBe("@giga-site/cli");
    expect(manifest.cli.bin).toBe("giga");
    expect(manifest.cli.publishCommand).toContain("npx @giga-site/cli publish ./dist --json");
    expect(manifest.cli.tokenEnv).toBe("GIGA_UPLOAD_TOKEN");
    expect(manifest.api.createSite).toBe("https://giga-site.com/api/sites");
    expect(manifest.api.createUploadToken).toBe("https://giga-site.com/api/agent/upload-tokens");
    expect(manifest.api.oneTimeUpload).toBe("https://giga-site.com/api/agent/uploads/{tokenId}");
    expect(manifest.api.oneTimeUploadStatus).toBe("https://giga-site.com/api/agent/uploads/{tokenId}");
    expect(manifest.agentWorkflow.oneTimeUpload.method).toBe("POST");
    expect(manifest.agentWorkflow.oneTimeUpload.headers.Authorization).toBe("Bearer <uploadToken.token>");
    expect(manifest.agentWorkflow.oneTimeUpload.successFields).toContain("site.previewUrl");
    expect(manifest.agentWorkflow.oneTimeUpload.commonErrors.map((item) => item.error)).toContain("upload_token_already_used");
    expect(manifest.currentCapabilities).toContain("upload_static_file_bundle");
    expect(manifest.currentCapabilities).toContain("cli_publish");
    expect(manifest.currentCapabilities).toContain("one_time_upload_token");
    expect(manifest.currentCapabilities).toContain("one_time_upload_status");
    expect(manifest.currentCapabilities).toContain("browser_webmcp_tools");
    expect(manifest.plannedCapabilities).toContain("remote_http_mcp_server");
  });

  it("builds a WebMCP manifest with browser-safe public tools", () => {
    const manifest = buildWebMcpManifest("https://giga-site.com/");

    expect(manifest.origin).toBe("https://giga-site.com");
    expect(manifest.browserApi).toBe("navigator.modelContext");
    expect(manifest.discovery.webmcp).toBe(`https://giga-site.com${WEBMCP_MANIFEST_PATH}`);
    expect(manifest.tools.map((tool) => tool.name)).toEqual([
      "giga_site_summary",
      "giga_site_get_agent_setup",
      "giga_site_get_upload_prompt",
      "giga_site_focus_upload"
    ]);
    for (const tool of manifest.tools) {
      expect(tool.inputSchema.type).toBe("object");
    }
    expect(manifest.safety.join("\n")).toContain("never bypass user confirmation");
  });

  it("builds token handoff prompts with the exact one-time upload contract", () => {
    const token = ["gut", "11111111-1111-4111-8111-111111111111", "exampleUploadKey"].join("_");
    const prompt = buildOneTimeUploadPrompt({
      id: "11111111-1111-4111-8111-111111111111",
      token,
      uploadUrl: "https://giga-site.com/api/agent/uploads/11111111-1111-4111-8111-111111111111",
      statusUrl: "https://giga-site.com/api/agent/uploads/11111111-1111-4111-8111-111111111111",
      expiresAt: "2026-07-19T00:00:00.000Z",
      maxBytes: 10_485_760,
      maxFiles: 200,
      siteConfig: {
        title: "AI upload",
        slug: "ai-upload",
        authMode: "password",
        allowedEmailDomains: [],
        expiresAt: "2026-07-19T00:00:00.000Z",
        indexingEnabled: false
      }
    });

    expect(prompt).toContain("POST https://giga-site.com/api/agent/uploads/11111111-1111-4111-8111-111111111111");
    expect(prompt).toContain("GET https://giga-site.com/api/agent/uploads/11111111-1111-4111-8111-111111111111");
    expect(prompt).toContain(`Authorization: Bearer ${token}`);
    expect(prompt).toContain(`GIGA_UPLOAD_TOKEN=${token} npx @giga-site/cli publish ./dist --json`);
    expect(prompt).toContain("site.previewUrl");
    expect(prompt).toContain("upload_token_already_used");
    expect(prompt).toContain("Cookieやログイン情報は不要");
  });

  it("builds an agents.txt guide with API examples and safety rules", () => {
    const text = buildAgentsTxt("https://giga-site.com");

    expect(text).toContain("# ギガサイト便 / AI Agent Guide");
    expect(text).toContain("POST /api/sites");
    expect(text).toContain("POST /api/agent/uploads/{tokenId}");
    expect(text).toContain("GET /api/agent/uploads/{tokenId}");
    expect(text).toContain("Authorization: Bearer");
    expect(text).toContain("npx @giga-site/cli publish ./dist --json");
    expect(text).toContain("upload_token_already_used");
    expect(text).toContain("index.html");
    expect(text).toContain("MCP endpoint");
    expect(text).toContain("/llms.txt");
    expect(text).toContain("/articles/html-share/index.md");
    expect(text).toContain("WebMCP manifest");
    expect(text).toContain(WEBMCP_MANIFEST_PATH);
  });

  it("uses non-reusable placeholders for password-protected create-site examples", () => {
    const text = buildAgentsTxt("https://giga-site.com");

    expect(text).toContain("<generate-unique-random-password>");
    expect(text).toContain("Do not reuse placeholder values");
    expect(text).not.toContain("change-me-please");
    expect(text).not.toContain("optional-slug");
  });
});
