import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTachometerAlt, FaExchangeAlt, FaBell, FaFolderOpen,
  FaShieldAlt, FaUserTie, FaIdCard, FaClipboardCheck, FaFileAlt, FaSignOutAlt
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const COLORS = {
  void: "#0a0219",      
  electric: "#d3309a",  
  glow: "#a730d3",      
  textMuted: "#b4abbb",
  glass: "rgba(255, 255, 255, 0.03)"
};

const SidebarPath = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke={COLORS.electric}
    strokeLinecap="round"
    {...props}
  />
);

export default function Sidebar({ collapsed, setCollapsed }) {
  const toggleSidebar = () => setCollapsed(!collapsed);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out of Fraud Shield?")) {
      try {
        await axios.post("https://localhost:44372/api/Auth/logout");
        localStorage.removeItem("token"); 
        sessionStorage.clear();
        navigate("/login"); 
      } catch (err) {
        console.error("Logout failed:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      style={styles.sidebarContainer}
    >
      {/* TOP SECTION: LOGO + TOGGLE */}
      <div style={styles.header}>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={styles.logoWrapper}
            >
              <span style={styles.logoIcon}>🛡️</span>
              <h5 style={styles.logoText}>FRAUDSHIELD</h5>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div 
          onClick={toggleSidebar} 
          style={styles.toggleBtn}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="23" height="23" viewBox="0 0 23 23">
            <SidebarPath
              animate={collapsed ? "closed" : "open"}
              variants={{
                closed: { d: "M 2 2.5 L 20 2.5" },
                open: { d: "M 3 16.5 L 17 2.5" }
              }}
            />
            <SidebarPath
              d="M 2 9.423 L 20 9.423"
              animate={collapsed ? "closed" : "open"}
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 }
              }}
              transition={{ duration: 0.1 }}
            />
            <SidebarPath
              animate={collapsed ? "closed" : "open"}
              variants={{
                closed: { d: "M 2 16.346 L 20 16.346" },
                open: { d: "M 3 2.5 L 17 16.346" }
              }}
            />
          </svg>
        </motion.div>
      </div>

      {/* MIDDLE SECTION: SCROLLABLE MENU */}
      <nav style={styles.navStack}>
        <SidebarMenu collapsed={collapsed} location={location} navigate={navigate} />
      </nav>

      {/* BOTTOM SECTION: USER INFO + LOGOUT */}
      <div style={styles.footer}>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            style={styles.userInfo}
          >
            <div style={styles.avatarSmall}>G</div>
            <div style={{ overflow: "hidden" }}>
              <div style={styles.userName}>Gangothri</div>
              <div style={styles.userRole}>Compliance Officer</div>
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02, backgroundColor: "#ef4444", borderColor: "#ef4444" }}
          whileTap={{ scale: 0.98 }}
          style={styles.logoutBtn}
        >
          <FaSignOutAlt style={{ minWidth: "20px" }} />
          {!collapsed && <span style={{ marginLeft: "10px" }}>Logout</span>}
        </motion.button>
      </div>
    </motion.div>
  );
}

function SidebarMenu({ collapsed, location, navigate }) {
  const menuItems = [
    { icon: <FaTachometerAlt />, text: "Dashboard", path: "/" },
    { icon: <FaExchangeAlt />, text: "Transactions", path: "/transaction-pattern" },
    { icon: <FaBell />, text: "Alerts", path: "/alerts" },
    { icon: <FaFolderOpen />, text: "Cases", path: "/cases" },
    { icon: <FaShieldAlt />, text: "Watchlist", path: "/watchlist" },
    { icon: <FaUserTie />, text: "KYC Verification", path: "/kyc" },
    { icon: <FaIdCard />, text: "Notification", path: "/notification" },
    { icon: <FaClipboardCheck />, text: "Control Checklist", path: "/control-checklist" },
    { icon: <FaFileAlt />, text: "Regulatory Report", path: "/regulatory-report" },
  ];

  return (
    <>
      {menuItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <motion.div
            key={index}
            onClick={() => navigate(item.path)}
            whileHover={{ x: 5, backgroundColor: "rgba(211, 48, 154, 0.1)" }}
            style={{
              ...styles.menuItem,
              color: isActive ? COLORS.electric : "white",
              borderLeft: isActive ? `4px solid ${COLORS.electric}` : "4px solid transparent",
              background: isActive ? "rgba(211, 48, 154, 0.05)" : "transparent",
            }}
          >
            <div style={styles.iconWrapper}>{item.icon}</div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  style={styles.menuText}
                >
                  {item.text}
                </motion.span>
              )}
            </AnimatePresence>
            {isActive && <div style={styles.activeGlow} />}
          </motion.div>
        );
      })}
    </>
  );
}

const styles = {
  sidebarContainer: {
    height: "100vh",
    background: COLORS.void,
    color: "white",
    position: "fixed",
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    boxShadow: "10px 0 30px rgba(0,0,0,0.5)",
    borderRight: "1px solid rgba(255,255,255,0.05)",
    zIndex: 1000,
    overflow: "hidden"
  },
  header: {
    padding: "25px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    flexShrink: 0
  },
  logoWrapper: { display: "flex", alignItems: "center", gap: "10px" },
  logoIcon: { fontSize: "20px" },
  logoText: { 
    margin: 0, 
    fontSize: "1rem", 
    letterSpacing: "2px", 
    fontWeight: "900",
    color: COLORS.electric 
  },
  toggleBtn: { 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center"
  },
  navStack: { 
    padding: "10px 0",
    flexGrow: 1,              // Makes the menu area take up available space
    overflowY: "auto",        // Allows scrolling within the menu
    overflowX: "hidden",
    scrollbarWidth: "none"    // Hides scrollbar for Firefox
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    cursor: "pointer",
    position: "relative",
    whiteSpace: "nowrap"
  },
  iconWrapper: { minWidth: "30px", fontSize: "18px", display: "flex", justifyContent: "center" },
  menuText: { marginLeft: "15px", fontSize: "0.9rem", fontWeight: "500" },
  activeGlow: {
    position: "absolute",
    right: 0,
    width: "50px",
    height: "100%",
    background: `radial-gradient(circle, ${COLORS.electric}22 0%, transparent 70%)`,
    pointerEvents: "none"
  },
  footer: {
    padding: "20px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(0,0,0,0.2)",
    flexShrink: 0,             // Prevents footer from squishing
    marginTop: "auto"          // Keeps it at the bottom
  },
  userInfo: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" },
  avatarSmall: {
    minWidth: "35px",
    height: "35px",
    borderRadius: "50%",
    background: `linear-gradient(45deg, ${COLORS.glow}, ${COLORS.electric})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "0.8rem"
  },
  userName: { fontSize: "0.85rem", fontWeight: "bold" },
  userRole: { fontSize: "0.7rem", color: COLORS.textMuted },
  logoutBtn: {
    width: "100%",
    padding: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.85rem",
    transition: "all 0.3s ease"
  }
};