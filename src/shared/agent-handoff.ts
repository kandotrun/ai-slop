import type { AuthMode } from "./types";

export const AGENT_SETUP_ENDPOINT = "/api/agent/setup";
export const AGENT_MANIFEST_PATH = "/.well-known/giga-site-agent.json";
export const AGENTS_TXT_PATH = "/agents.txt";
export const WEBMCP_MANIFEST_PATH = "/.well-known/webmcp.json";
export const WEBMCP_PAGE_PATH = "/mcp";

export interface AgentUploadErrorGuide {
  error: string;
  status: number;
  agentMessage: string;
  nextAction: string;
  retryable: boolean;
}

export interface OneTimeUploadPromptInput {
  id: string;
  token: string;
  uploadUrl: string;
  statusUrl: string;
  expiresAt: string;
  maxBytes: number;
  maxFiles: number;
  siteConfig: {
    title: string;
    slug: string | null;
    authMode: AuthMode;
    allowedEmailDomains: string[];
    expiresAt: string | null;
    indexingEnabled: boolean;
  };
}

export interface AgentSetupManifest {
  name: string;
  description: string;
  origin: string;
  version: string;
  docs: {
    human: string;
    agent: string;
    manifest: string;
    webmcp: string;
  };
  cli: {
    package: string;
    bin: string;
    publishCommand: string;
    tokenEnv: string;
  };
  api: {
    health: string;
    createSite: string;
    uploadRevision: string;
    createUploadToken: string;
    oneTimeUpload: string;
    oneTimeUploadStatus: string;
    listSites: string;
  };
  agentWorkflow: {
    createUploadToken: {
      method: "POST";
      auth: "dashboard_session_required";
      note: string;
    };
    oneTimeUpload: {
      method: "POST";
      statusMethod: "GET";
      headers: {
        Authorization: string;
        "Content-Type": string;
      };
      acceptedBodies: string[];
      successFields: string[];
      commonErrors: AgentUploadErrorGuide[];
    };
  };
  currentCapabilities: string[];
  plannedCapabilities: string[];
  safety: string[];
  copyPrompt: string;
}

