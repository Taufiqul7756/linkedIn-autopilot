export type PostStatsType = {
  drafts: number | null;
  approved: number | null;
  scheduled: number | null;
  published: number | null;
  failed: number | null;
  published_this_week: number | null;
  next_scheduled_at: string | null;
  avg_engagement: number | null;
};

export type GeneratePostsBody = {
  website_profile: string;
  documents: string[];
  prompt: string;
  tone: string;
  length: string;
  content_style: string;
  count: number;
};

export type GeneratePostsResponse = {
  status: string;
};

export type SuggestPromptsBody = {
  website_profile: string;
};

export type SuggestPromptsResponse = {
  prompts: string[];
};
