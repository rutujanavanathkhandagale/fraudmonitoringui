import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://localhost:44372/api";

// Unified Light Theme Colors
const COLORS = {
  bg: "#ffffff",
  textMain: "#0f172a",
  textMuted: "#64748b",
  electric: "#d3309a",
  success: "#16a34a",
  fail: "#dc2626",
  border: "#e2e8f0",
  glass: "#f8fafc",
  inputBg: "#f1f5f9"
};

const ControlChecklist = () => {
  const [caseId, setCaseId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditStream, setAuditStream] = useState([]);
  const [error, setError] = useState(null);
  const [isValidCase, setIsValidCase] = useState(false);

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const initialState = {
    kyc: "PENDING",
    transaction: "PENDING",
    watchlist: "PENDING",
    overall: "PENDING",
    readyToPush: false
  };

  const [scanResult, setScanResult] = useState(initialState);

  useEffect(() => {
    fetchAuditHistory();
    const style = document.createElement("style");
    style.innerHTML = `
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      input[type=number] { -moz-appearance: textfield; }
    `;
    document.head.appendChild(style);
  }, []);

  // Instant Validation Logic
  useEffect(() => {
    const validateId = async () => {
      if (!caseId) {
        setScanResult(initialState);
        setError(null);
        setIsValidCase(false);
        return;
      }
      try {
        await axios.get(`${BASE_URL}/Case/${caseId}`);
        const alreadyAudited = auditStream.some(item => item.caseID === parseInt(caseId));
        if (alreadyAudited) {
          setError(`Case #${caseId} already exists. Use Re-Analyze.`);
          setIsValidCase(false);
        } else {
          setError(null);
          setIsValidCase(true);
        }
      } catch (err) {
        setError(`CaseID #${caseId} not found`);
        setIsValidCase(false);
      }
    };
    const delay = setTimeout(validateId, 400);
    return () => clearTimeout(delay);
  }, [caseId, auditStream]);

  const fetchAuditHistory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/ControlChecklist`);
      setAuditStream(res.data);
    } catch (err) {
      console.error("Sync failed");
    }
  };

  // Automated Compliance Scan
  const handleScan = async () => {
    setLoading(true);
    try {
      const caseRes = await axios.get(`${BASE_URL}/Case/${caseId}`);
      const { customerId, transactionId } = caseRes.data;
      const [kycRes, txnRes, watchlistRes] = await Promise.all([
        axios.get(`${BASE_URL}/KYCProfiles/customer/${customerId}`),
        axios.get(`${BASE_URL}/TransactionPattern/${customerId}/${transactionId}`),
        axios.get(`${BASE_URL}/Watchlist/verify/${customerId}`)
      ]);
      const wlPass = watchlistRes.data.status === "PASS";
      
      setScanResult({
        kyc: kycRes.data.status === "Verified" ? "PASS" : "FAIL",
        transaction: txnRes.data.transactionResult === "PASS" ? "PASS" : "FAIL",
        watchlist: wlPass ? "PASS" : "FAIL",
        overall: (kycRes.data.status === "Verified" && txnRes.data.transactionResult === "PASS" && wlPass) ? "PASS" : "FAIL",
        readyToPush: true
      });
    } catch (err) {
      setError("Verification scan failed.");
    } finally { setLoading(false); }
  };

  const handlePush = async () => {
    try {
      await axios.post(`${BASE_URL}/ControlChecklist`, {
        caseID: parseInt(caseId),
        overallResult: scanResult.overall,
        checkedBy: "Gangotri", //
        details: [
          { controlName: "KYC Verification", status: scanResult.kyc },
          { controlName: "Transaction Pattern", status: scanResult.transaction },
          { controlName: "Watchlist Entity", status: scanResult.watchlist }
        ]
      });
      fetchAuditHistory();
      setCaseId(""); 
      setScanResult(initialState);
    } catch (err) { setError("Push Failed"); }
  };

  // PAGINATION LOGIC
  const filteredAudits = auditStream.filter(item => item.caseID.toString().includes(searchQuery));
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAudits.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredAudits.length / recordsPerPage);

  return (
    <div style={styles.container}>
      <div style={styles.headerBanner}>
        <div style={styles.iconBox}>🛡️</div>
        <div style={styles.headerTextGroup}>
          <h1 style={styles.mainTitle}>CONTROL<span style={styles.accentTitle}> CHECKLIST</span></h1>
          <p style={styles.subTitle}>FRAUDSHIELD SECURE TERMINAL</p>
        </div>
      </div>

      {error && <div style={styles.alert}>{error}</div>}
      
      <div style={styles.layout}>
        {/* NEW AUDIT ENTRY CARD */}
        <div style={styles.card}>
          <h3 style={styles.title}>Control Checklist Entry</h3>
          <div style={styles.inputGroup}>
            <input 
              type="number" 
              style={styles.input} 
              value={caseId} 
              onChange={(e) => setCaseId(e.target.value)} 
              placeholder="Enter Case ID..." 
            />
            <button 
              onClick={handleScan} 
              disabled={!isValidCase || loading} 
              style={{...styles.btn, opacity: isValidCase ? 1 : 0.4}}
            >
              {loading ? "..." : "Verify"}
            </button>
          </div>
          <div style={styles.scanBox}>
            <Row label="KYC Verification" status={scanResult.kyc} />
            <Row label="Transaction Pattern" status={scanResult.transaction} />
            <Row label="Watchlist Entity" status={scanResult.watchlist} />
          </div>
          <button 
            onClick={handlePush} 
            disabled={!scanResult.readyToPush} 
            style={{...styles.pushBtn, opacity: scanResult.readyToPush ? 1 : 0.4}}
          >
            Commit Result
          </button>
        </div>

        {/* AUDIT HISTORY CARD */}
        <div style={styles.card}>
          <div style={styles.headerRow}>
            <h3 style={styles.title}>Control Checklist History</h3>
            <input 
              type="text" 
              placeholder="Search Case ID..." 
              style={styles.searchBar} 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Case Details</th>
                <th style={styles.th}>Overall Result</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map(item => (
                <tr key={item.id} style={styles.tr}>
                  <td style={styles.td}>Case #{item.caseID}</td>
                  <td style={{...styles.td, fontWeight: "bold", color: item.overallResult === 'PASS' ? COLORS.success : COLORS.fail}}>
                    {item.overallResult}
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => setCaseId(item.caseID.toString())} style={styles.actionBtn}>RE-ANALYZE</button>
                    <button 
                      onClick={() => { if(window.confirm("Delete record?")) axios.delete(`${BASE_URL}/ControlChecklist/${item.caseID}`).then(fetchAuditHistory); }} 
                      style={styles.delBtn}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={styles.pagination}>
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={styles.pageBtn}>PREV</button>
            <span style={{fontSize: '12px', color: COLORS.textMuted}}>Page {currentPage} of {totalPages || 1}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} style={styles.pageBtn}>NEXT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, status }) => (
  <div style={styles.row}>
    <span style={{color: COLORS.textMain}}>{label}</span>
    <span style={{fontWeight: '900', color: status === 'PASS' ? COLORS.success : status === 'FAIL' ? COLORS.fail : COLORS.textMuted}}>
      {status}
    </span>
  </div>
);

const styles = {
  container: { background: COLORS.bg, minHeight: "100vh", color: COLORS.textMain, padding: "40px" },
  
  headerBanner: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" },
  iconBox: { 
    width: "60px", 
    height: "60px", 
    background: COLORS.electric, 
    borderRadius: "15px", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontSize: "30px",
    boxShadow: "0 4px 15px rgba(211, 48, 154, 0.2)" 
  },
  headerTextGroup: { display: "flex", flexDirection: "column" },
  mainTitle: { margin: 0, fontSize: "28px", fontWeight: "900", letterSpacing: "1px", color: COLORS.textMain },
  accentTitle: { color: COLORS.electric },
  subTitle: { margin: 0, fontSize: "11px", letterSpacing: "2px", color: COLORS.electric, fontWeight: "bold", marginTop: "4px" },

  alert: { background: "#fef2f2", border: `1px solid ${COLORS.fail}`, color: COLORS.fail, padding: "12px", borderRadius: "10px", marginBottom: "20px", fontSize: "13px" },
  layout: { display: "grid", gridTemplateColumns: "380px 1fr", gap: "30px" },
  card: { background: COLORS.glass, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "30px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" },
  title: { color: COLORS.electric, fontSize: "16px", fontWeight: "700", marginBottom: "20px", textTransform: "uppercase" },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  searchBar: { background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "8px 12px", color: COLORS.textMain, fontSize: "13px" },
  inputGroup: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { flex: 1, background: COLORS.inputBg, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "12px", color: COLORS.textMain, fontWeight: "600" },
  btn: { background: COLORS.textMain, border: "none", color: "white", borderRadius: "10px", padding: "0 20px", cursor: "pointer", fontWeight: "600", textTransform: "uppercase", fontSize: "11px" },
  row: { display: "flex", justifyContent: "space-between", background: COLORS.bg, border: `1px solid ${COLORS.border}`, padding: "14px", borderRadius: "12px", marginBottom: "10px", fontSize: "13px" },
  pushBtn: { width: "100%", padding: "16px", borderRadius: "12px", background: COLORS.electric, color: "white", fontWeight: "bold", border: "none", cursor: "pointer", marginTop: "10px", transition: "transform 0.2s" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "15px", color: COLORS.textMuted, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" },
  tr: { borderBottom: `1px solid ${COLORS.border}`, transition: "background 0.2s" },
  td: { padding: "15px", fontSize: "14px", color: COLORS.textMain },
  actionBtn: { background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.textMain, padding: "6px 12px", borderRadius: "6px", marginRight: '8px', cursor: "pointer", fontSize: "11px", fontWeight: "600" },
  delBtn: { background: "#fff1f2", border: `1px solid ${COLORS.fail}`, color: COLORS.fail, padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600" },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '20px' },
  pageBtn: { background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.textMain, padding: "6px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "11px" }
};

export default ControlChecklist;