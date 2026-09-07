export type OperatorPeriod = "yesterday" | "7d" | "30d" | "all";

export interface OperatorSummary {
  period: OperatorPeriod;
  from: string | null;
  to: string;
  timezone: "Asia/Tokyo";
  generatedAt: string;
  metrics: {
    registeredUsers: number;
    newUsers: number;
    publishedSites: number;
    anonymousSites: number;
    registeredSites: number;
    activeCreators: number;
    previewViews: number;
    liveSites: number;
    paidSubscriptions: number;
    returningCreators: number;
  };
  daily: Array<{ date: string; newUsers: number; sites: number; views: number }>;
}

export interface OperatorSite {
  id: string;
  title: string;
  slug: string;
  previewUrl: string;
  ownerLabel: string;
  segment: "registered" | "anonymous" | "internal";
  authMode: string;
  status: "active" | "expired" | "deleted" | "draft";
  createdAt: string;
  expiresAt: string | null;
  views: number;
  fileCount: number;
  totalBytes: number;
}

export interface OperatorUser {
  id: string;
  email: string;
  name: string;
  segment: "registered" | "internal";
  createdAt: string;
  siteCount: number;
  lastPublishedAt: string | null;
}

export interface OperatorPage<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}
