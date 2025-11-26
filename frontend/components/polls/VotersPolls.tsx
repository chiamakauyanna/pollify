import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPolls, fetchPollResults, submitVote } from "@/redux/slices/pollSlice";
import { selectPolls, selectPollError, selectPollLoading } from "@/redux/selectors/pollSelectors";
import { AppDispatch } from "@/redux/store";
import Loader from "@/components/common/Loader";
import Toast from "@/components/common/Toast";

interface VoterPollsProps {
  showResultsOnly?: boolean;
}

const VoterPolls: React.FC<VoterPollsProps> = ({ showResultsOnly = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const polls = useSelector(selectPolls);
  const loading = useSelector(selectPollLoading);
  const error = useSelector(selectPollError);

  const [mounted, setMounted] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    dispatch(fetchPolls());
  }, [dispatch]);

  const handleVote = async (pollId: string, choiceId: string) => {
    try {
      const votelink = polls.find(p => p.id === pollId)?.vote_links?.[0]?.token;
      if (!votelink) return alert("No vote link available");
      await dispatch(submitVote({ poll: pollId, choice: choiceId, votelink }));
      alert("Vote submitted!");
      dispatch(fetchPollResults(pollId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!mounted || loading) return <Loader />;

  return (
    <div className="grid gap-4">
      {error && <Toast message={error} type="error" />}
      {polls.length === 0 && <p>No polls available.</p>}

      {polls.map((poll) => {
        const isVotable = poll.is_votable && !showResultsOnly;
        return (
          <div key={poll.id} className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-bold mb-2">{poll.title}</h2>
            {poll.description && <p className="mb-4 text-gray-700">{poll.description}</p>}

            {poll.choices.map((choice) => (
              <div key={choice.id} className="flex justify-between items-center mb-2">
                <span>{choice.text}</span>
                {isVotable ? (
                  <button
                    onClick={() => handleVote(poll.id, choice.id)}
                    className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
                  >
                    Vote
                  </button>
                ) : (
                  <span className="text-gray-500">
                    Votes: {choice.votes_count}
                  </span>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default VoterPolls;
