import { useEffect, useRef, useState } from "react";
import type { AccessEventSummary, AuthMode, FormSubmissionDetail, FormSubmissionSummary, RevisionHistoryItem, SiteSummary } from "../../../shared/types";
import type { DetailTab } from "../routes";
import { api, ApiClientError, type RevisionBody } from "../api";
import { prepareFile, type UploadPayload } from "../upload";
import { trackUploadStarted } from "../../measurement";
import { authBadgeStyle, authLabel, expiryEndLabel, expiryLabel, formatBytes, formatDate, formatDateTime, formatNumber, formatRelative, previewDisplayHost, statusDot, statusLabel, toolLabel } from "../format";
import { warningDetails, warningSummary } from "../warnings";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Input, Label, Switch } from "../../ui/controls";
import { Alert } from "../../ui/Alert";
import { Dialog } from "../../ui/Dialog";
import { BrandName } from "../../BrandName";
import { ReviewCommentsPanel } from "./ReviewCommentsPanel";
import { PlanUpgradeNotice } from "./PlanUpgradeNotice";
import { FORM_SUBMISSIONS_MIN_PLAN_LABEL, REVISION_HISTORY_MIN_PLAN_LABEL } from "../../../shared/plans";
import {
  ArrowLeftIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  GlobeIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
  RefreshIcon,
  ShieldCheckIcon,
  TrashIcon
} from "../../ui/icons";

interface DetailScreenProps {
  site: SiteSummary;
  events: AccessEventSummary[];
  tab: DetailTab;
  onTab: (tab: DetailTab) => void;
  onBack: () => void;
  onChanged: () => void;
  onDeleted: () => void;
  setStatus: (message: string) => void;
  onError: (raw: string) => void;
}

const AUTH_OPTIONS: { mode: AuthMode; title: string; description: string; icon: typeof GlobeIcon; recommended?: boolean }[] = [
  { mode: "random", title: "認証なし", description: "URL を知っている人なら誰でも閲覧可。パスワードやメール確認は不要。", icon: GlobeIcon },
  { mode: "password", title: "共有パスワード", description: "1 つのパスワードを知っている人だけが閲覧可。手軽な共有向け。", icon: LockIcon },
  { mode: "email_otp", title: "メール認証（OTP）", description: "許可したメールアドレスに 6 桁コードを送信して認証。", icon: MailIcon },
  { mode: "email_domain", title: "会社ドメイン認証", description: "指定ドメインのメールを受け取れる人だけが閲覧可。", icon: ShieldCheckIcon, recommended: true }
];

const EVENT_LABELS: Record<string, string> = {
  auth_success: "認証成功",
  auth_failed: "認証失敗",
  auth_required: "認証要求",
  auth_code_sent: "コード送信",
  view: "閲覧"
};

function eventDot(eventType: string): string {
  if (eventType === "auth_failed") return "var(--destructive)";
  if (eventType === "auth_success") return "var(--success)";
  return "var(--ac)";
}

type SlugCheckState = "checking" | "available" | "current" | "unavailable" | "invalid" | "error";

interface SlugCheck {
  state: SlugCheckState;
  message: string;
}

