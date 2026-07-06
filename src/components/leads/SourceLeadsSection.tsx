"use client";
import { useState } from "react";
import { LuSparkles } from "react-icons/lu";

const SUGGESTIONS = [
  "Top 5 coffee shops from Bangladesh",
  "SaaS founders in Berlin, Series A",
  "Dental clinics in Austin, TX",
];

export default function SourceLeadsSection() {
  const [query, setQuery] = useState("");

  return (
    <div className="rounded-xl border border-[#D8DCF0] bg-gradient-to-b from-[#ECEEF8] to-white px-6 py-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
          <LuSparkles className="h-4 w-4 text-blue-600" />
        </div>
        <h2 className="text-sm font-semibold text-gray-900">Source leads with AI</h2>
        <span className="text-sm text-gray-400">
          Describe who you want to reach — Claude finds, validates, and enriches them.
        </span>
      </div>

      {/* Search row */}
      <div className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Give me the top 5 coffee shops from Bangladesh with their owner emails and phone numbers"
          className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          → Find Leads
        </button>
      </div>

      {/* Suggestion chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400">Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setQuery(s)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
