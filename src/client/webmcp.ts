import { AGENT_MANIFEST_PATH, AGENT_SETUP_ENDPOINT, AGENTS_TXT_PATH, WEBMCP_MANIFEST_PATH, WEBMCP_PAGE_PATH } from "../shared/agent-handoff";

type WebMcpContent = { type: "text"; text: string };
type WebMcpResponse = { content: WebMcpContent[] };
type JsonSchema = { type: "object"; properties: Record<string, unknown>; required?: string[] };
type WebMcpTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: JsonSchema;
  execute: (input: Record<string, unknown>) => WebMcpResponse | Promise<WebMcpResponse>;
};
type ModelContext = {
  registerTool: (tool: WebMcpTool, options?: { signal?: AbortSignal }) => void;
};
type NavigatorWithModelContext = Navigator & { modelContext?: ModelContext };

function textResponse(text: string): WebMcpResponse {
  return { content: [{ type: "text", text }] };
}

function currentOrigin(): string {
  return typeof window === "undefined" ? "https://giga-site.com" : window.location.origin;
}

function absolutePath(path: string): string {
  return new URL(path, `${currentOrigin()}/`).toString();
}

function registerTool(modelContext: ModelContext, tool: WebMcpTool, controller: AbortController): void {
  try {
    modelContext.registerTool(tool, { signal: controller.signal });
  } catch {
    modelContext.registerTool(tool);
  }
}

export function registerGigaSiteWebMcpTools({ agentPrompt }: { agentPrompt: string }): () => void {
  if (typeof navigator === "undefined") return () => undefined;
  const modelContext = (navigator as NavigatorWithModelContext).modelContext;
  if (!modelContext) return () => undefined;

  const controller = new AbortController();
  const tools: WebMcpTool[] = [
    {
      name: "giga_site_summary",
      title: "Summarize ギガサイト便",
      description: "Return a concise summary of ギガサイト便 and the safest next actions for an AI agent.",
      inputSchema: { type: "object", properties: {} },
      execute() {
        return textResponse([
          "ギガサイト便は、AIで作った静的HTML/zipを認証付きURLとして公開・共有するサービスです。",
          "主な使い方: HTML/zipをアップロードし、必要に応じてパスワード・メールOTP・会社ドメイン認証・公開期限を設定します。",
          `Agent guide: ${absolutePath(AGENTS_TXT_PATH)}`,
          `Setup JSON: ${absolutePath(AGENT_SETUP_ENDPOINT)}`,
          `WebMCP manifest: ${absolutePath(WEBMCP_MANIFEST_PATH)}`
        ].join("\n"));
      }
    },
    {
      name: "giga_site_get_agent_setup",
      title: "Get agent setup endpoints",
      description: "Return public agent setup and WebMCP discovery URLs for ギガサイト便.",
      inputSchema: { type: "object", properties: {} },
      execute() {
        return textResponse(JSON.stringify({
          agentsTxt: absolutePath(AGENTS_TXT_PATH),
          setupJson: absolutePath(AGENT_SETUP_ENDPOINT),
          agentManifest: absolutePath(AGENT_MANIFEST_PATH),
          webMcpManifest: absolutePath(WEBMCP_MANIFEST_PATH),
          webMcpPage: absolutePath(WEBMCP_PAGE_PATH)
        }, null, 2));
      }
    },
    {
      name: "giga_site_get_upload_prompt",
      title: "Get upload handoff prompt",
      description: "Return a copy-paste prompt that asks another AI agent to prepare and upload static HTML safely.",
      inputSchema: { type: "object", properties: {} },
      execute() {
        return textResponse(agentPrompt);
      }
    },
    {
      name: "giga_site_focus_upload",
      title: "Focus upload area",
      description: "Focus the landing-page upload area so the user can choose an HTML or zip file. This never auto-submits a file.",
      inputSchema: { type: "object", properties: {} },
      execute() {
        const drop = document.querySelector<HTMLElement>(".lp-drop");
        drop?.focus();
        drop?.scrollIntoView({ block: "center", behavior: "smooth" });
        return textResponse(drop ? "アップロード欄へフォーカスしました。ユーザーがHTMLまたはzipを選択してください。" : "このページにはアップロード欄が見つかりませんでした。");
      }
    }
  ];

  for (const tool of tools) registerTool(modelContext, tool, controller);
  window.dispatchEvent(new CustomEvent("giga-site-webmcp-ready", { detail: { toolCount: tools.length } }));
  return () => controller.abort();
}
