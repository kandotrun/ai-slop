import { FormEvent, useState } from "react";
import { api, type AppUser } from "../api";
import { Button } from "../../ui/Button";
import { Input, Label } from "../../ui/controls";
import { BrandName } from "../../BrandName";

interface AuthScreenProps {
  initialMessage: string;
  onAuthenticated: (user: AppUser) => void;
}

export function AuthScreen({ initialMessage, onAuthenticated }: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (!challengeId) {
        setMessage("ワンタイムコードを送信中...");
        const response = await api.requestCode(email);
        setEmail(response.email);
        setChallengeId(response.challengeId);
        setMessage("メールに届いた6桁コードを入力してください。");
        return;
      }
      setMessage("コードを確認中...");
      const verified = await api.verifyCode(challengeId, email, code);
      onAuthenticated(verified.user);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "auth_failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="forge"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--surface)",
        padding: 24
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "min(420px, 100%)",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 28,
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <div>
          <h1 style={{ fontSize: 22 }}>{challengeId ? "ワンタイムコードを入力" : <><BrandName />を始める</>}</h1>
          <p className="gs-muted" style={{ fontSize: 14, marginTop: 6, lineHeight: 1.6 }}>
            {challengeId
              ? "メールに届いた6桁コードを入力してください。"
              : "メールアドレスだけで新規登録・ログインが完了します。パスワードは不要です。"}
          </p>
        </div>
        <div className="gs-field">
          <Label>メールアドレス</Label>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            disabled={Boolean(challengeId)}
            placeholder="you@example.com"
          />
        </div>
        {challengeId ? (
          <div className="gs-field">
            <Label>6桁コード</Label>
            <Input
              inputMode="numeric"
              pattern="[0-9]{6}"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              autoComplete="one-time-code"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.2em" }}
            />
          </div>
        ) : null}
        <Button type="submit" disabled={isSubmitting || (challengeId ? code.length !== 6 : email.trim().length === 0)}>
          {isSubmitting ? "処理中..." : challengeId ? "認証して始める" : "確認コードを送る"}
        </Button>
        {challengeId ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setChallengeId(null);
              setCode("");
              setMessage("メールアドレスを入力してください");
            }}
          >
            メールを変更
          </Button>
        ) : null}
        <p className="gs-muted" style={{ fontSize: 13, textAlign: "center" }}>
          {message}
        </p>
      </form>
    </div>
  );
}
