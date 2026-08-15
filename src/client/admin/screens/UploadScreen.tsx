import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import type { AuthMode, SiteSummary } from "../../../shared/types";
import { AGENT_SETUP_ENDPOINT, AGENTS_TXT_PATH, buildAgentSetupPrompt, buildOneTimeUploadPrompt } from "../../../shared/agent-handoff";
import { DEMO_HTML_DOWNLOAD_PATH, DEMO_HTML_FILE_NAME } from "../../../shared/demo-site";
import { FREE_PLAN_PUBLISH_DAYS } from "../../../shared/plans";
import type { ToastController } from "../Toast";
import { api, ApiClientError, type AgentUploadToken } from "../api";
import { expiresAtFromDays, prepareFile, type UploadPayload } from "../upload";
import { trackUploadStarted } from "../../measurement";
import { authBadgeStyle, formatBytes, formatDateTime, randomSubdomain, rootHostFromOrigin, slugify } from "../format";
import { warningDetails, warningSummary } from "../warnings";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { Input, Label, Select, Switch, Textarea } from "../../ui/controls";
import { Alert } from "../../ui/Alert";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  DiceIcon,
  FileCodeIcon,
  GlobeIcon,
  LockIcon,
  MailIcon,
  SendIcon,
  ShieldCheckIcon,
  UploadCloudIcon
} from "../../ui/icons";

interface UploadScreenProps {
  publicOrigin: string;
  canUsePermanentExpiry: boolean;
  notify: ToastController;
  onPublished: (site: SiteSummary) => void;
  onCancel: () => void;
  setStatus: (message: string) => void;
  onError: (raw: string) => void;
}

type Step = 1 | 2 | 3;

type SlugCheckState = "empty" | "checking" | "available" | "current" | "unavailable" | "invalid" | "error";

interface SlugCheck {
  state: SlugCheckState;
  message: string;
}

const EMPTY_SLUG_CHECK: SlugCheck = { state: "empty", message: "未指定なら自動生成します。入力すると空き状況を確認します。" };

function slugCheckFromReason(available: boolean, reason: string | null): SlugCheck {
  if (available) {
    return { state: reason === "current_slug" ? "current" : "available", message: "このサブドメインは利用できます" };
  }
  if (reason === "slug_already_taken") {
    return { state: "unavailable", message: "このサブドメインは既に使われています" };
  }
  if (reason === "reserved_slug") {
    return { state: "invalid", message: "このサブドメインは予約済みです" };
  }
  return { state: "invalid", message: "半角英数字とハイフンのみ利用できます" };
}

function slugCheckClass(state: SlugCheckState): string {
  if (state === "available" || state === "current") return "is-ok";
  if (state === "checking" || state === "empty") return "is-muted";
  return "is-error";
}

function acceptDropzoneDrag(event: DragEvent<HTMLElement>) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = "copy";
}

function handleDropzoneDragOver(event: DragEvent<HTMLElement>) {
  acceptDropzoneDrag(event);
}

function securityWarningsFromError(error: unknown): string[] {
  if (!(error instanceof ApiClientError) || error.message !== "security_review_warning") return [];
  const warnings = error.details?.warnings;
  return Array.isArray(warnings) ? warnings.filter((warning): warning is string => typeof warning === "string") : [];
}

const STEPS: { num: Step; label: string }[] = [
  { num: 1, label: "ファイル" },
  { num: 2, label: "公開設定" },
  { num: 3, label: "確認" }
];

const AUTH_OPTIONS: { mode: AuthMode; title: string; description: string; icon: typeof GlobeIcon; recommended?: boolean }[] = [
  { mode: "random", title: "認証なし", description: "URL を知っている人なら誰でも閲覧できます。", icon: GlobeIcon },
  { mode: "password", title: "共有パスワード", description: "1 つのパスワードを知っている人だけが閲覧できます。", icon: LockIcon },
  { mode: "email_otp", title: "メール認証（OTP）", description: "許可したメールアドレスに 6 桁コードを送って認証します。", icon: MailIcon },
  { mode: "email_domain", title: "会社ドメイン認証", description: "指定ドメインのメールを受け取れる人だけが閲覧できます。", icon: ShieldCheckIcon, recommended: true }
];

