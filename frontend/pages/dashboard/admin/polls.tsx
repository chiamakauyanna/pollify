import AppLayout from "@/components/layouts/app/AppLayout";
import AdminPollManagement from "@/components/polls/AdminPollManagement";
import { useSelector } from "react-redux";
import { selectPolls } from "@/redux/selectors/pollSelectors";

export default function ManagePollsPage() {
  const polls = useSelector(selectPolls);
  return (
    <AppLayout>
      <h1 className="text-3xl font-bold mb-6">Manage Polls</h1>

      {/*  Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2>Total Polls</h2>
          <p>{polls.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2>Active Polls</h2>
          <p>{polls.filter((p) => p.is_active).length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2>Votable Polls</h2>
          <p>{polls.filter((p) => p.is_votable).length}</p>
        </div>
      </div>

      <AdminPollManagement />
    </AppLayout>
  );
}
