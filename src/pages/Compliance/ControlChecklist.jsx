import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiShield, FiSearch, FiCheckCircle, FiTrash2, FiRefreshCcw, FiSend, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const BASE_URL = "https://localhost:7181/api";

const ControlChecklist = () => {
  const { currentColors, actualTheme } = useTheme();
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

  // Dynamic Theme Logic
  const accentColor = actualTheme === 'frost' ? "#34abe0" : "#d000f5";
  
  // MATCHING DASHBOARD BACKGROUND GRADIENT
  const appBackground = actualTheme === 'dark' 
    ? "linear-gradient(180deg, #2e003e 0%, #1a0620 100%)" 
    : "linear-gradient(135deg, #fce7f3 0%, #e0f2fe 50%, #f0f9ff 100%)";

  const glassStyle = { 
    backdropFilter: "blur(12px)", 
    border: `1px solid ${currentColors.border}`,
    backgroundColor: actualTheme === 'dark' ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.6)"
  };

  useEffect(() => {
    fetchAuditHistory();
  }, []);

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
        checkedBy: "Gangotri",
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

  const filteredAudits = auditStream.filter(item => item.caseID.toString().includes(searchQuery));
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAudits.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredAudits.length / recordsPerPage);

  return (
    <div style={{ ...styles.wrapper, background: appBackground }}>
      <div style={styles.contentBody}>
        
        {/* HEADER */}
        <div style={styles.headerBanner}>
          <div style={{ ...styles.iconBox, background: accentColor }}>
            <FiShield size={24} color="white" />
          </div>
          <div style={styles.headerTextGroup}>
            <h1 style={{ ...styles.mainTitle, color: currentColors.textPrimary }}>CONTROL<span style={{ color: accentColor }}> CHECKLIST</span></h1>
            <p style={{ ...styles.subTitle, color: accentColor }}>AUDIT LOG & COMPLIANCE TERMINAL</p>
          </div>
        </div>

        {error && (
          <div style={{ ...styles.alert, borderColor: "#dc2626", color: "#dc2626", backgroundColor: actualTheme === 'dark' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(220, 38, 38, 0.05)' }}>
            {error}
          </div>
        )}
        
        <div style={styles.layout}>
          {/* ENTRY CARD */}
          <div style={{ ...styles.card, ...glassStyle }}>
            <h3 style={{ ...styles.cardTitle, color: accentColor }}>New Audit Entry</h3>
            <div style={styles.inputGroup}>
              <input 
                type="number" 
                style={{ ...styles.input, backgroundColor: currentColors.appBg, color: currentColors.textPrimary, borderColor: currentColors.border }} 
                value={caseId} 
                onChange={(e) => setCaseId(e.target.value)} 
                placeholder="Enter Case ID..." 
              />
              <button 
                onClick={handleScan} 
                disabled={!isValidCase || loading} 
                style={{ ...styles.btn, background: accentColor, opacity: isValidCase ? 1 : 0.4 }}
              >
                {loading ? "..." : "SCAN"}
              </button>
            </div>

            <div style={styles.scanBox}>
              <Row label="KYC Verification" status={scanResult.kyc} themeColors={currentColors} accent={accentColor} />
              <Row label="Transaction Pattern" status={scanResult.transaction} themeColors={currentColors} accent={accentColor} />
              <Row label="Watchlist Entity" status={scanResult.watchlist} themeColors={currentColors} accent={accentColor} />
            </div>

            <button 
              onClick={handlePush} 
              disabled={!scanResult.readyToPush} 
              style={{ ...styles.pushBtn, background: accentColor, opacity: scanResult.readyToPush ? 1 : 0.4 }}
            >
              <FiSend style={{ marginRight: '8px' }} /> COMMIT TO LEDGER
            </button>
          </div>

          {/* HISTORY CARD */}
          <div style={{ ...styles.card, ...glassStyle }}>
            <div style={styles.headerRow}>
              <h3 style={{ ...styles.cardTitle, color: accentColor }}>Audit History</h3>
              <div style={{ ...styles.searchWrapper, borderColor: currentColors.border, backgroundColor: currentColors.appBg }}>
                <FiSearch size={14} style={{ color: currentColors.textSecondary, marginRight: '8px' }} />
                <input 
                  type="text" 
                  placeholder="Filter cases..." 
                  style={{ ...styles.searchBar, color: currentColors.textPrimary }} 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
              </div>
            </div>

            <table style={styles.table}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${currentColors.border}` }}>
                  <th style={{ ...styles.th, color: currentColors.textSecondary }}>CASE ID</th>
                  <th style={{ ...styles.th, color: currentColors.textSecondary }}>OUTCOME</th>
                  <th style={{ ...styles.th, color: currentColors.textSecondary }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map(item => (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${currentColors.border}` }}>
                    <td style={{ ...styles.td, color: currentColors.textPrimary }}>#{item.caseID}</td>
                    <td style={{ ...styles.td }}>
                      <span style={{ 
                        fontWeight: "900", 
                        fontSize: '11px',
                        color: item.overallResult === 'PASS' ? "#16a34a" : "#dc2626",
                        backgroundColor: item.overallResult === 'PASS' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                        padding: '4px 10px',
                        borderRadius: '6px'
                      }}>
                        {item.overallResult}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => setCaseId(item.caseID.toString())} style={{ ...styles.actionBtn, borderColor: currentColors.border, color: currentColors.textPrimary }}>
                        <FiRefreshCcw size={12} />
                      </button>
                      <button 
                        onClick={() => { if(window.confirm("Delete record?")) axios.delete(`${BASE_URL}/ControlChecklist/${item.caseID}`).then(fetchAuditHistory); }} 
                        style={styles.delBtn}
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={styles.pagination}>
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ ...styles.pageBtn, color: currentColors.textPrimary, borderColor: currentColors.border }}>
                <FiChevronLeft />
              </button>
              <span style={{ fontSize: '12px', fontWeight: '700', color: currentColors.textSecondary }}>{currentPage} / {totalPages || 1}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} style={{ ...styles.pageBtn, color: currentColors.textPrimary, borderColor: currentColors.border }}>
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, status, themeColors, accent }) => (
  <div style={{ ...styles.row, backgroundColor: themeColors.appBg, borderColor: themeColors.border }}>
    <span style={{ color: themeColors.textPrimary, fontWeight: '600' }}>{label}</span>
    <span style={{ fontWeight: '900', color: status === 'PASS' ? "#16a34a" : status === 'FAIL' ? "#dc2626" : themeColors.textSecondary }}>
      {status}
    </span>
  </div>
);

