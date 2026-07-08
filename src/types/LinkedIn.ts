export type LinkedInConnectResponse = {
  authorize_url: string;
};

export type LinkedInCallbackResponse = {
  id: string;
  member_urn: string;
  name: string;
  scope: string;
  expires_at: string;
  created_at: string;
};

export type LinkedInAccountResponse = {
  connected: boolean;
  member_urn: string;
  name: string;
};
