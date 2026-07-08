import { get, post, patch, del } from "@/lib/api";
import {
  PostStatsType,
  PostType,
  PaginatedPosts,
  GeneratePostsBody,
  GeneratePostsResponse,
  SuggestPromptsBody,
  SuggestPromptsResponse,
} from "@/types/Post";

export const postsService = () => ({
  getPostStats: () => get<PostStatsType>("/content/posts/stats/"),
  getDraftPosts: () => get<PaginatedPosts>("/content/posts/?status=draft"),
  getPost: (id: string) => get<PostType>(`/content/posts/${id}/`),
  patchPost: (
    id: string,
    data: { body?: string; hashtags?: string[]; image_url?: string } | FormData
  ) => patch<PostType>(`/content/posts/${id}/`, data),
  approvePost: (id: string) => post<PostType>(`/content/posts/${id}/approve/`),
  rejectPost: (id: string) => del<void>(`/content/posts/${id}/`),
  generatePosts: (body: GeneratePostsBody) =>
    post<GeneratePostsResponse>("/content/posts/generate/", body),
  suggestPrompts: (body: SuggestPromptsBody) =>
    post<SuggestPromptsResponse>("/content/posts/suggest_prompts/", body),
});
