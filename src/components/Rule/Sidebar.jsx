import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiList,
  FiShield,
  FiBarChart2,
  FiBell,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiMenu
} from 'react-icons/fi';
import { useAuth } from "../../context/AuthContext";
export default function Sidebar({ collapsed, setCollapsed }) {
  const toggleSidebar = () => {
    if (setCollapsed) setCollapsed(!collapsed);
  };

  const { user, logout } = useAuth();

  return (
    <div
      className="shadow"
      style={{
        width: collapsed ? "80px" : "260px",
        height: "100vh",
        background: "linear-gradient(180deg, #2e003e 0%, #35174fff 50%, #38041eff 100%)",
        color: "white",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999,
        transition: "width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* TOP SECTION */}
      <div>
        <div
          style={{
            padding: collapsed ? "20px 0" : "20px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            transition: "all 0.4s ease"
          }}
        >
          <Link
            to="/Dashboard"
            className="text-white text-decoration-none d-flex align-items-center"
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: collapsed ? "0px" : "200px",
              opacity: collapsed ? 0 : 1,
              transition: "all 0.4s ease"
            }}
          >
            <FiShield className="fs-3" style={{ color: "#ffb3d9", marginRight: "10px" }} />
            <span className="fs-4 fw-bold">FraudShield</span>
          </Link>

          <FiMenu
            onClick={toggleSidebar}
            style={{
              cursor: "pointer",
              fontSize: "24px",
              minWidth: "24px",
              color: "#ffb3d9",
              transition: "transform 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          />
        </div>

        <hr className="border-light mx-3 mt-0 mb-3" style={{ opacity: 0.3 }} />

        <SidebarMenu collapsed={collapsed} />
      </div>

      {/* BOTTOM SECTION */}
      <div style={{ paddingBottom: "20px" }}>
        <hr className="border-light mx-3" style={{ opacity: 0.3 }} />

        <MenuItem icon={<FiSettings />} text="Settings" path="/settings" collapsed={collapsed} />

        {/* User Info */}
        <div
          className="text-light"
          style={{
            padding: collapsed ? "0px" : "10px 20px",
            opacity: collapsed ? 0 : 0.9,
            maxHeight: collapsed ? "0px" : "60px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            transition: "all 0.4s ease"
          }}
        >
          <small>Logged in as:</small><br />
          <strong>{user?.name || "Guest"}</strong>
        </div>

        {/* Logout Button */}
        <div
          onClick={logout}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: "12px 15px",
            margin: collapsed ? "5px auto" : "5px 15px",
            width: collapsed ? "50px" : "auto",
            borderRadius: "8px",
            cursor: "pointer",
            color: "#ffb3d9",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span style={{ fontSize: "1.2rem", minWidth: "24px", display: "flex", justifyContent: "center" }}>
            <FiLogOut />
          </span>
          <span
            style={{
              whiteSpace: "nowrap",
              maxWidth: collapsed ? "0px" : "100px",
              opacity: collapsed ? 0 : 1,
              marginLeft: collapsed ? "0px" : "12px",
              transition: "all 0.4s ease"
            }}
          >
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- MENU LIST ---------------- */
function SidebarMenu({ collapsed }) {
  return (
    <div>
      <MenuItem icon={<FiHome />} text="Dashboard" path="/Dashboard" collapsed={collapsed} />
      <MenuItem icon={<FiList />} text="Scenarios" path="/scenarios" collapsed={collapsed} />
      <MenuItem icon={<FiShield />} text="Detection Rules" path="/detection-rules" collapsed={collapsed} />
      
    </div>
  );
}

/* ---------------- SINGLE MENU ITEM ---------------- */
function MenuItem({ icon, text, collapsed, path }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <div
      onClick={() => navigate(path)}
      title={collapsed ? text : ""}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        padding: "12px 15px",
        margin: collapsed ? "5px auto" : "5px 15px",
        width: collapsed ? "50px" : "auto",
        borderRadius: "8px",
        cursor: "pointer",
        color: "white",
        transition: "all 0.3s ease",
        background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
        borderLeft: isActive && !collapsed ? "4px solid #fff" : "4px solid transparent",
        overflow: "hidden"
      }}
    >
      <span style={{ fontSize: "1.2rem", minWidth: "24px", display: "flex", justifyContent: "center" }}>
        {icon}
      </span>
      <span
        style={{
          whiteSpace: "nowrap",
          maxWidth: collapsed ? "0px" : "200px",
          opacity: collapsed ? 0 : 1,
          marginLeft: collapsed ? "0px" : "12px",
          fontWeight: isActive ? "bold" : "normal",
          transition: "all 0.4s ease"
        }}
      >
        {text}
      </span>
    </div>
  );
}
