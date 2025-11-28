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
        // Fetch stats if user has voted or poll is closed
        if (pollData.has_voted || !pollData.is_votable) {
          dispatch(fetchPollStats(pollData.id));
        }
        setHasVoted(Boolean(pollData.has_voted));
      }
    });

    return () => {
      dispatch(clearMessages());
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

  const totalVotes = pollStats?.stats.reduce((sum: any, c: { votes: any; }) => sum + c.votes, 0) || 1;

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded-xl">
      {error && <Toast message={error} type="error" />}
      <h1 className="text-2xl font-bold mb-4">{currentPoll.title}</h1>
      {currentPoll.description && <p className="mb-6">{currentPoll.description}</p>}

      {/* Vote form */}
      {!hasVoted && currentPoll.is_votable && (
        <div className="space-y-4 mb-6">
          {currentPoll.choices?.map((choice: any) => (
            <label
              key={choice.id}
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="choice"
                value={choice.id}
                checked={selectedChoice === choice.id}
                onChange={() => setSelectedChoice(choice.id)}
                className="form-radio"
              />
              <span>{choice.text}</span>
            </label>
          ))}
          <button
            onClick={handleVote}
            disabled={voting || !selectedChoice}
            className={`mt-4 px-4 py-2 rounded text-white transition ${
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
        <p className="text-blue-600 mb-4">
          You already voted — thank you for participating!
        </p>
      )}

      {/* Results */}
      {pollStats?.stats && (currentPoll.show_results || hasVoted) && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Results:</h2>
          <ul>
            {pollStats.stats.map((choice: any) => {
              const percentage = ((choice.votes / totalVotes) * 100).toFixed(1);
              return (
                <li key={choice.choice_id} className="mb-2">
                  {choice.text}: {choice.votes} votes ({percentage}%)
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
