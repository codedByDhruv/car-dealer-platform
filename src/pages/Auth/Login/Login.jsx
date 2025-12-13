import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      if (!res.data?.success) {
        setError("Login failed. Please try again.");
        return;
      }

      const { token, user } = res.data.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isUser", "true");

      navigate("/");

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">
      
      {/* Title */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">
          Login to continue to CarDealer
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
              focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative mt-1">
            <input
              type={showPwd ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm
                focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute inset-y-0 right-3 text-sm text-gray-500 hover:text-gray-700"
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Forgot */}
        <div className="flex justify-end text-sm">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600
            py-2.5 text-white font-medium hover:opacity-90 transition
            disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {/* Register */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link to="/register" className="font-medium text-blue-600 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
