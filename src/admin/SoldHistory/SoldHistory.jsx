// src/admin/SoldHistory/SoldHistory.jsx
import React, { useEffect, useState } from "react";
import api, { rawBase } from "../../api";
import { Modal } from "antd";
import { FiEye } from "react-icons/fi";
import "./SoldHistory.css";

export default function SoldHistory() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const imgBase = rawBase;

  useEffect(() => {
    const fetchSold = async () => {
      try {
        const res = await api.get("/admin/sold");
        if (res.data?.success) {
          setList(res.data.data);
        } else {
          setErr("Failed to load sold car history");
        }
      } catch {
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
                <th>Sold Price</th>
                <th>Sold Date</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {list.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="car-col">
                      <img
                        src={`${imgBase}${item.car.images?.[0]}`}
                        alt={item.car.name}
                        className="car-thumb"
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
                    <strong>{item.buyer.fullName}</strong>
                    <div className="sub-text">{item.buyer.mobileNumber}</div>
                  </td>

                  <td>₹ {item.soldPrice.toLocaleString()}</td>

                  <td>
                    {new Date(item.soldDate).toLocaleDateString()}
                  </td>

                  <td>
                    <button
                      className="eye-btn"
                      onClick={() => {
                        setSelected(item);
                        setOpen(true);
                      }}
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {list.length === 0 && (
            <p className="no-sold">No sold cars found.</p>
          )}
        </div>
      )}

      {/* ==========================
          View Sold Details Modal
      ========================== */}
      <Modal
        open={open}
        title="Sold Car Details"
        footer={null}
        onCancel={() => setOpen(false)}
        centered
        width={700}
      >
        {selected && (
          <div className="sold-modal">
            <h3>🚗 Car Info</h3>
            <p><b>{selected.car.name}</b></p>
            <p>{selected.car.brand} • {selected.car.model}</p>

            <h3>👤 Buyer Info</h3>
            <p><b>Name:</b> {selected.buyer.fullName}</p>
            <p><b>Mobile:</b> {selected.buyer.mobileNumber}</p>
            <p><b>Email:</b> {selected.buyer.email}</p>

            <p>
              <b>Address:</b>{" "}
              {selected.buyer.address.street},{" "}
              {selected.buyer.address.city},{" "}
              {selected.buyer.address.state} -{" "}
              {selected.buyer.address.pincode}
            </p>

            <h3>🪪 ID Proof</h3>
            <p>
              {selected.buyer.idProof.type} —{" "}
              {selected.buyer.idProof.number}
            </p>
            <img
              src={`${imgBase}${selected.buyer.idProof.images[0]}`}
              alt="ID Proof"
              className="id-proof-img"
            />

            <h3>💰 Sale Info</h3>
            <p><b>Price:</b> ₹ {selected.soldPrice.toLocaleString()}</p>
            <p><b>Payment:</b> {selected.paymentMode}</p>
            <p><b>Remarks:</b> {selected.remarks}</p>
            <p>
              <b>Sold Date:</b>{" "}
              {new Date(selected.soldDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
