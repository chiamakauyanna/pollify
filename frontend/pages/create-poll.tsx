import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createPoll } from "@/redux/slices/pollSlice";
import Button from "@/components/common/Button";
import { Poll } from "@/Interfaces/interface";
import { ArrowLeft } from "lucide-react";
import router from "next/router";

const CreatePoll: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle Poll Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || options.some((opt) => !opt.trim())) {
      setError("Poll title and all options are required!");
      return;
    }

    const formattedPollData: Poll = {
      id: "",
      title,
      description: description.trim() || undefined,
      expires_at: expiresAt.trim() || null,
      options: options.map((opt) => ({
        id: "",
        text: opt.trim(),
      })),
    };

    setLoading(true);
    try {
      await dispatch(createPoll(formattedPollData)).unwrap();
      setSuccess("Poll created successfully!");
      setTimeout(() => setSuccess(null), 3000);
      setTitle("");
      setDescription("");
      setExpiresAt("");
      setOptions(["", ""]);
    } catch (error: unknown) {
      console.error("Error creating poll:", error);
      setError("Failed to create poll. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center gap-12 mb-4">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold">Create a New Poll</h2>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{error}</div>
      )}

      {success && (
        <div className="bg-green-100 text-green-800 p-2 rounded mb-4 transition-opacity duration-500">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Poll Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Expiration Date</label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {options.map((option, index) => (
          <div key={index}>
            <label className="block font-medium">{`Option ${index + 1}`}</label>
            <input
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        ))}

        <Button
          onClick={() => setOptions([...options, ""])}
          className="bg-gray-200 text-black py-2"
          disabled={loading}
        >
          Add Option
        </Button>

        <Button
          type="submit"
          className="bg-primary py-3 text-white w-full"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Poll"}
        </Button>
      </form>
    </div>
  );
};

export default CreatePoll;
