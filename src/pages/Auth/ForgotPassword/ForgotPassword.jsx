import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔐 Clear all auth data when coming to forgot password
  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/send-reset-otp", { email });

      if (!res.data?.success) {
        setError("Failed to send OTP. Please try again.");
        return;
      }

      localStorage.setItem("resetEmail", email);

      // ✅ Success state
      setSuccess("OTP sent to your email. Redirecting...");

      // ⏳ Redirect
      setTimeout(() => {
        navigate("/verify-otp");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to send reset OTP"
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
          Forgot password?
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter your email to receive a reset OTP
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
        <div>
          <label className="text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isDisabled}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
              focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none
              disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600
            py-2.5 text-white font-medium hover:opacity-90 transition
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Sending OTP..."
            : success
            ? "Redirecting..."
            : "Send OTP"}
        </button>
      </form>

      {/* Back to Login */}
      {!success && (
        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Back to login
          </Link>
        </p>
      )}
    </div>
  );
}
