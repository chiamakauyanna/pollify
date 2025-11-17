import React from "react";
import { Choice } from "@/services/pollService";
import { PollStats as PollStatsType } from "@/services/pollService";

interface PollStatsProps {
  pollStats: PollStatsType;
}

const PollStats: React.FC<PollStatsProps> = ({ pollStats }) => {
  const totalVotes = pollStats.total_votes || 0;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
      <h3 className="text-lg font-bold mb-4">Poll Results</h3>

      {pollStats.choices.map((choice: Choice) => {
        const votes = choice.votes_count || 0;
        const percent = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

        return (
          <div key={choice.id} className="mb-3">
            <div className="flex justify-between mb-1">
              <span>{choice.text}</span>
              <span className="text-gray-600 text-sm">{votes} votes</span>
            </div>
            <div className="w-full bg-gray-200 h-4 rounded-full">
              <div
                className="bg-purple-600 h-4 rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}

      {totalVotes === 0 && <p className="text-gray-500 mt-2">No votes yet.</p>}
    </div>
  );
};

export default PollStats;
