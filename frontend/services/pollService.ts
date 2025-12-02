import { CreatePollPayload } from "@/Interfaces/interface";
import adminApi from "./adminApi";
import publicApi from "./publicApi";

export const PollService = {
  // ===== Admin Polls =====
  getAll: async () => {
    const res = await adminApi.get("/polls/");
    return res.data;
  },

  getById: async (pollId: string) => {
    const res = await adminApi.get(`/polls/${pollId}/`);
    return res.data;
  },

  createPoll: async (data: CreatePollPayload) => {
    const res = await adminApi.post("/polls/", data);
    return res.data;
  },

  updatePoll: async (pollId: string, data: Partial<CreatePollPayload>) => {
    const res = await adminApi.put(`/polls/${pollId}/`, data);
    return res.data;
  },

  deletePoll: async (pollId: string) => {
    const res = await adminApi.delete(`/polls/${pollId}/`);
    return res.data;
  },

  generateVoteLink: async (pollId: string) => {
    const res = await adminApi.post(`/polls/${pollId}/generate-vote-link/`);
    return res.data;
  },

  getPollStats: async (pollId: string) => {
    const res = await adminApi.get(`/polls/${pollId}/stats/`);
    return res.data;
  },

  // ===== Admin Analytics =====
  getAdminAnalytics: async () => {
    const res = await adminApi.get("/admin/analytics/");
    return res.data;
  },
  
  // ===== Public Polls =====
  getPublicPolls: async () => {
    const res = await publicApi.get("/public-polls/");
    return res.data;
  },

  getPublicPollById: async (pollId: string) => {
    const res = await publicApi.get(`/public-polls/${pollId}/`);
    return res.data;
  },

  getPublicClosedPolls: async () => {
    const res = await publicApi.get("/public-closed-polls/");
    return res.data;
  },

  // ===== Results =====
  getPollResults: async (token: string) => {
    const res = await publicApi.get(`/poll-results/?token=${token}`);
    const results = res.data.results.map((r: any) => ({
      id: r.choice_id,
      text: r.text,
      votes_count: r.votes,
    }));
    return { ...res.data, results };
  },

  // ===== Voting =====
  submitVote: async (payload: { choice: string; votelink: string }) => {
    const res = await publicApi.post("/vote/", {
      token: payload.votelink,
      choice_id: payload.choice,
    });
    return res.data;
  },

  // ===== Public Polls by Token =====
  getPollByToken: async (token: string) => {
    const res = await publicApi.get(`/polls/by-token/?token=${token}`);
    return res.data;
  },
};

export default PollService;
