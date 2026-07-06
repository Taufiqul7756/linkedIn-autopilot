import {
  LuLink,
  LuGlobe,
  LuSparkles,
  LuSquareCheck,
  LuCalendar,
  LuSend,
  LuChartBar,
  LuRefreshCw,
} from "react-icons/lu";
import { FaLinkedinIn } from "react-icons/fa";
import { mockAgents, type Agent, type AgentStatus } from "@/lib/mock/linkedinAutopilot";
import { cn } from "@/utils/cn";

const iconMap: Record<Agent["iconType"], React.ReactNode> = {
  link: <LuLink className="h-5 w-5" />,
  globe: <LuGlobe className="h-5 w-5" />,
  sparkle: <LuSparkles className="h-5 w-5" />,
  "check-square": <LuSquareCheck className="h-5 w-5" />,
  calendar: <LuCalendar className="h-5 w-5" />,
  send: <LuSend className="h-5 w-5" />,
  chart: <LuChartBar className="h-5 w-5" />,
};

const iconBg: Record<Agent["color"], string> = {
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-violet-100 text-violet-600",
  amber: "bg-amber-100 text-amber-600",
  green: "bg-green-100 text-green-600",
  pink: "bg-pink-100 text-pink-600",
};

function StatusBadge({ status }: { status: AgentStatus }) {
  if (status === "Connected") {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-green-600">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Connected
      </span>
    );
  }
  if (status === "Working") {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-blue-600">
        <LuRefreshCw className="h-3 w-3 animate-spin" />
        Working
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Needs you
    </span>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const isNeedsYou = agent.status === "NeedsYou";
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-4",
        isNeedsYou ? "border-amber-200 bg-amber-50" : "border-gray-200 bg-white"
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <div
          className={cn("flex h-9 w-9 items-center justify-center rounded-lg", iconBg[agent.color])}
        >
          {iconMap[agent.iconType]}
        </div>
        <StatusBadge status={agent.status} />
      </div>

      <p className="text-sm font-semibold text-gray-900">{agent.name}</p>
      <p className="text-xs text-gray-500">{agent.subtitle}</p>

      <p className="mt-3 text-xs text-gray-600 leading-relaxed">{agent.description}</p>

      <p className="mt-2 text-xs text-gray-400">{agent.detail}</p>
    </div>
  );
}

export default function AgentWorkflowSection() {
  const row1 = mockAgents.slice(0, 4);
  const row2 = mockAgents.slice(4);

  return (
    <div className="rounded-xl border border-[#D8DCF0] bg-[#ECEEF8] p-5">
      {/* Section header */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <FaLinkedinIn className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">Autopilot Agent Workflow</h2>
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Live
          </span>
        </div>
        <p className="text-xs text-gray-400">7 agents run your LinkedIn presence end to end</p>
      </div>

      {/* Orchestrator banner */}
      <div className="mb-4 flex flex-col gap-4 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
            <LuSparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">Autopilot Orchestrator</span>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                Coordinating
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-500">
              Sequences connect → generate → approve → schedule → publish → analyze, with a human
              approval gate.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-6 md:gap-8 md:text-right">
          <div>
            <p className="text-xl font-bold text-gray-900">6/7</p>
            <p className="text-xs text-gray-400">agents active</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">28</p>
            <p className="text-xs text-gray-400">posts in flight</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">1</p>
            <p className="text-xs font-medium text-amber-500">gate: needs you</p>
          </div>
        </div>
      </div>

      {/* Agent grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {row1.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {row2.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  );
}
