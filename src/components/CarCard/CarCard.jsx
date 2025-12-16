import { useState } from "react";
import { rawBase } from "../../api";
import CarDetailsModal from "./CarDetailsModal";

export default function CarCard({ car, className = "" }) {
  const imgBase = rawBase;
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <div
        className={`group bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl transition ${className}`}
      >
        {/* Image */}
        <div className="overflow-hidden">
          <img
            src={`${imgBase}${car.images?.[0]}`}
            alt={car.name}
            className="h-56 w-full object-cover group-hover:scale-110 transition duration-500"
            onError={(e) =>
              (e.target.src =
                "https://via.placeholder.com/400x250?text=No+Image")
            }
          />
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="text-lg font-semibold">{car.name}</h3>
          <p className="text-sm text-gray-500">
            {car.brand} • {car.model} • {car.year}
          </p>

          <div className="flex justify-between items-center mt-4">
            <span className="text-xl font-bold text-blue-600">
              ₹ {car.price.toLocaleString()}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => setOpen(true)}
              className="flex-1 px-4 py-2 rounded-full border border-blue-600 text-blue-600 text-sm hover:bg-blue-50 transition"
            >
              More Details
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <CarDetailsModal
          car={car}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
