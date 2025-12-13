import { useEffect, useLayoutEffect, useRef, useState } from "react";
import api, { rawBase } from "../../api";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaCarSide,
  FaShieldAlt,
  FaRupeeSign,
  FaSearch,
  FaClipboardCheck,
  FaHandshake,
} from "react-icons/fa";
import CarCard from "../../components/CarCard/CarCard";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  const pageRef = useRef(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    api.get("/cars").then((res) => {
      if (res.data?.success) {
        setCars(res.data.data.cars);
      }
    });
  }, []);

  /* ================= GSAP ================= */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-anim", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="bg-gray-50 overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <h1 className="hero-anim text-5xl md:text-6xl font-bold">
            Buy Cars With <span className="text-blue-400">Confidence</span>
          </h1>
          <p className="hero-anim mt-6 max-w-2xl mx-auto text-lg opacity-90">
            Premium verified cars. Transparent pricing. Trusted dealers.
          </p>
          <button className="hero-anim mt-10 px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition">
            Explore Cars
          </button>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="reveal bg-white py-16 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["500+", "Cars Listed"],
            ["300+", "Happy Buyers"],
            ["100%", "Verified Cars"],
            ["24/7", "Support"],
          ].map(([v, l]) => (
            <div key={l}>
              <h3 className="text-3xl font-bold text-blue-600">{v}</h3>
              <p className="text-gray-600 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="reveal text-4xl font-bold text-center mb-16">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            [FaShieldAlt, "Verified Listings", "Every car is inspected"],
            [FaRupeeSign, "Best Pricing", "No hidden charges"],
            [FaCarSide, "Wide Selection", "All brands & models"],
          ].map(([Icon, title, desc]) => (
            <div
              key={title}
              className="reveal bg-white rounded-2xl p-8 shadow hover:shadow-xl transition"
            >
              <Icon className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-gray-600 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CARS ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-28">
        <h2 className="reveal text-4xl font-bold text-center mb-14">
          Featured Cars
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {cars.slice(0, 6).map((car) => (
            <CarCard
              key={car._id}
              car={car}
              className="reveal"
            />
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="reveal bg-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-14">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              [FaSearch, "Browse Cars"],
              [FaClipboardCheck, "Verify Details"],
              [FaHandshake, "Close the Deal"],
            ].map(([Icon, text]) => (
              <div key={text}>
                <Icon className="text-5xl mx-auto mb-4 text-blue-400" />
                <p className="text-lg">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="reveal bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-24 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Find Your Next Car?
        </h2>
        <p className="opacity-90 mb-8">
          Start browsing today and drive away happy.
        </p>
        <button onClick={() => navigate("/cars")} className="px-10 py-4 bg-white text-blue-700 rounded-full font-semibold hover:scale-105 transition">
          Get Started
        </button>
      </section>

    </div>
  );
}
