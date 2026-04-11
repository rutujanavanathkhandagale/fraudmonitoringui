import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome, FiActivity, FiBell, FiFolder, FiShield, 
  FiUsers, FiCheckSquare, FiFileText, FiSettings, 
  FiLogOut, FiMenu, FiMail
} from "react-icons/fi";
import axios from "axios";

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    if (setCollapsed) setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await axios.post("https://localhost:44372/api/Auth/logout");
        localStorage.removeItem("token");
        sessionStorage.clear();
        navigate("/login");
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  return (
    <div
      style={{
        width: collapsed ? "80px" : "260px",
        height: "100vh",
        background: "linear-gradient(180deg, #2e003e 0%, #35174fff 50%, #38041eff 100%)",
        color: "white",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1200, // Higher than navbar to stay on top
        transition: "width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "4px 0 15px rgba(0,0,0,0.3)"
      }}
    >
      <div>
        <div style={{
          padding: collapsed ? "20px 0" : "20px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
        }}>
          {!collapsed && (
            <Link to="/" style={{ textDecoration: "none", color: "white", display: "flex", alignItems: "center" }}>
              <FiShield style={{ fontSize: "24px", color: "#ffb3d9", marginRight: "10px" }} />
              <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>FraudShield</span>
            </Link>
          )}
          <FiMenu
            onClick={toggleSidebar}
            style={{ cursor: "pointer", fontSize: "24px", color: "#ffb3d9" }}
          />
        </div>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "0 15px 15px" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <MenuItem icon={<FiHome />} text="Dashboard" path="/" collapsed={collapsed} />
          <MenuItem icon={<FiActivity />} text="Transactions" path="/transaction-pattern" collapsed={collapsed} />
          <MenuItem icon={<FiShield />} text="Watchlist" path="/watchlist" collapsed={collapsed} />
          <MenuItem icon={<FiUsers />} text="KYC Verification" path="/kyc" collapsed={collapsed} />
          <MenuItem icon={<FiMail />} text="Notification" path="/notification" collapsed={collapsed} />
          <MenuItem icon={<FiCheckSquare />} text="Control Checklist" path="/control-checklist" collapsed={collapsed} />
          <MenuItem icon={<FiFileText />} text="Regulatory Report" path="/regulatory-report" collapsed={collapsed} />
        </div>
      </div>

      <div style={{ paddingBottom: "20px" }}>
        <MenuItem icon={<FiSettings />} text="Settings" path="/settings" collapsed={collapsed} />
        <div onClick={handleLogout} style={{
          display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start",
          padding: "12px 15px", margin: "5px 15px", cursor: "pointer", color: "#ffb3d9", fontWeight: "bold"
        }}>
          <FiLogOut style={{ fontSize: "1.2rem" }} />
          {!collapsed && <span style={{ marginLeft: "12px" }}>Logout</span>}
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, text, collapsed, path }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <div
      onClick={() => navigate(path)}
      style={{
        display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start",
        padding: "12px 15px", margin: collapsed ? "5px auto" : "5px 15px",
        width: collapsed ? "50px" : "auto", borderRadius: "8px", cursor: "pointer",
        background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
        transition: "all 0.3s ease", color: "white"
      }}
    >
      <span style={{ fontSize: "1.2rem", display: "flex" }}>{icon}</span>
      {!collapsed && <span style={{ marginLeft: "12px", whiteSpace: "nowrap" }}>{text}</span>}
    </div>
  );
}