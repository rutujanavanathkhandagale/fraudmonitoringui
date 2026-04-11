import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = {
  bg: "#ffffff",
  textMain: "#0f172a",
  textMuted: "#64748b",
  electric: "#d3309a",
  glow: "#a020f0",
  success: "#16a34a",
  danger: "#dc2626",
  border: "#e2e8f0",
  cardBg: "#f8fafc",
  inputBg: "#f1f5f9"
};

const TransactionPattern = () => {
  const [customerId, setCustomerId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`https://localhost:44372/api/TransactionPattern/${customerId}/${transactionId}`);
      setResult(res.data);
    } catch (err) {
      console.error("Audit Trace Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        
        {/* TOP SEARCH BAR */}
        <div style={styles.searchBar}>
          <div style={styles.logoGroup}>
            <div style={styles.miniShield}>🛡️</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '1px', color: COLORS.textMain }}>Transaction Pattern</div>
              <div style={{ fontSize: '9px', fontWeight: '800', color: COLORS.electric, textTransform: 'uppercase' }}>Compliance Officer Terminal</div>
            </div>
          </div>
          <form onSubmit={handleAudit} style={styles.formInline}>
            <input 
              style={styles.input} 
              placeholder="Customer ID" 
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)} 
            />
            <input 
              style={styles.input} 
              placeholder="Transaction ID" 
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)} 
            />
            <button style={styles.primaryBtn}>{loading ? "SCANNING..." : "RUN AUDIT"}</button>
          </form>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              
              {/* MAIN THREE-COLUMN GRID */}
              <div style={styles.dashboardGrid}>
                
                {/* COLUMN 1: SPECIFIC TRANSACTION DATA */}
                <div style={styles.card}>
                  <label style={styles.cardLabel}>SPECIFIC TRANSACTION</label>
                  <div style={styles.statusHeader}>
                    <h1 style={{ color: result.transactionResult === "PASS" ? COLORS.success : COLORS.danger, fontWeight: '900', margin: 0 }}>
                      {result.transactionResult}
                    </h1>
                    <span style={styles.subStatus}>{result.transactionStatus}</span>
                  </div>

                  <div style={styles.dataList}>
                    <DataRow label="Amount" value={`₹${result.currentTransactionAmount.toLocaleString()}`} />
                    <DataRow label="Type" value={result.currentTransactionType} />
                    <DataRow label="Channel" value={result.currentTransactionChannel} />
                    <DataRow label="Timestamp" value={new Date(result.currentTransactionDate).toLocaleString()} />
                  </div>
                </div>

                {/* COLUMN 2: CUSTOMER BEHAVIORAL PATTERN */}
                <div style={{ ...styles.card, borderTop: `4px solid ${COLORS.textMain}` }}>
                  <label style={styles.cardLabel}>CUSTOMER PATTERN</label>
                  <div style={styles.statusHeader}>
                    <h1 style={{ color: result.customerResult === "FAIL" ? COLORS.danger : COLORS.success, fontWeight: '900', margin: 0 }}>
                      {result.customerResult}
                    </h1>
                    <span style={styles.subStatus}>{result.customerStatus}</span>
                  </div>

                  <div style={styles.riskMeter}>
                    <div style={styles.riskLabel}>RISK SCORE: {result.riskScore}%</div>
                    <div style={styles.riskBar}>
                        <div style={{ ...styles.riskFill, width: `${result.riskScore}%`, background: result.riskScore > 70 ? COLORS.danger : COLORS.electric }}></div>
                    </div>
                  </div>

                  <div style={styles.dataList}>
                    <DataRow label="Severity Level" value={result.highestSeverity} color={result.highestSeverity === "High" ? COLORS.danger : COLORS.textMain} />
                    <DataRow label="Alerts Mapped" value={result.totalMappedAlerts} />
                    <DataRow label="7-Day Count" value={result.last7DaysCount} />
                    <DataRow label="Total Volume" value={result.totalTransactions} />
                  </div>
                </div>

                {/* COLUMN 3: HISTORICAL AGGREGATES */}
                <div style={styles.card}>
                  <label style={styles.cardLabel}>HISTORICAL BENCHMARKS</label>
                  <div style={styles.statsGrid}>
                    <div style={styles.statBox}>
                      <small style={styles.statBoxLabel}>AVERAGE</small>
                      <div style={styles.statValue}>₹{result.averageAmount.toLocaleString()}</div>
                    </div>
                    <div style={styles.statBox}>
                      <small style={styles.statBoxLabel}>MAXIMUM</small>
                      <div style={styles.statValue}>₹{result.maxAmount.toLocaleString()}</div>
                    </div>
                    <div style={styles.statBox}>
                      <small style={styles.statBoxLabel}>MINIMUM</small>
                      <div style={styles.statValue}>₹{result.minAmount.toLocaleString()}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <label style={styles.cardLabel}>AUDIT REASONS</label>
                    <div style={styles.reasonScroll}>
                      {result.reasons.map((reason, i) => (
                        <div key={i} style={styles.reasonItem}>
                          <span style={{ color: COLORS.danger }}>•</span> {reason}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Helper Component
const DataRow = ({ label, value, color }) => (
  <div style={styles.row}>
    <span style={{ color: COLORS.textMuted }}>{label}</span>
    <span style={{ fontWeight: '700', color: color || COLORS.textMain }}>{value}</span>
  </div>
);

const styles = {
  wrapper: { background: COLORS.bg, minHeight: "100vh", color: COLORS.textMain, padding: "40px", fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: "1200px", margin: "0 auto" },
  
  searchBar: { background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, padding: '15px 25px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  logoGroup: { display: 'flex', gap: '12px', alignItems: 'center' },
  miniShield: { background: COLORS.textMain, color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' },
  formInline: { display: "flex", gap: "10px" },
  input: { background: "white", border: `1px solid ${COLORS.border}`, padding: "10px 15px", borderRadius: "8px", color: COLORS.textMain, outline: 'none', width: '150px', fontSize: '12px', fontWeight: '600' },
  primaryBtn: { background: COLORS.textMain, color: "white", border: "none", padding: "0 20px", borderRadius: "8px", fontWeight: "800", cursor: "pointer", fontSize: '10px', textTransform: 'uppercase' },

  dashboardGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "25px" },
  card: { background: "white", border: `1px solid ${COLORS.border}`, borderRadius: "20px", padding: "25px", display: 'flex', flexDirection: 'column' },
  cardLabel: { fontSize: "10px", fontWeight: "800", color: COLORS.textMuted, letterSpacing: "1px", marginBottom: "15px", display: 'block', textTransform: 'uppercase' },
  statusHeader: { marginBottom: '20px' },
  subStatus: { fontSize: '12px', color: COLORS.textMuted, fontWeight: '700' },
  
  row: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${COLORS.border}`, fontSize: '13px' },
  
  riskMeter: { marginBottom: '20px', background: COLORS.inputBg, padding: '15px', borderRadius: '12px' },
  riskLabel: { fontSize: '11px', fontWeight: '800', marginBottom: '8px' },
  riskBar: { height: '6px', background: COLORS.border, borderRadius: '10px', overflow: 'hidden' },
  riskFill: { height: '100%', borderRadius: '10px' },

  statsGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '10px' },
  statBox: { background: COLORS.cardBg, padding: '12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statBoxLabel: { fontWeight: '800', color: COLORS.textMuted, fontSize: '9px' },
  statValue: { fontWeight: '800', fontSize: '14px' },
  reasonScroll: { maxHeight: '150px', overflowY: 'auto', background: COLORS.inputBg, padding: '12px', borderRadius: '10px' },
  reasonItem: { fontSize: '11px', marginBottom: '8px', color: COLORS.textMain, fontWeight: '600', display: 'flex', gap: '8px' }
};

export default TransactionPattern;