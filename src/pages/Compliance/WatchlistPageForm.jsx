import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// --- CONFIGURATION ---
const BASE_URL = "https://localhost:44372";
const API = axios.create({ baseURL: `${BASE_URL}/api` });

const watchlistService = {
  verify: (customerId) => API.get(`/Watchlist/verify/${customerId}`),
  getEntries: () => API.get("/Watchlist"),
  saveEntry: (data) => API.post("/Watchlist", data),
  updateEntry: (data) => API.put(`/Watchlist/${data.entryId}`, data),
  deleteEntry: (id) => API.delete(`/Watchlist/${id}`),
};

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

function WatchlistPageForm() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ entryId: null, name: "", identifier: "", listType: "Sanctions", status: "Active" });
  const [notification, setNotification] = useState({ open: false, message: "", type: "info" });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [entitySearchId, setEntitySearchId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (entitySearchId === "") setSearchTerm("");
  }, [entitySearchId]);

  const fetchData = async () => {
    try {
      const { data } = await watchlistService.getEntries();
      setEntries(data || []);
    } catch (err) { console.error("Fetch error:", err); }
  };

  const handleVerifyAutomation = async () => {
    if (!entitySearchId.trim()) return;
    setIsVerifying(true);
    try {
      const response = await watchlistService.verify(entitySearchId);
      const data = response.data;
      setSearchTerm(entitySearchId);

      if (data.status === "FAIL" || data.match === true) {
        const matchedEntry = entries.find(e => e.identifier?.toString() === entitySearchId.toString());
        if (matchedEntry) handleOpenModal("view", matchedEntry); 

        setNotification({
          open: true,
          message: `THREAT DETECTED: Account #${entitySearchId} found in ${data.listType || 'Watchlist'}.`,
          type: "danger"
        });
      } else {
        setNotification({
          open: true,
          message: `SYSTEM CLEAR: No matches found for Account #${entitySearchId}.`,
          type: "success"
        });
      }
    } catch (err) { 
      setNotification({ open: true, message: "Connection Error: Check API status.", type: "danger" }); 
    } finally { setIsVerifying(false); }
  };

  const handleOpenModal = (mode, entry = null) => {
    setModalMode(mode);
    setForm(entry || { entryId: null, name: "", identifier: "", listType: "Sanctions", status: "Active" });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, entryId: form.entryId || 0 };
      const res = form.entryId ? await watchlistService.updateEntry(payload) : await watchlistService.saveEntry(payload);
      if (res.status === 200 || res.status === 201) {
        setNotification({ open: true, message: "SUCCESS: List updated.", type: "success" });
        setModalOpen(false);
        fetchData();
      }
    } catch (error) { setNotification({ open: true, message: "ERROR: Database rejection.", type: "danger" }); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this record from terminal?")) {
      try { await watchlistService.deleteEntry(id); fetchData(); } 
      catch (err) { setNotification({ open: true, message: "DELETE FAILED.", type: "danger" }); }
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.name?.toLowerCase().includes(searchTerm.toLowerCase()) || entry.identifier?.toString().includes(searchTerm);
    const matchesFilter = filterType === "all" || entry.listType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={styles.wrapper}>
      <div className="container-fluid">
        
        {/* Header */}
        <header style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={styles.logoIcon}>🛡️</div>
            <div>
              <h1 style={styles.logoText}>WATCHLIST <span style={{color: COLORS.electric}}>ENTITY</span></h1>
              <small style={styles.subLogo}>FRAUDSHIELD SECURE TERMINAL</small>
            </div>
          </div>
          <button style={styles.addBtn} onClick={() => handleOpenModal("add")}>+ NEW ENTRY</button>
        </header>

        {/* Intelligence Summary Cards */}
        <div className="row g-4 mb-5">
          {[
            { label: "TOTAL WATCHED", val: entries.length, color: COLORS.textMain },
            { label: "SANCTIONS", val: entries.filter(e => e.listType === "Sanctions").length, color: COLORS.danger },
            { label: "PEP ACTIVE", val: entries.filter(e => e.listType === "PEP").length, color: COLORS.glow },
            { label: "BLACKLISTED", val: entries.filter(e => e.listType === "InternalBlackList").length, color: COLORS.success }
          ].map((stat, i) => (
            <div key={i} className="col-md-3">
              <motion.div whileHover={{ y: -3 }} style={styles.intelCard}>
                <small style={styles.cardLabel}>{stat.label}</small>
                <h2 style={{ color: stat.color, margin: 0, fontWeight: "900" }}>{stat.val}</h2>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Search Controls */}
        <div className="row g-3 mb-4">
            <div className="col-md-6">
                <div style={styles.glassSearch}>
                    <input style={styles.searchInput} placeholder="Scan Account ID..." value={entitySearchId} onChange={(e) => setEntitySearchId(e.target.value)} />
                    <button style={styles.verifyBtn} onClick={handleVerifyAutomation}>{isVerifying ? "..." : "SCAN"}</button>
                </div>
            </div>
            <div className="col-md-6">
                <div style={styles.glassSearch}>
                    <input style={styles.searchInput} placeholder="Filter list..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <select style={styles.filterDropdown} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="all">ALL CATEGORIES</option>
                        <option value="Sanctions">SANCTIONS</option>
                        <option value="PEP">PEP</option>
                        <option value="InternalBlackList">BLACKLIST</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Data Table */}
        <div className="table-responsive" style={styles.tableCard}>
          <table className="table mb-0">
            <thead>
              <tr>
                <th style={styles.th}>ENTITY NAME</th>
                <th style={styles.th}>ACCOUNT NUMBER</th>
                <th style={styles.th}>LIST TYPE</th>
                <th style={styles.th}>STATUS</th>
                <th style={{ ...styles.th, textAlign: "center" }}>COMMANDS</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(entry => (
                <tr key={entry.entryId} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={styles.td}>{entry.name}</td>
                  <td style={styles.td}><span style={{ color: COLORS.electric, fontWeight: "800" }}>{entry.identifier}</span></td>
                  <td style={styles.td}><span style={styles.pill}>{entry.listType}</span></td>
                  <td style={styles.td}>
                    <span style={{ color: entry.status === "Active" ? COLORS.success : COLORS.danger, fontWeight: "800", fontSize: '12px' }}>
                        ● {entry.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button style={styles.actionBtn} onClick={() => handleOpenModal("view", entry)}>👁️</button>
                      <button style={{ ...styles.actionBtn, color: COLORS.danger }} onClick={() => handleDelete(entry.entryId)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- INTEL PROFILE MODAL --- */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.overlay}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={styles.overlayBox}>
              <div style={styles.overlayHeader}>
                <h5 style={{ margin: 0, fontWeight: "800", fontSize: '14px' }}>{modalMode === "view" ? "ENTITY PROFILE" : "CREATE RECORD"}</h5>
                <button style={styles.closeBtn} onClick={() => setModalOpen(false)}>×</button>
              </div>
              <div style={{ padding: "30px" }}>
                <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-12">
                    <label style={styles.detailLabel}>ENTITY NAME</label>
                    <input style={styles.formInput} value={form.name} readOnly={modalMode === "view"} onChange={(e) => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="col-12">
                    <label style={styles.detailLabel}>ACCOUNT NUMBER</label>
                    <input style={styles.formInput} value={form.identifier} readOnly={modalMode === "view"} onChange={(e) => setForm({...form, identifier: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label style={styles.detailLabel}>LIST CATEGORY</label>
                    <select style={styles.formInput} disabled={modalMode === "view"} value={form.listType} onChange={(e) => setForm({...form, listType: e.target.value})}>
                      <option value="Sanctions">Sanctions</option>
                      <option value="PEP">PEP</option>
                      <option value="InternalBlackList">Internal Blacklist</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label style={styles.detailLabel}>STATUS</label>
                    <select style={styles.formInput} disabled={modalMode === "view"} value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  {modalMode !== "view" && <button type="submit" style={styles.saveBtn} className="mt-4">COMMIT TO LIST</button>}
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NOTIFICATION POPUP --- */}
      <AnimatePresence>
        {notification.open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.overlay}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{...styles.overlayBox, maxWidth: '400px', textAlign: 'center', padding: '40px', borderColor: notification.type === 'danger' ? COLORS.danger : COLORS.success }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{notification.type === 'danger' ? '🚨' : '✅'}</div>
              <h4 style={{ fontWeight: '900', color: notification.type === 'danger' ? COLORS.danger : COLORS.success }}>{notification.type === 'danger' ? 'THREAT DETECTED' : 'SYSTEM CLEAR'}</h4>
              <p style={{ color: COLORS.textMuted, fontWeight: '600' }}>{notification.message}</p>
              <button style={{ ...styles.saveBtn, marginTop: '20px', background: notification.type === 'danger' ? COLORS.danger : COLORS.success }} onClick={() => setNotification({ ...notification, open: false })}>ACKNOWLEDGE</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  wrapper: { background: COLORS.bg, minHeight: "100vh", color: COLORS.textMain, padding: "40px", fontFamily: 'Inter, sans-serif' },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" },
  logoIcon: { width: "40px", height: "40px", background: COLORS.textMain, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" },
  logoText: { margin: 0, letterSpacing: "1px", fontSize: "1.3rem", fontWeight: "900" },
  subLogo: { color: COLORS.electric, fontSize: "10px", fontWeight: "bold", letterSpacing: "1px" },
  addBtn: { background: COLORS.textMain, border: "none", color: "white", padding: "10px 20px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "11px" },
  intelCard: { background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, padding: "20px", borderRadius: "20px" },
  cardLabel: { color: COLORS.textMuted, fontSize: "9px", letterSpacing: "1px", fontWeight: "800", display: "block", marginBottom: "5px" },
  glassSearch: { background: COLORS.inputBg, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "6px", display: "flex" },
  searchInput: { background: "transparent", border: "none", color: COLORS.textMain, padding: "8px 12px", flex: 1, outline: "none", fontSize: "13px", fontWeight: "600" },
  verifyBtn: { background: "white", border: `1px solid ${COLORS.border}`, color: COLORS.textMain, padding: "0 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "11px" },
  filterDropdown: { background: COLORS.textMain, border: "none", color: "white", padding: "0 10px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "10px", outline: "none" },
  tableCard: { background: "white", border: `1px solid ${COLORS.border}`, borderRadius: "20px", overflow: "hidden" },
  th: { color: COLORS.textMuted, fontSize: "10px", padding: "15px 20px", background: COLORS.cardBg, fontWeight: "800", letterSpacing: "1px", border: "none" },
  td: { padding: "15px 20px", fontSize: "13px", fontWeight: "600", color: COLORS.textMain },
  pill: { padding: "4px 10px", borderRadius: "6px", fontSize: "10px", background: COLORS.inputBg, fontWeight: "bold", border: `1px solid ${COLORS.border}` },
  actionBtn: { background: "white", border: `1px solid ${COLORS.border}`, color: COLORS.textMain, width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer" },
  saveBtn: { background: COLORS.textMain, border: "none", color: "white", padding: "14px", borderRadius: "10px", fontWeight: "bold", width: "100%", cursor: "pointer", fontSize: "12px" },
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" },
  overlayBox: { background: "white", border: `1px solid ${COLORS.border}`, borderRadius: "24px", width: "95%", maxWidth: "450px", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" },
  overlayHeader: { padding: "20px 30px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
  closeBtn: { background: "transparent", border: "none", color: COLORS.textMuted, fontSize: "1.5rem", cursor: "pointer" },
  detailLabel: { color: COLORS.textMuted, fontSize: '10px', fontWeight: '800', display: 'block', marginBottom: '5px' },
  formInput: { background: COLORS.inputBg, border: `1px solid ${COLORS.border}`, color: COLORS.textMain, padding: "12px", borderRadius: "10px", width: "100%", outline: "none", marginBottom: "5px", fontWeight: "600" },
};

export default WatchlistPageForm;