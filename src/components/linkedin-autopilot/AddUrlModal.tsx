"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LuLink } from "react-icons/lu";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import { useMutationWithTokenRefresh } from "@/hooks/useMutationWithTokenRefresh";
import { websiteService } from "@/service/websiteService";

interface AddUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddUrlModal({ isOpen, onClose }: AddUrlModalProps) {
  const [url, setUrl] = useState("");
  const queryClient = useQueryClient();

  const addWebsite = useMutationWithTokenRefresh(
    (websiteUrl: string) => websiteService().addWebsite(websiteUrl),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["websites"] });
        toast.success("Website added! Indexing in progress.");
        setUrl("");
        onClose();
      },
      onError: () => {
        toast.error("Failed to add website.");
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    addWebsite.mutate(trimmed);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Website URL" width="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Website URL</label>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
            <LuLink className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              required
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-400">
            We&apos;ll crawl this URL to build your knowledge base.
          </p>
        </div>

        <button
          type="submit"
          disabled={addWebsite.isPending || !url.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {addWebsite.isPending ? "Adding..." : "Add Website"}
        </button>
      </form>
    </Modal>
  );
}
