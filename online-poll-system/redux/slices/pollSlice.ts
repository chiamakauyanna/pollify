import {
  createSlice,
  createAsyncThunk,
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
import { Poll, PollResults, VoteResponse } from "@/Interfaces/interface";
import { RootState } from "../store";

// **Fetch Active Polls**
export const fetchActivePolls = createAsyncThunk<
  Poll[],
  void,
  { rejectValue: string }
>("polls/fetchActivePolls", async (_, { rejectWithValue }) => {
  try {
    return await fetchActivePollsService();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Error fetching active polls"
    );
  }
});

// **Fetch All Polls**
export const fetchPolls = createAsyncThunk<
  Poll[],
  void,
  { rejectValue: string }
>("polls/fetchPolls", async (_, { rejectWithValue }) => {
  try {
    return await fetchPollsService();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Error fetching polls"
    );
  }
});

// **Fetch Poll By ID**
export const fetchPollById = createAsyncThunk<
  Poll,
  string,
  { rejectValue: string }
>("polls/fetchPollById", async (id, { rejectWithValue }) => {
  try {
    return await fetchPollByIdService(id);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Error fetching poll"
    );
  }
});

// **Create a Poll**
export const createPoll = createAsyncThunk<
  Poll,
  Omit<Poll, "id">,
  { rejectValue: string }
>("polls/createPoll", async (pollData, { rejectWithValue }) => {
  try {
    return await createPollService(pollData);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Error creating poll"
    );
  }
});

// **Update a Poll**
export const updatePoll = createAsyncThunk<
  Poll,
  { id: string; pollData: Partial<Poll> },
  { rejectValue: string }
>("polls/updatePoll", async ({ id, pollData }, { rejectWithValue }) => {
  try {
    return await updatePollService(id, pollData);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Error updating poll"
    );
  }
});

// **Delete a Poll**
export const deletePoll = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("polls/deletePoll", async (id, { rejectWithValue }) => {
  try {
    await deletePollService(id);
    return id;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Error deleting poll"
    );
  }
});

// **Add Options to a Poll**
export const addPollOptions = createAsyncThunk<
  string[],
  { id: string; optionsData: string[] },
  { rejectValue: string }
>("polls/addPollOptions", async ({ id, optionsData }, { rejectWithValue }) => {
  try {
    return await addPollOptionsService(id, optionsData);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Error adding poll options"
    );
  }
});

// **Fetch Poll Results**
export const fetchPollResults = createAsyncThunk<
  PollResults,
  string,
  { rejectValue: string }
>("polls/fetchPollResults", async (id, { rejectWithValue }) => {
  try {
    return await fetchPollResultsService(id);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Error fetching poll results"
    );
  }
});

// **Vote in a Poll**
export const voteInPoll = createAsyncThunk<
  VoteResponse,
  { optionId: string; voterId: string; poll: unknown },
  { rejectValue: string }
>("polls/voteInPoll", async ({ optionId, voterId, poll }, { rejectWithValue }) => {
  try {
    const response = await voteInPollService(optionId, voterId, poll);
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Vote failed"
    );
  }
});


// **Poll Slice**
const pollSlice = createSlice({
  name: "polls",
  initialState: {
    polls: [] as Poll[],
    activePolls: [] as Poll[],
    selectedPoll: null as Poll | null,
    pollResults: {} as Record<string, PollResults>,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
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
      .addCase(deletePoll.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePoll.fulfilled, (state, action) => {
        state.loading = false;
        state.activePolls = state.activePolls.filter((poll) => poll.id !== action.payload);
      })
      .addCase(deletePoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePoll.fulfilled, (state, action) => {
        const index = state.polls.findIndex(
          (poll) => poll.id === action.payload.id
        );
        if (index !== -1) state.polls[index] = action.payload;
      })
      .addCase(addPollOptions.fulfilled, (state, action) => {
        const { id, optionsData } = action.meta.arg;
        const poll = state.polls.find((poll) => poll.id === id);
        if (poll) poll.options = [...(poll.options ?? []), ...optionsData.map((text) => ({ id: "", text }))];
      })
      .addCase(voteInPoll.fulfilled, () => {
        // No need to manually update state
      })
      .addCase(voteInPoll.rejected, (state, action) => {
        state.error = action.payload || "Voting failed";
      })
      .addCase(fetchPollResults.fulfilled, (state, action) => {
        if (!state.pollResults) state.pollResults = {};
        state.pollResults[action.payload.id] = action.payload;
      });
  },
});

// Selectors
export const selectPolls = (state: RootState) => state.polls.polls;
export const selectActivePolls = (state: RootState) => state.polls.activePolls;
export const selectPollLoading = (state: RootState) => state.polls.loading;
export const selectPollError = (state: RootState) => state.polls.error;
export const selectPollResults = (state: RootState) => state.polls.pollResults;

// Memoized Selector for Poll by ID
export const selectPollById = (pollId: string) =>
  createSelector(
    selectPolls,
    (polls: Poll[]): Poll | null =>
      polls.find((poll) => poll.id === pollId) || null
  );

// Export Reducer
export default pollSlice.reducer;
