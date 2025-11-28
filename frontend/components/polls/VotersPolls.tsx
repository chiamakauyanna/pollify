import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPolls,
  fetchPublicPolls,
  submitVote,
} from "@/redux/slices/pollSlice";
import {
  selectPolls,
  selectPollLoading,
  selectPollError,
} from "@/redux/selectors/pollSelectors";
import { AppDispatch } from "@/redux/store";
import Loader from "@/components/common/Loader";
import Toast from "@/components/common/Toast";

interface VoterPollsProps {
  showResultsOnly?: boolean; // for voter: show results only if allowed
  isAdminView?: boolean; // for admin: display stats instead of vote buttons
}

const VoterPolls: React.FC<VoterPollsProps> = ({
  showResultsOnly = false,
  isAdminView = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const polls = useSelector(selectPolls);
  const loading = useSelector(selectPollLoading);
  const error = useSelector(selectPollError);

  const [mounted, setMounted] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>(
    {}
  );

  // Load polls
  useEffect(() => {
    setMounted(true);
    if (isAdminView) {
      dispatch(fetchPolls());
    } else {
      dispatch(fetchPublicPolls());
    }
  }, [dispatch, isAdminView]);

  const handleVote = async (pollId: string, choiceId: string) => {
    try {
      const votelink = polls.find((p) => p.id === pollId)?.vote_links?.[0]?.token;
      if (!votelink) return alert("No vote link available");

      await dispatch(submitVote({ poll: pollId, choice: choiceId, votelink }));
      alert("Vote submitted!");
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
        const isVotable = poll.is_votable && !showResultsOnly && !isAdminView;

        return (
          <div key={poll.id} className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-bold mb-2">{poll.title}</h2>
            {poll.description && <p className="mb-4 text-gray-700">{poll.description}</p>}

            {poll.choices.map((choice) => (
              <div key={choice.id} className="flex justify-between items-center mb-2">
                <span>{choice.text}</span>

                {/* Admin view: show votes */}
                {isAdminView || (showResultsOnly && choice.votes_count !== null) ? (
                  <span className="text-gray-500">Votes: {choice.votes_count ?? 0}</span>
                ) : isVotable ? (
                  <button
                    onClick={() => handleVote(poll.id, choice.id)}
                    className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
                  >
                    Vote
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default VoterPolls;
