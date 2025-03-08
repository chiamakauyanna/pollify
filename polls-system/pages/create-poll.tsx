import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createPoll } from "@/redux/slices/pollSlice";
import Button from "@/components/common/Button";
import { Poll } from "@/Interfaces/interface";

const CreatePoll: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Poll Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || options.some((opt) => !opt.trim())) {
      alert("Poll title and all options are required!");
      return;
    }

    const formattedPollData: Poll = {
      id: '', 
      title,
      description: description.trim() || undefined,
      expires_at: expiresAt.trim() || null,
      options: options.map((opt) => ({
        id: '', 
        text: opt.trim(),
      })),
    };

    try {
      const response = await dispatch(createPoll(formattedPollData)).unwrap();
      console.log("Poll created successfully:", response);

      // Show success message
      setSuccessMessage("Poll created successfully!");

      // Reset Form
      setTitle("");
      setDescription("");
      setExpiresAt("");
      setOptions(["", ""]);

      // Hide message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Poll</h1>

      {successMessage && (
        <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Poll Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            className="w-full p-2 border border-gray-300 rounded"
          />
        ))}

        <Button
          text="Add Option"
          onClick={() => setOptions([...options, ""])}
          className="bg-gray-200 text-black py-2"
        />

        <Button
          text="Create Poll"
          type="submit"
          className="bg-primary py-3 text-white"
        />
      </form>
    </div>
  );
};

export default CreatePoll;
