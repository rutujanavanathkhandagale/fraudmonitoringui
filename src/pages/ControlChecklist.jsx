import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// --- THEME CONFIGURATION ---
const COLORS = {
  void: "#0a0219",
  electric: "#d3309a",
  glow: "#a730d3",
  textMuted: "#b4abbb",
  glass: "rgba(255, 255, 255, 0.03)",
  border: "rgba(255, 255, 255, 0.1)"
};

const ControlChecklist = () => {
  // --- STATE MANAGEMENT ---
  const [caseId, setCaseId] = useState("");
  const [checkedBy] = useState("Gangothri"); // Static for now based on user profile
  const [isAutoVerifying, setIsAutoVerifying] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [history, setHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Endpoint fixed (removed double slash)
  const [controls, setControls] = useState([
    { id: 1, name: "KYC Verification", status: "PENDING", endpoint: "https://localhost:44372/api/KYCProfiles/customer" },
    { id: 2, name: "Transaction Pattern", status: "PENDING", endpoint: "https://localhost:44372/api/TransactionPattern" },
    { id: 3, name: "Watchlist Entity", status: "PENDING", endpoint: "https://localhost:44372/api/Watchlist/verify" },
  ]);

  // --- AUTOMATION LOGIC ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (caseId && caseId.trim().length > 0) {
        runAutomation(caseId);
      } else {
        setControls(prev => prev.map(c => ({ ...c, status: "PENDING" })));
      }
    }, 800); 

    return () => clearTimeout(delayDebounceFn);
  }, [caseId]);

  const runAutomation = async (id) => {
    setIsAutoVerifying(true);
    try {
      let txnId = 1;
      try {
        const txnRef = await axios.get(`https://localhost:44372/api/ControlChecklist/GetTransactionId/${id}`);
        txnId = txnRef.data;
      } catch (e) { console.warn("Using default txnId 1"); }

      const verifyPromises = controls.map(async (ctrl, index) => {
        try {
          let url = `${ctrl.endpoint}/${id}`;
          if (ctrl.name === "Transaction Pattern") {
            url = `${ctrl.endpoint}/${id}/${txnId}`;
          }

          const res = await axios.get(url);
          const data = res.data;

          // NORMALIZER
          const normalize = (val) => (val || "").toString().trim().toUpperCase();
          let isPassed = false;

          // ================= KYC LOGIC (UPDATED) =================
          if (ctrl.name === "KYC Verification") {
            // Checks for "VERIFIED" string OR a boolean true from the backend
            isPassed = normalize(data.status) === "VERIFIED" || 
                       data.isVerified === true || 
                       normalize(data.kycStatus) === "VERIFIED";
          }
          // ================= WATCHLIST =================
          else if (ctrl.name === "Watchlist Entity") {
            isPassed = data == null || data.match === false || normalize(data.status) === "PASS";
          }
          // ================= TRANSACTION =================
          else if (ctrl.name === "Transaction Pattern") {
            isPassed = normalize(data.transactionResult) === "PASS";
          }

          return { index, status: isPassed ? "PASS" : "FAIL" };
        } catch (err) {
          if (ctrl.name === "Watchlist Entity") return { index, status: "PASS" };
          return { index, status: "FAIL" };
        }
      });

      const results = await Promise.all(verifyPromises);
      setControls(prev => {
        const updated = [...prev];
        results.forEach(res => { updated[res.index].status = res.status; });
        return updated;
      });
    } finally {
      setIsAutoVerifying(false);
    }
  };

  // --- DATA ACTIONS ---
  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get("https://localhost:44372/api/ControlChecklist");
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error("Load failed", err); }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handlePost = async () => {
    if (!caseId) return alert("Please enter a Case ID");
    if (controls.some(c => c.status === "PENDING")) return alert("Automation in progress...");
    
    setIsSaving(true);
    const overall = controls.every(c => c.status === "PASS") ? "PASS" : "FAIL";
    
    // UPDATED PAYLOAD: Includes Details list for the backend
    const payload = {
      caseID: parseInt(caseId),
      checkedBy: checkedBy,
      overallResult: overall,
      details: controls.map(c => ({
        controlName: c.name,
        status: c.status
      }))
    };

    try {
      const response = await axios.post("https://localhost:44372/api/ControlChecklist", payload);
      if (response.status === 200 || response.status === 201) {
        alert("✅ Audit committed to Database!");
        fetchHistory();
        setCaseId("");
      }
    } catch (err) {
      alert("Post failed. Check if Case ID exists.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this audit record?")) return;
    try {
      // Use the unique Database ID for deletion
      await axios.delete(`https://localhost:44372/api/ControlChecklist/${id}`);
      alert("🗑️ Record deleted");
      fetchHistory();
    } catch (err) { alert("Delete failed."); }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.orb1}></div>
      <div style={styles.orb2}></div>

      <div className="container-fluid" style={{ position: "relative", zIndex: 10, padding: "40px" }}>
        <header style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={styles.logoIcon}>🛡️</div>
            <div>
              <h2 style={styles.logoText}>CONTROL<span style={{color: COLORS.electric}}>CHECKLIST</span></h2>
              <small style={styles.subLogo}>AUTO-SCANNING MODE ACTIVE</small>
            </div>
          </div>
        </header>

        <div className="row g-4">
          <div className="col-lg-4">
            <motion.div style={styles.glassCard} layout>
              <h5 style={{ fontWeight: 900, marginBottom: "25px", color: COLORS.electric }}>NEW AUDIT</h5>
              
              <div className="mb-3" style={{position: 'relative'}}>
                <label style={styles.label}>CUSTOMER ID</label>
                <input 
                  style={styles.input} 
                  value={caseId} 
                  onChange={(e) => setCaseId(e.target.value)} 
                  placeholder="Type ID..." 
                />
                {isAutoVerifying && <div style={styles.loaderLine} />}
              </div>

              <div className="mb-4">
                <p style={styles.sectionTitle}>SYSTEM SCAN</p>
                {controls.map((c, i) => (
                  <div key={i} style={styles.moduleRow}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{c.name}</span>
                    <span style={{
                        fontSize: "0.75rem", 
                        fontWeight: "900",
                        color: c.status === 'PASS' ? "#10b981" : c.status === 'FAIL' ? "#ef4444" : COLORS.textMuted
                    }}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                style={{...styles.generateBtn, opacity: (isAutoVerifying || !caseId) ? 0.5 : 1}} 
                onClick={handlePost}
                disabled={isAutoVerifying || !caseId || isSaving}
              >
                {isSaving ? "SYNCING..." : "PUSH TO DATABASE"}
              </button>
            </motion.div>
          </div>

          <div className="col-lg-8">
            <motion.div style={styles.glassCard}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 style={{ fontWeight: 900, margin: 0 }}>AUDIT STREAM</h5>
                <select style={styles.select} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="ALL">ALL RESULTS</option>
                  <option value="PASS">PASS ONLY</option>
                  <option value="FAIL">FAIL ONLY</option>
                </select>
              </div>
              
              <div style={styles.tableScroll}>
                <table className="table table-hover mb-0" style={{ color: "white" }}>
                  <thead>
                    <tr style={{ border: 'none' }}>
                      <th style={styles.th}>CASE DETAILS</th>
                      <th className="text-center" style={styles.th}>OVERALL</th>
                      <th className="text-end" style={styles.th}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.filter(h => statusFilter === "ALL" || (h.overallResult || h.result) === statusFilter).map((h, idx) => (
                      <tr key={h.id || idx} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: "15px" }}>
                          <div style={{ color: COLORS.electric, fontWeight: "bold" }}>ID: {h.caseID || h.caseId}</div>
                          <div style={{ fontSize: "0.8rem", opacity: 0.6 }}>Officer: {h.checkedBy}</div>
                        </td>
                        <td className="text-center align-middle">
                          <span style={{
                            ...styles.statusBadge, 
                            color: (h.overallResult || h.result) === 'PASS' ? "#10b981" : "#ef4444", 
                            borderColor: (h.overallResult || h.result) === 'PASS' ? "#10b981" : "#ef4444"
                          }}>
                            {h.overallResult || h.result}
                          </span>
                        </td>
                        <td className="text-end align-middle">
                          <button style={styles.actionBtn} onClick={fetchHistory}>🔄</button>
                          <button 
                             style={{...styles.actionBtn, color: '#ef4444', marginLeft: '10px'}} 
                             onClick={() => handleDelete(h.id)}
                          >
                             🗑️
                          </button>
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
};

const styles = {
  wrapper: { background: COLORS.void, minHeight: "100vh", color: "white", position: "relative", overflow: "hidden", fontFamily: "'Inter', sans-serif" },
  orb1: { position: "absolute", top: "-10%", right: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, #2d0d54 0%, transparent 70%)", opacity: 0.6 },
  orb2: { position: "absolute", bottom: "-10%", left: "5%", width: "400px", height: "400px", background: "radial-gradient(circle, #d3309a11 0%, transparent 70%)", opacity: 0.4 },
  header: { marginBottom: "40px" },
  logoIcon: { width: "45px", height: "45px", background: COLORS.electric, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" },
  logoText: { margin: 0, letterSpacing: "2px", fontWeight: "900" },
  subLogo: { color: COLORS.electric, fontSize: "9px", fontWeight: "bold", letterSpacing: "1px" },
  glassCard: { background: COLORS.glass, border: `1px solid ${COLORS.border}`, padding: "30px", borderRadius: "24px", backdropFilter: "blur(20px)" },
  label: { fontSize: "0.7rem", fontWeight: "bold", color: COLORS.textMuted, marginBottom: "8px", display: "block" },
  input: { background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: "white", padding: "12px", borderRadius: "12px", width: "100%", outline: "none" },
  loaderLine: { position: 'absolute', bottom: 0, left: '12px', right: '12px', height: '2px', background: COLORS.electric, animation: 'pulse 1.5s infinite' },
  sectionTitle: { fontSize: "0.7rem", fontWeight: "900", color: COLORS.textMuted, marginBottom: "15px" },
  moduleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "12px 20px", borderRadius: "12px", marginBottom: "10px" },
  generateBtn: { background: `linear-gradient(45deg, ${COLORS.glow}, ${COLORS.electric})`, border: "none", color: "white", padding: "15px", borderRadius: "15px", fontWeight: "bold", width: "100%", cursor: 'pointer' },
  select: { background: "#1a102e", color: "white", border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "8px", fontSize: "0.8rem" },
  tableScroll: { maxHeight: "500px", overflowY: "auto" },
  th: { color: COLORS.textMuted, fontSize: "0.75rem", padding: "15px", border: "none" },
  statusBadge: { padding: "4px 15px", borderRadius: "20px", fontSize: "0.65rem", fontWeight: "900", border: "1px solid" },
  actionBtn: { background: "transparent", border: "none", color: COLORS.electric, cursor: "pointer", fontSize: "1.1rem" }
};

export default ControlChecklist;