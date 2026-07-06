"use client";
import { useState, useEffect, useRef } from "react";
import {
  LuEye,
  LuThumbsUp,
  LuMessageSquare,
  LuExternalLink,
  LuEllipsisVertical,
  LuTrash2,
  LuListFilter,
  LuCheck,
} from "react-icons/lu";
import { mockPosts, type PostStatus, type ManagedPost } from "@/lib/mock/linkedinAutopilot";
import { cn } from "@/utils/cn";
import ScheduleModal from "./ScheduleModal";

const FILTER_OPTIONS: PostStatus[] = ["Draft", "Scheduled", "Published"];

const statusStyles: Record<PostStatus, string> = {
  Published: "bg-green-100 text-green-700",
  Scheduled: "bg-blue-100 text-blue-700",
  Approved: "bg-green-100 text-green-700",
  Draft: "bg-violet-100 text-violet-700",
  Failed: "bg-red-100 text-red-700",
};

const statusDots: Record<PostStatus, string> = {
  Published: "bg-green-500",
  Scheduled: "bg-blue-500",
  Approved: "bg-green-500",
  Draft: "bg-violet-500",
  Failed: "bg-red-500",
};

// ── Engagement cell ──────────────────────────────────────────────────────────
function EngagementCell({ post }: { post: ManagedPost }) {
  if (post.engagement.type === "metrics") {
    const e = post.engagement;
    return (
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <LuEye className="h-3.5 w-3.5" /> {e.impressions}
        </span>
        <span className="flex items-center gap-1">
          <LuThumbsUp className="h-3.5 w-3.5" /> {e.likes}
        </span>
        <span className="flex items-center gap-1">
          <LuMessageSquare className="h-3.5 w-3.5" /> {e.comments}
        </span>
        <span className="font-semibold text-green-600">{e.rate}</span>
      </div>
    );
  }
  if (post.engagement.type === "queue") {
    return <span className="text-xs font-medium text-blue-600">{post.engagement.note}</span>;
  }
  const noteColor = post.status === "Failed" ? "text-red-600 font-medium" : "text-gray-400";
  return <span className={cn("text-xs", noteColor)}>{post.engagement.note}</span>;
}

