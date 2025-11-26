import VoterLayout from "@/components/layouts/app/VoterLayout";
import VoterPolls from "@/components/polls/VotersPolls";

export default function VoterResultsPage() {
  return (
    <VoterLayout>
      <h1 className="text-2xl font-bold mb-4">Poll Results</h1>
      <VoterPolls showResultsOnly />
    </VoterLayout>
  );
}
