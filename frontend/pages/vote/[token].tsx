import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  fetchPollByToken,
  submitVote,
  fetchPollStats,
  clearMessages,
} from "@/redux/slices/pollSlice";
import Loader from "@/components/common/Loader";
import Toast from "@/components/common/Toast";
import { motion, AnimatePresence } from "framer-motion";

const progressColors = [
  "bg-primary",
  "bg-secondary",
  "bg-green-500",
  "bg-yellow-400",
  "bg-pink-500",
  "bg-purple-500",
];

const VotePage = () => {
  const router = useRouter();
  const { token } = router.query as { token: string };
  const dispatch = useDispatch<AppDispatch>();

  const { currentPoll, pollStats, loading, error, successMessage } =
    useSelector((state: RootState) => state.polls);

  const [selectedChoice, setSelectedChoice] = useState<string>("");
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (!token) return;

    dispatch(fetchPollByToken(token)).then((res: any) => {
      const pollData = res.payload;
      if (pollData?.id) {
        if (pollData.has_voted || !pollData.is_votable) {
          dispatch(fetchPollStats(pollData.id));
        }
        setHasVoted(Boolean(pollData.has_voted));
      }
    });

    return () => {
      dispatch(clearMessages());
      setSelectedChoice("");
      setVoting(false);
      setHasVoted(false);
    };
  }, [token, dispatch]);

  const handleVote = async () => {
    if (!selectedChoice) return alert("Please select a choice");
    if (!currentPoll?.is_votable) return alert("Voting is closed");
    if (!token) return alert("Invalid vote link");

    try {
      setVoting(true);
      await dispatch(
        submitVote({
          poll: currentPoll.id,
          choice: selectedChoice,
          votelink: token,
        })
      ).unwrap();

      await dispatch(fetchPollStats(currentPoll.id));
      setSelectedChoice("");
      setHasVoted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setVoting(false);
    }
  };

  if (loading || !currentPoll) return <Loader />;

  const totalVotes =
    pollStats?.stats?.reduce((sum: number, c: { votes: number }) => sum + c.votes, 0) || 0;

  return (
    <div className="max-w-xl w-full mx-auto p-4 sm:p-6 mt-10 bg-white shadow-md rounded-xl">
      {error && <Toast message={error} type="error" />}

      <h1 className="text-2xl font-bold mb-2 sm:mb-4">{currentPoll.title}</h1>
      {currentPoll.description && (
        <p className="mb-6 text-gray-700">{currentPoll.description}</p>
      )}

      {/* Vote form */}
      {!hasVoted && currentPoll.is_votable && (
        <div className="space-y-4 mb-6">
          {currentPoll.choices?.length === 0 && (
            <p className="text-gray-500">No choices available for this poll.</p>
          )}

          <AnimatePresence>
            {currentPoll.choices?.map((choice: any, idx: number) => {
              const isSelected = selectedChoice === choice.id;
              return (
                <motion.label
                  key={choice.id}
                  layout
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "border-primary bg-primary/10" : "border-gray-300"
                  }`}
                >
                  <span>{choice.text}</span>
                  <input
                    type="radio"
                    name="choice"
                    value={choice.id}
                    checked={isSelected}
                    onChange={() => setSelectedChoice(choice.id)}
                    className="form-radio"
                  />
                </motion.label>
              );
            })}
          </AnimatePresence>

          <button
            type="button"
            onClick={handleVote}
            disabled={voting || !selectedChoice}
            className={`mt-4 w-full py-2 rounded text-white font-semibold transition ${
              voting || !selectedChoice
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-secondary"
            }`}
          >
            {voting ? "Voting..." : "Submit Vote"}
          </button>
        </div>
      )}

      {/* Friendly messages */}
      {!hasVoted && !currentPoll.show_results && !currentPoll.is_votable && (
        <p className="text-gray-500 mb-4">
          Poll closed — results are hidden until the poll ends.
        </p>
      )}
      {hasVoted && (
        <p className="text-blue-600 mb-4">You already voted — thank you for participating!</p>
      )}

      {/* Results */}
      {pollStats?.stats && (currentPoll.show_results || hasVoted) && (
        <div className="mt-6 space-y-3">
          <h2 className="text-xl font-semibold mb-2">Results:</h2>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-3">
            {pollStats.stats.map((choice: any, idx: number) => {
              const colorClass = progressColors[idx % progressColors.length];
              return (
                <div key={choice.choice_id} className="flex items-center space-x-2">
                  <span className={`w-4 h-4 rounded-full ${colorClass}`}></span>
                  <span className="text-gray-700">{choice.text}</span>
                </div>
              );
            })}
          </div>

          <ul className="space-y-2">
            {pollStats.stats.map((choice: any, idx: number) => {
              const percentage = totalVotes
                ? ((choice.votes / totalVotes) * 100).toFixed(1)
                : "0.0";
              const colorClass = progressColors[idx % progressColors.length];

              return (
                <li key={choice.choice_id} className="flex flex-col">
                  <div className="flex justify-between text-gray-700 mb-1">
                    <span>{choice.text}</span>
                    <span>{choice.votes} votes ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${colorClass} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
    </div>
  );
};

export default VotePage;
