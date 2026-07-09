"use client";
import { useState, useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
  LuPencil,
  LuRefreshCw,
  LuImage,
  LuGlobe,
  LuCheck,
  LuLoader,
  LuSparkles,
  LuX,
} from "react-icons/lu";
import toast from "react-hot-toast";
import { postsService } from "@/service/postsService";
import { linkedinService } from "@/service/linkedinService";
import { useQueryWithTokenRefresh } from "@/hooks/useQueryWithTokenRefresh";
import { useMutationWithTokenRefresh } from "@/hooks/useMutationWithTokenRefresh";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import type { PostType } from "@/types/Post";
import EditPostModal from "./EditPostModal";
import RejectConfirmModal from "./RejectConfirmModal";
import RegeneratePostConfirmModal from "./RegeneratePostConfirmModal";

function parseHashtags(raw: unknown): string[] {
  if (!raw) return [];
  const items: string[] = Array.isArray(raw)
    ? raw.map(String)
    : String(raw)
        .split(/[\s,]+/)
        .map((t) => t.trim())
        .filter(Boolean);
  return items.filter((t) => t.length > 0).map((t) => (t.startsWith("#") ? t : `#${t}`));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ReviewApprovalSection() {
  const queryClient = useQueryClient();
  const [editPost, setEditPost] = useState<PostType | null>(null);
  const [rejectPost, setRejectPost] = useState<PostType | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [imagePromptPostId, setImagePromptPostId] = useState<string | null>(null);
  const [imagePrompts, setImagePrompts] = useState<Record<string, string>>({});
  const [regenerateTarget, setRegenerateTarget] = useState<PostType | null>(null);

  // Poll after generate — "posts-generating" is set by GeneratePostsSection on success
  // baseline = draft count at the moment generate was clicked (null = not polling)
  const { data: baseline } = useQuery<number | null>({
    queryKey: ["posts-generating"],
    queryFn: () => null,
    enabled: false,
    staleTime: Infinity,
  });
  const isPolling = baseline !== null && baseline !== undefined;

  const { data: postsData, isLoading } = useQueryWithTokenRefresh(
    ["posts", "draft"],
    () => postsService().getDraftPosts(),
    {
      refetchInterval: isPolling
        ? (query) => {
            const count =
              (query.state.data as { results?: unknown[] } | undefined)?.results?.length ?? 0;
            return count > (baseline ?? 0) ? false : 5000;
          }
        : false,
    }
  );

  const isGenerating = isPolling && (postsData?.results?.length ?? 0) <= (baseline ?? 0);

  // Clear polling flag once new posts have arrived beyond the baseline
  useEffect(() => {
    if (isPolling && (postsData?.results?.length ?? 0) > (baseline ?? 0)) {
      queryClient.setQueryData(["posts-generating"], null);
    }
  }, [postsData, isPolling, baseline, queryClient]);

  const { data: account } = useQueryWithTokenRefresh(["linkedin-account"], () =>
    linkedinService().getAccount()
  );

  const accountName = account?.name ?? "LinkedIn User";
  const posts = postsData?.results ?? [];

  const approveMutation = useMutationWithTokenRefresh(
    (id: string) => postsService().approvePost(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts", "draft"] });
        queryClient.invalidateQueries({ queryKey: ["post-stats"] });
        toast.success("Post approved!");
        setApprovingId(null);
      },
      onError: (error: unknown) => {
        toast.error(extractErrorMessage(error));
        setApprovingId(null);
      },
    }
  );

  const rejectMutation = useMutationWithTokenRefresh(
    (id: string) => postsService().rejectPost(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts", "draft"] });
        queryClient.invalidateQueries({ queryKey: ["post-stats"] });
        toast.success("Post rejected.");
        setRejectPost(null);
        setRejectingId(null);
      },
      onError: (error: unknown) => {
        toast.error(extractErrorMessage(error));
        setRejectingId(null);
      },
    }
  );

  const handleApprove = (id: string) => {
    setApprovingId(id);
    approveMutation.mutate(id);
  };

  const handleRejectConfirm = () => {
    if (!rejectPost) return;
    setRejectingId(rejectPost.id);
    rejectMutation.mutate(rejectPost.id);
  };

  return (
    <div>
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-gray-900">Review &amp; Approval</h2>
          {!isLoading && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              {postsData?.count ?? 0} awaiting
            </span>
          )}
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      )}

      {/* Generating state — polling for new posts */}
      {!isLoading && isGenerating && (
        <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50 py-12 text-center">
          <LuLoader className="mx-auto mb-3 h-6 w-6 animate-spin text-blue-500" />
          <p className="text-sm font-medium text-blue-600">Generating posts…</p>
          <p className="mt-1 text-xs text-blue-400">This usually takes 5–10 seconds.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isGenerating && posts.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white py-12 text-center">
          <p className="text-sm text-gray-400">No drafts awaiting review.</p>
        </div>
      )}

      {/* Draft post cards */}
      {!isLoading && posts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {posts.map((post) => {
            const hashtags = parseHashtags(post.hashtags);
            const isApproving = approvingId === post.id;

            return (
              <div
                key={post.id}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5"
              >
                {/* Post header */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                      {getInitials(accountName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{accountName}</p>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                        <span>Draft preview</span>
                        <LuGlobe className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                  <span className="rounded-md border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
                    Draft
                  </span>
                </div>

                {/* Post body */}
                <div className="mb-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                  {post.body}
                </div>

                {/* Image */}
                {post.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.image_url}
                    alt="Post image"
                    className="mb-3 w-full rounded-lg object-cover"
                    style={{ maxHeight: 220 }}
                  />
                )}

                {/* Hashtags */}
                {hashtags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {hashtags.map((tag) => (
                      <span key={tag} className="text-xs font-medium text-blue-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setEditPost(post)}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      <LuPencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setRegenerateTarget(post)}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      <LuRefreshCw className="h-3.5 w-3.5" />
                      Regenerate Post
                    </button>
                    <button
                      onClick={() =>
                        setImagePromptPostId((prev) => (prev === post.id ? null : post.id))
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      <LuImage className="h-3.5 w-3.5" />
                      Regenerate Image
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRejectPost(post)}
                      disabled={isApproving}
                      className="rounded-lg border border-red-200 px-3.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleApprove(post.id)}
                      disabled={isApproving}
                      className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-60"
                    >
                      <LuCheck className="h-3.5 w-3.5" />
                      {isApproving ? "Approving…" : "Approve"}
                    </button>
                  </div>
                </div>

                {/* Image prompt panel */}
                {imagePromptPostId === post.id && (
                  <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3.5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-700">Image prompt</span>
                      <button
                        onClick={() => setImagePromptPostId(null)}
                        className="text-blue-300 transition-colors hover:text-blue-500"
                      >
                        <LuX className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={imagePrompts[post.id] ?? ""}
                      onChange={(e) =>
                        setImagePrompts((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      placeholder="Describe the image you want to generate… e.g. 'A minimalist office scene with warm lighting'"
                      className="w-full resize-none rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        disabled
                        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white opacity-60"
                        title="API coming soon"
                      >
                        <LuSparkles className="h-3.5 w-3.5" />
                        Generate Image
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Regenerate post confirmation modal */}
      <RegeneratePostConfirmModal
        key={regenerateTarget?.id ?? "no-regenerate"}
        isOpen={regenerateTarget !== null}
        onClose={() => setRegenerateTarget(null)}
        postExcerpt={regenerateTarget?.body.split("\n")[0] ?? ""}
        onConfirm={() => {
          // TODO: wire up regenerate API
        }}
      />

      {/* Edit modal */}
      <EditPostModal
        key={editPost?.id ?? "no-post"}
        isOpen={editPost !== null}
        onClose={() => setEditPost(null)}
        post={editPost}
        accountName={accountName}
      />

      {/* Reject confirmation modal */}
      <RejectConfirmModal
        isOpen={rejectPost !== null}
        onClose={() => {
          setRejectPost(null);
          setRejectingId(null);
        }}
        postExcerpt={rejectPost?.body.split("\n")[0] ?? ""}
        onConfirm={handleRejectConfirm}
        isConfirming={rejectingId !== null}
      />
    </div>
  );
}
