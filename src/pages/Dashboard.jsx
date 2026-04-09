import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const COLORS = {
  void: "#0a0219",      
  electric: "#d3309a",  
  glow: "#a730d3",      
  textMuted: "#b4abbb",
  glass: "rgba(255, 255, 255, 0.03)",
  glassBorder: "rgba(255, 255, 255, 0.08)"
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [checklistData, setChecklistData] = useState([]);
  const [kycData, setKycData] = useState([]);
  const [notifications, setNotifications] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reg, control, kyc, notif] = await Promise.all([
          fetch("https://localhost:44372/api/RegulatoryReport"),
          fetch("https://localhost:44372/api/ControlChecklist"),
          fetch("https://localhost:44372/api/KYCRequest/status"),
          fetch("https://localhost:44372/api/ComplianceNotification/send-notification")
        ]);

        if (reg.ok) setTableData(await reg.json());
        if (control.ok) setChecklistData(await control.json());
        if (kyc.ok) {
          const data = await kyc.json();
          setKycData(data.profile ? [data.profile] : (Array.isArray(data) ? data : []));
        }
        if (notif.ok) {
          const data = await notif.json();
          setNotifications(Array.isArray(data) ? data : [data]);
        }
        setLoading(false);
      } catch (error) {
        console.error("API Error:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { title: "ALERTS DETECTED", value: 325, trend: "+12%" },
    { title: "ACTIVE CASES", value: tableData.length || 0, trend: "Stable" }, 
    { title: "COMPLETED AUDITS", value: 97, trend: "+5%" },
    { title: "SYSTEM REPORTS", value: "22", trend: "0" },
  ];

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("pass") || s.includes("verified") || s.includes("str")) 
      return { border: `1px solid #22c55e`, color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)" };
    if (s.includes("fail") || s.includes("high") || s.includes("sar")) 
      return { border: `1px solid ${COLORS.electric}`, color: COLORS.electric, bg: "rgba(211, 48, 154, 0.1)" };
    return { border: `1px solid #eab308`, color: "#eab308", bg: "rgba(234, 179, 8, 0.1)" };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div style={styles.wrapper}>
      {/* Background Orbs */}
      <div style={styles.orb1}></div>
      <div style={styles.orb2}></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={styles.mainContainer}
      >
        {/* Header */}
        <header style={styles.header}>
          <div>
            <h2 style={styles.title}>TERMINAL OVERVIEW</h2>
            <small style={styles.subtitle}>REAL-TIME COMPLIANCE MONITORING</small>
          </div>
          <div style={styles.officerBadge}>
            <span style={styles.pulse}></span> OFFICER ACTIVE
          </div>
        </header>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {cards.map((card, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ scale: 1.05, borderColor: COLORS.electric }}
              onClick={() => navigate("/cases")}
              style={styles.statCard}
            >
              <div style={styles.statTitle}>{card.title}</div>
              <div style={styles.statValue}>{card.value}</div>
              <div style={styles.statTrend}>{card.trend}</div>
            </motion.div>
          ))}
        </div>

        <div style={styles.contentLayout}>
          {/* Left Column */}
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* Regulatory Table */}
            <motion.div variants={itemVariants} style={styles.glassCard}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>REGULATORY REPORTS</h3>
                <span style={styles.viewLink} onClick={() => navigate("/regulatory-report")}>FULL LOG →</span>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>REPORT ID</th>
                    <th style={styles.th}>CASE REF</th>
                    <th style={styles.th}>TYPE</th>
                    <th style={{...styles.th, textAlign: 'right'}}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.slice(0, 5).map((row, i) => {
                    const status = getStatusBadge(row.status || row.Status);
                    return (
                      <tr key={i} style={styles.tr}>
                        <td style={styles.td}>#{row.reportID || row.ReportID}</td>
                        <td style={styles.td}>{row.caseID || row.CaseID}</td>
                        <td style={{...styles.td, color: COLORS.electric, fontWeight: 'bold'}}>{row.reportType || row.ReportType}</td>
                        <td style={{...styles.td, textAlign: 'right'}}>
                          <span style={{...styles.badge, ...status}}>{row.status || row.Status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>

            <div style={{ display: 'flex', gap: '25px' }}>
              {/* Watchlist */}
              <motion.div variants={itemVariants} style={{...styles.glassCard, flex: 1}}>
                <h4 style={styles.cardTitleSmall}>WATCHLIST ENTITIES</h4>
                <div style={styles.watchlistGrid}>
                  <div style={styles.watchItem}><h4>125</h4><p>INTERNAL</p></div>
                  <div style={{...styles.watchItem, color: COLORS.electric}}><h4>36</h4><p>PEP</p></div>
                  <div style={styles.watchItem}><h4>62</h4><p>SANCTIONS</p></div>
                  <div style={styles.watchItem}><h4>189</h4><p>CLEARED</p></div>
                </div>
              </motion.div>

              {/* KYC Status */}
              <motion.div variants={itemVariants} style={{...styles.glassCard, flex: 1}}>
                <h4 style={styles.cardTitleSmall}>KYC PIPELINE</h4>
                <div style={{marginTop: '15px'}}>
                   {kycData.slice(0, 3).map((item, i) => (
                      <div key={i} style={styles.kycRow}>
                        <span>ID: {item.customerId || item.CustomerId}</span>
                        <span style={{color: getStatusBadge(item.status || item.Status).color}}>● {item.status || item.Status}</span>
                      </div>
                   ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Notifications */}
            <motion.div variants={itemVariants} style={styles.notifCard}>
              <h3 style={{...styles.cardTitle, color: 'white'}}>SYSTEM ALERTS</h3>
              <div style={styles.notifList}>
                {notifications.map((n, i) => (
                  <div key={i} style={styles.notifItem}>
                    <div style={styles.notifText}>{n.message || n.Message}</div>
                    <div style={styles.notifTime}>{n.timestamp || n.Timestamp}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Checklist */}
            <motion.div variants={itemVariants} style={styles.glassCard}>
              <h3 style={styles.cardTitleSmall}>CONTROL CHECKLIST</h3>
              <div style={{marginTop: '15px'}}>
                {checklistData.slice(0, 4).map((row, i) => (
                  <div key={i} style={styles.checklistRow}>
                    <div>
                       <div style={{fontSize: '12px', fontWeight: 'bold'}}>{row.caseID}</div>
                       <div style={{fontSize: '10px', color: COLORS.textMuted}}>{row.controlName}</div>
                    </div>
                    <span style={{fontSize: '10px', color: getStatusBadge(row.result).color}}>{row.result}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  wrapper: { background: COLORS.void, minHeight: "100vh", color: "white", position: "relative", overflow: "hidden", fontFamily: "'Inter', sans-serif", padding: "40px" },
  orb1: { position: "absolute", top: "-10%", right: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, #d3309a22 0%, transparent 70%)", zIndex: 0 },
  orb2: { position: "absolute", bottom: "-10%", left: "5%", width: "400px", height: "400px", background: "radial-gradient(circle, #a730d311 0%, transparent 70%)", zIndex: 0 },
  mainContainer: { position: "relative", zIndex: 1, maxWidth: "1400px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" },
  title: { margin: 0, letterSpacing: "3px", fontSize: "1.8rem", fontWeight: "900" },
  subtitle: { color: COLORS.electric, fontWeight: "bold", fontSize: "10px", letterSpacing: "2px" },
  officerBadge: { background: COLORS.glass, padding: "8px 16px", borderRadius: "20px", border: `1px solid ${COLORS.glassBorder}`, fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "8px" },
  pulse: { width: "8px", height: "8px", background: "#22c55e", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 10px #22c55e" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "30px" },
  statCard: { background: COLORS.glass, border: `1px solid ${COLORS.glassBorder}`, padding: "25px", borderRadius: "20px", backdropFilter: "blur(10px)", cursor: "pointer", transition: "0.3s" },
  statTitle: { fontSize: "10px", color: COLORS.textMuted, letterSpacing: "1px", marginBottom: "10px" },
  statValue: { fontSize: "2rem", fontWeight: "900" },
  statTrend: { fontSize: "10px", color: "#22c55e", marginTop: "5px" },
  contentLayout: { display: "flex", gap: "25px" },
  glassCard: { background: COLORS.glass, border: `1px solid ${COLORS.glassBorder}`, padding: "25px", borderRadius: "24px", backdropFilter: "blur(15px)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  cardTitle: { margin: 0, fontSize: "1.1rem", letterSpacing: "1px" },
  cardTitleSmall: { margin: 0, fontSize: "0.9rem", color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.glassBorder}`, paddingBottom: "10px" },
  viewLink: { fontSize: "10px", color: COLORS.electric, cursor: "pointer", fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "12px", color: COLORS.textMuted, fontSize: "10px", borderBottom: `1px solid ${COLORS.glassBorder}` },
  td: { padding: "16px 12px", fontSize: "13px", borderBottom: "1px solid rgba(255,255,255,0.02)" },
  badge: { padding: "4px 12px", borderRadius: "12px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" },
  watchlistGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "20px" },
  watchItem: { textAlign: "center", padding: "10px", background: "rgba(255,255,255,0.02)", borderRadius: "12px" },
  kycRow: { display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "12px" },
  notifCard: { background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)", padding: "25px", borderRadius: "24px", border: `1px solid ${COLORS.glassBorder}` },
  notifList: { display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" },
  notifItem: { padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", borderLeft: `3px solid ${COLORS.electric}` },
  notifText: { fontSize: "12px", lineHeight: "1.4" },
  notifTime: { fontSize: "10px", opacity: 0.5, marginTop: "5px" },
  checklistRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", marginBottom: "8px" }
};