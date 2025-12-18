import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import AppLayout from "@/components/layouts/app/AppLayout";
import Loader from "@/components/common/Loader";
import Toast from "@/components/common/Toast";
import { fetchPolls, fetchAdminAnalytics } from "@/redux/slices/pollSlice";
import {
  selectPolls,
  selectAdminAnalytics,
  selectPollLoading,
  selectPollError,
} from "@/redux/selectors/pollSelectors";
import { AppDispatch } from "@/redux/store";
import { Plus } from "lucide-react";

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const polls = useSelector(selectPolls);
  const adminAnalytics = useSelector(selectAdminAnalytics);
  const loading = useSelector(selectPollLoading);
  const error = useSelector(selectPollError);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchPolls());
    dispatch(fetchAdminAnalytics());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
      <div className="space-y-12 mt-12">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 lg:px-12 md:px-4">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">
              Admin Dashboard
            </h1>
            <p className="text-secondary-text">
              Welcome back! Here’s a quick overview of your polls and analytics.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard/create")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-secondary transition"
          >
            <Plus className="w-5 h-5" />
            <span>Create Poll</span>
          </button>
        </div>

        {error && <Toast message={error} type="error" />}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded-2xl shadow hover:shadow-xl transition duration-200 text-center">
            <h2 className="text-md md:text-lg font-semibold text-secondary-text mb-2">
              Total Polls
            </h2>
            <p className="text-3xl">{adminAnalytics?.total_polls || 0}</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-2xl shadow hover:shadow-xl transition duration-200 text-center">
            <h2 className="text-md md:text-lg font-semibold text-secondary-text mb-2">
              Active Polls
            </h2>
            <p className="text-3xl">{adminAnalytics?.active_polls || 0}</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-2xl shadow hover:shadow-xl transition duration-200 text-center">
            <h2 className="text-md md:text-lg font-semibold text-secondary-text mb-2">
              Votable Polls
            </h2>
            <p className="text-3xl">{adminAnalytics?.votable_polls || 0}</p>
          </div>
        </div>

        {/* Detailed Overview */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-purple-700">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="py-8 px-4 bg-purple-50 rounded-xl text-center shadow-sm">
              <h3 className="text-sm font-medium mb-1 text-purple-700">
                Total Votes
              </h3>
              <p className="text-xl font-bold text-purple-900">
                {adminAnalytics?.total_votes || 0}
              </p>
            </div>

            <div className="py-8 px-4 bg-green-50 rounded-xl text-center shadow-sm">
              <h3 className="text-sm font-medium mb-1 text-green-700">
                Today's Votes
              </h3>
              <p className="text-xl font-bold text-green-900">
                {adminAnalytics?.todays_votes || 0}
              </p>
            </div>

            <div className="py-8 px-4 bg-blue-50 rounded-xl text-center shadow-sm">
              <h3 className="text-sm font-medium mb-1 text-blue-700">
                Closed Polls
              </h3>
              <p className="text-xl font-bold text-blue-900">
                {adminAnalytics?.closed_polls || 0}
              </p>
            </div>

            <div className="py-8 px-4 bg-yellow-50 rounded-xl text-center shadow-sm">
              <h3 className="text-sm font-medium mb-1 text-yellow-700">
                Upcoming Polls
              </h3>
              <p className="text-xl font-bold text-yellow-900">
                {adminAnalytics?.upcoming_polls || 0}
              </p>
            </div>

            <div className="py-8 px-4 bg-pink-50 rounded-xl text-center shadow-sm">
              <h3 className="text-sm font-medium mb-1 text-pink-700">
                Unique Voters
              </h3>
              <p className="text-xl font-bold text-pink-900">
                {adminAnalytics?.unique_voters || 0}
              </p>
            </div>

            <div className="py-8 px-4 bg-indigo-50 rounded-xl text-center shadow-sm">
              <h3 className="text-sm font-medium mb-1 text-indigo-700">
                VoteLink Usage
              </h3>
              <p className="text-xl font-bold text-indigo-900">
                {adminAnalytics?.votelink_usage_percent || 0}%
              </p>
            </div>

            <div className="py-8 px-4 bg-teal-50 rounded-xl text-center shadow-sm">
              <h3 className="text-sm font-medium mb-1 text-teal-700">
                Most Voted Poll
              </h3>
              <p className="text-xl font-bold text-teal-900">
                {adminAnalytics?.most_voted_poll || "-"}
              </p>
            </div>

            <div className="py-8 px-4 bg-gray-50 rounded-xl text-center shadow-sm">
              <h3 className="text-sm font-medium mb-1 text-gray-700">
                Least Voted Poll
              </h3>
              <p className="text-xl font-bold text-gray-900">
                {adminAnalytics?.least_voted_poll || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}

AdminDashboard.getLayout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;