import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiList,
  FiBarChart2,
  FiBell,
  FiFileText,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext"; 
 
/**
 * Main Sidebar Component
 */
const Sidebar = ({ collapsed }) => {
  const { logout } = useAuth();
  const { currentColors } = useTheme(); // <-- GET DYNAMIC COLORS
 
  const sidebarStyles = {
    width: collapsed ? "80px" : "260px",
    height: "calc(100vh - 75px)",
    background: currentColors.mainGradient, // <-- Dynamic Gradient
    color: currentColors.textPrimary, // <-- Dynamic Text
    borderRight: `1px solid ${currentColors.border}`, // <-- Border for light mode
    position: "fixed",
    top: "75px",
    left: 0,
    zIndex: 999,
    transition: "width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), background 0.4s ease",
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };
 
  return (
    <aside className="shadow" style={sidebarStyles}>
     
      {/* TOP SECTION */}
      <div style={{ paddingTop: "20px" }}>
        <SidebarMenu collapsed={collapsed} />
      </div>
 
      {/* BOTTOM SECTION */}
      <div style={{ paddingBottom: "20px" }}>
        <hr className="mx-3" style={{ borderTop: `1px solid ${currentColors.border}` }} />
       
        <MenuItem icon={<FiSettings />} text="Settings" path="/settings" collapsed={collapsed} />
 
        {/* User Info */}
        <div
          style={{
            padding: collapsed ? "0px" : "10px 20px",
            opacity: collapsed ? 0 : 0.9,
            maxHeight: collapsed ? "0px" : "60px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            transition: "all 0.4s ease"
          }}
        >
          <small style={{ color: currentColors.textSecondary }}>Logged in as:</small><br />
          <strong style={{ fontSize: '0.9rem', color: currentColors.textPrimary }}>Fraud Investigator</strong>
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
            color: "#d400ff",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(212, 0, 255, 0.15)";
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
    </aside>
  );
};
 
/**
 * Menu List Wrapper
 */
const SidebarMenu = ({ collapsed }) => {
  const menuItems = [
    { icon: <FiHome />, text: "Dashboard", path: "/Dashboard" },
    { icon: <FiList />, text: "Scenarios", path: "/scenarios" },
    { icon: <FiBarChart2 />, text: "Detection Rules", path: "/detection-rules" },
    // { icon: <FiBell />, text: "Alerts", path: "/alerts" },
    // { icon: <FiBarChart2 />, text: "Analytics", path: "/analytics" },
  //   { icon: <FiFileText />, text: "Reports", path: "/reports" },
  ];
 
  return (
    <nav>
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          icon={item.icon}
          text={item.text}
          path={item.path}
          collapsed={collapsed}
        />
      ))}
    </nav>
  );
};
 
/**
 * Reusable Individual Menu Item
 */
const MenuItem = ({ icon, text, collapsed, path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;
 
  // Need context here too to change icon/text color
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
        color: isActive ? currentColors.textPrimary : currentColors.textSecondary, // Dynamic Active Color
        transition: "all 0.3s ease",
        background: isActive ? (actualTheme === 'dark' ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.05)") : "transparent",
        borderLeft: isActive && !collapsed ? "4px solid #d400ff" : "4px solid transparent",
        overflow: "hidden"
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = actualTheme === 'dark' ? "rgba(255, 255, 255, 0.05)" : "rgba(0,0,0,0.03)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
        }
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