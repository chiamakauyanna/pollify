import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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

// Define Async Thunks with Explicit Types

export const fetchActivePolls = createAsyncThunk<Poll[], void, { rejectValue: string }>(
  "polls/fetchActivePolls",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchActivePollsService();
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const fetchPolls = createAsyncThunk<Poll[], void, { rejectValue: string }>(
  "polls/fetchPolls",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPollsService();
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const fetchPollById = createAsyncThunk<Poll, number, { rejectValue: string }>(
  "polls/fetchPollById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchPollByIdService(id);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const createPoll = createAsyncThunk<Poll, { pollData: Omit<Poll, "id">; token: string }, { rejectValue: string }>(
  "polls/createPoll",
  async ({ pollData, token }, { rejectWithValue }) => {
    try {
      return await createPollService(pollData, token);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const updatePoll = createAsyncThunk<Poll, { id: number; pollData: Partial<Poll>; token: string }, { rejectValue: string }>(
  "polls/updatePoll",
  async ({ id, pollData, token }, { rejectWithValue }) => {
    try {
      return await updatePollService(id, pollData, token);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const deletePoll = createAsyncThunk<number, { id: number; token: string }, { rejectValue: string }>(
  "polls/deletePoll",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await deletePollService(id, token);
      return id; //  Return deleted poll ID
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const addPollOptions = createAsyncThunk<string[], { id: number; optionsData: string[]; token: string }, { rejectValue: string }>(
  "polls/addPollOptions",
  async ({ id, optionsData, token }, { rejectWithValue }) => {
    try {
      return await addPollOptionsService(id, optionsData, token);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const fetchPollResults = createAsyncThunk<any, number, { rejectValue: string }>(
  "polls/fetchPollResults",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchPollResultsService(id);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const voteInPoll = createAsyncThunk<any, { voteData: any; token: string }, { rejectValue: string }>(
  "polls/voteInPoll",
  async ({ voteData, token }, { rejectWithValue }) => {
    try {
      return await voteInPollService(voteData, token);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

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
        const index = state.polls.findIndex((poll) => poll.id === action.payload.id);
        if (index !== -1) {
          state.polls[index] = action.payload;
        }
      })
      .addCase(deletePoll.fulfilled, (state, action) => {
        state.polls = state.polls.filter((poll) => poll.id !== action.payload);
      });
  },
});

//  Export Actions & Reducer
export const { clearSelectedPoll } = pollSlice.actions;
export default pollSlice.reducer;
