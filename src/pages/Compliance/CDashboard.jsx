import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const COLORS = {
  void: "#ffffff",       // Pure White Background
  electric: "#d3309a",   // Keeping your signature pink
  success: "#16a34a",    // Slightly darker green for better visibility on white
  textMain: "#0f172a",   // Dark Blue/Black for main text
  textMuted: "#64748b",  // Medium Gray for secondary text
  glass: "#f8fafc",      // Very light gray for cards
  border: "#e2e8f0"      // Light border to define sections
};
export default function CDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ 
    reports: [], 
    kyc: [], 
    checklist: [],
    watchlistStats: { internal: 0, pep: 0, sanctions: 0, cleared: 0 },
    notifications: [
      { id: 1, msg: "New PEP Entity Detected", time: "2m ago" },
      { id: 2, msg: "KYC Verification: Arjun - Passed", time: "10m ago" },
      { id: 3, msg: "System Audit Complete", time: "1h ago" }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repRes, checkRes, kycRes, watchRes] = await Promise.all([
          fetch("https://localhost:44372/api/RegulatoryReport"),
          fetch("https://localhost:44372/api/ControlChecklist"),
          fetch("https://localhost:44372/api/KYCProfiles"),
          fetch("https://localhost:44372/api/Watchlist")
        ]);

        const reportsData = await repRes.json() || [];
        const checklistData = await checkRes.json() || [];
        const kycData = await kycRes.json() || [];
        const watchlistRaw = await watchRes.json() || [];

        const stats = {
          internal: watchlistRaw.filter(item => item.listType === "Internal").length,
          pep: watchlistRaw.filter(item => item.listType === "PEP").length,
          sanctions: watchlistRaw.filter(item => item.listType === "Sanctions").length,
          cleared: watchlistRaw.filter(item => item.status === "Cleared").length
        };

        setData(prev => ({
          ...prev,
          reports: reportsData,
          checklist: checklistData,
          kyc: kycData,
          watchlistStats: stats
        }));
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h2 style={styles.title}>DASHBOARD<span style={{color: COLORS.electric}}> OVERVIEW</span></h2>
      </header>

      {/* Top Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>REGULATORY REPORTS</div>
          <div style={styles.statValue}>{data.reports.length}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>KYC PROFILES</div>
          <div style={styles.statValue}>{data.kyc.length}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>CASES</div>
          <div style={styles.statValue}>{data.checklist.length}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>WATCHLIST TOTAL</div>
          <div style={styles.statValue}>
             {data.watchlistStats.internal + data.watchlistStats.pep + data.watchlistStats.sanctions}
          </div>
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* Left Section: Reports & Watchlist */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={styles.glassCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>REGULATORY REPORTS</h3>
              <span style={styles.viewLink} onClick={() => navigate("/reports")}>VIEW ALL →</span>
            </div>
            <table style={styles.table}>
              <thead>
                <tr><th>REPORT ID</th><th>CASEID</th><th>TYPE</th><th style={{textAlign:'right'}}>STATUS</th></tr>
              </thead>
              <tbody>
                {data.reports.slice(0, 3).map((r, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.tdSmall}>#{r.reportID}</td>
                    <td style={styles.tdSmall}>{r.caseID}</td>
                    <td style={{...styles.tdSmall, color: COLORS.electric}}>{r.reportType}</td>
                    <td style={{...styles.tdSmall, textAlign:'right'}}><span style={styles.statusBadge}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.glassCard}>
            <div style={styles.cardHeader}>
               <h4 style={styles.cardTitleSmall}>WATCHLIST ENTITIES</h4>
               <span style={styles.viewLink} onClick={() => navigate("/watchlist")}>VIEW ALL →</span>
            </div>
            <div style={styles.watchlistGrid}>
              <div style={styles.watchBox}><h3>{data.watchlistStats.internal}</h3><p>INTERNAL</p></div>
              <div style={{...styles.watchBox, color: COLORS.electric}}><h3>{data.watchlistStats.pep}</h3><p>PEP</p></div>
              <div style={styles.watchBox}><h3>{data.watchlistStats.sanctions}</h3><p>SANCTIONS</p></div>
              <div style={styles.watchBox}><h3>{data.watchlistStats.cleared}</h3><p>CLEARED</p></div>
            </div>
          </div>
        </div>

        {/* Right Section: KYC, Checklist, and Notifications */}
        <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={styles.glassCard}>
            <div style={styles.cardHeader}>
              <h4 style={styles.cardTitleSmall}>KYC PIPELINE</h4>
              <span style={styles.viewLink} onClick={() => navigate("/kyc")}>VIEW ALL →</span>
            </div>
            <table style={styles.table}>
              <thead>
                <tr><th>CUST ID</th><th>FIRST NAME</th><th style={{textAlign: 'right'}}>STATUS</th></tr>
              </thead>
              <tbody>
                {data.kyc.slice(0, 3).map((k, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.tdSmall}>#{k.customerId}</td>
                    <td style={styles.tdSmall}>{k.fullName?.split(' ')[0]}</td>
                    <td style={{...styles.tdSmall, textAlign: 'right', color: COLORS.success}}>● {k.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.glassCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitleSmall}>CONTROL CHECKLIST</h3>
              <span style={styles.viewLink} onClick={() => navigate("/checklist")}>VIEW ALL →</span>
            </div>
            <table style={styles.table}>
              <thead>
                <tr><th>CASE ID</th><th style={{textAlign: 'right'}}>RESULT</th></tr>
              </thead>
              <tbody>
                {data.checklist.slice(0, 3).map((c, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.tdSmall}>#{c.caseID}</td>
                    <td style={{...styles.tdSmall, textAlign: 'right', fontWeight: 'bold', color: c.overallResult === "Pass" ? COLORS.success : COLORS.electric}}>
                      {c.overallResult}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notification Bar: Re-styled and Placed Below Checklist */}
          <div style={styles.notificationBar}>
            <div style={styles.cardHeader}>
              <h4 style={{margin: 0, fontSize: '12px', fontWeight: '800'}}>SYSTEM NOTIFICATIONS</h4>
              <span style={styles.viewLink} onClick={() => navigate("/notifications")}>VIEW ALL →</span>
            </div>
            <div style={styles.notifScroll}>
              {data.notifications.map((n) => (
                <div key={n.id} style={styles.notifItem}>
                  <span style={{flex: 1}}>{n.msg}</span>
                  <small style={{color: COLORS.textMuted, marginLeft: '10px'}}>{n.time}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { 
    background: COLORS.void, 
    minHeight: "100vh", 
    width: "100%",
    color: COLORS.textMain, // Global text is now dark
    padding: "40px", 
    fontFamily: "Inter, sans-serif",
    boxSizing: "border-box" 
  },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "30px" },
  title: { margin: 0, letterSpacing: "2px", fontSize: "24px", fontWeight: "800", color: COLORS.textMain },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "30px" },
  statCard: { 
    background: "#ffffff", 
    padding: "20px", 
    borderRadius: "15px", 
    border: `1px solid ${COLORS.border}`,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)" // Soft shadow instead of glow
  },
  statTitle: { fontSize: "10px", color: COLORS.textMuted, marginBottom: "5px", textTransform: 'uppercase', fontWeight: "600" },
  statValue: { fontSize: "1.8rem", fontWeight: "900", color: COLORS.textMain },
  mainGrid: { display: "flex", gap: "25px" },
  glassCard: { 
    background: COLORS.glass, 
    padding: "20px", 
    borderRadius: "20px", 
    border: `1px solid ${COLORS.border}`
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  cardTitle: { fontSize: "16px", margin: 0, fontWeight: "700", color: COLORS.textMain },
  cardTitleSmall: { fontSize: "12px", color: COLORS.textMuted, margin: 0, textTransform: 'uppercase', fontWeight: "600" },
  viewLink: { fontSize: "10px", color: COLORS.electric, cursor: "pointer", fontWeight: "bold" },
  watchlistGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  watchBox: { 
    background: "#ffffff", 
    padding: "15px", 
    borderRadius: "12px", 
    textAlign: "center", 
    border: `1px solid ${COLORS.border}`,
    color: COLORS.textMain
  },
  table: { width: "100%", borderCollapse: "collapse" },
  tr: { borderBottom: `1px solid ${COLORS.border}` },
  tdSmall: { padding: "12px 0", fontSize: "11px", color: "#334155" }, // Darker table text
  statusBadge: { border: `1px solid ${COLORS.electric}`, color: COLORS.electric, padding: "2px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: "600" },
  
  // Notification bar now uses a soft pink tint that works on white
  notificationBar: { 
    background: "rgba(211, 48, 154, 0.05)", 
    border: `1px solid rgba(211, 48, 154, 0.2)`, 
    padding: "20px", 
    borderRadius: "20px" 
  },
  notifScroll: { display: "flex", flexDirection: "column", gap: "10px" },
  notifItem: { 
    display: "flex", 
    justifyContent: "space-between", 
    fontSize: "11px", 
    padding: "10px", 
    background: "#ffffff", 
    borderRadius: "8px",
    border: `1px solid ${COLORS.border}`,
    color: COLORS.textMain
  }
};