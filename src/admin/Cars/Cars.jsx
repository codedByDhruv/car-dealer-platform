// src/admin/Cars/Cars.jsx
import React, { useEffect, useState } from "react";
import api, { rawBase } from "../../api";
import "./Cars.css";

import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const imgBase = rawBase; // http://localhost:5000

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await api.get("/cars");

        if (res.data?.success) {
          setCars(res.data.data.cars);
        } else {
          setErr("Failed to load cars");
        }
      } catch (error) {
        setErr("Error while loading cars");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleEdit = (car) => console.log("Edit:", car);
  const handleDelete = (car) => console.log("Delete:", car);

  return (
    <div className="cars-page">
      <h1 className="cars-title">Cars</h1>

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
                      src={`${imgBase}${car.images[0]}`}
                      alt={car.name}
                      className="car-thumb"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/75x55?text=No+Image";
                      }}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {cars.length === 0 && <p className="no-cars">No cars found.</p>}
        </div>
      )}
    </div>
  );
}
