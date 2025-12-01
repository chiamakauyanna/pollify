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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Username */}
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="
           w-full px-4 py-4 rounded-xl 
            bg-gray-100/60 focus:outline-none 
            focus:bg-white focus:ring-1 focus:ring-primary/30 
            border border-transparent 
            focus:border-primary/30
            text-text
            transition-all duration-300
            shadow-sm focus:shadow-lg
          "
          placeholder="Username"
          required
        />
      </div>

      {/* Password */}
      <div className="relative">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
           w-full px-4 py-4 rounded-xl 
            bg-gray-100/60 focus:outline-none focus:ring-1
            focus:bg-white focus:ring-primary/30 
            border border-transparent 
            focus:border-primary/30
            text-text
            transition-all duration-300
            shadow-sm focus:shadow-lg
          "
          placeholder="Password"
          required
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full py-4 rounded-2xl font-semibold
          bg-primary text-white text-lg
          hover:bg-hover transition-all 
          shadow-md hover:shadow-xl
          active:scale-[0.98]
          disabled:opacity-60
        "
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
