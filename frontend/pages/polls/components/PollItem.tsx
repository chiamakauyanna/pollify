import React, { useState } from "react";
import { Poll, Choice } from "@/services/pollService";
import { usePolls } from "@/hooks/usePolls";
import { useAuth } from "@/hooks/useAuth";

interface PollItemProps {
  poll: Poll;
}

const PollItem: React.FC<PollItemProps> = ({ poll }) => {
  const { user } = useAuth();
  const { vote, loadStats, pollStats } = usePolls();
  const [selectedChoice, setSelectedChoice] = useState<string>("");

  const isVoter = user?.role === "voter";
  const isVotable = poll.is_votable;

  const handleVote = async () => {
    if (!selectedChoice) return alert("Please select a choice");

    try {
      await vote({ poll: poll.id, choice: selectedChoice });
      await loadStats(poll.id);
      setSelectedChoice("");
    } catch (err) {
      console.error("Voting failed:", err);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-4 hover:shadow-xl transition">
      <h2 className="text-xl font-bold mb-2">{poll.title}</h2>
      {poll.description && <p className="mb-4 text-gray-700">{poll.description}</p>}

      {isVoter && isVotable ? (
        <div className="space-y-2">
          {poll.choices.map((choice: Choice) => {
            const votesCount = pollStats?.choices.find((c) => c.id === choice.id)?.votes_count;
            return (
              <label key={choice.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={`poll-${poll.id}`}
                  value={choice.id}
                  checked={selectedChoice === choice.id}
                  onChange={(e) => setSelectedChoice(e.target.value)}
                  className="accent-primary"
                />
                <span className="flex-1">{choice.text}</span>
                {votesCount !== undefined && (
                  <span className="text-gray-500 text-sm">({votesCount})</span>
                )}
              </label>
            );
          })}
          <button
            onClick={handleVote}
            className="button-primary mt-2 px-4 py-2 rounded-lg hover:bg-secondary transition"
          >
            Vote
          </button>
        </div>
      ) : (
        <p className="text-gray-500">{isVoter ? "Voting closed" : "You cannot vote on this poll"}</p>
      )}
    </div>
  );
};

export default PollItem;
