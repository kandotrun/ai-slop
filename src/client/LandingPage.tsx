import { useEffect, useRef, useState, type ReactNode } from "react";
import { BrandName } from "./BrandName";
import { FeatureName } from "./FeatureName";
import { AGENT_MANIFEST_PATH, AGENT_SETUP_ENDPOINT, AGENTS_TXT_PATH, buildAgentSetupPrompt } from "../shared/agent-handoff";
import { FORM_FEATURE_BULLETS, FORM_FEATURE_DESCRIPTION, FORM_FEATURE_STATUS_LABEL, FORM_FEATURE_TAGLINE } from "../shared/form-feature";
import { LANDING_ARTICLE_SUMMARIES } from "../shared/landing-articles";
import { PAID_CHECKOUT_PREPARING_TOOLTIP } from "../shared/billing-flags";
import { DEMO_HTML_DOWNLOAD_PATH, DEMO_HTML_FILE_NAME } from "../shared/demo-site";
import { FEATURED_ARTICLE_LINKS } from "../shared/featured-articles";
import { LEGAL_LINKS } from "../shared/legal";
import { PENDING_CLAIM_STORAGE_KEY, PENDING_CLAIM_TTL_MS, type PublicPublishResponse } from "../shared/anon-publish";
import { registerGigaSiteWebMcpTools } from "./webmcp";
import { trackUploadStarted } from "./measurement";
import { warningSummary } from "./admin/warnings";

function securityWarningsFromError(error: unknown): string[] {
  if (!(error instanceof Error) || error.message !== "security_review_warning") return [];
  const maybeDetails = "details" in error ? (error as { details?: unknown }).details : undefined;
  const warnings = maybeDetails && typeof maybeDetails === "object" && "warnings" in maybeDetails ? (maybeDetails as { warnings?: unknown }).warnings : undefined;
  return Array.isArray(warnings) ? warnings.filter((warning): warning is string => typeof warning === "string") : [];
}

function publishErrorMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : "";
  if (code === "rate_limited") return "短時間に公開しすぎです。少し待ってから再度お試しください。";
  if (code === "security_review_warning") return "セキュリティ上の懸念が見つかったため公開できませんでした。内容をご確認ください。";
  if (code === "password_required") return "パスワード付きで公開する場合は、6文字以上のパスワードを入力してください。";
  if (code === "password_too_common") return "パスワードが単純すぎます。推測されにくいものに変更してください。";
  if (code === "password_too_long") return "パスワードが長すぎます。";
  if (code === "upload_too_large" || code === "html_too_large") return "ファイルサイズが大きすぎます。";
  if (code === "entry_file_missing" || code === "invalid_html") return "HTMLを読み込めませんでした。単体HTMLか、index.htmlを含むzipをお試しください。";
  return "公開に失敗しました。少し時間をおいて再度お試しください。";
}

type IconName = "arrow" | "upload" | "download" | "shield" | "mail" | "zap" | "lock" | "clock" | "refresh" | "scan" | "check" | "building" | "send";

interface FeatureItem {
  icon: IconName;
  title: string;
  body: string;
}

interface PlanItem {
  name: string;
  price: string;
  unit: string;
  tagline: string;
  cta: string;
  href?: string;
  popular?: boolean;
  features: string[];
}

interface StripePublicConfigResponse {
  stripe?: {
    paidCheckoutEnabled?: boolean;
    paidCheckoutDisabledTooltip?: string | null;
  };
}

const features: FeatureItem[] = [
  { icon: "zap", title: "3秒で公開", body: "ファイルを落とすだけ。ビルドもデプロイ設定も不要で、すぐに共有URLが手に入ります。" },
  { icon: "shield", title: "会社ドメイン認証", body: "@example.co.jp のメンバーだけが閲覧可能。管理者権限なしで、社内・クライアント共有に。" },
  { icon: "lock", title: "パスワード / メール認証", body: "共有パスワード、または許可したメールアドレスへの6桁コードで、相手を限定できます。" },
  { icon: "clock", title: "期限付き公開", body: "7日・30日・90日などの公開期限を設定。期限が切れたURLは自動で見られなくなります。" },
  { icon: "refresh", title: "差し替え・アクセスログ", body: "同じURLのままHTMLを更新。誰がいつ見たか、認証ログも確認できます。" },
  { icon: "scan", title: "セキュリティチェック", body: "APIキーらしき文字列や不要ファイルを公開前に検知。AI生成HTMLも安心して共有できます。" }
];

