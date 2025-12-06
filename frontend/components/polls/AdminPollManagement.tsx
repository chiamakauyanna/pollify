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
import { AdminPollManagementProps } from "@/Interfaces/interface";

const AdminPollManagement = ({
  pollId,
  isCardClickable = false,
  onPollChange,
}: AdminPollManagementProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const allPolls = useSelector(selectPolls);
  const loading = useSelector(selectPollLoading);
  const error = useSelector(selectPollError);

  const [mounted, setMounted] = useState(false);
  const [editingPollId, setEditingPollId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // New states for card click feedback
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [loadingCardId, setLoadingCardId] = useState<string | null>(null);

  useEffect(() => {
    if (!pollId) {
      setMounted(true);
      dispatch(fetchPolls());
    } else {
      setMounted(true);
    }
  }, [dispatch, pollId]);

  const polls = pollId ? allPolls.filter((p) => p.id === pollId) : allPolls;

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(id);
  };

  const refreshPolls = () => {
    dispatch(fetchPolls());
    onPollChange?.(); // <-- also trigger parent refresh if needed
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    await dispatch(deletePoll(confirmDeleteId));
    setConfirmDeleteId(null);
    if (pollId) {
      router.push("/dashboard/polls");
    } else {
      dispatch(fetchPolls());
    }
  };

  const handleCardClick = (id: string) => {
    if (!isCardClickable) return;
    setActiveCardId(id);
    setLoadingCardId(id);
    router.push(`/dashboard/polls/${id}`);
  };

  if (!mounted || loading) return <Loader />;
  if (polls.length === 0)
    return (
      <div className="p-6 text-center text-gray-500">No polls available.</div>
    );

  return (
    <div className="space-y-6">
      {error && <Toast message={error} type="error" />}
      {confirmDeleteId && (
        <Toast
          message="Are you sure you want to delete this poll?"
          type="warning"
          actionLabel="Yes, Delete"
          onAction={confirmDelete}
          onClose={() => setConfirmDeleteId(null)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll) => (
          <div
            key={poll.id}
            className={`relative bg-white rounded-xl shadow p-4 space-y-3 cursor-pointer transition hover:shadow-md ${
              isCardClickable ? "hover:bg-gray-50" : ""
            } ${activeCardId === poll.id ? "bg-gray-200" : ""} ${
              loadingCardId === poll.id ? "opacity-50 pointer-events-none" : ""
            }`}
            onMouseDown={() => isCardClickable && setActiveCardId(poll.id)}
            onMouseUp={() => isCardClickable && setActiveCardId(null)}
            onMouseLeave={() => isCardClickable && setActiveCardId(null)}
            onClick={() => handleCardClick(poll.id)}
          >
            {/* Optional Loading Overlay */}
            {loadingCardId === poll.id && (
              <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center rounded-xl z-10">
                <Loader />
              </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-lg truncate">{poll.title}</h3>

              {!isCardClickable && (
                <div className="relative">
                  <button
                    className="text-gray-600 px-2 py-1 rounded hover:bg-gray-200 focus:outline-none focus:ring"
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
            <p className="text-gray-600 text-sm sm:text-base">
              Status:{" "}
              <span
                className={`font-semibold ${
                  poll.is_votable ? "text-green-600" : "text-gray-400"
                }`}
              >
                {poll.is_votable
                  ? "Active"
                  : poll.is_active
                  ? "Inactive (Closed)"
                  : "Inactive (Not Started)"}
              </span>{" "}
              | Votable:{" "}
              <span
                className={`font-semibold ${
                  poll.is_votable ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {poll.is_votable ? "Yes" : "No"}
              </span>
            </p>

            {/* Choices */}
            <div className="mt-2 overflow-x-auto">
              <h4 className="font-semibold mb-1 text-sm sm:text-base">
                Choices
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
                {poll.choices.map((choice) => (
                  <li key={choice.id}>{choice.text}</li>
                ))}
              </ul>
            </div>

            {/* Update Form */}
            {editingPollId === poll.id && (
              <div className="mt-3">
                <UpdatePollForm
                  pollId={poll.id}
                  currentTitle={poll.title}
                  currentDescription={poll.description}
                  currentChoices={poll.choices}
                  onClose={() => setEditingPollId(null)}
                  onUpdated={refreshPolls}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPollManagement;
