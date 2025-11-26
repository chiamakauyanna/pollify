import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VoterLayout from "@/components/layouts/app/VoterLayout";
import { useRouter } from "next/router";
import { fetchPublicPolls } from "@/redux/slices/pollSlice";
import { selectPublicPolls, selectPollLoading, selectPollError } from "@/redux/selectors/pollSelectors";
import { AppDispatch } from "@/redux/store";
import Loader from "@/components/common/Loader";
import Toast from "@/components/common/Toast";

export default function VoterDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const polls = useSelector(selectPublicPolls);
  const loading = useSelector(selectPollLoading);
  const error = useSelector(selectPollError);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    dispatch(fetchPublicPolls());
  }, [dispatch]);

  if (!mounted || loading) return <Loader />;

  return (
    <VoterLayout>
      <h1 className="text-2xl font-bold mb-4">Active Polls</h1>
      {error && <Toast message={error} type="error" />}
      {polls.filter(p => p.is_active).length === 0 ? (
        <p>No active polls at the moment.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls
            .filter(poll => poll.is_active)
            .map(poll => (
              <div
                key={poll.id}
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition cursor-pointer"
                onClick={() => router.push(`/dashboard/voter/polls/${poll.id}`)}
              >
                <h2 className="text-xl font-bold mb-2">{poll.title}</h2>
                {poll.description && <p className="text-gray-600 mb-4">{poll.description}</p>}
                <p className="text-sm text-gray-500">
                  {poll.choices.length} choices | {poll.is_votable ? "Votable" : "Closed"}
                </p>
              </div>
            ))}
        </div>
      )}
    </VoterLayout>
  );
}
