import { useState } from "react";
import { usePolls } from "@/hooks/usePolls";

const PollForm = () => {
  const { create, addChoice, loadPolls } = usePolls();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [choices, setChoices] = useState<string[]>([""]);

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const addChoiceField = () => setChoices([...choices, ""]);
  const removeChoiceField = (index: number) => setChoices(choices.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");
    if (choices.some((c) => !c.trim())) return alert("All choices must be filled");

    try {
      const newPoll = await create({
        title,
        description,
        start_at: startAt || undefined,
        end_at: endAt || undefined,
      });

      for (const choiceText of choices) {
        await addChoice({ poll: newPoll.id, text: choiceText });
      }

      loadPolls();
      setTitle("");
      setDescription("");
      setStartAt("");
      setEndAt("");
      setChoices([""]);
    } catch (err) {
      console.error("Failed to create poll:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
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

      <div>
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
          rows={3}
        />
      </div>

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

      <button
        type="submit"
        className="button-primary mt-4 w-full py-2 text-lg hover:bg-secondary transition"
      >
        Create Poll
      </button>
    </form>
  );
};

export default PollForm;
