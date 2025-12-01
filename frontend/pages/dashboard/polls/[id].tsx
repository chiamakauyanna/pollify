import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "@/components/layouts/app/AppLayout";
import AdminPollManagement from "@/components/polls/AdminPollManagement";
import {
  fetchPoll,
  fetchPollStats,
  generateVoteLink,
} from "@/redux/slices/pollSlice";
import {
  selectPollLoading,
  selectPollError,
  selectCurrentPoll,
  selectPollStats,
} from "@/redux/selectors/pollSelectors";
import { AppDispatch } from "@/redux/store";
import Loader from "@/components/common/Loader";
import Toast from "@/components/common/Toast";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const progressColors = [
  "bg-primary",
  "bg-secondary",
  "bg-green-500",
  "bg-yellow-400",
  "bg-pink-500",
  "bg-purple-500",
];

export default function PollDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = router.query;

  const poll = useSelector(selectCurrentPoll);
  const stats = useSelector(selectPollStats);
  const loading = useSelector(selectPollLoading);
  const error = useSelector(selectPollError);

  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;
    dispatch(fetchPoll(id as string));
    dispatch(fetchPollStats(id as string));
  }, [id, dispatch]);

  const handleGenerateLink = async () => {
    if (!id || Array.isArray(id)) return;
    try {
      const tokenResponse = await dispatch(
        generateVoteLink({ pollId: id as string })
      ).unwrap();
      const fullLink = `${window.location.origin}/vote/${tokenResponse.token}`;
      setGeneratedLink(fullLink);
    } catch (err) {
      console.error("Failed to generate vote link:", err);
    }
  };

  if (loading || !poll || !stats)
    return (
      <AppLayout>
        <Loader />
      </AppLayout>
    );

  const totalVotes =
    stats.stats.reduce((sum: number, c: any) => sum + c.votes, 0) || 1;

  return (
    <AppLayout>
      {error && <Toast message={error} type="error" />}

      <div className="space-y-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {/* Poll Title */}
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          {poll.title}
        </h1>

        {/* Generate Vote Link */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={handleGenerateLink}
          >
            Generate Vote Link
          </button>
          <AnimatePresence>
            {generatedLink && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-gray-100 px-3 py-2 rounded flex items-center space-x-2 break-all w-full sm:w-auto"
              >
                <span className="text-blue-600 truncate">{generatedLink}</span>
                <button
                  className="ml-2 px-2 py-1 text-gray-700 hover:text-gray-900 border rounded"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(generatedLink)
                      .then(() => alert("Link copied!"))
                      .catch(() => alert("Failed to copy link"));
                  }}
                >
                  Copy
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        {stats.stats && stats.stats.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {stats.stats.map((choice: any, idx: number) => (
              <div
                key={choice.choice_id}
                className="flex items-center space-x-2"
              >
                <span
                  className={`w-4 h-4 rounded-full ${
                    progressColors[idx % progressColors.length]
                  }`}
                ></span>
                <span className="text-gray-700">{choice.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Backend Stats */}
        {stats.stats && (
          <div className="grid gap-4 md:grid-cols-2">
            {stats.stats.map((choice: any, idx: number) => {
              const percentage = ((choice.votes / totalVotes) * 100).toFixed(1);
              const colorClass = progressColors[idx % progressColors.length];

              return (
                <motion.div
                  key={choice.choice_id}
                  layout
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">
                      {choice.text}
                    </span>
                    <motion.span
                      className="text-sm font-semibold text-gray-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                    >
                      {choice.votes} votes
                    </motion.span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`${colorClass} h-3 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <motion.p
                    className="text-xs text-gray-500 mt-1 font-semibold"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    {percentage}% of total votes
                  </motion.p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Admin Management */}
        <AdminPollManagement pollId={id as string} />
      </div>
    </AppLayout>
  );
}
