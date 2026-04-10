import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiList, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

 
const Sidebar = ({ collapsed }) => {
  const { logout } = useAuth();
  const { currentColors } = useTheme();
 
  const sidebarStyles = {
    height: "calc(100vh - 75px)", // 75px is roughly your header height
    position: "sticky",           // Keeps it visible while scrolling
    top: "75px",                  // Starts right under the header
    background: currentColors.mainGradient,
    color: currentColors.textPrimary,
    borderRight: `1px solid ${currentColors.border}`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 99,
  };
 
  return (
    <aside className="shadow-sm" style={sidebarStyles}>
     
      {/* TOP LINKS */}
      <div style={{ paddingTop: "1.5rem", overflowY: "auto", flex: 1, scrollbarWidth: 'none' }}>
        <SidebarMenu collapsed={collapsed} />
      </div>
 
      {/* BOTTOM SETTINGS & LOGOUT */}
      <div style={{
        paddingBottom: "1.5rem",
        borderTop: `1px solid ${currentColors.border}`,
        backgroundColor: "rgba(0,0,0,0.05)"
      }}>
        <MenuItem icon={<FiSettings />} text="Settings" path="/settings" collapsed={collapsed} />
       
        <div onClick={logout} style={{
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: "0.8rem 1.2rem",
          margin: "0.5rem 1rem",
          borderRadius: "10px",
          cursor: "pointer",
          color: "#ff0080",
          fontWeight: "bold",
          transition: "0.3s",
        }}>
          <FiLogOut size={20} />
          {!collapsed && <span style={{ marginLeft: "12px" }}>Logout System</span>}
        </div>
      </div>
    </aside>
  );
};
 
const MenuItem = ({ icon, text, collapsed, path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;
  const { currentColors, actualTheme } = useTheme();
 
  return (
    <div onClick={() => navigate(path)} style={{
      display: "flex", alignItems: "center",
      justifyContent: collapsed ? "center" : "flex-start",
      padding: "0.8rem 1.2rem",
      margin: "0.4rem 1rem",
      borderRadius: "10px",
      cursor: "pointer",
      color: isActive ? currentColors.textPrimary : currentColors.textSecondary,
      background: isActive ? (actualTheme === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)") : "transparent",
      borderLeft: isActive && !collapsed ? `4px solid #d400ff` : "4px solid transparent",
      transition: "0.3s"
    }}>
      <span style={{ fontSize: "1.3em" }}>{icon}</span>
      {!collapsed && <span style={{ marginLeft: "12px", fontWeight: isActive ? "600" : "400", whiteSpace: "nowrap" }}>{text}</span>}
    </div>
  );
};
 
const SidebarMenu = ({ collapsed }) => {
  const menuItems = [
    { icon: <FiHome />, text: "Dashboard", path: "/dashboard" },
    { icon: <FiList />, text: "Transactions", path: "/transactions" },
    { icon: <FiBarChart2 />, text: "Risk Scoring", path: "/risk" },
  ];
  return (
    <nav>
      {menuItems.map((item, index) => (
        <MenuItem key={index} {...item} collapsed={collapsed} />
      ))}
    </nav>
  );
};
 
export default Sidebar;