const EXPIRY_LABELS: Record<string, string> = { "7": "7 日間", "30": "30 日間", "90": "90 日間", none: "無期限" };
const AUTH_LABELS: Record<AuthMode, string> = {
  random: "認証なし",
  password: "共有パスワード",
  email_otp: "メール認証（OTP）",
  email_domain: "会社ドメイン認証"
};

export function UploadScreen({ publicOrigin, canUsePermanentExpiry, notify, onPublished, onCancel, setStatus, onError }: UploadScreenProps) {
  const [step, setStep] = useState<Step>(1);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugCheck, setSlugCheck] = useState<SlugCheck>(EMPTY_SLUG_CHECK);
  const [authMode, setAuthMode] = useState<AuthMode>("email_domain");
  const [password, setPassword] = useState("");
  const [domains, setDomains] = useState("example.co.jp");
  const [allowedEmails, setAllowedEmails] = useState("");
  const [expiresDays, setExpiresDays] = useState(() => (canUsePermanentExpiry ? "30" : String(FREE_PLAN_PUBLISH_DAYS)));
  const [noindex, setNoindex] = useState(true);
  const [fileName, setFileName] = useState("");
  const [payload, setPayload] = useState<UploadPayload>({ kind: "html", html: "", byteLength: 0 });
  const [showHtmlEditor, setShowHtmlEditor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [securityOverrideWarnings, setSecurityOverrideWarnings] = useState<string[]>([]);
  const dropDragDepthRef = useRef(0);

  const [showHandoff, setShowHandoff] = useState(false);
  const [agentCopyStatus, setAgentCopyStatus] = useState("AI依頼文をコピー");
  const [agentTokenCopyStatus, setAgentTokenCopyStatus] = useState("Token付き依頼文をコピー");
  const [generatedAgentToken, setGeneratedAgentToken] = useState<AgentUploadToken | null>(null);
  const [isCreatingAgentToken, setIsCreatingAgentToken] = useState(false);

  const indexingEnabled = authMode === "random" && !noindex;
  const agentPrompt = useMemo(() => buildAgentSetupPrompt(publicOrigin), [publicOrigin]);
  const agentTokenPrompt = useMemo(() => (generatedAgentToken ? buildOneTimeUploadPrompt(generatedAgentToken) : ""), [generatedAgentToken]);

  const hasValidAuth = useMemo(() => {
    if (authMode === "password") return password.trim().length >= 6;
    if (authMode === "email_domain") return domains.trim().length > 0;
    if (authMode === "email_otp") return allowedEmails.trim().length > 0;
    return true;
  }, [allowedEmails, authMode, domains, password]);

  const hasFile = payload.byteLength > 0;
  const slugReady = !slug.trim() || slugCheck.state === "available";
  const settingsValid = title.trim().length > 0 && hasValidAuth && slugReady;
  const previewRootHost = rootHostFromOrigin(publicOrigin);
  const previewHost = `${slug.trim() || "（自動生成）"}.${previewRootHost}`;

  useEffect(() => {
    if (!canUsePermanentExpiry && expiresDays !== String(FREE_PLAN_PUBLISH_DAYS)) {
      setExpiresDays(String(FREE_PLAN_PUBLISH_DAYS));
    }
  }, [canUsePermanentExpiry, expiresDays]);

  useEffect(() => {
    const candidate = slug.trim();
    if (!candidate) {
      setSlugCheck(EMPTY_SLUG_CHECK);
      return;
    }
    let cancelled = false;
    setSlugCheck({ state: "checking", message: "サブドメインの空き状況を確認中..." });
    const timer = window.setTimeout(() => {
      void api.slugAvailability(candidate)
        .then((result) => {
          if (!cancelled) setSlugCheck(slugCheckFromReason(result.available, result.reason));
        })
        .catch(() => {
          if (!cancelled) setSlugCheck({ state: "error", message: "空き状況を確認できませんでした" });
        });
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [slug]);

  async function handleFile(file: File | null) {
    if (!file) return;
    setStatus("ファイルを解析中...");
    trackUploadStarted("admin_new_upload", file);
    const toastId = notify.loading("ファイルを解析中...");
    try {
      const prepared = await prepareFile(file);
      setPayload(prepared);
      setSecurityOverrideWarnings([]);
      setFileName(file.name);
      setTitle(file.name.replace(/\.(html?|zip)$/i, ""));
      setSlug(slugify(file.name));
      setShowHtmlEditor(false);
      const message =
        prepared.kind === "files"
          ? `zipを展開しました: ${prepared.files.length} files / ${formatBytes(prepared.byteLength)}`
          : "HTMLを読み込みました";
      setStatus(message);
      notify.success(message, toastId);
    } catch (error) {
      notify.dismiss(toastId);
      onError(error instanceof Error ? error.message : "file_parse_failed");
    }
  }

  function handleDropzoneDragEnter(event: DragEvent<HTMLElement>) {
    acceptDropzoneDrag(event);
    dropDragDepthRef.current += 1;
    setIsDraggingFile(true);
  }

  function handleDropzoneDragLeave(event: DragEvent<HTMLElement>) {
    acceptDropzoneDrag(event);
    dropDragDepthRef.current = Math.max(0, dropDragDepthRef.current - 1);
    if (dropDragDepthRef.current === 0) {
      setIsDraggingFile(false);
    }
  }

  function handleDropzoneDrop(event: DragEvent<HTMLElement>) {
    acceptDropzoneDrag(event);
    dropDragDepthRef.current = 0;
    setIsDraggingFile(false);
    void handleFile(event.dataTransfer.files?.[0] ?? null);
  }

  function authFields() {
    return {
      password: authMode === "password" ? password : undefined,
      allowedEmailDomains: authMode === "email_domain" ? domains : undefined,
      allowedEmails: authMode === "email_otp" ? allowedEmails : undefined
    };
  }

  async function handlePublish(securityOverrideAccepted = false) {
    if (!settingsValid || isSubmitting) return;
    setIsSubmitting(true);
    setStatus("公開URLを作成中...");
    setSecurityOverrideWarnings([]);
    const toastId = notify.loading("公開URLを作成中...");
    try {
      const revisionBody = payload.kind === "html" ? { html: payload.html } : { files: payload.files, entryPath: payload.entryPath };
      const published = await api.createSiteWithRevision({
        title,
        slug: slug.trim() || undefined,
        authMode,
        ...authFields(),
        expiresAt: expiresAtFromDays(expiresDays),
        indexingEnabled,
        securityOverrideAccepted,
        ...revisionBody
      });
      const message =
        published.revision.warnings.length > 0
          ? `公開しました（警告: ${warningSummary(published.revision.warnings)}）`
          : "公開しました";
      setStatus(message);
      notify.success(message, toastId);
      onPublished(published.site);
    } catch (error) {
      notify.dismiss(toastId);
      const warnings = securityWarningsFromError(error);
      if (warnings.length > 0) {
        setSecurityOverrideWarnings(warnings);
        const message = `セキュリティチェックで警告が見つかりました: ${warningSummary(warnings)}`;
        setStatus(message);
        notify.error(message);
      } else {
        onError(error instanceof Error ? error.message : "upload_failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyAgentPrompt() {
    try {
      await navigator.clipboard.writeText(agentPrompt);
      setAgentCopyStatus("コピーしました");
    } catch {
      setAgentCopyStatus("コピー失敗");
    }
    window.setTimeout(() => setAgentCopyStatus("AI依頼文をコピー"), 1800);
  }

  async function createAgentUploadToken() {
    if (isCreatingAgentToken || !title.trim() || !hasValidAuth) return;
    setIsCreatingAgentToken(true);
    setStatus("一回限りアップロードTokenを発行中...");
    const toastId = notify.loading("一回限りアップロードTokenを発行中...");
    try {
      const data = await api.createAgentUploadToken({
        label: `${title || "AI upload"} handoff`,
        title,
        slug: slug.trim() || undefined,
        authMode,
        ...authFields(),
        expiresAt: expiresAtFromDays(expiresDays),
        indexingEnabled,
        tokenTtlSeconds: 3600
      });
      setGeneratedAgentToken(data.uploadToken);
      const message = "一回限りTokenを発行しました。下の文面をAIへ渡せます。1時間・1回限りです。";
      setStatus(message);
      notify.success(message, toastId);
    } catch (error) {
      notify.dismiss(toastId);
      onError(error instanceof Error ? error.message : "agent_token_failed");
    } finally {
      setIsCreatingAgentToken(false);
    }
  }

  async function copyAgentTokenPrompt() {
    if (!agentTokenPrompt) return;
    try {
      await navigator.clipboard.writeText(agentTokenPrompt);
      setAgentTokenCopyStatus("コピーしました");
    } catch {
      setAgentTokenCopyStatus("コピー失敗");
    }
    window.setTimeout(() => setAgentTokenCopyStatus("Token付き依頼文をコピー"), 1800);
  }

  function authReviewValue(): string {
    if (authMode === "email_domain") return domains.trim() ? `@${domains.trim()}` : AUTH_LABELS.email_domain;
    if (authMode === "email_otp") return `${allowedEmails.split(/[\s,]+/).filter(Boolean).length} 件のメール`;
    return AUTH_LABELS[authMode];
  }

  return (
    <div className="gs-content" style={{ maxWidth: 760 }}>
      <button className="gs-back" onClick={onCancel}>
        <ArrowLeftIcon size={15} />
        サイト一覧
      </button>
      <h1 className="gs-h1">新規アップロード</h1>
      <p className="gs-sub" style={{ marginBottom: 24 }}>
        AI で作った HTML / zip を、認証付き URL で公開します。
      </p>

      <div className="gs-stepper">
        {STEPS.map((s, index) => {
          const state = step === s.num ? "is-active" : step > s.num ? "is-done" : "";
          return (
            <div key={s.num} style={{ display: "contents" }}>
              {index > 0 ? <span className={`gs-step-line${step > s.num ? " is-done" : ""}`} /> : null}
              <div className={`gs-step ${state}`}>
                <span className="gs-step-num">{step > s.num ? <CheckIcon size={14} /> : s.num}</span>
                <span className="gs-step-label">{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {step === 1 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label
            className={`gs-dropzone${isDraggingFile ? " is-drag-active" : ""}`}
            onDragEnter={handleDropzoneDragEnter}
            onDragOver={handleDropzoneDragOver}
            onDragLeave={handleDropzoneDragLeave}
            onDrop={handleDropzoneDrop}
          >
            <input
              type="file"
              accept=".html,.htm,.zip,text/html,application/zip"
              onChange={(event) => void handleFile(event.currentTarget.files?.[0] ?? null)}
            />
            <span className="gs-dropzone-icon">
              <UploadCloudIcon size={26} />
            </span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>ファイルをドラッグ＆ドロップ</div>
              <div className="gs-muted" style={{ fontSize: 13, marginTop: 4 }}>
                単一の HTML、または zip（<span className="gs-mono">index.html</span> 必須・最大 10MB）
              </div>
            </div>
            <span className="ds-btn ds-btn--default ds-btn--outline" style={{ marginTop: 4 }}>
              ファイルを選択
            </span>
          </label>

          <div className="ds-card gs-demo-download">
            <span className="gs-site-icon">
              <FileCodeIcon size={17} />
            </span>
            <div className="gs-demo-download__body">
              <strong>HTMLが手元にない場合</strong>
              <span>デモ用HTMLをダウンロードして、そのまま上の枠にアップロードできます。</span>
            </div>
            <a className="ds-btn ds-btn--default ds-btn--outline" href={DEMO_HTML_DOWNLOAD_PATH} download={DEMO_HTML_FILE_NAME}>
              デモHTMLをダウンロード
            </a>
          </div>

          {hasFile ? (
            <div className="ds-card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <span className="gs-site-icon">
                <FileCodeIcon size={17} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{fileName || "アップロードされたHTML"}</div>
                <div className="gs-muted gs-mono" style={{ fontSize: 12, marginTop: 2 }}>
                  {payload.kind === "files"
                    ? `${payload.files.length} files · ${formatBytes(payload.byteLength)} · entry: ${payload.entryPath}`
                    : `HTML · ${formatBytes(payload.byteLength)}`}
                </div>
              </div>
              {payload.kind === "html" ? (
                <Button variant="ghost" size="sm" onClick={() => setShowHtmlEditor((value) => !value)}>
                  {showHtmlEditor ? "閉じる" : "HTMLを編集"}
                </Button>
              ) : null}
            </div>
          ) : null}

          {hasFile && payload.kind === "html" && showHtmlEditor ? (
            <Textarea
              value={payload.html}
              rows={10}
              aria-label="HTML 本文"
              onChange={(event) => {
                const html = event.target.value;
                setSecurityOverrideWarnings([]);
                setPayload({ kind: "html", html, byteLength: new TextEncoder().encode(html).byteLength });
              }}
            />
          ) : null}

          <Alert icon={<ShieldCheckIcon size={16} style={{ color: "var(--ac)" }} />} title="公開前に自動でセキュリティチェック">
            API キーらしき文字列・外部フォーム・不要なファイル（.php など）に加え、AI が危険な HTML を解析して警告します。
          </Alert>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => setStep(2)} disabled={!hasFile}>
              次へ <ArrowRightIcon size={16} />
            </Button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="gs-field">
            <Label>タイトル</Label>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="社内共有用のLP など" />
          </div>

          <div className="gs-field">
            <Label>公開 URL</Label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                value={slug}
                placeholder="auto-generated"
                onChange={(event) => setSlug(event.target.value)}
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 0 }}
              />
              <span className="gs-input-suffix">.{previewRootHost}</span>
              <button
                type="button"
                className="ds-btn ds-btn--outline ds-btn--icon"
                onClick={() => setSlug(randomSubdomain())}
                title="ランダムなURLを生成"
                aria-label="ランダムなURLを生成"
                style={{ marginLeft: 8, flexShrink: 0 }}
              >
                <DiceIcon size={18} />
              </button>
            </div>
            <span className={`gs-field-hint gs-slug-check ${slugCheckClass(slugCheck.state)}`}>{slugCheck.message}</span>
            <span className="gs-field-hint">サイコロ 🎲 でかわいいランダムURLを生成できます。</span>
          </div>

          <div className="gs-field">
            <Label>誰が見られるか（認証方式）</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 2 }}>
              {AUTH_OPTIONS.map((option) => {
                const OptionIcon = option.icon;
                const selected = authMode === option.mode;
                return (
                  <button key={option.mode} type="button" className={`gs-authopt${selected ? " is-selected" : ""}`} onClick={() => setAuthMode(option.mode)}>
                    <span className="gs-authopt-icon" style={option.recommended ? { color: "var(--ac)" } : undefined}>
                      <OptionIcon size={17} />
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                        {option.title}
                        {option.recommended ? (
                          <span style={{ fontSize: 12, fontWeight: 500, padding: "1px 7px", borderRadius: 999, background: "color-mix(in oklab, var(--ac) 14%, var(--background))", color: "var(--ac)" }}>
                            おすすめ
                          </span>
                        ) : null}
                      </span>
                      <span className="gs-muted" style={{ fontSize: 13, marginTop: 2, display: "block" }}>
                        {option.description}
                      </span>
                    </span>
                    {selected ? <CheckIcon size={18} style={{ color: "var(--ac)", flexShrink: 0 }} /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          {authMode === "password" ? (
            <div className="gs-field">
              <Label>共有パスワード</Label>
              <Input value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} placeholder="6文字以上" style={{ fontFamily: "var(--font-mono)" }} />
            </div>
          ) : null}
          {authMode === "email_domain" ? (
            <div className="gs-field">
              <Label>許可する会社ドメイン</Label>
              <Input value={domains} onChange={(event) => setDomains(event.target.value)} placeholder="example.co.jp" style={{ fontFamily: "var(--font-mono)" }} />
              <span className="gs-field-hint">このドメインのメールアドレスを受け取れる人だけが閲覧できます。</span>
            </div>
          ) : null}
          {authMode === "email_otp" ? (
            <div className="gs-field">
              <Label>招待するメールアドレス</Label>
              <Input value={allowedEmails} onChange={(event) => setAllowedEmails(event.target.value)} placeholder="tanaka@example.com, sato@example.com" style={{ fontFamily: "var(--font-mono)" }} />
              <span className="gs-field-hint">入力したアドレスに 6 桁コードを送って認証します。</span>
            </div>
          ) : null}

          <div className="gs-field">
            <Label>公開期限</Label>
            <Select value={expiresDays} onChange={(event) => setExpiresDays(event.target.value)}>
              <option value="7">7 日間</option>
              {canUsePermanentExpiry ? (
                <>
                  <option value="30">30 日間</option>
                  <option value="90">90 日間</option>
                  <option value="none">無期限</option>
                </>
              ) : null}
            </Select>
            <span className="gs-field-hint">
              {canUsePermanentExpiry ? "有料プランまたは1サイト購入枠では無期限公開も選べます。" : "無料プランでは公開期限は7日間のみです。"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>検索エンジンに表示しない</div>
              <div className="gs-muted" style={{ fontSize: 13, marginTop: 2 }}>
                {authMode === "random" ? "OFF にすると検索結果に出る可能性があります。" : "認証付きサイトは常に noindex です。"}
              </div>
            </div>
            <Switch checked={authMode !== "random" ? true : noindex} disabled={authMode !== "random"} onChange={(event) => setNoindex(event.currentTarget.checked)} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeftIcon size={16} /> 戻る
            </Button>
            <Button onClick={() => setStep(3)} disabled={!settingsValid}>
              次へ <ArrowRightIcon size={16} />
            </Button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="ds-card">
            <div className="ds-card__head">
              <h2 style={{ fontSize: 15 }}>この内容で公開します</h2>
            </div>
            <div style={{ padding: "6px 20px 14px" }}>
              <div className="gs-kv">
                <span className="gs-kv-key">ファイル</span>
                <span className="gs-kv-val gs-mono">{fileName}</span>
              </div>
              <div className="gs-kv">
                <span className="gs-kv-key">タイトル</span>
                <span className="gs-kv-val">{title}</span>
              </div>
              <div className="gs-kv">
                <span className="gs-kv-key">公開 URL</span>
                <span className="gs-kv-val gs-mono">{previewHost}</span>
              </div>
              <div className="gs-kv">
                <span className="gs-kv-key">認証方式</span>
                <Badge {...authBadgeStyle(authMode)}>{authReviewValue()}</Badge>
              </div>
              <div className="gs-kv">
                <span className="gs-kv-key">公開期限</span>
                <span className="gs-kv-val">{EXPIRY_LABELS[expiresDays]}</span>
              </div>
              <div className="gs-kv">
                <span className="gs-kv-key">検索エンジン</span>
                <span className="gs-kv-val">{indexingEnabled ? "表示する" : "表示しない（noindex）"}</span>
              </div>
            </div>
          </div>

          <Alert icon={<ShieldCheckIcon size={16} style={{ color: "var(--ac)" }} />} title="公開前に自動でセキュリティチェックを行います">
            問題が見つかった場合は、いったん公開を止めて警告内容を表示します。内容を確認したうえで、必要なら無視して公開できます。
          </Alert>

          {securityOverrideWarnings.length > 0 ? (
            <Alert icon={<ShieldCheckIcon size={16} />} title="セキュリティチェックで警告が見つかりました" variant="destructive">
              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  {warningSummary(securityOverrideWarnings)} が検出されました。APIキーらしき文字列、外部送信フォーム、危険度の高いHTMLなどは、公開前に修正するのが安全です。
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {warningDetails(securityOverrideWarnings).map((warning) => (
                    <div key={warning.code} style={{ display: "grid", gap: 3, padding: "9px 10px", border: "1px solid color-mix(in oklab, var(--destructive) 25%, var(--border))", borderRadius: 10, background: "rgba(255, 255, 255, 0.55)" }}>
                      <strong style={{ fontSize: 13 }}>{warning.label}</strong>
                      <span style={{ fontSize: 12 }}>
                        検出箇所: <span className="gs-mono">{warning.where}</span>
                      </span>
                      <span style={{ fontSize: 12 }}>{warning.description}</span>
                      <span style={{ fontSize: 12 }}>{warning.action}</span>
                    </div>
                  ))}
                </div>
                <div>
                  内容を確認し、それでも共有が必要な場合だけ「警告を理解して公開する」を押してください。
                </div>
              </div>
            </Alert>
          ) : null}

          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <Button variant="ghost" onClick={() => setStep(2)}>
              <ArrowLeftIcon size={16} /> 戻る
            </Button>
            {securityOverrideWarnings.length > 0 ? (
              <Button variant="destructive" onClick={() => void handlePublish(true)} disabled={!settingsValid || isSubmitting}>
                <SendIcon size={16} />
                {isSubmitting ? "公開中..." : "警告を理解して公開する"}
              </Button>
            ) : (
              <Button onClick={() => void handlePublish()} disabled={!settingsValid || isSubmitting}>
                <SendIcon size={16} />
                {isSubmitting ? "公開中..." : "公開する"}
              </Button>
            )}
          </div>
        </div>
      ) : null}

      <div className="ds-card" style={{ marginTop: 28, overflow: "hidden" }}>
        <button
          className="ds-card__head"
          onClick={() => setShowHandoff((value) => !value)}
          style={{ width: "100%", textAlign: "left", border: 0, background: "transparent", cursor: "pointer", borderBottom: showHandoff ? "1px solid var(--border)" : 0 }}
        >
          <h2 style={{ fontSize: 15 }}>詳しい人向け: リンクを渡して AI に任せる {showHandoff ? "▾" : "▸"}</h2>
        </button>
        {showHandoff ? (
          <div className="ds-card__body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p className="gs-muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
              HTMLのダウンロードやzip化が難しい相手には、この依頼文を Claude / ChatGPT / Cursor へ貼ってもらいます。AI向け手順は{" "}
              <a href={AGENTS_TXT_PATH} target="_blank" rel="noreferrer" style={{ color: "var(--ac)" }}>
                agents.txt
              </a>{" "}
              と{" "}
              <a href={AGENT_SETUP_ENDPOINT} target="_blank" rel="noreferrer" style={{ color: "var(--ac)" }}>
                setup JSON
              </a>{" "}
              で公開しています。
            </p>
            <Textarea value={agentPrompt} readOnly rows={6} aria-label="AIに依頼するプロンプト" />
            <Button type="button" variant="outline" onClick={() => void copyAgentPrompt()}>
              {agentCopyStatus}
            </Button>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <strong style={{ fontSize: 14 }}>一回限りアップロードToken</strong>
              <p className="gs-muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
                現在のタイトル・認証方式・公開期限を固定した、1時間 / 1回限りの AI アップロード権限を発行します。ログイン情報は渡しません。
              </p>
              <Button type="button" variant="outline" onClick={() => void createAgentUploadToken()} disabled={isCreatingAgentToken || !title.trim() || !hasValidAuth}>
                {isCreatingAgentToken ? "Token発行中..." : "Tokenを発行"}
              </Button>
              {generatedAgentToken ? (
                <>
                  <Textarea value={agentTokenPrompt} readOnly rows={8} aria-label="一回限りToken付きAI依頼文" />
                  <div className="gs-muted gs-mono" style={{ display: "flex", gap: 14, fontSize: 12 }}>
                    <span>expires: {formatDateTime(generatedAgentToken.expiresAt)}</span>
                    <span>
                      {formatBytes(generatedAgentToken.maxBytes)} / {generatedAgentToken.maxFiles} files
                    </span>
                  </div>
                  <Button type="button" variant="outline" onClick={() => void copyAgentTokenPrompt()}>
                    {agentTokenCopyStatus}
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
