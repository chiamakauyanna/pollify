import { Poll } from "@/Interfaces/interface";
import axios from "axios";

const API_BASE_URL = "https://pollify.up.railway.app/api";

// Set up Axios instance with Auth header
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
    console.error("Error fetching active polls:", error);
    throw error;
  }
};

// Function to fetch all polls
export const fetchPolls = async (): Promise<Poll[]> => {
  try {
    const response = await api.get("/polls/");
    return response.data;
  } catch (error) {
    console.error("Error fetching polls:", error);
    throw error;
  }
};

// Function to create a new poll
export const createPoll = async (pollData: unknown) => {
  try {
    const response = await api.post("/polls/", pollData);
    return response.data;
  } catch (error) {
    console.error("Error creating poll:", error);
    throw error;
  }
};


// Function to fetch a single poll by ID
export const fetchPollById = async (id: unknown) => {
  try {
    const response = await api.get(`/polls/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching poll:", error);
    throw error;
  }
};

// Function to update a poll (full update)
export const updatePoll = async (id: unknown, pollData: unknown, token: unknown): Promise<Poll[]>  => {
  try {
    const response = await api.put(`/polls/${id}/`, pollData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating poll:", error);
    throw error;
  }
};

// Function to partially update a poll (patch)
export const partiallyUpdatePoll = async (id: unknown, pollData: unknown, token: unknown) => {
  try {
    const response = await api.patch(`/polls/${id}/`, pollData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating poll:", error);
    throw error;
  }
};

// Function to delete a poll
export const deletePoll = async (id: unknown, token: unknown) => {
 try {
    await api.delete(`/polls/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting poll:", error);
    throw error;
  }
};

// Function to add options to an existing poll
export const addPollOptions = async (id: unknown, optionsData: unknown, token: unknown) => {
  try {
    const response = await api.post(`/polls/${id}/add_options/`, optionsData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding options:", error);
    throw error;
  }
};

// Function to fetch poll results
export const fetchPollResults = async (id: unknown)  => {
  try {
  const response = await api.get(`/polls/${id}/results/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching poll results:", error);
    throw error;
  }
};

// Function to vote in a poll
export const voteInPoll = async (optionId: string,) => {
  const data = { option: optionId };
  const response = await  axios.post(`${API_BASE_URL}/votes/`, data);
  return response.data;
};
