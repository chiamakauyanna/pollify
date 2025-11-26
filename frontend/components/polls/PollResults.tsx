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
  show_results: boolean;
}

const PollResults: React.FC<{ poll: Poll }> = ({ poll }) => {
  if (!poll.show_results) return null;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold">{poll.title}</h3>
      {poll.description && <p className="text-gray-600">{poll.description}</p>}

      <ul className="mt-2">
        {poll.choices.map((choice) => (
          <li key={choice.id} className="flex justify-between">
            <span>{choice.text}</span>
            <span>{choice.votes_count ?? 0} votes</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollResults;
