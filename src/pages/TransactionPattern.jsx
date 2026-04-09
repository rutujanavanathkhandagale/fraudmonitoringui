import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = {
  void: "#0a0219",
  electric: "#d3309a",
  glow: "#a730d3",
  danger: "#ff4d4d",
  success: "#00e676",
  textMuted: "#b4abbb",
  glass: "rgba(255, 255, 255, 0.03)",
  border: "rgba(255, 255, 255, 0.1)"
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
      {/* Background Orbs */}
      <div style={styles.orb1}></div>
      
      <div style={styles.container}>
        {/* TOP SEARCH BAR */}
        <div style={styles.searchBar}>
          <div style={styles.logoGroup}>
            <div style={styles.miniShield}>🛡️</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '2px' }}>Transaction Pattern</div>
              <div style={{ fontSize: '8px', color: COLORS.electric }}>Compliance Officer</div>
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
            <button style={styles.primaryBtn}>{loading ? "SCANNIG..." : "Check Pattern"}</button>
          </form>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
              
              {/* MAIN THREE-COLUMN GRID */}
              <div style={styles.dashboardGrid}>
                
                {/* COLUMN 1: SPECIFIC TRANSACTION DATA */}
                <div style={styles.card}>
                  <label style={styles.cardLabel}>SPECIFIC TRANSACTION</label>
                  <div style={styles.statusHeader}>
                    <h1 style={{ color: result.transactionResult === "PASS" ? COLORS.success : COLORS.danger }}>
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
                <div style={{ ...styles.card, borderTop: `4px solid ${COLORS.electric}` }}>
                  <label style={styles.cardLabel}>CUSTOMER PATTERN</label>
                  <div style={styles.statusHeader}>
                    <h1 style={{ color: result.customerResult === "FAIL" ? COLORS.danger : COLORS.success }}>
                      {result.customerResult}
                    </h1>
                    <span style={styles.subStatus}>{result.customerStatus}</span>
                  </div>

                  <div style={styles.riskMeter}>
                    <div style={styles.riskLabel}>RISK SCORE: {result.riskScore}%</div>
                    <div style={styles.riskBar}><div style={{ ...styles.riskFill, width: `${result.riskScore}%` }}></div></div>
                  </div>

                  <div style={styles.dataList}>
                    <DataRow label="Severity Level" value={result.highestSeverity} color={COLORS.danger} />
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
                      <small>AVERAGE</small>
                      <div>₹{result.averageAmount.toLocaleString()}</div>
                    </div>
                    <div style={styles.statBox}>
                      <small>MAXIMUM</small>
                      <div>₹{result.maxAmount.toLocaleString()}</div>
                    </div>
                    <div style={styles.statBox}>
                      <small>MINIMUM</small>
                      <div>₹{result.minAmount.toLocaleString()}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <label style={styles.cardLabel}>AUDIT REASONS</label>
                    <div style={styles.reasonScroll}>
                      {result.reasons.map((reason, i) => (
                        <div key={i} style={styles.reasonItem}>
                          <span style={{ color: COLORS.danger }}>⚠</span> {reason}
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

// Helper Component for consistency
const DataRow = ({ label, value, color }) => (
  <div style={styles.row}>
    <span style={{ color: COLORS.textMuted }}>{label}</span>
    <span style={{ fontWeight: 'bold', color: color || 'white' }}>{value}</span>
  </div>
);

const styles = {
  wrapper: { background: COLORS.void, minHeight: "100vh", color: "white", padding: "30px", fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center' },
  container: { maxWidth: "1400px", margin: "0 auto", position: 'relative', zIndex: 5 },
  orb1: { position: "absolute", top: "-20%", right: "-10%", width: "800px", height: "800px", background: "radial-gradient(circle, #2d0d54 0%, transparent 70%)", opacity: 0.4 },
  
  searchBar: {alignItems: 'center', background: COLORS.glass, backdropFilter: 'blur(10px)', border: `1px solid ${COLORS.border}`, padding: '20px 40px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  logoGroup: { display: 'flex', gap: '15px', alignItems: 'center' },
  miniShield: { background: COLORS.electric, padding: '8px', borderRadius: '8px', fontSize: '18px' },
  formInline: { display: "flex", gap: "10px" },
  input: { background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, padding: "12px 20px", borderRadius: "10px", color: "white", outline: 'none', width: '180px' },
  primaryBtn: { background: COLORS.electric, color: "white", border: "none", padding: "0 25px", borderRadius: "10px", fontWeight: "900", cursor: "pointer", fontSize: '12px' },

  dashboardGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" },
  card: { background: "rgba(255,255,255,0.02)", border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "30px", display: 'flex', flexDirection: 'column' },
  cardLabel: { fontSize: "0.65rem", fontWeight: "900", color: COLORS.electric, letterSpacing: "2px", marginBottom: "20px", display: 'block' },
  statusHeader: { marginBottom: '25px' },
  subStatus: { fontSize: '0.9rem', color: COLORS.textMuted, fontWeight: '500' },
  
  row: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' },
  
  riskMeter: { marginBottom: '25px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px' },
  riskLabel: { fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '8px' },
  riskBar: { height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' },
  riskFill: { height: '100%', background: COLORS.electric, boxShadow: `0 0 10px ${COLORS.electric}` },

  statsGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '10px' },
  statBox: { background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', textAlign: 'center' },
  reasonScroll: { maxHeight: '200px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px' },
  reasonItem: { fontSize: '0.8rem', marginBottom: '10px', color: '#ffcccc', display: 'flex', gap: '10px' }
};

export default TransactionPattern;