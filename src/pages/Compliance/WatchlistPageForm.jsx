import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  FiShield, FiPlus, FiEye, FiTrash2, 
  FiSearch, FiFilter, FiAlertCircle, FiCheckCircle 
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const BASE_URL = "https://localhost:44372";
const API = axios.create({ baseURL: `${BASE_URL}/api` });

const watchlistService = {
  verify: (customerId) => API.get(`/Watchlist/verify/${customerId}`),
  getEntries: () => API.get("/Watchlist"),
  saveEntry: (data) => API.post("/Watchlist", data),
  updateEntry: (data) => API.put(`/Watchlist/${data.entryId}`, data),
  deleteEntry: (id) => API.delete(`/Watchlist/${id}`),
};

function WatchlistPageForm() {
  const { currentColors, actualTheme } = useTheme();
  
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ entryId: null, name: "", identifier: "", listType: "Sanctions", status: "Active" });
  const [notification, setNotification] = useState({ open: false, message: "", type: "info" });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [entitySearchId, setEntitySearchId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

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

  useEffect(() => { fetchData(); }, []);

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
    <div style={{ ...styles.wrapper, background: appBackground, color: currentColors.textPrimary }}>
      <div style={styles.contentBody}>
        
        {/* Header */}
        <header style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{ ...styles.logoIcon, background: accentColor }}>
              <FiShield size={22} color="white" />
            </div>
            <div>
              <h1 style={{ ...styles.logoText, color: currentColors.textPrimary }}>WATCHLIST <span style={{color: accentColor}}>ENTITY</span></h1>
              <small style={{ ...styles.subLogo, color: accentColor }}>FRAUDSHIELD SECURE TERMINAL</small>
            </div>
          </div>
          <button style={{ ...styles.addBtn, background: accentColor }} onClick={() => handleOpenModal("add")}>
            <FiPlus className="me-2" /> NEW ENTRY
          </button>
        </header>

        {/* Intelligence Summary Cards */}
        <div className="row g-4 mb-4">
          {[
            { label: "TOTAL WATCHED", val: entries.length, color: currentColors.textPrimary },
            { label: "SANCTIONS", val: entries.filter(e => e.listType === "Sanctions").length, color: "#dc2626" },
            { label: "PEP ACTIVE", val: entries.filter(e => e.listType === "PEP").length, color: "#9333ea" },
            { label: "BLACKLISTED", val: entries.filter(e => e.listType === "InternalBlackList").length, color: "#16a34a" }
          ].map((stat, i) => (
            <div key={i} className="col-md-3">
              <motion.div whileHover={{ y: -5 }} style={{ ...styles.intelCard, ...glassStyle }}>
                <small style={{ ...styles.cardLabel, color: currentColors.textSecondary }}>{stat.label}</small>
                <h2 style={{ color: stat.color, margin: 0, fontWeight: "900", fontSize: '2rem' }}>{stat.val}</h2>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Search Controls */}
        <div className="row g-3 mb-4">
            <div className="col-md-6">
                <div style={{ ...styles.glassSearch, ...glassStyle }}>
                    <FiSearch className="ms-3" style={{ color: currentColors.textSecondary }} />
                    <input style={{ ...styles.searchInput, color: currentColors.textPrimary }} placeholder="Scan Account ID..." value={entitySearchId} onChange={(e) => setEntitySearchId(e.target.value)} />
                    <button style={{ ...styles.verifyBtn, background: accentColor, color: 'white' }} onClick={handleVerifyAutomation}>{isVerifying ? "..." : "SCAN"}</button>
                </div>
            </div>
            <div className="col-md-6">
                <div style={{ ...styles.glassSearch, ...glassStyle }}>
                    <FiFilter className="ms-3" style={{ color: currentColors.textSecondary }} />
                    <input style={{ ...styles.searchInput, color: currentColors.textPrimary }} placeholder="Filter entries..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <select style={{ ...styles.filterDropdown, background: accentColor }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="all">ALL CATEGORIES</option>
                        <option value="Sanctions">SANCTIONS</option>
                        <option value="PEP">PEP</option>
                        <option value="InternalBlackList">BLACKLIST</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Data Table */}
        <div className="table-responsive" style={{ ...styles.tableCard, ...glassStyle }}>
          <table className="table mb-0" style={{ color: currentColors.textPrimary, background: 'transparent' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${currentColors.border}` }}>
                <th style={styles.th}>ENTITY NAME</th>
                <th style={styles.th}>ACCOUNT NUMBER</th>
                <th style={styles.th}>LIST TYPE</th>
                <th style={styles.th}>STATUS</th>
                <th style={{ ...styles.th, textAlign: "center" }}>COMMANDS</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(entry => (
                <tr key={entry.entryId} style={{ borderBottom: `1px solid ${currentColors.border}` }}>
                  <td style={styles.td}>{entry.name}</td>
                  <td style={styles.td}><span style={{ color: accentColor, fontWeight: "800" }}>{entry.identifier}</span></td>
                  <td style={styles.td}><span style={{ ...styles.pill, borderColor: currentColors.border, color: currentColors.textSecondary }}>{entry.listType}</span></td>
                  <td style={styles.td}>
                    <span style={{ color: entry.status === "Active" ? "#16a34a" : "#dc2626", fontWeight: "900", fontSize: '11px', letterSpacing: '0.5px' }}>
                        ● {entry.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                      <button style={{ ...styles.actionBtn, borderColor: currentColors.border, color: currentColors.textPrimary }} onClick={() => handleOpenModal("view", entry)}><FiEye size={16}/></button>
                      <button style={{ ...styles.actionBtn, borderColor: currentColors.border, color: "#dc2626" }} onClick={() => handleDelete(entry.entryId)}><FiTrash2 size={16}/></button>
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
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ ...styles.overlayBox, ...glassStyle }}>
              <div style={{ ...styles.overlayHeader, borderBottom: `1px solid ${currentColors.border}` }}>
                <h5 style={{ margin: 0, fontWeight: "900", fontSize: '15px', color: currentColors.textPrimary }}>{modalMode === "view" ? "ENTITY PROFILE" : "CREATE RECORD"}</h5>
                <button style={{ ...styles.closeBtn, color: currentColors.textSecondary }} onClick={() => setModalOpen(false)}>×</button>
              </div>
              <div style={{ padding: "35px" }}>
                <form onSubmit={handleSubmit} className="row g-4">
                  <div className="col-12">
                    <label style={{ ...styles.detailLabel, color: accentColor }}>ENTITY NAME</label>
                    <input style={{ ...styles.formInput, backgroundColor: currentColors.appBg, color: currentColors.textPrimary, borderColor: currentColors.border }} value={form.name} readOnly={modalMode === "view"} onChange={(e) => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="col-12">
                    <label style={{ ...styles.detailLabel, color: accentColor }}>ACCOUNT NUMBER</label>
                    <input style={{ ...styles.formInput, backgroundColor: currentColors.appBg, color: currentColors.textPrimary, borderColor: currentColors.border }} value={form.identifier} readOnly={modalMode === "view"} onChange={(e) => setForm({...form, identifier: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label style={{ ...styles.detailLabel, color: accentColor }}>LIST CATEGORY</label>
                    <select style={{ ...styles.formInput, backgroundColor: currentColors.appBg, color: currentColors.textPrimary, borderColor: currentColors.border }} disabled={modalMode === "view"} value={form.listType} onChange={(e) => setForm({...form, listType: e.target.value})}>
                      <option value="Sanctions">Sanctions</option>
                      <option value="PEP">PEP</option>
                      <option value="InternalBlackList">Internal Blacklist</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label style={{ ...styles.detailLabel, color: accentColor }}>STATUS</label>
                    <select style={{ ...styles.formInput, backgroundColor: currentColors.appBg, color: currentColors.textPrimary, borderColor: currentColors.border }} disabled={modalMode === "view"} value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  {modalMode !== "view" && <button type="submit" style={{ ...styles.saveBtn, background: accentColor }} className="mt-2">COMMIT TO LIST</button>}
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
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{...styles.overlayBox, maxWidth: '420px', textAlign: 'center', padding: '45px', borderColor: notification.type === 'danger' ? "#dc2626" : "#16a34a", ...glassStyle }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>{notification.type === 'danger' ? <FiAlertCircle color="#dc2626" /> : <FiCheckCircle color="#16a34a" />}</div>
              <h4 style={{ fontWeight: '900', color: notification.type === 'danger' ? "#dc2626" : "#16a34a", letterSpacing: '1px' }}>{notification.type === 'danger' ? 'THREAT DETECTED' : 'SYSTEM CLEAR'}</h4>
              <p style={{ color: currentColors.textSecondary, fontWeight: '700', fontSize: '14px', marginTop: '10px' }}>{notification.message}</p>
              <button style={{ ...styles.saveBtn, marginTop: '25px', background: notification.type === 'danger' ? "#dc2626" : "#16a34a" }} onClick={() => setNotification({ ...notification, open: false })}>ACKNOWLEDGE</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", paddingBottom: "60px" },
  contentBody: { padding: "40px 50px", width: "100%" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "45px" },
  logoIcon: { width: "48px", height: "48px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: '0 8px 20px rgba(0,0,0,0.1)' },
  logoText: { margin: 0, letterSpacing: "1px", fontSize: "1.5rem", fontWeight: "900" },
  subLogo: { fontSize: "10px", fontWeight: "900", letterSpacing: "2px", textTransform: 'uppercase' },
  addBtn: { border: "none", color: "white", padding: "14px 28px", borderRadius: "12px", fontWeight: "900", cursor: "pointer", fontSize: "12px", letterSpacing: '0.5px', display: 'flex', alignItems: 'center' },
  intelCard: { padding: "30px", borderRadius: "24px", boxShadow: '0 10px 40px rgba(0,0,0,0.03)' },
  cardLabel: { fontSize: "11px", letterSpacing: "1.5px", fontWeight: "900", display: "block", marginBottom: "10px", textTransform: 'uppercase' },
  glassSearch: { borderRadius: "16px", padding: "10px", display: "flex", alignItems: 'center', boxShadow: '0 4px 25px rgba(0,0,0,0.03)' },
  searchInput: { background: "transparent", border: "none", padding: "10px 15px", flex: 1, outline: "none", fontSize: "14px", fontWeight: "700" },
  verifyBtn: { border: "none", padding: "10px 30px", borderRadius: "12px", fontWeight: "900", cursor: "pointer", fontSize: "12px", letterSpacing: '0.5px' },
  filterDropdown: { border: "none", color: "white", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "900", fontSize: "11px", outline: "none" },
  tableCard: { borderRadius: "24px", overflow: "hidden", boxShadow: '0 12px 50px rgba(0,0,0,0.05)' },
  th: { fontSize: "11px", padding: "20px 30px", fontWeight: "900", letterSpacing: "1.5px", border: "none", background: "transparent" },
  td: { padding: "20px 30px", fontSize: "14px", fontWeight: "700" },
  pill: { padding: "5px 12px", borderRadius: "10px", fontSize: "11px", background: "rgba(255,255,255,0.2)", fontWeight: "800", border: `1px solid` },
  actionBtn: { background: "transparent", border: "1px solid", width: "40px", height: "40px", borderRadius: "12px", cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
  saveBtn: { border: "none", color: "white", padding: "16px", borderRadius: "14px", fontWeight: "900", width: "100%", cursor: "pointer", fontSize: "13px", letterSpacing: '1px' },
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" },
  overlayBox: { border: `1px solid`, borderRadius: "30px", width: "95%", maxWidth: "500px", boxShadow: "0 30px 70px rgba(0,0,0,0.3)" },
  overlayHeader: { padding: "25px 35px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  closeBtn: { background: "transparent", border: "none", fontSize: "1.8rem", cursor: "pointer" },
  detailLabel: { fontSize: '11px', fontWeight: '900', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' },
  formInput: { border: `1px solid`, padding: "15px", borderRadius: "14px", width: "100%", outline: "none", marginBottom: "5px", fontWeight: "700", fontSize: '14px' },
};

export default WatchlistPageForm;