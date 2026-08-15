import { useState, type FormEvent } from "react";
import { BrandName } from "./BrandName";

interface ContactFormState {
  name: string;
  email: string;
  company: string;
  category: string;
  message: string;
  website: string;
}

const initialState: ContactFormState = {
  name: "",
  email: "",
  company: "",
  category: "question",
  message: "",
  website: ""
};

function initialCategoryFromUrl(): string {
  if (typeof window === "undefined") return "question";
  const raw = new URLSearchParams(window.location.search).get("type");
  return raw === "billing" || raw === "other" ? raw : "question";
}

export function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(() => ({ ...initialState, category: initialCategoryFromUrl() }));
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sourcePath: typeof window === "undefined" ? "/contact" : `${window.location.pathname}${window.location.search}` })
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || "contact_send_failed");
      }
      setStatus("sent");
      setForm({ ...initialState, category: initialCategoryFromUrl() });
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "contact_send_failed");
    }
  }

  return (
    <div className="lp-shell">
      <header className="lp-header">
        <div className="lp-header-inner">
          <a href="/" className="lp-brand"><BrandName /></a>
          <nav className="lp-nav" aria-label="Contact navigation">
            <a href="/#features">機能</a>
            <a href="/#pricing">料金</a>
            <a href="/articles">活用記事</a>
          </nav>
          <div className="lp-header-actions">
            <a className="lp-btn lp-btn-ghost lp-login-desktop" href="/app/">ログイン</a>
            <a className="lp-btn lp-btn-solid" href="/app/">無料で始める</a>
          </div>
        </div>
      </header>

      <main className="lp-contact-page">
        <section className="lp-contact-hero">
          <div>
            <span className="lp-contact-kicker">Contact</span>
            <h1>お問い合わせ</h1>
            <p>サービスの使い方、料金・請求、不具合の報告など、お気軽にお送りください。</p>
          </div>
        </section>

        <section className="lp-contact-grid">
          <form className="lp-contact-form" onSubmit={(event) => void submit(event)}>
            <label>
              お名前
              <input value={form.name} onChange={(event) => updateField("name", event.target.value)} autoComplete="name" required maxLength={80} />
            </label>
            <label>
              メールアドレス
              <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} autoComplete="email" required maxLength={120} />
            </label>
            <label>
              会社名（任意）
              <input value={form.company} onChange={(event) => updateField("company", event.target.value)} autoComplete="organization" maxLength={120} />
            </label>
            <label>
              種別
              <select value={form.category} onChange={(event) => updateField("category", event.target.value)}>
                <option value="question">サービスへの質問</option>
                <option value="billing">料金・請求</option>
                <option value="other">その他</option>
              </select>
            </label>
            <label className="lp-contact-full">
              お問い合わせ内容
              <textarea
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder="例: 公開したサイトの認証方式について教えてください。"
                required
                minLength={10}
                maxLength={4000}
                rows={8}
              />
            </label>
            <label className="lp-contact-honeypot" aria-hidden="true">
              Webサイト
              <input value={form.website} onChange={(event) => updateField("website", event.target.value)} tabIndex={-1} autoComplete="off" />
            </label>
            <div className="lp-contact-actions lp-contact-full">
              <button type="submit" className="lp-btn lp-btn-solid lp-btn-lg" disabled={status === "sending"}>
                {status === "sending" ? "送信中..." : "問い合わせを送信"}
              </button>
              {status === "sent" ? <p className="lp-contact-success">送信しました。</p> : null}
              {status === "error" ? <p className="lp-contact-error">送信できませんでした: {error}</p> : null}
            </div>
          </form>

          <div className="lp-contact-side">
            <article>
              <strong>よくある問い合わせ</strong>
              <ul>
                <li>認証方式（パスワード・メール・会社ドメイン）の使い方</li>
                <li>公開期限・URLの差し替え</li>
                <li>料金・請求・解約について</li>
                <li>不具合の報告・機能の要望</li>
              </ul>
            </article>
            <article>
              <strong>書いてほしいこと</strong>
              <ul>
                <li>対象のサイトURL（あれば）</li>
                <li>発生している状況</li>
                <li>利用中のブラウザ・端末</li>
              </ul>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
