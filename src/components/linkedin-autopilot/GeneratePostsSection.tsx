"use client";
import { useState } from "react";
import { LuSparkles } from "react-icons/lu";
import { cn } from "@/utils/cn";

const POST_COUNTS = [3, 5, 10];
const TONE_OPTIONS = ["Professional", "Casual", "Witty", "Inspirational", "Educational"];
const LENGTH_OPTIONS = ["Short", "Medium", "Long"] as const;
const CONTENT_STYLES = [
  "Thought leadership",
  "Case study",
  "How-to",
  "Bold take",
  "Storytelling",
  "Product update",
];

type Length = (typeof LENGTH_OPTIONS)[number];

export default function GeneratePostsSection() {
  const [postCount, setPostCount] = useState(5);
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState<Length>("Medium");
  const [contentStyle, setContentStyle] = useState("Thought leadership");
  const [prompt, setPrompt] = useState("");

  return (
    <div className="rounded-xl border border-[#D8DCF0] bg-gradient-to-b from-[#ECEEF8] to-white px-6 py-5">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
          <LuSparkles className="h-4 w-4 text-blue-600" />
        </div>
        <h2 className="text-sm font-semibold text-gray-900">
          Generate posts from your knowledge base
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {/* Number of posts */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Number of posts
          </label>
          <div className="flex gap-1.5">
            {POST_COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setPostCount(n)}
                className={cn(
                  "flex h-9 w-full items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                  postCount === n
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {TONE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Length */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Length
          </label>
          <div className="flex gap-1.5">
            {LENGTH_OPTIONS.map((l) => (
              <button
                key={l}
                onClick={() => setLength(l)}
                className={cn(
                  "flex h-9 w-full items-center justify-center rounded-lg border text-sm font-medium transition-colors",
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
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
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
      </div>

      {/* Custom prompt */}
      <div className="mt-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
          Custom prompt{" "}
          <span className="normal-case font-normal text-gray-400">
            optional — steer the angle, topic, or offer to feature
          </span>
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="e.g. Write about our new WhatsApp auto-send feature and tie it to reply-rate wins. Mention our 30-minute follow-up window. Avoid buzzwords."
          className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3.5 py-2 text-sm font-medium text-violet-600 transition-colors hover:bg-violet-100">
          <LuSparkles className="h-3.5 w-3.5" />
          Suggest prompts
        </button>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <p className="text-xs text-gray-400">
            Posts are generated as drafts and won&apos;t publish until you approve them.
          </p>
          <button className="flex items-center gap-2 self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:self-auto">
            → Generate
          </button>
        </div>
      </div>
    </div>
  );
}
