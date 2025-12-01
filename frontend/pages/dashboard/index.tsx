import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const polls = useSelector(selectPolls);
  const adminAnalytics = useSelector(selectAdminAnalytics);
  const loading = useSelector(selectPollLoading);
  const error = useSelector(selectPollError);

  useEffect(() => {
    dispatch(fetchPolls());
    dispatch(fetchAdminAnalytics());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <AppLayout>
      <div className="space-y-12 mt-12">
        {/* Page Title */}
        <div className="flex flex-col justify-between items-start gap-4">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-secondary-text">
            Welcome back! Here’s a quick overview of your polls and analytics.
          </p>
        </div>

        {error && <Toast message={error} type="error" />}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded-2xl shadow hover:shadow-xl transition duration-200 text-center">
            <h2 className="text-md md:text-lg font-semibold text-secondary-text mb-2">
              Total Polls
            </h2>
            <p className="text-3xl">{polls.length}</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-2xl shadow hover:shadow-xl transition duration-200 text-center">
            <h2 className="text-md md:text-lg font-semibold text-secondary-text mb-2">
              Active Polls
            </h2>
            <p className="text-3xl">
              {polls.filter((p) => p.is_active).length}
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-2xl shadow hover:shadow-xl transition duration-200 text-center">
            <h2 className="text-md md:text-lg font-semibold text-secondary-text mb-2">
              Total Votes
            </h2>
            <p className="text-3xl">
              {adminAnalytics?.total_votes || 0}
            </p>
          </div>
        </div>

        {/* Admin Overview */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-purple-700">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="py-8 px-4 bg-purple-50 rounded-xl text-center shadow-sm">
              <h3 className="text-sm font-medium mb-1 text-purple-700">
                Total Users
              </h3>
              <p className="text-xl font-bold text-purple-900">
                {adminAnalytics?.total_users || 0}
              </p>
            </div>
            <div className="py-8 px-4 bg-green-50 rounded-xl text-center shadow-sm">
              <h3 className="text-sm font-medium mb-1 text-green-700">
                Closed Polls
              </h3>
              <p className="text-xl font-bold text-green-900">
                {adminAnalytics?.closed_polls || 0}
              </p>
            </div>
            <div className="py-8 px-4 bg-blue-50 rounded-xl text-center shadow-sm">
              <h3 className="text-sm font-medium mb-1 text-blue-700">
                Total Votes
              </h3>
              <p className="text-xl font-bold text-blue-900">
                {adminAnalytics?.total_votes || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Optional: More widgets, charts, or table */}
      </div>
    </AppLayout>
  );
}
