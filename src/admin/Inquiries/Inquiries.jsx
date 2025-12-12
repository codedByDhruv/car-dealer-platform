import React, { useEffect, useState } from "react";
import api, { rawBase } from "../../api";
import "./Inquiries.css";

export default function Inquiries() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [updating, setUpdating] = useState("");

  const imgBase = rawBase;

  // Load inquiries
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/inquiries", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data?.success) {
          setList(res.data.data);
        } else {
          setErr("Failed to load inquiries");
        }
      } catch (error) {
        setErr("Error while loading inquiries");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  // Update inquiry status
  const updateStatus = async (id, status) => {
    setUpdating(id);

    try {
      const token = localStorage.getItem("token");

      const res = await api.put(
        `/inquiries/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        setList((prev) =>
          prev.map((inq) =>
            inq._id === id ? { ...inq, status } : inq
          )
        );
      }
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setUpdating("");
    }
  };

  return (
    <div className="inquiries-page">
      <h1 className="inquiries-title">Inquiries</h1>

      {err && <div className="inquiries-error">{err}</div>}
      {loading && <div className="inquiries-loading">Loading inquiries...</div>}

      {!loading && !err && (
        <div className="inquiries-table-wrapper">
          <table className="inquiries-table">
            <thead>
              <tr>
                <th>Car</th>
                <th>User</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {list.map((inq) => (
                <tr key={inq._id}>
                  <td>
                    <div className="car-col">
                      <img
                        src={`${imgBase}${inq.car.images[0]}`}
                        alt={inq.car.name}
                        className="car-thumb"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/70x50?text=No+Img";
                        }}
                      />
                      <div className="car-details">
                        <strong>{inq.car.name}</strong>
                        <span>
                          {inq.car.brand} • {inq.car.model}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <strong>{inq.user.name}</strong>
                    <div className="small-text">{inq.user.email}</div>
                    <div className="small-text">{inq.user.mobile}</div>
                  </td>

                  <td>{inq.message}</td>

                  <td>
                    <select
                      disabled={updating === inq._id}
                      value={inq.status}
                      className={`status-badge ${inq.status}`}
                      onChange={(e) =>
                        updateStatus(inq._id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="viewed">Viewed</option>
                      <option value="contacted">Contacted</option>
                    </select>
                  </td>

                  <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {list.length === 0 && (
            <p className="no-inquiries">No inquiries found.</p>
          )}
        </div>
      )}
    </div>
  );
}
