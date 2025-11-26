import { useState } from "react";
import { useDispatch } from "react-redux";
import { submitVote, fetchPollResults } from "@/redux/slices/pollSlice";
import { AppDispatch } from "@/redux/store";

interface Choice {
  id: string;
  text: string;
  votes_count?: number;
}

interface Poll {
  id: string;
  title: string;
  description?: string;
  choices: Choice[];
  vote_links?: { token: string; used: boolean }[];
  is_votable: boolean;
}

interface Props {
  poll: Poll;
  onVoteSuccess?: () => void;
}

const PollItem: React.FC<Props> = ({ poll, onVoteSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedChoice, setSelectedChoice] = useState<string>("");
  const [voting, setVoting] = useState(false);

  const votelink = poll.vote_links?.find((vl) => !vl.used)?.token;

  const handleVote = async () => {
    if (!poll.is_votable) return alert("Voting closed");
    if (!selectedChoice) return alert("Select a choice");
    if (!votelink) return alert("No vote link available");

    try {
      setVoting(true);
      await dispatch(submitVote({ poll: poll.id, choice: selectedChoice, votelink }));
      await dispatch(fetchPollResults(poll.id));
      if (onVoteSuccess) onVoteSuccess();
      setSelectedChoice("");
    } catch (err) {
      console.error(err);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold">{poll.title}</h2>
      {poll.description && <p className="text-gray-600">{poll.description}</p>}

      {poll.is_votable ? (
        <div className="mt-2 flex flex-col gap-2">
          {poll.choices.map((choice) => (
            <label key={choice.id} className="flex items-center gap-2">
              <input
                type="radio"
                name={`poll-${poll.id}`}
                value={choice.id}
                checked={selectedChoice === choice.id}
                onChange={(e) => setSelectedChoice(e.target.value)}
              />
              <span>{choice.text}</span>
              {choice.votes_count !== undefined && <span>({choice.votes_count})</span>}
            </label>
          ))}
          <button
            onClick={handleVote}
            disabled={voting || !selectedChoice}
            className="mt-2 px-4 py-1 bg-primary text-white rounded disabled:opacity-50"
          >
            {voting ? "Voting..." : "Vote"}
          </button>
        </div>
      ) : (
        <p className="text-gray-500 mt-2">Voting closed</p>
      )}
    </div>
  );
};

export default PollItem;
