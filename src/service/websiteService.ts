import { get, post, del } from "@/lib/api";
import { PaginatedWebsites, WebsiteType } from "@/types/Website";

export const websiteService = () => ({
  getWebsites: () => get<PaginatedWebsites>("/websites/"),
  addWebsite: (url: string, scope: "corporate" | "personal") =>
    post<WebsiteType>("/websites/", { url, scope }),
  deleteWebsite: (id: string) => del<void>(`/websites/${id}/`),
  recrawl: (id: string, url: string) =>
    post<{ status: string }>(`/websites/${id}/recrawl/`, { url }),
});
