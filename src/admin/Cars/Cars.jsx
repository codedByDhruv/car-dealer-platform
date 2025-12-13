// src/admin/Cars/Cars.jsx
import React, { useEffect, useState } from "react";
import api, { rawBase } from "../../api";
import "./Cars.css";

import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { Modal, message } from "antd";
import EditCarModal from "./EditCarModal";
import SoldCarModal from "./SoldCarModal";
import AddCarModal from "./AddCarModal";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [soldOpen, setSoldOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const imgBase = rawBase;

  // ==========================
  // Fetch Cars
  // ==========================
  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cars");

      if (res.data?.success) {
        setCars(res.data.data.cars);
        setErr("");
      } else {
        setErr("Failed to load cars");
      }
    } catch {
      setErr("Error while loading cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // ==========================
  // Actions
  // ==========================
  const handleDelete = (car) => {
    Modal.confirm({
      title: "Delete Car Record",
      content: "This action is NOT reversible.",
      okType: "danger",
      onOk: async () => {
        try {
          const res = await api.delete(`/cars/${car._id}`);
          if (res.data?.success) {
            message.success("🗑️ Car deleted successfully");
            fetchCars();
          }
        } catch {
          message.error("❌ Failed to delete car");
        }
      },
    });
  };

  const handleEdit = (car) => {
    setSelectedCar(car);
    setEditOpen(true);
  };

  const handleSold = (car) => {
    setSelectedCar(car);
    setSoldOpen(true);
  };

  return (
    <div className="cars-page">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 className="cars-title">Cars</h1>

        <button className="action-btn edit" onClick={() => setAddOpen(true)}>
          <FiPlus /> Add Car
        </button>
      </div>

      {err && <div className="cars-error">{err}</div>}
      {loading && <div className="cars-loading">Loading cars...</div>}

      {!loading && !err && (
        <div className="cars-table-wrapper">
          <table className="cars-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Car</th>
                <th>Year</th>
                <th>Price</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {cars.map((car) => (
                <tr key={car._id}>
                  <td>
                    <img
                      src={`${imgBase}${car.images?.[0]}`}
                      alt={car.name}
                      className="car-thumb"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/75x55?text=No+Image")
                      }
                    />
                  </td>

                  <td>
                    <div className="car-info">
                      <strong>{car.name}</strong>
                      <span>
                        {car.brand} • {car.model}
                      </span>
                    </div>
                  </td>

                  <td>{car.year}</td>
                  <td>₹ {car.price.toLocaleString()}</td>

                  <td className="actions-col">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(car)}
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(car)}
                    >
                      <FiTrash2 />
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => handleSold(car)}
                    >
                      SOLD
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {cars.length === 0 && (
            <p className="no-cars">No cars found.</p>
          )}
        </div>
      )}

      {/* Modals */}
      <AddCarModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={fetchCars}
      />

      <EditCarModal
        open={editOpen}
        car={selectedCar}
        onClose={() => setEditOpen(false)}
        onUpdated={fetchCars}
      />

      <SoldCarModal
        open={soldOpen}
        car={selectedCar}
        onClose={() => setSoldOpen(false)}
        onSold={fetchCars}
      />

    </div>
  );
}
