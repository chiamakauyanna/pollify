import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { deletePoll } from "@/redux/slices/pollSlice";

const DeleteButton = ({ pollId }: { pollId: string }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this poll?")) {
      dispatch(deletePoll(pollId));
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
    >
      Delete Poll
    </button>
  );
};


export default DeleteButton