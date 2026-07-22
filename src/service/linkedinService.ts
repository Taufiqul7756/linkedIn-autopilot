import { get, del } from "@/lib/api";
import {
  LinkedInAccountResponse,
  LinkedInCallbackResponse,
  LinkedInConnectResponse,
} from "@/types/LinkedIn";

export const linkedinService = (workspaceId: string) => ({
  getConnectUrl: () => get<LinkedInConnectResponse>(`/workspaces/${workspaceId}/linkedin/connect/`),
  // OAuth callback stays top-level — workspace is in the signed state
  handleCallback: (code: string, state: string) =>
    get<LinkedInCallbackResponse>(
      `/linkedin/callback/?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
    ),
  getAccount: () => get<LinkedInAccountResponse>(`/workspaces/${workspaceId}/linkedin/account/`),
  disconnectAccount: () => del<void>(`/workspaces/${workspaceId}/linkedin/account/`),
});
