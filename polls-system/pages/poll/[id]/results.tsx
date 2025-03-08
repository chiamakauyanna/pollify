import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { fetchPollResults, selectPollResults } from "@/redux/slices/pollSlice";
import { AppDispatch } from "@/redux/store";
import ResultsChart from "@/components/common/Chart";
import { PollOption } from "@/Interfaces/interface";

const PollResults = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const pollResults = useSelector(selectPollResults);

  useEffect(() => {
    if (id && typeof id === "string") {
      dispatch(fetchPollResults(id));
    }
  }, [dispatch, id]);

  const poll = pollResults?.[id as string] || null;
  const optionsArray: PollOption[] = Array.isArray(poll?.options) ? poll.options : [];


  if (!poll) return <p className="text-center text-lg font-semibold mt-4">Loading results...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">{poll.title}</h1>
      <p className="text-gray-600 text-center mb-6">{poll.description}</p>

      <div className="flex justify-center mt-4">
        {optionsArray.length > 0 ? (
          <ResultsChart options={optionsArray} />
        ) : (
          <p className="text-center text-gray-500">No options available.</p>
        )}
      </div>

      <p className="text-center font-semibold mt-6 text-lg text-gray-800">
        Total Votes: <span className="text-blue-600">{poll.total_votes}</span>
      </p>
    </div>
  );
};

export default PollResults;
