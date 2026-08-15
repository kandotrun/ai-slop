// Anonymous instant publish + claim shared contract (client + worker).

export const ANON_OWNER_USER_ID = "anon-public";

// localStorage key used to carry a freshly published anonymous site from the
// landing page through sign-up / login so it can be claimed afterwards.
export const PENDING_CLAIM_STORAGE_KEY = "gigasite.pendingClaim";

// How long an unclaimed anonymous site stays live.
export const ANON_PUBLISH_TTL_DAYS = 7;

// IP rate limits for anonymous publishing.
export const ANON_PUBLISH_MAX_PER_HOUR = 5;
export const ANON_PUBLISH_MAX_PER_DAY = 20;

export interface PublicPublishResponse {
  siteId: string;
  slug: string;
  previewUrl: string;
  claimToken: string;
  expiresAt: string;
  authMode: "random" | "password";
}

export interface PublicPublishPasswordResponse {
  siteId: string;
  authMode: "password";
}

export interface PendingClaim {
  siteId: string;
  slug: string;
  previewUrl: string;
  claimToken: string;
  // epoch ms after which the stored claim is ignored + cleared (shared-computer hygiene).
  expiresAt?: number;
}

// A pending claim is only honored for this long after publishing.
export const PENDING_CLAIM_TTL_MS = 60 * 60 * 1000;

export interface ClaimResponse {
  siteId: string;
}
