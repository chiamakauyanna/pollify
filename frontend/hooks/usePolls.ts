import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  PollPayload,
  ChoicePayload,
  VotePayload,
} from "@/services/pollService";
import {
  fetchPolls,
  fetchPoll,
  createPoll,
  updatePoll,
  deletePoll,
  createChoice,
  deleteChoice,
  castVote,
  fetchPollStats,
} from "@/redux/slices/pollSlice";
import {
  selectPolls,
  selectCurrentPoll,
  selectPollStats,
  selectCurrentPollWithStats,
  selectCurrentPollWithStatsSorted,
  selectPollsLoading,
  selectPollsError,
} from "@/redux/selectors";

export const usePolls = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const polls = useSelector(selectPolls);
  const currentPoll = useSelector(selectCurrentPoll);
  const pollStats = useSelector(selectPollStats);
  const pollWithStats = useSelector(selectCurrentPollWithStats);
  const pollWithStatsSorted = useSelector(selectCurrentPollWithStatsSorted);
  const loading = useSelector(selectPollsLoading);
  const error = useSelector(selectPollsError);

  // Poll actions
  const loadPolls = () => dispatch(fetchPolls());
  const loadPoll = (id: string) => dispatch(fetchPoll(id));
  const create = (data: PollPayload) => dispatch(createPoll(data));
  const update = (id: string, data: Partial<PollPayload>) =>
    dispatch(updatePoll({ id, data }));
  const remove = (id: string) => dispatch(deletePoll(id));

  // Choice actions
  const addChoice = (data: ChoicePayload) => dispatch(createChoice(data));
  const removeChoice = (id: string) => dispatch(deleteChoice(id));

  // Vote actions
  const vote = (data: VotePayload) => dispatch(castVote(data));
  const loadStats = (pollId: string) => dispatch(fetchPollStats(pollId));

  return {
    polls,
    currentPoll,
    pollStats,
    pollWithStats,
    pollWithStatsSorted,
    loading,
    error,
    loadPolls,
    loadPoll,
    create,
    update,
    remove,
    addChoice,
    removeChoice,
    vote,
    loadStats,
  };
};
