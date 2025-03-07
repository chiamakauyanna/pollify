import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { fetchPollResults, selectPollResults } from "@/redux/slices/pollSlice";
import { AppDispatch } from "@/redux/store";
import ResultsChart from "@/components/common/Chart";

const PollResults = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const pollResults = useSelector(selectPollResults);

  useEffect(() => {
    if (id) {
      dispatch(fetchPollResults(id as string));
    }
  }, [dispatch, id]);

  const poll = pollResults[id as string];

  if (!poll) return <p className="text-center">Loading results...</p>;

  const candidates = poll.options.map((option) => ({
    name: option.text,
    votes: option.votes_count, // Ensure this field exists in API response
  }));

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">{poll.title}</h1>
      <p className="text-gray-600 text-center">{poll.description}</p>
      <div className="flex justify-center mt-6">
        <ResultsChart candidates={candidates} />
      </div>
      <p className="text-center font-semibold mt-4">Total Votes: {poll.total_votes}</p>
    </div>
  );
};

export default PollResults;
