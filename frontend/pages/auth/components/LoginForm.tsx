import { LoginFormProps } from "@/Interfaces/interface";

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
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="w-full px-4 py-4 rounded-xl bg-gray-100/60 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary/30 border border-transparent focus:border-primary/30 text-text transition-all duration-300 shadow-sm focus:shadow-lg"
        />
      </div>

      <div className="relative">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-4 py-4 rounded-xl bg-gray-100/60 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary/30 border border-transparent focus:border-primary/30 text-text transition-all duration-300 shadow-sm focus:shadow-lg"
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