const styles = {
  wrapper: { minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column" },
  contentBody: { padding: "40px" },
  headerBanner: { display: "flex", alignItems: "center", gap: "18px", marginBottom: "35px" },
  iconBox: { width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" },
  headerTextGroup: { display: "flex", flexDirection: "column" },
  mainTitle: { margin: 0, fontSize: "24px", fontWeight: "900" },
  subTitle: { margin: 0, fontSize: "11px", letterSpacing: "1.5px", fontWeight: "800", marginTop: "2px" },
  alert: { border: `1px solid`, padding: "12px 18px", borderRadius: "12px", marginBottom: "25px", fontSize: "13px", fontWeight: "600" },
  layout: { display: "grid", gridTemplateColumns: "400px 1fr", gap: "30px" },
  card: { padding: "35px", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)" },
  cardTitle: { fontSize: "14px", fontWeight: "800", marginBottom: "25px", textTransform: "uppercase", letterSpacing: '1px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  searchWrapper: { display: 'flex', alignItems: 'center', border: '1px solid', borderRadius: '12px', padding: '8px 15px', width: '250px' },
  searchBar: { background: 'transparent', border: 'none', fontSize: '13px', outline: 'none', width: '100%', fontWeight: '600' },
  inputGroup: { display: 'flex', gap: '10px', marginBottom: '30px' },
  input: { flex: 1, border: `1px solid`, borderRadius: "14px", padding: "14px", outline: 'none', fontSize: "14px", fontWeight: "700" },
  btn: { border: "none", color: "white", borderRadius: "14px", padding: "0 25px", cursor: "pointer", fontWeight: "900", fontSize: "12px" },
  row: { display: "flex", justifyContent: "space-between", border: `1px solid`, padding: "16px 20px", borderRadius: "16px", marginBottom: "15px", fontSize: "14px" },
  pushBtn: { width: "100%", padding: "18px", borderRadius: "16px", color: "white", fontWeight: "900", border: "none", cursor: "pointer", marginTop: "10px", fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "15px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1.5px" },
  td: { padding: "18px 15px", fontSize: "14px", fontWeight: '600' },
  actionBtn: { background: "transparent", border: `1px solid`, padding: "8px", borderRadius: "10px", marginRight: '8px', cursor: "pointer", display: 'inline-flex', alignItems: 'center' },
  delBtn: { background: "rgba(220, 38, 38, 0.1)", border: "none", color: "#dc2626", padding: "8px", borderRadius: "10px", cursor: "pointer", display: 'inline-flex', alignItems: 'center' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '30px' },
  pageBtn: { background: "transparent", border: `1px solid`, padding: "8px", borderRadius: "10px", cursor: "pointer", display: 'flex', alignItems: 'center' }
};

export default ControlChecklist;