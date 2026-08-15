import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createApiApp } from "../src/worker/api";

const OWNER = "owner_test";

interface Captured {
  sql: string;
  bound: unknown[];
}

function app() {
  return createApiApp({
    sessionResolver: async () => ({
      user: { id: OWNER, email: "owner@example.test", name: "Owner" },
      session: { id: "session_test", userId: OWNER, token: "token", expiresAt: new Date(Date.now() + 60000), createdAt: new Date(), updatedAt: new Date() }
    })
  });
}

function makeEnv(captured: Captured[], seed: Record<string, unknown>[] = [], plan: string | null = "agency"): Env {
  const list: Record<string, unknown>[] = seed.map((row) => ({ ...row }));
  const db = {
    prepare(sql: string) {
      let bound: unknown[] = [];
      const statement = {
        bind(...args: unknown[]) {
          bound = args;
          return statement;
        },
        async first<T = unknown>() {
          if (sql.includes("SELECT id FROM sites WHERE id = ? AND owner_user_id = ?")) {
            return bound[0] === "s1" && bound[1] === OWNER ? ({ id: "s1" } as T) : (null as T);
          }
          if (sql.includes("SELECT id FROM revisions WHERE id = ? AND site_id = ?")) {
            return bound[0] === "rev1" && bound[1] === "s1" ? ({ id: "rev1" } as T) : (null as T);
          }
          if (sql.includes("SELECT * FROM site_revision_comments WHERE id = ? AND site_id = ?")) {
            const row = list.find((c) => c.id === bound[0] && c.site_id === bound[1]);
            return (row ? { ...row } : null) as T;
          }
          if (sql.includes("FROM billing_subscriptions")) {
            return (plan ? { plan_id: plan, status: "active", current_period_end: null, cancel_at_period_end: 0, stripe_customer_id: null } : null) as T;
          }
          return null as T;
        },
        async all<T = unknown>() {
          if (sql.includes("FROM site_revision_comments WHERE site_id = ? AND revision_id = ?")) {
            return { results: list.filter((c) => c.site_id === bound[0] && c.revision_id === bound[1]) as T[], success: true, meta: { changes: 0 } } as D1Result<T>;
          }
          if (sql.includes("FROM site_revision_comments WHERE site_id = ?")) {
            return { results: list.filter((c) => c.site_id === bound[0]) as T[], success: true, meta: { changes: 0 } } as D1Result<T>;
          }
          return { results: [] as T[], success: true, meta: { changes: 0 } } as D1Result<T>;
        },
        async run() {
          captured.push({ sql, bound });
          if (sql.startsWith("INSERT INTO site_revision_comments")) {
            list.push({
              id: bound[0], site_id: bound[1], revision_id: bound[2], author_user_id: bound[3], selector: bound[4],
              text_snippet: bound[5], anchor_rect_json: bound[6], body: bound[7], status: bound[8], created_at: bound[9], updated_at: bound[10]
            });
            return { success: true, meta: { changes: 1 } } as D1Result;
          }
          if (sql.startsWith("UPDATE site_revision_comments")) {
            const row = list.find((c) => c.id === bound[3] && c.site_id === bound[4]);
            if (row) {
              row.body = bound[0];
              row.status = bound[1];
              row.updated_at = bound[2];
            }
            return { success: true, meta: { changes: row ? 1 : 0 } } as D1Result;
          }
          if (sql.startsWith("DELETE FROM site_revision_comments")) {
            const index = list.findIndex((c) => c.id === bound[0] && c.site_id === bound[1]);
            if (index >= 0) list.splice(index, 1);
            return { success: true, meta: { changes: index >= 0 ? 1 : 0 } } as D1Result;
          }
          return { success: true, meta: { changes: 1 } } as D1Result;
        }
      } as unknown as D1PreparedStatement;
      return statement;
    },
    batch: async () => [],
    exec: async () => ({ count: 0, duration: 0 })
  } as unknown as D1Database;
  return { DB: db, APP_HOST: "giga-site.com", APP_BASE_PATH: "/app", PREVIEW_HOST_SUFFIX: ".giga-site.com" } as unknown as Env;
}

