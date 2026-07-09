import { FaLinkedinIn } from "react-icons/fa";

export default function PageHeader() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
        <FaLinkedinIn className="h-5 w-5 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-gray-900">LinkedIn Autopilot</h1>
        <p className="text-sm text-gray-500">
          Generate on-brand posts from your website, approve, schedule, and auto-publish.
        </p>
      </div>
    </div>
  );
}
