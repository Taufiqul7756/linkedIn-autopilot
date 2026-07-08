import { get, post } from "@/lib/api";
import { PaginatedWebsites, WebsiteType } from "@/types/Website";

export const websiteService = () => ({
  getWebsites: () => get<PaginatedWebsites>("/websites/"),
  addWebsite: (url: string) => post<WebsiteType>("/websites/", { url }),
  recrawl: (id: string, url: string) =>
    post<{ status: string }>(`/websites/${id}/recrawl/`, { url }),
});