function postJson(path: string, body: unknown) {
  return new Request(`https://giga-site.com${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}
function patchJson(path: string, body: unknown) {
  return new Request(`https://giga-site.com${path}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}

function seededComment(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: "c1", site_id: "s1", revision_id: "rev1", author_user_id: OWNER,
    selector: "main > h1", text_snippet: "見出し", anchor_rect_json: JSON.stringify({ x: 10, y: 20, width: 100, height: 30, viewportWidth: 1280 }),
    body: "ここを直したい", status: "open", created_at: "2026-06-22T00:00:00.000Z", updated_at: "2026-06-22T00:00:00.000Z",
    ...overrides
  };
}

describe("revision comments CRUD (issue #138)", () => {
  it("creates an element-anchored comment tied to a revision", async () => {
    const captured: Captured[] = [];
    const res = await app().fetch(
      postJson("/api/sites/s1/comments", { revisionId: "rev1", body: "  この見出しを変えたい  ", selector: "main > h1", textSnippet: "見出し", anchorRect: { x: 12, y: 34, width: 200, height: 40, viewportWidth: 1280 } }),
      makeEnv(captured)
    );
    const body = (await res.json()) as { comment: { id: string; revisionId: string; status: string; body: string; selector: string; anchorRect: { x: number } } };

    expect(res.status).toBe(201);
    expect(body.comment.revisionId).toBe("rev1");
    expect(body.comment.status).toBe("open");
    expect(body.comment.body).toBe("この見出しを変えたい");
    expect(body.comment.selector).toBe("main > h1");
    expect(body.comment.anchorRect.x).toBe(12);

    const insert = captured.find((c) => c.sql.startsWith("INSERT INTO site_revision_comments"));
    expect(insert?.bound[3]).toBe(OWNER);
  });

  it("spec: コメントのアンカー情報は表示用に必要な最小範囲へ丸め、壊れた矩形は保存しない", async () => {
    const captured: Captured[] = [];
    // 仕様: プレビューoriginへ渡すアンカーはselector/snippet/status/rectだけ。長すぎる文字列や壊れたrectでDBを汚さない。
    const res = await app().fetch(
      postJson("/api/sites/s1/comments", {
        revisionId: "rev1",
        body: "ピン位置の仕様を固定",
        selector: `main ${".very-long".repeat(130)}`,
        textSnippet: "あ".repeat(250),
        anchorRect: { x: 12, y: 34, width: "invalid", height: 40, viewportWidth: 1280 },
        status: "unexpected_status"
      }),
      makeEnv(captured)
    );
    const body = (await res.json()) as { comment: { status: string; selector: string; textSnippet: string; anchorRect: null } };

    expect(res.status).toBe(201);
    expect(body.comment.status).toBe("open");
    expect(body.comment.selector).toHaveLength(1000);
    expect(body.comment.textSnippet).toHaveLength(200);
    expect(body.comment.anchorRect).toBeNull();

    const insert = captured.find((c) => c.sql.startsWith("INSERT INTO site_revision_comments"));
    expect(String(insert?.bound[4])).toHaveLength(1000);
    expect(String(insert?.bound[5])).toHaveLength(200);
    expect(insert?.bound[6]).toBeNull();
    expect(insert?.bound[8]).toBe("open");
  });

  it("spec: コメント本文は空・4000文字超過を永続化前に拒否する", async () => {
    const captured: Captured[] = [];
    const env = makeEnv(captured);

    const noRevision = await app().fetch(postJson("/api/sites/s1/comments", { body: "本文だけ" }), env);
    expect(noRevision.status).toBe(400);
    expect(((await noRevision.json()) as { error: string }).error).toBe("revision_required");

    const tooLong = await app().fetch(postJson("/api/sites/s1/comments", { revisionId: "rev1", body: "x".repeat(4001) }), env);
    expect(tooLong.status).toBe(400);
    expect(((await tooLong.json()) as { error: string }).error).toBe("comment_too_long");
    expect(captured.find((c) => c.sql.startsWith("INSERT INTO site_revision_comments"))).toBeUndefined();
  });

  it("rejects an empty body and an unknown revision", async () => {
    const empty = await app().fetch(postJson("/api/sites/s1/comments", { revisionId: "rev1", body: "   " }), makeEnv([]));
    expect(empty.status).toBe(400);
    expect(((await empty.json()) as { error: string }).error).toBe("comment_body_required");

    const badRevision = await app().fetch(postJson("/api/sites/s1/comments", { revisionId: "ghost", body: "test" }), makeEnv([]));
    expect(badRevision.status).toBe(404);
    expect(((await badRevision.json()) as { error: string }).error).toBe("revision_not_found");
  });

  it("lists comments for a revision", async () => {
    const res = await app().fetch(new Request("https://giga-site.com/api/sites/s1/comments?revisionId=rev1"), makeEnv([], [seededComment(), seededComment({ id: "c2", body: "別のコメント" })]));
    const body = (await res.json()) as { comments: Array<{ id: string }> };
    expect(res.status).toBe(200);
    expect(body.comments.map((c) => c.id)).toEqual(["c1", "c2"]);
  });

  it("updates a comment status and body", async () => {
    const captured: Captured[] = [];
    const env = makeEnv(captured, [seededComment()]);
    const statusRes = await app().fetch(patchJson("/api/sites/s1/comments/c1", { status: "resolved" }), env);
    const statusBody = (await statusRes.json()) as { comment: { status: string } };
    expect(statusRes.status).toBe(200);
    expect(statusBody.comment.status).toBe("resolved");

    const bodyRes = await app().fetch(patchJson("/api/sites/s1/comments/c1", { body: "修正済みの内容" }), env);
    const bodyBody = (await bodyRes.json()) as { comment: { body: string } };
    expect(bodyBody.comment.body).toBe("修正済みの内容");
  });

  it("deletes a comment and 404s when it is gone", async () => {
    const env = makeEnv([], [seededComment()]);
    const del = await app().fetch(new Request("https://giga-site.com/api/sites/s1/comments/c1", { method: "DELETE" }), env);
    expect(del.status).toBe(200);
    const again = await app().fetch(new Request("https://giga-site.com/api/sites/s1/comments/c1", { method: "DELETE" }), env);
    expect(again.status).toBe(404);
  });

  it("returns 404 for a site the user does not own", async () => {
    const res = await app().fetch(postJson("/api/sites/not-mine/comments", { revisionId: "rev1", body: "x" }), makeEnv([]));
    expect(res.status).toBe(404);
    expect(((await res.json()) as { error: string }).error).toBe("site_not_found");
  });

  it("requires a Pro plan (free owners get plan_required, paid plans pass)", async () => {
    const free = await app().fetch(new Request("https://giga-site.com/api/sites/s1/comments?revisionId=rev1"), makeEnv([], [], null));
    expect(free.status).toBe(403);
    expect(((await free.json()) as { error: string }).error).toBe("plan_required");

    const pro = await app().fetch(new Request("https://giga-site.com/api/sites/s1/comments?revisionId=rev1"), makeEnv([], [], "pro"));
    expect(pro.status).toBe(200);

    // Legacy paid plans are grandfathered to Pro-level feature access.
    const personalPro = await app().fetch(new Request("https://giga-site.com/api/sites/s1/comments?revisionId=rev1"), makeEnv([], [], "personal_pro"));
    expect(personalPro.status).toBe(200);
  });
});

describe("review overlay security contracts", () => {
  it("injects the review overlay only behind an owner token + explicit review flag", () => {
    const preview = readFileSync("src/worker/preview.ts", "utf8");
    expect(preview).toContain("injectReviewOverlay");
    // overlay requires BOTH a valid revision-preview token and the __review flag
    expect(preview).toMatch(/isRevisionPreview[\s\S]{0,120}__review/);
  });

  it("never leaks comment bodies into the untrusted preview origin (anchors only)", () => {
    const preview = readFileSync("src/worker/preview.ts", "utf8");
    const anchorQuery = preview.slice(preview.indexOf("loadReviewAnchors"));
    const select = anchorQuery.slice(anchorQuery.indexOf("SELECT"), anchorQuery.indexOf("FROM site_revision_comments"));
    expect(select).toContain("id");
    expect(select).toContain("selector");
    expect(select).toContain("status");
    expect(select).not.toContain("body");
    // injected JSON escapes "<" so it cannot break out of the script tag
    expect(preview).toContain('.replace(/</g, "\\\\u003c")');
  });

  it("validates postMessage origin in the admin review panel", () => {
    const panel = readFileSync("src/client/admin/screens/ReviewCommentsPanel.tsx", "utf8");
    expect(panel).toContain("ev.origin !== previewOrigin");
    expect(panel).toContain("allow-same-origin");
  });
});
