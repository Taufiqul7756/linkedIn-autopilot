export type WebsiteStatus = "pending" | "crawling" | "ready" | "error";

export type WebsiteType = {
  id: string;
  url: string;
  status: WebsiteStatus;
  summary: string;
  facets: Record<string, unknown>;
  error: string;
  created_at: string;
};

export type PaginatedWebsites = {
  count: number;
  next: string | null;
  previous: string | null;
  results: WebsiteType[];
};
