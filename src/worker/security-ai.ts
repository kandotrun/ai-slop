import { redactLikelySecretsForReview, type HtmlWarning } from "../shared/security";

const DEFAULT_OLLAMA_API_BASE_URL = "https://ollama.com/api";
const DEFAULT_OLLAMA_SECURITY_MODEL = "deepseek-v4-pro:cloud";
const MAX_REVIEW_HTML_CHARS = 80_000;

export interface OllamaSecurityRuntimeEnv {
  OLLAMA_API_KEY?: string;
  OLLAMA_API_BASE_URL?: string;
  OLLAMA_SECURITY_MODEL?: string;
}

export interface AiSecurityReviewFile {
  path: string;
  contentType: string;
  byteLength: number;
}

export interface AiSecurityReviewInput {
  entryPath: string;
  entryHtml: string;
  files: AiSecurityReviewFile[];
  localWarnings: string[];
}

interface OllamaChatResponse {
  message?: {
    content?: unknown;
  };
}

interface SecurityAssessment {
  risk?: unknown;
}

function normalizeBaseUrl(value: string | undefined): string {
  return (value?.trim() || DEFAULT_OLLAMA_API_BASE_URL).replace(/\/+$/, "");
}

function normalizeModel(value: string | undefined): string {
  return value?.trim() || DEFAULT_OLLAMA_SECURITY_MODEL;
}

function clip(value: string, maxChars: number): string {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars)}\n<!-- truncated for security review: ${value.length - maxChars} chars omitted -->`;
}

function jsonFromModelContent(content: string): SecurityAssessment | null {
  const trimmed = content.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed) as SecurityAssessment;
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as SecurityAssessment;
    } catch {
      return null;
    }
  }
}

export function warningFromAssessment(content: string): HtmlWarning[] {
  const assessment = jsonFromModelContent(content);
  const risk = typeof assessment?.risk === "string" ? assessment.risk.toLowerCase() : "";
  if (risk === "critical" || risk === "high") return ["ai_security_high"];
  if (risk === "medium") return ["ai_security_medium"];
  if (risk === "ok" || risk === "low" || risk === "none") return [];
  return ["ai_security_review_unavailable"];
}

function buildReviewPrompt(input: AiSecurityReviewInput): string {
  const files = input.files.slice(0, 80).map((file) => ({ path: file.path, contentType: file.contentType, byteLength: file.byteLength }));
  const redactedHtml = clip(redactLikelySecretsForReview(input.entryHtml), MAX_REVIEW_HTML_CHARS);
  return [
    "Review this user-uploaded static website before it is published as a preview URL.",
    "Return ONLY JSON: {\"risk\":\"ok\"|\"medium\"|\"high\",\"findings\":[{\"category\":string,\"severity\":\"low\"|\"medium\"|\"high\",\"reason\":string}]}",
    "Flag high risk for phishing/credential collection, secret exposure, malware-like JavaScript, hidden redirects, payment or crypto drain, or exfiltration.",
    "Flag medium risk for suspicious external scripts, external form posts, tracking/exfiltration-like endpoints, or risky obfuscated code.",
    "Normal static landing pages, portfolio pages, and benign CDN links are ok.",
    "Obvious secret-looking values were redacted before review; still classify their presence if context is risky.",
    "",
    JSON.stringify({ entryPath: input.entryPath, localWarnings: input.localWarnings, files, entryHtml: redactedHtml })
  ].join("\n");
}

export async function scanUploadWithAiSecurity(env: OllamaSecurityRuntimeEnv, input: AiSecurityReviewInput): Promise<HtmlWarning[]> {
  const apiKey = env.OLLAMA_API_KEY?.trim();
  if (!apiKey) {
    return ["ai_security_review_unavailable"];
  }

  const endpoint = `${normalizeBaseUrl(env.OLLAMA_API_BASE_URL)}/chat`;
  const model = normalizeModel(env.OLLAMA_SECURITY_MODEL);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        stream: false,
        format: "json",
        keep_alive: "0",
        messages: [
          {
            role: "system",
            content:
              "You are a careful static HTML security reviewer. Do not execute content. Respond only with compact JSON and no markdown."
          },
          { role: "user", content: buildReviewPrompt(input) }
        ]
      }),
      signal: AbortSignal.timeout(8_000)
    });

    if (!response.ok) {
      return ["ai_security_review_unavailable"];
    }

    const payload = (await response.json()) as OllamaChatResponse;
    const content = typeof payload.message?.content === "string" ? payload.message.content : "";
    return warningFromAssessment(content);
  } catch {
    return ["ai_security_review_unavailable"];
  }
}
