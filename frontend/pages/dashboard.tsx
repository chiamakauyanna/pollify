import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchActivePolls, selectActivePolls } from "@/redux/slices/pollSlice";
import { RootState, AppDispatch } from "@/redux/store";
import Button from "@/components/common/Button";
import Link from "next/link";
import PollSection from "@/components/common/PollSection";
import DashboardCard from "@/components/common/DashboardCard";
import { Plus, Settings } from "lucide-react";
import Loader from "@/components/common/Loader";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const { activePolls, loading, error } = useSelector((state: RootState) => ({
    activePolls: selectActivePolls(state) || [],
    loading: state.polls.loading,
    error: state.polls.error,
  }));

  useEffect(() => {
    dispatch(fetchActivePolls());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto p-6">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Welcome to Pollify
        </h1>
        <p>Manage and monitor active polls easily.</p>
      </div>

      {/* Dashboard Summary */}
      <div className="max-w-lg">
        <DashboardCard title="Active Polls" count={activePolls.length} />
      </div>

      <div className="flex gap-4 mt-6">
        <Link href="/create-poll">
          <Button
            icon={<Plus size={20} />}
            text=""
            className="bg-primary text-background py-3.5 px-6 hover:bg-secondary"
          >
            Create Poll
          </Button>
        </Link>
        <Link href="/manage-poll">
          <Button
            icon={<Settings size={20} />}
            className="border border-primary hover:bg-secondary hover:text-background text-primary py-3 px-6"
          >
            Manage Polls
          </Button>
        </Link>
      </div>

      {/* Active Polls Section */}
      <div className="mt-8">
        <PollSection title="Active Polls" polls={activePolls} />
      </div>
    </section>
  );
}
