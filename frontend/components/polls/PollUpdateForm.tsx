import { useState } from "react";
import { useDispatch } from "react-redux";
import { updatePoll } from "@/redux/slices/pollSlice";
import { AppDispatch } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon } from "lucide-react";

interface ChoiceEdit {
  id?: string;
  text: string;
  votes_count?: number;
}

interface UpdateFormProps {
  pollId: string;
  currentTitle: string;
  currentDescription?: string;
  currentChoices: ChoiceEdit[];
  onClose: () => void;
  onUpdated: () => void;
}

const UpdatePollForm: React.FC<UpdateFormProps> = ({
  pollId,
  currentTitle,
  currentDescription,
  currentChoices,
  onClose,
  onUpdated,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription || "");
  const [choices, setChoices] = useState<ChoiceEdit[]>([...currentChoices]);

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index].text = value;
    setChoices(newChoices);
  };

  const addChoice = () => setChoices([...choices, { text: "" }]);

  const removeChoice = (index: number) =>
    setChoices(choices.filter((_, i) => i !== index));

  const handleUpdate = async () => {
    if (!title.trim()) return alert("Title is required");
    if (choices.some((c) => !c.text.trim()))
      return alert("All choice fields must be filled");

    try {
      await dispatch(
        updatePoll({
          pollId,
          data: {
            title,
            description,
            choices: choices.map(({ id, text }) => ({ id, text })),
          },
        })
      ).unwrap();
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-50 p-5 rounded-xl shadow-lg space-y-4">
      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Poll Title"
      />

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Poll Description (optional)"
        rows={3}
      />

      {/* Choices */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">Choices</h4>
        <AnimatePresence>
          {choices.map((choice, index) => (
            <motion.div
              key={choice.id || index}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="flex gap-2 items-center"
            >
              <input
                type="text"
                value={choice.text}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder={`Choice ${index + 1}`}
              />
              {choices.length > 1 && (
                <button
                  onClick={() => removeChoice(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  &times;
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={addChoice}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center gap-2"
        >
          <PlusIcon size={20} />
          Add Choice
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleUpdate}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdatePollForm;
