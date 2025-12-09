import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../admin/Dashboard";
import Users from "../admin/Users";

export default function AdminApp() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
      </Routes>
    </AdminLayout>
  );
}
