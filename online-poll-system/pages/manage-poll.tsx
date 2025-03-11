import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router"; 
import { AppDispatch, RootState } from "@/redux/store";
import {
  deletePoll,
  fetchActivePolls,
  fetchPollById,
  updatePoll,
  addPollOptions,
} from "@/redux/slices/pollSlice";
import { Poll } from "@/Interfaces/interface";
import Button from "@/components/common/Button";
import ConfirmButton from "@/components/common/ConfirmButton";

const ManagePoll: React.FC = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const dispatch = useDispatch<AppDispatch>();

  const [deletingPollId, setDeletingPollId] = useState<string | null>(null);
  const [optionText, setOptionText] = useState("");
  const [newOptions, setNewOptions] = useState<string[]>([]);

  const activePolls = useSelector((state: RootState) => state.polls.activePolls);
  const poll = useSelector((state: RootState) => state.polls.polls.find((p) => p.id === id));

  const [formData, setFormData] = useState<Partial<Poll>>({
    title: "",
    description: "",
    expires_at: "",
  });

  useEffect(() => {
    dispatch(fetchActivePolls());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchPollById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (poll) {
      setFormData({
        title: poll.title,
        description: poll.description,
        expires_at: formatDateForInput(poll.expires_at || ''),
      });
    }
  }, [poll]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdatePoll = () => {
    if (id) {
      dispatch(updatePoll({ id, pollData: formData }));
    }
  };

  const handleDelete = async (pollId: string) => {
    setDeletingPollId(pollId);
    try {
      await dispatch(deletePoll(pollId)).unwrap();
    } catch (error) {
      console.error("Failed to delete poll:", error);
    } finally {
      setDeletingPollId(null);
    }
  };

  const formatDateForInput = (isoString: string | undefined) => {
    if (!isoString) return ""; 
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };

  const handleAddOption = () => {
    if (optionText.trim()) {
      setNewOptions([...newOptions, optionText.trim()]);
      setOptionText("");
    }
  };

  const handleSubmitOptions = () => {
    if (id && newOptions.length > 0) {
      dispatch(addPollOptions({ id, optionsData: newOptions }));
      setNewOptions([]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Polls</h2>

      {/* Active Polls List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Active Polls</h3>
        {activePolls.length > 0 ? (
          <ul className="space-y-2">
            {activePolls.map((poll) => (
              <li key={poll.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                <span className="text-gray-800">{poll.title}</span>
                <div className="flex gap-3">
                   <Button
                  onClick={() => router.replace(`/manage-poll?id=${poll.id}`)}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white text-sm"
                >
                  Edit
                </Button>

                <ConfirmButton
                  text={deletingPollId === poll.id ? "Deleting..." : "Delete"}
                  onConfirm={() => handleDelete(String(poll.id))}
                  className={`bg-red-500 text-white px-4 py-1.5 rounded ${
                    deletingPollId === poll.id ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
                  }`}
                  disabled={deletingPollId === poll.id}
                />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No active polls available.</p>
        )}
      </div>

      {/* Manage Selected Poll */}
      {id && poll && (
        <>
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Edit Poll</h3>

            <div className="mb-4">
              <label htmlFor="title" className="block font-medium text-gray-700">
                Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter poll title"
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter poll description"
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="expires_at" className="block font-medium text-gray-700">
                Expires At
              </label>
              <input
                id="expires_at"
                type="datetime-local"
                name="expires_at"
                value={formData.expires_at || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <Button onClick={handleUpdatePoll} className="w-full bg-green-500 hover:bg-green-600 mb-4">
              Update Poll
            </Button>

            {/* Add Options Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Add Options</h3>

              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={optionText}
                  onChange={(e) => setOptionText(e.target.value)}
                  placeholder="Enter option text"
                  className="w-full p-2 border rounded-lg"
                />
                <Button onClick={handleAddOption} className="bg-blue-500 hover:bg-blue-600">
                  Add
                </Button>
              </div>

              {newOptions.length > 0 && (
                <ul className="mb-4">
                  {newOptions.map((opt, index) => (
                    <li key={index} className="text-gray-700">
                      - {opt}
                    </li>
                  ))}
                </ul>
              )}

              <Button onClick={handleSubmitOptions} disabled={newOptions.length === 0} className="bg-purple-500 hover:bg-purple-600">
                Submit Options
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagePoll;
