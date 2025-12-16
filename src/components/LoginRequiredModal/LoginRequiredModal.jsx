import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

export default function LoginRequiredModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-2xl p-6 text-center relative shadow-xl">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-3">
          Login Required
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          To inquire about any car, please login first.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="w-full py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
