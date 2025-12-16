import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api";

export default function ResetPassword() {
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // 🔐 If email missing, user should not be here
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/reset-password", {
        email,
        newPassword: form.password,
      });

      if (!res.data?.success) {
        setError("Failed to reset password");
        return;
      }

      // ✅ Success
      setSuccess("Password reset successfully. Redirecting to login...");

      // 🧹 Clean reset flow data
      localStorage.removeItem("resetEmail");

      // ⏳ Redirect
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || success;

  return (
    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">

      {/* Title */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a new secure password
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-600">
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* New Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            New password
          </label>
          <div className="relative mt-1">
            <input
              type={showPwd ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={isDisabled}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm
                focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none
                disabled:bg-gray-100 disabled:cursor-not-allowed"
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

        {/* Confirm Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Confirm password
          </label>
          <input
            type={showPwd ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={isDisabled}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
              focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none
              disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isDisabled}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600
            py-2.5 text-white font-medium hover:opacity-90 transition
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Updating password..."
            : success
            ? "Redirecting..."
            : "Reset password"}
        </button>
      </form>

      {/* Back to login */}
      {!success && (
        <p className="mt-6 text-center text-sm text-gray-600">
          Back to{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      )}
    </div>
  );
}
