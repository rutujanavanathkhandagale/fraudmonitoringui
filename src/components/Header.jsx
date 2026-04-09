import React from "react";
import { Link } from "react-router-dom";
import { BsBellFill } from "react-icons/bs";
import { FiShield } from "react-icons/fi";

const Header = () => {
  const styles = {
    headerContainer: {
      backgroundColor: "rgba(18, 18, 18, 0.8)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      height: "70px",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
    },
    profileContainer: {
      display: "flex",
      alignItems: "center",
      marginLeft: "20px",
      color: "#fff",
      cursor: "pointer",
    },
    avatar: {
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #8e2de2 0%, #ff0080 100%)",
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
      marginRight: "15px",
    },
    bellWrapper: {
      position: "relative",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    },
    bell: {
      fontSize: "1.2rem",
      color: "#d1b3ff",
      marginRight: "8px",
    },
    notificationDot: {
      position: "absolute",
      top: "-2px",
      right: "5px",
      width: "8px",
      height: "8px",
      backgroundColor: "#ff0080",
      borderRadius: "50%",
    },
    navLink: {
      color: "#d1b3ff",
      fontWeight: "500",
      fontSize: "0.95rem",
      textDecoration: "none",
      marginRight: "20px",
      transition: "color 0.3s",
    },
  };

  return (
    <header
      style={styles.headerContainer}
      className="w-100 d-flex justify-content-between"
    >
      {/* Mobile-only Logo */}
      <div className="d-flex align-items-center d-md-none">
        <FiShield
          className="fs-3"
          style={{ color: "#ffb3d9", marginRight: "10px" }}
        />
        <span className="fs-5 fw-bold text-white">FraudShield</span>
      </div>

      {/* Spacer for Desktop Layout */}
      <div className="d-none d-md-block"></div>

      {/* Right side navigation and profile */}
      <div className="d-flex align-items-center">
        <nav className="d-none d-md-flex">
          <Link to="/about" style={styles.navLink}>
            About
          </Link>
          <Link to="/contact" style={styles.navLink}>
            Contact Us
          </Link>
        </nav>

        {/* Notification section */}
        <div
          style={styles.bellWrapper}
          className="ms-3 pe-3 border-end border-secondary"
        >
          <BsBellFill style={styles.bell} />
          <div style={styles.notificationDot}></div>
        </div>

        {/* Profile section */}
        <div style={styles.profileContainer}>
          <div style={styles.avatar}>S</div>
          <div className="d-flex flex-column d-none d-sm-block">
            <span style={styles.name} className="mb-0">
              Svarupa Kadam
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
