import AppLayout from "@/components/layouts/app/AppLayout";
import AdminPollManagement from "@/components/polls/AdminPollManagement";

export default function PollsPage() {
  return (
    <AppLayout>
      <h1 className="text-3xl font-bold mb-6">All Polls</h1>

      {/* Use AdminPollManagement with clickable cards */}
      <AdminPollManagement isCardClickable />
    </AppLayout>
  );
}
