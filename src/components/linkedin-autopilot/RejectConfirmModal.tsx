"use client";
import { useState } from "react";
import { LuTriangleAlert } from "react-icons/lu";
import Modal from "@/components/ui/Modal";

interface RejectConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  postExcerpt: string;
  onConfirm: () => void;
  isConfirming?: boolean;
}

export default function RejectConfirmModal({
  isOpen,
  onClose,
  postExcerpt,
  onConfirm,
  isConfirming = false,
}: RejectConfirmModalProps) {
  const [reason, setReason] = useState("");

  const handleReject = () => {
    onConfirm();
    setReason("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reject Post" width="sm">
      {/* Warning icon */}
      <div className="mb-4 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <LuTriangleAlert className="h-6 w-6 text-red-500" />
        </div>
      </div>

      {/* Message */}
      <p className="mb-3 text-center text-sm text-gray-600">
        Are you sure you want to reject this post? It will be removed from the approval queue.
      </p>

      {/* Post excerpt */}
      <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <p className="line-clamp-2 text-xs text-gray-500 italic">&ldquo;{postExcerpt}&rdquo;</p>
      </div>

      {/* Optional reason */}
      <div className="mb-6">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
          Reason <span className="normal-case font-normal">optional</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="e.g. Off-brand tone, incorrect facts..."
          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
        />
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
          onClick={handleReject}
          disabled={isConfirming}
          className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {isConfirming ? "Rejecting…" : "Reject post"}
        </button>
      </div>
    </Modal>
  );
}
