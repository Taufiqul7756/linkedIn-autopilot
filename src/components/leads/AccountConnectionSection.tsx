"use client";
import { useState } from "react";
import { FaLinkedinIn } from "react-icons/fa";
import { LuGlobe, LuUpload } from "react-icons/lu";
import LinkedInManageModal from "@/components/linkedin-autopilot/LinkedInManageModal";
import KnowledgeBaseUploadModal from "@/components/linkedin-autopilot/KnowledgeBaseUploadModal";

export default function AccountConnectionSection() {
  const [linkedInModalOpen, setLinkedInModalOpen] = useState(false);
  const [kbUploadModalOpen, setKbUploadModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {/* LinkedIn account */}
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
          <FaLinkedinIn className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">LinkedIn account</span>
            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              Connected
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">
            Jordan Rivera · authorized via OAuth · publish enabled
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
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">Website knowledge base</span>
            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              Ready
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">
            <span className="text-blue-600">relayhq.com</span>
            {" · "}8 facets · brand tone, ICP, value props
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

      {/* Modals */}
      <LinkedInManageModal
        isOpen={linkedInModalOpen}
        onClose={() => setLinkedInModalOpen(false)}
        account={{ connected: true, member_urn: "", name: "Jordan Rivera" }}
        onConnect={() => {}}
        isConnecting={false}
      />
      <KnowledgeBaseUploadModal
        isOpen={kbUploadModalOpen}
        onClose={() => setKbUploadModalOpen(false)}
      />
    </div>
  );
}
