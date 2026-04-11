// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsBellFill } from "react-icons/bs";
import { FiShield, FiMenu } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const Header = ({ collapsed, setCollapsed, notificationCount = 0 }) => {
  const { currentColors } = useTheme();
  const navigate = useNavigate();

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
    leftSection: {
      display: "flex",
      alignItems: "center",
    },
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
    shieldIcon: {
      fontSize: "2.4rem",
      color: "#b39ddb",
      marginRight: "15px",
    },
    brandTextContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
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
    bellWrapper: {
      position: "relative",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      paddingRight: "15px",
      borderRight: `1px solid ${currentColors.border}`,
      marginRight: "15px",
    },
    bell: {
      fontSize: "1.4rem",
      color: "gold", // ✅ Yellow bell
      marginRight: "8px",
    },
    notificationCount: {
      position: "absolute",
      top: "-5px",
      right: "10px",
      backgroundColor: "#ff0080",
      color: "#fff",
      borderRadius: "50%",
      fontSize: "0.7rem",
      fontWeight: "bold",
      width: "18px",
      height: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    profileContainer: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
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
    name: {
      fontWeight: "500",
      fontSize: "0.95rem",
      color: currentColors.textPrimary,
    },
    navLink: {
      color: currentColors.textSecondary,
      fontWeight: "500",
      fontSize: "0.95rem",
      textDecoration: "none",
      marginRight: "20px",
      transition: "color 0.3s",
    }
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

        {/* Notification Bell with Count */}
        <div
          style={styles.bellWrapper}
          className="ms-3"
          onClick={() => navigate(`/notification/${id}`)}
          title="Notifications"
        >
          <BsBellFill style={styles.bell} />
          {notificationCount > 0 && (
            <div style={styles.notificationCount}>{notificationCount}</div>
          )}
        </div>

        {/* Profile */}
        <div style={styles.profileContainer}>
          <div style={styles.avatar}>L</div>
          <div className="d-flex flex-column d-none d-sm-block">
            <span style={styles.name} className="mb-0">Rutuja Khandagale</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
