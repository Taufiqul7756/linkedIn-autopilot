import { get, post } from "@/lib/api";
import {
  PostStatsType,
  GeneratePostsBody,
  GeneratePostsResponse,
  SuggestPromptsBody,
  SuggestPromptsResponse,
} from "@/types/Post";

export const postsService = () => ({
  getPostStats: () => get<PostStatsType>("/content/posts/stats/"),
  generatePosts: (body: GeneratePostsBody) =>
    post<GeneratePostsResponse>("/content/posts/generate/", body),
  suggestPrompts: (body: SuggestPromptsBody) =>
    post<SuggestPromptsResponse>("/content/posts/suggest_prompts/", body),
});
