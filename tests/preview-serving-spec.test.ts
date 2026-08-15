import { describe, expect, it } from "vitest";
import { handlePreviewRequest } from "../src/worker/preview";

interface CapturedEvent {
  path: string;
  type: string;
  email: string | null;
}

interface StoredObject {
  body: string;
  contentType: string;
}

function makePreviewEnv(options: {
  site?: Record<string, unknown>;
  revisions?: Record<string, Record<string, unknown>>;
  tokenRevisionId?: string | null;
  comments?: Array<{ id: string; selector: string | null; anchor_rect_json: string | null; status: string | null; body?: string | null }>;
  objects?: Record<string, StoredObject>;
} = {}) {
  const site: Record<string, unknown> = {
    id: "site_1",
    owner_user_id: "owner_1",
    slug: "demo",
    title: "Demo Site",
    status: "active",
    auth_mode: "random",
    password_hash: null,
    allowed_email_domains: "[]",
    allowed_emails: "[]",
    indexing_enabled: 0,
    hide_branding: 0,
    tool: null,
    expires_at: null,
    current_revision_id: "rev_current",
    created_at: "2026-06-22T00:00:00.000Z",
    updated_at: "2026-06-22T00:00:00.000Z",
    deleted_at: null,
    ...options.site
  };
  const revisions: Record<string, Record<string, unknown>> = {
    rev_current: {
      id: "rev_current",
      site_id: "site_1",
      r2_prefix: "sites/site_1/revisions/rev_current",
      entry_path: "index.html",
      file_count: 1,
      total_bytes: 42,
      content_sha256: "sha-current",
      warnings_json: "[]",
      created_at: "2026-06-22T00:00:00.000Z",
      created_by: "owner_1",
      note: null,
      restored_from_revision_id: null
    },
    rev_old: {
      id: "rev_old",
      site_id: "site_1",
      r2_prefix: "sites/site_1/revisions/rev_old",
      entry_path: "index.html",
      file_count: 1,
      total_bytes: 42,
      content_sha256: "sha-old",
      warnings_json: "[]",
      created_at: "2026-06-21T00:00:00.000Z",
      created_by: "owner_1",
      note: null,
      restored_from_revision_id: null
    },
    ...(options.revisions ?? {})
  };
  const objects = new Map<string, StoredObject>(
    Object.entries(options.objects ?? {
      "sites/site_1/revisions/rev_current/index.html": { body: "<!doctype html><html><body><h1>Current</h1></body></html>", contentType: "text/html; charset=utf-8" },
      "sites/site_1/revisions/rev_old/index.html": { body: "<!doctype html><html><body><h1>Old</h1></body></html>", contentType: "text/html; charset=utf-8" },
      "sites/site_1/revisions/rev_current/assets/app.css": { body: "body{color:#111}", contentType: "text/css; charset=utf-8" }
    })
  );
  const events: CapturedEvent[] = [];
  const requestedObjectKeys: string[] = [];
  const comments = options.comments ?? [
    { id: "comment_1", selector: "main > h1", anchor_rect_json: JSON.stringify({ x: 10, y: 20, width: 100, height: 30, viewportWidth: 1280 }), status: "open" }
  ];

  const db = {
    prepare(sql: string) {
      let bound: unknown[] = [];
      const statement = {
        bind(...args: unknown[]) {
          bound = args;
          return statement;
        },
        async first<T = unknown>() {
          if (sql.includes("SELECT * FROM sites WHERE slug")) {
            return (bound[0] === site.slug ? { ...site } : null) as T;
          }
          if (sql.includes("SELECT revision_id FROM revision_preview_tokens")) {
            const token = String(bound[0]);
            return (token === "owner-preview-token" && options.tokenRevisionId ? { revision_id: options.tokenRevisionId } : null) as T;
          }
          if (sql.includes("SELECT * FROM revisions WHERE id = ? AND site_id = ?")) {
            const revision = revisions[String(bound[0])];
            return (revision && revision.site_id === bound[1] ? { ...revision } : null) as T;
          }
          if (sql.includes("SELECT id FROM viewer_sessions")) {
            return null as T;
          }
          return null as T;
        },
        async all<T = unknown>() {
          if (sql.includes("FROM site_revision_comments")) {
            return { results: comments as T[], success: true, meta: { changes: 0 } } as D1Result<T>;
          }
          return { results: [] as T[], success: true, meta: { changes: 0 } } as D1Result<T>;
        },
        async run() {
          if (sql.includes("INSERT INTO access_events")) {
            events.push({ path: String(bound[2]), type: String(bound[3]), email: bound[7] === null ? null : String(bound[7]) });
          }
          return { success: true, meta: { changes: 1 } } as D1Result;
        }
      } as unknown as D1PreparedStatement;
      return statement;
    },
    batch: async () => [],
    exec: async () => ({ count: 0, duration: 0 })
  } as unknown as D1Database;

  const bucket = {
    async get(key: string) {
      requestedObjectKeys.push(key);
      const item = objects.get(key);
      if (!item) return null;
      return {
        body: item.body,
        async text() {
          return item.body;
        },
        writeHttpMetadata(headers: Headers) {
          headers.set("Content-Type", item.contentType);
          headers.set("Content-Length", String(new TextEncoder().encode(item.body).byteLength));
        }
      } as unknown as R2ObjectBody;
    }
  } as unknown as R2Bucket;

  return {
    env: {
      DB: db,
      HTML_BUCKET: bucket,
      APP_HOST: "giga-site.com",
      APP_BASE_PATH: "/app",
      PREVIEW_HOST_SUFFIX: ".giga-site.com",
      SESSION_TTL_SECONDS: "86400"
    } as unknown as Env,
    events,
    requestedObjectKeys
  };
}

