import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchActivePolls, selectActivePolls } from "@/redux/slices/pollSlice";
import Link from "next/link";
import { AppDispatch, RootState } from "@/redux/store";
import { CheckSquare, BarChart2 } from "lucide-react"; // Import vote & results icons
import Loader from "@/components/common/Loader"; // Import Loader component

const Vote = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Select active polls & loading state
  const { activePolls, loading } = useSelector((state: RootState) => ({
    activePolls: selectActivePolls(state) || [],
    loading: state.polls.loading,
  }));

  useEffect(() => {
    dispatch(fetchActivePolls());
  }, [dispatch]);

  return (
    <div className="max-w-2xl mx-auto lg:p-6 md:p-5">
      {/* Header with Icon */}
      <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-primary text-center mb-6 flex items-center justify-center gap-2">
        Vote Now!
      </h1>

      {/* Show Loader while fetching polls */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : activePolls.length === 0 ? (
        <p className="text-gray-500 text-center">No active polls available.</p>
      ) : (
        <div className="space-y-4">
          {activePolls.map((poll) => (
            <div
              key={poll.id}
              className="p-5 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="lg:text-xl md:text-lg text-lg font-semibold text-gray-800">
                {poll.title}
              </h2>
              <p className="text-gray-600 text-sm">{poll.description}</p>

              <div className="flex justify-between items-center mt-4 gap-3">
                {/* Vote Now Button */}
                <Link
                  href={`/poll/${poll.id}`}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-all flex items-center gap-2 lg:text-lg md:text-sm text-sm"
                >
                  <CheckSquare className="lg:w-5 lg:h-5 md:w-4 md:h-4 w-3 h-3 text-white" /> 
                  Vote
                </Link>

                {/* View Results Link */}
                <Link
                  href={`/poll/${poll.id}/results`}
                  className="text-primary text-sm flex items-center gap-2 hover:underline lg:text-lg md:text-sm"
                >
                  <BarChart2 className=" text-primary lg:w-5 lg:h-5 md:w-4 md:h-4 w-3 h-3" /> 
                  View Results
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
