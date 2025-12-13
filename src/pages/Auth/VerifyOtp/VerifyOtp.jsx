import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api";

export default function VerifyOtp() {
  const navigate = useNavigate();

  const savedEmail = localStorage.getItem("resetEmail") || "";

  const [form, setForm] = useState({
    email: savedEmail,
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔐 If no email found, send user back
  useEffect(() => {
    if (!savedEmail) {
      navigate("/forgot-password");
    }
  }, [savedEmail, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/verify-reset-otp", {
        email: form.email,
        otp: form.otp,
      });

      if (!res.data?.success) {
        setError("Invalid OTP. Please try again.");
        return;
      }

      // ✅ Success
      setSuccess("OTP verified successfully. Redirecting...");

      // ⏳ Redirect to reset password
      setTimeout(() => {
        navigate("/reset-password");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid OTP. Please try again."
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
        <h1 className="text-3xl font-bold tracking-tight">Verify OTP</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter the OTP sent to your email
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

        {/* Email (Disabled) */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            value={form.email}
            disabled
            className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100
              px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* OTP */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            OTP
          </label>
          <input
            type="text"
            name="otp"
            value={form.otp}
            onChange={handleChange}
            placeholder="Enter 6-digit OTP"
            required
            maxLength={6}
            disabled={isDisabled}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
              tracking-widest text-center
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
            ? "Verifying..."
            : success
            ? "Redirecting..."
            : "Verify OTP"}
        </button>
      </form>

      {/* Footer */}
      {!success && (
        <p className="mt-6 text-center text-sm text-gray-600">
          Didn’t receive OTP?{" "}
          <Link
            to="/forgot-password"
            className="font-medium text-blue-600 hover:underline"
          >
            Resend OTP
          </Link>
        </p>
      )}
    </div>
  );
}
