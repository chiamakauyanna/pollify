import api from "./api";

// Types
export interface ChoicePayload {
  text: string;
}

export interface VoteLinkPayload {
  invitee_email?: string;
  invitee_name?: string;
}

export interface CreatePollPayload {
  title: string;
  description?: string;
  start_at?: string | null;
  end_at?: string | null;
  is_active?: boolean;
  choices: ChoicePayload[];
  vote_links?: VoteLinkPayload[];
}


export const PollService = {
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

  generateVoteLink: async (pollId: string, data: VoteLinkPayload) => {
    const res = await api.post(`/polls/${pollId}/generate-vote-link/`, data);
    return res.data.token;
  },

  getPublicPolls: async () => {
    const res = await api.get("/public-polls/");
    return res.data;
  },

  getPollResults: async (pollId: string) => {
    const res = await api.get(`/poll-results/?poll_id=${pollId}`);
    const results = res.data.results.map((r: any) => ({
      id: r.choice_id,
      text: r.text,
      votes_count: r.votes,
    }));
    return { ...res.data, results };
  },

  submitVote: async (payload: { poll: string; choice: string; votelink: string }) => {
    const res = await api.post("/vote/", {
      poll: payload.poll,
      choice: payload.choice,
      token: payload.votelink, 
    });
    return res.data;
  },
};

export default PollService;
