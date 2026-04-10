import React, { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTheme } from "../../context/ThemeContext";

 
// --- Data for Analytics ---
const typeData = [
  { name: "Debit", value: 45 },
  { name: "Credit", value: 30 },
  { name: "Wire Transfer", value: 15 },
  { name: "Crypto", value: 7 },
  { name: "ATM/POS", value: 3 },
];
 
const channelData = [
  { name: "Online", value: 40 },
  { name: "Mobile", value: 25 },
  { name: "ATM", value: 15 },
  { name: "POS", value: 10 },
  { name: "Wire", value: 10 },
];
 
const customerData = [
  { name: "Retail", value: 55 },
  { name: "Student", value: 25 },
  { name: "Business", value: 20 },
];
 
const Transactions = () => {
  const { currentColors, actualTheme } = useTheme();
 
  const [formData, setFormData] = useState({
    accountID: "", customerId: "", customerType: "", counterpartyAccount: "",
    amount: "", currency: "", transactionType: "", channel: "",
    timestamp: "", geoLocation: "", status: "", sourceType: "",
  });
 
  const [errors, setErrors] = useState({});
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };
 
  const validateForm = () => {
    let newErrors = {};
    if (!formData.accountID) newErrors.accountID = "AccountID is required.";
    if (!formData.customerId) newErrors.customerId = "CustomerId is required.";
    if (!formData.customerType) newErrors.customerType = "Customer type is required.";
    if (!formData.counterpartyAccount) newErrors.counterpartyAccount = "CounterpartyAccount is required.";
    if (!formData.amount || formData.amount <= 0) newErrors.amount = "Amount must be greater than zero.";
    if (!formData.currency) newErrors.currency = "Currency is required.";
    if (!formData.transactionType) newErrors.transactionType = "TransactionType is required.";
    if (!formData.channel) newErrors.channel = "Channel is required.";
    if (!formData.timestamp) newErrors.timestamp = "Timestamp is required.";
    if (!formData.status) newErrors.status = "Status is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.post("https://localhost:44372/api/Transaction", formData);
      alert("Transaction successfully added!");
      setFormData({
        accountID: "", customerId: "", customerType: "", counterpartyAccount: "",
        amount: "", currency: "", transactionType: "", channel: "",
        timestamp: "", geoLocation: "", status: "", sourceType: "",
      });
      setErrors({});
    } catch (err) {
      alert("Failed to add transaction");
    }
  };
 
  // DYNAMIC STYLE LOGIC
  const dynamicInputStyle = {
    backgroundColor: actualTheme === 'dark' ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    color: currentColors.textPrimary,
    border: `1px solid ${currentColors.border}`,
    borderRadius: "8px",
    padding: "10px"
  };
 
  const dynamicLabelStyle = {
    color: currentColors.textPrimary,
    fontWeight: "bold",
    marginBottom: "0.5rem",
    display: "block"
  };
 
  const tooltipStyle = {
    backgroundColor: actualTheme === 'dark' ? '#020617' : '#ffffff',
    borderColor: currentColors.border,
    color: currentColors.textPrimary,
    borderRadius: '8px'
  };
 
  return (
    <div className="container-fluid px-4 pb-4" style={{ backgroundColor: "transparent", minHeight: "100vh", paddingTop: "80px" }}>
     
      {/* 1. Header */}
      <div className="mb-4 text-start">
        <h2 className="fw-bold mb-0" style={{ color: currentColors.textPrimary }}>Transaction Intelligence</h2>
        <p className="small" style={{ color: currentColors.textSecondary }}>Ingestion & Monitoring Dashboard</p>
      </div>
 
      {/* 2. Banner Section */}
      <div
        className="rounded-4 mb-4 position-relative overflow-hidden shadow"
        style={{
          minHeight: "220px",
          backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(30, 0, 50, 0.85)" }}></div>
        <div className="card-body position-relative z-1 d-flex flex-column justify-content-center text-center p-4 p-md-5">
          <h4 className="fw-bold mb-3" style={{ color: "#e2f4ffff" }}>Live Transaction Summary</h4>
          <p className="text-white mb-0" style={{ fontSize: "1.05rem", lineHeight: "1.6", maxWidth: "900px", margin: "0 auto", opacity: 0.9 }}>
            A crucial high-volume data integration engine, the Ingestion & Monitoring module continuously acquires, validates, and processes transactional data from globally distributed sources. It streams standardized records in real-time into core analytical and fraud detection systems.
          </p>
        </div>
      </div>
 
      {/* 3. Transaction Detail Form - FIX: Wrapped in a Card for structure! */}
      <div className="card border-0 shadow-sm mb-5" style={{ backgroundColor: currentColors.cardBg, borderRadius: "12px" }}>
        <div className="card-body p-4 p-md-5 text-start">
          <h5 className="mb-4" style={{ color: currentColors.textPrimary, fontWeight: "bold" }}>Add Transaction Details</h5>
          <form className="row g-4" onSubmit={handleSubmit}>
           
            <div className="col-md-4">
              <label className="small" style={dynamicLabelStyle}>Account ID</label>
              <input type="number" name="accountID" value={formData.accountID} onChange={handleChange} className="form-control" style={dynamicInputStyle} placeholder="Enter Account ID" />
            </div>
 
            <div className="col-md-4">
              <label className="small" style={dynamicLabelStyle}>Customer ID</label>
              <input type="number" name="customerId" value={formData.customerId} onChange={handleChange} className="form-control" style={dynamicInputStyle} placeholder="Enter Customer ID" />
            </div>
 
            <div className="col-md-4">
              <label className="small" style={dynamicLabelStyle}>Customer Type</label>
              <select name="customerType" value={formData.customerType} onChange={handleChange} className="form-select" style={dynamicInputStyle}>
                <option value="" className="text-dark">Select Customer Type</option>
                <option value="Business" className="text-dark">Business</option>
                <option value="Student" className="text-dark">Student</option>
                <option value="Retail" className="text-dark">Retail</option>
              </select>
            </div>
 
            <div className="col-md-4">
              <label className="small" style={dynamicLabelStyle}>Counterparty Account</label>
              <input type="text" name="counterpartyAccount" value={formData.counterpartyAccount} onChange={handleChange} className="form-control" style={dynamicInputStyle} placeholder="Enter Counterparty" />
            </div>
 
            <div className="col-md-4">
              <label className="small" style={dynamicLabelStyle}>Amount</label>
              <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} className="form-control" style={dynamicInputStyle} placeholder="0.00" />
            </div>
 
            <div className="col-md-4">
              <label className="small" style={dynamicLabelStyle}>Currency</label>
              <input type="text" name="currency" value={formData.currency} onChange={handleChange} className="form-control" style={dynamicInputStyle} placeholder="USD" />
            </div>
 
            {/* FIX: Aligned Radio Buttons using Bootstrap form-check */}
            <div className="col-md-4">
              <label className="small" style={dynamicLabelStyle}>Transaction Type</label>
              <div className="d-flex gap-4 mt-2" style={{ color: currentColors.textPrimary }}>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="transactionType" value="Credit" id="typeCredit" checked={formData.transactionType === "Credit"} onChange={handleChange} style={{ cursor: "pointer" }} />
                  <label className="form-check-label small" htmlFor="typeCredit" style={{ cursor: "pointer" }}>Credit</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="transactionType" value="Debit" id="typeDebit" checked={formData.transactionType === "Debit"} onChange={handleChange} style={{ cursor: "pointer" }} />
                  <label className="form-check-label small" htmlFor="typeDebit" style={{ cursor: "pointer" }}>Debit</label>
                </div>
              </div>
            </div>
 
            <div className="col-md-4">
              <label className="small" style={dynamicLabelStyle}>Channel</label>
              <select name="channel" value={formData.channel} onChange={handleChange} className="form-select" style={dynamicInputStyle}>
                <option value="" className="text-dark">Select Channel</option>
                <option value="Branch" className="text-dark">Branch</option>
                <option value="ATM" className="text-dark">ATM</option>
                <option value="Online" className="text-dark">Online</option>
              </select>
            </div>
 
            <div className="col-md-4">
              <label className="small" style={dynamicLabelStyle}>Timestamp</label>
              <input type="datetime-local" name="timestamp" value={formData.timestamp} onChange={handleChange} className="form-control" style={dynamicInputStyle} />
            </div>
 
            <div className="col-md-4">
              <label className="small" style={dynamicLabelStyle}>GeoLocation</label>
              <input type="text" name="geoLocation" value={formData.geoLocation} onChange={handleChange} className="form-control" style={dynamicInputStyle} placeholder="Lat, Long" />
            </div>
 
            {/* FIX: Aligned Radio Buttons using Bootstrap form-check */}
            <div className="col-md-4">
              <label className="small" style={dynamicLabelStyle}>Status</label>
              <div className="d-flex gap-4 mt-2" style={{ color: currentColors.textPrimary }}>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="status" value="Posted" id="statusPosted" checked={formData.status === "Posted"} onChange={handleChange} style={{ cursor: "pointer" }} />
                  <label className="form-check-label small" htmlFor="statusPosted" style={{ cursor: "pointer" }}>Posted</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="status" value="Reversed" id="statusReversed" checked={formData.status === "Reversed"} onChange={handleChange} style={{ cursor: "pointer" }} />
                  <label className="form-check-label small" htmlFor="statusReversed" style={{ cursor: "pointer" }}>Reversed</label>
                </div>
              </div>
            </div>
 
            <div className="col-md-4">
              <label className="small" style={dynamicLabelStyle}>Source Type</label>
              <input type="text" name="sourceType" value={formData.sourceType} onChange={handleChange} className="form-control" style={dynamicInputStyle} placeholder="Source Type" />
            </div>
 
            <div className="col-12 mt-4 pt-2 border-top" style={{ borderColor: currentColors.border }}>
              <button type="submit" className="btn px-4 py-2 me-3 shadow-sm mt-3" style={{ backgroundColor: "#ff0080", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "8px" }}>Submit</button>
              <button type="reset" className="btn px-4 py-2 shadow-sm mt-3" style={{ backgroundColor: "#8e2de2", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "8px" }} onClick={() => setFormData({})}>Reset</button>
            </div>
          </form>
        </div>
      </div>
 
      <hr style={{ borderColor: currentColors.border, margin: "3rem 0" }} />
 
      {/* 4. Charts Section */}
      <div className="row mt-4">
       
        <div className="col-md-4 mb-5">
          <h6 className="fw-bold mb-4 text-center" style={{ color: currentColors.textPrimary }}>Transaction Types</h6>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={typeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={currentColors.border} />
              <XAxis dataKey="name" stroke={currentColors.textSecondary} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke={currentColors.textSecondary} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="value" fill="#8e2de2" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
 
        <div className="col-md-4 mb-5">
          <h6 className="fw-bold mb-4 text-center" style={{ color: currentColors.textPrimary }}>Channel Usage</h6>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={channelData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={currentColors.border} />
              <XAxis type="number" stroke={currentColors.textSecondary} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" stroke={currentColors.textSecondary} tick={{ fontSize: 11 }} width={50} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="value" fill="#00c6ff" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
 
        <div className="col-md-4 mb-5">
          <h6 className="fw-bold mb-4 text-center" style={{ color: currentColors.textPrimary }}>Customer Segments</h6>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={customerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={currentColors.border} />
              <XAxis dataKey="name" stroke={currentColors.textSecondary} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke={currentColors.textSecondary} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="value" fill="#ff0080" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
 
      </div>
    </div>
  );
};
 
export default Transactions;