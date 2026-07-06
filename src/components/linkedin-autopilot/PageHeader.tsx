import { FaLinkedinIn } from "react-icons/fa";
import { LuCalendar, LuSparkles } from "react-icons/lu";

export default function PageHeader() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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

      <div className="flex shrink-0 items-center gap-2">
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
          <LuCalendar className="h-4 w-4" />
          Calendar
        </button>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          <LuSparkles className="h-4 w-4" />
          Generate Posts
        </button>
      </div>
    </div>
  );
}
