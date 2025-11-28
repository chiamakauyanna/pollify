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
      console.log("Generated Link:", fullLink);
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
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          &larr; Back
        </button>

        {/* Poll Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {poll.title}
        </h1>

        {/* Generate Vote Link */}
        <div className="flex items-center space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleGenerateLink}
          >
            Generate Vote Link
          </button>
          {generatedLink && (
            <div className="bg-gray-100 px-3 py-2 rounded flex items-center space-x-2 break-all">
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
            </div>
          )}
        </div>

        {/* Backend Stats */}
        {stats && stats.stats && (
          <div className="grid gap-4 md:grid-cols-2">
            {stats.stats.map((choice: any) => {
              const percentage = ((choice.votes / totalVotes) * 100).toFixed(1);
              return (
                <div
                  key={choice.choice_id}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">
                      {choice.text}
                    </span>
                    <span className="text-sm font-semibold text-gray-600">
                      {choice.votes} votes
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-3 bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {percentage}% of total votes
                  </p>
                </div>
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
