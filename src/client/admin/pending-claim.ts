import { ApiClientError } from "./api";
import { PENDING_CLAIM_STORAGE_KEY, type PendingClaim } from "../../shared/anon-publish";

type PendingClaimStorage = Pick<Storage, "getItem" | "removeItem"> | null | undefined;

function parsePendingClaim(raw: string | null): PendingClaim | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<PendingClaim>;
    if (!parsed || typeof parsed.claimToken !== "string" || !parsed.claimToken.trim()) {
      return null;
    }
    return {
      siteId: typeof parsed.siteId === "string" ? parsed.siteId : "",
      slug: typeof parsed.slug === "string" ? parsed.slug : "",
      previewUrl: typeof parsed.previewUrl === "string" ? parsed.previewUrl : "",
      claimToken: parsed.claimToken,
      expiresAt: typeof parsed.expiresAt === "number" ? parsed.expiresAt : undefined
    };
  } catch {
    return null;
  }
}

export function removePendingClaim(storage: PendingClaimStorage): void {
  if (!storage) return;
  try {
    storage.removeItem(PENDING_CLAIM_STORAGE_KEY);
  } catch {
    // localStorage can be unavailable in private browsing / hardened contexts.
  }
}

export function readPendingClaim(storage: PendingClaimStorage, now = Date.now()): PendingClaim | null {
  if (!storage) return null;
  let raw: string | null = null;
  try {
    raw = storage.getItem(PENDING_CLAIM_STORAGE_KEY);
  } catch {
    raw = null;
  }
  const pending = parsePendingClaim(raw);
  if (!pending || (typeof pending.expiresAt === "number" && pending.expiresAt < now)) {
    if (raw) removePendingClaim(storage);
    return null;
  }
  return pending;
}

export function claimErrorIsTerminal(error: unknown): boolean {
  if (!(error instanceof ApiClientError)) {
    return false;
  }
  return error.status === 404 || error.status === 409 || error.message === "claim_token_invalid" || error.message === "already_claimed";
}
