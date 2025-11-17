import { useState } from "react";

interface RegisterFormProps {
  onSubmit: (data: { username: string; email: string; password: string }) => void;
}

const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {["username", "email", "password"].map((field) => (
        <input
          key={field}
          type={field === "password" ? "password" : "text"}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={formData[field as keyof typeof formData]}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-secondary"
          required
        />
      ))}
      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-primary text-white font-semibold transition hover:bg-hover"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
