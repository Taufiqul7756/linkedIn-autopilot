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
