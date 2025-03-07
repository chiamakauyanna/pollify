import { useState } from "react";
import { useRouter } from "next/router"; // Import router
import Link from "next/link";
import Button from "@/components/common/Button";

const AdminRegister = () => {
  const router = useRouter(); // Use router for redirection
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token); // Store token
        router.push("/dashboard/admin"); // Redirect to Admin Dashboard
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full lg:max-w-lg">
        <h2 className="text-2xl font-bold text-primary mb-8 text-center">
          Register as an Admin
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="password" name="password" placeholder="Create Password" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required className="w-full p-2 border rounded" />
          <Button text="Register as Admin" className="w-full bg-primary text-white rounded-lg" />
        </form>
        <p className="text-sm text-center mt-4">Already have an account? <Link href="/login">Sign in</Link></p>
      </div>
    </section>
  );
};

export default AdminRegister;
