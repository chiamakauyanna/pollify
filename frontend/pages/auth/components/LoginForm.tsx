import { useState } from "react";

interface LoginFormProps {
  onSubmit: (data: { username: string; password: string }) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-2 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-secondary"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-secondary"        required
      />
      <button type="submit" className="w-full py-2 rounded-lg bg-primary text-white font-semibold transition hover:bg-hover"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
