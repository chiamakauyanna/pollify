import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { fetchPolls, selectPolls, voteInPoll } from "@/redux/slices/pollSlice";
import { AppDispatch } from "@/redux/store";

const PollDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const pollData = useSelector(selectPolls);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  if (!pollData) return <p className="text-center">Loading poll...</p>;

  // Ensure pollData has results and find the poll
  const poll = pollData?.results?.find((p) => String(p.id) === String(id));

  if (!poll) return <p className="text-center text-red-500">Poll not found.</p>;

  const handleVote = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const submitVote = () => {
    if (selectedOption) {
      dispatch(voteInPoll( option: selectedOption ));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-2">{poll.title}</h1>
      <p className="mb-4">{poll.description}</p>

      <div className="space-y-3">
        {poll.options.map((option) => (
          <label
            key={option.id}
            className={`flex items-center space-x-3 p-3 border rounded-md cursor-pointer transition-all 
              ${selectedOption === option.id ? "bg-primary text-white" : "border-gray-300 hover:bg-gray-100"}
            `}
          >
            <input
              type="checkbox"
              checked={selectedOption === option.id}
              onChange={() => handleVote(option.id)}
              className="w-5 h-5 accent-white"
            />
            <span className="text-gray-700">{option.text}</span>
          </label>
        ))}
      </div>

      <button
        onClick={submitVote}
        disabled={!selectedOption}
        className={`mt-4 w-full py-3 px-4 font-semibold rounded-md transition-all
          ${selectedOption ? "bg-secondary text-white hover:bg-primary-dark" : "bg-gray-300 cursor-not-allowed"}
        `}
      >
        Submit Vote
      </button>
    </div>
  );
};

export default PollDetails;
