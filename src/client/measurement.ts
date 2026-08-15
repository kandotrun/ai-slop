import type { MeasurementEventName } from "../shared/types";

const VISITOR_STORAGE_KEY = "giga_site_visitor_id";

export type MeasurementMetadata = Record<string, string | number | boolean | null | undefined>;

type WindowWithTracker = Window & {
  gigaSiteTrack?: (eventName: MeasurementEventName, metadata?: MeasurementMetadata, articlePath?: string) => void;
};

function randomVisitorId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function measurementVisitorId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = window.localStorage.getItem(VISITOR_STORAGE_KEY);
    if (existing) return existing;
    const next = randomVisitorId();
    window.localStorage.setItem(VISITOR_STORAGE_KEY, next);
    return next;
  } catch {
    return null;
  }
}

export function measurementHeaders(): Record<string, string> {
  const visitorId = measurementVisitorId();
  return visitorId ? { "X-Giga-Site-Visitor": visitorId } : {};
}

function currentPath(): string {
  if (typeof window === "undefined") return "/";
  const path = window.location.pathname || "/";
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export function trackMeasurement(eventName: MeasurementEventName, metadata: MeasurementMetadata = {}, options: { path?: string; articlePath?: string | null } = {}): void {
  if (typeof window === "undefined") return;
  const tracker = (window as WindowWithTracker).gigaSiteTrack;
  if (tracker) {
    tracker(eventName, metadata, options.articlePath ?? undefined);
    return;
  }
  const path = options.path ?? currentPath();
  const body = JSON.stringify({
    eventName,
    path,
    articlePath: options.articlePath ?? (path.startsWith("/articles") ? path : undefined),
    visitorId: measurementVisitorId(),
    metadata
  });
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/measure", blob)) return;
    }
  } catch {
    // Fall back to fetch below.
  }
  try {
    void fetch("/api/measure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "same-origin"
    });
  } catch {
    // Best-effort measurement must never block the product flow.
  }
}

export function trackUploadStarted(source: string, file: File): void {
  trackMeasurement("upload_started", {
    source,
    file_type: file.name.toLowerCase().endsWith(".zip") ? "zip" : "html",
    byte_length: file.size
  });
}
