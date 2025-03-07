import { useState } from "react";
import { useRouter } from "next/router"; // For redirection
import Link from "next/link";
import Button from "@/components/common/Button";

const VoterRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter(); // Router instance for navigation

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("/api/register/voter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful! Redirecting...");
        router.push("/dashboard/voter"); // Redirect to Voter Dashboard
      } else {
        alert(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-secondary mb-8 text-center">Register as a Voter</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 outline rounded outline-primary text-sm"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 outline rounded outline-primary text-sm"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 outline rounded outline-primary text-sm"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 outline rounded outline-primary text-sm"
            required
          />
          <Button text="Register as Voter" className="w-full bg-secondary text-white rounded hover:bg-primary" />
        </form>
        <p className="text-sm mt-4 text-center">
          Already registered?{" "}
          <Link href="/login/voter" className="text-secondary font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
};

VoterRegister.noLayout = true;
export default VoterRegister;
