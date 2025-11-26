import { useState } from "react";

interface LoginFormProps {
  onSubmit: (data: { username: string; password: string }) => void;
  loading?: boolean;
}

const LoginForm = ({ onSubmit, loading }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-gray-200/30"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-gray-200/30"
        required
      />
      <button
        type="submit"
        className="px-8 py-2 rounded-lg bg-primary text-gray-200 font-semibold transition hover:bg-hover mt-4"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
