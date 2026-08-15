import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RevisionCommentAnchorRect, RevisionCommentStatus, RevisionCommentSummary, SiteSummary } from "../../../shared/types";
import { api, ApiClientError } from "../api";
import { formatDateTime } from "../format";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Select, Textarea } from "../../ui/controls";
import { Dialog } from "../../ui/Dialog";
import { CheckIcon, ExternalLinkIcon, InfoIcon, TrashIcon } from "../../ui/icons";
import { PlanUpgradeNotice } from "./PlanUpgradeNotice";
import { REVIEW_COMMENTS_MIN_PLAN_LABEL } from "../../../shared/plans";

function isPlanRequired(err: unknown): boolean {
  return err instanceof ApiClientError && err.status === 403 && err.message === "plan_required";
}

interface ReviewCommentsPanelProps {
  site: SiteSummary;
  setStatus: (message: string) => void;
  onError: (raw: string) => void;
}

interface PickedAnchor {
  selector: string | null;
  textSnippet: string | null;
  anchorRect: RevisionCommentAnchorRect | null;
}

const STATUS_ORDER: RevisionCommentStatus[] = ["open", "in_progress", "resolved"];
const STATUS_LABELS: Record<RevisionCommentStatus, string> = {
  open: "未対応",
  in_progress: "対応中",
  resolved: "解決済み"
};

function statusBadgeStyle(status: RevisionCommentStatus): { background: string; color: string } {
  if (status === "resolved") return { background: "color-mix(in oklab, var(--success) 16%, var(--background))", color: "var(--success)" };
  if (status === "in_progress") return { background: "color-mix(in oklab, #d97706 18%, var(--background))", color: "#b45309" };
  return { background: "color-mix(in oklab, var(--ac) 16%, var(--background))", color: "var(--ac)" };
}

