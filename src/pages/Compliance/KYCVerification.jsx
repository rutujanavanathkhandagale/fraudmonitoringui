import React, { useState, useEffect } from "react";
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

// Updated Light Theme Colors
const COLORS = {
  bg: "#ffffff",
  textMain: "#0f172a",
  textMuted: "#64748b",
  electric: "#d3309a",
  success: "#16a34a",
  danger: "#dc2626",
  border: "#e2e8f0",
  glass: "#f8fafc",
  inputBg: "#f1f5f9"
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
      setError("ENTER ID");
      setTimeout(() => setError(""), 2000);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await kycService.getProfile(idToSearch);
      const data = response.data;
      if (!data) throw new Error("EMPTY_RESPONSE");

      let docs = [];
      try {
          docs = typeof data.documentRefsJSON === 'string' 
              ? JSON.parse(data.documentRefsJSON) 
              : (data.documentRefsJSON || []);
      } catch (e) { docs = []; }
      
      setCustomer({
        id: data.customerId || data.CustomerId,
        name: data.fullName || data.customer?.fullName || "Verified User",
        status: data.status || data.Status,
        aadhar: Array.isArray(docs) ? docs.find(d => d.Type === "Aadhar") : null,
        originalData: data 
      });
      setIsAadharApproved(false);
    } catch (e) { 
        setCustomer(null);
        setError("NOT FOUND");
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
    } catch (e) { setError("UPDATE FAILED"); }
  };

  return (
    <div style={styles.wrapper}>
      <div style={{ position: "relative", zIndex: 10 }}>
        
        {/* HEADER SECTION */}
        <div style={styles.headerBanner}>
          <div style={styles.iconBox}>🛡️</div>
          <div style={styles.headerTextGroup}>
            <h1 style={styles.mainTitle}>KYC <span style={styles.accentTitle}>VERIFICATION</span></h1>
            <p style={styles.subTitle}>AADHAR AUTHENTICATION TERMINAL</p>
          </div>
        </div>

        {/* SEARCH SECTION */}
        <div style={styles.searchSection}>
          <motion.div 
            animate={error ? { x: [-3, 3, -3, 3, 0] } : {}}
            style={{...styles.glassSearch, borderColor: error ? COLORS.danger : COLORS.border}}
          >
            <input 
              style={{...styles.searchInput, color: error ? COLORS.danger : COLORS.textMain}}
              placeholder={error || "Enter Customer ID..."} 
              value={error ? "" : searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchKYC()}
            />
            <button 
              style={{...styles.searchBtn, background: error ? COLORS.danger : COLORS.textMain}} 
              onClick={handleFetchKYC}
              disabled={loading}
            >
              {loading ? "..." : "VERIFY"}
            </button>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {customer ? (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={styles.mainStack}>
              <div style={styles.intelCard}>
                <div style={styles.profileHeader}>
                  <div style={styles.avatarMedium}>{customer.name ? customer.name[0] : "?"}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.customerName}>{customer.name}</h3>
                    <p style={styles.customerIdText}>CID: {customer.id}</p>
                    <span style={{
                      ...styles.statusPill, 
                      borderColor: customer.status === "Verified" ? COLORS.success : COLORS.electric, 
                      color: customer.status === "Verified" ? COLORS.success : COLORS.electric
                    }}>
                      {customer.status?.toUpperCase() || "PENDING"}
                    </span>
                  </div>
                  {customer.status !== "Verified" && (
                    <button 
                        style={{...styles.verifyBtn, opacity: isAadharApproved ? 1 : 0.4}} 
                        disabled={!isAadharApproved}
                        onClick={handleVerifyNow}
                    >COMPLETE KYC</button>
                  )}
                </div>
              </div>

              <div style={styles.docNode} onClick={() => setInspectingDoc({ type: "Aadhar", data: customer.aadhar })}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <div style={styles.docIcon}>🆔</div>
                    <div>
                      <div style={styles.docTitle}>AADHAR CARD</div>
                      <small style={styles.docFileName}>{customer.aadhar?.FileName || "NO FILE"}</small>
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
               <h3 style={styles.terminalReadyText}>TERMINAL READY</h3>
               <p style={styles.terminalSubText}>Search by Customer ID to start validation.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* INSPECTION OVERLAY */}
      <AnimatePresence>
        {inspectingDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.overlay}>
            <div style={styles.overlayBox}>
              <div style={styles.overlayHeader}>
                <h4 style={{ margin: 0, fontSize: '14px', color: COLORS.textMain }}>INSPECTION MODE</h4>
                <button style={styles.closeBtn} onClick={() => setInspectingDoc(null)}>CLOSE</button>
              </div>
              <div style={styles.imagePaddingBox}>
                {inspectingDoc.data ? (
                  <img src={getImageUrl(inspectingDoc.data.FilePath)} alt="KYC Document" style={styles.fullImg} />
                ) : (
                  <div style={{textAlign: "center"}}>
                    <h1 style={{fontSize: "40px"}}>🚫</h1>
                    <p style={{color: COLORS.textMuted}}>NO IMAGE DATA AVAILABLE</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles = {
  wrapper: { background: COLORS.bg, minHeight: "100vh", color: COLORS.textMain, padding: "40px", fontFamily: "'Inter', sans-serif" },
  
  headerBanner: { display: "flex", alignItems: "center", gap: "18px", marginBottom: "35px" },
  iconBox: { 
    width: "55px", height: "55px", background: COLORS.electric, borderRadius: "12px", 
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px",
    boxShadow: "0 4px 15px rgba(211, 48, 154, 0.2)" 
  },
  headerTextGroup: { display: "flex", flexDirection: "column" },
  mainTitle: { margin: 0, fontSize: "24px", fontWeight: "900", letterSpacing: "1px", color: COLORS.textMain },
  accentTitle: { color: COLORS.electric },
  subTitle: { margin: 0, fontSize: "10px", letterSpacing: "2px", color: COLORS.electric, fontWeight: "bold", marginTop: "4px" },

  searchSection: { display: "flex", marginBottom: "30px" },
  glassSearch: { width: "480px", background: COLORS.inputBg, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "6px", display: "flex" },
  searchInput: { background: "transparent", border: "none", padding: "10px 15px", flex: 1, outline: "none", fontSize: "14px", fontWeight: "600" },
  searchBtn: { border: "none", color: "white", padding: "0 25px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "11px", letterSpacing: "1px" },

  mainStack: { display: "flex", flexDirection: "column", gap: "20px" },
  intelCard: { background: COLORS.glass, border: `1px solid ${COLORS.border}`, padding: "30px", borderRadius: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" },
  profileHeader: { display: "flex", alignItems: "center", gap: "25px" },
  avatarMedium: { width: "65px", height: "65px", background: COLORS.electric, color: "white", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "900" },
  customerName: { margin: 0, fontSize: "18px", fontWeight: "800", color: COLORS.textMain },
  customerIdText: { color: COLORS.electric, margin: "4px 0 10px 0", fontSize: "12px", fontWeight: "bold" },
  statusPill: { background: "white", border: "1px solid", padding: "4px 12px", borderRadius: "10px", fontSize: "10px", fontWeight: "900", letterSpacing: "1px" },
  verifyBtn: { background: COLORS.electric, border: "none", color: "white", padding: "12px 25px", borderRadius: "10px", fontWeight: "900", cursor: "pointer", fontSize: "12px", marginLeft: "auto" },
  
  docNode: { background: COLORS.glass, padding: "20px 25px", borderRadius: "18px", border: `1px solid ${COLORS.border}`, cursor: "pointer" },
  docIcon: { fontSize: "24px" },
  docTitle: { fontWeight: "900", fontSize: "14px", color: COLORS.textMain },
  docFileName: { color: COLORS.textMuted, fontSize: "11px" },
  
  btnGhost: { background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.textMain, padding: "8px 20px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold" },
  btnActive: { background: COLORS.success, color: "white", padding: "8px 20px", borderRadius: "8px", fontWeight: "900", fontSize: "11px", border: "none" },
  
  exceptionState: { padding: "50px 0", opacity: 0.8 },
  terminalReadyText: { fontSize: "16px", letterSpacing: "1px", fontWeight: "900", color: COLORS.textMuted },
  terminalSubText: { color: COLORS.textMuted, fontSize: "12px" },

  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(5px)" },
  overlayBox: { background: "white", border: `1px solid ${COLORS.border}`, borderRadius: "20px", width: "90%", maxWidth: "900px", overflow: "hidden" },
  overlayHeader: { padding: "15px 25px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
  closeBtn: { background: "transparent", border: `1px solid ${COLORS.danger}`, color: COLORS.danger, padding: "8px 18px", borderRadius: "8px", fontSize: "11px", fontWeight: "900", cursor: "pointer" },
  imagePaddingBox: { padding: "30px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" },
  fullImg: { maxWidth: "100%", maxHeight: "70vh", borderRadius: "12px", objectFit: "contain", border: `1px solid ${COLORS.border}` },
};

export default KYCVerification;