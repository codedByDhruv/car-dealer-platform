import React, { useEffect, useState } from "react";
import api, { rawBase } from "../../api";
import "./SoldHistory.css";

export default function SoldHistory() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const imgBase = rawBase;

  useEffect(() => {
    const fetchSold = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/admin/sold", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success) {
          setList(res.data.data);
        } else {
          setErr("Failed to load sold car history");
        }
      } catch (error) {
        setErr("Error fetching sold history");
      } finally {
        setLoading(false);
      }
    };

    fetchSold();
  }, []);

  return (
    <div className="sold-page">
      <h1 className="sold-title">Sold Car History</h1>

      {err && <div className="sold-error">{err}</div>}
      {loading && <div className="sold-loading">Loading sold cars...</div>}

      {!loading && !err && (
        <div className="sold-table-wrapper">
          <table className="sold-table">
            <thead>
              <tr>
                <th>Car</th>
                <th>Buyer</th>
                <th>Sold Date</th>
              </tr>
            </thead>

            <tbody>
              {list.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="car-col">
                      <img
                        src={`${imgBase}${item.car.images[0]}`}
                        alt={item.car.name}
                        className="car-thumb"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/70x50?text=No+Img")
                        }
                      />
                      <div className="car-details">
                        <strong>{item.car.name}</strong>
                        <span>
                          {item.car.brand} • {item.car.model}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <strong>{item.buyerName}</strong>
                  </td>

                  <td>{new Date(item.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {list.length === 0 && (
            <p className="no-sold">No sold cars found.</p>
          )}
        </div>
      )}
    </div>
  );
}