const plans: PlanItem[] = [
  { name: "無料", price: "¥0", unit: "", tagline: "まずは無料で1サイト公開", cta: "無料で始める", features: ["1サイトまで公開", "7日間公開", "認証なし共有"] },
  { name: "Pro", price: "¥980", unit: "/月", tagline: "全機能を、サイト数無制限で", cta: "Proにする", href: "/app/billing", popular: true, features: ["サイト公開数 無制限", "全認証（パスワード / メール / 会社ドメイン）", "リビジョン履歴・レビューコメント・フォーム便", "ブランディング非表示・アクセスログ・期限管理"] }
];

const ICON_COMMON_PROPS = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...ICON_COMMON_PROPS}>
      {name === "arrow" ? <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></> : null}
      {name === "upload" ? <><path d="M12 13v8" /><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="m8 17 4-4 4 4" /></> : null}
      {name === "download" ? <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></> : null}
      {name === "shield" ? <><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></> : null}
      {name === "mail" ? <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></> : null}
      {name === "zap" ? <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /> : null}
      {name === "lock" ? <><rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></> : null}
      {name === "clock" ? <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> : null}
      {name === "refresh" ? <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></> : null}
      {name === "scan" ? <><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><circle cx="12" cy="12" r="3" /></> : null}
      {name === "check" ? <path d="M20 6 9 17l-5-5" /> : null}
      {name === "building" ? <><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /></> : null}
      {name === "send" ? <><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></> : null}
    </svg>
  );
}

function AppLink({ children, variant = "solid", size = "default", href = "/app/", className = "" }: { children: ReactNode; variant?: "solid" | "outline" | "ghost"; size?: "default" | "large"; href?: string; className?: string }) {
  return <a className={`lp-btn lp-btn-${variant} ${size === "large" ? "lp-btn-lg" : ""} ${className}`.trim()} href={href}>{children}</a>;
}

function BrandIcon({ name }: { name: "github" | "zenn" | "youtube" }) {
  if (name === "github") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.1 3.29 9.41 7.86 10.94.58.1.79-.25.79-.56 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56A11.53 11.53 0 0 0 23.5 12.02C23.5 5.73 18.27.5 12 .5Z" />
      </svg>
    );
  }
  if (name === "youtube") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M23.5 6.5a3.02 3.02 0 0 0-2.12-2.14C19.5 3.85 12 3.85 12 3.85s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51A3.02 3.02 0 0 0 23.5 17.5c.5-1.9.5-5.5.5-5.5s0-3.6-.5-5.5ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M.264 23.771h4.984c.264 0 .498-.147.645-.352L19.614.874c.176-.293-.029-.645-.381-.645h-4.72c-.235 0-.44.117-.557.323L.03 23.361c-.088.176.029.41.234.41zM17.445 23.419l6.479-10.408c.205-.323-.029-.733-.41-.733h-4.691c-.176 0-.352.088-.44.235l-6.655 10.643c-.176.264.029.616.352.616h4.779c.234-.001.468-.118.586-.353z" />
    </svg>
  );
}

