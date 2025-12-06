export interface LayoutProps {
  children?: React.ReactNode;
}

export interface ButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface SidebarProps {
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

export interface Choice {
  id: string;
  text: string;
  votes_count?: number;
}

export interface VoteLink {
  token: string;
  poll: string;
  invitee_email: string;
  invitee_name: string;
  used: boolean;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  choices: Choice[];
  start_at?: string;
  end_at?: string;
  is_active: boolean;
  vote_links: VoteLink[];
  created_at: string;
  is_votable: boolean;
  show_results: boolean;
}

export interface ResultItem {
  id: string;
  text: string;
  votes_count: number;
}

export interface Result {
  poll_id: string;
  title: string;
  description: string;
  results: ResultItem[];
}

export interface PollState {
  polls: Poll[];
  currentPoll: Poll | null;
  publicPolls: Poll[];
  closedPolls: Poll[];

  pollStats: any;
  adminAnalytics: any;
  results: Result | null;
  generatedLink: string | null;
  bulkGeneratedLinks: { token: string }[];   
  successMessage: string | null;
  loading: boolean;
  error: string | null;
}

export interface ChoicePayload {
  text: string;
}

export interface CreatePollPayload {
  title: string;
  description?: string;
  start_at?: string | null;
  end_at?: string | null;
  is_active?: boolean;
  choices: ChoicePayload[];
}

export interface DecodedUser {
  username: string;
  is_staff: boolean;
  exp?: number;
  iat?: number;
}

export interface AdminPollManagementProps {
  pollId?: string;
  isCardClickable?: boolean;
  onPollChange?: () => void; 
}

export interface ChoiceEdit {
  id?: string;
  text: string;
  votes_count?: number;
}

export interface UpdateFormProps {
  pollId: string;
  currentTitle: string;
  currentDescription?: string;
  currentChoices: ChoiceEdit[];
  onClose: () => void;
  onUpdated: () => void;
}

export interface LoginFormProps {
  onSubmit: (data: { username: string; password: string }) => void;
  loading?: boolean;

  // Controlled input values
  username: string;
  password: string;

  // Setters for controlled inputs
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
}
