import { Poll, PollResults, VoteResponse } from "@/Interfaces/interface";
import axios from "axios";

const API_BASE_URL = "https://pollify.up.railway.app/api";

// Axios instance with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to fetch active polls
export const fetchActivePolls = async (): Promise<Poll[]> => {
  try {
    const response = await api.get("/active-polls/");
    return response.data.results;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch active polls"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

// Function to fetch all polls
export const fetchPolls = async (): Promise<Poll[]> => {
  try {
    const response = await api.get("/polls/");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch polls");
    }
    throw new Error("An unexpected error occurred");
  }
};

// Function to fetch a single poll by ID
export const fetchPollById = async (id: string): Promise<Poll> => {
  try {
    const response = await api.get(`/polls/${id}/`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || `Failed to fetch poll with ID ${id}`
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

// Function to create a new poll
export const createPoll = async (pollData: Omit<Poll, "id">): Promise<Poll> => {
  try {
    const response = await api.post("/polls/", pollData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to create poll");
    }
    throw new Error("An unexpected error occurred");
  }
};

// Function to update a poll
export const updatePoll = async (
  id: string,
  pollData: Partial<Poll>
): Promise<Poll> => {
  try {
    const response = await api.put(`/polls/${id}/`, pollData);
    return response.data.return;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || `Failed to update poll with ID ${id}`
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

// Function to delete a poll
export const deletePoll = async (id: string): Promise<void> => {
  try {
    await api.delete(`/polls/${id}/`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || `Failed to delete poll with ID ${id}`
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

// Function to add options to an existing poll
export const addPollOptions = async (
  id: string,
  optionsData: string[]
): Promise<string[]> => {
  try {
    const response = await api.post(`/polls/${id}/add_options/`, optionsData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          `Failed to add options to poll ID ${id}`
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

// Function to fetch poll results
export const fetchPollResults = async (id: string): Promise<PollResults> => {
  try {
    const response = await api.get(`/polls/${id}/results/`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch results for poll ID ${id}`
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

// Function to vote in a poll
export const voteInPoll = async (optionId: string): Promise<VoteResponse> => {
  try {
    const response = await api.post(`/votes/`, { option: optionId });

    console.log(response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Vote Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Voting failed");
    }
    throw new Error("An unexpected error occurred");
  }
};
