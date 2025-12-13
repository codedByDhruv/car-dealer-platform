import { useEffect, useState } from "react";
import { rawBase } from "../../api";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import InquiryModal from "../InquiryModal/InquiryModal";
import LoginRequiredModal from "../LoginRequiredModal/LoginRequiredModal";

export default function CarDetailsModal({ car, onClose }) {
  if (!car) return null;

  const imgBase = rawBase;
  const images = car.images || [];
  const [active, setActive] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

    const handleInquire = () => {
    const token = localStorage.getItem("token");
    const isUser = localStorage.getItem("isUser") === "true";

    if (!token || !isUser) {
        setShowLoginModal(true);
    } else {
        setShowInquiryModal(true);
    }
    };

  const next = () =>
    setActive((prev) => (prev + 1) % images.length);

  const prev = () =>
    setActive((prev) => (prev - 1 + images.length) % images.length);

  /* 🔒 Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl relative">

        {/* ❌ Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-600 hover:text-black"
        >
          <FaTimes size={20} />
        </button>

        {/* ================= CONTENT ================= */}
        <div className="grid md:grid-cols-2 h-[85vh]">

          {/* ================= LEFT : IMAGE SLIDER ================= */}
          <div className="bg-gray-100 p-6 flex flex-col">

            {/* Main Image */}
            <div className="relative flex-1 rounded-xl overflow-hidden bg-white">
              {images.length > 0 ? (
                <img
                  src={`${imgBase}${images[active]}`}
                  alt={car.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src="https://via.placeholder.com/600x400?text=No+Image"
                  className="w-full h-full object-contain"
                />
              )}

              {/* Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white"
                  >
                    <FaChevronLeft />
                  </button>

                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={`${imgBase}${img}`}
                    onClick={() => setActive(i)}
                    className={`h-16 w-24 object-cover rounded-lg cursor-pointer border-2 transition
                      ${i === active
                        ? "border-blue-600"
                        : "border-transparent hover:border-gray-300"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ================= RIGHT : DETAILS (SCROLLABLE) ================= */}
          <div className="p-8 overflow-y-auto scroll-smooth">

            {/* Title */}
            <h2 className="text-3xl font-bold mb-1">{car.name}</h2>
            <p className="text-gray-500 mb-4">
              {car.brand} • {car.model} • {car.year}
            </p>

            {/* Price */}
            <div className="text-3xl font-bold text-blue-600 mb-6">
              ₹ {car.price.toLocaleString()}
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-8">
              <Spec label="Condition" value={car.condition} />
              <Spec label="Fuel" value={car.fuelType || "N/A"} />
              <Spec label="Transmission" value={car.transmission || "N/A"} />
              <Spec label="Mileage" value={car.mileage || "N/A"} />
              <Spec label="Color" value={car.color || "N/A"} />
              <Spec label="Year" value={car.year} />
            </div>

            {/* Description */}
            {car.description && (
              <div className="mb-10">
                <h3 className="font-semibold mb-2 text-lg">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {car.description}
                </p>
              </div>
            )}

            {/* Sticky CTA */}
            <div className="sticky bottom-0 bg-white pt-4">
              <button onClick={handleInquire} className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                Inquire Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {showLoginModal && (
    <LoginRequiredModal
        onClose={() => setShowLoginModal(false)}
    />
    )}

    {showInquiryModal && (
    <InquiryModal
        car={car}
        onClose={() => setShowInquiryModal(false)}
    />
    )}

    </>
  );
}

/* 🔹 Spec Card */
function Spec({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-medium capitalize">{value}</p>
    </div>
  );
}
