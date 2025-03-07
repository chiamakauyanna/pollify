export interface LayoutProps {
  children?: React.ReactNode;
}

export interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

export interface SidebarProps {
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

export interface HeaderProps {
  toggleSidebar: () => void;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  question: string;
  created_at: string;
  expires_at?: string | null;
  is_active?: boolean; // This determines if the poll is ongoing
  options: { id: string; text: string; created_at: string }[];
  createdAt: string;
  updatedAt: string;
}


export interface Candidate {
  name: string;
  votes: number;
}

export interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export interface PollState {
  polls: Poll[];
  activePolls: Poll[];
  selectedPoll: Poll | null;
  pollResults: unknown;
  loading: boolean;
  error: string | null;
}


export interface DashboardCardProps  {
  title: string;
  count?: number;
  polls?: Poll[];
};

export interface PollData {
  title: string;
  description?: string;
  expires_at?: string | null; 
  options: { text: string }[];
}


