import { Poll } from "@/Interfaces/interface";
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
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch active polls");
  }
};

// Function to fetch all polls
export const fetchPolls = async (): Promise<Poll[]> => {
  try {
    const response = await api.get("/polls/");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch polls");
  }
};

// Function to fetch a single poll by ID
export const fetchPollById = async (id: number): Promise<Poll> => {
  try {
    const response = await api.get(`/polls/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch poll with ID ${id}`);
  }
};

// Function to create a new poll
export const createPoll = async (pollData: Omit<Poll, "id">): Promise<Poll> => {
  try {
    const response = await api.post("/polls/", pollData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create poll");
  }
};

// Function to update a poll (full update)
export const updatePoll = async (
  id: number,
  pollData: Partial<Poll>,
  token: string
): Promise<Poll> => {
  try {
    const response = await api.put(`/polls/${id}/`, pollData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update poll with ID ${id}`);
  }
};

// Function to delete a poll
export const deletePoll = async (id: number, token: string): Promise<void> => {
  try {
    await api.delete(`/polls/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw new Error(`Failed to delete poll with ID ${id}`);
  }
};

// Function to add options to an existing poll
export const addPollOptions = async (
  id: number,
  optionsData: string[],
  token: string
): Promise<string[]> => {
  try {
    const response = await api.post(`/polls/${id}/add_options/`, optionsData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to add options to poll ID ${id}`);
  }
};

// Function to fetch poll results
export const fetchPollResults = async (id: number): Promise<any> => {
  try {
    const response = await api.get(`/polls/${id}/results/`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch results for poll ID ${id}`);
  }
};

// Function to vote in a poll
export const voteInPoll = async (optionId: string): Promise<any> => {
  try {
    const response = await api.post(`${API_BASE_URL}/votes/`, { option: optionId });
    return response.data;
  } catch (error) {
    throw new Error("Voting failed");
  }
};
