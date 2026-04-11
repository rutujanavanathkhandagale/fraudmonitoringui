import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "https://localhost:44372/api/RegulatoryReport";
const CASE_API = "https://localhost:44372/api/Case";

// Updated Light Theme Colors
const COLORS = {
  bg: "#ffffff",
  textMain: "#0f172a",
  textMuted: "#64748b",
  electric: "#d3309a",
  success: "#16a34a",
  info: "#3b82f6", 
  warning: "#f59e0b",
  error: "#dc2626",
  border: "#e2e8f0",
  glass: "#f8fafc",
  inputBg: "#f1f5f9"
};

function RegulatoryReport() {
  const [reports, setReports] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null); 
  const [caseValid, setCaseValid] = useState(null);
  const [notification, setNotification] = useState({ show: false, msg: "", type: "success" });

  const [formData, setFormData] = useState({
    caseID: "",
    reportType: "SAR",
    status: "Pending"
  });

  // Global style to clean up number inputs
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      input[type=number] { -moz-appearance: textfield; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    fetchAllReports();
  }, []);

  useEffect(() => {
    if (searchId === "") {
      fetchAllReports();
    }
  }, [searchId]);

  const notify = (msg, type = "success") => {
    setNotification({ show: true, msg, type });
    setTimeout(() => setNotification({ show: false, msg: "", type: "success" }), 4000);
  };

  const validateCaseInstant = async (id) => {
    if (!id) { setCaseValid(null); return; }
    try {
      await axios.get(`${CASE_API}/${id}`);
      setCaseValid(true);
    } catch (err) {
      setCaseValid(false);
    }
  };

  const fetchAllReports = async () => {
    setLoading(true);
    try {
      let url = searchId.trim() ? `${API_BASE}/case/${searchId}` : API_BASE;
      const res = await axios.get(url);
      const data = res.data;
      setReports(Array.isArray(data) ? data : (data ? [data] : []));
    } catch (err) {
      setReports([]);
      if(searchId) notify("No report found for this ID", "error");
    } finally {
      setLoading(false);
    }
  };

  const prepareEdit = (report) => {
    const data = {
      caseID: report.caseID || report.caseId,
      reportType: report.reportType,
      status: report.status
    };
    setIsEditing(true);
    setFormData(data);
    setOriginalData(data); 
    setCaseValid(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const targetCaseId = parseInt(formData.caseID);
    setLoading(true);

    try {
      if (isEditing) {
        if (formData.reportType === originalData.reportType && formData.status === originalData.status) {
          notify("NO UPDATION: No changes detected.", "warning");
          setLoading(false);
          return;
        }

        await axios.put(`${API_BASE}/case/${targetCaseId}`, { 
            reportType: formData.reportType, 
            status: formData.status 
        });
        notify("SUCCESS: Registry updated.", "success");
      } else {
        if (!caseValid) throw new Error(`Case ID #${targetCaseId} not found.`);
        const dupCheck = await axios.get(`${API_BASE}/case/${targetCaseId}`);
        const alreadyExists = Array.isArray(dupCheck.data) ? dupCheck.data.length > 0 : !!dupCheck.data;
        if (alreadyExists) throw new Error(`DENIED: Report already exists for Case #${targetCaseId}`);

        await axios.post(API_BASE, { 
          ...formData, 
          caseID: targetCaseId,
          period: "Weekly",
          submittedDate: new Date().toISOString()
        });
        notify("SUCCESS: Report added to registry.", "success");
      }
      resetForm();
      fetchAllReports();
    } catch (err) {
      notify(err.message || "SYSTEM ERROR: API Transmission failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (caseId) => {
    if (!window.confirm(`Delete report for Case #${caseId}?`)) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/case/${caseId}`);
      notify(`PURGED: Case #${caseId} deleted.`, "warning");
      fetchAllReports();
    } catch (err) {
      notify("DELETE FAILED: Server rejection.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setOriginalData(null);
    setCaseValid(null);
    setFormData({ caseID: "", reportType: "SAR", status: "Pending" });
  };

  return (
    <div style={styles.wrapper}>
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ y: -50, x: "-50%", opacity: 0 }}
            animate={{ y: 20, x: "-50%", opacity: 1 }}
            exit={{ y: -50, x: "-50%", opacity: 0 }}
            style={{...styles.popup, borderBottom: `3px solid ${COLORS[notification.type]}`}}
          >
            {notification.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-fluid">
        <header style={styles.header}>
            <h2 style={styles.logoText}>REGULATORY <span style={{color: COLORS.electric}}>REPORT</span></h2>
            <small style={styles.subLogo}>COMPLIANCE AUDIT TERMINAL</small>
        </header>

        <div className="row g-4">
          <div className="col-lg-4">
            <motion.div style={styles.glassCard} layout>
              <h5 style={styles.cardTitle}>{isEditing ? "Modify Entry" : "Registry Entry"}</h5>
              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label style={styles.label}>CASE ID</label>
                  <input 
                    style={{
                      ...styles.input, 
                      borderColor: caseValid === true ? COLORS.success : caseValid === false ? COLORS.error : COLORS.border
                    }} 
                    type="number" 
                    value={formData.caseID} 
                    placeholder="Search Case..." 
                    onChange={(e) => { setFormData({...formData, caseID: e.target.value}); validateCaseInstant(e.target.value); }} 
                    disabled={isEditing} 
                    required 
                  />
                  {caseValid === false && <small style={{color: COLORS.error, fontSize: '10px', fontWeight: 'bold'}}>Case ID invalid</small>}
                </div>

                <div className="mb-3">
                  <label style={styles.label}>REPORT TYPE</label>
                  <select style={styles.select} value={formData.reportType} onChange={(e) => setFormData({...formData, reportType: e.target.value})}>
                    <option value="SAR">SAR (Suspicious Activity)</option>
                    <option value="STR">STR (Suspicious Transaction)</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label style={styles.label}>REPORT STATUS</label>
                  <select 
                    style={{...styles.select, borderLeft: `4px solid ${formData.status === 'Submitted' ? COLORS.success : formData.status === 'Approved' ? COLORS.info : COLORS.warning}`}} 
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Submitted">Submitted</option>
                  </select>
                </div>

                <button style={styles.mainBtn} type="submit" disabled={loading}>
                  {loading ? "..." : isEditing ? "UPDATE REGISTRY" : "ADD TO REGISTRY"}
                </button>
                {isEditing && <button onClick={resetForm} style={styles.cancelBtn}>CANCEL EDIT</button>}
              </form>
            </motion.div>
          </div>

          <div className="col-lg-8">
            <motion.div style={styles.glassCard}>
              <div style={styles.tableHeader}>
                <h5 style={{...styles.cardTitle, margin: 0}}>Audit History</h5>
                
                <div style={styles.searchBox}>
                  <input 
                    type="number" 
                    placeholder="Case ID Search..." 
                    style={styles.searchInput}
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                  />
                  <button style={styles.searchBtn} onClick={fetchAllReports}>🔍</button>
                </div>
              </div>

              <div style={styles.tableArea}>
                <table className="table" style={{ color: COLORS.textMain }}>
                  <thead>
                    <tr>
                      <th style={styles.th}>RECORD INFO</th>
                      <th style={styles.th}>STATUS</th>
                      <th style={styles.th} className="text-end">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.reportID || r.reportId} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: "15px 0" }}>
                          <div style={{ fontWeight: "800", color: COLORS.textMain }}>CASE #{r.caseID || r.caseId}</div>
                          <small style={{ color: COLORS.textMuted, fontWeight: "600" }}>{r.reportType}</small>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <span style={
                              r.status === "Submitted" ? styles.badgeSuccess : 
                              r.status === "Approved" ? styles.badgeInfo : styles.badgePending
                          }>
                            {r.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="text-end" style={{ verticalAlign: "middle" }}>
                          <button style={styles.editBtn} onClick={() => prepareEdit(r)}>✏️</button>
                          <button style={styles.deleteBtn} onClick={() => handleDelete(r.caseID || r.caseId)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {reports.length === 0 && !loading && (
                    <div style={{textAlign: 'center', color: COLORS.textMuted, padding: '40px', fontWeight: 'bold'}}>No Records Found.</div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { background: COLORS.bg, minHeight: "100vh", color: COLORS.textMain, padding: "40px" },
  popup: { position: "fixed", top: "0", left: "50%", zIndex: 9999, background: "white", color: COLORS.textMain, padding: "15px 30px", borderRadius: "12px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", fontWeight: "800", fontSize: "12px", minWidth: "350px", textAlign: "center", border: `1px solid ${COLORS.border}` },
  header: { marginBottom: "40px" },
  logoText: { margin: 0, fontWeight: "900", letterSpacing: "1px", color: COLORS.textMain },
  subLogo: { color: COLORS.electric, fontSize: "10px", fontWeight: "bold", letterSpacing: "2px" },
  glassCard: { background: COLORS.glass, border: `1px solid ${COLORS.border}`, padding: "30px", borderRadius: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" },
  cardTitle: { fontWeight: "800", color: COLORS.textMain, marginBottom: "25px", textTransform: "uppercase", fontSize: "14px", letterSpacing: "1px" },
  label: { fontSize: "10px", fontWeight: "bold", color: COLORS.electric, marginBottom: "8px", display: "block", letterSpacing: "1px" },
  input: { width: "100%", background: COLORS.inputBg, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "12px", color: COLORS.textMain, outline: "none", fontWeight: "600" },
  select: { width: "100%", background: "white", border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "12px", color: COLORS.textMain, cursor: "pointer", fontWeight: "600" },
  mainBtn: { width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: COLORS.textMain, color: "white", fontWeight: "bold", cursor: "pointer", marginTop: "10px", fontSize: "12px" },
  cancelBtn: { width: "100%", background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, padding: "10px", borderRadius: "10px", marginTop: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "11px" },
  tableArea: { maxHeight: "550px", overflowY: "auto" },
  th: { fontSize: "10px", color: COLORS.textMuted, border: "none", paddingBottom: "15px", letterSpacing: "1px" },
  badgePending: { background: "#fffbeb", color: COLORS.warning, padding: "6px 12px", borderRadius: "8px", fontSize: "10px", fontWeight: "900" },
  badgeSuccess: { background: "#f0fdf4", color: COLORS.success, padding: "6px 12px", borderRadius: "8px", fontSize: "10px", fontWeight: "900" },
  badgeInfo: { background: "#eff6ff", color: COLORS.info, padding: "6px 12px", borderRadius: "8px", fontSize: "10px", fontWeight: "900" },
  editBtn: { background: "white", border: `1px solid ${COLORS.border}`, color: COLORS.textMain, padding: "8px 12px", borderRadius: "8px", cursor: "pointer", marginRight: "8px" },
  deleteBtn: { background: "transparent", border: `1px solid ${COLORS.error}`, color: COLORS.error, padding: "8px 12px", borderRadius: "8px", cursor: "pointer" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" },
  searchBox: { display: "flex", background: COLORS.inputBg, borderRadius: "10px", border: `1px solid ${COLORS.border}`, overflow: "hidden", width: "260px" },
  searchInput: { background: "transparent", border: "none", padding: "10px 15px", color: COLORS.textMain, outline: "none", fontSize: "13px", width: "100%", fontWeight: "600" },
  searchBtn: { background: "white", border: "none", color: COLORS.textMain, padding: "0 15px", cursor: "pointer", borderLeft: `1px solid ${COLORS.border}` }
};

export default RegulatoryReport;