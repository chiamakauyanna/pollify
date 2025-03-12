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
  selectActivePolls,
} from "@/redux/slices/pollSlice";
import { Poll } from "@/Interfaces/interface";
import Button from "@/components/common/Button";
import ConfirmButton from "@/components/common/ConfirmButton";
import Loader from "@/components/common/Loader";
import { ArrowLeft } from "lucide-react";

const ManagePoll: React.FC = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const dispatch = useDispatch<AppDispatch>();

  const [deletingPollId, setDeletingPollId] = useState<string | null>(null);
  const [optionText, setOptionText] = useState("");
  const [newOptions, setNewOptions] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmittingOptions, setIsSubmittingOptions] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { activePolls, loading } = useSelector((state: RootState) => ({
    activePolls: selectActivePolls(state) || [],
    loading: state.polls.loading,
  }));

  const poll = useSelector((state: RootState) =>
    state.polls.polls.find((p) => p.id === id)
  );

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
        expires_at: formatDateForInput(poll.expires_at || ""),
      });
    }
  }, [poll]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdatePoll = async () => {
    if (!id) return;
    setIsUpdating(true);
    setMessage(null);

    try {
      await dispatch(updatePoll({ id, pollData: formData })).unwrap();
      dispatch(fetchActivePolls());
      setMessage({ type: "success", text: "Poll updated successfully!" });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update poll. Please try again.",
      });
    } finally {
      setIsUpdating(false);
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

  const handleSubmitOptions = async () => {
    if (id && newOptions.length > 0) return;
    setIsSubmittingOptions(true);
    setMessage(null);

    try {
      await dispatch(addPollOptions({ id, optionsData: newOptions })).unwrap();
      setNewOptions([]);
      setMessage({ type: "success", text: "Options added successfully!" });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to add options. Please try again.",
      });
    } finally {
      setIsSubmittingOptions(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center gap-12 mb-4">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold">Manage Polls</h2>
      </div>

      {message && (
        <p
          className={`mb-4 text-center font-semibold ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Active Polls List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : activePolls.length === 0 ? (
        <p className="text-gray-500 text-center">No active polls available.</p>
      ) : (
        <ul className="space-y-2">
          {activePolls.map((poll) => (
            <li
              key={poll.id}
              className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
            >
              <span className="text-gray-800">{poll.title}</span>
              <p className="text-gray-600 text-sm">{poll.description}</p>
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
                    deletingPollId === poll.id
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-red-600"
                  }`}
                  disabled={deletingPollId === poll.id}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Manage Selected Poll */}
      {id && poll && (
        <>
          <div className="border-t pt-4">
            <div className="flex items-center gap-12 mb-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h3 className="text-lg font-semibold mb-2">Edit Poll</h3>
            </div>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block font-medium text-gray-700"
              >
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
              <label
                htmlFor="description"
                className="block font-medium text-gray-700"
              >
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
              <label
                htmlFor="expires_at"
                className="block font-medium text-gray-700"
              >
                Expires At
              </label>
              <input
                id="expires_at"
                type="datetime-local"
                name="expires_at"
                value={formData.expires_at || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <Button
              onClick={handleUpdatePoll}
              className="text-white bg-green-500 hover:bg-green-600 mb-4 px-4 py-2"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Poll"}
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
                <Button
                  onClick={handleAddOption}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white"
                >
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

              <Button
                onClick={handleSubmitOptions}
                disabled={isSubmittingOptions || newOptions.length === 0}
                className="bg-purple-500 hover:bg-purple-600 px-4 py-2 text-white"
              >
                {isSubmittingOptions ? "Submitting..." : "Submit Options"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagePoll;
