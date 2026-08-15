import type {
  AccessEventSummary,
  AuthMode,
  BillingInvoiceSummary,
  BillingPaymentMethodSummary,
  BillingPlanSummary,
  BillingSubscriptionSummary,
  DashboardStats,
  FormSubmissionDetail,
  FormSubmissionSummary,
  RevisionCommentAnchorRect,
  RevisionCommentStatus,
  RevisionCommentSummary,
  RevisionHistoryItem,
  RevisionHistoryResponse,
  RevisionPreviewResponse,
  SiteSummary,
  SiteTool
} from "../../shared/types";
import type { ClaimResponse, PublicPublishPasswordResponse, PublicPublishResponse } from "../../shared/anon-publish";
import { measurementHeaders } from "../measurement";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

export interface HealthResponse {
  ok: boolean;
  service: string;
}

export interface AuthBootstrapResponse {
  authMethod: "email_otp";
  signupOpen: boolean;
}

export interface RequestCodeResponse {
  challengeId: string;
  expiresAt: string;
  email: string;
}

export interface RevisionResult {
  id: string;
  warnings: string[];
  previewUrl: string;
  byteLength: number;
  fileCount: number;
  entryPath: string;
}

export interface ApiErrorDetails {
  warnings?: string[];
  canOverride?: boolean;
  overrideField?: string;
  [key: string]: unknown;
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly details: ApiErrorDetails | undefined;

  constructor(message: string, status: number, details?: ApiErrorDetails) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

export interface StripeConfig {
  paidCheckoutEnabled: boolean;
  paidCheckoutDisabledTooltip: string | null;
}

export interface AgentUploadToken {
  id: string;
  token: string;
  uploadUrl: string;
  statusUrl: string;
  expiresAt: string;
  maxBytes: number;
  maxFiles: number;
  siteConfig: {
    title: string;
    slug: string | null;
    authMode: AuthMode;
    allowedEmailDomains: string[];
    expiresAt: string | null;
    indexingEnabled: boolean;
  };
}

export interface SiteCreateBody {
  title: string;
  slug?: string;
  authMode: AuthMode;
  password?: string;
  allowedEmailDomains?: string;
  allowedEmails?: string;
  expiresAt?: string;
  indexingEnabled?: boolean;
  tool?: SiteTool;
}

export interface SiteUpdateBody {
  slug?: string;
  indexingEnabled?: boolean;
  hideBranding?: boolean;
  authMode?: AuthMode;
  password?: string;
  allowedEmailDomains?: string;
  allowedEmails?: string;
}

export interface SlugAvailabilityResponse {
  available: boolean;
  normalizedSlug: string | null;
  reason: string | null;
}

export type RevisionBody =
  | { html: string; securityOverrideAccepted?: boolean }
  | { files: { path: string; content: string; encoding: "base64"; contentType: string; byteLength: number }[]; entryPath: string; securityOverrideAccepted?: boolean };

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(input, {
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", ...measurementHeaders(), ...(init?.headers ?? {}) },
      ...init
    });
  } catch {
    throw new Error("サーバーに接続できませんでした");
  }

  const raw = await response.text();
  let json: unknown = null;
  if (raw) {
    try {
      json = JSON.parse(raw);
    } catch {
      // Non-JSON body (e.g. an HTML error/fallback page when the API is unreachable).
      throw new Error(response.ok ? "サーバーに接続できませんでした" : `request_failed_${response.status}`);
    }
  }
  if (!response.ok) {
    const maybeError = json && typeof json === "object" && "error" in json ? String((json as { error: unknown }).error) : undefined;
    const details = json && typeof json === "object" && "details" in json && (json as { details: unknown }).details !== null && typeof (json as { details: unknown }).details === "object"
      ? ((json as { details: ApiErrorDetails }).details)
      : undefined;
    throw new ApiClientError(maybeError ?? `request_failed_${response.status}`, response.status, details);
  }
  return json as T;
}

