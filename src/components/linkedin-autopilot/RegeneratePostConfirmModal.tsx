"use client";
import { useState } from "react";
import { LuRefreshCw, LuLoader } from "react-icons/lu";
import { cn } from "@/utils/cn";
import Modal from "@/components/ui/Modal";

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "conversational", label: "Conversational" },
  { value: "bold", label: "Bold / Contrarian" },
  { value: "storytelling", label: "Storytelling" },
];
const LENGTH_OPTIONS = ["Short", "Medium", "Long"] as const;
const CONTENT_STYLES = [
  "Thought leadership",
  "Case study",
  "How-to",
  "Bold take",
  "Storytelling",
  "Product update",
];

export interface RegeneratePostOptions {
  instruction: string;
  tone: string;
  length: string;
  content_style: string;
  use_emoji: boolean;
}

interface RegeneratePostConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTone?: string;
  defaultLength?: string;
  defaultContentStyle?: string;
  isConfirming?: boolean;
  onConfirm: (opts: RegeneratePostOptions) => void;
}

function toDisplayLength(raw: string): (typeof LENGTH_OPTIONS)[number] {
  const map: Record<string, (typeof LENGTH_OPTIONS)[number]> = {
    short: "Short",
    medium: "Medium",
    long: "Long",
  };
  return map[raw?.toLowerCase()] ?? "Medium";
}

function toDisplayContentStyle(raw: string): string {
  if (!raw) return "Thought leadership";
  const fromApi = raw.replace(/_/g, " ");
  return (
    CONTENT_STYLES.find((s) => s.toLowerCase() === fromApi.toLowerCase()) ?? "Thought leadership"
  );
}

export default function RegeneratePostConfirmModal({
  isOpen,
  onClose,
  defaultTone = "professional",
  defaultLength = "medium",
  defaultContentStyle = "thought_leadership",
  isConfirming = false,
  onConfirm,
}: RegeneratePostConfirmModalProps) {
  const [tone, setTone] = useState(defaultTone);
  const [length, setLength] = useState<(typeof LENGTH_OPTIONS)[number]>(
    toDisplayLength(defaultLength)
  );
  const [contentStyle, setContentStyle] = useState(toDisplayContentStyle(defaultContentStyle));
  const [useEmoji, setUseEmoji] = useState(false);
  const [instruction, setInstruction] = useState("");

  const handleConfirm = () => {
    onConfirm({
      instruction,
      tone,
      length: length.toLowerCase(),
      content_style: contentStyle.toLowerCase().replace(/\s+/g, "_"),
      use_emoji: useEmoji,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Regenerate Post" width="md">
      <p className="mb-5 text-sm text-gray-500">
        Adjust settings below, then regenerate. Your current version will be replaced.
      </p>

      <div className="space-y-4">
        {/* Tone */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {TONE_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Length */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Length
          </label>
          <div className="flex gap-2">
            {LENGTH_OPTIONS.map((l) => (
              <button
                key={l}
                onClick={() => setLength(l)}
                className={cn(
                  "flex h-9 flex-1 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                  length === l
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Content style */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Content style
          </label>
          <select
            value={contentStyle}
            onChange={(e) => setContentStyle(e.target.value)}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {CONTENT_STYLES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Use emoji */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Use Emoji
          </label>
          <div className="flex gap-2">
            {(["No", "Yes"] as const).map((opt) => {
              const active = opt === "Yes" ? useEmoji : !useEmoji;
              return (
                <button
                  key={opt}
                  onClick={() => setUseEmoji(opt === "Yes")}
                  className={cn(
                    "flex h-9 flex-1 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                    active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Instruction */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Instruction <span className="normal-case font-normal text-gray-400">optional</span>
          </label>
          <textarea
            rows={3}
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g. Focus on the cost-saving angle and keep it concise."
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-2.5">
        <button
          onClick={onClose}
          disabled={isConfirming}
          className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={isConfirming}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
        >
          {isConfirming ? (
            <LuLoader className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LuRefreshCw className="h-3.5 w-3.5" />
          )}
          {isConfirming ? "Regenerating…" : "Regenerate"}
        </button>
      </div>
    </Modal>
  );
}
