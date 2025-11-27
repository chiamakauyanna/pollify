import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/common/Loader";
import Toast from "@/components/common/Toast";
import { fetchPolls, deletePoll, fetchPollResults, generateVoteLink } from "@/redux/slices/pollSlice";
import { selectPolls, selectPollError, selectPollLoading } from "@/redux/selectors/pollSelectors";
import { AppDispatch } from "@/redux/store";
import { BarChart, Bar, Tooltip, ResponsiveContainer } from "recharts";
import UpdatePollForm from "./PollUpdateForm";

const AdminPollManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const polls = useSelector(selectPolls);
  const loading = useSelector(selectPollLoading);
  const error = useSelector(selectPollError);

  const [mounted, setMounted] = useState(false);
  const [pollResults, setPollResults] = useState<Record<string, any[]>>({});
  const [editingPollId, setEditingPollId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchPolls());
  }, [dispatch]);

  const handleDelete = async (pollId: string) => {
    if (!confirm("Are you sure you want to delete this poll?")) return;
    await dispatch(deletePoll(pollId));
  };

  const handleGenerateLink = async (pollId: string) => {
    try {
      const token = await dispatch(generateVoteLink({ pollId })).unwrap();
      alert(`Vote link generated: ${token.token}`);  
    } catch (err) {
      console.error("Failed to generate vote link:", err);
    }
  };

  const loadResults = async (pollId: string) => {
    try {
      const results = await dispatch(fetchPollResults(pollId)).unwrap();
      setPollResults((prev) => ({ ...prev, [pollId]: results.results }));
    } catch (err) {
      console.error(err);
    }
  };

  const refreshPolls = () => dispatch(fetchPolls());

  if (!mounted || loading) return <Loader />;

  return (
    <div className="min-h-screen p-6 bg-gray-50 space-y-6">
      {error && <Toast message={error} type="error" />}
      {polls.length === 0 ? (
        <p>No polls available.</p>
      ) : (
        <div className="grid md:grid-cols-1 gap-6">
          {polls.map((poll) => (
            <div key={poll.id} className="bg-white rounded shadow p-4 space-y-2">
              {/* Header with actions */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{poll.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPollId(poll.id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleGenerateLink(poll.id)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Generate Link
                  </button>
                  <button
                    onClick={() => loadResults(poll.id)}
                    className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
                  >
                    Show Results
                  </button>
                  <button
                    onClick={() => handleDelete(poll.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Poll info */}
              <p className="text-gray-600">
                Status: {poll.is_active ? "Active" : "Inactive"} | Votable: {poll.is_votable ? "Yes" : "No"}
              </p>

              {/* Choices displayed for management */}
              <div className="mt-2">
                <h4 className="font-semibold">Choices</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {poll.choices.map((choice) => (
                    <li key={choice.id} className="flex justify-between">
                      <span>{choice.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mini Bar Chart for results */}
              {pollResults[poll.id] && pollResults[poll.id].length > 0 && (
                <div className="h-40 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pollResults[poll.id]}>
                      <Tooltip />
                      <Bar dataKey="votes_count" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Update Form */}
              {editingPollId === poll.id && (
                <UpdatePollForm
                  pollId={poll.id}
                  currentTitle={poll.title}
                  currentDescription={poll.description}
                  currentChoices={poll.choices}
                  onClose={() => setEditingPollId(null)}
                  onUpdated={refreshPolls}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPollManagement;
