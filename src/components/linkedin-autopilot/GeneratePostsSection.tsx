"use client";
import { useState } from "react";
import { LuSparkles, LuArrowRight, LuX, LuTriangleAlert } from "react-icons/lu";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { cn } from "@/utils/cn";
import { postsService } from "@/service/postsService";
import { websiteService } from "@/service/websiteService";
import ScopeKnowledgeModal from "@/components/linkedin-autopilot/ScopeKnowledgeModal";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryWithTokenRefresh } from "@/hooks/useQueryWithTokenRefresh";
import { useMutationWithTokenRefresh } from "@/hooks/useMutationWithTokenRefresh";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

const SCOPE_OPTIONS = [
  { value: "corporate", label: "Corporate" },
  { value: "personal", label: "Personal" },
] as const;

type Scope = (typeof SCOPE_OPTIONS)[number]["value"];

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

type Length = (typeof LENGTH_OPTIONS)[number];

export default function GeneratePostsSection() {
  const queryClient = useQueryClient();
  const [postCount, setPostCount] = useState<number | "">("");
  const [postCountError, setPostCountError] = useState("");
  const [scope, setScope] = useState<Scope>("corporate");
  const [scopeModalOpen, setScopeModalOpen] = useState(false);
  const [tone, setTone] = useState("professional");
  const [useEmoji, setUseEmoji] = useState(false);
  const [length, setLength] = useState<Length>("Medium");
  const [contentStyle, setContentStyle] = useState("Thought leadership");
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [promptError, setPromptError] = useState<{
    prompt: string;
    suggested_topics: string[];
  } | null>(null);

  const { data: websites } = useQueryWithTokenRefresh(["websites"], () =>
    websiteService().getWebsites()
  );
  const website = websites?.results?.[0];

  const suggestMutation = useMutationWithTokenRefresh(
    (websiteId: string) => postsService().suggestPrompts({ website_profile: websiteId }),
    {
      onSuccess: (data) => {
        if (data?.prompts?.length) {
          setSuggestions(data.prompts);
        } else {
          toast.error("No suggestions returned.");
        }
      },
      onError: (error: unknown) => {
        toast.error(extractErrorMessage(error));
      },
    }
  );

  const generateMutation = useMutationWithTokenRefresh(
    () =>
      postsService().generatePosts({
        prompt,
        tone,
        length: length.toLowerCase(),
        content_style: contentStyle.toLowerCase().replace(/\s+/g, "_"),
        use_emoji: useEmoji,
        count: postCount as number,
        scope,
      }),
    {
      onSuccess: () => {
        queryClient.setQueryData(["posts-text-generating"], null);
        toast.success("Posts created — generating images in the background.");
        setPrompt("");
        setSuggestions([]);
        setPromptError(null);
        // Store pre-generate count so ReviewApprovalSection knows when NEW posts arrive
        const cached = queryClient.getQueryData(["posts", "draft"]) as
          { count?: number } | undefined;
        queryClient.setQueryData(["posts-generating"], cached?.count ?? 0);
        queryClient.invalidateQueries({ queryKey: ["posts", "draft"] });
        queryClient.invalidateQueries({ queryKey: ["post-stats"] });
      },
      onError: (error: unknown) => {
        queryClient.setQueryData(["posts-text-generating"], null);
        if (error instanceof AxiosError) {
          const data = error.response?.data as Record<string, unknown> | undefined;
          if (data?.suggested_topics && Array.isArray(data.suggested_topics)) {
            setPromptError({
              prompt: typeof data.prompt === "string" ? data.prompt : "Prompt not covered.",
              suggested_topics: data.suggested_topics as string[],
            });
            return;
          }
          // Scope mismatch — no knowledge uploaded for the selected scope
          const websiteError =
            typeof data?.website_profile === "string" ? data.website_profile : "";
          if (websiteError.includes("not in the") && websiteError.includes("scope")) {
            setScopeModalOpen(true);
            return;
          }
        }
        toast.error(extractErrorMessage(error));
      },
    }
  );

  const handleSuggest = () => {
    if (!website) return;
    setSuggestions([]);
    suggestMutation.mutate(website.id);
  };

  const handleGenerate = () => {
    if (!website) return;
    if (postCount === "" || postCount < 1) {
      setPostCountError("Enter how many posts to generate.");
      return;
    }
    setPostCountError("");
    queryClient.setQueryData(["posts-text-generating"], Date.now());
    generateMutation.mutate(undefined);
  };

  const canAct = !!website;

  return (
    <>
      <div className="rounded-xl border border-[#D8DCF0] bg-gradient-to-b from-[#ECEEF8] to-white px-6 py-5">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
            <LuSparkles className="h-4 w-4 text-blue-600" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900">
            Generate posts from your knowledge base
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 lg:gap-5">
          {/* Number of posts */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Number of posts <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={postCount}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Number(e.target.value);
                setPostCount(val);
                if (val !== "" && (val as number) >= 1) setPostCountError("");
              }}
              placeholder="e.g. 5"
              className={cn(
                "h-9 w-full rounded-lg border bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-1",
                postCountError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              )}
            />
            {postCountError && <p className="mt-1 text-xs text-red-500">{postCountError}</p>}
          </div>

          {/* Scope */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Scope
            </label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as Scope)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {SCOPE_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
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
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Use Emoji */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
              Use Emoji
            </label>
            <div className="flex gap-1.5">
              {(["No", "Yes"] as const).map((opt) => {
                const active = opt === "Yes" ? useEmoji : !useEmoji;
                return (
                  <button
                    key={opt}
                    onClick={() => setUseEmoji(opt === "Yes")}
                    className={cn(
                      "flex h-9 w-full items-center justify-center rounded-lg border text-sm font-medium transition-colors",
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
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Prompt not covered error */}
        {promptError && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <LuTriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <p className="text-sm text-amber-800">{promptError.prompt}</p>
              </div>
              <button
                onClick={() => setPromptError(null)}
                className="shrink-0 text-amber-400 transition-colors hover:text-amber-600"
              >
                <LuX className="h-4 w-4" />
              </button>
            </div>
            {promptError.suggested_topics.length > 0 && (
              <div className="ml-6 flex flex-wrap gap-2">
                {promptError.suggested_topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => {
                      setPrompt(topic);
                      setPromptError(null);
                    }}
                    className="rounded-lg border border-amber-200 bg-white px-3 py-1 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setPrompt(s);
                  setSuggestions([]);
                }}
                className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-left text-xs text-violet-700 transition-colors hover:bg-violet-100"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={handleSuggest}
            disabled={!canAct || suggestMutation.isPending}
            className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3.5 py-2 text-sm font-medium text-violet-600 transition-colors hover:bg-violet-100 disabled:opacity-40"
          >
            <LuSparkles
              className={cn("h-3.5 w-3.5", suggestMutation.isPending && "animate-spin")}
            />
            {suggestMutation.isPending ? "Suggesting…" : "Suggest prompts"}
          </button>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <p className="text-xs text-gray-400">
              Posts are generated as drafts and won&apos;t publish until you approve them.
            </p>
            <button
              onClick={handleGenerate}
              disabled={!canAct || generateMutation.isPending || postCount === ""}
              className="flex items-center gap-2 self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 sm:self-auto"
            >
              <LuArrowRight className="h-4 w-4" />
              {generateMutation.isPending ? "Generating…" : "Generate"}
            </button>
          </div>
        </div>
      </div>

      <ScopeKnowledgeModal
        isOpen={scopeModalOpen}
        onClose={() => setScopeModalOpen(false)}
        scope={scope}
      />
    </>
  );
}
