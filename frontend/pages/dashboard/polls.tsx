import AppLayout from "@/components/layouts/app/AppLayout";
import AdminPollManagement from "@/components/polls/AdminPollManagement";

export default function PollsPage() {
  return (
    <AppLayout>
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">
        All Polls
      </h1>
      <AdminPollManagement isCardClickable />
    </AppLayout>
  );
}
