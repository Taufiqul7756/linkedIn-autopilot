"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { FaLinkedinIn } from "react-icons/fa";
import { LuGlobe, LuUpload } from "react-icons/lu";
import toast from "react-hot-toast";
import { mockAccount, mockStats } from "@/lib/mock/linkedinAutopilot";
import { linkedinService } from "@/service/linkedinService";
import { useQueryWithTokenRefresh } from "@/hooks/useQueryWithTokenRefresh";
import LinkedInManageModal from "./LinkedInManageModal";
import KnowledgeBaseUploadModal from "./KnowledgeBaseUploadModal";

export default function AccountSection() {
  const [linkedInModalOpen, setLinkedInModalOpen] = useState(false);
  const [kbUploadModalOpen, setKbUploadModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const callbackHandled = useRef(false);

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // Fetch live account status
  const { data: account, isLoading: accountLoading } = useQueryWithTokenRefresh(
    ["linkedin-account"],
    () => linkedinService().getAccount()
  );

  // Handle OAuth callback — fires once when redirected back with code + state
  useEffect(() => {
    if (!code || !state || callbackHandled.current) return;
    callbackHandled.current = true;

    linkedinService()
      .handleCallback(code, state)
      .then((result) => {
        if (result) {
          queryClient.invalidateQueries({ queryKey: ["linkedin-account"] });
          toast.success("LinkedIn account connected!");
        } else {
          toast.error("Failed to connect LinkedIn account.");
        }
      })
      .finally(() => {
        router.replace("/linkedin-autopilot");
      });
  }, [code, state, queryClient, router]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const result = await linkedinService().getConnectUrl();
      if (result?.authorize_url) {
        window.location.href = result.authorize_url;
      } else {
        toast.error("Failed to get LinkedIn authorization URL.");
        setIsConnecting(false);
      }
    } catch {
      toast.error("Failed to initiate LinkedIn connection.");
      setIsConnecting(false);
    }
  };

  const isConnected = account?.connected ?? false;

  return (
    <div className="space-y-3">
      {/* Account cards */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* LinkedIn account */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
            <FaLinkedinIn className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">LinkedIn account</span>
              {accountLoading ? (
                <span className="h-4 w-20 animate-pulse rounded bg-gray-200" />
              ) : isConnected ? (
                <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 inline-block" />
                  Not connected
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {accountLoading
                ? "Loading..."
                : isConnected
                  ? `${account?.name} · authorized via OAuth · publish enabled`
                  : "Connect your LinkedIn to start publishing"}
            </p>
          </div>
          <button
            onClick={() => setLinkedInModalOpen(true)}
            className="shrink-0 rounded-lg border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Manage
          </button>
        </div>

        {/* Website knowledge base */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
            <LuGlobe className="h-5 w-5 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">Website knowledge base</span>
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                Ready
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              <span className="text-blue-600">{mockAccount.knowledgeBase.url}</span>
              {" · "}
              {mockAccount.knowledgeBase.subtitle}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              onClick={() => setKbUploadModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <LuUpload className="h-3.5 w-3.5" />
              Add sources
            </button>
            <button className="shrink-0 rounded-lg border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              Re-crawl
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {mockStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
            {stat.note && (
              <p
                className={
                  stat.noteColor === "green"
                    ? "mt-0.5 text-xs font-medium text-green-600"
                    : "mt-0.5 text-xs text-gray-500"
                }
              >
                {stat.note}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      <LinkedInManageModal
        isOpen={linkedInModalOpen}
        onClose={() => setLinkedInModalOpen(false)}
        account={account}
        onConnect={handleConnect}
        isConnecting={isConnecting}
      />
      <KnowledgeBaseUploadModal
        isOpen={kbUploadModalOpen}
        onClose={() => setKbUploadModalOpen(false)}
      />
    </div>
  );
}
