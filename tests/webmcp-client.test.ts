import { afterEach, describe, expect, it, vi } from "vitest";
import { registerGigaSiteWebMcpTools } from "../src/client/webmcp";

describe("browser WebMCP registration", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("registers public browser tools without executing upload actions", async () => {
    const registered: Array<{ name: string; execute: (input: Record<string, unknown>) => unknown }> = [];
    const registerTool = vi.fn((tool) => registered.push(tool));
    const dispatchEvent = vi.fn();
    class FakeCustomEvent {
      type: string;
      detail: unknown;
      constructor(type: string, init: { detail?: unknown } = {}) {
        this.type = type;
        this.detail = init.detail;
      }
    }

    vi.stubGlobal("navigator", { modelContext: { registerTool } });
    vi.stubGlobal("window", { location: { origin: "https://giga-site.com" }, dispatchEvent });
    vi.stubGlobal("CustomEvent", FakeCustomEvent);

    const cleanup = registerGigaSiteWebMcpTools({ agentPrompt: "UPLOAD PROMPT" });

    expect(registerTool).toHaveBeenCalledTimes(4);
    expect(registered.map((tool) => tool.name)).toEqual([
      "giga_site_summary",
      "giga_site_get_agent_setup",
      "giga_site_get_upload_prompt",
      "giga_site_focus_upload"
    ]);
    expect(await Promise.resolve(registered[2].execute({}))).toEqual({ content: [{ type: "text", text: "UPLOAD PROMPT" }] });
    expect(dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: "giga-site-webmcp-ready" }));
    expect(cleanup).toBeTypeOf("function");
  });
});
