import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast, ToastContainer } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("Account created successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="input input-bordered w-full"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="input input-bordered w-full"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button className="btn btn-primary w-full" type="submit">
            Register
          </button>
        </form>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <a className="text-primary" href="/login">
            Login
          </a>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Register;