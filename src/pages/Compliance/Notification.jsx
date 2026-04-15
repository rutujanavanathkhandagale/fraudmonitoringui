import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiUser, FiMail, FiBell, FiCheckCircle, FiAlertTriangle, FiSearch } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const NOTIFICATION_API = "https://localhost:7181/api/Notification/send";
const CUSTOMERS_API = "https://localhost:7181/api/KYCProfiles";

const TEMPLATES = {
  "KYC Request": "Dear {Name}, to comply with anti-money laundering (AML) regulations, please complete your KYC verification within 24 hours.",
  "Document Rejected": "Dear {Name}, the documents provided for your KYC verification were insufficient. Please re-upload a clear copy of your official ID."
};

export default function NotificationPage() {
  const { currentColors, actualTheme } = useTheme();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ show: false, msg: "", type: "success" });

  const [formData, setFormData] = useState({
    customerId: "",
    type: "KYC Request",
    message: ""
  });

  const accentColor = actualTheme === 'frost' ? "#34abe0" : "#d000f5";

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const selectedCustomer = customers.find(c => c.customerId.toString() === formData.customerId);
    const firstName = selectedCustomer ? selectedCustomer.fullName.split(' ')[0] : "Customer";
    
    if (TEMPLATES[formData.type]) {
      setFormData(prev => ({
        ...prev,
        message: TEMPLATES[formData.type].replace("{Name}", firstName)
      }));
    }
  }, [formData.type, formData.customerId, customers]);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(CUSTOMERS_API);
      setCustomers(res.data || []);
    } catch (err) {
      console.error("Failed to load customers", err);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.customerId.toString().includes(searchTerm) || 
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showStatus = (msg, type = "success") => {
    setStatus({ show: true, msg, type });
    // Hide after 3 seconds
    setTimeout(() => setStatus(prev => ({ ...prev, show: false })), 3000);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.customerId) return showStatus("Please select a customer", "error");

    setLoading(true);
    try {
      const payload = {
        customerId: parseInt(formData.customerId),
        notificationType: formData.type,
        message: formData.message,
        sentDate: new Date().toISOString(),
        status: "Sent"
      };

      await axios.post(NOTIFICATION_API, payload);
      showStatus(`Notification dispatched to ID #${formData.customerId}`, "success");
      setFormData(prev => ({ ...prev, customerId: "" }));
      setSearchTerm("");
    } catch (err) {
      showStatus("Transmission failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { padding: "40px", minHeight: "90vh", color: currentColors.textPrimary },
    glassCard: {
      background: currentColors.cardBg,
      backdropFilter: actualTheme === 'frost' ? "blur(20px)" : "none",
      border: `1px solid ${currentColors.border}`,
      borderRadius: "24px", padding: "40px", maxWidth: "550px", margin: "0 auto",
      boxShadow: "0 10px 40px rgba(0,0,0,0.15)"
    },
    label: { fontSize: "11px", fontWeight: "800", color: accentColor, marginBottom: "8px", display: "block", letterSpacing: "1px" },
    inputGroup: { marginBottom: "25px", position: "relative" },
    input: {
      width: "100%", padding: "12px 15px 12px 40px", borderRadius: "12px",
      border: `1px solid ${currentColors.border}`, background: currentColors.appBg,
      color: currentColors.textPrimary, fontWeight: "600", outline: "none", fontSize: "14px"
    },
    textarea: {
      width: "100%", padding: "15px", borderRadius: "12px",
      border: `1px solid ${currentColors.border}`, background: currentColors.appBg,
      color: currentColors.textPrimary, fontWeight: "500", minHeight: "120px", outline: "none",
      lineHeight: "1.5", resize: "none"
    },
    btn: {
      width: "100%", padding: "16px", borderRadius: "12px", border: "none",
      background: accentColor, color: "white", fontWeight: "800",
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      gap: "10px", fontSize: "14px"
    },
    // UPDATED: Centered Toast Styles
    toastOverlay: {
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      pointerEvents: "none" // Allows clicking through the empty space
    },
    toastBox: {
      padding: "20px 40px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      gap: "15px",
      color: "white",
      fontWeight: "700",
      boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
      fontSize: "16px",
      pointerEvents: "auto" // Re-enable clicks for the toast itself
    }
  };

  return (
    <div style={styles.container}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.glassCard}>
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <h2 style={{ margin: 0, fontWeight: "900" }}>FRAUD <span style={{ color: accentColor }}>SHIELD</span> DISPATCH</h2>
          <p style={{ opacity: 0.5, fontSize: "12px", marginTop: "5px" }}>Official AML Compliance Portal</p>
        </div>

        <form onSubmit={handleSend}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>FIND CUSTOMER</label>
            <FiSearch style={{ position: "absolute", top: "38px", left: "15px", color: accentColor }} />
            <input 
              type="text"
              placeholder="Search by ID or Name..."
              style={styles.input}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>SELECT RECIPIENT</label>
            <FiUser style={{ position: "absolute", top: "38px", left: "15px", color: accentColor }} />
            <select 
              style={styles.input}
              value={formData.customerId}
              onChange={(e) => setFormData({...formData, customerId: e.target.value})}
              required
            >
              <option value="">{searchTerm ? `Results (${filteredCustomers.length})` : "Select a customer..."}</option>
              {filteredCustomers.map(c => (
                <option key={c.customerId} value={c.customerId}>
                  {c.customerId} — {c.fullName}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>ALERT CATEGORY</label>
            <FiMail style={{ position: "absolute", top: "38px", left: "15px", color: accentColor }} />
            <select 
              style={styles.input}
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="KYC Request">KYC Request</option>
              <option value="Document Rejected">Document Rejected</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>MESSAGE PREVIEW</label>
            <textarea 
              style={styles.textarea}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "SENDING..." : <><FiSend /> DISPATCH ALERT</>}
          </button>
        </form>
      </motion.div>

      {/* UPDATED: Centered Status Toast with Animation */}
      <AnimatePresence>
        {status.show && (
          <div style={styles.toastOverlay}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{ 
                ...styles.toastBox, 
                background: status.type === 'success' ? '#16a34a' : '#dc2626' 
              }}
            >
              {status.type === 'success' ? <FiCheckCircle size={24} /> : <FiAlertTriangle size={24} />}
              {status.msg}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}