import { useEffect } from "react";
import { useRouter } from "next/router";
import { usePolls } from "@/hooks/usePolls";
import PollStats from "./components/PollStats";
import Loader from "@/components/common/Loader";
import Toast from "@/components/common/Toast";

const PollDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { currentPoll, pollStats, loading, error, loadPoll, vote } = usePolls();

  useEffect(() => {
    if (id) loadPoll(id as string);
  }, [id, loadPoll]);

  const handleVote = (choiceId: string) => {
    if (!currentPoll) return;
    vote({ poll: currentPoll.id, choice: choiceId });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-6">
        {loading && <Loader />}
        {error && <Toast message={error} type="error" />}
        {currentPoll && (
          <div className="bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold">{currentPoll.title}</h1>
            {currentPoll.description && (
              <p className="text-gray-600 mt-2">{currentPoll.description}</p>
            )}

            <PollStats poll={currentPoll} stats={pollStats} onVote={handleVote} />
          </div>
        )}
      </main>
    </div>
  );
};

export default PollDetailPage;
