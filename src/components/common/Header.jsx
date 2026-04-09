import React from "react";
import { Link } from "react-router-dom";
import { BsBellFill } from "react-icons/bs";
import { FiShield, FiMenu } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
 
const Header = ({ collapsed, setCollapsed }) => {
  const { currentColors } = useTheme(); // <-- GET DYNAMIC COLORS
 
  const toggleSidebar = () => {
    if (setCollapsed) setCollapsed(!collapsed);
  };
 
  const styles = {
    headerContainer: {
      backgroundColor: currentColors.appBg, // <-- Dynamic Background
      borderBottom: `1px solid ${currentColors.border}`, // <-- Dynamic Border
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
      transition: "background-color 0.4s ease", // Smooth transition
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
      color: currentColors.textPrimary, // <-- Dynamic Text
      letterSpacing: "0.5px",
      fontSize: "1.2rem",
    },
    brandSubtitle: {
      color: currentColors.textSecondary, // <-- Dynamic Text
      fontSize: "0.75rem",
      letterSpacing: "1px",
      fontWeight: "bold",
    },
    profileContainer: {
      display: "flex",
      alignItems: "center",
      marginLeft: "20px",
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
      color: "#fff", // Avatar letter stays white
    },
    name: {
      fontWeight: "500",
      fontSize: "0.95rem",
      marginRight: "15px",
      color: currentColors.textPrimary, // <-- Dynamic Text
    },
    bellWrapper: {
      position: "relative",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      paddingRight: "15px",
      borderRight: `1px solid ${currentColors.border}` // <-- Dynamic Border
    },
    bell: {
      fontSize: "1.2rem",
      color: currentColors.textSecondary, // <-- Dynamic Text
      marginRight: "8px",
    },
    notificationDot: {
      position: "absolute",
      top: "-2px",
      right: "20px",
      width: "8px",
      height: "8px",
      backgroundColor: "#ff0080",
      borderRadius: "50%",
    },
    navLink: {
      color: currentColors.textSecondary, // <-- Dynamic Text
      fontWeight: "500",
      fontSize: "0.95rem",
      textDecoration: "none",
      marginRight: "20px",
      transition: "color 0.3s",
    }
  };
 
  return (
    <header style={styles.headerContainer}>
     
      {/* LEFT SIDE: Hamburger Menu + Clickable Brand Logo */}
      <div style={styles.leftSection}>
        <FiMenu
          style={styles.hamburger}
          onClick={toggleSidebar}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        />
       
        <Link to="/" style={styles.brandLink}>
          <FiShield style={styles.shieldIcon} />
          <div style={styles.brandTextContainer} className="d-none d-sm-flex">
            <h4 style={styles.brandTitle}>FraudGuard Bank</h4>
            <span style={styles.brandSubtitle}>REAL-TIME AML & FRAUD MONITORING</span>
          </div>
        </Link>
      </div>
 
      {/* RIGHT SIDE: Navigation and Profile */}
      <div className="d-flex align-items-center">
        <nav className="d-none d-md-flex">
          <Link to="/about" style={styles.navLink}>About</Link>
          <Link to="/contact" style={styles.navLink}>Contact Us</Link>
        </nav>
 
        <div style={styles.bellWrapper} className="ms-3">
          <BsBellFill style={styles.bell} />
          <div style={styles.notificationDot}></div>
        </div>
 
        <div style={styles.profileContainer}>
          <div style={styles.avatar}>L</div>
          <div className="d-flex flex-column d-none d-sm-block">
            <span style={styles.name} className="mb-0">Litika Gaikwad</span>
          </div>
        </div>
      </div>
    </header>
  );
};
 
export default Header;