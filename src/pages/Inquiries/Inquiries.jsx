import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { rawBase } from "../../api";

export default function Inquiries() {
  const navigate = useNavigate();
  const imgBase = rawBase;

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const isUser = localStorage.getItem("isUser");

    if (!token || !user || isUser !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  /* ================= FETCH INQUIRIES ================= */
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);

        const res = await api.get("/inquiries/mine", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data?.success) {
          setInquiries(res.data.data);
        } else {
          setError("Failed to load inquiries");
        }
      } catch (err) {
        setError("Something went wrong while loading inquiries");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">My Inquiries</h1>
        <p className="text-gray-600 mb-8">
          Track all your car inquiries in one place
        </p>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading inquiries...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500">
            {error}
          </p>
        )}

        {/* Empty */}
        {!loading && !error && inquiries.length === 0 && (
          <p className="text-center text-gray-500">
            You haven’t made any inquiries yet.
          </p>
        )}

        {/* Table */}
        {!loading && !error && inquiries.length > 0 && (
          <div className="bg-white rounded-2xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-4">Car</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {inquiries.map((inq) => (
                  <tr
                    key={inq._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* Car */}
                    <td className="p-4 flex items-center gap-3 min-w-[220px]">
                      <img
                        src={`${imgBase}${inq.car?.images?.[0]}`}
                        alt={inq.car?.name}
                        className="h-12 w-16 rounded object-cover"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/80x50?text=No+Image")
                        }
                      />
                      <div>
                        <p className="font-medium">
                          {inq.car?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {inq.car?.brand} • {inq.car?.year}
                        </p>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-semibold text-blue-600">
                      ₹ {inq.car?.price?.toLocaleString()}
                    </td>

                    {/* Message */}
                    <td className="p-4 text-gray-600 max-w-xs">
                      {inq.message}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <StatusBadge status={inq.status} />
                    </td>

                    {/* Date */}
                    <td className="p-4 text-gray-500">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STATUS BADGE ================= */
function StatusBadge({ status }) {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize
        ${map[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}
