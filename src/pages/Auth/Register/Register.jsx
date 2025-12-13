import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

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
      // ✅ SAME FLOW AS LOGIN
      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        mobile: form.mobile,
      });

      if (!res.data?.success) {
        setError("Registration failed. Please try again.");
        return;
      }

      // ✅ Redirect to login after successful registration
      navigate("/login");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">

      {/* Title */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Create account
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Join CarDealer today
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Username */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
              focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

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

        {/* Mobile */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Mobile number
          </label>
          <input
            type="tel"
            name="mobile"
            value={form.mobile}
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600
            py-2.5 text-white font-medium hover:opacity-90 transition
            disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      {/* Login */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
