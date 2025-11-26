import VoterLayout from "@/components/layouts/app/VoterLayout";
import VoterPolls from "@/pages/polls/components/VotersPolls";

export default function VoterDashboard() {
  return (
    <VoterLayout>
      <h1 className="text-2xl font-bold mb-4">Active Polls</h1>
      <VoterPolls />
    </VoterLayout>
  );
}
