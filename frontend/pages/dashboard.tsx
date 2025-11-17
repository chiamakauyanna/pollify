import { useEffect, useState } from "react";
import Footer from "@/components/layouts/landing/Footer";
import Loader from "@/components/common/Loader";
import Toast from "@/components/common/Toast";
import { useAuth } from "@/hooks/useAuth";
import { usePolls } from "@/hooks/usePolls";
import AppLayout from "@/components/layouts/app/AppLayout";
import { useRouter } from "next/router";
import PollForm from "./polls/components/PollForm";
import PollItem from "./polls/components/PollItem";

const Dashboard = () => {
  const router = useRouter();
  const { user, loading: authLoading, error: authError } = useAuth();
  const { polls, loadPolls, loading: pollsLoading, error: pollsError } = usePolls();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadPolls();
  }, [loadPolls]);

  // Only redirect on client
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [mounted, authLoading, user, router]);

  if (authLoading || pollsLoading || !mounted) return <Loader />;

  if (!user) return null; // router will redirect

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {authError && <Toast message={authError} type="error" />}
        {pollsError && <Toast message={pollsError} type="error" />}

        {/* Admin section */}
        {user.role === "admin" && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Create a Poll</h2>
            <PollForm />
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-4">Available Polls</h2>
        {polls.length === 0 ? (
          <p className="text-gray-600">No polls available.</p>
        ) : (
          <div className="grid gap-4">
            {polls.map((poll) => (
              <PollItem key={poll.id} poll={poll} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

Dashboard.getLayout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Dashboard;
