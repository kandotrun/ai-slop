export const LEGAL_PATHS = ["/terms", "/privacy", "/commerce", "/refund-policy"] as const;

export type LegalPath = (typeof LEGAL_PATHS)[number];

export interface LegalLink {
  label: string;
  path: LegalPath;
}

export const LEGAL_LINKS: LegalLink[] = [
  { label: "利用規約", path: "/terms" },
  { label: "プライバシーポリシー", path: "/privacy" },
  { label: "特定商取引法に基づく表記", path: "/commerce" },
  { label: "返金・キャンセルポリシー", path: "/refund-policy" }
];

export function legalPathFromPathname(pathname: string): LegalPath | null {
  const normalized = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  return LEGAL_PATHS.includes(normalized as LegalPath) ? normalized as LegalPath : null;
}

export function isLegalPath(pathname: string): pathname is LegalPath {
  return legalPathFromPathname(pathname) !== null;
}
