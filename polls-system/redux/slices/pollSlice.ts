import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import {
  fetchActivePolls as fetchActivePollsService,
  fetchPolls as fetchPollsService,
  fetchPollById as fetchPollByIdService,
  createPoll as createPollService,
  updatePoll as updatePollService,
  deletePoll as deletePollService,
  addPollOptions as addPollOptionsService,
  fetchPollResults as fetchPollResultsService,
  voteInPoll as voteInPollService,
} from "@/services/pollService";
import { Poll } from "@/Interfaces/interface";
import { RootState } from "../store";

// Define Async Thunks with Explicit Types

export const fetchActivePolls = createAsyncThunk<
  Poll[],
  void,
  { rejectValue: string }
>("polls/fetchActivePolls", async (_, { rejectWithValue }) => {
  try {
    return await fetchActivePollsService();
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export const fetchPolls = createAsyncThunk<
  Poll[],
  void,
  { rejectValue: string }
>("polls/fetchPolls", async (_, { rejectWithValue }) => {
  try {
    return await fetchPollsService();
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export const fetchPollById = createAsyncThunk<
  Poll,
  number,
  { rejectValue: string }
>("polls/fetchPollById", async (id, { rejectWithValue }) => {
  try {
    return await fetchPollByIdService(id);
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export const createPoll = createAsyncThunk<
  Poll,
  Omit<Poll, "id">,
  { rejectValue: string }
>("polls/createPoll", async (pollData, { rejectWithValue }) => {
  try {
    return await createPollService(pollData);
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export const updatePoll = createAsyncThunk<Poll, { id: number; pollData: Partial<Poll> }, { rejectValue: string }>(
  "polls/updatePoll",
  async ({ id, pollData }, { rejectWithValue }) => {
    try {
      return await updatePollService(id, pollData);
    } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export const deletePoll = createAsyncThunk<number, number, { rejectValue: string }>(
  "polls/deletePoll",
  async (id, { rejectWithValue }) => {
    try {
      await deletePollService(id);
      return id;
    } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export const addPollOptions = createAsyncThunk<string[], { id: number; optionsData: string[] }, { rejectValue: string }>(
  "polls/addPollOptions",
  async ({ id, optionsData }, { rejectWithValue }) => {
    try {
      return await addPollOptionsService(id, optionsData);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const fetchPollResults = createAsyncThunk<
  any,
  number,
  { rejectValue: string }
>("polls/fetchPollResults", async (id, { rejectWithValue }) => {
  try {
    return await fetchPollResultsService(id);
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export const voteInPoll = createAsyncThunk("polls/voteInPoll", async (optionId , { rejectWithValue }) => {
  try {
    return await voteInPollService( { option: optionId });
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Vote failed"
    );
  }
});

//  Poll Slice with Explicit Types
const pollSlice = createSlice({
  name: "polls",
  initialState: {
    polls: [] as Poll[],
    activePolls: [] as Poll[],
    selectedPoll: null as Poll | null,
    pollResults: null as any,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    clearSelectedPoll: (state) => {
      state.selectedPoll = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivePolls.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivePolls.fulfilled, (state, action) => {
        state.loading = false;
        state.activePolls = action.payload;
      })
      .addCase(fetchActivePolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch active polls";
      })
      .addCase(fetchPolls.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.polls = action.payload;
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch polls";
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.polls.push(action.payload);
      })
      .addCase(updatePoll.fulfilled, (state, action) => {
        const index = state.polls.findIndex(
          (poll) => poll.id === action.payload.id
        );
        if (index !== -1) {
          state.polls[index] = action.payload;
        }
      })
      .addCase(deletePoll.fulfilled, (state, action) => {
        state.polls = state.polls.filter((poll) => poll.id !== action.payload);
      })

      .addCase(voteInPoll.fulfilled, (state, action) => {
        const pollIndex = state.polls.findIndex((poll) =>
          poll.options.some((opt) => opt.id === action.payload.option)
        );

        if (pollIndex !== -1) {
          state.polls[pollIndex].options = state.polls[pollIndex].options.map((opt) =>
            opt.id === action.payload.option
              ? { ...opt, voteCount: (opt.voteCount || 0) + 1 }
              : opt
          );
        }
      })
      .addCase(fetchPollResults.fulfilled, (state, action) => {
        const pollId = action.meta.arg;
        state.pollResults[pollId] = action.payload;

        // Sync vote counts from API
        const pollIndex = state.polls.findIndex((poll) => poll.id === pollId);
        if (pollIndex !== -1) {
          state.polls[pollIndex].options = state.polls[pollIndex].options.map((opt) => ({
            ...opt,
            voteCount: action.payload.votes?.filter((v) => v.option === opt.id).length || 0,
          }));
        }
      })
      .addCase(voteInPoll.rejected, (state, action) => {
        state.error = action.payload || "Voting failed";
      });
  },
});

// Selectors
export const selectPolls = (state: RootState) => state.polls.polls;
export const selectActivePolls = (state: RootState) => state.polls.activePolls;
export const selectSelectedPoll = (state: RootState) =>
  state.polls.selectedPoll;
export const selectPollResults = (state: RootState) => state.polls.pollResults;
export const selectPollLoading = (state: RootState) => state.polls.loading;
export const selectPollError = (state: RootState) => state.polls.error;

// Memoized Selectors (for better performance)
export const selectPollById = (pollId: number) =>
  createSelector(
    selectPolls,
    (polls) => polls?.find((poll) => poll.id === pollId) || null
  );

export const selectActivePollById = (pollId: number) =>
  createSelector(selectActivePolls, (activePolls) =>
    activePolls.find((poll) => poll.id === pollId)
  );

//  Export Actions & Reducer
export const { clearSelectedPoll } = pollSlice.actions;
export default pollSlice.reducer;
