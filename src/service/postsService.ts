import { get } from "@/lib/api";
import { PostStatsType } from "@/types/Post";

export const postsService = () => ({
  getPostStats: () => get<PostStatsType>("/content/posts/stats/"),
});