function previewOriginOf(previewUrl: string): string {
  try {
    return new URL(previewUrl, window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
}

export function ReviewCommentsPanel({ site, setStatus, onError }: ReviewCommentsPanelProps) {
  const revisionId = site.currentRevisionId;
  const previewOrigin = useMemo(() => previewOriginOf(site.previewUrl), [site.previewUrl]);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);
  const [comments, setComments] = useState<RevisionCommentSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [picked, setPicked] = useState<PickedAnchor | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [hideResolved, setHideResolved] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const reportError = useCallback(
    (err: unknown) => onError(err instanceof ApiClientError ? err.message : "request_failed"),
    [onError]
  );

  const loadComments = useCallback(async () => {
    if (!revisionId) return;
    setLoading(true);
    try {
      const res = await api.comments(site.id, revisionId);
      setComments(res.comments);
    } catch (err) {
      if (isPlanRequired(err)) {
        setLocked(true);
        return;
      }
      reportError(err);
    } finally {
      setLoading(false);
    }
  }, [site.id, revisionId, reportError]);

  // Load comments and a fresh, owner-scoped review URL when the current revision changes.
  useEffect(() => {
    if (!revisionId) return;
    let cancelled = false;
    setFrameReady(false);
    void loadComments();
    void api
      .reviewUrl(site.id, revisionId)
      .then((res) => {
        if (!cancelled) setReviewUrl(res.reviewUrl);
      })
      .catch((err) => {
        if (cancelled || isPlanRequired(err)) return;
        reportError(err);
      });
    return () => {
      cancelled = true;
    };
  }, [site.id, revisionId, loadComments, reportError]);

  const postToFrame = useCallback(
    (message: unknown) => {
      frameRef.current?.contentWindow?.postMessage(message, previewOrigin);
    },
    [previewOrigin]
  );

  const sendAnchors = useCallback(
    (list: RevisionCommentSummary[]) => {
      postToFrame({
        type: "giga-review:setAnchors",
        anchors: list.map((c) => ({ id: c.id, selector: c.selector, anchorRect: c.anchorRect, status: c.status }))
      });
    },
    [postToFrame]
  );

  // Bridge: only trust messages from the preview origin (untrusted page can post, but cannot
  // reach the admin API — comment writes go through the admin-origin, CSRF-protected client).
  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      if (ev.origin !== previewOrigin) return;
      const data = ev.data as { type?: string; add?: boolean; id?: string } & PickedAnchor;
      if (!data || typeof data.type !== "string") return;
      if (data.type === "giga-review:ready") {
        setFrameReady(true);
      } else if (data.type === "giga-review:picked") {
        setAddMode(false);
        setPicked({ selector: data.selector ?? null, textSnippet: data.textSnippet ?? null, anchorRect: data.anchorRect ?? null });
        setDraft("");
      } else if (data.type === "giga-review:mode") {
        setAddMode(Boolean(data.add));
      } else if (data.type === "giga-review:focus" && data.id) {
        setFocusedId(data.id);
        document.getElementById(`gs-comment-${data.id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [previewOrigin]);

  // Redraw pins whenever the comment set changes and the frame is ready.
  useEffect(() => {
    if (frameReady) sendAnchors(comments);
  }, [comments, frameReady, sendAnchors]);

  function startPick() {
    setAddMode(true);
    postToFrame({ type: "giga-review:setMode", add: true });
  }

  function cancelPick() {
    setAddMode(false);
    setPicked(null);
    postToFrame({ type: "giga-review:setMode", add: false });
  }

  async function submitComment() {
    if (!revisionId || !picked) return;
    const text = draft.trim();
    if (!text) return;
    setSaving(true);
    try {
      const res = await api.createComment(site.id, {
        revisionId,
        body: text,
        selector: picked.selector,
        textSnippet: picked.textSnippet,
        anchorRect: picked.anchorRect
      });
      const next = [...comments, res.comment];
      setComments(next);
      sendAnchors(next);
      setPicked(null);
      setDraft("");
      setStatus("コメントを追加しました");
    } catch (err) {
      reportError(err);
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(comment: RevisionCommentSummary, status: RevisionCommentStatus) {
    try {
      const res = await api.updateComment(site.id, comment.id, { status });
      const next = comments.map((c) => (c.id === comment.id ? res.comment : c));
      setComments(next);
      sendAnchors(next);
    } catch (err) {
      reportError(err);
    }
  }

  async function removeComment(comment: RevisionCommentSummary) {
    try {
      await api.deleteComment(site.id, comment.id);
      const next = comments.filter((c) => c.id !== comment.id);
      setComments(next);
      sendAnchors(next);
      setStatus("コメントを削除しました");
    } catch (err) {
      reportError(err);
    }
  }

  if (locked) {
    return <PlanUpgradeNotice feature="要素紐づけコメント" planLabel={REVIEW_COMMENTS_MIN_PLAN_LABEL} />;
  }

  if (!revisionId) {
    return (
      <div className="ds-card">
        <div className="ds-card__body">
          <div className="gs-empty" style={{ padding: "60px 20px" }}>
            HTML をアップロードすると、プレビュー上でコメントを残せるようになります。
          </div>
        </div>
      </div>
    );
  }

  const visibleComments = hideResolved ? comments.filter((c) => c.status !== "resolved") : comments;
  const openCount = comments.filter((c) => c.status !== "resolved").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Button onClick={startPick} disabled={addMode}>
            <InfoIcon size={15} />
            {addMode ? "要素をクリックしてください..." : "要素を選択してコメント"}
          </Button>
          {addMode ? (
            <Button variant="ghost" size="sm" onClick={cancelPick}>
              キャンセル
            </Button>
          ) : null}
          <span className="gs-muted" style={{ fontSize: 12 }}>未解決 {openCount} 件 / 全 {comments.length} 件</span>
        </div>
        <label className="gs-muted" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, cursor: "pointer" }}>
          <input type="checkbox" checked={hideResolved} onChange={(e) => setHideResolved(e.currentTarget.checked)} style={{ width: "auto", minHeight: 0 }} />
          解決済みを隠す
        </label>
      </div>

      <div className="gs-review-grid">
        <div className="gs-preview">
          <div className="gs-preview-bar">
            <i /><i /><i />
            <span style={{ marginLeft: 8, fontSize: 12 }} className="gs-muted">レビュー（現在の公開世代）</span>
            <a href={site.previewUrl} target="_blank" rel="noreferrer" className="gs-muted" style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12 }}>
              <ExternalLinkIcon size={12} /> 公開ページ
            </a>
          </div>
          {reviewUrl ? (
            <iframe
              ref={frameRef}
              className="gs-preview-frame"
              src={reviewUrl}
              title={`${site.title} レビュー`}
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          ) : (
            <div className="gs-empty" style={{ padding: "80px 20px" }}>レビューを準備中...</div>
          )}
        </div>

        <div className="ds-card" style={{ alignSelf: "start" }}>
          <div className="ds-card__head">
            <h3 style={{ fontSize: 15 }}>コメント</h3>
          </div>
          <div style={{ padding: "10px 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {loading ? (
              <div className="gs-empty">読み込み中...</div>
            ) : visibleComments.length === 0 ? (
              <div className="gs-empty" style={{ padding: "30px 12px" }}>
                {comments.length === 0 ? "「要素を選択してコメント」からレビューを始めましょう。" : "表示できるコメントがありません。"}
              </div>
            ) : (
              visibleComments.map((comment, index) => (
                <div
                  key={comment.id}
                  id={`gs-comment-${comment.id}`}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: 12,
                    background: focusedId === comment.id ? "color-mix(in oklab, var(--ac) 7%, var(--card))" : "var(--card)",
                    transition: "background 150ms ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span
                      style={{
                        display: "inline-grid",
                        placeContent: "center",
                        minWidth: 20,
                        height: 20,
                        padding: "0 6px",
                        borderRadius: 10,
                        background: statusBadgeStyle(comment.status).color,
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700
                      }}
                    >
                      {index + 1}
                    </span>
                    <Badge {...statusBadgeStyle(comment.status)}>{STATUS_LABELS[comment.status]}</Badge>
                    <span className="gs-muted gs-mono" style={{ marginLeft: "auto", fontSize: 12 }}>{formatDateTime(comment.createdAt)}</span>
                  </div>
                  {comment.textSnippet ? (
                    <p className="gs-muted gs-mono" style={{ fontSize: 12, margin: "0 0 6px", lineHeight: 1.5, wordBreak: "break-word" }}>
                      「{comment.textSnippet}」
                    </p>
                  ) : null}
                  <p style={{ fontSize: 13, margin: "0 0 10px", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{comment.body}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Select
                      value={comment.status}
                      onChange={(e) => void changeStatus(comment, e.currentTarget.value as RevisionCommentStatus)}
                      style={{ height: 30, fontSize: 12, width: "auto", minHeight: 0 }}
                    >
                      {STATUS_ORDER.map((status) => (
                        <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                      ))}
                    </Select>
                    {comment.status !== "resolved" ? (
                      <Button variant="ghost" size="sm" onClick={() => void changeStatus(comment, "resolved")}>
                        <CheckIcon size={14} /> 解決
                      </Button>
                    ) : null}
                    <Button variant="ghost" size="sm" style={{ color: "var(--destructive)", marginLeft: "auto" }} onClick={() => void removeComment(comment)}>
                      <TrashIcon size={14} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Dialog open={Boolean(picked)} onClose={cancelPick}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 600 }}>コメントを追加</span>
          {picked?.textSnippet ? (
            <p className="gs-muted gs-mono" style={{ fontSize: 12, margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>
              対象: 「{picked.textSnippet}」
            </p>
          ) : (
            <p className="gs-muted" style={{ fontSize: 12, margin: 0 }}>選択した要素にコメントを紐づけます。</p>
          )}
        </div>
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.currentTarget.value)}
          placeholder="この見出しを変えたい、など"
          rows={4}
          autoFocus
          style={{ width: "100%" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button variant="ghost" onClick={cancelPick} disabled={saving}>
            キャンセル
          </Button>
          <Button onClick={() => void submitComment()} disabled={saving || !draft.trim()}>
            {saving ? "追加中..." : "追加する"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
