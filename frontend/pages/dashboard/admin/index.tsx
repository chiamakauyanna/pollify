import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "@/components/layouts/app/AppLayout";
import Loader from "@/components/common/Loader";
import Toast from "@/components/common/Toast";
import {
  fetchPolls,
  fetchPollStats,
  fetchAdminAnalytics,
} from "@/redux/slices/pollSlice";
import {
  selectPolls,
  selectPollStats,
  selectAdminAnalytics,
  selectPollLoading,
  selectPollError,
} from "@/redux/selectors/pollSelectors";
import { AppDispatch } from "@/redux/store";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const polls = useSelector(selectPolls);
  const pollStats = useSelector(selectPollStats);
  const adminAnalytics = useSelector(selectAdminAnalytics);
  const loading = useSelector(selectPollLoading);
  const error = useSelector(selectPollError);

  useEffect(() => {
    dispatch(fetchPolls());
    dispatch(fetchPollStats("all"));
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

        {/* Poll Stats Table */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Poll Stats</h2>
          {pollStats?.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Poll</th>
                    <th className="p-2 text-left">Total Votes</th>
                    <th className="p-2 text-left">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {pollStats.map((stat: any) => (
                    <tr key={stat.poll_id} className="border-b">
                      <td className="p-2">{stat.title}</td>
                      <td className="p-2">{stat.total_votes}</td>
                      <td className="p-2">{stat.is_active ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No stats available.</p>
          )}
        </div>

        {/* Votes Analytics Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Votes Analytics</h2>
          {pollStats?.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pollStats}>
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_votes" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No data for chart.</p>
          )}
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
