import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPolls, selectPolls } from "@/redux/slices/pollSlice";
import Link from "next/link";
import { AppDispatch } from "@/redux/store";
import { CheckSquare, BarChart2 } from "lucide-react"; // Import vote & results icons

const Vote = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pollData = useSelector(selectPolls);

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  const activePolls = pollData?.results || [];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header with Icon */}
      <h1 className="text-3xl font-bold text-primary text-center mb-6 flex items-center justify-center gap-2">
        <CheckSquare className="w-7 h-7 text-primary" /> Vote Now!
      </h1>

      {activePolls.length === 0 ? (
        <p className="text-gray-500 text-center">No active polls available.</p>
      ) : (
        <div className="space-y-4">
          {activePolls.map((poll) => (
            <div
              key={poll.id}
              className="p-5 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800">{poll.title}</h2>
              <p className="text-gray-600">{poll.description}</p>

              <div className="flex justify-between items-center mt-4">
                {/* Vote Now Button */}
                <Link
                  href={`/poll/${poll.id}`}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-all flex items-center gap-2"
                >
                  <CheckSquare className="w-5 h-5 text-white" /> Vote Now
                </Link>

                {/* View Results Link */}
                <Link
                  href={`/poll/${poll.id}/results`}
                  className="text-primary text-sm flex items-center gap-2 hover:underline"
                >
                  <BarChart2 className="w-5 h-5 text-primary" /> View Results
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vote;
