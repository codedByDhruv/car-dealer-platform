import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaSignOutAlt,
  FaChevronDown,
  FaKey
} from "react-icons/fa";

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isUser = localStorage.getItem("isUser") === "true";
  const user = isUser ? JSON.parse(localStorage.getItem("user")) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isUser");
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    isActive ? "text-blue-600" : "hover:text-blue-600";

  const getInitials = (name = "User") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <header className="bg-white/90 backdrop-blur shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-xl font-bold tracking-tight">
          <Link to="/">CarDealer</Link>
        </h1>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm font-medium">

          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/about" className={navClass}>About</NavLink>
          <NavLink to="/cars" className={navClass}>Cars</NavLink>

          {isUser ? (
            <>
              <NavLink to="/inquiries" className={navClass}>
                Inquiries
              </NavLink>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                    {getInitials(user?.name)}
                  </div>

                  <span className="hidden sm:block">{user?.name}</span>
                  <FaChevronDown className="text-xs" />
                </button>

                {open && (
                  <div
                    className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg overflow-hidden"
                    onMouseLeave={() => setOpen(false)}
                  >
                    {/* Change Password */}
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/change-password");
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <FaKey />
                      Change Password
                    </button>

                    {/* Divider */}
                    <div className="h-px bg-gray-200" />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
