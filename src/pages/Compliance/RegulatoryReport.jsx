import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiEdit2, FiTrash2, FiAlertCircle, FiCheck, FiFileText, FiX } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const API_BASE = "https://localhost:44372/api/RegulatoryReport";
const CASE_API = "https://localhost:44372/api/Case";

function RegulatoryReport() {
  const { currentColors, actualTheme } = useTheme();
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

  // Unified Theme Logic
  const accentColor = actualTheme === 'frost' ? "#34abe0" : "#d000f5";
  
  const appBackground = actualTheme === 'dark' 
    ? "linear-gradient(180deg, #2e003e 0%, #1a0620 100%)" 
    : "linear-gradient(135deg, #fce7f3 0%, #e0f2fe 50%, #f0f9ff 100%)";

  const glassEffect = { 
    backdropFilter: "blur(12px)", 
    border: `1px solid ${currentColors.border}`,
    backgroundColor: actualTheme === 'dark' ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.6)"
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  useEffect(() => {
    if (searchId === "") fetchAllReports();
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
    } finally { setLoading(false); }
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
          notify("No changes detected.", "warning");
          setLoading(false);
          return;
        }
        await axios.put(`${API_BASE}/case/${targetCaseId}`, { 
            reportType: formData.reportType, 
            status: formData.status 
        });
        notify("Registry updated successfully.", "success");
      } else {
        if (!caseValid) throw new Error(`Case ID #${targetCaseId} not found.`);
        const dupCheck = await axios.get(`${API_BASE}/case/${targetCaseId}`);
        const alreadyExists = Array.isArray(dupCheck.data) ? dupCheck.data.length > 0 : !!dupCheck.data;
        if (alreadyExists) throw new Error(`Report already exists for Case #${targetCaseId}`);

        await axios.post(API_BASE, { 
          ...formData, 
          caseID: targetCaseId,
          period: "Weekly",
          submittedDate: new Date().toISOString()
        });
        notify("Report added to registry.", "success");
      }
      resetForm();
      fetchAllReports();
    } catch (err) {
      notify(err.message || "API Transmission failed.", "error");
    } finally { setLoading(false); }
  };

  const handleDelete = async (caseId) => {
    if (!window.confirm(`Delete report for Case #${caseId}?`)) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/case/${caseId}`);
      notify(`Case #${caseId} deleted from records.`, "warning");
      fetchAllReports();
    } catch (err) {
      notify("Delete failed: Server rejection.", "error");
    } finally { setLoading(false); }
  };

  const resetForm = () => {
    setIsEditing(false);
    setOriginalData(null);
    setCaseValid(null);
    setFormData({ caseID: "", reportType: "SAR", status: "Pending" });
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Submitted': return { bg: 'rgba(22, 163, 74, 0.1)', text: '#16a34a' };
      case 'Approved': return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' };
      default: return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' };
    }
  };

  return (
    <div style={{ ...styles.wrapper, background: appBackground, color: currentColors.textPrimary }}>
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ y: -50, x: "-50%", opacity: 0 }}
            animate={{ y: 20, x: "-50%", opacity: 1 }}
            exit={{ y: -50, x: "-50%", opacity: 0 }}
            style={{ ...styles.popup, backgroundColor: currentColors.cardBg, color: currentColors.textPrimary, borderColor: currentColors.border, backdropFilter: "blur(10px)" }}
          >
            <div style={{ ...styles.popBar, background: notification.type === 'error' ? '#dc2626' : notification.type === 'warning' ? '#f59e0b' : '#16a34a' }} />
            {notification.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-fluid">
        <header style={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ ...styles.iconBox, background: accentColor }}>
                    <FiFileText color="white" size={24} />
                </div>
                <div>
                    <h2 style={{ ...styles.logoText, color: currentColors.textPrimary }}>REGULATORY <span style={{ color: accentColor }}>REPORT</span></h2>
                    <small style={{ ...styles.subLogo, color: accentColor }}>COMPLIANCE AUDIT TERMINAL</small>
                </div>
            </div>
        </header>

        <div className="row g-4">
          <div className="col-lg-4">
            <motion.div style={{ ...styles.glassCard, ...glassEffect }} layout>
              <h5 style={{ ...styles.cardTitle, color: accentColor }}>{isEditing ? "Modify Entry" : "Registry Entry"}</h5>
              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label style={{ ...styles.label, color: accentColor }}>CASE ID</label>
                  <input 
                    style={{
                      ...styles.input, 
                      backgroundColor: currentColors.appBg,
                      color: currentColors.textPrimary,
                      borderColor: caseValid === true ? "#16a34a" : caseValid === false ? "#dc2626" : currentColors.border
                    }} 
                    type="number" 
                    value={formData.caseID} 
                    placeholder="Search Case..." 
                    onChange={(e) => { setFormData({...formData, caseID: e.target.value}); validateCaseInstant(e.target.value); }} 
                    disabled={isEditing} 
                    required 
                  />
                  {caseValid === false && <small style={{ color: "#dc2626", fontSize: '10px', fontWeight: 'bold' }}>Case ID invalid</small>}
                </div>

                <div className="mb-3">
                  <label style={{ ...styles.label, color: accentColor }}>REPORT TYPE</label>
                  <select 
                    style={{ ...styles.select, backgroundColor: currentColors.appBg, color: currentColors.textPrimary, borderColor: currentColors.border }} 
                    value={formData.reportType} 
                    onChange={(e) => setFormData({...formData, reportType: e.target.value})}
                  >
                    <option value="SAR">SAR (Suspicious Activity)</option>
                    <option value="STR">STR (Suspicious Transaction)</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label style={{ ...styles.label, color: accentColor }}>REPORT STATUS</label>
                  <select 
                    style={{ ...styles.select, backgroundColor: currentColors.appBg, color: currentColors.textPrimary, borderColor: currentColors.border }} 
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Submitted">Submitted</option>
                  </select>
                </div>

                <button style={{ ...styles.mainBtn, background: accentColor }} type="submit" disabled={loading}>
                  {loading ? "PROCESSING..." : isEditing ? "UPDATE REGISTRY" : "ADD TO REGISTRY"}
                </button>
                {isEditing && (
                    <button onClick={resetForm} type="button" style={{ ...styles.cancelBtn, color: currentColors.textSecondary, borderColor: currentColors.border }}>
                        <FiX style={{ marginRight: '5px' }} /> CANCEL EDIT
                    </button>
                )}
              </form>
            </motion.div>
          </div>

          <div className="col-lg-8">
            <motion.div style={{ ...styles.glassCard, ...glassEffect }}>
              <div style={styles.tableHeader}>
                <h5 style={{ ...styles.cardTitle, color: accentColor, margin: 0 }}>Audit History</h5>
                
                <div style={{ ...styles.searchBox, backgroundColor: currentColors.appBg, borderColor: currentColors.border }}>
                  <FiSearch style={{ color: currentColors.textSecondary, marginLeft: '12px' }} />
                  <input 
                    type="number" 
                    placeholder="Case ID Search..." 
                    style={{ ...styles.searchInput, color: currentColors.textPrimary }}
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.tableArea}>
                <table className="table" style={{ color: currentColors.textPrimary, background: 'transparent' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${currentColors.border}` }}>
                      <th style={{ ...styles.th, color: currentColors.textSecondary }}>RECORD INFO</th>
                      <th style={{ ...styles.th, color: currentColors.textSecondary }}>STATUS</th>
                      <th style={{ ...styles.th, color: currentColors.textSecondary }} className="text-end">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => {
                      const s = getStatusStyle(r.status);
                      return (
                        <tr key={r.reportID || r.reportId} style={{ borderBottom: `1px solid ${currentColors.border}` }}>
                          <td style={{ padding: "18px 0" }}>
                            <div style={{ fontWeight: "800" }}>CASE #{r.caseID || r.caseId}</div>
                            <small style={{ color: currentColors.textSecondary, fontWeight: "700" }}>{r.reportType}</small>
                          </td>
                          <td style={{ verticalAlign: "middle" }}>
                            <span style={{ 
                                backgroundColor: s.bg, 
                                color: s.text, 
                                padding: "6px 12px", 
                                borderRadius: "8px", 
                                fontSize: "10px", 
                                fontWeight: "900" 
                            }}>
                              {r.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="text-end" style={{ verticalAlign: "middle" }}>
                            <button style={{ ...styles.actionBtn, color: currentColors.textPrimary, borderColor: currentColors.border }} onClick={() => prepareEdit(r)}>
                                <FiEdit2 size={14} />
                            </button>
                            <button style={styles.deleteBtn} onClick={() => handleDelete(r.caseID || r.caseId)}>
                                <FiTrash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {reports.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', color: currentColors.textSecondary, padding: '60px' }}>
                        <FiAlertCircle size={30} style={{ marginBottom: '10px', opacity: 0.5 }} />
                        <div style={{ fontWeight: '800', fontSize: '13px' }}>NO REGULATORY RECORDS FOUND</div>
                    </div>
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
  wrapper: { minHeight: "100vh", padding: "40px" },
  popup: { position: "fixed", top: "20px", left: "50%", zIndex: 9999, padding: "16px 30px", borderRadius: "12px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", fontWeight: "800", fontSize: "12px", minWidth: "350px", textAlign: "center", border: `1px solid`, overflow: 'hidden' },
  popBar: { position: 'absolute', top: 0, left: 0, width: '100%', height: '4px' },
  header: { marginBottom: "40px" },
  iconBox: { width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' },
  logoText: { margin: 0, fontWeight: "900" },
  subLogo: { fontSize: "10px", fontWeight: "800", letterSpacing: "2px", textTransform: 'uppercase' },
  glassCard: { padding: "35px", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)" },
  cardTitle: { fontWeight: "800", marginBottom: "25px", textTransform: "uppercase", fontSize: "14px", letterSpacing: "1.5px" },
  label: { fontSize: "11px", fontWeight: "900", marginBottom: "8px", display: "block", letterSpacing: "1px" },
  input: { width: "100%", border: `1px solid`, borderRadius: "14px", padding: "14px", outline: "none", fontWeight: "700", fontSize: '14px' },
  select: { width: "100%", border: `1px solid`, borderRadius: "14px", padding: "14px", cursor: "pointer", fontWeight: "700", outline: 'none', fontSize: '14px' },
  mainBtn: { width: "100%", padding: "16px", borderRadius: "14px", border: "none", color: "white", fontWeight: "900", cursor: "pointer", marginTop: "10px", fontSize: "12px", letterSpacing: '1px' },
  cancelBtn: { width: "100%", background: "transparent", border: `1px solid`, padding: "12px", borderRadius: "14px", marginTop: "12px", cursor: "pointer", fontWeight: "800", fontSize: "11px", display: 'flex', alignItems: 'center', justifyContent: 'center' },
  tableArea: { maxHeight: "550px", overflowY: "auto" },
  th: { fontSize: "11px", fontWeight: '800', border: "none", paddingBottom: "15px", letterSpacing: "1.5px" },
  actionBtn: { background: "transparent", border: `1px solid`, padding: "8px 12px", borderRadius: "10px", cursor: "pointer", marginRight: "8px" },
  deleteBtn: { background: "rgba(220, 38, 38, 0.1)", border: "none", color: "#dc2626", padding: "8px 12px", borderRadius: "10px", cursor: "pointer" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" },
  searchBox: { display: "flex", alignItems: 'center', borderRadius: "14px", border: `1px solid`, overflow: "hidden", width: "280px" },
  searchInput: { background: "transparent", border: "none", padding: "12px 15px", outline: "none", fontSize: "14px", width: "100%", fontWeight: "700" }
};

export default RegulatoryReport;