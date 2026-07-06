"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import type { DraftPost } from "@/lib/mock/linkedinAutopilot";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: DraftPost | null;
}

export default function EditPostModal({ isOpen, onClose, post }: EditPostModalProps) {
  const [content, setContent] = useState(post?.content ?? "");
  const [hashtags, setHashtags] = useState(post?.hashtags.join(" ") ?? "");

  // sync when post changes
  const handleOpen = () => {
    setContent(post?.content ?? "");
    setHashtags(post?.hashtags.join(" ") ?? "");
  };

  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Post" width="lg">
      <div onFocus={handleOpen} className="space-y-4">
        {/* Author info */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
            {post.author.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
            <p className="text-xs text-gray-400">{post.author.title}</p>
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Post content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-relaxed text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-right text-xs text-gray-400">{content.length} chars</p>
        </div>

        {/* Hashtags */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Hashtags
          </label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#B2BSales #SalesAutomation"
            className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-400">Separate hashtags with a space</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-2.5">
        <button
          onClick={onClose}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          disabled={content.trim() === ""}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save changes
        </button>
      </div>
    </Modal>
  );
}
