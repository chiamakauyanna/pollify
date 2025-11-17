import { RootState } from "../store";

// ------- POLL SELECTORS -------

// Get all polls
export const selectPolls = (state: RootState) => state.polls.polls;

// Get current selected poll
export const selectCurrentPoll = (state: RootState) => state.polls.currentPoll;

// Get poll stats
export const selectPollStats = (state: RootState) => state.polls.pollStats;

// Combined selector: current poll + updated choices with votes_count
export const selectCurrentPollWithStats = (state: RootState) => {
  const poll = state.polls.currentPoll;
  const stats = state.polls.pollStats;

  if (!poll) return undefined;

  return {
    ...poll,
    choices: poll.choices.map((choice) => {
      const statChoice = stats?.choices.find((c) => c.id === choice.id);
      return {
        ...choice,
        votes_count: statChoice?.votes_count ?? 0,
      };
    }),
    total_votes: stats?.total_votes ?? 0,
  };
};

// Same as above but sorted by votes descending
export const selectCurrentPollWithStatsSorted = (state: RootState) => {
  const pollWithStats = selectCurrentPollWithStats(state);

  if (!pollWithStats) return undefined;

  return {
    ...pollWithStats,
    choices: [...pollWithStats.choices].sort(
      (a, b) => (b.votes_count ?? 0) - (a.votes_count ?? 0)
    ),
  };
};

// Loading state
export const selectPollsLoading = (state: RootState) => state.polls.loading;

// Error state
export const selectPollsError = (state: RootState) => state.polls.error;