export function LandingPage() {
  const agentPrompt = buildAgentSetupPrompt("https://giga-site.com");
  const [copyStatus, setCopyStatus] = useState("プロンプトをコピー");
  const [menuOpen, setMenuOpen] = useState(false);
  const [paidCheckout, setPaidCheckout] = useState({ enabled: false, tooltip: PAID_CHECKOUT_PREPARING_TOOLTIP });
  const [publishing, setPublishing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [published, setPublished] = useState<PublicPublishResponse | null>(null);
  const [claimStored, setClaimStored] = useState(false);
  const [securityWarnings, setSecurityWarnings] = useState<string[]>([]);
  const [modalPassword, setModalPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSetupMessage, setPasswordSetupMessage] = useState("");
  const [passwordSetupError, setPasswordSetupError] = useState("");
  const [copyUrlStatus, setCopyUrlStatus] = useState("URLをコピー");
  const dropInputRef = useRef<HTMLInputElement>(null);
  const lastFileRef = useRef<File | null>(null);

  async function handleInstantPublish(file: File, securityOverrideAccepted = false) {
    lastFileRef.current = file;
    trackUploadStarted("landing_instant_publish", file);
    setPublishError("");
    if (!securityOverrideAccepted) setSecurityWarnings([]);
    setPublishing(true);
    try {
      const [{ prepareFile }, { api }] = await Promise.all([import("./admin/upload"), import("./admin/api")]);
      const payload = await prepareFile(file);
      const base = payload.kind === "html" ? { html: payload.html } : { files: payload.files, entryPath: payload.entryPath };
      const result = await api.publishAnonymous(securityOverrideAccepted ? { ...base, securityOverrideAccepted: true } : base);
      let nextClaimStored = false;
      try {
        window.localStorage.setItem(
          PENDING_CLAIM_STORAGE_KEY,
          JSON.stringify({
            siteId: result.siteId,
            slug: result.slug,
            previewUrl: result.previewUrl,
            claimToken: result.claimToken,
            expiresAt: Date.now() + PENDING_CLAIM_TTL_MS
          })
        );
        nextClaimStored = true;
      } catch {
        // localStorage unavailable; do not put claim tokens into URLs or browser history.
      }
      setClaimStored(nextClaimStored);
      setSecurityWarnings([]);
      setPublished(result);
      setCopyUrlStatus("URLをコピー");
    } catch (error) {
      const warnings = securityWarningsFromError(error);
      if (warnings.length > 0) {
        setSecurityWarnings(warnings);
      } else {
        setPublishError(publishErrorMessage(error));
      }
    } finally {
      setPublishing(false);
    }
  }

  async function copyPublishedUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopyUrlStatus("コピーしました");
    } catch {
      setCopyUrlStatus("コピーに失敗");
    }
  }

  function closePublishedModal() {
    setPublished(null);
    setModalPassword("");
    setPasswordSetupError("");
    setPasswordSetupMessage("");
    setPasswordSaving(false);
  }

  async function savePublishedPassword() {
    if (!published) return;
    const password = modalPassword.trim();
    setPasswordSetupError("");
    setPasswordSetupMessage("");
    if (password.length < 6) {
      setPasswordSetupError("6文字以上の共有パスワードを入力してください。");
      return;
    }
    setPasswordSaving(true);
    try {
      const { api } = await import("./admin/api");
      await api.setAnonymousPublishPassword({ siteId: published.siteId, claimToken: published.claimToken, password });
      setPublished({ ...published, authMode: "password" });
      setModalPassword("");
      setPasswordSetupMessage("パスワードを設定しました。URLを開くとパスワード入力が必要になります。");
    } catch (error) {
      setPasswordSetupError(publishErrorMessage(error));
    } finally {
      setPasswordSaving(false);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    document.documentElement.classList.add("lp-js");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    document.querySelectorAll(".lp-reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => registerGigaSiteWebMcpTools({ agentPrompt }), [agentPrompt]);

  useEffect(() => {
    let cancelled = false;
    const loadStripeConfig = () => {
      void fetch("/api/billing/stripe/config", { credentials: "same-origin" })
        .then(async (response) => (response.ok ? ((await response.json()) as StripePublicConfigResponse) : null))
        .then((body) => {
          if (cancelled || !body?.stripe) return;
          setPaidCheckout({
            enabled: body.stripe.paidCheckoutEnabled === true,
            tooltip: body.stripe.paidCheckoutDisabledTooltip ?? PAID_CHECKOUT_PREPARING_TOOLTIP
          });
        })
        .catch(() => {
          // Keep paid CTAs disabled if the public config cannot be loaded.
        });
    };
    const scheduleIdle = (task: () => void): void => {
      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(() => task(), { timeout: 2000 });
      } else {
        setTimeout(task, 1500);
      }
    };
    scheduleIdle(() => {
      if (!cancelled) loadStripeConfig();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function copyAgentPrompt() {
    try {
      await navigator.clipboard.writeText(agentPrompt);
      setCopyStatus("コピーしました");
    } catch {
      setCopyStatus("コピー失敗");
    }
    window.setTimeout(() => setCopyStatus("プロンプトをコピー"), 1800);
  }

  return (
    <div className="lp-shell">
      <div className="lp-announce">
        <a href="/app/">
          <Icon name="send" size={14} />
          <strong>AIで作ったHTMLを、認証付きURLで安全に共有できます</strong>
          <Icon name="arrow" size={14} />
        </a>
      </div>
      <header className="lp-header">
        <div className="lp-header-inner">
          <a href="#top" className="lp-brand"><BrandName /></a>
          <nav className={`lp-nav ${menuOpen ? "is-open" : ""}`} aria-label="LP navigation">
            <a href="#features" onClick={() => setMenuOpen(false)}>機能</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>使い方</a>
            <a href="/articles" onClick={() => setMenuOpen(false)}>活用記事</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>料金</a>
            <a href="/contact" onClick={() => setMenuOpen(false)}>お問い合わせ</a>
            <AppLink variant="ghost" className="lp-nav-login">ログイン</AppLink>
          </nav>
          <div className="lp-header-actions">
            <AppLink variant="ghost" className="lp-login-desktop">ログイン</AppLink>
            <AppLink>無料で始める</AppLink>
            <button
              type="button"
              className="lp-burger"
              aria-label="メニュー"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="lp-hero">
          <h1 className="lp-gradient-shimmer">AIで作ったHTMLを、<br />3秒で共有URLに。</h1>
          <p className="lp-lead">ドラッグ＆ドロップするだけ。まずは認証なしURLで即公開。必要ならパスワード付きURLにして、見せる相手を絞れます。</p>
          <div className="lp-hero-actions">
            <AppLink size="large">無料でHTMLを公開する <Icon name="arrow" size={18} /></AppLink>
            <a className="lp-btn lp-btn-outline lp-btn-lg" href={DEMO_HTML_DOWNLOAD_PATH} download={DEMO_HTML_FILE_NAME}>
              デモHTMLをダウンロード <Icon name="download" size={18} />
            </a>
            <button type="button" className="lp-btn lp-btn-outline lp-btn-lg" onClick={() => void copyAgentPrompt()}>{copyStatus}</button>
          </div>
          <div className="lp-free-note">クレジットカード不要 · 無料で1サイト公開 · Proで全機能・サイト無制限</div>
          <div
            className={`lp-drop${dragOver ? " is-over" : ""}${publishing ? " is-busy" : ""}`}
            role="button"
            tabIndex={0}
            aria-label="HTMLまたはzipをドロップして今すぐ公開"
            onClick={() => dropInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                dropInputRef.current?.click();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragOver(false);
              const file = event.dataTransfer.files?.[0];
              if (file) void handleInstantPublish(file);
            }}
          >
            <input
              ref={dropInputRef}
              type="file"
              accept=".html,.htm,.zip,text/html,application/zip"
              hidden
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                event.currentTarget.value = "";
                if (file) void handleInstantPublish(file);
              }}
            />
            <div className="lp-drop-icon"><Icon name="upload" size={30} /></div>
            {publishing ? (
              <strong>公開中…</strong>
            ) : (
              <>
                <strong>HTML / zip をドロップ、またはクリックして選択</strong>
                <span>登録不要。まずは認証なしURLを発行します（7日間・noindex）。URL発行後にパスワードも追加できます。</span>
              </>
            )}
            {publishError ? <p className="lp-drop-error">{publishError}</p> : null}
          </div>
        </section>

        <section className="lp-logos" aria-label="対応ツール">
          <span>あらゆるAIツールの出力をそのまま公開できます</span>
          <div><strong>Claude</strong><strong>v0</strong><strong>Bolt</strong><strong>ChatGPT</strong><strong>Stitch</strong><strong>Cursor</strong></div>
        </section>

        <section id="agent" className="lp-section lp-agent-section">
          <div className="lp-section-head lp-reveal"><h2>HTMLが分からなくても、AIに頼める</h2><p>「このサイトのリンクを<BrandName />にセットアップして」とAIへ渡すだけ。AI向け手順とAPI情報を公開しています。</p></div>
          <div className="lp-agent-card">
            <div className="lp-agent-intro">
              <h3>リンクを送るだけで、AIが静的HTML化してアップロード</h3>
              <p>Claude / ChatGPT / Cursor などにこの依頼文を貼ると、対象URLを取得し、静的ファイルとしてまとめ、<BrandName />の認証付きURLを作る流れまで案内できます。</p>
              <div className="lp-agent-links">
                <a href={AGENTS_TXT_PATH}>agents.txt</a>
                <a href={AGENT_SETUP_ENDPOINT}>setup JSON</a>
                <a href={AGENT_MANIFEST_PATH}>manifest</a>
              </div>
            </div>
            <div className="lp-prompt-card">
              <textarea value={agentPrompt} readOnly rows={9} aria-label="AIに依頼するプロンプト" />
              <button type="button" className="lp-btn lp-btn-solid" onClick={() => void copyAgentPrompt()}>{copyStatus}</button>
            </div>
          </div>
        </section>

        <section id="how" className="lp-section">
          <div className="lp-section-head lp-reveal"><h2>公開まで、3ステップ</h2><p>サーバーの設定も、デプロイの知識もいりません。</p></div>
          <div className="lp-demo-download-card lp-reveal">
            <div>
              <span>HTMLを持っていない方へ</span>
              <strong>まずはデモHTMLでアップロードを試せます</strong>
              <p>ダウンロードした1ファイルをそのままアップロードすると、公開URLの発行から閲覧まで体験できます。</p>
            </div>
            <a className="lp-btn lp-btn-solid" href={DEMO_HTML_DOWNLOAD_PATH} download={DEMO_HTML_FILE_NAME}>
              デモHTMLをダウンロード <Icon name="download" size={17} />
            </a>
          </div>
          <div className="lp-step-grid">
            {[
              ["01", "upload", "ドラッグ＆ドロップ", "作ったHTMLファイル、またはzipを画面に落とすだけ。index.html があればOK。"],
              ["02", "shield", "認証方式を選ぶ", "パスワード・メール認証・会社ドメイン認証から選択。期限付き公開も設定できます。"],
              ["03", "send", "URLを共有", "{名前}.giga-site.com を社内やクライアントに共有。いつでも差し替え・削除できます。"]
            ].map(([num, icon, title, body]) => (
              <article className="lp-step lp-reveal" key={num}>
                <div><span>{num}</span><Icon name={icon as IconName} /></div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className="lp-section">
          <div className="lp-section-head lp-reveal"><h2>仕事で使うための、共有機能</h2><p>ただ公開するだけではない。見せる相手をきちんと選べます。</p></div>
          <div className="lp-feature-grid">
            {features.map((feature) => (
              <article className="lp-feature lp-reveal" key={feature.title}>
                <span><Icon name={feature.icon} /></span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="form-bin" className="lp-section lp-form-feature-section">
          <div className="lp-form-feature-card lp-reveal">
            <div className="lp-form-feature-copy">
              <span className="lp-form-feature-kicker">{FORM_FEATURE_STATUS_LABEL}</span>
              <h2><FeatureName />で、HTMLを<br />「見せる」から「受け取る」へ。</h2>
              <p className="lp-form-feature-tagline">{FORM_FEATURE_TAGLINE}</p>
              <p>{FORM_FEATURE_DESCRIPTION}</p>
              <div className="lp-form-feature-actions">
                <AppLink variant="outline">フォーム便を使ってみる <Icon name="arrow" size={16} /></AppLink>
              </div>
            </div>
            <div className="lp-form-feature-panel" aria-label="フォーム便の機能概要">
              <code>&lt;form data-giga-form=&quot;contact&quot;&gt;</code>
              <ul>
                {FORM_FEATURE_BULLETS.map((bullet) => <li key={bullet}><Icon name="check" size={15} />{bullet}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="lp-section lp-articles-section">
          <div className="lp-section-head lp-reveal"><h2>HTML共有の活用記事</h2><p>AI生成HTMLやZIPサイトを、安全にURL共有するための実務ガイドです。</p></div>
          <div className="lp-article-teaser-grid">
            {LANDING_ARTICLE_SUMMARIES.map((article) => (
              <article className="lp-article-teaser lp-reveal" key={article.path}>
                <span>{article.category}</span>
                <h3><a href={article.path}>{article.title}</a></h3>
                <p>{article.description}</p>
              </article>
            ))}
          </div>
          <div className="lp-article-more"><a className="lp-btn lp-btn-outline" href="/articles">活用記事をもっと見る <Icon name="arrow" size={16} /></a></div>
        </section>

        <section id="domain" className="lp-domain-section">
          <div className="lp-domain-card lp-reveal">
            <div>
              <h2><code className="lp-domain-token">@example.co.jp</code> の人だけが<br />見られるURLを作る。</h2>
              <div className="lp-domain-hint">自分の会社のドメインを入れるだけ。</div>
              <p>ホスティングではなく、<strong>仕事のための共有</strong>。会社ドメイン認証なら、相手にGoogle Workspaceの管理者権限を求めずに、閲覧できる人をメールドメインで絞れます。</p>
              <ul>
                <li><Icon name="check" size={17} />管理者設定が不要</li>
                <li><Icon name="check" size={17} />メール6桁コードで認証</li>
                <li><Icon name="check" size={17} />アクセスログ付き</li>
              </ul>
            </div>
            <div className="lp-domain-flow">
              <FlowItem icon="building" title="① 許可する会社ドメインを登録" text="@example.co.jp" />
              <FlowItem icon="mail" title="② 閲覧者がメールアドレスを入力" text="入力されたメールに6桁コードを送ります" />
              <FlowItem icon="check" title="③ 認証完了、そのまま閲覧OK" text="会社のメンバーだけが見られます" active />
            </div>
          </div>
        </section>

        <section id="pricing" className="lp-section lp-pricing-section">
          <div className="lp-section-head lp-reveal"><h2>シンプルな料金</h2><p>無料で1サイト公開。Proなら月額¥980で、サイト公開数無制限＋全機能が使えます。</p></div>
          <div className="lp-plan-grid">
            {plans.map((plan) => {
              const isPaidPlan = plan.name !== "無料";
              const isPreparing = isPaidPlan && !paidCheckout.enabled;
              const ctaVariant = plan.popular ? "solid" : "outline";
              return (
                <article className={`lp-price-card lp-reveal ${plan.popular ? "popular" : ""}`} key={plan.name}>
                  {plan.popular ? <span className="lp-popular">人気</span> : null}
                  <h3>{plan.name}</h3>
                  <div><strong>{plan.price}</strong><span>{plan.unit}</span></div>
                  <p>{plan.tagline}</p>
                  {isPreparing ? (
                    <span className="lp-tooltip-wrap" data-tooltip={paidCheckout.tooltip} title={paidCheckout.tooltip}>
                      <button type="button" className={`lp-btn lp-btn-${ctaVariant}`} disabled>
                        {plan.cta}
                      </button>
                    </span>
                  ) : (
                    <AppLink href={plan.href} variant={ctaVariant}>{plan.cta}</AppLink>
                  )}
                  <ul>{plan.features.map((feature) => <li key={feature}><Icon name="check" size={15} />{feature}</li>)}</ul>
                </article>
              );
            })}
          </div>
        </section>

        <section id="creator" className="lp-section lp-enterprise-section">
          <div className="lp-section-head lp-reveal">
            <h2>作っているのは、現場の開発者です</h2>
            <p>AIプロダクトを実際に作って公開している開発者が、技術と開発の過程を発信しています。</p>
          </div>
          <div className="lp-maker lp-reveal">
            <div className="lp-maker-intro">
              <strong>自分でツールを作って公開しています</strong>
              <p>ギガサイト便も、AI開発の現場から生まれたプロダクトです。開発の様子は各チャンネルで発信しています。</p>
            </div>
            <div className="lp-maker-cards">
              <a className="lp-maker-card" data-brand="github" href="https://github.com/kandotrun/kandotrun" target="_blank" rel="noreferrer">
                <span className="lp-maker-icon"><BrandIcon name="github" /></span>
                <span className="lp-maker-body"><strong>GitHub</strong><small>kandotrun</small><span>OSS・ツールを公開</span></span>
                <Icon name="arrow" size={16} />
              </a>
              <a className="lp-maker-card" data-brand="zenn" href="https://zenn.dev/nixo" target="_blank" rel="noreferrer">
                <span className="lp-maker-icon"><BrandIcon name="zenn" /></span>
                <span className="lp-maker-body"><strong>Zenn</strong><small>@nixo</small><span>技術記事を発信</span></span>
                <Icon name="arrow" size={16} />
              </a>
              <a className="lp-maker-card" data-brand="youtube" href="https://www.youtube.com/@nixo0" target="_blank" rel="noreferrer">
                <span className="lp-maker-icon"><BrandIcon name="youtube" /></span>
                <span className="lp-maker-body"><strong>YouTube</strong><small>@nixo0</small><span>開発・AI活用を発信</span></span>
                <Icon name="arrow" size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="lp-final-cta">
          <h2>AIで作ったHTML、<br />そのまま眠らせていませんか。</h2>
          <p>いまドロップするだけで、認証なしURLまたはパスワード付きURLを発行できます。</p>
          <div><AppLink size="large">無料でHTMLを公開する <Icon name="arrow" size={18} /></AppLink></div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-footer-grid">
          <div><strong><BrandName /></strong><p>AIで作ったHTMLを、認証付きURLで安全に共有。</p></div>
          <FooterColumn title="プロダクト" links={[["機能", "#features"], ["フォーム便", "#form-bin"], ["使い方", "#how"], ["料金", "#pricing"]]} />
          <FooterColumn title="活用・お問い合わせ" links={[["活用記事", "/articles"], ["会社ドメイン認証", "#domain"], ["開発者について", "#creator"], ["お問い合わせ", "/contact"]]} />
          <FooterColumn title="紹介記事" links={FEATURED_ARTICLE_LINKS.map((link) => [link.label, link.href])} external />
          <FooterColumn title="法務" links={LEGAL_LINKS.map((link) => [link.label, link.path])} />
        </div>
        <div className="lp-footer-bottom"><span>© 2026 2-38.com</span><code>giga-site.com</code></div>
      </footer>

      {published ? (
        <div className="lp-modal-backdrop" role="dialog" aria-modal="true" aria-label="公開しました" onClick={closePublishedModal}>
          <div className="lp-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="lp-modal-close" aria-label="閉じる" onClick={closePublishedModal}>×</button>
            <div className="lp-modal-emoji">🎉</div>
            <h3>公開しました！</h3>
            <p className="lp-modal-sub">{published.authMode === "password" ? "7日間・パスワード付き・noindex で公開中です。" : "7日間・認証なし・noindex で公開中です。"}</p>
            <div className="lp-modal-url">
              <input value={published.previewUrl} readOnly aria-label="公開URL" onFocus={(event) => event.currentTarget.select()} />
              <button type="button" className="lp-btn lp-btn-outline" onClick={() => void copyPublishedUrl(published.previewUrl)}>{copyUrlStatus}</button>
            </div>
            <div className="lp-modal-password">
              <strong>URLにパスワードをかける</strong>
              <small>アップロード後でも、このURLをパスワード付きにできます。ログインは不要です。</small>
              <div>
                <input
                  type="password"
                  value={modalPassword}
                  onChange={(event) => {
                    setModalPassword(event.target.value);
                    setPasswordSetupError("");
                    setPasswordSetupMessage("");
                  }}
                  placeholder="共有パスワード（6文字以上）"
                  aria-label="共有パスワード"
                  disabled={passwordSaving || published.authMode === "password"}
                />
                <button
                  type="button"
                  className="lp-btn lp-btn-outline"
                  disabled={passwordSaving || published.authMode === "password"}
                  onClick={() => void savePublishedPassword()}
                >
                  {published.authMode === "password" ? "設定済み" : passwordSaving ? "設定中…" : "設定する"}
                </button>
              </div>
              {passwordSetupError ? <p className="lp-modal-password-error">{passwordSetupError}</p> : null}
              {passwordSetupMessage ? <p className="lp-modal-password-success">{passwordSetupMessage}</p> : null}
            </div>
            <div className="lp-modal-actions">
              <a className="lp-btn lp-btn-solid lp-btn-lg" href={published.previewUrl} target="_blank" rel="noreferrer">サイトを開く <Icon name="arrow" size={16} /></a>
              <a className="lp-btn lp-btn-outline lp-btn-lg" href="/app/">アカウント登録・ログインして編集</a>
            </div>
            <p className="lp-modal-note">{claimStored ? "期限延長・URL変更・詳細な認証設定にはアカウントが必要です。登録/ログイン後、このサイトが自動であなたのアカウントに紐づきます。" : "期限延長・URL変更・詳細な認証設定にはアカウントが必要です。このブラウザでは自動紐づけを保存できませんでした。"}</p>
          </div>
        </div>
      ) : null}

      {securityWarnings.length > 0 && !published ? (
        <div className="lp-modal-backdrop" role="dialog" aria-modal="true" aria-label="セキュリティ警告" onClick={() => setSecurityWarnings([])}>
          <div className="lp-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="lp-modal-close" aria-label="閉じる" onClick={() => setSecurityWarnings([])}>×</button>
            <div className="lp-modal-emoji">⚠️</div>
            <h3>セキュリティ警告</h3>
            <p className="lp-modal-sub">このHTMLに次の懸念が見つかりました。</p>
            <ul className="lp-modal-warnings">
              {securityWarnings.map((warning) => (
                <li key={warning}>{warningSummary([warning])}</li>
              ))}
            </ul>
            <div className="lp-modal-actions">
              <button
                type="button"
                className="lp-btn lp-btn-solid lp-btn-lg"
                disabled={publishing}
                onClick={() => {
                  const file = lastFileRef.current;
                  if (file) void handleInstantPublish(file, true);
                }}
              >
                {publishing ? "公開中…" : "内容を理解して公開する"}
              </button>
              <button type="button" className="lp-btn lp-btn-outline lp-btn-lg" onClick={() => setSecurityWarnings([])}>やめる</button>
            </div>
            <p className="lp-modal-note">問題のあるHTMLを公開すると閲覧者に被害が及ぶ可能性があります。内容に責任を持てる場合のみ公開してください。</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FlowItem({ icon, title, text, active }: { icon: IconName; title: string; text: string; active?: boolean }) {
  return <div className={`lp-flow-item ${active ? "active" : ""}`}><span><Icon name={icon} /></span><div><strong>{title}</strong><small>{text}</small></div></div>;
}

function FooterColumn({ title, links, external = false }: { title: string; links: [string, string][]; external?: boolean }) {
  return <div><h4>{title}</h4>{links.map(([label, href]) => <a href={href} key={label} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{label}</a>)}</div>;
}
