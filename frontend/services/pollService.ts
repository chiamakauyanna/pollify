import { CreatePollPayload } from "@/Interfaces/interface";
import api from "./api";

export const PollService = {
  // ===== Admin Polls =====
  getAll: async () => {
    const res = await api.get("/polls/");
    return res.data;
  },

  getById: async (pollId: string) => {
    const res = await api.get(`/polls/${pollId}/`);
    return res.data;
  },

  createPoll: async (data: CreatePollPayload) => {
    const res = await api.post("/polls/", data);
    return res.data;
  },

  updatePoll: async (pollId: string, data: Partial<CreatePollPayload>) => {
    const res = await api.put(`/polls/${pollId}/`, data);
    return res.data;
  },

  deletePoll: async (pollId: string) => {
    const res = await api.delete(`/polls/${pollId}/`);
    return res.data;
  },

  generateVoteLink: async (pollId: string) => {
    const res = await api.post(`/polls/${pollId}/generate-vote-link/`);
    return res.data;
  },

  // ===== Public Polls =====
  getPublicPolls: async () => {
    const res = await api.get("/public-polls/");
    return res.data;
  },

  getPublicPollById: async (pollId: string) => {
    const res = await api.get(`/public-polls/${pollId}/`);
    return res.data;
  },

  getPublicClosedPolls: async () => {
    const res = await api.get("/public-closed-polls/");
    return res.data;
  },

  // ===== Results =====
  getPollResults: async (token: string) => {
    const res = await api.get(`/poll-results/?token=${token}`);
    const results = res.data.results.map((r: any) => ({
      id: r.choice_id,
      text: r.text,
      votes_count: r.votes,
    }));
    return { ...res.data, results };
  },

  getPollStats: async (pollId: string) => {
    const res = await api.get(`/polls/${pollId}/stats/`);
    return res.data;
  },

  // ===== Voting =====
  submitVote: async (payload: { choice: string; votelink: string }) => {
    const res = await api.post("/vote/", {
      token: payload.votelink,
      choice_id: payload.choice,
    });
    return res.data;
  },

  // ===== Admin Analytics =====
  getAdminAnalytics: async () => {
    const res = await api.get("/admin/analytics/");
    return res.data;
  },
};

export default PollService;
