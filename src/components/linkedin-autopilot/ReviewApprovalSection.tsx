"use client";
import { useState } from "react";
import { LuImageOff, LuClock, LuPencil, LuRefreshCw, LuGlobe } from "react-icons/lu";
import { mockDraftPosts, type DraftPost } from "@/lib/mock/linkedinAutopilot";
import EditPostModal from "./EditPostModal";
import RejectConfirmModal from "./RejectConfirmModal";

export default function ReviewApprovalSection() {
  const [editPost, setEditPost] = useState<DraftPost | null>(null);
  const [rejectPost, setRejectPost] = useState<DraftPost | null>(null);

  return (
    <div>
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-gray-900">Review &amp; Approval</h2>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            {mockDraftPosts.length} awaiting
          </span>
        </div>
        <button className="text-sm font-medium text-blue-600 hover:underline">
          View all drafts →
        </button>
      </div>

      {/* Draft post cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {mockDraftPosts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-5"
          >
            {/* Post header */}
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                  {post.author.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
                  <p className="text-xs text-gray-500">
                    {post.author.title} · {post.author.followers} followers
                  </p>
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

            {/* Post content */}
            <div className="mb-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-gray-700">
              {post.content}
            </div>

            {/* Hashtags */}
            <div className="mb-4 flex flex-wrap gap-1.5">
              {post.hashtags.map((tag) => (
                <span key={tag} className="text-xs font-medium text-blue-600">
                  {tag}
                </span>
              ))}
            </div>

            {/* Metadata row */}
            <div className="mb-4 flex items-center gap-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
              {post.imagePromptReady && (
                <span className="flex items-center gap-1.5 rounded-md border border-gray-200 px-2 py-1">
                  <LuImageOff className="h-3.5 w-3.5" />
                  Image prompt ready
                </span>
              )}
              <span className="flex items-center gap-1">
                <LuClock className="h-3.5 w-3.5" />
                {post.readTime} read
              </span>
              <span>CTA: {post.cta}</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditPost(post)}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <LuPencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                  <LuRefreshCw className="h-3.5 w-3.5" />
                  Regenerate
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRejectPost(post)}
                  className="rounded-lg border border-red-200 px-3.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Reject
                </button>
                <button className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700">
                  ✓ Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      <EditPostModal isOpen={editPost !== null} onClose={() => setEditPost(null)} post={editPost} />

      {/* Reject confirmation modal */}
      <RejectConfirmModal
        isOpen={rejectPost !== null}
        onClose={() => setRejectPost(null)}
        postExcerpt={rejectPost?.content.split("\n")[0] ?? ""}
        onConfirm={() => setRejectPost(null)}
      />
    </div>
  );
}
