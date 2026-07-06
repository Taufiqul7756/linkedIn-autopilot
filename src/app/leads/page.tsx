import AccountConnectionSection from "@/components/leads/AccountConnectionSection";
import SourceLeadsSection from "@/components/leads/SourceLeadsSection";
import PipelineSection from "@/components/leads/PipelineSection";
import LeadsTableSection from "@/components/leads/LeadsTableSection";
import AgenticSwarmSection from "@/components/leads/AgenticSwarmSection";

export const metadata = {
  title: "Leads — Relay",
};

export default function LeadsPage() {
  return (
    <div className="flex-1 bg-[#E9ECF5] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-screen-xl space-y-4 sm:space-y-5">
        <AccountConnectionSection />
        <SourceLeadsSection />
        <PipelineSection />
        <LeadsTableSection />
        <AgenticSwarmSection />
      </div>
    </div>
  );
}
