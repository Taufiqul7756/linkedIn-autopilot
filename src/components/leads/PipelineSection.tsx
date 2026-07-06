import { LuCheck, LuRefreshCw, LuChevronRight } from "react-icons/lu";
import { mockPipelineStages, type PipelineStage } from "@/lib/mock/leads";
import { cn } from "@/utils/cn";

// ── Stage status rendering ────────────────────────────────────────────────────

function StageStatusBadge({ stage }: { stage: PipelineStage }) {
  const { status, statusLabel, statusDetail } = stage;

  if (status === "complete") {
    return (
      <div>
        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
          <LuCheck className="h-3.5 w-3.5" />
          {statusLabel}
        </span>
      </div>
    );
  }
  if (status === "signed-off") {
    return (
      <div>
        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          <LuCheck className="h-3 w-3" />
          {statusLabel}
        </span>
        {statusDetail && <p className="mt-1 text-xs text-gray-400">{statusDetail}</p>}
      </div>
    );
  }
  if (status === "comments-actioned") {
    return (
      <div>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          {statusLabel}
        </span>
        {statusDetail && <p className="mt-1 text-xs text-gray-400">{statusDetail}</p>}
      </div>
    );
  }
  // in-progress
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-blue-600">
      <LuRefreshCw className="h-3.5 w-3.5 animate-spin" />
      {statusLabel}
    </span>
  );
}

function StageCard({ stage }: { stage: PipelineStage }) {
  const isGate = stage.type === "gate";
  const isActive = stage.isActive;

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col rounded-xl border p-4",
        isActive ? "border-blue-400 bg-white shadow-sm" : "border-gray-200 bg-white"
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        {isGate ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Client Gate
          </span>
        ) : (
          <span className="text-xs font-semibold text-gray-300">
            {String(stage.stageNumber!).padStart(2, "0")}
          </span>
        )}
      </div>
      <p className="mb-2 text-sm font-semibold text-gray-900">{stage.label}</p>
      <StageStatusBadge stage={stage} />
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function PipelineSection() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 text-sm">
          <span className="font-semibold text-gray-900">Pipeline</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-500">Batch #A-1042</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-500">currently in</span>
          <span className="font-semibold text-blue-600">Review &amp; Load</span>
        </div>
        <span className="text-xs text-gray-400">4 stages · 2 client gates</span>
      </div>

      {/* Stage flow */}
      <div className="overflow-x-auto">
        <div className="flex min-w-[640px] items-stretch gap-2">
          {mockPipelineStages.map((stage, i) => (
            <div key={stage.id} className="flex min-w-0 flex-1 items-stretch gap-2">
              <div className="flex-1">
                <StageCard stage={stage} />
              </div>
              {i < mockPipelineStages.length - 1 && (
                <div className="flex shrink-0 items-center">
                  <LuChevronRight className="h-4 w-4 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
