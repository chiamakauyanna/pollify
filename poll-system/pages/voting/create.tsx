import { useState } from "react";
import { useDispatch } from "react-redux";
import { addPoll } from "@/redux/slices/pollSlice";
import Layout from "@/components/layout/MainLayout";
import Button from "@/components/common/Button";

const CreatePoll = () => {
  const dispatch = useDispatch();
  const [pollData, setPollData] = useState({
    title: "",
    startTime: "2025-03-01T08:00",
    endTime: "2025-03-02T20:00",
    options: [""],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPollData({ ...pollData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...pollData.options];
    newOptions[index] = value;
    setPollData({ ...pollData, options: newOptions });
  };

  const addOption = () => {
    setPollData({ ...pollData, options: [...pollData.options, ""] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addPoll(pollData));
    setPollData({
      title: "",
      startTime: "2025-03-01T08:00",
      endTime: "2025-03-02T20:00",
      options: [""],
    });
  };

  return (
    <Layout userName="Admin Name" userImage="/admin-avatar.png" isAdmin={true}>
      <div className="flex justify-center items-center p-6 flex-col">
        <h1 className="text-2xl font-bold text-primary">Create a New Poll</h1>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Poll Title"
            value={pollData.title}
            onChange={handleChange}
            className="w-full p-2 border border-primary rounded text-sm focus:ring-2 focus:ring-primary focus:border-0 outline-none"
            required
          />
          <input
            type="datetime-local"
            name="startTime"
            value={pollData.startTime}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="datetime-local"
            name="endTime"
            value={pollData.endTime}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <div className="space-y-2">
            {pollData.options.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full p-2 border border-primary rounded text-sm focus:ring-2 focus:ring-primary focus:border-0 outline-none"
                required
              />
            ))}
          </div>

          <Button
            text="Add Option"
            onClick={addOption}
            className="w-full bg-secondary text-white py-2 px-4 rounded-lg hover:bg-primary"
          />

          <Button
            text="Create Poll"
            className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-lg hover:bg-hover"
          />
        </form>
      </div>
    </Layout>
  );
};

CreatePoll.noLayout = true;

export default CreatePoll;
