import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  deletePoll,
  fetchActivePolls,
  selectActivePolls,
  updatePoll,
} from "@/redux/slices/pollSlice";
import { Poll, PollOption } from "@/Interfaces/interface";
import { Plus, X } from "lucide-react";
import Loader from "@/components/common/Loader";
import ConfirmButton from "@/components/common/ConfirmButton";

const ManagePolls = () => {
  const dispatch = useDispatch<AppDispatch>();
  const activePollsData = useSelector((state: RootState) =>
    selectActivePolls(state)
  );
  const activePolls = activePollsData || [];
  const [editPoll, setEditPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchActivePolls())
      .unwrap()
      .catch(() => setError("Failed to load polls. Please try again."))
      .finally(() => setLoading(false));
  }, [dispatch]);

  const handleUpdate = async () => {
    if (editPoll) {
      setLoading(true);
      setError(null);

      try {
        await dispatch(
          updatePoll({
            id: editPoll.id || "",
            pollData: {
              title: editPoll.title,
              description: editPoll.description,
              expires_at: editPoll.expires_at,
              options: editPoll?.options?.map((opt: PollOption) => ({
                id: opt.id,
                text: opt.text,
              })),
            },
          })
        ).unwrap();
        setEditPoll(null);
      } catch {
        setError("Failed to update poll. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    if (editPoll) {
      const updatedOptions = [...(editPoll?.options || [])];
      updatedOptions[index] = { ...updatedOptions[index], text: value };
      setEditPoll({ ...editPoll, options: updatedOptions });
    }
  };

  const handleAddOption = () => {
    if (editPoll) {
      const newOption: PollOption = { id: "", text: "" };
      setEditPoll({
        ...editPoll,
        options: [...(editPoll.options ?? []), newOption],
      });
    }
  };

  const formatDateForInput = (isoString: string) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Manage Polls</h1>

      {loading && <Loader />}
      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>
      )}

      {!loading && activePolls.length === 0 && (
        <p className="text-gray-500 text-center">No polls available.</p>
      )}

      {!loading && activePolls.length > 0 && (
        <ul className="space-y-4">
          {activePolls.map((poll) => (
            <li key={poll.id} className="p-4 rounded-lg shadow-md">
              {editPoll?.id === poll.id ? (
                <div>
                  {/* Editable Title & Description */}
                  <label className="block font-semibold">Title</label>
                  <input
                    type="text"
                    value={editPoll?.title}
                    onChange={(e) =>
                      setEditPoll({ ...editPoll, title: e.target.value })
                    }
                    className="w-full p-2 mb-2 border rounded"
                  />

                  <label className="block font-semibold">Description</label>
                  <textarea
                    value={editPoll?.description || ""}
                    onChange={(e) =>
                      setEditPoll({ ...editPoll, description: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />

                  {/* Editable Expiration Date */}
                  <label className="block mt-3 font-semibold">
                    Expires At:
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      editPoll?.expires_at
                        ? formatDateForInput(editPoll.expires_at)
                        : ""
                    }
                    onChange={(e) =>
                      setEditPoll({ ...editPoll, expires_at: e.target.value })
                    }
                    className="w-full p-2 mb-2 border rounded"
                  />

                  {/* Editable Options */}
                  <h3 className="mt-3 font-semibold">Options:</h3>
                  {(editPoll?.options || []).map((option, index) => (
                    <div
                      key={option.id}
                      className="flex items-center gap-2 mb-2"
                    >
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        className="w-full p-2 border rounded"
                      />
                      <button
                        onClick={() =>
                          setEditPoll({
                            ...editPoll,
                            options: (editPoll?.options ?? []).filter(
                              (_, i) => i !== index
                            ),
                          })
                        }
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}

                  {/* Add Option Button */}
                  <button
                    onClick={handleAddOption}
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Option
                  </button>

                  {/* Action Buttons */}
                  <div className="flex justify-between mt-4">
                    <ConfirmButton
                      text="Save"
                      onConfirm={handleUpdate}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      disabled={loading}
                    />
                    <button
                      onClick={() => setEditPoll(null)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold">{poll.title}</h2>
                  <p>{poll.description}</p>
                  <p className="mt-1">
                    <strong>Expires at:</strong>{" "}
                    {poll.expires_at
                      ? new Date(poll.expires_at).toLocaleString()
                      : "No expiration date"}
                  </p>

                  <h3 className="mt-2 font-semibold">Options:</h3>
                  <ul className="list-disc pl-6">
                    {(poll.options || []).map((option) => (
                      <li key={option.id}>{option.text}</li>
                    ))}
                  </ul>

                  {/* Edit & Delete Buttons */}
                  <div className="flex justify-end space-x-2 mt-2">
                    <ConfirmButton
                      text="Edit"
                      onConfirm={() => setEditPoll(poll)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center gap-2"
                    />
                    <ConfirmButton
                      text="Delete"
                      onConfirm={() => dispatch(deletePoll(String(poll.id)))}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManagePolls;
