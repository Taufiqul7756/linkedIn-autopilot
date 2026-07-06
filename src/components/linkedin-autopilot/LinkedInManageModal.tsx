import Modal from "@/components/ui/Modal";
import { FaLinkedinIn } from "react-icons/fa";
import { LuShieldCheck, LuCircleUser, LuUnlink } from "react-icons/lu";

interface LinkedInManageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LinkedInManageModal({ isOpen, onClose }: LinkedInManageModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="LinkedIn Account" width="md">
      {/* Current connection status */}
      <div className="mb-6 flex items-start gap-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
          <FaLinkedinIn className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">Jordan Rivera</span>
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Connected
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">jordan@relayhq.com · authorized via OAuth</p>
        </div>
      </div>

      {/* Permission details */}
      <div className="mb-6 space-y-2.5">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <LuShieldCheck className="h-4 w-4 shrink-0 text-green-500" />
          Publish posts enabled
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <LuCircleUser className="h-4 w-4 shrink-0 text-green-500" />
          Profile access granted · 1 account connected
        </div>
      </div>

      {/* Connect button */}
      <button
        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        onClick={onClose}
      >
        <FaLinkedinIn className="h-4 w-4" />
        Connect your LinkedIn
      </button>

      {/* Disconnect link */}
      <div className="mt-4 flex justify-center">
        <button className="flex items-center gap-1.5 text-xs text-red-400 transition-colors hover:text-red-600">
          <LuUnlink className="h-3.5 w-3.5" />
          Disconnect account
        </button>
      </div>
    </Modal>
  );
}
