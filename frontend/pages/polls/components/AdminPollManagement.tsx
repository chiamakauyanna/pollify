import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "@/components/layouts/app/AppLayout";
import Loader from "@/components/common/Loader";
import Toast from "@/components/common/Toast";

import { fetchPolls, deletePoll, generateVoteLink } from "@/redux/slices/pollSlice";
import { selectPolls, selectPollError, selectPollLoading } from "@/redux/selectors/pollSelectors";
import { AppDispatch } from "@/redux/store";

const AdminPollManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const polls = useSelector(selectPolls);
  const loading = useSelector(selectPollLoading);
  const error = useSelector(selectPollError);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchPolls());
  }, [dispatch]);

  const handleDelete = async (pollId: string) => {
    if (!confirm("Are you sure you want to delete this poll?")) return;
    await dispatch(deletePoll(pollId));
  };

  const handleGenerateVoteLink = async (pollId: string) => {
    try {
      const token = await dispatch(generateVoteLink({ pollId })).unwrap();
      alert(`Vote link generated: ${token}`);
    } catch (err) {
      console.error("Failed to generate vote link:", err);
    }
  };

  if (!mounted || loading) return <Loader />;

  return (
      <div className="min-h-screen p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Poll Management</h1>
        {error && <Toast message={error} type="error" />}

        {polls.length === 0 ? (
          <p>No polls available.</p>
        ) : (
          <table className="w-full bg-white rounded shadow overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Votable</th>
                <th className="p-2 text-left">Created At</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {polls.map((poll) => (
                <tr key={poll.id} className="border-b">
                  <td className="p-2">{poll.title}</td>
                  <td className="p-2">{poll.is_active ? "Active" : "Inactive"}</td>
                  <td className="p-2">{poll.is_votable ? "Yes" : "No"}</td>
                  <td className="p-2">{new Date(poll.created_at).toLocaleString()}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleGenerateVoteLink(poll.id)}
                      className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
                    >
                      Generate Link
                    </button>
                    <button
                      onClick={() => handleDelete(poll.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
  );
};

export default AdminPollManagement;
