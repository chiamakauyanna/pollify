import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/common/Loader";
import Toast from "@/components/common/Toast";
import { fetchPolls, deletePoll } from "@/redux/slices/pollSlice";
import {
  selectPolls,
  selectPollError,
  selectPollLoading,
} from "@/redux/selectors/pollSelectors";
import { AppDispatch } from "@/redux/store";
import UpdatePollForm from "./PollUpdateForm";
import { useRouter } from "next/router";

interface AdminPollManagementProps {
  pollId?: string;
  isCardClickable?: boolean;
}

const AdminPollManagement = ({
  pollId,
  isCardClickable = false,
}: AdminPollManagementProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const allPolls = useSelector(selectPolls);
  const loading = useSelector(selectPollLoading);
  const error = useSelector(selectPollError);

  const [mounted, setMounted] = useState(false);
  const [editingPollId, setEditingPollId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!pollId) {
      setMounted(true);
      dispatch(fetchPolls());
    } else {
      setMounted(true);
    }
  }, [dispatch, pollId]);

  const polls = pollId ? allPolls.filter((p) => p.id === pollId) : allPolls;

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this poll?")) return;
    await dispatch(deletePoll(id));
    setOpenMenuId(null);
  };

  const refreshPolls = () => dispatch(fetchPolls());

  if (!mounted || loading) return <Loader />;
  if (polls.length === 0) return <p className="p-6">No polls available.</p>;

  return (
    <div className="space-y-6">
      {error && <Toast message={error} type="error" />}
      <div className="grid md:grid-cols-1 gap-6">
        {polls.map((poll) => (
          <div
            key={poll.id}
            className={`bg-white rounded-xl shadow p-4 space-y-2 cursor-pointer ${
              isCardClickable ? "hover:bg-gray-50 transition" : ""
            }`}
            onClick={() =>
              isCardClickable && router.push(`/dashboard/polls/${poll.id}`)
            }
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">{poll.title}</h3>

              {!isCardClickable && (
                <div className="relative">
                  <button
                    className="text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === poll.id ? null : poll.id);
                    }}
                  >
                    ⋮
                  </button>

                  {openMenuId === poll.id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg z-10">
                      <button
                        onClick={() => setEditingPollId(poll.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(poll.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status */}
            <p className="text-gray-600">
              Status: {poll.is_active ? "Active" : "Inactive"} | Votable:{" "}
              {poll.is_votable ? "Yes" : "No"}
            </p>

            {/* Choices */}
            <div className="mt-4">
              <h4 className="font-semibold">Choices</h4>
              <ul className="list-disc pl-5 space-y-1">
                {poll.choices.map((choice) => (
                  <li key={choice.id}>{choice.text}</li>
                ))}
              </ul>
            </div>

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
    </div>
  );
};

export default AdminPollManagement;
