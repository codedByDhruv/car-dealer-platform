import { useState } from "react";
import { FaTimes, FaCheckCircle } from "react-icons/fa";
import api from "../../api";

export default function InquiryModal({ car, onClose }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🔐 Get user data from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleSubmit = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      const res = await api.post(
        "/inquiries",
        {
          carId: car._id,
          name: user.name,
          phone: user.phone,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        setMessage("");
        setSuccess(true);
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to send inquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-2xl p-6 relative shadow-xl">

        {/* ❌ Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <FaTimes />
        </button>

        {/* ✅ SUCCESS STATE */}
        {success ? (
          <div className="text-center py-10">
            <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">
              Inquiry Sent Successfully!
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Our team will reach out to you as soon as possible.
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* 📝 FORM */}
            <h2 className="text-xl font-bold mb-1">
              Send Inquiry
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              For <strong>{car.name}</strong>
            </p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a short message..."
              rows={4}
              className="w-full border rounded-lg p-3 text-sm resize-none
                focus:ring-2 focus:ring-blue-200 outline-none"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-full py-2.5 rounded-lg bg-blue-600 text-white
                hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Inquiry"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
