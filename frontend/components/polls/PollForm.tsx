import { useState } from "react";
import { useDispatch } from "react-redux";
import { createPoll } from "@/redux/slices/pollSlice";
import { AppDispatch } from "@/redux/store";

interface PollFormProps {
  onPollCreated?: () => void;
}

const PollForm: React.FC<PollFormProps> = ({ onPollCreated }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [choices, setChoices] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const addChoiceField = () => setChoices([...choices, ""]);
  const removeChoiceField = (index: number) =>
    setChoices(choices.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return alert("Title is required");
    if (choices.some((c) => !c.trim()))
      return alert("All choices must be filled");

    try {
      setLoading(true);

      const result = await dispatch(
        createPoll({
          title,
          description,
          start_at: startAt || undefined,
          end_at: endAt || undefined,
          choices: choices.map((text) => ({ text })),
        })
      ).unwrap(); // throws if error

      // Notify parent to refresh poll list
      if (onPollCreated) onPollCreated();

      // Reset form
      setTitle("");
      setDescription("");
      setStartAt("");
      setEndAt("");
      setChoices([""]);

      alert("Poll created successfully!");
    } catch (err) {
      console.error("Failed to create poll:", err);
      alert("Failed to create poll. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg space-y-6 max-w-full"
    >
      {/* Title */}
      <div>
        <label className="block font-semibold mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter poll title"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-semibold mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
          rows={3}
        />
      </div>

      {/* Start & End */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">Start At</label>
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">End At</label>
          <input
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
          />
        </div>
      </div>

      {/* Choices */}
      <div>
        <label className="block font-semibold mb-2">Choices</label>
        {choices.map((choice, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={choice}
              onChange={(e) => handleChoiceChange(index, e.target.value)}
              placeholder={`Choice ${index + 1}`}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
              required
            />
            {choices.length > 1 && (
              <button
                type="button"
                onClick={() => removeChoiceField(index)}
                className="bg-red-500 text-white px-3 py-2 rounded-xl hover:bg-red-600 transition"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addChoiceField}
          className="mt-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-secondary transition"
        >
          + Add Choice
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`mt-4 w-full py-3 text-lg rounded-xl text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-primary hover:bg-secondary"
        } transition`}
      >
        {loading ? "Creating..." : "Create Poll"}
      </button>
    </form>
  );
};

export default PollForm;
