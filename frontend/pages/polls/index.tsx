import { useEffect } from "react";
import { usePolls } from "../../hooks/usePolls";
import PollItem from "./components/PollItem";
import Loader from "../../components/common/Loader";
import Toast from "../../components/common/Toast";

const PollsPage = () => {
  const { polls, loading, error, loadPolls } = usePolls();

  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Available Polls</h1>

        {loading && <Loader />}
        {error && <Toast message={error} type="error" />}

        <div className="grid gap-4">
          {polls.length === 0 && !loading && <p>No polls available.</p>}
          {polls.map((poll) => (
            <PollItem key={poll.id} poll={poll} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PollsPage;
