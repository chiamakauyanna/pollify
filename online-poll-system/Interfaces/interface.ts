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

export interface HeaderProps {
  toggleSidebar: () => void;
}

export interface PollOption {
  id?: string;
  text?: string;
  vote_count?: number;
}

export interface Poll {
  id?: string;
  title?: string;
  description?: string;
  createdAt?: string;
  expires_at?: string | null;
  isActive?: boolean;
  options?: PollOption[];
  updatedAt?: string;
}
export interface PollState {
  polls: Poll[];
  activePolls: Poll[];
  selectedPoll: Poll | null;
  pollResults: unknown;
  loading: boolean;
  error: string | null;
  results: Poll[];
}
export interface DashboardCardProps {
  title: string;
  count?: number;
  polls?: Poll[] | undefined;
}
export interface ResultsChartProps {
  options: PollOption[];
}

export interface PollResults {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  expires_at?: string;
  is_active?: boolean;
  total_votes?: string;
  options?: string;
}

export interface VoteResponse {
  id: string;
  option: string;
  voted_at: string;
}

export interface SelectedPollProps {
  formData: Partial<Poll>;
  message: { type: "error" | "success"; text: string } | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleUpdatePoll: () => void;
  isUpdating: boolean;
  optionText: string;
  setOptionText: (text: string) => void;
  handleAddOption: () => void;
  newOptions: string[];
  handleSubmitOptions: () => void;
  isSubmittingOptions: boolean;
}
