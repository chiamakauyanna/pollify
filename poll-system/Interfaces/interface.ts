export interface LayoutProps {
  children?: React.ReactNode;
  userName?: string;
  userImage?: string;
  isAdmin?: boolean;
}

export interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

export interface SidebarProps {
  userType?: "admin" | "voter";
  userName?: string;
  userImage?: string;
  isOpen?: boolean;
  isAdmin?: boolean;
  toggleSidebar?: () => void;
}

export interface HeaderProps {
  userName: string;
  userImage: string;
  toggleSidebar: () => void;
}

export interface Candidate {
  name: string;
  votes: number;
}

export interface Poll {
  id: number;
  title: string;
  description: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  status: "Upcoming" | "Ongoing" | "Completed";
  candidates: Candidate[];
}

export interface Candidate {
  name: string;
  votes: number;
}

export interface PollState {
  polls: Poll[];
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: "superadmin" | "admin";
}

export interface AdminState {
  admins: Admin[];
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  user: null | { id: string; role: string };
  loading: boolean;
  error: string | null;
  token: string | null;
}
