import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPolls, selectPolls } from "@/redux/slices/pollSlice";
import { RootState, AppDispatch } from "@/redux/store";
import Button from "@/components/common/Button";
import Link from "next/link";
import PollSection from "@/components/common/PollSection";
import DashboardCard from "@/components/common/DashboardCard";
import { Plus, Settings } from "lucide-react";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const pollData = useSelector((state: RootState) => selectPolls(state));

  useEffect(() => {
    dispatch(fetchPolls()); // Fetch active polls
  }, [dispatch]);

  // Ensure we have data and access the 'results' array
  const activePolls = pollData?.results || [];

  return (
    <section className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome to Pollify</h1>
        <p className="">Manage and monitor active polls easily.</p>
      </div>

      {/* Dashboard Summary */}
      <div className="max-w-lg">
        <DashboardCard title="Active Polls" count={activePolls.length} />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <Link href="/create-poll">
          <Button icon={<Plus size={20} />} text="Create Poll" className="bg-primary text-background py-3.5 px-6 hover:bg-secondary" />
        </Link>
        <Link href="/manage-poll">
          <Button icon={<Settings size={20} />} text="Manage Polls" className="border border-primary hover:bg-secondary hover:text-background text-primary py-3 px-6" />
        </Link>
      </div>

      {/* Active Polls Section */}
      <div className="mt-10">
        <PollSection title="Active Polls" polls={activePolls} color="green" />
      </div>
    </section>
  );
}
