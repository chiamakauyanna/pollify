import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { Poll, PollState } from "@/Interfaces/interface";

// Initial state
const initialState: PollState = {
  polls: [],
};

// Poll Slice
const pollSlice = createSlice({
  name: "polls",
  initialState,
  reducers: {
    setPolls: (state, action: PayloadAction<Poll[]>) => {
      state.polls = action.payload;
    },
    addPoll: (state, action: PayloadAction<Poll>) => {
      state.polls.push(action.payload);
    },
    updatePollStatus: (state) => {
      const now = new Date();
      state.polls.forEach((poll) => {
        const start = new Date(poll.startTime);
        const end = new Date(poll.endTime);
        if (now >= start && now <= end) {
          poll.status = "Ongoing";
        } else if (now > end) {
          poll.status = "Completed";
        } else {
          poll.status = "Upcoming";
        }
      });
    },
    addCandidate: (state, action: PayloadAction<{ pollId: number; name: string }>) => {
      const poll = state.polls.find((p) => p.id === action.payload.pollId);
      if (poll) {
        const existingCandidate = poll.candidates.find(c => c.name === action.payload.name);
        if (!existingCandidate) {
          poll.candidates.push({ name: action.payload.name, votes: 0 });
        }
      }
    },
    voteCandidate: (state, action: PayloadAction<{ pollId: number; candidateName: string }>) => {
      const poll = state.polls.find((p) => p.id === action.payload.pollId);
      if (poll) {
        const candidate = poll.candidates.find((c) => c.name === action.payload.candidateName);
        if (candidate) {
          candidate.votes += 1;
        }
      }
    },
  },
});

export const { setPolls, addPoll, updatePollStatus, addCandidate, voteCandidate } = pollSlice.actions;
export const selectPolls = (state: RootState) => state.polls.polls;
export default pollSlice.reducer;
