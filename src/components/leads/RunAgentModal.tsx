"use client";
import { useState } from "react";
import { LuZap, LuSlidersHorizontal, LuUser } from "react-icons/lu";
import Modal from "@/components/ui/Modal";
import { cn } from "@/utils/cn";

type RunMode = "fully-automated" | "partial-automated" | "fully-manual";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
}

const MODES: {
  id: RunMode;
  icon: React.ReactNode;
  label: string;
  description: string;
  tag: string;
}[] = [
  {
    id: "fully-automated",
    icon: <LuZap className="h-5 w-5" />,
    label: "Fully Automated",
    description:
      "Agents run the entire workflow end-to-end — sourcing, enriching, and sending outreach — without any human touch.",
    tag: "Hands-off",
  },
  {
    id: "partial-automated",
    icon: <LuSlidersHorizontal className="h-5 w-5" />,
    label: "Partial Automated",
    description:
      "Agents draft all outreach (email, LinkedIn, WhatsApp). You review and approve each message before it sends.",
    tag: "Human approval",
  },
  {
    id: "fully-manual",
    icon: <LuUser className="h-5 w-5" />,
    label: "Fully Manual",
    description:
      "Agents surface and enrich leads only. You handle all outreach manually at your own pace.",
    tag: "Agent-assisted",
  },
];

export default function RunAgentModal({ isOpen, onClose, selectedCount }: Props) {
  const [selected, setSelected] = useState<RunMode | null>(null);

  const handleConfirm = () => {
    if (!selected) return;
    onClose();
    setSelected(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Run Agent" width="md">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Running on{" "}
          <span className="font-semibold text-gray-900">
            {selectedCount} lead{selectedCount !== 1 ? "s" : ""}
          </span>
          . Choose how much the agent should do autonomously.
        </p>

        <div className="space-y-2.5">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelected(mode.id)}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition-colors",
                selected === mode.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    selected === mode.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                  )}
                >
                  {mode.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{mode.label}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        selected === mode.id
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {mode.tag}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{mode.description}</p>
                </div>
                <div
                  className={cn(
                    "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                    selected === mode.id ? "border-blue-600 bg-blue-600" : "border-gray-300"
                  )}
                >
                  {selected === mode.id && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={cn(
              "rounded-lg px-5 py-2 text-sm font-medium text-white transition-colors",
              selected ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-blue-300"
            )}
          >
            Run Agent
          </button>
        </div>
      </div>
    </Modal>
  );
}