describe("preview serving as specification", () => {
  it("spec: 通常公開HTMLはnoindex/branding/閲覧eventを一緒に保証する", async () => {
    const { env, events } = makePreviewEnv();

    const response = await handlePreviewRequest(new Request("https://demo.giga-site.com/"), env);
    const html = await response.text();

    // 仕様: preview originのHTMLは検索許可を明示しない限りnoindex。公開ビューだけaccess_eventsへ記録する。
    expect(response.status).toBe(200);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    expect(html).toContain("Powered by ギガサイト便");
    expect(events).toEqual([{ path: "index.html", type: "view", email: null }]);
  });

  it("spec: ownerの過去世代preview tokenは閲覧認証をbypassするが、公開viewとして数えない", async () => {
    const { env, events } = makePreviewEnv({ site: { auth_mode: "password", password_hash: "pbkdf2$dummy" }, tokenRevisionId: "rev_old" });

    const response = await handlePreviewRequest(new Request("https://demo.giga-site.com/?__rev_preview=owner-preview-token"), env);
    const html = await response.text();

    // 仕様: owner previewは「管理者の確認」なのでパスワード画面ではなく対象revisionを返す。analyticsにも混ぜない。
    expect(response.status).toBe(200);
    expect(html).toContain("<h1>Old</h1>");
    expect(html).not.toContain("パスワードが必要です");
    expect(response.headers.get("Set-Cookie")).toContain("ai_slop_rev_preview=owner-preview-token");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    expect(events).toEqual([]);
  });

  it("spec: review overlayはvalid owner tokenと__reviewの両方がある時だけ注入し、comment本文は漏らさない", async () => {
    const { env } = makePreviewEnv({
      tokenRevisionId: "rev_old",
      comments: [
        { id: "comment_1", selector: "main > h1", anchor_rect_json: JSON.stringify({ x: 10, y: 20, width: 100, height: 30, viewportWidth: 1280 }), status: "open", body: "社外秘のコメント本文" }
      ]
    });

    const normal = await handlePreviewRequest(new Request("https://demo.giga-site.com/?__rev_preview=owner-preview-token"), env);
    const review = await handlePreviewRequest(new Request("https://demo.giga-site.com/?__rev_preview=owner-preview-token&__review=1"), env);
    const normalHtml = await normal.text();
    const reviewHtml = await review.text();

    // 仕様: 公開originへ渡すのはピン描画用のanchorだけ。コメント本文は管理API側に閉じる。
    expect(normalHtml).not.toContain("window.__GIGA_REVIEW__");
    expect(reviewHtml).toContain("window.__GIGA_REVIEW__");
    expect(reviewHtml).toContain("comment_1");
    expect(reviewHtml).toContain("main > h1");
    expect(reviewHtml).not.toContain("社外秘のコメント本文");
  });

  it("spec: URL encoded slash/backslashはR2 pathへ正規化せず404にする", async () => {
    const { env, requestedObjectKeys } = makePreviewEnv();

    const encodedSlash = await handlePreviewRequest(new Request("https://demo.giga-site.com/%2Fsecret.html"), env);
    const encodedBackslash = await handlePreviewRequest(new Request("https://demo.giga-site.com/%5Csecret.html"), env);

    // 仕様: decode後に / や \\ を含むsegmentはpath traversal相当としてR2 lookup前に拒否する。
    expect(encodedSlash.status).toBe(404);
    expect(encodedBackslash.status).toBe(404);
    expect(requestedObjectKeys).toEqual([]);
  });
});
