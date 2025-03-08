import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchActivePolls,
  selectActivePolls,
  voteInPoll,
} from "@/redux/slices/pollSlice";
import { AppDispatch } from "@/redux/store";

const PollDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const ActivePollData = useSelector(selectActivePolls);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Fetch polls when the component mounts or when ID changes
  useEffect(() => {
    if (id) {
      dispatch(fetchActivePolls());
    }
  }, [dispatch, id]);

  if (!ActivePollData) return <p className="text-center">Loading poll...</p>;

  // Find the poll by ID
  const poll = ActivePollData.find((p) => String(p.id) === String(id));

  if (!poll) return <p className="text-center text-red-500">Poll not found.</p>;

  const handleVote = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const submitVote = () => {
    if (!selectedOption) {
      alert("Please select an option before voting.");
      return;
    }
  
    console.log("Submitting vote for option:", selectedOption); // ✅ Only logging the string
  
    dispatch(voteInPoll(selectedOption)) // ✅ Sending only the string, not an object
      .unwrap()
      .then(() => alert("Vote submitted successfully!"))
      .catch((error) => alert(`Voting failed: ${error}`));
  };
  
  

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-2">{poll.title}</h1>
      <p className="mb-4">{poll.description}</p>

      {poll.options?.length ? (
        <div className="space-y-3">
          {poll.options.map((option) => (
            <label
              key={option.id}
              className={`flex items-center space-x-3 p-3 border rounded-md cursor-pointer transition-all 
                ${
                  selectedOption === option.id
                    ? "bg-primary text-white"
                    : "border-gray-300 hover:bg-gray-100"
                }
              `}
            >
              <input
                type="radio"
                name="poll-option"
                checked={selectedOption === option.id}
                onChange={() => handleVote(option.id)}
                className="w-5 h-5 accent-primary"
              />
              <span className="text-gray-700">{option.text}</span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No options available.</p>
      )}

      <button
        onClick={submitVote}
        disabled={!selectedOption}
        className={`mt-4 w-full py-3 px-4 font-semibold rounded-md transition-all
          ${
            selectedOption
              ? "bg-secondary text-white hover:bg-primary-dark"
              : "bg-gray-300 cursor-not-allowed"
          }
        `}
      >
        Submit Vote
      </button>
    </div>
  );
};

export default PollDetails;
