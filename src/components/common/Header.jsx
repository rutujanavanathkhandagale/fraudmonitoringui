// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShield, FiMenu } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import UserProfilePopup from "./UserProfilePopup";
import "../../style/UserProfilePopup.css";

const Header = ({ collapsed, setCollapsed }) => {
  const { currentColors } = useTheme();
  const { user } = useAuth(); // ✅ get logged-in user
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const id = localStorage.getItem("customerId") || localStorage.getItem("userId");

  const toggleSidebar = () => {
    if (setCollapsed) setCollapsed(!collapsed);
  };

  const styles = {
    headerContainer: {
      backgroundColor: currentColors.appBg,
      borderBottom: `1px solid ${currentColors.border}`,
      height: "75px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 1050,
      transition: "background-color 0.4s ease",
    },
    leftSection: { display: "flex", alignItems: "center" },
    hamburger: {
      fontSize: "24px",
      color: "#ffb3d9",
      cursor: "pointer",
      marginRight: "20px",
      transition: "transform 0.3s ease",
    },
    brandLink: {
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      cursor: "pointer",
    },
    shieldIcon: { fontSize: "2.4rem", color: "#b39ddb", marginRight: "15px" },
    brandTextContainer: { display: "flex", flexDirection: "column", justifyContent: "center" },
    brandTitle: {
      margin: 0,
      fontWeight: "bold",
      color: currentColors.textPrimary,
      letterSpacing: "0.5px",
      fontSize: "1.2rem",
    },
    brandSubtitle: {
      color: currentColors.textSecondary,
      fontSize: "0.75rem",
      letterSpacing: "1px",
      fontWeight: "bold",
    },
    profileContainer: { 
      display: "flex", 
      alignItems: "center", 
      cursor: "pointer",
      marginLeft: "15px" // Added margin since the bell is gone
    },
    avatar: {
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #d400ff 0%, #ff0080 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: "1rem",
      marginRight: "10px",
      color: "#fff",
    },
    name: { fontWeight: "500", fontSize: "0.95rem", color: currentColors.textPrimary },
    navLink: {
      color: currentColors.textSecondary,
      fontWeight: "500",
      fontSize: "0.95rem",
      textDecoration: "none",
      marginRight: "20px",
      borderRight: `1px solid ${currentColors.border}`, // Moved the border to the navLink
      paddingRight: "20px",
      transition: "color 0.3s",
    },
  };

  return (
    <header style={styles.headerContainer}>
      {/* LEFT SIDE */}
      <div style={styles.leftSection}>
        <FiMenu
          style={styles.hamburger}
          onClick={toggleSidebar}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <Link to="/" style={styles.brandLink}>
          <FiShield style={styles.shieldIcon} />
          <div style={styles.brandTextContainer} className="d-none d-sm-flex">
            <h4 style={styles.brandTitle}>FraudShield</h4>
            <span style={styles.brandSubtitle}>
              REAL-TIME AML & FRAUD MONITORING
            </span>
          </div>
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="d-flex align-items-center">
        <nav className="d-none d-md-flex">
          <Link to="/about" style={styles.navLink}>About</Link>
        </nav>

        {/* Profile */}
        <div style={styles.profileContainer} onClick={() => setShowProfile(true)}>
          <div style={styles.avatar}>
            {/* FIX: Changed fallback character from "U" to "L" */}
            {user?.fullName?.charAt(0)?.toUpperCase() || "L"}
          </div>
          <div className="d-flex flex-column d-none d-sm-block">
            <span style={styles.name} className="mb-0">
              {user?.fullName || "Litika Gaikwad"}
            </span>
          </div>
        </div>
      </div>

      {showProfile && (
        <UserProfilePopup user={user} onClose={() => setShowProfile(false)} />
      )}
    </header>
  );
};

export default Header;