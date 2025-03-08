import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchActivePolls,
  selectActivePolls,
  updatePoll,
  deletePoll,
} from "@/redux/slices/pollSlice";
import { Poll, PollOption } from "@/Interfaces/interface";
import { Edit, Plus, Trash2, X } from "lucide-react";

const ManagePolls = () => {
  const dispatch = useDispatch<AppDispatch>();
  const activePollsData = useSelector((state: RootState) =>
    selectActivePolls(state)
  );
  const activePolls = activePollsData || [];
  const [editPoll, setEditPoll] = useState<Poll | null>(null);

  useEffect(() => {
    dispatch(fetchActivePolls());
  }, [dispatch]);

  const handleUpdate = () => {
    if (editPoll) {
      dispatch(
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
      );
      setEditPoll(null);
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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Manage Polls</h1>

      {activePolls.length > 0 ? (
        <ul className="space-y-4">
          {activePolls.map((poll) => (
            <li key={poll.id} className="p-4 rounded-lg shadow-md">
              {editPoll?.id === poll.id ? (
                <div>
                  {/* Editable Title & Description */}
                  <input
                    type="text"
                    value={editPoll?.title}
                    onChange={(e) =>
                      setEditPoll({ ...editPoll, title: e.target.value })
                    }
                    className="w-full p-2 mb-2 border rounded"
                  />
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
                    value={editPoll?.expires_at || ""}
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
                    <button
                      onClick={handleUpdate}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
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
                  {/* Display Title, Description, Expiration Date, and Options */}
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
                    <button
                      onClick={() => setEditPoll(poll)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => poll.id && dispatch(deletePoll(poll.id))}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No polls available.</p>
      )}
    </div>
  );
};

export default ManagePolls;
