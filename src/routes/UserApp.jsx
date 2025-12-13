import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import UserLayout from "../layouts/UserLayout/UserLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Cars from "../pages/Cars/Cars";
import Inquiries from "../pages/Inquiries/Inquiries";

// Auth Pages
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import VerifyOtp from "../pages/Auth/VerifyOtp/VerifyOtp";
import ResetPassword from "../pages/Auth/ResetPassword/ResetPassword";
import ChangePassword from "../pages/Auth/ChangePassword/ChangePassword";
import ForgotPassword from "../pages/Auth/ForgotPassword/ForgotPassword";

export default function UserApp() {

  useEffect(() => {
    localStorage.clear();
    console.log("LocalStorage cleared for user app");
  }, []);

  return (
    <Routes>

      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/inquiries" element={<Inquiries />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

    </Routes>
  );
}
