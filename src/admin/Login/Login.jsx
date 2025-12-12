import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { API_BASE } from "../../api";
import "./Login.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email.trim() || !password.trim()) {
      setErr("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const payload = { email: email.trim(), password };
      const res = await api.post("/auth/login", payload);

      const body = res?.data;
      if (!body) {
        setErr("No response from server.");
        setLoading(false);
        return;
      }

      if (!body.success) {
        setErr(body.message || "Login failed.");
        setLoading(false);
        return;
      }

      const token = body?.data?.token;
      const user = body?.data?.user;

      if (!user || !token) {
        setErr("Invalid response from server (missing token/user).");
        setLoading(false);
        return;
      }

      if ((user.role || "").toString().toLowerCase() !== "admin") {
        setErr("You do not have permission to access the admin panel.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("adminUser", JSON.stringify(user));
      localStorage.setItem("adminAuth", "true");

      navigate("/admin", { replace: true });
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || error.response.statusText || "Login failed";
        setErr(message);
      } else if (error.request) {
        setErr(`Server did not respond. Check API base (${API_BASE}).`);
      } else {
        setErr(error.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Admin Login</h2>
        {err && <div className="login-error" role="alert">{err}</div>}

        <label className="login-label">
          Email
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            disabled={loading}
          />
        </label>

        <label className="login-label">
          Password
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </label>

        <button className="login-submit" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
