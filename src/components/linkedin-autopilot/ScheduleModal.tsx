"use client";
import { useState } from "react";
import { LuCalendar, LuClock, LuMapPin } from "react-icons/lu";
import Modal from "@/components/ui/Modal";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "schedule" | "reschedule";
  postExcerpt: string;
  currentScheduled?: string | null;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  mode,
  postExcerpt,
  currentScheduled,
}: ScheduleModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("09:00");

  const handleConfirm = () => {
    // mock — just close
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "reschedule" ? "Reschedule Post" : "Schedule Post"}
      width="md"
    >
      {/* Post preview */}
      <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <p className="line-clamp-2 text-sm text-gray-600">{postExcerpt}</p>
        {mode === "reschedule" && currentScheduled && (
          <p className="mt-1.5 text-xs text-gray-400">
            Currently scheduled:{" "}
            <span className="font-medium text-blue-600">{currentScheduled}</span>
          </p>
        )}
      </div>

      <div className="space-y-4">
        {/* Date */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <LuCalendar className="h-3.5 w-3.5" />
            Date
          </label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Time */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <LuClock className="h-3.5 w-3.5" />
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Timezone (read-only) */}
        <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5">
          <LuMapPin className="h-4 w-4 shrink-0 text-gray-400" />
          <div>
            <p className="text-xs font-medium text-gray-700">Timezone</p>
            <p className="text-xs text-gray-400">America/New_York (EST)</p>
          </div>
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
          onClick={handleConfirm}
          disabled={!date || !time}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mode === "reschedule" ? "Reschedule" : "Schedule Post"}
        </button>
      </div>
    </Modal>
  );
}