export const api = {
  health: () => fetchJson<HealthResponse>("/api/health"),
  bootstrap: () => fetchJson<AuthBootstrapResponse>("/api/auth/bootstrap"),
  me: () => fetchJson<{ user: AppUser }>("/api/me"),
  requestCode: (email: string) =>
    fetchJson<RequestCodeResponse>("/api/auth/request-code", { method: "POST", body: JSON.stringify({ email }) }),
  verifyCode: (challengeId: string, email: string, code: string) =>
    fetchJson<{ user: AppUser }>("/api/auth/verify-code", { method: "POST", body: JSON.stringify({ challengeId, email, code }) }),
  signOut: () => fetchJson<{ success: boolean }>("/api/auth/sign-out", { method: "POST" }),

  dashboard: () => fetchJson<{ stats: DashboardStats }>("/api/dashboard"),
  sites: () => fetchJson<{ sites: SiteSummary[] }>("/api/sites"),
  site: (siteId: string) => fetchJson<{ site: SiteSummary }>(`/api/sites/${siteId}`),
  slugAvailability: (slug: string, currentSiteId?: string) => {
    const params = new URLSearchParams({ slug });
    if (currentSiteId) params.set("currentSiteId", currentSiteId);
    return fetchJson<SlugAvailabilityResponse>(`/api/slugs/availability?${params.toString()}`);
  },
  createSite: (body: SiteCreateBody) => fetchJson<{ site: SiteSummary }>("/api/sites", { method: "POST", body: JSON.stringify(body) }),
  createSiteWithRevision: (body: SiteCreateBody & RevisionBody) =>
    fetchJson<{ site: SiteSummary; revision: RevisionResult }>("/api/sites-with-revision", { method: "POST", body: JSON.stringify(body) }),
  publishAnonymous: (body: RevisionBody & { title?: string; authMode?: "random" | "password"; password?: string }) =>
    fetchJson<PublicPublishResponse>("/api/public/publish", { method: "POST", body: JSON.stringify(body) }),
  setAnonymousPublishPassword: (body: { siteId: string; claimToken: string; password: string }) =>
    fetchJson<PublicPublishPasswordResponse>("/api/public/publish-password", { method: "POST", body: JSON.stringify(body) }),
  claimSite: (claimToken: string) =>
    fetchJson<ClaimResponse>("/api/sites/claim", { method: "POST", body: JSON.stringify({ claimToken }) }),
  updateSite: (siteId: string, body: SiteUpdateBody) =>
    fetchJson<{ site: SiteSummary }>(`/api/sites/${siteId}`, { method: "PATCH", body: JSON.stringify(body) }),
  renewSiteExpiry: (siteId: string) =>
    fetchJson<{ site: SiteSummary }>(`/api/sites/${siteId}/renew-expiry`, { method: "POST", body: JSON.stringify({}) }),
  deleteSite: (siteId: string) => fetchJson<{ ok: true }>(`/api/sites/${siteId}`, { method: "DELETE" }),
  createRevision: (siteId: string, body: RevisionBody) =>
    fetchJson<{ revision: RevisionResult }>(`/api/sites/${siteId}/revisions`, { method: "POST", body: JSON.stringify(body) }),
  revisions: (siteId: string) => fetchJson<RevisionHistoryResponse>(`/api/sites/${siteId}/revisions`),
  revisionPreviewUrl: (siteId: string, revisionId: string) =>
    fetchJson<RevisionPreviewResponse>(`/api/sites/${siteId}/revisions/${revisionId}/preview`, { method: "POST" }),
  restoreRevision: (siteId: string, revisionId: string) =>
    fetchJson<{ revision: RevisionHistoryItem | null; currentRevisionId: string; revisions: RevisionHistoryItem[] }>(
      `/api/sites/${siteId}/revisions/${revisionId}/restore`,
      { method: "POST" }
    ),
  reviewUrl: async (siteId: string, revisionId: string) => {
    const res = await fetchJson<RevisionPreviewResponse>(`/api/sites/${siteId}/revisions/${revisionId}/preview`, { method: "POST" });
    const separator = res.previewUrl.includes("?") ? "&" : "?";
    return { reviewUrl: `${res.previewUrl}${separator}__review=1`, expiresAt: res.expiresAt };
  },
  comments: (siteId: string, revisionId?: string) =>
    fetchJson<{ comments: RevisionCommentSummary[] }>(`/api/sites/${siteId}/comments${revisionId ? `?revisionId=${encodeURIComponent(revisionId)}` : ""}`),
  createComment: (
    siteId: string,
    body: { revisionId: string; body: string; selector?: string | null; textSnippet?: string | null; anchorRect?: RevisionCommentAnchorRect | null }
  ) => fetchJson<{ comment: RevisionCommentSummary }>(`/api/sites/${siteId}/comments`, { method: "POST", body: JSON.stringify(body) }),
  updateComment: (siteId: string, commentId: string, body: { body?: string; status?: RevisionCommentStatus }) =>
    fetchJson<{ comment: RevisionCommentSummary }>(`/api/sites/${siteId}/comments/${commentId}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteComment: (siteId: string, commentId: string) =>
    fetchJson<{ ok: true }>(`/api/sites/${siteId}/comments/${commentId}`, { method: "DELETE" }),
  formSubmissions: (siteId: string) => fetchJson<{ submissions: FormSubmissionSummary[] }>(`/api/sites/${siteId}/form-submissions`),
  formSubmissionsCsvUrl: (siteId: string) => `/api/sites/${siteId}/form-submissions.csv`,
  formSubmission: (siteId: string, submissionId: string) =>
    fetchJson<{ submission: FormSubmissionDetail }>(`/api/sites/${siteId}/form-submissions/${submissionId}`),
  events: (siteId: string) => fetchJson<{ events: AccessEventSummary[] }>(`/api/sites/${siteId}/events`),

  createAgentUploadToken: (body: Record<string, unknown>) =>
    fetchJson<{ uploadToken: AgentUploadToken }>("/api/agent/upload-tokens", { method: "POST", body: JSON.stringify(body) }),

  stripeConfig: () => fetchJson<{ stripe: StripeConfig }>("/api/billing/stripe/config"),
  subscription: () => fetchJson<{ subscription: BillingSubscriptionSummary; plans: BillingPlanSummary[] }>("/api/billing/subscription"),
  invoices: () => fetchJson<{ invoices: BillingInvoiceSummary[] }>("/api/billing/invoices"),
  paymentMethod: () => fetchJson<{ paymentMethod: BillingPaymentMethodSummary | null }>("/api/billing/payment-method"),
  checkout: (planId: string) =>
    fetchJson<{ session: { url: string } }>("/api/billing/checkout-session", { method: "POST", body: JSON.stringify({ planId }) }),
  billingPortal: () => fetchJson<{ portal: { url: string } }>("/api/billing/customer-portal-session", { method: "POST" })
};
