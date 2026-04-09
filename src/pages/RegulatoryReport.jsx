import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "https://localhost:44372/api/RegulatoryReport";
const CASE_API = "https://localhost:44372/api/Case";

const COLORS = {
  void: "#060210",
  electric: "#d3309a",
  glow: "#a020f0",
  success: "#10b981",
  info: "#3b82f6", 
  warning: "#f59e0b",
  error: "#ef4444",
  glass: "rgba(255, 255, 255, 0.03)",
  border: "rgba(255, 255, 255, 0.1)",
  textMuted: "#b4abbb"
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

  useEffect(() => {
    fetchAllReports();
  }, []);

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
      setReports(Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
    } catch (err) {
      setReports([]);
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
        // --- NO UPDATION EXCEPTION ---
        if (
          formData.reportType === originalData.reportType &&
          formData.status === originalData.status
        ) {
          notify("NO UPDATION: The report details are already current.", "warning");
          setLoading(false);
          return;
        }

        await axios.put(`${API_BASE}/case/${targetCaseId}`, { 
            reportType: formData.reportType, 
            status: formData.status 
        });
        notify("DATA SYNCHRONIZED: Report updated successfully.", "success");
      } else {
        // --- NEW ENTRY LOGIC ---
        if (!caseValid) throw new Error(`Case ID #${targetCaseId} not found.`);
        
        const dupCheck = await axios.get(`${API_BASE}/case/${targetCaseId}`);
        const alreadyExists = Array.isArray(dupCheck.data) ? dupCheck.data.length > 0 : !!dupCheck.data;
        
        if (alreadyExists) throw new Error(`DENIED: Only 1 report allowed per Case.`);

        await axios.post(API_BASE, { 
          ...formData, 
          caseID: targetCaseId,
          period: "Weekly",
          submittedDate: new Date().toISOString()
        });
        notify("DATA ADDED: New record filed successfully.", "success");
      }
      resetForm();
      fetchAllReports();
    } catch (err) {
      notify(err.message || "SYSTEM ERROR: Transmission failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (caseId) => {
    if (!window.confirm(`Delete report for Case #${caseId}?`)) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/case/${caseId}`);
      notify(`PURGE SUCCESS: Case record deleted.`, "warning");
      fetchAllReports();
    } catch (err) {
      notify("DELETE FAILED: Server error.", "error");
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
      {/* STYLED POPUP NOTIFICATION */}
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

      <div className="container-fluid" style={styles.container}>
        <header style={styles.header}>
            <h2 style={styles.logoText}>REGULATORY<span style={{color: COLORS.electric}}>REPORT</span></h2>
            <small style={styles.subLogo}>COMPLIANCE UNIT</small>
        </header>

        <div className="row g-4">
          <div className="col-lg-4">
            <motion.div style={styles.glassCard} layout>
              <h5 style={styles.cardTitle}>{isEditing ? "Modify Entry" : "Regulatory Report Registry"}</h5>
              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label style={styles.label}> CASE ID</label>
                  <input 
                    style={{...styles.input, borderColor: caseValid === true ? COLORS.success : caseValid === false ? COLORS.error : COLORS.border}} 
                    type="number" 
                    value={formData.caseID} 
                    placeholder="Enter CaseID..." 
                    onChange={(e) => { setFormData({...formData, caseID: e.target.value}); validateCaseInstant(e.target.value); }} 
                    disabled={isEditing} 
                    required 
                  />
                  {caseValid === false && <small style={{color: COLORS.error, fontSize: '10px'}}>Case ID not found</small>}
                </div>

                <div className="mb-3">
                  <label style={styles.label}>REPORT TYPE</label>
                  <select style={styles.select} value={formData.reportType} onChange={(e) => setFormData({...formData, reportType: e.target.value})}>
                    <option value="SAR">SAR (Suspicious Activity Report)</option>
                    <option value="STR">STR (Suspicious Transaction Report)</option>
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
                  {loading ? "TRANSMITTING..." : isEditing ? "UPDATE REGISTRY" : "ADD TO REGISTRY"}
                </button>
                {isEditing && <button onClick={resetForm} style={styles.cancelBtn}>CANCEL EDIT</button>}
              </form>
            </motion.div>
          </div>

          <div className="col-lg-8">
            <motion.div style={styles.glassCard}>
              <h5 style={styles.cardTitle}>Regulatory Report History</h5>
              <div style={styles.tableArea}>
                <table className="table" style={{ color: "white" }}>
                  <thead>
                    <tr>
                      <th style={styles.th}>RECORD DETAILS</th>
                      <th style={styles.th}>STATUS</th>
                      <th style={styles.th} className="text-end">SYSTEM ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.reportID || r.reportId} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: "15px 0" }}>
                          <div style={{ fontWeight: "bold" }}>CASE #{r.caseID || r.caseId}</div>
                          <small style={{ color: COLORS.textMuted }}>{r.reportType}</small>
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
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { background: COLORS.void, minHeight: "100vh", color: "white", padding: "40px" },
  popup: { position: "fixed", top: "0", left: "50%", zIndex: 9999, background: "#120d1d", color: "white", padding: "12px 25px", borderRadius: "8px", boxShadow: "0 8px 32px rgba(0,0,0,0.8)", fontWeight: "600", fontSize: "13px", minWidth: "320px", textAlign: "center", border: `1px solid ${COLORS.border}` },
  header: { marginBottom: "40px" },
  logoText: { margin: 0, fontWeight: "900", letterSpacing: "2px" },
  subLogo: { color: COLORS.electric, fontSize: "10px", fontWeight: "bold" },
  glassCard: { background: COLORS.glass, border: `1px solid ${COLORS.border}`, padding: "30px", borderRadius: "20px", backdropFilter: "blur(15px)" },
  cardTitle: { fontWeight: "800", color: "white", marginBottom: "25px", textTransform: "uppercase", fontSize: "15px" },
  label: { fontSize: "10px", fontWeight: "bold", color: COLORS.electric, marginBottom: "8px", display: "block" },
  input: { width: "100%", background: "rgba(255,255,255,0.03)", border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "12px", color: "white", outline: "none" },
  select: { width: "100%", background: "#0a0712", border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "12px", color: "white", cursor: "pointer" },
  mainBtn: { width: "100%", padding: "14px", borderRadius: "10px", border: "none", background: `linear-gradient(90deg, ${COLORS.glow}, ${COLORS.electric})`, color: "white", fontWeight: "bold", cursor: "pointer", marginTop: "10px" },
  cancelBtn: { width: "100%", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: COLORS.textMuted, padding: "10px", borderRadius: "10px", marginTop: "10px", cursor: "pointer" },
  tableArea: { maxHeight: "500px", overflowY: "auto" },
  th: { fontSize: "10px", color: COLORS.textMuted, border: "none", paddingBottom: "15px" },
  badgePending: { background: "rgba(245,158,11,0.1)", color: COLORS.warning, padding: "4px 10px", borderRadius: "6px", fontSize: "9px", fontWeight: "bold" },
  badgeSuccess: { background: "rgba(16,185,129,0.1)", color: COLORS.success, padding: "4px 10px", borderRadius: "6px", fontSize: "9px", fontWeight: "bold" },
  badgeInfo: { background: "rgba(59,130,246,0.1)", color: COLORS.info, padding: "4px 10px", borderRadius: "6px", fontSize: "9px", fontWeight: "bold" },
  editBtn: { background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "white", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", marginRight: "8px" },
  deleteBtn: { background: "transparent", border: `1px solid ${COLORS.error}`, color: COLORS.error, padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }
};

export default RegulatoryReport;