// ── Row three-dot dropdown ───────────────────────────────────────────────────
function RowDropdown({ postId }: { postId: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "rounded p-1 transition-colors hover:bg-gray-100 hover:text-gray-700",
          open ? "bg-gray-100 text-gray-700" : "text-gray-400"
        )}
      >
        <LuEllipsisVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <button
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <LuEye className="h-4 w-4 text-gray-400" />
            View post
          </button>
          <div className="mx-3 border-t border-gray-100" />
          <button
            onClick={() => {
              setOpen(false);
              console.warn("Delete post", postId);
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <LuTrash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ── Filter dropdown ──────────────────────────────────────────────────────────
function FilterDropdown({
  active,
  onChange,
}: {
  active: PostStatus | "All";
  onChange: (v: PostStatus | "All") => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const hasFilter = active !== "All";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
          hasFilter
            ? "border-blue-600 bg-blue-50 text-blue-600"
            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        )}
      >
        <LuListFilter className="h-4 w-4" />
        {hasFilter ? active : "Filter"}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Status
          </div>

          <button
            onClick={() => {
              onChange("All");
              setOpen(false);
            }}
            className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            All posts
            {active === "All" && <LuCheck className="h-4 w-4 text-blue-600" />}
          </button>

          <div className="mx-3 border-t border-gray-100" />

          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <span className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", statusDots[opt])} />
                {opt}
              </span>
              {active === opt && <LuCheck className="h-4 w-4 text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Indeterminate checkbox ───────────────────────────────────────────────────
function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-gray-300 accent-blue-600"
    />
  );
}

// ── Main section ─────────────────────────────────────────────────────────────
type ScheduleTarget = { post: ManagedPost; mode: "schedule" | "reschedule" } | null;

export default function PostManagementSection() {
  const [activeFilter, setActiveFilter] = useState<PostStatus | "All">("All");
  const [scheduleTarget, setScheduleTarget] = useState<ScheduleTarget>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const filtered =
    activeFilter === "All" ? mockPosts : mockPosts.filter((p) => p.status === activeFilter);

  const allIds = filtered.map((p) => p.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const someSelected = allIds.some((id) => selected.has(id)) && !allSelected;
  const selectedCount = allIds.filter((id) => selected.has(id)).length;

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        allIds.forEach((id) => next.delete(id));
      } else {
        allIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div>
      {/* Section header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h2 className="text-base font-semibold text-gray-900">Post Management</h2>

          {selectedCount >= 2 && (
            <>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                {selectedCount} selected
              </span>
              <button className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                <LuTrash2 className="h-4 w-4" />
                Delete
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 sm:self-auto">
          <span className="hidden text-xs text-gray-400 md:inline">
            Timezone: America/New_York (EST)
          </span>
          <FilterDropdown active={activeFilter} onChange={setActiveFilter} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100">
                {/* Select all checkbox */}
                <th className="w-10 px-4 py-3">
                  <IndeterminateCheckbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                  />
                </th>
                {[
                  "POST",
                  "CREATED",
                  "SCHEDULED",
                  "PUBLISHED",
                  "STATUS",
                  "ENGAGEMENT",
                  "ACTIONS",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((post) => {
                const isSelected = selected.has(post.id);
                return (
                  <tr
                    key={post.id}
                    className={cn(
                      "group transition-colors",
                      isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                    )}
                  >
                    {/* Checkbox */}
                    <td className="w-10 px-4 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(post.id)}
                        className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                      />
                    </td>

                    {/* Post */}
                    <td className="max-w-xs px-5 py-4">
                      <p className="line-clamp-2 text-sm text-gray-800">{post.excerpt}</p>
                      <div className="mt-1 flex flex-wrap gap-x-2">
                        {post.tags.map((t) => (
                          <span key={t} className="text-xs text-blue-500">
                            {t}
                          </span>
                        ))}
                        <span className="text-xs text-gray-400">· {post.style}</span>
                      </div>
                    </td>

                    {/* Created */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      {post.created}
                    </td>

                    {/* Scheduled */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm">
                      {post.scheduled ? (
                        <span className="font-medium text-blue-600">{post.scheduled}</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* Published */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      {post.published ?? <span className="text-gray-300">—</span>}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                          statusStyles[post.status]
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", statusDots[post.status])} />
                        {post.status}
                      </span>
                    </td>

                    {/* Engagement */}
                    <td className="px-5 py-4">
                      <EngagementCell post={post} />
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2">
                        {post.status === "Published" && (
                          <button className="rounded p-1 text-gray-400 transition-colors hover:text-gray-600">
                            <LuExternalLink className="h-4 w-4" />
                          </button>
                        )}
                        {post.status === "Approved" && (
                          <button
                            onClick={() => setScheduleTarget({ post, mode: "schedule" })}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            Schedule
                          </button>
                        )}
                        {post.status === "Scheduled" && (
                          <>
                            <button
                              onClick={() => setScheduleTarget({ post, mode: "reschedule" })}
                              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                              Reschedule
                            </button>
                            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white transition-colors hover:bg-green-600">
                              ▶
                            </button>
                          </>
                        )}
                        {(post.status === "Draft" || post.status === "Failed") && (
                          <button
                            className={cn(
                              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                              post.status === "Failed"
                                ? "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
                                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            )}
                          >
                            {post.status === "Failed" ? "Retry" : "Review"}
                          </button>
                        )}
                        <RowDropdown postId={post.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule / Reschedule modal */}
      <ScheduleModal
        isOpen={scheduleTarget !== null}
        onClose={() => setScheduleTarget(null)}
        mode={scheduleTarget?.mode ?? "schedule"}
        postExcerpt={scheduleTarget?.post.excerpt ?? ""}
        currentScheduled={scheduleTarget?.post.scheduled}
      />
    </div>
  );
}
