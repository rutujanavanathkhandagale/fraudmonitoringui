import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiHome, FiEdit, FiSettings, FiLogOut, FiShield } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Sidebar = ({ collapsed }) => {
  const { logout } = useAuth();
  const { currentColors, actualTheme } = useTheme();

  // 👇 Toggle body class so .main-content CSS applies globally
  useEffect(() => {
    document.body.classList.toggle("sidebar-collapsed", collapsed);
    document.body.classList.toggle("sidebar-expanded", !collapsed);
  }, [collapsed]);

  const sidebarStyles = {
    width: collapsed ? "80px" : "260px",
    height: "calc(100vh - 75px)",
    background: currentColors.mainGradient,
    color: currentColors.textPrimary,
    borderRight: `1px solid ${currentColors.border}`,
    position: "fixed",
    top: "75px",
    left: 0,
    zIndex: 999,
    transition: "width 0.4s ease",
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  return (
    <aside className="shadow" style={sidebarStyles}>
      <div style={{ paddingTop: "20px" }}>
        <SidebarMenu collapsed={collapsed} />
      </div>

      <div style={{ paddingBottom: "20px" }}>
        <hr className="mx-3" style={{ borderTop: `1px solid ${currentColors.border}` }} />
        <MenuItem icon={<FiSettings />} text="Settings" path="/settings" collapsed={collapsed} />

        {/* --- EXPLICIT LOGGED IN STATUS BOX --- */}
        <div
          title="Logged: Fraud Investigator"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "10px 0" : "10px 15px",
            margin: collapsed ? "15px auto" : "15px",
            width: collapsed ? "50px" : "auto",
            backgroundColor: actualTheme === 'dark' ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
            border: `1px solid ${currentColors.border}`,
            borderRadius: "8px",
            transition: "all 0.3s ease",
            overflow: "hidden"
          }}
        >
          {/* Icon with Green Online Dot */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", flexShrink: 0 }}>
            <FiShield size={20} color="#d400ff" />
            <span style={{
              position: "absolute",
              bottom: "-2px",
              right: "-4px",
              width: "10px",
              height: "10px",
              backgroundColor: "#10b981", // Active/Online Green
              borderRadius: "50%",
              border: `2px solid ${actualTheme === 'dark' ? '#1e1e2d' : '#ffffff'}`
            }}></span>
          </div>

          {/* Text: Logged: Fraud Investigator */}
          <div
            style={{
              marginLeft: collapsed ? "0px" : "12px",
              opacity: collapsed ? 0 : 1,
              width: collapsed ? "0px" : "auto",
              transition: "all 0.4s ease",
              whiteSpace: "nowrap",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <span style={{ fontSize: "0.65rem", color: currentColors.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Logged:
            </span>
            <span style={{ fontWeight: "bold", fontSize: "0.80rem", color: currentColors.textPrimary }}>
              Fraud Investigator
            </span>
          </div>
        </div>
        {/* ---------------------------------- */}

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
            color: "#ef4444", 
            fontWeight: "bold",
            transition: "all 0.3s ease",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
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
    </aside>
  );
};

const SidebarMenu = ({ collapsed }) => {
  const { id: paramId } = useParams();
  const id = paramId || localStorage.getItem("customerId") || localStorage.getItem("userId");

  const menuItems = [
    { icon: <FiHome />, text: "Dashboard", path: `/Idashboard`, collapsed },
    { icon: <FiEdit />, text: "Transaction", path: "/Transaction", collapsed },
    { icon: <FiShield />, text: "RiskScore", path: `/risk`, collapsed },
  ];

  return (
    <nav>
      {menuItems.map((item, index) => (
        <MenuItem key={index} {...item} />
      ))}
    </nav>
  );
};

const MenuItem = ({ icon, text, collapsed, path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;
  const { currentColors, actualTheme } = useTheme();

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
        color: isActive ? currentColors.textPrimary : currentColors.textSecondary,
        transition: "all 0.3s ease",
        background: isActive
          ? actualTheme === "dark"
            ? "rgba(255, 255, 255, 0.15)"
            : "rgba(0, 0, 0, 0.05)"
          : "transparent",
        borderLeft: isActive && !collapsed ? "4px solid #d400ff" : "4px solid transparent",
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
};

export default Sidebar;