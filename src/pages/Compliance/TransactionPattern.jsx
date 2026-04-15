import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiShield, FiSearch, FiActivity, FiAlertTriangle, 
  FiInfo, FiBarChart2 
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const TransactionPattern = () => {
  const [customerId, setCustomerId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const { currentColors, actualTheme } = useTheme();

  // Unified Theme Logic
  const accentColor = actualTheme === 'frost' ? "#34abe0" : "#d000f5";
  
  const appBackground = actualTheme === 'dark' 
    ? "linear-gradient(180deg, #2e003e 0%, #1a0620 100%)" 
    : "linear-gradient(135deg, #fce7f3 0%, #e0f2fe 50%, #f0f9ff 100%)";

  const glassStyle = { 
    backdropFilter: "blur(12px)", 
    border: `1px solid ${currentColors.border}`,
    backgroundColor: actualTheme === 'dark' ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.6)"
  };

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
    <div style={{ ...styles.wrapper, background: appBackground, color: currentColors.textPrimary }}>
      <div style={styles.contentBody}>
        
        {/* HEADER SEARCH TERMINAL */}
        <header style={{ ...styles.searchBar, ...glassStyle }}>
          <div style={styles.logoGroup}>
            <div style={{ ...styles.miniShield, background: accentColor }}>
              <FiShield size={22} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '0.5px' }}>TRANSACTION PATTERN</div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px' }}>Compliance Terminal</div>
            </div>
          </div>
          
          <form onSubmit={handleAudit} style={styles.formInline}>
            <input 
              style={{ ...styles.input, backgroundColor: currentColors.appBg, color: currentColors.textPrimary, borderColor: currentColors.border }} 
              placeholder="Customer ID" 
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)} 
            />
            <input 
              style={{ ...styles.input, backgroundColor: currentColors.appBg, color: currentColors.textPrimary, borderColor: currentColors.border }} 
              placeholder="Transaction ID" 
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)} 
            />
            <button style={{ ...styles.primaryBtn, background: accentColor }}>
              {loading ? "SCANNING..." : <><FiSearch className="me-2" /> RUN AUDIT</>}
            </button>
          </form>
        </header>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={styles.dashboardGrid}>
                
                {/* CARD 1: TRANSACTION DATA */}
                <div style={{ ...styles.card, ...glassStyle }}>
                  <label style={{ ...styles.cardLabel, color: currentColors.textSecondary }}><FiInfo className="me-2" size={14} /> CURRENT ANALYSIS</label>
                  <div style={styles.statusHeader}>
                    <h2 style={{ color: result.transactionResult === "PASS" ? "#10b981" : "#ef4444", fontWeight: '900', fontSize: '2.5rem', marginBottom: '5px' }}>{result.transactionResult}</h2>
                    <span style={{ fontSize: '12px', fontWeight: '800', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{result.transactionStatus}</span>
                  </div>
                  <div style={styles.dataList}>
                    <DataRow label="Amount" value={`₹${result.currentTransactionAmount.toLocaleString()}`} colors={currentColors} />
                    <DataRow label="Channel" value={result.currentTransactionChannel} colors={currentColors} />
                    <DataRow label="Security Flag" value={result.isFlagged ? "Flagged" : "Clean"} colors={currentColors} accent={result.isFlagged ? "#ef4444" : "#10b981"} />
                  </div>
                </div>

                {/* CARD 2: BEHAVIORAL SCORE */}
                <div style={{ ...styles.card, borderTop: `6px solid ${accentColor}`, ...glassStyle }}>
                  <label style={{ ...styles.cardLabel, color: currentColors.textSecondary }}><FiActivity className="me-2" size={14} /> RISK BEHAVIOR</label>
                  <div style={styles.statusHeader}>
                    <h2 style={{ color: result.riskScore > 75 ? "#ef4444" : accentColor, fontWeight: '900', fontSize: '2.5rem', marginBottom: '5px' }}>{result.riskScore}%</h2>
                    <span style={{ fontSize: '12px', fontWeight: '800', opacity: 0.7, textTransform: 'uppercase' }}>INTERNAL RISK RATING</span>
                  </div>
                  <div style={styles.progressTrack}>
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${result.riskScore}%` }} 
                      style={{ ...styles.progressBar, background: accentColor }} 
                    />
                  </div>
                  <div style={styles.dataList}>
                    <DataRow label="KYC History" value={result.customerStatus} colors={currentColors} />
                    <DataRow label="Mapped Alerts" value={result.totalMappedAlerts} colors={currentColors} />
                  </div>
                </div>

                {/* CARD 3: AUDIT LOGS */}
                <div style={{ ...styles.card, ...glassStyle }}>
                  <label style={{ ...styles.cardLabel, color: currentColors.textSecondary }}><FiBarChart2 className="me-2" size={14} /> AUDIT SUMMARY</label>
                  <div style={styles.reasonBox}>
                    {result.reasons.map((r, i) => (
                      <div key={i} style={{ 
                        ...styles.reasonItem, 
                        borderLeft: `3px solid ${accentColor}`, 
                        backgroundColor: actualTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.4)' 
                      }}>
                        <FiAlertTriangle size={14} className="me-2" style={{ color: result.riskScore > 70 ? "#ef4444" : accentColor, flexShrink: 0 }} />
                        <span style={{ fontWeight: '600', fontSize: '12.5px' }}>{r}</span>
                      </div>
                    ))}
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

const DataRow = ({ label, value, colors, accent }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${colors.border}`, fontSize: '14px' }}>
    <span style={{ color: colors.textSecondary, fontWeight: '600' }}>{label}</span>
    <span style={{ fontWeight: '800', color: accent || colors.textPrimary }}>{value}</span>
  </div>
);

const styles = {
  wrapper: { minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", paddingBottom: "40px" },
  contentBody: { padding: "40px 50px", width: "100%" },
  searchBar: { 
    padding: '20px 35px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    marginBottom: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' 
  },
  logoGroup: { display: 'flex', gap: '18px', alignItems: 'center' },
  miniShield: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' },
  formInline: { display: "flex", gap: "15px" },
  input: { border: "1px solid", padding: "14px 20px", borderRadius: "12px", outline: 'none', width: '220px', fontSize: '13px', fontWeight: '700', transition: '0.2s' },
  primaryBtn: { color: "white", border: "none", padding: "0 30px", borderRadius: "12px", fontWeight: "900", cursor: "pointer", fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' },
  dashboardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "30px" },
  card: { borderRadius: "28px", padding: "35px", boxShadow: '0 15px 45px rgba(0,0,0,0.04)' },
  cardLabel: { fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px", marginBottom: "25px", display: 'flex', alignItems: 'center', textTransform: 'uppercase' },
  statusHeader: { marginBottom: '30px' },
  progressTrack: { height: '10px', background: 'rgba(0,0,0,0.08)', borderRadius: '12px', overflow: 'hidden', margin: '20px 0 30px 0' },
  progressBar: { height: '100%', borderRadius: '12px' },
  reasonBox: { display: 'flex', flexDirection: 'column', gap: '15px' },
  reasonItem: { padding: '15px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' },
  dataList: { marginTop: '10px' }
};

export default TransactionPattern;