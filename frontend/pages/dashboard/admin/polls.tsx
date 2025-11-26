import AppLayout from "@/components/layouts/app/AppLayout";
import AdminPollManagement from "@/pages/polls/components/AdminPollManagement";

export default function ManagePollsPage() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Polls</h1>
      <AdminPollManagement />
    </AppLayout>
  );
}
