// src/apps/AdminApp.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../admin/Dashboard/Dashboard";
import Cars from "../admin/Cars/Cars";
import Inquiries from "../admin/Inquiries/Inquiries";
import Users from "../admin/Users/Users";
import SoldHistory from "../admin/SoldHistory/SoldHistory";
import AdminLogin from "../admin/Login/Login";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";

export default function AdminApp() {
  return (
    <Routes>
      {/* login route is outside the AdminLayout because we don't want the sider/header */}
      <Route path="login" element={<AdminLogin />} />

      {/* all admin pages wrapped with layout */}
      <Route
        path="/"
        element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="cars" element={<Cars />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="users" element={<Users />} />
        <Route path="sold-history" element={<SoldHistory />} />
      </Route>
    </Routes>
  );
}