function slugCheckFromReason(available: boolean, reason: string | null): SlugCheck {
  if (available) {
    return { state: reason === "current_slug" ? "current" : "available", message: reason === "current_slug" ? "現在のサブドメインです" : "このサブドメインは利用できます" };
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
  if (state === "checking") return "is-muted";
  return "is-error";
}

function previewRootHost(site: SiteSummary): string {
  const host = previewDisplayHost(site.previewUrl);
  return host.startsWith(`${site.slug}.`) ? host.slice(site.slug.length + 1) : host;
}

function revisionBodyFromPayload(payload: UploadPayload): RevisionBody {
  return payload.kind === "html" ? { html: payload.html } : { files: payload.files, entryPath: payload.entryPath };
}

function withSecurityOverride(body: RevisionBody): RevisionBody {
  return "html" in body ? { ...body, securityOverrideAccepted: true } : { ...body, securityOverrideAccepted: true };
}

function securityWarningsFromError(error: unknown): string[] {
  if (!(error instanceof ApiClientError) || error.message !== "security_review_warning") return [];
  const warnings = error.details?.warnings;
  return Array.isArray(warnings) ? warnings.filter((warning): warning is string => typeof warning === "string") : [];
}

export function DetailScreen({ site, events, tab, onTab, onBack, onChanged, onDeleted, setStatus, onError }: DetailScreenProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const [authMode, setAuthMode] = useState<AuthMode>(site.authMode);
  const [password, setPassword] = useState("");
  const [domains, setDomains] = useState(site.allowedEmailDomains.join(", "));
  const [allowedEmails, setAllowedEmails] = useState(site.allowedEmails.join(", "));
  const [noindex, setNoindex] = useState(!site.indexingEnabled);
  const [hideBranding, setHideBranding] = useState(site.hideBranding);
  const [urlSlug, setUrlSlug] = useState(site.slug);
  const [slugCheck, setSlugCheck] = useState<SlugCheck>({ state: "current", message: "現在のサブドメインです" });
  const [savingSlug, setSavingSlug] = useState(false);
  const [savingAuth, setSavingAuth] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [isRenewingExpiry, setIsRenewingExpiry] = useState(false);
  const [replaceSecurityWarnings, setReplaceSecurityWarnings] = useState<string[]>([]);
  const [pendingReplaceBody, setPendingReplaceBody] = useState<RevisionBody | null>(null);
  const [pendingReplaceFileName, setPendingReplaceFileName] = useState("");
  const [revisions, setRevisions] = useState<RevisionHistoryItem[]>([]);
  const [revisionsLoading, setRevisionsLoading] = useState(false);
  const [revisionsLocked, setRevisionsLocked] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState<RevisionHistoryItem | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [previewingRevisionId, setPreviewingRevisionId] = useState<string | null>(null);
  const [formsState, setFormsState] = useState<{ siteId: string; submissions: FormSubmissionSummary[] | null }>({ siteId: site.id, submissions: null });
  const [formsLocked, setFormsLocked] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmissionDetail | null>(null);
  const [loadingSubmissionId, setLoadingSubmissionId] = useState<string | null>(null);
  const expiryEnd = expiryEndLabel(site);
  const canRenewExpiry = Boolean(site.currentRevisionId && site.status !== "deleted" && site.expiresAt);
  const urlSlugChanged = urlSlug.trim().toLowerCase() !== site.slug;
  const canSaveSlug = urlSlugChanged && slugCheck.state === "available" && !savingSlug;
  const rootHost = previewRootHost(site);
  if (formsState.siteId !== site.id) {
    setFormsState({ siteId: site.id, submissions: null });
    setFormsLocked(false);
    setSelectedSubmission(null);
  }
  const formSubmissions = formsState.siteId === site.id ? formsState.submissions ?? [] : [];
  const formsLoading = formsState.siteId === site.id && formsState.submissions === null;
  const formKeys = Array.from(new Set(formSubmissions.map((submission) => submission.formKey)));

  useEffect(() => {
    setUrlSlug(site.slug);
    setSlugCheck({ state: "current", message: "現在のサブドメインです" });
  }, [site.id, site.slug]);

  useEffect(() => {
    const candidate = urlSlug.trim();
    if (!candidate) {
      setSlugCheck({ state: "invalid", message: "サブドメインを入力してください" });
      return;
    }
    let cancelled = false;
    setSlugCheck({ state: "checking", message: "サブドメインの空き状況を確認中..." });
    const timer = window.setTimeout(() => {
      void api.slugAvailability(candidate, site.id)
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
  }, [site.id, urlSlug]);

  useEffect(() => {
    if (tab !== "revisions") return;
    let cancelled = false;
    setRevisionsLoading(true);
    setRevisionsLocked(false);
    void api.revisions(site.id)
      .then((res) => {
        if (!cancelled) setRevisions(res.revisions);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 403 && err.message === "plan_required") {
          setRevisionsLocked(true);
          return;
        }
        onError(err instanceof ApiClientError ? err.message : "request_failed");
      })
      .finally(() => {
        if (!cancelled) setRevisionsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab, site.id, site.currentRevisionId, onError]);

  useEffect(() => {
    if (tab !== "forms" || formsState.siteId !== site.id || formsState.submissions !== null || formsLocked) return;
    let cancelled = false;
    void api.formSubmissions(site.id)
      .then((res) => {
        if (!cancelled) {
          setFormsState((current) => (current.siteId === site.id ? { siteId: site.id, submissions: res.submissions } : current));
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.message === "plan_required") {
          setFormsLocked(true);
          setFormsState((current) => (current.siteId === site.id ? { siteId: site.id, submissions: [] } : current));
          return;
        }
        onError(err instanceof ApiClientError ? err.message : "form_submissions_failed");
      });
    return () => {
      cancelled = true;
    };
  }, [tab, site.id, formsState.siteId, formsState.submissions, formsLocked, onError]);

  async function openSubmission(submissionId: string) {
    setLoadingSubmissionId(submissionId);
    try {
      const res = await api.formSubmission(site.id, submissionId);
      setSelectedSubmission(res.submission);
    } catch (err) {
      onError(err instanceof ApiClientError ? err.message : "form_submission_failed");
    } finally {
      setLoadingSubmissionId(null);
    }
  }

  async function handlePreviewRevision(revisionId: string) {
    setPreviewingRevisionId(revisionId);
    try {
      const res = await api.revisionPreviewUrl(site.id, revisionId);
      window.open(res.previewUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      onError(err instanceof ApiClientError ? err.message : "request_failed");
    } finally {
      setPreviewingRevisionId(null);
    }
  }

  async function confirmRestore() {
    if (!restoreTarget) return;
    const targetGeneration = restoreTarget.generation;
    setRestoring(true);
    try {
      const res = await api.restoreRevision(site.id, restoreTarget.id);
      setRevisions(res.revisions);
      setRestoreTarget(null);
      setStatus(`第${targetGeneration}世代を復元しました`);
      onChanged();
    } catch (err) {
      onError(err instanceof ApiClientError ? err.message : "request_failed");
    } finally {
      setRestoring(false);
    }
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(site.previewUrl);
      setStatus("URLをコピーしました");
    } catch {
      setStatus("コピーに失敗しました");
    }
  }

  async function savePublicUrl() {
    if (!canSaveSlug) return;
    setSavingSlug(true);
    setStatus("公開URLを変更中...");
    try {
      await api.updateSite(site.id, { slug: urlSlug.trim() });
      setStatus("公開URLを変更しました");
      onChanged();
    } catch (error) {
      onError(error instanceof Error ? error.message : "slug_update_failed");
    } finally {
      setSavingSlug(false);
    }
  }

  async function renewExpiry() {
    if (!canRenewExpiry || isRenewingExpiry) return;
    setIsRenewingExpiry(true);
    setStatus("公開期間を更新中...");
    try {
      await api.renewSiteExpiry(site.id);
      setStatus("公開期間を更新しました");
      onChanged();
    } catch (error) {
      onError(error instanceof Error ? error.message : "expiry_renewal_failed");
    } finally {
      setIsRenewingExpiry(false);
    }
  }

  function clearReplaceSecurityWarning() {
    setReplaceSecurityWarnings([]);
    setPendingReplaceBody(null);
    setPendingReplaceFileName("");
  }

  async function submitReplacement(body: RevisionBody, fileName: string, securityOverrideAccepted = false) {
    setIsReplacing(true);
    setStatus(securityOverrideAccepted ? "警告を理解してHTMLを差し替え中..." : "HTMLを差し替え中...");
    if (!securityOverrideAccepted) {
      clearReplaceSecurityWarning();
    }
    try {
      const result = await api.createRevision(site.id, securityOverrideAccepted ? withSecurityOverride(body) : body);
      clearReplaceSecurityWarning();
      setStatus(result.revision.warnings.length > 0 ? `差し替えました（警告: ${warningSummary(result.revision.warnings)}）` : "HTMLを差し替えました");
      onChanged();
    } catch (error) {
      const warnings = securityWarningsFromError(error);
      if (warnings.length > 0) {
        setReplaceSecurityWarnings(warnings);
        setPendingReplaceBody(body);
        setPendingReplaceFileName(fileName);
        setStatus(`セキュリティチェックで警告が見つかりました: ${warningSummary(warnings)}`);
      } else {
        onError(error instanceof Error ? error.message : "replace_failed");
      }
    } finally {
      setIsReplacing(false);
    }
  }

  async function handleReplace(file: File | null) {
    if (!file) return;
    setStatus("HTMLを差し替え中...");
    trackUploadStarted("admin_revision_replace", file);
    try {
      const payload = await prepareFile(file);
      await submitReplacement(revisionBodyFromPayload(payload), file.name);
    } catch (error) {
      onError(error instanceof Error ? error.message : "replace_failed");
    } finally {
      if (replaceInputRef.current) {
        replaceInputRef.current.value = "";
      }
    }
  }

  async function confirmDelete() {
    setDeleteOpen(false);
    setStatus("サイトを削除中...");
    try {
      await api.deleteSite(site.id);
      setStatus("サイトを削除しました");
      onDeleted();
    } catch (error) {
      onError(error instanceof Error ? error.message : "delete_failed");
    }
  }

  async function saveAuth() {
    setSavingAuth(true);
    setStatus("認証設定を保存中...");
    try {
      await api.updateSite(site.id, {
        authMode,
        password: authMode === "password" && password ? password : undefined,
        allowedEmailDomains: authMode === "email_domain" ? domains : undefined,
        allowedEmails: authMode === "email_otp" ? allowedEmails : undefined,
        indexingEnabled: authMode === "random" && !noindex,
        hideBranding
      });
      setStatus("認証設定を保存しました");
      onChanged();
    } catch (error) {
      onError(error instanceof Error ? error.message : "update_failed");
    } finally {
      setSavingAuth(false);
    }
  }

  function resetAuth() {
    setAuthMode(site.authMode);
    setPassword("");
    setDomains(site.allowedEmailDomains.join(", "));
    setAllowedEmails(site.allowedEmails.join(", "));
    setNoindex(!site.indexingEnabled);
    setHideBranding(site.hideBranding);
  }

  return (
    <div className="gs-content" style={{ maxWidth: 1120 }}>
      <button className="gs-back" onClick={onBack}>
        <ArrowLeftIcon size={15} />
        サイト一覧
      </button>

      <div className="gs-detail-head">
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <span className="gs-detail-icon">
            <ShieldCheckIcon size={22} />
          </span>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: 22 }}>{site.title}</h1>
            <a className="gs-detail-link" href={site.previewUrl} target="_blank" rel="noreferrer">
              <ExternalLinkIcon size={13} />
              {previewDisplayHost(site.previewUrl)}
            </a>
          </div>
        </div>
        <div className="gs-row-actions">
          <span className="gs-pill">
            <span className="gs-dot" style={{ background: statusDot(site) }} />
            {statusLabel(site)}
          </span>
          <Button variant="outline" size="sm" onClick={() => replaceInputRef.current?.click()} disabled={isReplacing}>
            <RefreshIcon size={15} />
            {isReplacing ? "差し替え中..." : "差し替え"}
          </Button>
          <Button variant="ghost" size="sm" style={{ color: "var(--destructive)" }} onClick={() => setDeleteOpen(true)}>
            <TrashIcon size={15} />
            削除
          </Button>
          <input
            ref={replaceInputRef}
            type="file"
            accept=".html,.htm,.zip,text/html,application/zip"
            style={{ display: "none" }}
            onChange={(event) => void handleReplace(event.currentTarget.files?.[0] ?? null)}
          />
        </div>
      </div>

      <div className="gs-tabs">
        <button className={`gs-tab${tab === "overview" ? " is-active" : ""}`} onClick={() => onTab("overview")}>
          概要
        </button>
        <button className={`gs-tab${tab === "auth" ? " is-active" : ""}`} onClick={() => onTab("auth")}>
          認証設定
        </button>
        <button type="button" className={`gs-tab${tab === "forms" ? " is-active" : ""}`} onClick={() => onTab("forms")}>
          フォーム便
        </button>
        <button className={`gs-tab${tab === "revisions" ? " is-active" : ""}`} onClick={() => onTab("revisions")}>
          世代
        </button>
        <button className={`gs-tab${tab === "comments" ? " is-active" : ""}`} onClick={() => onTab("comments")}>
          コメント
        </button>
        <button className={`gs-tab${tab === "logs" ? " is-active" : ""}`} onClick={() => onTab("logs")}>
          アクセスログ
        </button>
      </div>

      {replaceSecurityWarnings.length > 0 && pendingReplaceBody ? (
        <Alert icon={<ShieldCheckIcon size={16} />} title="セキュリティチェックで警告が見つかりました" variant="destructive" style={{ marginBottom: 18 }}>
          <div style={{ display: "grid", gap: 12 }}>
            <p style={{ margin: 0 }}>
              {pendingReplaceFileName ? `「${pendingReplaceFileName}」の差し替えはまだ公開されていません。` : "差し替えはまだ公開されていません。"}
              内容を確認して修正するか、リスクを理解したうえで続行してください。
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              {warningDetails(replaceSecurityWarnings).map((warning) => (
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
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 10 }}>
              <Button variant="ghost" onClick={clearReplaceSecurityWarning} disabled={isReplacing}>
                キャンセル
              </Button>
              <Button variant="outline" onClick={() => replaceInputRef.current?.click()} disabled={isReplacing}>
                別のファイルを選ぶ
              </Button>
              <Button variant="destructive" onClick={() => void submitReplacement(pendingReplaceBody, pendingReplaceFileName, true)} disabled={isReplacing}>
                <RefreshIcon size={16} />
                {isReplacing ? "差し替え中..." : "警告を理解して差し替える"}
              </Button>
            </div>
          </div>
        </Alert>
      ) : null}

      {tab === "overview" ? (
        <div className="gs-stack-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 18, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="ds-card">
              <div className="ds-card__head">
                <h3 style={{ fontSize: 15 }}>公開情報</h3>
              </div>
              <div style={{ padding: "6px 20px 14px" }}>
                <div className="gs-kv">
                  <span className="gs-kv-key">公開 URL</span>
                  <span className="gs-kv-val gs-mono">{previewDisplayHost(site.previewUrl)}</span>
                </div>
                <div className="gs-url-edit">
                  <Label>公開URLを変更</Label>
                  <div className="gs-url-edit-row">
                    <Input value={urlSlug} onChange={(event) => setUrlSlug(event.target.value)} aria-label="公開URLのサブドメイン" />
                    <span className="gs-input-suffix">.{rootHost}</span>
                    <Button size="sm" onClick={() => void savePublicUrl()} disabled={!canSaveSlug}>
                      {savingSlug ? "変更中..." : "変更する"}
                    </Button>
                  </div>
                  <span className={`gs-field-hint gs-slug-check ${slugCheckClass(slugCheck.state)}`}>{slugCheck.message}</span>
                </div>
                <div className="gs-kv">
                  <span className="gs-kv-key">認証方式</span>
                  <Badge {...authBadgeStyle(site.authMode)}>{authLabel(site)}</Badge>
                </div>
                <div className="gs-kv">
                  <span className="gs-kv-key">公開日</span>
                  <span className="gs-kv-val gs-mono">{formatDate(site.createdAt)}</span>
                </div>
                <div className="gs-kv">
                  <span className="gs-kv-key">公開期限</span>
                  <span className="gs-kv-val gs-expiry-stack">
                    <span>{expiryLabel(site)}</span>
                    {expiryEnd ? <span className="gs-expiry-end">{expiryEnd}</span> : null}
                    {canRenewExpiry ? (
                      <Button className="gs-expiry-renew" variant="outline" size="sm" aria-label="公開期間を更新" onClick={() => void renewExpiry()} disabled={isRenewingExpiry}>
                        <RefreshIcon size={14} />
                        {isRenewingExpiry ? "更新中..." : "更新する"}
                      </Button>
                    ) : null}
                  </span>
                </div>
                <div className="gs-kv">
                  <span className="gs-kv-key">ファイルサイズ</span>
                  <span className="gs-kv-val gs-mono">{formatBytes(site.metrics.totalBytes)}</span>
                </div>
                <div className="gs-kv">
                  <span className="gs-kv-key">作成ツール</span>
                  {site.tool ? (
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 9px", borderRadius: 999, fontSize: 12, fontWeight: 500, border: "1px solid var(--border)" }}>
                      {toolLabel(site.tool)}
                    </span>
                  ) : (
                    <span className="gs-kv-val">—</span>
                  )}
                </div>
              </div>
            </div>

            <div className="ds-card" style={{ padding: "16px 20px" }}>
              <h3 style={{ fontSize: 15, marginBottom: 12 }}>クイック操作</h3>
              <div className="gs-stack-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Button variant="outline" onClick={() => void copyUrl()}>
                  <CopyIcon size={16} />
                  URL をコピー
                </Button>
                <Button variant="outline" onClick={() => window.open(site.previewUrl, "_blank", "noreferrer")}>
                  <ExternalLinkIcon size={16} />
                  サイトを開く
                </Button>
                <Button variant="outline" onClick={() => replaceInputRef.current?.click()} disabled={isReplacing}>
                  <RefreshIcon size={16} />
                  {isReplacing ? "差し替え中..." : "HTML を差し替え"}
                </Button>
                <Button variant="outline" style={{ color: "var(--destructive)" }} onClick={() => setDeleteOpen(true)}>
                  <TrashIcon size={16} />
                  削除する
                </Button>
              </div>
            </div>
          </div>

          <div className="gs-preview">
            <div className="gs-preview-bar">
              <span className="gs-dot" style={{ width: 10, height: 10, background: "#ec6a5e" }} />
              <span className="gs-dot" style={{ width: 10, height: 10, background: "#f4be4f" }} />
              <span className="gs-dot" style={{ width: 10, height: 10, background: "#61c554" }} />
              <span className="gs-preview-url">🔒 {previewDisplayHost(site.previewUrl)}</span>
            </div>
            {site.currentRevisionId ? (
              <iframe
                className="gs-preview-frame"
                src={site.previewUrl}
                title={`${site.title} プレビュー`}
                loading="lazy"
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-popups allow-forms"
              />
            ) : (
              <div className="gs-empty" style={{ padding: "80px 20px" }}>
                まだHTMLがアップロードされていません。
              </div>
            )}
          </div>
        </div>
      ) : null}

      {tab === "auth" ? (
        <div style={{ maxWidth: 760, display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="ds-card">
            <div className="ds-card__head">
              <h3 style={{ fontSize: 15 }}>認証方式</h3>
              <p className="gs-muted" style={{ fontSize: 13, marginTop: 4 }}>
                このサイトを誰が閲覧できるかを設定します。
              </p>
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              {AUTH_OPTIONS.map((option) => {
                const OptionIcon = option.icon;
                const selected = authMode === option.mode;
                return (
                  <button
                    key={option.mode}
                    className={`gs-authopt${selected ? " is-selected" : ""}`}
                    onClick={() => setAuthMode(option.mode)}
                  >
                    <span className="gs-authopt-icon" style={option.recommended ? { color: "var(--ac)" } : undefined}>
                      <OptionIcon size={17} />
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                        {option.title}
                        {option.recommended ? (
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              padding: "1px 7px",
                              borderRadius: 999,
                              background: "color-mix(in oklab, var(--ac) 14%, var(--background))",
                              color: "var(--ac)"
                            }}
                          >
                            おすすめ
                          </span>
                        ) : null}
                      </span>
                      <span className="gs-muted" style={{ fontSize: 13, marginTop: 2, display: "block" }}>
                        {option.description}
                      </span>
                    </span>
                    {selected ? <CheckIcon size={18} style={{ color: "var(--ac)" }} /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          {authMode === "password" ? (
            <div className="ds-card" style={{ padding: "18px 20px" }}>
              <Label style={{ marginBottom: 8 }}>共有パスワード</Label>
              <Input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="新しいパスワード（6文字以上）" style={{ fontFamily: "var(--font-mono)" }} />
              <span className="gs-field-hint" style={{ marginTop: 6, display: "block" }}>
                空のままにすると現在のパスワードを維持します。
              </span>
            </div>
          ) : null}
          {authMode === "email_domain" ? (
            <div className="ds-card" style={{ padding: "18px 20px" }}>
              <Label style={{ marginBottom: 8 }}>許可する会社ドメイン</Label>
              <Input value={domains} onChange={(event) => setDomains(event.target.value)} placeholder="acme.co.jp, example.com" style={{ fontFamily: "var(--font-mono)" }} />
              <Alert icon={<InfoIcon size={16} style={{ color: "var(--muted-foreground)" }} />} style={{ marginTop: 14 }}>
                会社ドメイン認証は「そのドメインの全員」が閲覧できます。特定の部署や NDA 対象の場合は、個別メール許可リスト（メール認証）と併用してください。
              </Alert>
            </div>
          ) : null}
          {authMode === "email_otp" ? (
            <div className="ds-card" style={{ padding: "18px 20px" }}>
              <Label style={{ marginBottom: 8 }}>招待するメールアドレス</Label>
              <Input value={allowedEmails} onChange={(event) => setAllowedEmails(event.target.value)} placeholder="tanaka@example.com, sato@example.com" style={{ fontFamily: "var(--font-mono)" }} />
              <span className="gs-field-hint" style={{ marginTop: 6, display: "block" }}>
                入力したアドレスにだけ 6 桁コードを送って認証します。
              </span>
            </div>
          ) : null}

          <div className="ds-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>検索エンジンに表示しない</div>
                <div className="gs-muted" style={{ fontSize: 13, marginTop: 2 }}>
                  noindex を付与し、検索結果に出ないようにします。
                </div>
              </div>
              <Switch checked={authMode !== "random" ? true : noindex} disabled={authMode !== "random"} onChange={(event) => setNoindex(event.currentTarget.checked)} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>ロゴ非表示</div>
                <div className="gs-muted" style={{ fontSize: 13, marginTop: 2 }}>
                  ページ下部の「<BrandName />」表示を消します（Pro プラン）。
                </div>
              </div>
              <Switch checked={hideBranding} onChange={(event) => setHideBranding(event.currentTarget.checked)} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Button variant="ghost" onClick={resetAuth}>
              変更を破棄
            </Button>
            <Button onClick={() => void saveAuth()} disabled={savingAuth}>
              {savingAuth ? "保存中..." : "設定を保存"}
            </Button>
          </div>
        </div>
      ) : null}

      {tab === "forms" && formsLocked ? (
        <PlanUpgradeNotice feature="フォーム便（回答受付・CSV）" planLabel={FORM_SUBMISSIONS_MIN_PLAN_LABEL} />
      ) : null}

      {tab === "forms" && !formsLocked ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Alert icon={<InfoIcon size={16} style={{ color: "var(--muted-foreground)" }} />}>
            公開HTMLに <code>{'<form data-giga-form="contact">'}</code> を置くと、送信内容がこの画面に保存されます。メール認証・会社ドメイン認証のサイトでは、閲覧認証済みのメールアドレスも記録されます（パスワード認証では記録されません）。
          </Alert>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="outline" size="sm" onClick={() => { window.location.href = api.formSubmissionsCsvUrl(site.id); }} disabled={formSubmissions.length === 0}>
              CSVダウンロード
            </Button>
          </div>
          <div className="gs-stats">
            <div className="gs-stat">
              <div className="gs-stat-head">回答数</div>
              <div className="gs-stat-value gs-mono">{formatNumber(formSubmissions.length)}</div>
            </div>
            <div className="gs-stat">
              <div className="gs-stat-head">フォーム数</div>
              <div className="gs-stat-value gs-mono">{formatNumber(formKeys.length)}</div>
            </div>
            <div className="gs-stat">
              <div className="gs-stat-head">最新回答</div>
              <div className="gs-stat-value" style={{ fontSize: 18 }}>{formatRelative(formSubmissions[0]?.createdAt ?? null)}</div>
            </div>
          </div>
          <div className="gs-table">
            <div className="gs-thead" style={{ gridTemplateColumns: "1fr 1.1fr 1.7fr 1fr 0.8fr" }}>
              <span>受信時刻</span>
              <span>フォーム</span>
              <span>内容プレビュー</span>
              <span>送信元</span>
              <span style={{ textAlign: "right" }}>操作</span>
            </div>
            {formsLoading ? (
              <div className="gs-empty">読み込み中...</div>
            ) : formSubmissions.length === 0 ? (
              <div className="gs-empty">まだフォーム回答はありません。公開HTML内の form に data-giga-form を付けると受け取れます。</div>
            ) : (
              formSubmissions.map((submission) => (
                <div key={submission.id} className="gs-drow" style={{ gridTemplateColumns: "1fr 1.1fr 1.7fr 1fr 0.8fr", alignItems: "center" }}>
                  <span className="gs-muted gs-mono" data-label="受信時刻" style={{ fontSize: 12 }}>{formatDateTime(submission.createdAt)}</span>
                  <span className="gs-mono" data-label="フォーム" style={{ fontSize: 12 }}>{submission.formKey}</span>
                  <span data-label="内容" style={{ fontSize: 13 }}>
                    {submission.fieldPreview.length > 0 ? submission.fieldPreview.map((field) => `${field.name}: ${field.value}`).join(" / ") : `${submission.fieldCount}項目`}
                  </span>
                  <span className="gs-muted gs-mono" data-label="送信元" style={{ fontSize: 12 }}>{submission.submitterEmail ?? submission.sourcePath ?? "—"}</span>
                  <span data-label="操作" className="gs-row-actions" style={{ justifyContent: "flex-end" }}>
                    <Button variant="outline" size="sm" onClick={() => void openSubmission(submission.id)} disabled={loadingSubmissionId === submission.id}>
                      {loadingSubmissionId === submission.id ? "読込中..." : "詳細"}
                    </Button>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}

      {tab === "revisions" && revisionsLocked ? (
        <PlanUpgradeNotice feature="世代管理・復元" planLabel={REVISION_HISTORY_MIN_PLAN_LABEL} />
      ) : null}

      {tab === "revisions" && !revisionsLocked ? (
        <div className="ds-card">
          <div className="ds-card__head">
            <h3 style={{ fontSize: 15 }}>世代履歴</h3>
          </div>
          <div style={{ padding: "6px 20px 16px" }}>
            <p className="gs-muted" style={{ fontSize: 13, lineHeight: 1.6, margin: "6px 0 16px" }}>
              アップロード・差し替え・復元のたびに世代として記録されます。過去世代はプレビューで確認でき、必要なら現在の公開世代として復元できます。復元しても公開 URL・認証設定・公開期限は変わりません。
            </p>
            <div className="gs-table">
              <div className="gs-thead" style={{ gridTemplateColumns: "1.3fr 1.1fr 0.9fr 1fr 1.1fr" }}>
                <span>世代</span>
                <span>作成日時</span>
                <span>作成者</span>
                <span>ファイル</span>
                <span style={{ textAlign: "right" }}>操作</span>
              </div>
              {revisionsLoading ? (
                <div className="gs-empty">読み込み中...</div>
              ) : revisions.length === 0 ? (
                <div className="gs-empty">まだ世代がありません。HTML をアップロードすると最初の世代が記録されます。</div>
              ) : (
                revisions.map((rev) => (
                  <div key={rev.id} className="gs-drow" style={{ gridTemplateColumns: "1.3fr 1.1fr 0.9fr 1fr 1.1fr", alignItems: "center" }}>
                    <span data-label="世代" style={{ fontSize: 13, display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <strong>第{rev.generation}世代</strong>
                      {rev.isCurrent ? (
                        <Badge background="color-mix(in oklab, var(--success) 16%, var(--background))" color="var(--success)">公開中</Badge>
                      ) : null}
                      {rev.restoredFromGeneration ? (
                        <span className="gs-muted" style={{ fontSize: 12 }}>第{rev.restoredFromGeneration}世代を復元</span>
                      ) : null}
                    </span>
                    <span className="gs-muted gs-mono" data-label="作成日時" style={{ fontSize: 12 }}>{formatDateTime(rev.createdAt)}</span>
                    <span className="gs-mono" data-label="作成者" style={{ fontSize: 12 }}>{rev.createdBy ? "オーナー" : "—"}</span>
                    <span className="gs-muted gs-mono" data-label="ファイル" style={{ fontSize: 12 }}>{rev.fileCount}件 / {formatBytes(rev.byteLength)}</span>
                    <span data-label="操作" className="gs-row-actions" style={{ justifyContent: "flex-end" }}>
                      <Button variant="ghost" size="sm" onClick={() => void handlePreviewRevision(rev.id)} disabled={previewingRevisionId === rev.id}>
                        <ExternalLinkIcon size={14} />
                        {previewingRevisionId === rev.id ? "準備中..." : "プレビュー"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setRestoreTarget(rev)} disabled={rev.isCurrent}>
                        <RefreshIcon size={14} />
                        復元
                      </Button>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}

      {tab === "comments" ? (
        <ReviewCommentsPanel site={site} setStatus={setStatus} onError={onError} />
      ) : null}

      {tab === "logs" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="gs-stats">
            <div className="gs-stat">
              <div className="gs-stat-head">総アクセス</div>
              <div className="gs-stat-value gs-mono">{formatNumber(site.metrics.views)}</div>
            </div>
            <div className="gs-stat">
              <div className="gs-stat-head">ユニーク訪問</div>
              <div className="gs-stat-value gs-mono">{formatNumber(site.metrics.uniqueVisitors)}</div>
            </div>
            <div className="gs-stat">
              <div className="gs-stat-head">認証成功</div>
              <div className="gs-stat-value gs-mono">{formatNumber(site.metrics.authViews)}</div>
            </div>
            <div className="gs-stat">
              <div className="gs-stat-head">最終アクセス</div>
              <div className="gs-stat-value" style={{ fontSize: 18 }}>{formatRelative(site.metrics.lastSeenAt)}</div>
            </div>
          </div>

          <div className="gs-table">
            <div className="gs-thead" style={{ gridTemplateColumns: "0.9fr 1fr 1.6fr 1fr" }}>
              <span>時刻</span>
              <span>イベント</span>
              <span>メールアドレス</span>
              <span>IP アドレス</span>
            </div>
            {events.length === 0 ? (
              <div className="gs-empty">まだログがありません。</div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="gs-drow" style={{ gridTemplateColumns: "0.9fr 1fr 1.6fr 1fr" }}>
                  <span className="gs-muted gs-mono" data-label="時刻" style={{ fontSize: 12 }}>{formatDateTime(event.createdAt)}</span>
                  <span className="gs-status" data-label="イベント" style={{ fontSize: 13 }}>
                    <span className="gs-dot" style={{ width: 7, height: 7, background: eventDot(event.eventType) }} />
                    {EVENT_LABELS[event.eventType] ?? event.eventType}
                  </span>
                  <span className="gs-mono" data-label="メール" style={{ fontSize: 13 }}>{event.maskedEmail ?? "—"}</span>
                  <span className="gs-muted gs-mono" data-label="IP" style={{ fontSize: 12 }}>{event.ipHashShort ?? "—"}</span>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}

      <Dialog open={Boolean(selectedSubmission)} onClose={() => setSelectedSubmission(null)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>フォーム回答の詳細</div>
            <p className="gs-muted" style={{ margin: "4px 0 0", fontSize: 13 }}>
              {selectedSubmission ? `${selectedSubmission.formKey} / ${formatDateTime(selectedSubmission.createdAt)}` : ""}
            </p>
          </div>
          {selectedSubmission?.sourcePath ? (
            <div className="gs-kv">
              <span className="gs-kv-key">送信元ページ</span>
              <span className="gs-kv-val gs-mono">{selectedSubmission.sourcePath}</span>
            </div>
          ) : null}
          {selectedSubmission?.submitterEmail ? (
            <div className="gs-kv">
              <span className="gs-kv-key">認証メール</span>
              <span className="gs-kv-val gs-mono">{selectedSubmission.submitterEmail}</span>
            </div>
          ) : null}
          <div style={{ display: "grid", gap: 10 }}>
            {selectedSubmission?.fields.map((field, index) => (
              <div key={`${field.name}-${index}`} style={{ display: "grid", gap: 4, padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 10, background: "rgba(255,255,255,0.6)" }}>
                <span className="gs-muted" style={{ fontSize: 12 }}>{field.name}</span>
                <span style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: 14 }}>{field.value || "—"}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
          <Button variant="ghost" onClick={() => setSelectedSubmission(null)}>
            閉じる
          </Button>
        </div>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                display: "inline-grid",
                placeContent: "center",
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "color-mix(in oklab, var(--destructive) 12%, var(--background))",
                color: "var(--destructive)"
              }}
            >
              <TrashIcon size={18} />
            </span>
            <span style={{ fontSize: 18, fontWeight: 600 }}>サイトを削除</span>
          </div>
          <p className="gs-muted" style={{ fontSize: 14, lineHeight: 1.5, marginTop: 4 }}>
            「{site.title}」を削除します。公開 URL は無効になり、この操作は取り消せません。
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
          <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
            キャンセル
          </Button>
          <Button variant="destructive" onClick={() => void confirmDelete()}>
            削除する
          </Button>
        </div>
      </Dialog>

      <Dialog open={Boolean(restoreTarget)} onClose={() => setRestoreTarget(null)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                display: "inline-grid",
                placeContent: "center",
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "color-mix(in oklab, var(--ac) 14%, var(--background))",
                color: "var(--ac)"
              }}
            >
              <RefreshIcon size={18} />
            </span>
            <span style={{ fontSize: 18, fontWeight: 600 }}>世代を復元</span>
          </div>
          <p className="gs-muted" style={{ fontSize: 14, lineHeight: 1.6, marginTop: 4 }}>
            {restoreTarget ? `第${restoreTarget.generation}世代を、現在の公開世代として復元します。` : ""}
            この操作は新しい世代として記録され、公開 URL・認証設定・公開期限は変わりません。
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
          <Button variant="ghost" onClick={() => setRestoreTarget(null)} disabled={restoring}>
            キャンセル
          </Button>
          <Button onClick={() => void confirmRestore()} disabled={restoring}>
            {restoring ? "復元中..." : "復元する"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
