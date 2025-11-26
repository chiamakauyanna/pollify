import AppLayout from "@/components/layouts/app/AppLayout";
import VoterPolls from "@/pages/polls/components/VotersPolls";

export default function AdminResultsPage() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-4">Poll Results</h1>
      <VoterPolls showResultsOnly />
    </AppLayout>
  );
}
