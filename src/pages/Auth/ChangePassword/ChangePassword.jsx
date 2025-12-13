import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

export default function ChangePassword() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isUser = localStorage.getItem("isUser") === "true";

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // 🔐 Protect route
  useEffect(() => {
    if (!token || !isUser) {
      navigate("/login");
    }
  }, [token, isUser, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(
        "/auth/change-password",
        {
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.data?.success) {
        setError("Failed to change password");
        return;
      }

      // ✅ Success
      setSuccess("Password changed successfully. Please login again.");

      // 🧹 Clear auth
      localStorage.clear();

      // ⏳ Redirect
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || success;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">

        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Change password
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Update your account password
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

          {/* Old Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Current password
            </label>
            <input
              type={showPwd ? "text" : "password"}
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              required
              disabled={isDisabled}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
                focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none
                disabled:bg-gray-100"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              New password
            </label>
            <input
              type={showPwd ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              disabled={isDisabled}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
                focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none
                disabled:bg-gray-100"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm new password
            </label>
            <input
              type={showPwd ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              disabled={isDisabled}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm
                focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none
                disabled:bg-gray-100"
            />
          </div>

          {/* Show / Hide */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showPwd}
              onChange={() => setShowPwd(!showPwd)}
            />
            <span>Show passwords</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isDisabled}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600
              py-2.5 text-white font-medium hover:opacity-90 transition
              disabled:opacity-50"
          >
            {loading
              ? "Updating..."
              : success
              ? "Redirecting..."
              : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
}