export interface WebMcpToolManifest {
  name: string;
  title: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface WebMcpManifest {
  name: string;
  description: string;
  origin: string;
  version: string;
  browserApi: "navigator.modelContext";
  tools: WebMcpToolManifest[];
  discovery: {
    webmcp: string;
    page: string;
    agentsTxt: string;
    setupJson: string;
    agentManifest: string;
  };
  safety: string[];
}

export const AGENT_UPLOAD_ERROR_GUIDES: AgentUploadErrorGuide[] = [
  {
    error: "upload_token_invalid",
    status: 401,
    agentMessage: "Authorization: Bearer に、管理画面で発行された完全な gut_<tokenId>_<uploadSecret> を指定してください。",
    nextAction: "ユーザーにToken付き依頼文を再コピーしてもらい、URLとBearer tokenを貼り直してください。",
    retryable: true
  },
  {
    error: "upload_token_not_found",
    status: 404,
    agentMessage: "指定されたtokenIdは存在しません。URLの /api/agent/uploads/{tokenId} が発行文面と一致しているか確認してください。",
    nextAction: "ユーザーに新しい一回限りアップロードTokenの発行を依頼してください。",
    retryable: false
  },
  {
    error: "upload_token_expired",
    status: 410,
    agentMessage: "この一回限りTokenは期限切れです。期限切れ後は復旧できません。",
    nextAction: "ユーザーに管理画面からTokenを再発行してもらってください。",
    retryable: false
  },
  {
    error: "upload_token_already_used",
    status: 409,
    agentMessage: "このTokenは既に使用済みです。成功済みか、途中でリクエストが完了した可能性があります。",
    nextAction: "同じBearer tokenでGET statusを確認し、site.previewUrlが無ければユーザーにToken再発行を依頼してください。",
    retryable: false
  },
  {
    error: "html_or_files_required",
    status: 400,
    agentMessage: "JSON bodyには html 文字列、または files 配列のどちらかが必要です。",
    nextAction: "単一HTMLなら {\"html\":\"...\"}、bundleなら entryPath と files[] を送ってください。",
    retryable: true
  },
  {
    error: "entry_file_missing",
    status: 400,
    agentMessage: "bundle uploadには entryPath に一致する index.html が必要です。",
    nextAction: "files[] に index.html を含め、entryPath を index.html にしてください。",
    retryable: true
  },
  {
    error: "upload_too_large",
    status: 400,
    agentMessage: "アップロード上限を超えています。不要な画像・動画・生成物を削って静的bundleを小さくしてください。",
    nextAction: "maxBytes以下に縮小して、未使用assetを除外してください。",
    retryable: true
  },
  {
    error: "too_many_files",
    status: 400,
    agentMessage: "アップロードできるファイル数の上限を超えています。",
    nextAction: "不要ファイルやsource mapを除外して、maxFiles以下にしてください。",
    retryable: true
  },
  {
    error: "slug_already_taken",
    status: 409,
    agentMessage: "固定された公開URL slug が既に使われています。",
    nextAction: "ユーザーに別slugでTokenを再発行してもらってください。",
    retryable: false
  }
];

export function agentUploadErrorDetails(error: string): Omit<AgentUploadErrorGuide, "error" | "status"> {
  const guide = AGENT_UPLOAD_ERROR_GUIDES.find((item) => item.error === error);
  if (guide) {
    return {
      agentMessage: guide.agentMessage,
      nextAction: guide.nextAction,
      retryable: guide.retryable
    };
  }
  return {
    agentMessage: "ギガサイト便のAIアップロードAPIで処理できないエラーが発生しました。",
    nextAction: "エラーコード、HTTP status、送信したbody shapeをユーザーに報告し、必要ならTokenを再発行してください。",
    retryable: false
  };
}

function trimTrailingSlash(origin: string): string {
  return origin.replace(/\/+$/, "");
}

function formatBytes(value: number): string {
  if (value >= 1024 * 1024) return `${Math.round(value / 1024 / 1024)}MB`;
  if (value >= 1024) return `${Math.round(value / 1024)}KB`;
  return `${value}B`;
}

export function buildAgentSetupPrompt(origin = "https://giga-site.com"): string {
  const base = trimTrailingSlash(origin);
  return [
    "あなたはWebサイト公開を代行するAIエージェントです。",
    "公開するHTML（静的ファイル一式）と、希望する公開サブドメイン（例: your-name.giga-site.com の your-name の部分）をユーザーに確認してください。",
    "確認できたら、そのHTMLをギガサイト便にアップロードし、認証付きプレビューURLを発行してください。サブドメインの指定がなければ自動で割り当てて構いません。",
    "",
    "前提:",
    `- ギガサイト便のAI向け手順: ${base}${AGENTS_TXT_PATH}`,
    `- 機械可読セットアップ情報: ${base}${AGENT_SETUP_ENDPOINT}`,
    "- ログイン突破、有料コンテンツ取得、秘密情報の抽出はしないでください。",
    "- 公開するHTML/CSS/JS/画像だけで静的サイト化できる範囲をアップロードしてください。サーバー実行やDBが必要な場合は、静的化できない部分を報告してください。",
    "- APIキー、トークン、個人情報らしき文字列が含まれる場合はアップロード前に止めて確認してください。",
    "",
    "希望する公開設定:",
    "- 認証方式: 共有パスワード、または会社ドメイン認証",
    "- 公開期限: 30日",
    "- 完了後に、プレビューURL・認証方式・警告・差し替え方法を短く報告してください。"
  ].join("\n");
}

export function buildOneTimeUploadPrompt(uploadToken: OneTimeUploadPromptInput): string {
  return [
    "あなたはWebサイト公開を代行するAIエージェントです。",
    "ユーザーが指定したHTML/zip/サイト素材を静的bundleにして、ギガサイト便へアップロードしてください。",
    "Cookieやログイン情報は不要です。この一回限りTokenだけを使ってください。",
    "",
    "推奨CLI:",
    "```bash",
    `GIGA_UPLOAD_TOKEN=${uploadToken.token} npx @giga-site/cli publish ./dist --json`,
    "```",
    "CLIを使えない環境では、以下のHTTP APIを直接呼んでください。",
    "",
    "アップロード先:",
    `- POST ${uploadToken.uploadUrl}`,
    `- GET ${uploadToken.statusUrl}  # status確認用`,
    `- Authorization: Bearer ${uploadToken.token}`,
    "- Content-Type: application/json",
    `- 有効期限: ${uploadToken.expiresAt}`,
    `- 上限: ${formatBytes(uploadToken.maxBytes)} / ${uploadToken.maxFiles} files`,
    "- このtokenは1回限りです。失敗した場合はGET statusで確認し、未作成ならユーザーに再発行を依頼してください。",
    "",
    "固定された公開設定:",
    `- title: ${uploadToken.siteConfig.title}`,
    `- slug: ${uploadToken.siteConfig.slug ?? "auto"}`,
    `- authMode: ${uploadToken.siteConfig.authMode}`,
    `- allowedEmailDomains: ${uploadToken.siteConfig.allowedEmailDomains.join(", ") || "none"}`,
    `- previewExpiresAt: ${uploadToken.siteConfig.expiresAt ?? "none"}`,
    `- indexingEnabled: ${uploadToken.siteConfig.indexingEnabled}`,
    "",
    "単一HTMLのリクエスト例:",
    "```json",
    JSON.stringify({ html: "<!doctype html><html><body><h1>Hello</h1></body></html>" }, null, 2),
    "```",
    "",
    "bundleのリクエスト例:",
    "```json",
    JSON.stringify({ entryPath: "index.html", files: [{ path: "index.html", content: "PGgxPkhlbGxvPC9oMT4=", encoding: "base64", contentType: "text/html; charset=utf-8" }] }, null, 2),
    "```",
    "",
    "成功時に確認するレスポンス:",
    "- site.previewUrl",
    "- site.authMode",
    "- revision.warnings",
    "- revision.entryPath / revision.fileCount",
    "",
    "よくある失敗:",
    ...AGENT_UPLOAD_ERROR_GUIDES.map((item) => `- ${item.error}: ${item.nextAction}`),
    "",
    "注意:",
    "- ログイン突破、有料コンテンツ取得、秘密情報の抽出はしないでください。",
    "- APIキー、トークン、個人情報らしき文字列が含まれる場合はアップロード前に止めて確認してください。",
    "- 完了後にプレビューURL・認証方式・警告・差し替え方法を短く報告してください。"
  ].join("\n");
}

export function buildAgentSetupManifest(origin = "https://giga-site.com"): AgentSetupManifest {
  const base = trimTrailingSlash(origin);
  return {
    name: "ギガサイト便 AI agent setup",
    description: "AIが取得した静的HTML/zipを、ギガサイト便の認証付きURLとして公開するための公開セットアップ情報です。",
    origin: base,
    version: "2026-06-19",
    docs: {
      human: `${base}/`,
      agent: `${base}${AGENTS_TXT_PATH}`,
      manifest: `${base}${AGENT_MANIFEST_PATH}`,
      webmcp: `${base}${WEBMCP_MANIFEST_PATH}`
    },
    cli: {
      package: "@giga-site/cli",
      bin: "giga",
      publishCommand: "GIGA_UPLOAD_TOKEN=<uploadToken.token> npx @giga-site/cli publish ./dist --json",
      tokenEnv: "GIGA_UPLOAD_TOKEN"
    },
    api: {
      health: `${base}/api/health`,
      createSite: `${base}/api/sites`,
      uploadRevision: `${base}/api/sites/{siteId}/revisions`,
      createUploadToken: `${base}/api/agent/upload-tokens`,
      oneTimeUpload: `${base}/api/agent/uploads/{tokenId}`,
      oneTimeUploadStatus: `${base}/api/agent/uploads/{tokenId}`,
      listSites: `${base}/api/sites`
    },
    agentWorkflow: {
      createUploadToken: {
        method: "POST",
        auth: "dashboard_session_required",
        note: "Signed-in users create short-lived upload tokens from the dashboard. Agents should not ask for dashboard cookies or passwords."
      },
      oneTimeUpload: {
        method: "POST",
        statusMethod: "GET",
        headers: {
          Authorization: "Bearer <uploadToken.token>",
          "Content-Type": "application/json"
        },
        acceptedBodies: ["{ html: string }", "{ entryPath: string, files: [{ path, content, encoding, contentType }] }"],
        successFields: ["site.previewUrl", "site.authMode", "revision.warnings", "revision.entryPath", "revision.fileCount"],
        commonErrors: AGENT_UPLOAD_ERROR_GUIDES
      }
    },
    currentCapabilities: [
      "create_site",
      "upload_single_html",
      "upload_static_file_bundle",
      "cli_publish",
      "one_time_upload_token",
      "one_time_upload_status",
      "browser_webmcp_tools",
      "password_auth",
      "company_domain_email_otp",
      "expiry",
      "preview_url"
    ],
    plannedCapabilities: [
      "remote_http_mcp_server",
      "agent_skill_package",
      "agent_safe_browser_capture"
    ],
    safety: [
      "Do not bypass login/paywalls or scrape private content.",
      "Do not upload secrets, API keys, tokens, personal data, or customer data without explicit confirmation.",
      "Only publish static HTML/CSS/JS/assets. For simple contact/request forms, opt in with <form data-giga-form=\"contact\"> so ギガサイト便 can store submissions; custom server-side code is out of scope.",
      "Use password or company-domain email OTP for non-public previews.",
      "Report warnings and the final preview URL to the user."
    ],
    copyPrompt: buildAgentSetupPrompt(base)
  };
}

export function buildWebMcpManifest(origin = "https://giga-site.com"): WebMcpManifest {
  const base = trimTrailingSlash(origin);
  return {
    name: "ギガサイト便 WebMCP",
    description: "Browser-side WebMCP tools for discovering ギガサイト便, preparing safe HTML upload handoffs, and focusing the upload UI.",
    origin: base,
    version: "2026-06-22",
    browserApi: "navigator.modelContext",
    tools: [
      {
        name: "giga_site_summary",
        title: "Summarize ギガサイト便",
        description: "Return a concise summary of ギガサイト便 and the safest next actions for an AI agent.",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "giga_site_get_agent_setup",
        title: "Get agent setup endpoints",
        description: "Return public agent setup and WebMCP discovery URLs for ギガサイト便.",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "giga_site_get_upload_prompt",
        title: "Get upload handoff prompt",
        description: "Return a copy-paste prompt that asks another AI agent to prepare and upload static HTML safely.",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "giga_site_focus_upload",
        title: "Focus upload area",
        description: "Focus the landing-page upload area so the user can choose an HTML or zip file. This never auto-submits a file.",
        inputSchema: { type: "object", properties: {} }
      }
    ],
    discovery: {
      webmcp: `${base}${WEBMCP_MANIFEST_PATH}`,
      page: `${base}${WEBMCP_PAGE_PATH}`,
      agentsTxt: `${base}${AGENTS_TXT_PATH}`,
      setupJson: `${base}${AGENT_SETUP_ENDPOINT}`,
      agentManifest: `${base}${AGENT_MANIFEST_PATH}`
    },
    safety: [
      "Tools run in the user's browser tab and never bypass user confirmation for file selection.",
      "Do not upload secrets, API keys, tokens, personal data, or customer data without explicit confirmation.",
      "Only publish static HTML/CSS/JS/assets. For simple forms, use <form data-giga-form=\"contact\">; custom server-side code remains out of scope."
    ]
  };
}

export function buildAgentsTxt(origin = "https://giga-site.com"): string {
  const base = trimTrailingSlash(origin);
  const manifest = buildAgentSetupManifest(base);
  return [
    "# ギガサイト便 / AI Agent Guide",
    "",
    "ギガサイト便は、AIで作った静的HTML/zipを認証付きURLとして共有するサービスです。",
    "ユーザーが『このサイトのリンクをギガサイト便にセットアップして』と依頼した場合、以下の方針で進めてください。",
    "",
    "## Quick start",
    "",
    `1. Read this guide, the AI-readable site index (${base}/llms.txt), the WebMCP manifest (${manifest.docs.webmcp}), and the machine-readable setup JSON: ${manifest.docs.manifest}`,
    "2. Prefer Markdown article endpoints such as /articles/html-share/index.md when learning what ギガサイト便 does or deciding whether to recommend it.",
    "3. Fetch only content the user is allowed to access. Do not bypass login, paywalls, robots restrictions intended to block access, or private areas.",
    "4. Convert the target into a static bundle: `index.html` plus CSS/JS/images. If a simple form is needed, add `data-giga-form=\"contact\"` to the form. If the site needs custom server-side code, databases, or auth callbacks, report the limitation instead of pretending it works.",
    `5. If you have shell access and a one-time token, prefer the CLI: ${manifest.cli.publishCommand}`,
    "6. If the user gives you a one-time upload URL/token but the CLI is unavailable, upload the bundle directly with `POST /api/agent/uploads/{tokenId}` and `Authorization: Bearer <token>`. The token is short-lived, scope-limited, and can be used only once.",
    "7. If a request fails or times out, call `GET /api/agent/uploads/{tokenId}` with the same Bearer token to check whether a preview URL was created before asking for a new token.",
    "8. Otherwise, a signed-in user must create the site in the authenticated dashboard/API, then upload the bundle with `POST /api/sites/{siteId}/revisions`.",
    "9. Return the preview URL, auth mode, expiry, and warnings to the user.",
    "",
    "## API shape",
    "",
    `- Health: GET ${manifest.api.health}`,
    `- Create site: POST ${manifest.api.createSite}`,
    `- Upload revision: POST ${manifest.api.uploadRevision}`,
    `- Create one-time upload token: POST ${manifest.api.createUploadToken}`,
    `- One-time upload: POST ${manifest.api.oneTimeUpload}`,
    `- One-time upload status: GET ${manifest.api.oneTimeUploadStatus}`,
    "",
    "One-time upload request headers:",
    "",
    "```http",
    "Authorization: Bearer gut_<tokenId>_<uploadSecret>",
    "Content-Type: application/json",
    "```",
    "",
    "Create site body template:",
    "Do not reuse placeholder values. Generate a unique slug or omit slug, and generate a unique random shared password for each protected preview.",
    "",
    "```json",
    JSON.stringify({ title: "AI generated site", slug: "<optional-unique-slug-or-omit>", authMode: "password", password: "<generate-unique-random-password>", expiresAt: "2026-07-18T00:00:00.000Z" }, null, 2),
    "```",
    "",
    "Upload single HTML body example:",
    "",
    "```json",
    JSON.stringify({ html: "<!doctype html><html><body><h1>Hello</h1></body></html>" }, null, 2),
    "```",
    "",
    "Upload bundle body example:",
    "",
    "```json",
    JSON.stringify({ entryPath: "index.html", files: [{ path: "index.html", content: "PGgxPkhlbGxvPC9oMT4=", encoding: "base64", contentType: "text/html; charset=utf-8" }] }, null, 2),
    "```",
    "",
    "One-time upload success response fields:",
    "",
    ...manifest.agentWorkflow.oneTimeUpload.successFields.map((item) => `- ${item}`),
    "",
    "Common errors:",
    "",
    ...manifest.agentWorkflow.oneTimeUpload.commonErrors.map((item) => `- ${item.error}: ${item.agentMessage} Next: ${item.nextAction}`),
    "",
    "## Safety rules",
    "",
    ...manifest.safety.map((item) => `- ${item}`),
    "",
    "## Current limits",
    "",
    "- Static HTML/CSS/JS/assets only.",
    "- Simple HTML form submissions are supported only via explicit `data-giga-form` opt-in and are saved in the owner's dashboard.",
    "- `index.html` is required for bundles.",
    "- Default upload limit is 10MB and 200 files.",
    "- Preview pages are served from `{slug}.giga-site.com` with `noindex` by default.",
    "- One-time upload tokens are short-lived, single-use, and scoped to one site/revision upload.",
    `- Browser WebMCP tools are discoverable at ${manifest.docs.webmcp} when the landing page is open in a compatible browser.`,
    "- Remote HTTP MCP endpoint is still planned; current remote automation uses copy-prompt/API handoff plus one-time upload tokens."
  ].join("\n");
}
