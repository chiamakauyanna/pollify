// src/store/pollSelectors.ts
import { RootState } from "../store"; 

// ---- Polls ----
export const selectPolls = (state: RootState) => state.polls.polls;
export const selectCurrentPoll = (state: RootState) => state.polls.currentPoll;
export const selectPublicPolls = (state: RootState) => state.polls.publicPolls;
export const selectPollResults = (state: RootState) => state.polls.results;

// ---- UI / Feedback ----
export const selectPollLoading = (state: RootState) => state.polls.loading;
export const selectPollError = (state: RootState) => state.polls.error;
export const selectPollSuccessMessage = (state: RootState) => state.polls.successMessage;
export const selectGeneratedLink = (state: RootState) => state.polls.generatedLink;

// ---- Derived / Helper Selectors ----

// Get choices of current poll
export const selectCurrentPollChoices = (state: RootState) =>
  state.polls.currentPoll?.choices || [];

// Check if a poll is votable
export const selectIsCurrentPollVotable = (state: RootState) =>
  !!state.polls.currentPoll?.is_votable;

// Get results count safely
export const selectPollResultsCount = (state: RootState) =>
  state.polls.results?.results.length || 0;
