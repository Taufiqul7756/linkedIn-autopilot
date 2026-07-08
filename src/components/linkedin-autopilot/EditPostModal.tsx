"use client";
import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LuX, LuUpload } from "react-icons/lu";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import { postsService } from "@/service/postsService";
import { useMutationWithTokenRefresh } from "@/hooks/useMutationWithTokenRefresh";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import type { PostType } from "@/types/Post";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostType | null;
  accountName?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function EditPostModal({ isOpen, onClose, post, accountName }: EditPostModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState(post?.body ?? "");
  const [hashtags, setHashtags] = useState(() => {
    const raw = post?.hashtags;
    if (!raw) return "";
    if (Array.isArray(raw)) return raw.map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ");
    return raw;
  });
  const [imageRemoved, setImageRemoved] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

  const saveMutation = useMutationWithTokenRefresh(
    (id: string) => {
      if (newImageFile) {
        const form = new FormData();
        form.append("body", content);
        form.append("hashtags", hashtags);
        form.append("image_url", newImageFile);
        return postsService().patchPost(id, form);
      }
      const hashtagsArray = hashtags
        .split(/[\s,]+/)
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean);
      const data: { body: string; hashtags: string[]; image_url?: string } = {
        body: content,
        hashtags: hashtagsArray,
      };
      if (imageRemoved) data.image_url = "";
      return postsService().patchPost(id, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts", "draft"] });
        toast.success("Post saved.");
        onClose();
      },
      onError: (error: unknown) => {
        toast.error(extractErrorMessage(error));
      },
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveNew = () => {
    setNewImageFile(null);
    setNewImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!post) return null;

  const displayName = accountName ?? "LinkedIn User";
  const showExistingImage = !!post.image_url && !imageRemoved && !newImageFile;
  const showNewPreview = !!newImagePreview;
  const showUploadArea = (imageRemoved || !post.image_url) && !newImageFile;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Post" width="2xl">
      <div className="space-y-4">
        {/* Author info */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
            {getInitials(displayName)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-400">Draft preview</p>
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

        {/* Image section label */}
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Image
          </p>

          {/* Existing image */}
          {showExistingImage && (
            <div className="relative overflow-hidden rounded-xl border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image_url}
                alt="Post image"
                className="w-full object-cover"
                style={{ maxHeight: 220 }}
              />
              <button
                onClick={() => setImageRemoved(true)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                title="Remove image"
              >
                <LuX className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* New image preview */}
          {showNewPreview && (
            <div className="relative overflow-hidden rounded-xl border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={newImagePreview!}
                alt="New post image"
                className="w-full object-cover"
                style={{ maxHeight: 220 }}
              />
              <button
                onClick={handleRemoveNew}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                title="Remove new image"
              >
                <LuX className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Upload area (shown when no image or image removed) */}
          {showUploadArea && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-8 text-gray-400 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500"
            >
              <LuUpload className="h-5 w-5" />
              <span className="text-sm font-medium">Click to upload an image</span>
              <span className="text-xs">PNG, JPG, WEBP</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Undo remove */}
          {imageRemoved && !newImageFile && post.image_url && (
            <p className="mt-1.5 text-xs text-gray-400">
              Original image removed.{" "}
              <button
                onClick={() => setImageRemoved(false)}
                className="font-medium text-blue-600 hover:underline"
              >
                Undo
              </button>
            </p>
          )}
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
          disabled={saveMutation.isPending}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={() => saveMutation.mutate(post.id)}
          disabled={content.trim() === "" || saveMutation.isPending}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saveMutation.isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </Modal>
  );
}
