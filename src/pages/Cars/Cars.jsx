import { useEffect, useState } from "react";
import api from "../../api";
import CarCard from "../../components/CarCard/CarCard";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cars");

      if (res.data?.success) {
        setCars(res.data.data.cars);
        setError("");
      } else {
        setError("Failed to load cars");
      }
    } catch {
      setError("Something went wrong while loading cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold">Available Cars</h1>
          <p className="text-gray-600 mt-2">
            Browse from our collection of verified vehicles
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading && <p className="text-center">Loading cars...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
