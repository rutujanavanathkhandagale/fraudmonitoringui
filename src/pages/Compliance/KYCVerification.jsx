import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  FiShield, FiSearch, FiCheckCircle, FiFileText, 
  FiX, FiActivity, FiAlertTriangle 
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

// --- API CONFIGURATION ---
const BASE_URL = "https://localhost:7181";
const API = axios.create({ baseURL: `${BASE_URL}/api` });

const kycService = {
  getProfile: (customerId) => API.get(`/KYCProfiles/customer/${customerId}`),
  verifyCustomer: (customerId, payload) => API.put(`/KYCProfiles/verify/customer/${customerId}`, payload),
  sendNotification: (customerId, message) => 
    API.post(`/ComplianceNotification/send-notification?customerId=${customerId}&message=${encodeURIComponent(message)}`),
};

const KYCVerification = () => {
  const { currentColors, actualTheme } = useTheme();
  
  // State Management
  const [searchId, setSearchId] = useState("");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(""); 
  const [inspectingDoc, setInspectingDoc] = useState(null);
  const [isAadharApproved, setIsAadharApproved] = useState(false);

  // Dynamic Theme Logic
  const accentColor = actualTheme === 'frost' ? "#34abe0" : "#d000f5";
  const appBackground = actualTheme === 'dark' 
    ? "linear-gradient(180deg, #2e003e 0%, #1a0620 100%)" 
    : "linear-gradient(135deg, #fce7f3 0%, #e0f2fe 50%, #f0f9ff 100%)";

  const glassStyle = { 
    backdropFilter: "blur(10px)", 
    border: `1px solid ${currentColors.border}`,
    backgroundColor: actualTheme === 'dark' ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.7)"
  };

  // --- HELPER: FORMAT IMAGE URL ---
  const getImageUrl = (filePath) => {
    if (!filePath) return null;
    let cleanPath = filePath.replace(/\\/g, "/");
    return cleanPath.startsWith("http") ? cleanPath : `${BASE_URL}/${cleanPath}`;
  };

  // --- ACTION: FETCH CUSTOMER ---
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
      
      let docs = [];
      try {
          docs = typeof data.documentRefsJSON === 'string' 
              ? JSON.parse(data.documentRefsJSON) 
              : (data.documentRefsJSON || []);
      } catch (e) { docs = []; }
      
      setCustomer({
        id: data.customerId || data.CustomerId,
        name: data.fullName || "User Found",
        status: data.status || "Pending",
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

  // --- ACTION: VERIFY NOW ---
  const handleVerifyNow = async () => {
    if (!customer?.id) return;
    
    setVerifying(true);
    try {
      const payload = { 
        ...customer.originalData, 
        status: "Verified",
        verifiedAt: new Date().toISOString() 
      };

      const response = await kycService.verifyCustomer(customer.id, payload);

      if (response.status === 200 || response.status === 204) {
        await kycService.sendNotification(
          customer.id, 
          "Identity verified successfully. Your Fraud Shield account is now active."
        );
        
        // Refresh UI
        handleFetchKYC(); 
        alert("Verification Complete!");
      }
    } catch (e) {
      setError("FAILED TO UPDATE");
      setTimeout(() => setError(""), 3000);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={{ ...styles.wrapper, background: appBackground }}>
      <div style={styles.contentBody}>
        
        {/* HEADER */}
        <div style={styles.headerBanner}>
          <div style={{ ...styles.iconBox, background: accentColor }}>
            <FiShield size={24} color="white" />
          </div>
          <div style={styles.headerTextGroup}>
            <h1 style={{ ...styles.mainTitle, color: currentColors.textPrimary }}>
              KYC <span style={{ color: accentColor }}>VERIFICATION</span>
            </h1>
            <p style={{ ...styles.subTitle, color: accentColor }}>COMPLIANCE MANAGEMENT TERMINAL</p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div style={styles.searchSection}>
          <motion.div 
            animate={error ? { x: [-3, 3, -3, 3, 0] } : {}}
            style={{...styles.glassSearch, ...glassStyle, borderColor: error ? "#dc2626" : currentColors.border}}
          >
            <FiSearch style={{ color: currentColors.textSecondary, marginLeft: '10px' }} />
            <input 
              style={{...styles.searchInput, color: currentColors.textPrimary}}
              placeholder={error || "Enter Customer ID (e.g. CUST001)"} 
              value={error ? "" : searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchKYC()}
            />
            <button 
              style={{...styles.searchBtn, background: error ? "#dc2626" : accentColor}} 
              onClick={handleFetchKYC}
              disabled={loading}
            >
              {loading ? "SCANNING..." : "SCAN ID"}
            </button>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {customer ? (
            <motion.div key="profile" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={styles.mainStack}>
              
              {/* CUSTOMER INFO CARD */}
              <div style={{ ...styles.intelCard, ...glassStyle }}>
                <div style={styles.profileHeader}>
                  <div style={{ ...styles.avatarMedium, background: accentColor }}>
                    {customer.name ? customer.name[0] : "?"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ ...styles.customerName, color: currentColors.textPrimary }}>{customer.name}</h3>
                    <p style={{ ...styles.customerIdText, color: accentColor }}>SYS_REF: {customer.id}</p>
                    <span style={{
                      ...styles.statusPill, 
                      borderColor: customer.status === "Verified" ? "#16a34a" : accentColor, 
                      color: customer.status === "Verified" ? "#16a34a" : accentColor,
                    }}>
                      ● {customer.status?.toUpperCase()}
                    </span>
                  </div>
                  
                  {customer.status !== "Verified" && (
                    <button 
                      style={{
                        ...styles.verifyBtn, 
                        background: isAadharApproved ? "#16a34a" : accentColor, 
                        opacity: isAadharApproved ? 1 : 0.4
                      }} 
                      disabled={!isAadharApproved || verifying}
                      onClick={handleVerifyNow}
                    >
                      {verifying ? "PROCESSING..." : "FINALIZE VERIFICATION"}
                    </button>
                  )}
                </div>
              </div>

              {/* DOCUMENT SECTION */}
              <div 
                style={{ ...styles.docNode, ...glassStyle }} 
                onClick={() => setInspectingDoc({ type: "Aadhar Card", data: customer.aadhar })}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <div style={{ ...styles.docIcon, color: accentColor }}><FiFileText size={24} /></div>
                    <div>
                      <div style={{ ...styles.docTitle, color: currentColors.textPrimary }}>AADHAR CARD DATA</div>
                      <small style={{ ...styles.docFileName, color: currentColors.textSecondary }}>
                        {customer.aadhar?.FileName || "NO_FILE_ATTACHED"}
                      </small>
                    </div>
                  </div>
                  
                  {customer.status !== "Verified" ? (
                    <button 
                      style={{
                        ...(isAadharApproved ? styles.btnActive : styles.btnGhost),
                        borderColor: isAadharApproved ? "#16a34a" : currentColors.border,
                        color: isAadharApproved ? "white" : currentColors.textPrimary
                      }} 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        setIsAadharApproved(!isAadharApproved);
                      }}
                    >
                      {isAadharApproved ? "✓ APPROVED" : "APPROVE DOC"}
                    </button>
                  ) : (
                    <FiCheckCircle size={24} color="#16a34a" />
                  )}
                </div>
              </div>
            </motion.div>
          ) : !loading && (
            <div style={styles.exceptionState}>
               <FiActivity size={48} style={{ color: currentColors.textSecondary, marginBottom: '20px' }} />
               <h3 style={{ ...styles.terminalReadyText, color: currentColors.textSecondary }}>NODE READY</h3>
               <p style={{ ...styles.terminalSubText, color: currentColors.textSecondary }}>Enter a valid Customer ID to begin authentication...</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* INSPECTION MODAL */}
      <AnimatePresence>
        {inspectingDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.overlay}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ ...styles.overlayBox, backgroundColor: currentColors.cardBg }}>
              <div style={{ ...styles.overlayHeader, borderBottom: `1px solid ${currentColors.border}` }}>
                <h4 style={{ margin: 0, color: currentColors.textPrimary }}>INSPECT: {inspectingDoc.type}</h4>
                <button style={styles.closeBtn} onClick={() => setInspectingDoc(null)}><FiX size={18} /> CLOSE</button>
              </div>
              <div style={styles.imagePaddingBox}>
                {inspectingDoc.data?.FilePath ? (
                  <img 
                    src={getImageUrl(inspectingDoc.data.FilePath)} 
                    alt="KYC Doc" 
                    style={{ ...styles.fullImg, borderColor: currentColors.border }} 
                  />
                ) : (
                  <div style={{textAlign: "center"}}>
                    <FiAlertTriangle size={50} color="#dc2626" />
                    <p style={{color: currentColors.textSecondary, marginTop: '10px'}}>IMAGE_NOT_FOUND_ON_SERVER</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- STYLES OBJECT ---
const styles = {
  wrapper: { minHeight: "100vh", width: "100%" },
  contentBody: { padding: "50px", maxWidth: "900px", margin: "0 auto" },
  headerBanner: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" },
  iconBox: { width: "55px", height: "55px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center" },
  headerTextGroup: { display: "flex", flexDirection: "column" },
  mainTitle: { margin: 0, fontSize: "28px", fontWeight: "900", letterSpacing: "-0.5px" },
  subTitle: { margin: 0, fontSize: "12px", letterSpacing: "2px", fontWeight: "700", opacity: 0.8 },
  searchSection: { marginBottom: "45px" },
  glassSearch: { width: "100%", borderRadius: "20px", padding: "12px", display: "flex", alignItems: 'center' },
  searchInput: { background: "transparent", border: "none", padding: "10px", flex: 1, outline: "none", fontSize: "16px", fontWeight: "600" },
  searchBtn: { border: "none", color: "white", padding: "12px 30px", borderRadius: "14px", fontWeight: "800", cursor: "pointer" },
  mainStack: { display: "flex", flexDirection: "column", gap: "20px" },
  intelCard: { padding: "40px", borderRadius: "30px" },
  profileHeader: { display: "flex", alignItems: "center", gap: "30px" },
  avatarMedium: { width: "80px", height: "80px", color: "white", borderRadius: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "900" },
  customerName: { margin: 0, fontSize: "24px", fontWeight: "800" },
  customerIdText: { margin: "4px 0 15px 0", fontSize: "14px", fontWeight: "700", fontFamily: "monospace" },
  statusPill: { border: "1px solid", padding: "6px 16px", borderRadius: "50px", fontSize: "11px", fontWeight: "900" },
  verifyBtn: { border: "none", color: "white", padding: "16px 35px", borderRadius: "16px", fontWeight: "900", cursor: "pointer", marginLeft: "auto" },
  docNode: { padding: "30px", borderRadius: "25px", cursor: "pointer", transition: "transform 0.2s" },
  docTitle: { fontWeight: "800", fontSize: "16px", marginBottom: "4px" },
  docFileName: { fontSize: "12px", fontFamily: "monospace" },
  btnGhost: { background: "transparent", border: `1px solid`, padding: "10px 20px", borderRadius: "12px", fontWeight: "800" },
  btnActive: { background: "#16a34a", color: "white", padding: "10px 20px", borderRadius: "12px", fontWeight: "900" },
  exceptionState: { padding: "120px 0", display: 'flex', flexDirection: 'column', alignItems: 'center' },
  terminalReadyText: { fontSize: "20px", letterSpacing: "2px", fontWeight: "900" },
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(15px)" },
  overlayBox: { borderRadius: "35px", width: "85%", maxWidth: "800px", overflow: "hidden" },
  overlayHeader: { padding: "20px 35px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  closeBtn: { background: "rgba(220, 38, 38, 0.1)", border: "none", color: "#dc2626", padding: "10px 20px", borderRadius: "12px", fontWeight: "800", cursor: "pointer", display: 'flex', alignItems: 'center', gap: '8px' },
  imagePaddingBox: { padding: "40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" },
  fullImg: { maxWidth: "100%", maxHeight: "65vh", borderRadius: "20px", objectFit: "contain", border: '1px solid' }
};

export default KYCVerification;