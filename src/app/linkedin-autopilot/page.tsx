import PageHeader from "@/components/linkedin-autopilot/PageHeader";
import AccountSection from "@/components/linkedin-autopilot/AccountSection";
import GeneratePostsSection from "@/components/linkedin-autopilot/GeneratePostsSection";
import ReviewApprovalSection from "@/components/linkedin-autopilot/ReviewApprovalSection";
import PostManagementSection from "@/components/linkedin-autopilot/PostManagementSection";
import AgentWorkflowSection from "@/components/linkedin-autopilot/AgentWorkflowSection";

export const metadata = {
  title: "LinkedIn Autopilot — Relay",
};

export default function LinkedInAutopilotPage() {
  return (
    <div className="flex-1 bg-[#E9ECF5] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-screen-xl space-y-4 sm:space-y-5">
        <PageHeader />
        <AccountSection />
        <GeneratePostsSection />
        <ReviewApprovalSection />
        <PostManagementSection />
        <AgentWorkflowSection />
      </div>
    </div>
  );
}
