import { selectActivePolls } from "@/redux/slices/pollSlice";
import { AppDispatch } from "@/redux/store";
import { fetchActivePolls, voteInPoll } from "@/redux/slices/pollSlice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PollDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const ActivePollData = useSelector(selectActivePolls);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const voterId = "12345"; // Simulated voter ID (should be dynamic in real app)
  
  // Get voted polls from localStorage
  const hasVoted = typeof window !== "undefined" && localStorage.getItem(`voted_poll_${id}`);

  useEffect(() => {
    if (id) {
      dispatch(fetchActivePolls());
    }
  }, [dispatch, id]);

  if (!ActivePollData) return <p className="text-center">Loading poll...</p>;

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

    console.log("Submitting vote for option:", selectedOption, "Voter ID:", voterId, "poll:", poll);

    dispatch(voteInPoll({ optionId: selectedOption, voterId, poll }))
      .unwrap()
      .then(() => {
        // Save the voted poll in localStorage
        localStorage.setItem(`voted_poll_${id}`, "true");

        alert("Vote submitted successfully!");
        router.push(`/poll/${id}/results`); // Redirect to results page
      })
      .catch((error) => alert(`Voting failed: ${error}`));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-2">{poll.title}</h1>
      <p className="mb-4">{poll.description}</p>

      {hasVoted ? (
        <p className="text-center text-green-500 text-lg">You have already voted in this poll.</p>
      ) : poll.options?.length ? (
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
                onChange={() => handleVote(String(option.id))}
                className="w-5 h-5 accent-primary"
              />
              <span className="text-gray-700">{option.text}</span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No options available.</p>
      )}

      {!hasVoted && (
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
      )}

      {/* Go Back Button */}
      <button
        onClick={() => router.push("/vote")}
        className="mt-4 w-full py-3 px-4 font-semibold rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition-all"
      >
        Go Back
      </button>
    </div>
  );
};

export default PollDetails;
