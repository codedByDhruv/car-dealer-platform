import React, { useEffect, useState } from "react";
import api from "../../api";
import "./Dashboard.css";

import { FiUsers, FiTruck, FiArchive } from "react-icons/fi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    usersCount: 0,
    carsCount: 0,
    soldCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      console.log("!1111111111111111111111");
      try {
        const res = await api.get("/admin/stats");
        console.log("res", res);

        if (res.data?.success) {
          setStats(res.data.data);
        } else {
          setErr("Failed to load stats");
        }
      } catch (error) {
        setErr("Error loading dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <h1 className="dash-title">Dashboard</h1>

      {err && <div className="dash-error">{err}</div>}
      {loading && <div className="dash-loading">Loading stats...</div>}

      {!loading && !err && (
        <div className="stats-grid">
          <div className="stat-card users">
            <div className="icon-box">
              <FiUsers />
            </div>
            <div>
              <h3>{stats.usersCount}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card cars">
            <div className="icon-box">
              <FiTruck />
            </div>
            <div>
              <h3>{stats.carsCount}</h3>
              <p>Total Cars</p>
            </div>
          </div>

          <div className="stat-card sold">
            <div className="icon-box">
              <FiArchive />
            </div>
            <div>
              <h3>{stats.soldCount}</h3>
              <p>Sold Cars</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
