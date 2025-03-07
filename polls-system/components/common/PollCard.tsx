import { useDispatch, useSelector } from "react-redux";
import { voteCandidate, selectPolls } from "@/redux/slices/pollSlice";

const PollCard = ({ poll }) => {
  const dispatch = useDispatch();

  const handleVote = (candidateName) => {
    dispatch(voteCandidate({ pollId: poll.id, candidateName }));
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-bold">{poll.question}</h2>
      {poll.candidates.map((candidate) => (
        <button key={candidate.name} onClick={() => handleVote(candidate.name)}>
          {candidate.name} ({candidate.votes} votes)
        </button>
      ))}
    </div>
  );
};

export default PollCard;
