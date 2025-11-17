import api from "./api";

// -------------------- TYPES --------------------
export interface User {
  id: string;
  username: string;
}

export interface Choice {
  id: string;
  text: string;
  votes_count?: number;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  created_by: User;
  organization?: { id: string; name: string };
  choices: Choice[];
  start_at?: string;
  end_at?: string;
  is_active: boolean;
  created_at: string;
}

export interface PollPayload {
  title: string;
  description?: string;
  start_at?: string;
  end_at?: string;
  is_active?: boolean;
}

export interface ChoicePayload {
  poll: string; 
  text: string;
}

export interface VotePayload {
  poll: string;
  choice: string;
}

export interface PollStats {
  poll: Poll;
  total_votes: number;
  choices: Choice[];
}

export interface Vote {
  id: string;
  poll: string;
  choice: string;
  voter: string;
  created_at: string;
}

// -------------------- SERVICE --------------------
const pollService = {
  // POLLS
  getPolls: async (): Promise<Poll[]> => {
    const res = await api.get<Poll[]>("/polls/");
    return res.data;
  },

  getPoll: async (id: string): Promise<Poll> => {
    const res = await api.get<Poll>(`/polls/${id}/`);
    return res.data;
  },

  createPoll: async (data: PollPayload): Promise<Poll> => {
    const res = await api.post<Poll>("/polls/", data);
    return res.data;
  },

  updatePoll: async (id: string, data: Partial<PollPayload>): Promise<Poll> => {
    const res = await api.patch<Poll>(`/polls/${id}/`, data);
    return res.data;
  },

  deletePoll: async (id: string): Promise<void> => {
    await api.delete(`/polls/${id}/`);
  },

  // CHOICES
  getChoicesByPoll: async (pollId: string): Promise<Choice[]> => {
    const res = await api.get<Choice[]>(`/choices/?poll=${pollId}`);
    return res.data;
  },

  createChoice: async (data: ChoicePayload): Promise<Choice> => {
    const res = await api.post<Choice>("/choices/", data);
    return res.data;
  },

  updateChoice: async (id: string, data: Partial<ChoicePayload>): Promise<Choice> => {
    const res = await api.patch<Choice>(`/choices/${id}/`, data);
    return res.data;
  },

  deleteChoice: async (id: string): Promise<void> => {
    await api.delete(`/choices/${id}/`);
  },

  // VOTING
  castVote: async (data: VotePayload): Promise<Vote> => {
    const res = await api.post<Vote>("/vote/", data);
    return res.data;
  },

  // POLL STATS
  getPollStats: async (id: string): Promise<PollStats> => {
    const res = await api.get<PollStats>(`/polls/${id}/stats/`);
    return res.data;
  },
};

export default pollService;
