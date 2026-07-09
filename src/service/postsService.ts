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
  getAllPosts: (status?: string, page?: number, pageSize = 10) => {
    const q = new URLSearchParams();
    if (status && status !== "all") {
      q.set("status", status);
    } else {
      q.set("exclude_status", "draft");
    }
    if (page && page > 1) q.set("page", String(page));
    q.set("page_size", String(pageSize));
    return get<PaginatedPosts>(`/content/posts/?${q.toString()}`);
  },
  schedulePost: (id: string, scheduled_at: string) =>
    post<PostType>(`/content/posts/${id}/schedule/`, { scheduled_at }),
  getPost: (id: string) => get<PostType>(`/content/posts/${id}/`),
  patchPost: (
    id: string,
    data: { body?: string; hashtags?: string[]; image_url?: string } | FormData
  ) => patch<PostType>(`/content/posts/${id}/`, data),
  uploadImage: (id: string, file: File) => {
    const form = new FormData();
    form.append("image", file);
    return post<PostType>(`/content/posts/${id}/upload_image/`, form);
  },
  approvePost: (id: string) => post<PostType>(`/content/posts/${id}/approve/`),
  rejectPost: (id: string) => del<void>(`/content/posts/${id}/`),
  generateImage: (id: string, image_prompt: string) =>
    post<PostType>(`/content/posts/${id}/generate_image/`, { image_prompt }),
  generatePosts: (body: GeneratePostsBody) =>
    post<GeneratePostsResponse>("/content/posts/generate/", body),
  suggestPrompts: (body: SuggestPromptsBody) =>
    post<SuggestPromptsResponse>("/content/posts/suggest_prompts/", body),
});
