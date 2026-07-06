import {
  LuSearch,
  LuShield,
  LuSparkles,
  LuPencil,
  LuMail,
  LuActivity,
  LuRefreshCw,
} from "react-icons/lu";
import { FaWhatsapp, FaLinkedinIn } from "react-icons/fa";
import { mockSwarmAgents, type SwarmAgent, type SwarmAgentStatus } from "@/lib/mock/leads";
import { cn } from "@/utils/cn";

// ── Icon map ──────────────────────────────────────────────────────────────────

const iconMap: Record<SwarmAgent["iconType"], React.ReactNode> = {
  search: <LuSearch className="h-5 w-5" />,
  shield: <LuShield className="h-5 w-5" />,
  sparkle: <LuSparkles className="h-5 w-5" />,
  pencil: <LuPencil className="h-5 w-5" />,
  whatsapp: <FaWhatsapp className="h-5 w-5" />,
  mail: <LuMail className="h-5 w-5" />,
  linkedin: <FaLinkedinIn className="h-4 w-4" />,
  chart: <LuActivity className="h-5 w-5" />,
};

const iconBg: Record<SwarmAgent["color"], string> = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-violet-100 text-violet-600",
  pink: "bg-pink-100 text-pink-600",
  teal: "bg-teal-100 text-teal-600",
  amber: "bg-amber-100 text-amber-600",
  indigo: "bg-indigo-100 text-indigo-600",
  rose: "bg-rose-100 text-rose-600",
};

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SwarmAgentStatus }) {
  if (status === "Working") {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-green-600">
        <LuRefreshCw className="h-3 w-3 animate-spin" />
        Working
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Waiting
    </span>
  );
}

// ── Agent card ────────────────────────────────────────────────────────────────

function AgentCard({ agent }: { agent: SwarmAgent }) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-4">
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
      <p className="mt-3 text-xs leading-relaxed text-gray-600">{agent.task}</p>
      <p className="mt-2 text-xs text-gray-400">{agent.stat}</p>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function AgenticSwarmSection() {
  const row1 = mockSwarmAgents.slice(0, 4);
  const row2 = mockSwarmAgents.slice(4);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Section header */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-gray-900">Agentic Swarm</h2>
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Live
          </span>
        </div>
        <p className="text-xs text-gray-400">
          8 autonomous agents · working in parallel · orchestrator-coordinated
        </p>
      </div>

      {/* Orchestrator banner */}
      <div className="mb-4 flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
            <LuSparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">Orchestrator</span>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                Coordinating
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-500">
              Routing tasks, resolving dependencies, and load-balancing across the swarm.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-6 md:gap-8 md:text-right">
          <div>
            <p className="text-xl font-bold text-gray-900">6/8</p>
            <p className="text-xs text-gray-400">agents active</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">312</p>
            <p className="text-xs text-gray-400">tasks in flight</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">1.2s</p>
            <p className="text-xs text-gray-400">avg handoff</p>
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
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {row2.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  );
}
