import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import pollService, {
  Poll,
  PollPayload,
  ChoicePayload,
  VotePayload,
  PollStats,
  Choice,
} from "../../services/pollService";
import { extractErrorMessage } from "./authSlice";

// ------ ASYNC THUNKS --------

// POLLS
export const fetchPolls = createAsyncThunk<Poll[]>(
  "polls/fetchPolls",
  async () => {
    return await pollService.getPolls();
  }
);

export const fetchPoll = createAsyncThunk<Poll, string>(
  "polls/fetchPoll",
  async (id: string) => {
    return await pollService.getPoll(id);
  }
);

export const createPoll = createAsyncThunk<Poll, PollPayload>(
  "polls/createPoll",
  async (data: PollPayload) => {
    return await pollService.createPoll(data);
  }
);

export const updatePoll = createAsyncThunk<
  Poll,
  { id: string; data: Partial<PollPayload> }
>("polls/updatePoll", async ({ id, data }) => {
  return await pollService.updatePoll(id, data);
});

export const deletePoll = createAsyncThunk<string, string>(
  "polls/deletePoll",
  async (id: string) => {
    await pollService.deletePoll(id);
    return id;
  }
);

// CHOICES
export const createChoice = createAsyncThunk<Choice, ChoicePayload>(
  "polls/createChoice",
  async (data: ChoicePayload) => {
    return await pollService.createChoice(data);
  }
);

export const deleteChoice = createAsyncThunk<string, string>(
  "polls/deleteChoice",
  async (id: string) => {
    await pollService.deleteChoice(id);
    return id;
  }
);

// VOTING
export const castVote = createAsyncThunk<PollStats, VotePayload>(
  "polls/castVote",
  async (data: VotePayload, { rejectWithValue }) => {
    try {
      // 1. Cast the vote
      await pollService.castVote(data);

      // 2. Fetch updated poll stats
      const updatedStats = await pollService.getPollStats(data.poll);

      // 3. Return updated stats to the reducer
      return updatedStats;
    } catch (err) {
      // Extract error message and return a rejected action
      return rejectWithValue(extractErrorMessage(err, "Voting Failed"));
    }
  }
);

// POLL STATS
export const fetchPollStats = createAsyncThunk<PollStats, string>(
  "polls/fetchPollStats",
  async (pollId: string) => {
    return await pollService.getPollStats(pollId);
  }
);

// -------------------- SLICE --------------------
interface PollState {
  polls: Poll[];
  currentPoll?: Poll;
  pollStats?: PollStats;
  loading: boolean;
  error?: string;
}

const initialState: PollState = {
  polls: [],
  currentPoll: undefined,
  pollStats: undefined,
  loading: false,
  error: undefined,
};

const pollSlice = createSlice({
  name: "polls",
  initialState,
  reducers: {
    clearCurrentPoll(state) {
      state.currentPoll = undefined;
      state.pollStats = undefined;
    },
  },
  extraReducers: (builder) => {
    // -------------------- POLLS --------------------
    builder
      .addCase(fetchPolls.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchPolls.fulfilled, (state, action: PayloadAction<Poll[]>) => {
        state.loading = false;
        state.polls = action.payload;
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPoll.fulfilled, (state, action: PayloadAction<Poll>) => {
        state.currentPoll = action.payload;
      })
      .addCase(createPoll.fulfilled, (state, action: PayloadAction<Poll>) => {
        state.polls.push(action.payload);
      })
      .addCase(updatePoll.fulfilled, (state, action: PayloadAction<Poll>) => {
        const index = state.polls.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.polls[index] = action.payload;
        if (state.currentPoll?.id === action.payload.id)
          state.currentPoll = action.payload;
      })
      .addCase(deletePoll.fulfilled, (state, action: PayloadAction<string>) => {
        state.polls = state.polls.filter((p) => p.id !== action.payload);
        if (state.currentPoll?.id === action.payload)
          state.currentPoll = undefined;
      });

    // -------------------- CHOICES --------------------
    builder
      .addCase(
        createChoice.fulfilled,
        (state, action: PayloadAction<Choice>) => {
          if (state.currentPoll) state.currentPoll.choices.push(action.payload);
        }
      )
      .addCase(
        deleteChoice.fulfilled,
        (state, action: PayloadAction<string>) => {
          if (state.currentPoll)
            state.currentPoll.choices = state.currentPoll.choices.filter(
              (c) => c.id !== action.payload
            );
        }
      );

    // -------------------- POLL STATS --------------------
    builder.addCase(
      fetchPollStats.fulfilled,
      (state, action: PayloadAction<PollStats>) => {
        state.pollStats = action.payload;
      }
    );

    // -------------------- VOTING --------------------
    builder.addCase(castVote.fulfilled, (state, action) => {
      const votePayload = action.meta.arg as VotePayload;
      if (!votePayload) return;

      const votedChoiceId = votePayload.choice;

      // Update pollStats
      if (state.pollStats) {
        const choice = state.pollStats.choices.find(
          (c) => c.id === votedChoiceId
        );
        if (choice) {
          choice.votes_count = (choice.votes_count ?? 0) + 1;
          state.pollStats.total_votes += 1;
        }
      }

      // Update currentPoll.choices using action.payload
      if (state.currentPoll && action.payload) {
        state.currentPoll.choices = state.currentPoll.choices.map((c) => {
          const updatedChoice = action.payload.choices.find(
            (uc) => uc.id === c.id
          );
          return updatedChoice
            ? { ...c, votes_count: updatedChoice.votes_count }
            : c;
        });
      }

      // Optionally, sync pollStats completely with the returned payload
      state.pollStats = action.payload;
    });
  },
});

export const { clearCurrentPoll } = pollSlice.actions;
export default pollSlice.reducer;
