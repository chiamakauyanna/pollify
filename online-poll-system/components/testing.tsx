import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchActivePolls,
  fetchPollById,
  updatePoll,
  addPollOptions,
} from "@/redux/slices/pollSlice";
import { Poll } from "@/Interfaces/interface";
import Button from "./common/Button";

const ManagePoll: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Get poll ID from URL query

  const dispatch = useDispatch<AppDispatch>();

  const activePolls = useSelector((state: RootState) => state.polls.activePolls);
  const poll = useSelector((state: RootState) => state.polls.polls.find((p) => p.id === id));

  const [formData, setFormData] = useState<Partial<Poll>>({
    title: "",
    description: "",
    expires_at: "",
  });

  const [newOptions, setNewOptions] = useState<string[]>([]);
  const [optionText, setOptionText] = useState("");

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
        expires_at: poll.expires_at || "",
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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Manage Polls</h2>

      {/* Active Polls List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Active Polls</h3>
        {activePolls.length > 0 ? (
          <ul className="space-y-2">
            {activePolls.map((poll) => (
              <li key={poll.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                <span>{poll.title}</span>
                <Button onClick={() => router.push(`/manage-poll?id=${poll.id}`)}>Edit</Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No active polls available.</p>
        )}
      </div>

      {/* Manage Selected Poll */}
      {id && poll && (
        <>
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Edit Poll</h3>

            <div className="mb-4">
              <label  htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter poll title"
              />
            </div>

            <div className="mb-4">
              <label  htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter poll description"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="expires_at">Expires At</label>
              <input
                id="expires_at"
                type="datetime-local"
                name="expires_at"
                value={formData.expires_at}
                onChange={handleChange}
              />
            </div>

            <Button onClick={handleUpdatePoll} className="w-full mb-4">
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
                />
                <Button onClick={handleAddOption}>Add</Button>
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

              <Button onClick={handleSubmitOptions} disabled={newOptions.length === 0}>
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
