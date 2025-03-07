import Layout from "@/components/layout/MainLayout";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectPolls, addPoll, addCandidate, updatePollStatus } from "@/redux/slices/pollSlice";
import Button from "@/components/common/Button";
import { Poll } from "@/Interfaces/interface";

const AdminPolls = () => {
  const dispatch = useDispatch();
  const polls = useSelector(selectPolls); // Get polls from Redux state

  const [newPoll, setNewPoll] = useState({
    title: "",
    startTime: "",
    endTime: "",
  });

  // Dispatch updatePollStatus every minute to update poll statuses
  useEffect(() => {
    dispatch(updatePollStatus());
    const interval = setInterval(() => dispatch(updatePollStatus()), 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Create a new poll
  const handleCreatePoll = () => {
    if (!newPoll.title || !newPoll.startTime || !newPoll.endTime) return;
    
    const newPollEntry: Poll = {
      id: Date.now(),
      title: newPoll.title,
      status: "Upcoming",
      startTime: newPoll.startTime,
      endTime: newPoll.endTime,
      candidates: [],
    };

    dispatch(addPoll(newPollEntry)); // Add poll to Redux state
    setNewPoll({ title: "", startTime: "", endTime: "" });
  };

  // Add a new candidate
  const handleAddCandidate = (pollId: number, name: string) => {
    if (name.trim() !== "") {
      dispatch(addCandidate({ pollId, name }));
    }
  };

  return (
    <Layout userName="Admin Name" userImage="/admin-avatar.png">
      <div className="bg-white p-6 rounded-lg">
        {/* Poll List */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Existing Polls</h2>
          <ul className="mt-2 space-y-4">
            {polls.map((poll) => (
              <li key={poll.id} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-6">
                      <p className="font-bold">{poll.title}</p>
                      <p
                        className={`text-sm font-semibold border p-4 rounded-lg uppercase ${
                          poll.status === "Ongoing"
                            ? "text-green-600"
                            : poll.status === "Completed"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {poll.status}
                      </p>
                    </div>
                    <div className="border-2 mt-3 p-2 rounded-lg">
                      <p className="mb-2">
                        Start:{" "}
                        <span className="text-gray-500 text-sm">
                          {new Date(poll.startTime).toLocaleString()}
                        </span>{" "}
                      </p>
                      <p className="">
                        End:{" "}
                        <span className="text-gray-500 text-sm">
                          {new Date(poll.endTime).toLocaleString()}
                        </span>{" "}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Candidate Management */}
                <div className="mt-4">
                  <h3 className="text-md font-semibold">Candidates & Votes</h3>
                  <ul className="mt-2 space-y-2">
                    {poll.candidates.map((candidate, index) => (
                      <li
                        key={index}
                        className="bg-white p-2 border border-primary focus:ring-2 focus:ring-primary focus:outline-0 rounded flex justify-between"
                      >
                        <span>{candidate.name}</span>
                        <span className="font-bold">
                          {candidate.votes} votes
                        </span>
                      </li>
                    ))}
                  </ul>

                  {poll.status === "Ongoing" && (
                    <div className="flex gap-4 mt-2">
                      <input
                        type="text"
                        placeholder="Add candidate"
                        className="p-2 border border-primary focus:ring-2 focus:ring-primary focus:outline-0 rounded"
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleAddCandidate(poll.id, e.currentTarget.value);
                        }}
                      />

                      <Button
                        text="Add"
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-hover"
                        onClick={() => handleAddCandidate(poll.id, "")}
                      />
                    </div>
                  )}
                </div>

                {/* Live Results */}
                {poll.status === "Completed" && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold text-red-600">
                      Final Results
                    </h3>
                    <ul className="mt-2">
                      {poll.candidates
                        .sort((a, b) => b.votes - a.votes)
                        .map((candidate, index) => (
                          <li
                            key={index}
                            className="bg-white p-2 border border-primary focus:ring-2 focus:ring-primary focus:outline-0 rounded"
                          >
                            {index + 1}. {candidate.name} -{" "}
                            <span className="font-bold">
                              {candidate.votes} votes
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

AdminPolls.noLayout = true;

export default AdminPolls;
