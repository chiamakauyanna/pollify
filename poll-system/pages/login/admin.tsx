import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Button from "@/components/common/Button";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter(); // Router instance for navigation

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Login successful! Redirecting...");
        router.push("/dashboard/admin"); // Redirect to Admin Dashboard
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 outline rounded outline-primary text-sm"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 outline rounded outline-primary text-sm"
            required
          />
          <Button text="Login as Admin" className="w-full bg-primary text-white rounded hover:bg-secondary" />
        </form>
        <p className="text-sm mt-4 text-center">
          Forgot Password?{" "}
          <Link href="/forgot-password" className="text-secondary font-semibold">
            Reset here
          </Link>
        </p>
        <p className="text-sm mt-2 text-center">
          Not an Admin?{" "}
          <Link href="/login/voter" className="text-primary font-semibold">
            Login as Voter
          </Link>
        </p>
      </div>
    </section>
  );
};

AdminLogin.noLayout = true;
export default AdminLogin;
