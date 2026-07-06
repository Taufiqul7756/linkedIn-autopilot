"use client";
import { useState, useRef, useEffect } from "react";
import { LuSearch, LuDownload, LuUpload, LuTrash2, LuBot } from "react-icons/lu";
import { FaWhatsapp, FaLinkedinIn } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { mockLeads, mockLeadStats, type Lead, type LeadStatus } from "@/lib/mock/leads";
import { cn } from "@/utils/cn";
import RunAgentModal from "./RunAgentModal";

// ── Status styles ─────────────────────────────────────────────────────────────

const statusStyles: Record<LeadStatus, string> = {
  Valid: "bg-green-100 text-green-700",
  Invalid: "bg-red-100 text-red-700",
  Risky: "bg-amber-100 text-amber-700",
};

const statusDots: Record<LeadStatus, string> = {
  Valid: "bg-green-500",
  Invalid: "bg-red-500",
  Risky: "bg-amber-500",
};

// ── Avatar colors ─────────────────────────────────────────────────────────────

const avatarStyles: Record<Lead["avatarColor"], string> = {
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  pink: "bg-pink-100 text-pink-700",
  teal: "bg-teal-100 text-teal-700",
};

// ── Indeterminate checkbox ────────────────────────────────────────────────────

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

// ── Main section ──────────────────────────────────────────────────────────────

export default function LeadsTableSection() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [runAgentOpen, setRunAgentOpen] = useState(false);

  const filtered = mockLeads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
  );

  const allIds = filtered.map((l) => l.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const someSelected = allIds.some((id) => selected.has(id)) && !allSelected;
  const selectedCount = allIds.filter((id) => selected.has(id)).length;

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        allIds.forEach((id) => {
          next.delete(id);
        });
      } else {
        allIds.forEach((id) => {
          next.add(id);
        });
      }
      return next;
    });
  };

  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div>
      {/* Section header */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900">Leads</h2>
        <p className="text-sm text-gray-400">2,481 leads across 4 active campaigns</p>
      </div>

      {/* Stats row */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {mockLeadStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
            {stat.note && (
              <p
                className={cn(
                  "mt-0.5 text-xs font-medium",
                  stat.noteColor === "green" ? "text-green-600" : "text-gray-400"
                )}
              >
                {stat.note}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <LuSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedCount >= 1 && (
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
          <button
            onClick={() => setRunAgentOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <LuBot className="h-4 w-4" />
            Run Agent
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <LuUpload className="h-4 w-4" />
            Import
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <LuDownload className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-10 px-4 py-3">
                  <IndeterminateCheckbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                  />
                </th>
                {["LEAD", "EMAIL", "PHONE", "STATUS", "OUTREACH", "LAST ACTIVITY", "ACTIONS"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((lead) => {
                const isSelected = selected.has(lead.id);
                const initials = lead.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <tr
                    key={lead.id}
                    className={cn(
                      "transition-colors",
                      isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                    )}
                  >
                    {/* Checkbox */}
                    <td className="w-10 px-4 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(lead.id)}
                        className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                      />
                    </td>

                    {/* Lead */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                            avatarStyles[lead.avatarColor]
                          )}
                        >
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                          <p className="text-xs text-gray-400">{lead.company}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-700">{lead.email}</p>
                      <span className="mt-0.5 inline-block rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-400">
                        Corporate mail
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                      {lead.phone}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                          statusStyles[lead.status]
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", statusDots[lead.status])} />
                        {lead.status}
                      </span>
                    </td>

                    {/* Outreach */}
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                      {lead.outreach}
                    </td>

                    {/* Last activity */}
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-400">
                      {lead.lastActivity}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          title="WhatsApp"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-green-500 transition-colors hover:bg-green-50"
                        >
                          <FaWhatsapp className="h-4 w-4" />
                        </button>
                        <button
                          title="Email"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-blue-500 transition-colors hover:bg-blue-50"
                        >
                          <MdOutlineEmail className="h-4 w-4" />
                        </button>
                        <button
                          title="LinkedIn"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-blue-700 transition-colors hover:bg-blue-50"
                        >
                          <FaLinkedinIn className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <RunAgentModal
        isOpen={runAgentOpen}
        onClose={() => setRunAgentOpen(false)}
        selectedCount={selectedCount > 0 ? selectedCount : mockLeads.length}
      />
    </div>
  );
}
