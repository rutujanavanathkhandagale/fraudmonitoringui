import React, { useEffect, useState } from "react";
import { getCases, updateCaseStatus } from "../../services/AlertCase/caseApi"

import { useTheme } from "../../context/ThemeContext";
import { FiBriefcase, FiUser, FiActivity, FiClock, FiSearch } from 'react-icons/fi';
 
export default function Cases() {
  const { currentColors, actualTheme, fontSize } = useTheme();
  const [cases, setCases] = useState([]);
  const [role, setRole] = useState("analyst");
 
  // ✅ Aligned Theme Constants
  const accentColor = actualTheme === 'frost' ? "#34abe0" : (actualTheme === 'light' ? "#7c3aed" : "#d000f5");
 
  const themeColors = {
    appBg: currentColors.appBg,
    cardBg: currentColors.cardBg,
    textMain: currentColors.textPrimary,
    textMuted: currentColors.textSecondary,
    border: currentColors.border,
    accent: accentColor,
    success: "#16a34a"
  };
 
  const pageBg = actualTheme === 'frost'
    ? "linear-gradient(135deg, #fce7f3 0%, #e0f2fe 50%, #f0f9ff 100%)"
    : themeColors.appBg;
 
  const glassStyle = {
    backdropFilter: "blur(16px)",
    backgroundColor: actualTheme === 'frost' ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.03)",
    border: `1px solid ${actualTheme === 'frost' ? 'rgba(255, 255, 255, 0.5)' : themeColors.border}`,
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)"
  };
 
  const fetchCases = async () => {
    try {
      const res = await getCases();
      const data = res?.data?.$values || res?.data?.data || res?.data || [];
      setCases(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching cases:", err);
      setCases([]);
    }
  };
 
  useEffect(() => {
    fetchCases();
  }, []);
 
  const handleStatusChange = async (caseID, newStatus) => {
    try {
      await updateCaseStatus(caseID, newStatus);
      setCases((prev) =>
        prev.map((c) => (c.caseID === caseID ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert("Not allowed to update status");
    }
  };
 
  const styles = {
    wrapper: {
      background: pageBg,
      minHeight: "100vh",
      width: "100%",
      color: themeColors.textMain,
      padding: "40px",
      fontFamily: "Inter, sans-serif",
      boxSizing: "border-box",
      fontSize: `${fontSize}px`
    },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
    title: { margin: 0, letterSpacing: "2px", fontSize: "24px", fontWeight: "900", color: themeColors.textMain },
   
    // Grid alignment matches the "shrink" logic from Alerts
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "15px",
        marginBottom: "30px",
        width: "70%" // Keeps grid compact horizontally
    },
    statCard: {
      ...glassStyle,
      padding: "12px 8px", // Shrunk padding
      borderRadius: "12px", // Compact radius
      textAlign: "center",
      transition: "all 0.3s ease",
      cursor: "pointer"
    },
    statTitle: { fontSize: "9px", color: themeColors.textMuted, marginBottom: "4px", textTransform: 'uppercase', fontWeight: "800", letterSpacing: "0.5px" },
    statValue: { fontSize: "20px", fontWeight: "900", color: themeColors.textMain },
 
    glassCard: {
      ...glassStyle,
      padding: "25px",
      borderRadius: "24px",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    tr: { borderBottom: `1px solid ${themeColors.border}` },
    th: { textAlign: "left", color: themeColors.textMuted, fontSize: '10px', paddingBottom: "15px", letterSpacing: "1px" },
    td: { padding: "14px 0", fontSize: "12px", color: themeColors.textMain, fontWeight: "600" },
   
    select: {
      padding: "8px 12px",
      background: actualTheme === 'frost' ? "#ffffff" : "rgba(255, 255, 255, 0.05)",
      color: themeColors.textMain,
      border: `1px solid ${themeColors.border}`,
      borderRadius: "10px",
      fontSize: "12px",
      fontWeight: "700",
      outline: "none"
    },
    badge: (color) => ({
      padding: "3px 8px",
      borderRadius: "6px",
      fontSize: "9px",
      background: color,
      color: "#fff",
      fontWeight: "800"
    })
  };
 
  const safeCases = Array.isArray(cases) ? cases : [];
 
  return (
    <div style={styles.wrapper}>
      {/* HOVER EFFECT CSS */}
      <style>
        {`
          .case-card-item:hover {
            transform: translateY(-5px);
            background-color: ${actualTheme === 'frost' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.08)'} !important;
            box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
          }
        `}
      </style>
 
      <header style={styles.header}>
        <h2 style={styles.title}>CASE <span style={{color: themeColors.accent}}>MANAGEMENT</span></h2>
       
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ fontSize: "11px", fontWeight: "800", color: themeColors.textMuted }}>ROLE:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.select}
          >
            <option value="analyst">ANALYST</option>
            <option value="compliance">COMPLIANCE OFFICER</option>
          </select>
        </div>
      </header>
 
      {/* COMPACT STATS GRID */}
      <div style={styles.statsGrid}>
        {[
          { label: "OPEN", key: "Open", color: "#4c1d95" },
          { label: "INVESTIGATING", key: "Investigating", color: "#7c3aed" },
          { label: "RESOLVED", key: "Resolved", color: "#a78bfa" },
          { label: "REPORTED", key: "Reported", color: "#ddd6fe" }
        ].map((stat) => (
          <div key={stat.label} className="case-card-item" style={{...styles.statCard, borderLeft: `4px solid ${stat.color}`}}>
            <div style={{...styles.statTitle, color: stat.color}}>{stat.label}</div>
            <div style={styles.statValue}>
                {safeCases.filter((c) => c?.status === stat.key).length}
            </div>
          </div>
        ))}
      </div>
 
      <div style={styles.glassCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>CASE ID</th>
              <th style={styles.th}>CUSTOMER</th>
              <th style={styles.th}>TYPE</th>
              <th style={styles.th}>PRIORITY</th>
              <th style={styles.th}>STATUS CONTROL</th>
              <th style={{...styles.th, textAlign: 'right'}}>CREATED DATE</th>
            </tr>
          </thead>
          <tbody>
            {safeCases.map((c, i) => (
              <tr key={i} style={styles.tr}>
                <td style={styles.td}>#{c.caseID}</td>
                <td style={styles.td}>
                  <div style={{fontWeight: "900"}}>{c.customerName}</div>
                  <div style={{fontSize: "10px", color: themeColors.textMuted}}>ID: {c.customerId}</div>
                </td>
                <td style={styles.td}>
                   <span style={styles.badge(c.caseType === "AML" ? themeColors.accent : "#3b82f6")}>
                    {c.caseType}
                   </span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    color: c.priority === "Critical" ? "#4c1d95" : c.priority === "High" ? "#7c3aed" : c.priority === "Medium" ? "#a78bfa" : "#ddd6fe",
                    fontWeight: "900",
                    fontSize: "10px"
                  }}>
                    ● {c.priority?.toUpperCase()}
                  </span>
                </td>
                <td style={styles.td}>
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.caseID, e.target.value)}
                    style={{...styles.select, padding: "4px 8px"}}
                  >
                    {role === "analyst" && (
                      <>
                        <option value="Open">Open</option>
                        <option value="Investigating">Investigating</option>
                      </>
                    )}
                    {role === "compliance" && (
                      <>
                        <option value="Resolved">Resolved</option>
                        <option value="Reported">Reported</option>
                      </>
                    )}
                  </select>
                </td>
                <td style={{...styles.td, textAlign: 'right', color: themeColors.textMuted}}>
                  {c.createdDate ? new Date(c.createdDate).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 