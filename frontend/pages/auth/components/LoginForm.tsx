import { LoginFormProps } from "@/Interfaces/interface";
import { FiUser, FiLock } from "react-icons/fi";

const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  onSubmit,
  loading,
}: LoginFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label
          htmlFor="username"
          className="flex items-center text-sm font-medium text-gray-600"
        >
          <FiUser className="mr-2" /> Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
          required
          className="w-full px-4 py-4 rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary/30 border border-gray-300 focus:border-primary/30 text-text transition-all duration-300 shadow-sm focus:shadow-lg mt-2"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="flex items-center text-sm font-medium text-gray-600"
        >
          <FiLock className="mr-2" /> Password
        </label>
        <input
          type="password"
          value={password}
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-4 rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary/30 border border-gray-300 focus:border-primary/30 text-text transition-all duration-300 shadow-sm focus:shadow-lg mt-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl font-semibold bg-primary text-white text-lg hover:bg-hover transition-all shadow-md hover:shadow-xl active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
