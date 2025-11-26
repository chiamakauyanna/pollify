import { useState } from "react";
import { useDispatch } from "react-redux";
import { updatePoll } from "@/redux/slices/pollSlice";
import { AppDispatch } from "@/redux/store";

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
    <div className="bg-gray-100 p-4 rounded shadow space-y-2 mt-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1"
        placeholder="Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1"
        placeholder="Description"
        rows={2}
      />

      <div className="space-y-2 mt-2">
        <h4 className="font-semibold">Choices</h4>
        {choices.map((choice, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={choice.text}
              onChange={(e) => handleChoiceChange(index, e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1"
              placeholder="Choice text"
            />
            {choices.length > 1 && (
              <button
                onClick={() => removeChoice(index)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addChoice}
          className="mt-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Choice
        </button>
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleUpdate}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdatePollForm;
