import React from "react";
import { motion } from "framer-motion";

const COLORS = {
  void: "#0a0219",      
  electric: "#d3309a",  
  glow: "#a730d3",      
  textMuted: "#b4abbb",
  glass: "rgba(255, 255, 255, 0.03)",
  glassBorder: "rgba(255, 255, 255, 0.08)"
};

function Footer({ sidebarWidth }) {
  return (
    <motion.div
      initial={false}
      animate={{ left: sidebarWidth }} // Smoothly follows the sidebar expansion
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={styles.footerContainer}
    >
      {/* Decorative Top Glow Line */}
      <div style={styles.glowLine} />

      <div style={styles.content}>
        <div style={styles.leftSection}>
          <div style={styles.brandGroup}>
            <span style={styles.logoIcon}>🛡️</span>
            <h3 style={styles.brandName}>FRAUDSHIELD</h3>
          </div>
          <p style={styles.brandTagline}>
            SECURE TERMINAL | REAL-TIME AML & FRAUD MONITORING
            <br />
            <span style={{ color: COLORS.textMuted, fontSize: "10px" }}>
              V3.2.0 - ENCRYPTED CONNECTION ACTIVE
            </span>
          </p>
        </div>

        <div style={styles.rightSection}>
          <div style={styles.contactItem}>
            <span style={styles.label}>SUPPORT</span>
            <span style={styles.value}>support@fraudshield.com</span>
          </div>
          <div style={styles.contactItem}>
            <span style={styles.label}>SYSTEM HOTLINE</span>
            <span style={styles.value}>+91 98765 43210</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const styles = {
  footerContainer: {
    position: "fixed",
    bottom: 0,
    right: 0,
    height: "90px",
    background: "rgba(10, 2, 25, 0.8)", // Semi-transparent Void
    backdropFilter: "blur(20px)",
    color: "white",
    borderTop: `1px solid ${COLORS.glassBorder}`,
    display: "flex",
    flexDirection: "column",
    zIndex: 900,
    overflow: "hidden"
  },
  glowLine: {
    width: "100%",
    height: "1px",
    background: `linear-gradient(90deg, transparent, ${COLORS.electric}, transparent)`,
    opacity: 0.5
  },
  content: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px"
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  brandGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  logoIcon: {
    fontSize: "18px"
  },
  brandName: {
    margin: 0,
    fontSize: "1.1rem",
    letterSpacing: "3px",
    fontWeight: "900",
    background: `linear-gradient(to right, #fff, ${COLORS.electric})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  brandTagline: {
    margin: 0,
    fontSize: "11px",
    fontWeight: "bold",
    color: COLORS.textMuted,
    letterSpacing: "1px"
  },
  rightSection: {
    display: "flex",
    gap: "40px",
    textAlign: "right"
  },
  contactItem: {
    display: "flex",
    flexDirection: "column"
  },
  label: {
    fontSize: "9px",
    fontWeight: "900",
    color: COLORS.electric,
    letterSpacing: "1.5px"
  },
  value: {
    fontSize: "12px",
    fontWeight: "500",
    color: "white"
  }
};

export default Footer;