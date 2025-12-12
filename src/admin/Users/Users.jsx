import React, { useEffect, useState } from "react";
import api from "../../api";
import "./Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [updating, setUpdating] = useState("");

  // Load all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success) {
          setUsers(res.data.data);
        } else {
          setErr("Failed to load users");
        }
      } catch (error) {
        setErr("Error while loading users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Block / Unblock user
  const toggleBlock = async (user) => {
    const id = user._id;
    const action = user.isBlocked ? "unblock" : "block";

    setUpdating(id);

    try {
      const token = localStorage.getItem("token");

      const res = await api.put(
        `/admin/users/${id}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === id ? { ...u, isBlocked: !u.isBlocked } : u
          )
        );
      }
    } catch (error) {
      alert("Failed to update user status");
    } finally {
      setUpdating("");
    }
  };

  return (
    <div className="users-page">
      <h1 className="users-title">Users</h1>

      {err && <div className="users-error">{err}</div>}
      {loading && <div className="users-loading">Loading users...</div>}

      {!loading && !err && (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <strong>{user.name}</strong>
                  </td>

                  <td>{user.email}</td>

                  <td>{user.mobile}</td>

                  <td>{user.role}</td>

                  <td>
                    <span
                      className={`badge ${
                        user.isBlocked ? "blocked" : "active"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="action-col">
                    <button
                      disabled={updating === user._id}
                      className={`action-btn ${
                        user.isBlocked ? "unblock" : "block"
                      }`}
                      onClick={() => toggleBlock(user)}
                    >
                      {updating === user._id
                        ? "Updating..."
                        : user.isBlocked
                        ? "Unblock"
                        : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="no-users">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}
