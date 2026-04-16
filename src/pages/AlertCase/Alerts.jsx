import React, { useEffect, useState } from "react";
import { getAllAlerts } from "../../services/AlertCase/alertApi";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { useTheme } from "../../context/ThemeContext";
 
ChartJS.register(ArcElement, Tooltip);
 
export default function Alerts() {
  const { currentColors, actualTheme, fontSize } = useTheme();
  const [alerts, setAlerts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState([]);
 
  const accentColor = actualTheme === 'frost' ? "#34abe0" : (actualTheme === 'light' ? "#7c3aed" : "#d000f5");
 
  const themeColors = {
    appBg: currentColors.appBg,
    cardBg: currentColors.cardBg,
    textPrimary: currentColors.textPrimary,
    textSecondary: currentColors.textSecondary,
    border: currentColors.border,
    accent: accentColor,
  };
 
  const pageBackground = actualTheme === 'frost'
    ? "linear-gradient(135deg, #fce7f3 0%, #e0f2fe 50%, #f0f9ff 100%)"
    : themeColors.appBg;
 
  const glassStyle = {
    backdropFilter: "blur(16px)",
    backgroundColor: actualTheme === 'frost' ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.03)",
    border: `1px solid ${actualTheme === 'frost' ? 'rgba(255, 255, 255, 0.5)' : themeColors.border}`,
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)"
  };
 
  useEffect(() => {
    loadAlerts();
  }, []);
 
  const loadAlerts = async () => {
    try {
      const res = await getAllAlerts();
      setAlerts(res.data || []);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };
 
 const handleGenerateAlerts = async () => {
  try {
    const res = await fetch("https://localhost:44372/api/alerts/generate-from-risk", { method: "POST" });
    const result = await res.json();
 
    if (result.count === 0) {
      alert("No new risks found to generate alerts. 🔍");
    } else {
      await loadAlerts();
      alert(`${result.count} Alerts generated successfully 🚀`);
    }
  } catch (err) {
    alert("No Alerts found ❌");
  }
};
 
  const isCaseCreated = (alert) => alert.caseId !== null && alert.caseId !== undefined;
 
  const handleCreateCase = async (item) => {
    try {
      const res = await fetch(`https://localhost:44372/api/alerts/${item.alertID}/create-case`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      alert("Case created successfully ✅");
      await loadAlerts();
    } catch (err) {
      alert("Failed to create case ❌");
    }
  };
 
  const handleView = (reason) => {
    try {
      let parsed = [];
      if (typeof reason === "string") {
        const cleaned = reason.trim();
        parsed = JSON.parse(cleaned);
        if (typeof parsed === "string") parsed = JSON.parse(parsed);
      } else if (Array.isArray(reason)) {
        parsed = reason;
      } else if (reason) {
        parsed = [reason];
      }
      setSelectedReason(parsed);
    } catch (err) {
      setSelectedReason([{ Rule: reason, Value: "-", Status: "-" }]);
    }
    setShowModal(true);
  };
 
  const count = (type) => (alerts || []).filter((a) => a.severity === type).length;
 
  const chartData = {
    labels: ["Critical", "High", "Medium", "Low"],
    datasets: [{
      data: [count("Critical"), count("High"), count("Medium"), count("Low")],
      backgroundColor: ["#4c1d95", "#7c3aed", "#a78bfa", "#ddd6fe"],
      borderWidth: 0,
      hoverOffset: 12,
    }],
  };
 
  const styles = {
    wrapper: {
      background: pageBackground,
      minHeight: "100vh",
      width: "100%",
      color: themeColors.textPrimary,
      padding: "40px",
      fontFamily: "Inter, sans-serif",
      boxSizing: "border-box",
      fontSize: `${fontSize}px`
    },
    header: { display: "flex", justifyContent: "space-between", marginBottom: "30px", alignItems: 'center' },
    title: { margin: 0, letterSpacing: "2px", fontSize: "24px", fontWeight: "900", color: themeColors.textPrimary },
    generateBtn: {
      padding: "10px 20px",
      background: themeColors.accent,
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "800",
      fontSize: "12px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
    },
    // CHANGED: Added alignItems flex-start to prevent stretching
    topGrid: { display: "flex", gap: "25px", marginBottom: "30px", alignItems: "flex-start" },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "15px",
      flex: 2
    },
    statCard: {
      ...glassStyle,
      padding: "12px 8px", // Shrunk padding further
      borderRadius: "12px",
      textAlign: 'center',
      transition: "all 0.3s ease",
      cursor: "pointer"
    },
    chartBox: {
      ...glassStyle,
      flex: 1.2,
      padding: "25px", // Increased padding for a larger feel
      borderRadius: "24px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "220px" // Ensures pie chart container is taller than the cards
    },
    tableCard: {
      ...glassStyle,
      padding: "25px",
      borderRadius: "24px",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
      textAlign: "left",
      padding: "12px",
      color: themeColors.textSecondary,
      fontSize: "10px",
      fontWeight: "800",
      letterSpacing: "1px",
      borderBottom: `1px solid ${themeColors.border}`
    },
    td: { padding: "14px 12px", fontSize: "12px", fontWeight: "600", borderBottom: `1px solid ${themeColors.border}` },
    statusBadge: {
      border: `1px solid ${themeColors.accent}`,
      color: themeColors.accent,
      padding: "3px 10px",
      borderRadius: "8px",
      fontSize: "10px",
      fontWeight: "800"
    },
    iconBtn: { cursor: "pointer", fontSize: "16px", transition: "0.2s" },
    modalBg: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modal: { ...glassStyle, backgroundColor: actualTheme === 'frost' ? "#fff" : themeColors.cardBg, padding: "30px", borderRadius: "24px", width: "500px" }
  };
 
  return (
    <div style={styles.wrapper}>
      <style>
        {`
          .alert-card-item:hover {
            transform: translateY(-5px);
            background-color: ${actualTheme === 'frost' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.08)'} !important;
            box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
          }
        `}
      </style>
 
      <header style={styles.header}>
        <h2 style={styles.title}>ALERTS <span style={{color: themeColors.accent}}>MONITOR</span></h2>
        <button onClick={handleGenerateAlerts} style={styles.generateBtn}>🚨 GENERATE ALERTS</button>
      </header>
 
      <div style={styles.topGrid}>
        <div style={styles.statsGrid}>
          <Card title="CRITICAL" value={count("Critical")} color="#4c1d95" styles={styles} />
          <Card title="HIGH" value={count("High")} color="#7c3aed" styles={styles} />
          <Card title="MEDIUM" value={count("Medium")} color="#a78bfa" styles={styles} />
          <Card title="LOW" value={count("Low")} color="#ddd6fe" styles={styles} />
        </div>
 
        <div style={styles.chartBox}>
          <p style={{ fontSize: '10px', fontWeight: '800', color: themeColors.textSecondary, marginBottom: '15px' }}>SEVERITY RATIO</p>
          <div style={{ height: "160px", width: "160px" }}> {/* Increased pie chart size */}
            <Doughnut data={chartData} options={{ cutout: "75%", maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
          <div style={{ position: 'absolute', top: '58%', textAlign: 'center' }}>
            <h4 style={{ margin: 0, fontWeight: '900', fontSize: "20px" }}>{alerts.length}</h4>
          </div>
        </div>
      </div>
 
      <div style={styles.tableCard}>
        <div style={{ marginBottom: "20px", fontWeight: "900", fontSize: "14px", letterSpacing: "1px" }}>ACTIVE ALERTS</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ALERT ID</th>
              <th style={styles.th}>TRANSACTION</th>
              <th style={styles.th}>SEVERITY</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>TIMESTAMP</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.alertID}>
                <td style={styles.td}>#{a.alertID}</td>
                <td style={styles.td}>{a.transactionID}</td>
                <td style={styles.td}><span style={getSeverityStyle(a.severity)}>{a.severity?.toUpperCase()}</span></td>
                <td style={styles.td}><span style={styles.statusBadge}>{a.status}</span></td>
                <td style={{ ...styles.td, color: themeColors.textSecondary }}>{a.createdDate ? new Date(a.createdDate).toLocaleDateString() : "N/A"}</td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                    <span onClick={() => handleView(a.reasonDetails)} style={{ ...styles.iconBtn, color: themeColors.accent }}>👁</span>
                    <span onClick={() => { if (!isCaseCreated(a)) handleCreateCase(a); }}
                      style={{ ...styles.iconBtn, color: themeColors.accent, cursor: isCaseCreated(a) ? "not-allowed" : "pointer", opacity: isCaseCreated(a) ? 0.3 : 1 }}>
                      {isCaseCreated(a) ? "✅" : "➕"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {showModal && (
        <div style={styles.modalBg}>
          <div style={styles.modal}>
            <h3 style={{ ...styles.title, fontSize: '18px', marginBottom: '20px' }}>ALERT <span style={{color: themeColors.accent}}>REASON</span></h3>
            <table style={{ ...styles.table, marginTop: '10px' }}>
              <thead>
                <tr style={{ color: themeColors.textSecondary, fontSize: '10px' }}>
                  <th style={{ textAlign: 'left', paddingBottom: '10px' }}>RULE</th>
                  <th style={{ textAlign: 'left', paddingBottom: '10px' }}>VALUE</th>
                </tr>
              </thead>
              <tbody>
                {selectedReason.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${themeColors.border}` }}>
                    <td style={{ ...styles.td, border: 'none' }}>{r.Rule}</td>
                    <td style={{ ...styles.td, border: 'none', color: themeColors.accent }}>{r.Value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              style={{ ...styles.generateBtn, width: '100%', marginTop: '30px' }}
              onClick={() => setShowModal(false)}
            >
              CLOSE WINDOW
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
 
const Card = ({ title, value, color, styles }) => (
  <div className="alert-card-item" style={{ ...styles.statCard, borderLeft: `4px solid ${color}` }}>
    <div style={{ fontSize: '8px', fontWeight: '800', color: color, marginBottom: '4px' }}>{title}</div>
    <div style={{ fontSize: '18px', fontWeight: '900' }}>{value}</div>
  </div>
);
 
const getSeverityStyle = (s) => {
  const map = { Critical: "#4c1d95", High: "#7c3aed", Medium: "#a78bfa", Low: "#ddd6fe" };
  const color = map[s] || "#fff";
  return {
    color: color,
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "0.5px"
  };
};