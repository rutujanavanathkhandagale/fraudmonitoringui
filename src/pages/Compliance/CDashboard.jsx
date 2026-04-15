import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function CDashboard() {
  const navigate = useNavigate();
  const { currentColors, actualTheme } = useTheme(); 
  
  // Dynamic Accent Color based on your theme selection
  const accentColor = actualTheme === 'frost' ? "#34abe0" : "#d000f5";

  const themeColors = {
    appBg: currentColors.appBg,
    cardBg: currentColors.cardBg,
    textMain: currentColors.textPrimary,
    textMuted: currentColors.textSecondary,
    border: currentColors.border,
    accent: accentColor, 
    success: "#16a34a"
  };

  const [data, setData] = useState({ 
    reports: [], 
    kyc: [], 
    checklist: [],
    watchlistStats: { internal: 0, pep: 0, sanctions: 0, cleared: 0 }
  });

  // Frost Theme specific background logic
  const dashboardBg = actualTheme === 'frost'
    ? "linear-gradient(135deg, #fce7f3 0%, #e0f2fe 50%, #f0f9ff 100%)"
    : themeColors.appBg;

  const glassStyle = {
    backdropFilter: "blur(16px)",
    backgroundColor: actualTheme === 'frost' ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.03)",
    border: `1px solid ${actualTheme === 'frost' ? 'rgba(255, 255, 255, 0.5)' : themeColors.border}`,
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)"
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repRes, checkRes, kycRes, watchRes] = await Promise.all([
          fetch("https://localhost:7181/api/RegulatoryReport"),
          fetch("https://localhost:7181/api/ControlChecklist"),
          fetch("https://localhost:7181/api/KYCProfiles"),
          fetch("https://localhost:7181/api/Watchlist")
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

  const styles = {
    wrapper: { 
        background: dashboardBg, 
        minHeight: "100vh", 
        width: "100%", 
        color: themeColors.textMain, 
        padding: "40px", 
        fontFamily: "Inter, sans-serif", 
        boxSizing: "border-box" 
    },
    header: { display: "flex", justifyContent: "space-between", marginBottom: "30px" },
    title: { margin: 0, letterSpacing: "2px", fontSize: "24px", fontWeight: "900", color: themeColors.textMain },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "30px" },
    statCard: { 
        ...glassStyle,
        padding: "25px", 
        borderRadius: "20px", 
        transition: "transform 0.2s"
    },
    statTitle: { fontSize: "11px", color: themeColors.textMuted, marginBottom: "8px", textTransform: 'uppercase', fontWeight: "800", letterSpacing: "0.5px" },
    statValue: { fontSize: "2rem", fontWeight: "900", color: themeColors.textMain },
    mainGrid: { display: "flex", gap: "25px" },
    glassCard: { 
        ...glassStyle,
        padding: "25px", 
        borderRadius: "24px",
    },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    cardTitle: { fontSize: "14px", margin: 0, fontWeight: "900", color: themeColors.textMain, letterSpacing: "1px" },
    viewLink: { fontSize: "10px", color: themeColors.accent, cursor: "pointer", fontWeight: "900", letterSpacing: "0.5px" },
    watchlistGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
    watchBox: { 
        backgroundColor: actualTheme === 'frost' ? "#ffffff" : "rgba(0,0,0,0.1)", 
        padding: "15px", 
        borderRadius: "15px", 
        textAlign: "center", 
        border: `1px solid ${themeColors.border}` 
    },
    table: { width: "100%", borderCollapse: "collapse" },
    tr: { borderBottom: `1px solid ${themeColors.border}` },
    tdSmall: { padding: "14px 0", fontSize: "12px", color: themeColors.textMain, fontWeight: "600" }, 
    statusBadge: { border: `1px solid ${themeColors.accent}`, color: themeColors.accent, padding: "2px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: "800" },
  };

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h2 style={styles.title}>DASHBOARD <span style={{color: themeColors.accent}}>OVERVIEW</span></h2>
      </header>

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
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={styles.glassCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>REGULATORY REPORTS</h3>
              <span style={styles.viewLink} onClick={() => navigate("/regulatory-report")}>VIEW ALL →</span>
            </div>
            <table style={styles.table}>
              <thead>
                <tr style={{color: themeColors.textMuted, fontSize: '10px', textAlign: 'left'}}>
                    <th>REPORT ID</th><th>CASE ID</th><th>TYPE</th><th style={{textAlign:'right'}}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {data.reports.slice(0, 3).map((r, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.tdSmall}>#{r.reportID}</td>
                    <td style={styles.tdSmall}>{r.caseID}</td>
                    <td style={{...styles.tdSmall, color: themeColors.accent}}>{r.reportType}</td>
                    <td style={{...styles.tdSmall, textAlign:'right'}}><span style={styles.statusBadge}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.glassCard}>
            <div style={styles.cardHeader}>
               <h3 style={styles.cardTitle}>WATCHLIST ENTITIES</h3>
               <span style={styles.viewLink} onClick={() => navigate("/Watchlist")}>VIEW ALL →</span>
            </div>
            <div style={styles.watchlistGrid}>
              <div style={styles.watchBox}><h3 style={{margin:0}}>{data.watchlistStats.internal}</h3><p style={{fontSize:'9px', fontWeight:'800', margin:0}}>INTERNAL</p></div>
              <div style={{...styles.watchBox, color: themeColors.accent}}><h3 style={{margin:0}}>{data.watchlistStats.pep}</h3><p style={{fontSize:'9px', fontWeight:'800', margin:0}}>PEP</p></div>
              <div style={styles.watchBox}><h3 style={{margin:0}}>{data.watchlistStats.sanctions}</h3><p style={{fontSize:'9px', fontWeight:'800', margin:0}}>SANCTIONS</p></div>
              <div style={styles.watchBox}><h3 style={{margin:0}}>{data.watchlistStats.cleared}</h3><p style={{fontSize:'9px', fontWeight:'800', margin:0}}>CLEARED</p></div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={styles.glassCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>KYC PIPELINE</h3>
              <span style={styles.viewLink} onClick={() => navigate("/kyc")}>VIEW ALL →</span>
            </div>
            <table style={styles.table}>
              <thead>
                <tr style={{color: themeColors.textMuted, fontSize: '10px', textAlign: 'left'}}>
                    <th>CUST ID</th><th>NAME</th><th style={{textAlign: 'right'}}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {data.kyc.slice(0, 3).map((k, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.tdSmall}>#{k.customerId}</td>
                    <td style={styles.tdSmall}>{k.fullName?.split(' ')[0]}</td>
                    <td style={{...styles.tdSmall, textAlign: 'right', color: themeColors.success}}>● {k.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.glassCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>CONTROL CHECKLIST</h3>
              <span style={styles.viewLink} onClick={() => navigate("/control-checklist")}>VIEW ALL →</span>
            </div>
            <table style={styles.table}>
              <thead>
                <tr style={{color: themeColors.textMuted, fontSize: '10px', textAlign: 'left'}}>
                    <th>CASE ID</th><th style={{textAlign: 'right'}}>RESULT</th>
                </tr>
              </thead>
              <tbody>
                {data.checklist.slice(0, 3).map((c, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.tdSmall}>#{c.caseID}</td>
                    <td style={{...styles.tdSmall, textAlign: 'right', fontWeight: '900', color: c.overallResult === "Pass" ? themeColors.success : themeColors.accent}}>
                      {c.overallResult?.toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}