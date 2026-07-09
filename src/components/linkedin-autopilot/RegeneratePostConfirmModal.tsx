"use client";
import { LuRefreshCw } from "react-icons/lu";
import Modal from "@/components/ui/Modal";

interface RegeneratePostConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  postExcerpt: string;
  onConfirm: () => void;
}

export default function RegeneratePostConfirmModal({
  isOpen,
  onClose,
  postExcerpt,
  onConfirm,
}: RegeneratePostConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Regenerate Post" width="sm">
      {/* Icon */}
      <div className="mb-4 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
          <LuRefreshCw className="h-6 w-6 text-amber-500" />
        </div>
      </div>

      {/* Message */}
      <p className="mb-3 text-center text-sm text-gray-600">
        Regenerating will replace this post with a new draft.{" "}
        <span className="font-medium text-gray-800">Your current version will be lost.</span>
      </p>

      {/* Post excerpt */}
      <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <p className="line-clamp-2 text-xs italic text-gray-500">&ldquo;{postExcerpt}&rdquo;</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onClose}
          className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="flex items-center justify-center gap-2 flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-600"
        >
          <LuRefreshCw className="h-3.5 w-3.5" />
          Regenerate
        </button>
      </div>
    </Modal>
  );
}
