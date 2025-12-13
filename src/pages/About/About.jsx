import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaCarSide,
  FaUsers,
  FaShieldAlt,
  FaHandshake,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const pageRef = useRef(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".about-reveal").forEach((el) => {
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
        <div className="max-w-7xl mx-auto px-6 py-28 text-center">
          <h1 className="about-reveal text-5xl md:text-6xl font-bold">
            About <span className="text-blue-400">CarDealer</span>
          </h1>
          <p className="about-reveal mt-6 max-w-2xl mx-auto text-lg opacity-90">
            Building trust, transparency, and confidence in car buying.
          </p>
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="about-reveal text-4xl font-bold mb-6">
            Our Story
          </h2>
          <p className="about-reveal text-gray-600 text-lg leading-relaxed">
            CarDealer was created with a simple mission — make buying cars
            transparent, reliable, and stress-free. We connect buyers with
            verified vehicles and trusted sellers, ensuring every deal feels
            confident and fair.
          </p>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="about-reveal bg-white py-16 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["500+", "Cars Listed"],
            ["300+", "Happy Customers"],
            ["10+", "Years Experience"],
            ["24/7", "Customer Support"],
          ].map(([value, label]) => (
            <div key={label}>
              <h3 className="text-3xl font-bold text-blue-600">{value}</h3>
              <p className="text-gray-600 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="about-reveal text-4xl font-bold text-center mb-16">
          What We Stand For
        </h2>

        <div className="grid md:grid-cols-4 gap-10">
          {[
            [FaShieldAlt, "Trust", "Verified & transparent listings"],
            [FaUsers, "Customer First", "Buyers always come first"],
            [FaCarSide, "Quality", "Only inspected vehicles"],
            [FaHandshake, "Integrity", "Honest pricing & deals"],
          ].map(([Icon, title, desc]) => (
            <div
              key={title}
              className="about-reveal bg-white rounded-2xl p-8 shadow hover:shadow-xl transition text-center"
            >
              <Icon className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-gray-600 mt-2 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="about-reveal bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-24 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to find your next car?
        </h2>
        <p className="opacity-90 mb-8">
          Join hundreds of happy customers who trust CarDealer.
        </p>
        <button onClick={() => navigate("/cars")} className="px-10 py-4 bg-white text-blue-700 rounded-full font-semibold hover:scale-105 transition">
          Browse Cars
        </button>
      </section>

    </div>
  );
}
