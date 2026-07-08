import { get } from "@/lib/api";
import {
  LinkedInAccountResponse,
  LinkedInCallbackResponse,
  LinkedInConnectResponse,
} from "@/types/LinkedIn";

export const linkedinService = () => ({
  getConnectUrl: () => get<LinkedInConnectResponse>("/linkedin/connect/"),
  handleCallback: (code: string, state: string) =>
    get<LinkedInCallbackResponse>(
      `/linkedin/callback/?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
    ),
  getAccount: () => get<LinkedInAccountResponse>("/linkedin/account/"),
});
