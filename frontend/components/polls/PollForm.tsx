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
    if (choices.some((c) => !c.trim())) return alert("All choices must be filled");

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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
      {/* Title */}
      <div>
        <label className="block font-semibold mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
          rows={3}
        />
      </div>

      {/* Start & End */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Start At</label>
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">End At</label>
          <input
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Choices */}
      <div>
        <label className="block font-semibold mb-1">Choices</label>
        {choices.map((choice, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={choice}
              onChange={(e) => handleChoiceChange(index, e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
            {choices.length > 1 && (
              <button
                type="button"
                onClick={() => removeChoiceField(index)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addChoiceField}
          className="mt-2 bg-primary text-white px-3 py-1 rounded hover:bg-secondary transition"
        >
          + Add Choice
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`mt-4 w-full py-2 text-lg rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-secondary"
        } transition`}
      >
        {loading ? "Creating..." : "Create Poll"}
      </button>
    </form>
  );
};

export default PollForm;
