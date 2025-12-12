// src/layouts/AdminLayout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Layout, Menu, Tooltip } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiTruck,
  FiUsers,
  FiMessageSquare,
  FiArchive,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
} from "react-icons/fi";
import "./AdminLayout.css";

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [screenCollapsed, setScreenCollapsed] = useState(false);

  // =========================
  // AUTH GUARD
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("adminUser");
    const adminFlag = localStorage.getItem("adminAuth");

    if (!token || !user || !adminFlag) {
      navigate("/admin/login", { replace: true });
      return;
    }

    try {
      const parsed = JSON.parse(user);
      if (!parsed || (parsed.role || "").toLowerCase() !== "admin") {
        navigate("/admin/login", { replace: true });
      }
    } catch (err) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  // =========================
  // SIDEBAR MENU
  // =========================
  const items = useMemo(
    () => [
      { key: "/admin", icon: <FiHome />, label: "Dashboard" },
      { key: "/admin/cars", icon: <FiTruck />, label: "Cars" },
      { key: "/admin/inquiries", icon: <FiMessageSquare />, label: "Inquiries" },
      { key: "/admin/users", icon: <FiUsers />, label: "Users" },
      { key: "/admin/sold-history", icon: <FiArchive />, label: "Sold Car History" },
    ],
    []
  );

  // Auto collapse on small screens
  useEffect(() => {
    const onResize = () => {
      const small = window.innerWidth < 992;
      setScreenCollapsed(small);
      setCollapsed(small);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Selected menu logic
  const selectedKey = useMemo(() => {
    const path = location.pathname.split("?")[0].replace(/\/+$/, "");
    if (!path.startsWith("/admin")) return "";
    let match = "";
    for (const it of items) {
      if (path === it.key || path.startsWith(it.key + "/")) {
        if (it.key.length > match.length) match = it.key;
      }
    }
    return match || "/admin";
  }, [location.pathname, items]);

  const menuItems = useMemo(
    () =>
      items.map((it) => ({
        key: it.key,
        icon: it.icon,
        label: collapsed ? (
          <Tooltip placement="right" title={it.label}>
            <span>{it.label}</span>
          </Tooltip>
        ) : (
          it.label
        ),
      })),
    [items, collapsed]
  );

  const handleMenuClick = ({ key }) => navigate(key);

  const showOverlay = screenCollapsed && !collapsed;

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminAuth");
    navigate("/admin/login", { replace: true });
  };

  // =========================
  // RENDER LAYOUT
  // =========================
  return (
    <div className={`admin-root ${collapsed ? "is-collapsed" : ""} ${screenCollapsed ? "is-mobile" : ""}`}>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          width={220}
          collapsedWidth={72}
          breakpoint="lg"
          onBreakpoint={(broken) => {
            setCollapsed(broken);
            setScreenCollapsed(broken);
          }}
          className="admin-sider"
          aria-expanded={!collapsed} 
        >
          <div className="sider-header">
            <div className="brand">{!collapsed && <span className="brand-text">Admin</span>}</div>

            <button
              className="sider-toggle"
              onClick={() => setCollapsed((c) => !c)}
              aria-label="Toggle sidebar"
            >
              {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          </div>

          <div className="sider-menu">
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={handleMenuClick}
              items={menuItems}
              className="admin-menu"
            />
          </div>

          <div className="sider-footer">
            {!collapsed ? <span className="footer-text">v1.0 • Admin</span> : <span className="footer-dot" />}
          </div>
        </Sider>

        {/* Mobile Overlay */}
        {showOverlay && <div className="sider-overlay" onClick={() => setCollapsed(true)} />}

        <Layout className="main-layout">
          <Header className="admin-header">
            <div className="header-left">
              {screenCollapsed && (
                <button className="mobile-open" onClick={() => setCollapsed(false)}>
                  <FiMenu />
                </button>
              )}
              <h1 className="header-title">Admin Panel</h1>
            </div>

            <div className="header-right">
              <span className="user-hello">Hello, Admin</span>

              <button className="logout-btn" onClick={handleLogout} title="Logout">
                <FiLogOut className="logout-icon" />
              </button>
            </div>
          </Header>

          <Content className="admin-content">
            <div className="content-card">
              <Outlet />  {/* ✅ FIX: renders Dashboard, Cars, Users, etc */}
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
