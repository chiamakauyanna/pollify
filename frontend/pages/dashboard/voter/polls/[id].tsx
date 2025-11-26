import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VoterLayout from "@/components/layouts/app/VoterLayout";
import { useRouter } from "next/router";
import {
  fetchPublicPollById,
  fetchPollResults,
  submitVote,
} from "@/redux/slices/pollSlice";
import {
  selectPollLoading,
  selectPollError,
  selectCurrentPoll,
  selectPollResultsCount,
} from "@/redux/selectors/pollSelectors";
import { AppDispatch } from "@/redux/store";
import Loader from "@/components/common/Loader";
import Toast from "@/components/common/Toast";

export default function PollDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = router.query;

  const poll = useSelector(selectCurrentPoll);
  const loading = useSelector(selectPollLoading);
  const error = useSelector(selectPollError);
  const totalVotes = useSelector(selectPollResultsCount);

  const [selectedChoice, setSelectedChoice] = useState<string>("");
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchPublicPollById(id as string));
    dispatch(fetchPollResults(id as string));
  }, [id, dispatch]);

  const handleVote = async () => {
    if (!poll?.is_votable) return alert("Voting is closed");
    if (!selectedChoice) return alert("Select a choice");
    const votelink = poll?.vote_links?.[0]?.token;
    if (!votelink) return alert("No vote link available");

    try {
      setVoting(true);
      await dispatch(
        submitVote({ poll: poll.id, choice: selectedChoice, votelink })
      );
      alert("Vote submitted!");
      setSelectedChoice("");
      dispatch(fetchPollResults(poll.id));
    } catch (err) {
      console.error(err);
    } finally {
      setVoting(false);
    }
  };

  if (loading || !poll) return <Loader />;

  return (
    <VoterLayout>
      {error && <Toast message={error} type="error" />}
      <h1 className="text-2xl font-bold mb-4">{poll.title}</h1>
      {poll.description && (
        <p className="mb-4 text-gray-700">{poll.description}</p>
      )}
      <div className="space-y-4">
        {poll.choices.map((choice) => {
          const percent = totalVotes
            ? Math.round((choice.votes_count! / totalVotes) * 100)
            : 0;
          return (
            <div key={choice.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-2">
                <span>{choice.text}</span>
                {poll.is_votable ? (
                  <input
                    type="radio"
                    name="choice"
                    value={choice.id}
                    checked={selectedChoice === choice.id}
                    onChange={() => setSelectedChoice(choice.id)}
                    disabled={!poll.is_votable} // <-- disable when not votable
                  />
                ) : (
                  <span className="text-gray-600">
                    {percent}% ({choice.votes_count})
                  </span>
                )}
              </div>
              {!poll.is_votable && (
                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-primary rounded"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {poll.is_votable && (
        <button
          onClick={handleVote}
          disabled={voting || !selectedChoice}
          className={`mt-4 px-4 py-2 rounded text-white transition
      ${
        voting || !selectedChoice
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-primary hover:bg-secondary"
      }`}
        >
          {voting ? "Voting..." : "Submit Vote"}
        </button>
      )}
    </VoterLayout>
  );
}
