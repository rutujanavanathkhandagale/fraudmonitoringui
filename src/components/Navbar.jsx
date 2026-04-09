import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// FraudShield Dark Palette
const COLORS = {
  void: "#0a0219",      // Deepest Black/Purple
  electric: "#d3309a",  // Neon Pink
  glow: "#a730d3",      // Electric Purple
  glass: "rgba(255, 255, 255, 0.03)",
  glassBorder: "rgba(255, 255, 255, 0.1)"
};

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav style={styles.navContainer}>
      {/* LEFT: LOGO SECTION */}
      <div 
        style={styles.logoSection} 
        onClick={() => navigate("/")}
      >
        <div style={styles.logoBox}>
          <div style={styles.logoInner}>🛡️</div>
        </div>
        <div style={styles.brandText}>
          <span style={styles.mainLogo}>FRAUDSHIELD</span>
          <span style={styles.subLogo}>SECURE TERMINAL</span>
        </div>
      </div>

      {/* CENTER: SYSTEM MONITORING STATUS */}
      <div style={styles.centerSection}>
       
      
        
      </div>

      {/* RIGHT: ACTION BUTTONS */}
      <div style={styles.buttonGroup}>
        <motion.button
          whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.08)" }}
          whileTap={{ scale: 0.95 }}
          style={styles.supportBtn}
        >
          Register
        </motion.button>

        <motion.button
          whileHover={{ 
            scale: 1.05, 
            boxShadow: `0 0 20px ${COLORS.electric}66`,
            backgroundColor: COLORS.electric 
          }}
          whileTap={{ scale: 0.95 }}
          style={styles.loginBtn}
          onClick={() => navigate("/login")}
        >
          LOGIN
        </motion.button>
      </div>

      {/* NEON BOTTOM ACCENT LINE */}
      <div style={styles.bottomAccent}></div>
    </nav>
  );
}

const styles = {
  navContainer: {
    height: "75px",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1200,
    background: "rgba(10, 2, 25, 0.85)", // Translucent Void
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 35px",
    color: "white",
    borderBottom: `1px solid ${COLORS.glassBorder}`,
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer"
  },
  logoBox: {
    width: "42px",
    height: "42px",
    background: `linear-gradient(135deg, ${COLORS.electric}, ${COLORS.glow})`,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0 0 15px ${COLORS.electric}55`
  },
  logoInner: { fontSize: "22px" },
  brandText: { display: "flex", flexDirection: "column" },
  mainLogo: { 
    fontWeight: "900", 
    fontSize: "18px", 
    letterSpacing: "3px",
    lineHeight: "1",
    color: "white"
  },
  subLogo: { 
    fontSize: "9px", 
    color: COLORS.electric, 
    fontWeight: "bold",
    letterSpacing: "2px",
    marginTop: "2px"
  },
  centerSection: {
    display: "flex",
    alignItems: "center"
  },
  statusBadge: {
    padding: "6px 16px",
    background: "rgba(34, 197, 94, 0.05)",
    border: "1px solid rgba(34, 197, 94, 0.2)",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "1.5px",
    color: "#4ade80",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  pulseDot: {
    width: "6px",
    height: "6px",
    background: "#4ade80",
    borderRadius: "50%",
    boxShadow: "0 0 10px #4ade80"
  },
  buttonGroup: { display: "flex", gap: "15px" },
  supportBtn: {
    background: "transparent",
    border: `1px solid ${COLORS.glassBorder}`,
    color: "rgba(255,255,255,0.6)",
    padding: "8px 18px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1px",
    cursor: "pointer",
    transition: "0.3s"
  },
  loginBtn: {
    background: COLORS.electric,
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    color: "white",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1.5px",
    cursor: "pointer",
  },
  bottomAccent: {
    position: "absolute",
    bottom: "-1px",
    left: "10%",
    right: "10%",
    height: "1px",
    background: `linear-gradient(90deg, transparent, ${COLORS.electric}, ${COLORS.glow}, transparent)`,
    opacity: 0.6
  }
};

export default Navbar;