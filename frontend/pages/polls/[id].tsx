import { useEffect } from "react";
import { useRouter } from "next/router";
import PollStats from "./components/PollResults";
import Loader from "../../components/common/Loader";
import Toast from "../../components/common/Toast";
import { usePolls } from "../../hooks/usePolls";

const PollDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { currentPoll, pollStats, loading, error, loadPoll, vote } = usePolls();

  useEffect(() => {
    if (id) loadPoll(id as string);
  }, [id, loadPoll]);

  const handleVote = (choiceId: string) => {
    if (!currentPoll) return;
    if (!currentPoll.is_votable) return alert("Voting for this poll is closed.");
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

            {!currentPoll.is_votable && (
              <p className="mt-4 text-gray-500 font-medium">Voting for this poll is closed.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PollDetailPage;
