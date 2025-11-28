import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "@/components/layouts/app/AppLayout";
import Loader from "@/components/common/Loader";
import Toast from "@/components/common/Toast";
import {
  fetchPolls,
  fetchAdminAnalytics,
} from "@/redux/slices/pollSlice";
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
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {error && <Toast message={error} type="error" />}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow text-center">
            <h2 className="text-lg font-semibold">Total Polls</h2>
            <p className="text-2xl">{polls.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <h2 className="text-lg font-semibold">Active Polls</h2>
            <p className="text-2xl">{polls.filter(p => p.is_active).length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <h2 className="text-lg font-semibold">Total Votes</h2>
            <p className="text-2xl">{adminAnalytics?.total_votes || 0}</p>
          </div>
        </div>

        {/* Admin Overview */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>Total Users: {adminAnalytics?.total_users || 0}</div>
            <div>Closed Polls: {adminAnalytics?.closed_polls || 0}</div>
            <div>Total Votes: {adminAnalytics?.total_votes || 0}</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
