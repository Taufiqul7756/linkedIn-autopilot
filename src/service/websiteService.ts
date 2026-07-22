import { get, post, del } from "@/lib/api";
import { PaginatedWebsites, WebsiteType } from "@/types/Website";

export const websiteService = (workspaceId: string) => ({
  getWebsites: () => get<PaginatedWebsites>(`/workspaces/${workspaceId}/websites/`),
  addWebsite: (url: string) => post<WebsiteType>(`/workspaces/${workspaceId}/websites/`, { url }),
  deleteWebsite: (id: string) => del<void>(`/workspaces/${workspaceId}/websites/${id}/`),
  recrawl: (id: string, url: string) =>
    post<{ status: string }>(`/workspaces/${workspaceId}/websites/${id}/recrawl/`, {
      url,
    }),
});
