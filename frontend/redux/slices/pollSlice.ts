import { AnyAction, SerializedError } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PollService from "@/services/pollService";
import { PollState, CreatePollPayload } from "@/Interfaces/interface";

// ====== ASYNC THUNKS ======

// Admin
export const fetchPolls = createAsyncThunk("polls/fetchAll", async () => {
  return await PollService.getAll();
});

export const fetchPoll = createAsyncThunk(
  "polls/fetchOne",
  async (pollId: string) => {
    return await PollService.getById(pollId);
  }
);

export const createPoll = createAsyncThunk(
  "polls/create",
  async (data: CreatePollPayload) => {
    return await PollService.createPoll(data);
  }
);

export const updatePoll = createAsyncThunk(
  "polls/update",
  async ({
    pollId,
    data,
  }: {
    pollId: string;
    data: Partial<CreatePollPayload>;
  }) => {
    return await PollService.updatePoll(pollId, data);
  }
);

export const deletePoll = createAsyncThunk(
  "polls/delete",
  async (pollId: string) => {
    await PollService.deletePoll(pollId);
    return pollId;
  }
);

export const generateVoteLink = createAsyncThunk(
  "polls/generateVoteLink",
  async ({ pollId }: { pollId: string }) => {
    return await PollService.generateVoteLink(pollId);
  }
);

export const bulkGenerateVoteLinks = createAsyncThunk(
  "polls/bulkGenerateVoteLinks",
  async ({
    pollId,
    invitees,
  }: {
    pollId: string;
    invitees: { email: string; name: string }[];
  }) => {
    return await PollService.bulkGenerateVoteLinks(pollId, invitees);
  }
);

export const sendBulkVoteEmails = createAsyncThunk(
  "polls/sendBulkVoteEmails",
  async ({
    pollTitle,
    invitees,
  }: {
    pollTitle: string;
    invitees: { name: string; email: string; link: string }[];
  }) => {
    return await PollService.sendBulkVoteEmails(pollTitle, invitees);
  }
);

// Public
export const fetchPublicPolls = createAsyncThunk("polls/public", async () => {
  return await PollService.getPublicPolls();
});

export const fetchPollResults = createAsyncThunk(
  "polls/results",
  async (token: string) => {
    return await PollService.getPollResults(token);
  }
);

export const fetchPublicPollById = createAsyncThunk(
  "polls/publicById",
  async (pollId: string) => {
    return await PollService.getPublicPollById(pollId);
  }
);

export const fetchPublicClosedPolls = createAsyncThunk(
  "polls/publicClosed",
  async () => {
    return await PollService.getPublicClosedPolls();
  }
);

export const fetchPollStats = createAsyncThunk(
  "polls/stats",
  async (pollId: string) => {
    return await PollService.getPollStats(pollId);
  }
);

export const fetchAdminAnalytics = createAsyncThunk(
  "polls/adminAnalytics",
  async () => {
    return await PollService.getAdminAnalytics();
  }
);

// Public - fetch poll by token
export const fetchPollByToken = createAsyncThunk(
  "polls/fetchByToken",
  async (token: string) => {
    return await PollService.getPollByToken(token);
  }
);

export const submitVote = createAsyncThunk(
  "polls/submitVote",
  async (payload: { poll: string; choice: string; votelink: string }) => {
    return await PollService.submitVote(payload);
  }
);

const initialState: PollState = {
  polls: [],
  publicPolls: [],
  closedPolls: [],
  currentPoll: null,
  results: null,
  pollStats: null,
  adminAnalytics: null,
  generatedLink: null,
  bulkGeneratedLinks: [],
  successMessage: null,
  loading: false,
  error: null,
};

// =================== SLICE ===================

const pollSlice = createSlice({
  name: "polls",
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
      state.generatedLink = null;
    },
  },
  extraReducers: (builder) => {
    // ===== Fulfilled Handlers =====

    // Admin
    builder
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.polls = action.payload;
      })
      .addCase(fetchPoll.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPoll = action.payload;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.loading = false;
        state.polls.unshift(action.payload);
        state.successMessage = "Poll created";
      })
      .addCase(updatePoll.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPoll = action.payload;
        state.successMessage = "Poll updated";
      })
      .addCase(deletePoll.fulfilled, (state, action) => {
        state.loading = false;
        state.polls = state.polls.filter((p) => p.id !== action.payload);
        state.successMessage = "Poll deleted";
      })
      .addCase(generateVoteLink.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedLink = action.payload;
        state.successMessage = "Vote link generated";
      })
      .addCase(bulkGenerateVoteLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.bulkGeneratedLinks = action.payload.links;
        state.successMessage = "Bulk vote links generated!";
      })
      .addCase(sendBulkVoteEmails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendBulkVoteEmails.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Emails sent successfully!";
        state.generatedLink = null;
      })
      .addCase(sendBulkVoteEmails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to send emails";
      });

    // Public
    builder
      .addCase(fetchPublicPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.publicPolls = action.payload;
      })
      .addCase(fetchPollResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(submitVote.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.successMessage = "Vote submitted!";
      })
      .addCase(fetchPublicPollById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPoll = action.payload;
      })
      .addCase(fetchPublicClosedPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.closedPolls = action.payload;
      })
      .addCase(fetchPollStats.fulfilled, (state, action) => {
        state.loading = false;
        state.pollStats = action.payload;
      })
      .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.adminAnalytics = action.payload;
      })
      .addCase(fetchPollByToken.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPoll = action.payload;
      });

    // ===== Unified Pending Handler =====
    builder.addMatcher(
      (action) =>
        action.type.startsWith("polls/") && action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    // ===== Unified Rejected Handler =====
    builder.addMatcher(
      (action: AnyAction): action is AnyAction & { error: SerializedError } =>
        action.type.startsWith("polls/") && action.type.endsWith("/rejected"),
      (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Error";
      }
    );
  },
});

export const { clearMessages } = pollSlice.actions;
export default pollSlice.reducer;
