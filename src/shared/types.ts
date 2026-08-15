export const AUTH_MODES = ["random", "password", "email_domain", "email_otp"] as const;

export type AuthMode = (typeof AUTH_MODES)[number];

export const SITE_TOOLS = ["claude", "v0", "bolt", "chatgpt", "other"] as const;

export type SiteTool = (typeof SITE_TOOLS)[number];

export type SiteStatus = "active" | "deleted" | "expired";

export type AccessEventType = "view" | "auth_required" | "auth_code_sent" | "auth_success" | "auth_failed";

export const MEASUREMENT_EVENT_NAMES = [
  "article_view",
  "cta_click",
  "upload_started",
  "upload_completed",
  "signup_started",
  "signup_completed",
  "checkout_started",
  "subscription_created"
] as const;

export type MeasurementEventName = (typeof MEASUREMENT_EVENT_NAMES)[number];

export interface SiteCreateInput {
  title?: unknown;
  slug?: unknown;
  authMode?: unknown;
  password?: unknown;
  allowedEmailDomains?: unknown;
  allowedEmails?: unknown;
  expiresAt?: unknown;
  indexingEnabled?: unknown;
  tool?: unknown;
  hideBranding?: unknown;
}

export interface NormalizedSiteInput {
  title: string;
  slug?: string;
  authMode: AuthMode;
  password?: string;
  allowedEmailDomains?: string[];
  allowedEmails?: string[];
  expiresAt?: string;
  indexingEnabled: boolean;
  tool?: SiteTool;
  hideBranding: boolean;
}

export interface SiteMetrics {
  views: number;
  authViews: number;
  uniqueVisitors: number;
  totalBytes: number;
  lastSeenAt: string | null;
}

export interface SiteSummary {
  id: string;
  slug: string;
  title: string;
  status: SiteStatus;
  authMode: AuthMode;
  allowedEmailDomains: string[];
  allowedEmails: string[];
  indexingEnabled: boolean;
  hideBranding: boolean;
  tool: SiteTool | null;
  previewUrl: string;
  expiresAt: string | null;
  currentRevisionId: string | null;
  createdAt: string;
  updatedAt: string;
  metrics: SiteMetrics;
}

export interface RevisionSummary {
  id: string;
  siteId: string;
  warnings: string[];
  previewUrl: string;
  byteLength: number;
  fileCount: number;
  entryPath: string;
  createdAt: string;
}

/** One generation in a site's revision history (for the admin 世代 list). */
export interface RevisionHistoryItem {
  id: string;
  siteId: string;
  /** 1-based generation number in chronological order (1 = the first published revision). */
  generation: number;
  /** True when this revision is the one currently served on the public URL. */
  isCurrent: boolean;
  fileCount: number;
  byteLength: number;
  entryPath: string;
  createdBy: string | null;
  note: string | null;
  /** Set when this generation was produced by restoring an older one. */
  restoredFromRevisionId: string | null;
  restoredFromGeneration: number | null;
  warnings: string[];
  createdAt: string;
}

export interface RevisionHistoryResponse {
  revisions: RevisionHistoryItem[];
  currentRevisionId: string | null;
}

export interface RevisionPreviewResponse {
  previewUrl: string;
  expiresAt: string;
}

export type RevisionCommentStatus = "open" | "in_progress" | "resolved";

/** Rectangle of the anchored element, in document coordinates of the previewed page. */
export interface RevisionCommentAnchorRect {
  x: number;
  y: number;
  width: number;
  height: number;
  viewportWidth: number;
}

export interface RevisionCommentSummary {
  id: string;
  siteId: string;
  revisionId: string;
  selector: string | null;
  textSnippet: string | null;
  anchorRect: RevisionCommentAnchorRect | null;
  body: string;
  status: RevisionCommentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmissionField {
  name: string;
  value: string;
}

export interface FormSubmissionSummary {
  id: string;
  siteId: string;
  formKey: string;
  fieldCount: number;
  fieldPreview: FormSubmissionField[];
  sourcePath: string | null;
  submitterEmail: string | null;
  notificationStatus: string;
  notificationError: string | null;
  createdAt: string;
}

export interface FormSubmissionDetail extends FormSubmissionSummary {
  fields: FormSubmissionField[];
}

/** Minimal per-comment anchor injected into the (untrusted) preview origin to draw pins. */
export interface RevisionCommentAnchor {
  id: string;
  selector: string | null;
  anchorRect: RevisionCommentAnchorRect | null;
  status: RevisionCommentStatus;
}

export interface AccessEventSummary {
  id: string;
  siteId: string;
  path: string;
  eventType: AccessEventType;
  maskedEmail: string | null;
  ipHashShort: string | null;
  createdAt: string;
}

export interface DashboardStats {
  activeSites: number;
  totalSites: number;
  monthlyViews: number;
  monthlyAuthViews: number;
  totalBytes: number;
  weeklySiteDelta: number;
  monthlyViewChangePct: number | null;
}

export interface NotificationSummary {
  id: string;
  siteId: string;
  siteTitle: string;
  eventType: AccessEventType;
  maskedEmail: string | null;
  path: string;
  createdAt: string;
}

export interface BillingPlanSummary {
  id: string;
  label: string;
  unitAmount: number;
  currency: string;
  interval: string;
  checkoutMode: "subscription" | "payment";
  siteQuota?: number;
  trialPeriodDays?: number;
}

export interface BillingSubscriptionSummary {
  planId: string | null;
  planLabel: string | null;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  unusedSitePurchases: number;
  billingPortalAvailable: boolean;
}

export interface BillingInvoiceSummary {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  receiptUrl: string | null;
}

export interface BillingPaymentMethodSummary {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface ApiErrorBody {
  error: string;
  details?: unknown;
}

export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };
