import { useSelector, useDispatch } from "react-redux";
import { selectPolls, updatePollStatus, deletePoll } from "@/redux/slices/pollSlice";
import Button from "@/components/common/Button";

const ManagePolls = () => {
  const polls = useSelector(selectPolls);
  const dispatch = useDispatch();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Polls</h1>
      {polls.length === 0 ? (
        <p>No polls available.</p>
      ) : (
        polls.map((poll) => (
          <div key={poll.id} className="border p-4 rounded mb-2">
            <h2 className="font-semibold">{poll.title}</h2>
            <div className="flex gap-2 mt-2">
              <Button text="Start Poll" onClick={() => dispatch(updatePollStatus({ id: poll.id, status: "Ongoing" }))} />
              <Button text="End Poll" onClick={() => dispatch(updatePollStatus({ id: poll.id, status: "Completed" }))} />
              <Button text="Delete Poll" className="bg-red-500" onClick={() => dispatch(deletePoll({ id: poll.id, token: "YOUR_TOKEN_HERE" }))} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManagePolls;
