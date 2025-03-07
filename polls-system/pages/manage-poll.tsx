import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchPolls,
  updatePoll,
  deletePoll,
  selectPolls,
} from "@/redux/slices/pollSlice";

const ManagePolls = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pollData = useSelector(selectPolls);
  const polls = pollData?.results || [];

  const [editPoll, setEditPoll] = useState<{
    id: number;
    title: string;
    description: string;
    expires_at: string; // Added expires_at field
    options: { id: number; text: string }[];
  } | null>(null);

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Removes seconds & timezone
  };
  

  const handleUpdate = () => {
    if (editPoll) {
      dispatch(
        updatePoll({
          id: editPoll.id,
          pollData: {
            title: editPoll.title,
            description: editPoll.description,
            expires_at: editPoll.expires_at, // Include expires_at
            options: editPoll.options,
          },
        })
      );
      setEditPoll(null);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    if (editPoll) {
      const updatedOptions = [...editPoll.options];
      updatedOptions[index] = { ...updatedOptions[index], text: value };
      setEditPoll({ ...editPoll, options: updatedOptions });
    }
  };

  const handleAddOption = () => {
    if (editPoll) {
      const newOption = { id: Date.now(), text: "" }; // Unique ID for new options
      setEditPoll({ ...editPoll, options: [...editPoll.options, newOption] });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Manage Polls</h1>

      {polls.length > 0 ? (
        <ul className="space-y-4">
          {polls.map((poll) => (
            <li key={poll.id} className="p-4 rounded-lg shadow-md">
              {editPoll?.id === poll.id ? (
                <div>
                  {/* Editable Title & Description */}
                  <input
                    type="text"
                    value={editPoll.title}
                    onChange={(e) =>
                      setEditPoll({ ...editPoll, title: e.target.value })
                    }
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <textarea
                    value={editPoll.description}
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
                    value={formatDateForInput(editPoll.expires_at)}
                    onChange={(e) =>
                      setEditPoll({ ...editPoll, expires_at: e.target.value })
                    }
                    className="w-full p-2 mb-2 border rounded"
                  />

                  {/* Editable Options */}
                  <h3 className="mt-3 font-semibold">Options:</h3>
                  {editPoll.options.map((option, index) => (
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
                        onClick={() => {
                          setEditPoll({
                            ...editPoll,
                            options: editPoll.options.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Add Option Button */}
                  <button
                    onClick={handleAddOption}
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    + Add Option
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
                  <p className="text-gray-700">{poll.description}</p>

                  <p className="text-gray-700 mt-1">
                    <strong>Expires at:</strong>{" "}
                    {poll.expires_at
                      ? new Date(poll.expires_at).toLocaleString()
                      : "No expiration date"}
                  </p>

                  <h3 className="mt-2 font-semibold">Options:</h3>
                  <ul className="list-disc pl-6">
                    {poll.options.map((option) => (
                      <li key={option.id} className="text-gray-600">
                        {option.text}
                      </li>
                    ))}
                  </ul>

                  {/* Edit & Delete Buttons */}
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => setEditPoll(poll)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(deletePoll(poll.id))}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
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
