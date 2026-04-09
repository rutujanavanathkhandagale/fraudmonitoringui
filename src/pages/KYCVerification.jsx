import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const BASE_URL = "https://localhost:44372";
const API = axios.create({ baseURL: `${BASE_URL}/api` });

const kycService = {
  getProfile: (customerId) => API.get(`/KYCProfiles/customer/${customerId}`),
  verifyCustomer: (customerId, payload) => API.put(`/KYCProfiles/verify/customer/${customerId}`, payload),
  sendNotification: (customerId, message) => 
    API.post(`/ComplianceNotification/send-notification?customerId=${customerId}&message=${encodeURIComponent(message)}`),
};

const COLORS = {
  void: "#0a0219",
  electric: "#d3309a",
  glow: "#a730d3",
  textMuted: "#b4abbb",
  success: "#00e676",
  danger: "#ff4b2b",
  border: "rgba(255, 255, 255, 0.1)"
};

const KYCVerification = () => {
  const [searchId, setSearchId] = useState("");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 
  const [inspectingDoc, setInspectingDoc] = useState(null);
  const [isAadharApproved, setIsAadharApproved] = useState(false);

  const getImageUrl = (filePath) => {
    if (!filePath) return null;
    let cleanPath = filePath.replace(/\\/g, "/");
    return cleanPath.startsWith("http") ? cleanPath : `${BASE_URL}/${cleanPath}`;
  };

  const handleFetchKYC = async () => {
    const idToSearch = searchId.trim();
    if (!idToSearch) {
      setError("ENTER CUSTOMER ID");
      setTimeout(() => setError(""), 2000);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await kycService.getProfile(idToSearch);
      const data = response.data;
      
      let docs = [];
      try {
          docs = typeof data.documentRefsJSON === 'string' 
              ? JSON.parse(data.documentRefsJSON) 
              : (data.documentRefsJSON || []);
      } catch (e) { console.error("Data Corruption:", e); }
      
      setCustomer({
        id: data.customerId || data.CustomerId,
        name: data.fullName || data.customer?.fullName || "Verified User",
        status: data.status || data.Status,
        aadhar: docs.find(d => d.Type === "Aadhar"),
        originalData: data 
      });
      setIsAadharApproved(false);
    } catch (e) { 
        setCustomer(null);
        setError(`ID #${idToSearch} NOT FOUND`);
        setTimeout(() => setError(""), 3000);
    } finally { setLoading(false); }
  };

  const handleVerifyNow = async () => {
    if (!customer?.id) return;
    try {
        const payload = { ...customer.originalData, status: "Verified" };
        const response = await kycService.verifyCustomer(customer.id, payload);
        if (response.status === 200 || response.status === 204) {
          await kycService.sendNotification(customer.id, "Your Aadhar KYC has been approved.");
          handleFetchKYC(); 
        }
    } catch (e) { setError("SYNC EXCEPTION: UPDATE FAILED"); }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.orb1}></div>
      
      <div style={{ position: "relative", zIndex: 10, padding: "40px 20px" }}>
        {/* Compact Header */}
        <header style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={styles.logoIcon}>🛡️</div>
            <div>
              <h1 style={styles.logoText}>KYC VERIFICATION</h1>
              <small style={styles.subLogo}>AADHAR AUTHENTICATION TERMINAL</small>
            </div>
          </div>
        </header>

        {/* Centered Search Bar */}
        <div style={styles.searchSection}>
          <motion.div 
            animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
            style={{...styles.glassSearch, borderColor: error ? COLORS.danger : COLORS.border}}
          >
            <input 
              style={{...styles.searchInput, color: error ? COLORS.danger : "white"}}
              placeholder={error || "Enter Customer ID ..."} 
              value={error ? "" : searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchKYC()}
            />
            <button style={{...styles.searchBtn, background: error ? COLORS.danger : COLORS.electric}} onClick={handleFetchKYC}>
              {loading ? "SCANNING..." : "VERIFY ID"}
            </button>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {customer ? (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={styles.mainStack}>
              
              {/* Profile Card */}
              <div style={styles.intelCard}>
                <div style={styles.profileHeader}>
                  <div style={styles.avatarSmall}>{customer.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: "16px" }}>{customer.name}</h3>
                    <p style={{ color: COLORS.electric, margin: "2px 0", fontSize: "11px" }}>CID: {customer.id}</p>
                    <span style={{...styles.statusPill, borderColor: customer.status === "Verified" ? COLORS.success : COLORS.electric, color: customer.status === "Verified" ? COLORS.success : COLORS.electric}}>
                      {customer.status?.toUpperCase()}
                    </span>
                  </div>
                  {customer.status !== "Verified" && (
                    <button 
                        style={{...styles.verifyBtn, opacity: isAadharApproved ? 1 : 0.3}} 
                        disabled={!isAadharApproved}
                        onClick={handleVerifyNow}
                    >COMPLETE KYC</button>
                  )}
                </div>
              </div>

              {/* Aadhar Only Document Node */}
              <div style={styles.docNode} onClick={() => setInspectingDoc({ type: "Aadhar", data: customer.aadhar })}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <div style={styles.docIcon}>🆔</div>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "13px" }}>AADHAR CARD</div>
                      <small style={{ color: COLORS.textMuted, fontSize: "10px" }}>{customer.aadhar?.FileName || "NO FILE ATTACHED"}</small>
                    </div>
                  </div>
                  <button 
                    style={(customer.status === "Verified" || isAadharApproved) ? styles.btnActive : styles.btnGhost} 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      if(customer.status !== "Verified") setIsAadharApproved(true);
                    }}
                  >
                    {(customer.status === "Verified" || isAadharApproved) ? "✓ APPROVED" : "APPROVE"}
                  </button>
                </div>
              </div>

            </motion.div>
          ) : !loading && (
            <div style={styles.exceptionState}>
               <h3 style={{ fontSize: "14px", letterSpacing: "1px" }}>TERMINAL READY</h3>
               <p style={{color: COLORS.textMuted, fontSize: "11px"}}>Awaiting Customer ID for Aadhar validation.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Document Inspector */}
      <AnimatePresence>
        {inspectingDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.overlay}>
            <div style={styles.overlayBox}>
              <div style={styles.overlayHeader}>
                <h4 style={{ margin: 0 }}>AADHAR INSPECTION</h4>
                <button style={styles.closeBtn} onClick={() => setInspectingDoc(null)}>CLOSE</button>
              </div>
              <div style={styles.imagePaddingBox}>
                {inspectingDoc.data ? (
                  <img src={getImageUrl(inspectingDoc.data.FilePath)} alt="KYC" style={styles.fullImg} onError={(e) => e.target.src="https://via.placeholder.com/600x400?text=IMAGE+EXCEPTION"} />
                ) : <div style={{textAlign: "center"}}><h1>🚫</h1><p>DATA REFERENCE MISSING</p></div>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles = {
  wrapper: { background: COLORS.void, minHeight: "100vh", color: "white", position: "relative", fontFamily: "'Inter', sans-serif" },
  orb1: { position: "absolute", top: "-10%", right: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, #2d0d54 0%, transparent 70%)", opacity: 0.5 },
  header: { display: "flex", justifyContent: "center", marginBottom: "40px" },
  logoIcon: { width: "35px", height: "35px", background: COLORS.electric, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" },
  logoText: { margin: 0, letterSpacing: "3px", fontSize: "16px", fontWeight: "900" },
  subLogo: { color: COLORS.electric, fontSize: "8px", fontWeight: "bold", letterSpacing: "1.5px" },
  searchSection: { display: "flex", justifyContent: "center", marginBottom: "30px" },
  glassSearch: { width: "480px", background: "rgba(255,255,255,0.03)", border: "1px solid", borderRadius: "12px", padding: "5px", display: "flex", backdropFilter: "blur(10px)" },
  searchInput: { background: "transparent", border: "none", padding: "8px 15px", flex: 1, outline: "none", fontSize: "13px" },
  searchBtn: { border: "none", color: "white", padding: "8px 20px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "11px" },
  mainStack: { maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "15px" },
  intelCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", padding: "20px", borderRadius: "16px" },
  profileHeader: { display: "flex", alignItems: "center", gap: "20px" },
  avatarSmall: { width: "50px", height: "50px", background: `linear-gradient(45deg, ${COLORS.glow}, ${COLORS.electric})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "900" },
  statusPill: { background: "rgba(255, 255, 255, 0.05)", border: `1px solid`, padding: "2px 8px", borderRadius: "10px", fontSize: "8px", fontWeight: "bold" },
  verifyBtn: { background: COLORS.electric, border: "none", color: "white", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "11px" },
  docNode: { background: "rgba(255,255,255,0.03)", padding: "15px 25px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" },
  btnGhost: { background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "6px 15px", borderRadius: "6px", cursor: "pointer", fontSize: "10px" },
  btnActive: { background: COLORS.success, color: "black", padding: "6px 15px", borderRadius: "6px", fontWeight: "bold", fontSize: "10px" },
  exceptionState: { textAlign: "center", padding: "40px", opacity: 0.5 },
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  overlayBox: { background: COLORS.void, border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", width: "90%", maxWidth: "800px" },
  overlayHeader: { padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", fontSize: "12px" },
  closeBtn: { background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "4px 12px", borderRadius: "6px", fontSize: "10px" },
  imagePaddingBox: { padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" },
  fullImg: { maxWidth: "100%", maxHeight: "60vh", borderRadius: "8px" }
};

export default KYCVerification;