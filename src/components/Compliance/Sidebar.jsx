import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiHome, FiActivity, FiShield, 
  FiUsers, FiCheckSquare, FiFileText, FiSettings, 
  FiLogOut, FiMail
} from "react-icons/fi";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext"; 

export default function Sidebar({ collapsed }) {
  const navigate = useNavigate();
  const { currentColors, actualTheme } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const accentColor = actualTheme === 'frost' ? "#23a6d5" : "#ffb3d9";

  const handleLogout = async () => {
    try {
      await axios.post("https://localhost:7181/api/Auth/logout");
      localStorage.removeItem("token");
      sessionStorage.clear();
      navigate("/login");
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <>
      <div
        style={{
          width: collapsed ? "80px" : "260px",
          height: "calc(100vh - 75px)", 
          background: actualTheme === 'light' 
              ? "#ffffff" 
              : actualTheme === 'frost' 
                  ? "rgba(255, 255, 255, 0.4)" 
                  : "linear-gradient(180deg, #2e003e 0%, #1a0620 100%)",
          color: currentColors.textPrimary,
          position: "fixed",
          top: "75px", 
          left: 0,
          zIndex: 1200, 
          transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "4px 0 15px rgba(0,0,0,0.05)",
          backdropFilter: actualTheme === 'frost' ? "blur(20px)" : "none",
          borderRight: `1px solid ${currentColors.border}`
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", paddingTop: "5px" }}>
          <MenuItem icon={<FiHome />} text="Dashboard" path="/CDashboard" collapsed={collapsed} accent={accentColor} />
          <MenuItem icon={<FiActivity />} text="Transactions" path="/transaction-pattern" collapsed={collapsed} accent={accentColor} />
          <MenuItem icon={<FiShield />} text="Watchlist" path="/Watchlist" collapsed={collapsed} accent={accentColor} />
          <MenuItem icon={<FiUsers />} text="KYC Verification" path="/kyc" collapsed={collapsed} accent={accentColor} />
          <MenuItem icon={<FiMail />} text="Notification" path="/Notification" collapsed={collapsed} accent={accentColor} />
          <MenuItem icon={<FiCheckSquare />} text="Control Checklist" path="/control-checklist" collapsed={collapsed} accent={accentColor} />
          <MenuItem icon={<FiFileText />} text="Regulatory Report" path="/regulatory-report" collapsed={collapsed} accent={accentColor} />
        </div>

        <div style={{ paddingBottom: "20px" }}>
          <MenuItem icon={<FiSettings />} text="Settings" path="/settings" collapsed={collapsed} accent={accentColor} />
          
          <div 
            onClick={() => setShowLogoutModal(true)} 
            style={{
              display: "flex", 
              alignItems: "center", 
              justifyContent: collapsed ? "center" : "flex-start",
              padding: "12px 15px", 
              margin: "5px 15px", 
              cursor: "pointer", 
              color: accentColor, 
              fontWeight: "bold",
              borderRadius: "8px",
              background: actualTheme === 'light' ? "rgba(0,0,0,0.05)" : "rgba(255, 179, 217, 0.05)", 
              border: `1px solid ${currentColors.border}`,
              transition: "transform 0.2s"
            }}
          >
            <FiLogOut style={{ fontSize: "1.2rem" }} />
            {!collapsed && <span style={{ marginLeft: "12px" }}>Logout</span>}
          </div>
        </div>
      </div>

      {/* --- CUSTOM THEMED LOGOUT MODAL --- */}
      {showLogoutModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999,
          backdropFilter: "blur(5px)"
        }}>
          <div style={{
            background: actualTheme === 'light' ? "#fff" : "#2e003e",
            padding: "30px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            border: `1px solid ${accentColor}`,
            width: "350px",
            color: currentColors.textPrimary
          }}>
            <FiLogOut size={40} color={accentColor} style={{ marginBottom: "15px" }} />
            <h3 style={{ margin: "0 0 10px 0" }}>Confirm Logout</h3>
            <p style={{ opacity: 0.8, marginBottom: "25px" }}>Are you sure you want to log out?</p>
            
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button 
                onClick={() => setShowLogoutModal(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: `1px solid ${currentColors.border}`,
                  background: "transparent",
                  color: currentColors.textPrimary,
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: accentColor,
                  color: "#fff",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MenuItem({ icon, text, collapsed, path, accent }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentColors } = useTheme(); 
  const isActive = location.pathname === path;

  return (
    <div
      onClick={() => navigate(path)}
      style={{
        display: "flex",
        alignItems: "center", 
        justifyContent: collapsed ? "center" : "flex-start",
        padding: "12px 15px", 
        margin: collapsed ? "5px auto" : "5px 15px",
        width: collapsed ? "50px" : "auto", 
        borderRadius: "8px", 
        cursor: "pointer",
        background: isActive ? "rgba(255, 255, 255, 0.15)" : "transparent",
        transition: "all 0.3s ease", 
        color: isActive ? accent : currentColors.textPrimary 
      }}
    >
      <span style={{ fontSize: "1.2rem", display: "flex" }}>{icon}</span>
      {!collapsed && <span style={{ marginLeft: "12px", whiteSpace: "nowrap" }}>{text}</span>}
    </div>
  );
}