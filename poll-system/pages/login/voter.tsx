import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Button from "@/components/common/Button";

const VoterLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ voterID: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login-voter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token); // Store token
        router.push("/voter/dashboard"); // Redirect to Voter Dashboard
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-secondary mb-4 text-center">
          Voter Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="voterID"
            placeholder="Voter ID"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <Button
            text="Login as Voter"
            className="w-full bg-secondary text-white rounded-lg"
          />
        </form>
        <p className="text-sm text-center mt-4">
          Not a voter? <Link href="/login/admin">Login as Admin</Link>
        </p>
      </div>
    </section>
  );
};

export default VoterLogin;
