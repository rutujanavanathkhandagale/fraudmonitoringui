import React from "react";
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

  // Optimized Form Handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Basic Validation
    if (!data.accountID || !data.customerId || !data.customerType || !data.counterpartyAccount || !data.currency || !data.transactionType || !data.channel || !data.timestamp || !data.status) {
      alert("Please fill out all required fields.");
      return;
    }
    if (Number(data.amount) <= 0) {
      alert("Amount must be greater than zero.");
      return;
    }

    try {
      await axios.post("https://localhost:44372/api/Transaction", data);
      alert("Transaction successfully added!");
      form.reset(); 
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

  // Explicitly define the dropdown arrow (chevron) SVG so it never disappears 
  const dynamicSelectStyle = {
    ...dynamicInputStyle,
    backgroundImage: actualTheme === 'dark' 
      ? `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")` 
      : `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23333333' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    backgroundSize: "16px 12px",
    appearance: "none",
    WebkitAppearance: "none"
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

  const optionStyle = {
    backgroundColor: actualTheme === 'dark' ? '#2D1F49' : '#ffffff',
    color: currentColors.textPrimary
  };

  return (
    // Reduced paddingTop from 80px to 24px to bring the header closer to the top
    <div className="container-fluid px-4 pb-4" style={{ backgroundColor: "transparent", minHeight: "100vh", paddingTop: "24px" }}>
      
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

      {/* 3. Transaction Detail Form */}
      <div className="card border-0 shadow-sm mb-5" style={{ backgroundColor: currentColors.cardBg, borderRadius: "12px" }}>
        <div className="card-body p-4 p-md-5 text-start">
          <h5 className="mb-4" style={{ color: currentColors.textPrimary, fontWeight: "bold" }}>Add Transaction Details</h5>
          
          <form className="row g-4" onSubmit={handleSubmit}>
            
            <div className="col-12 col-md-6 col-lg-4">
              <label className="small" style={dynamicLabelStyle}>Account ID</label>
              <input type="number" name="accountID" className="form-control shadow-none" style={dynamicInputStyle} placeholder="Enter Account ID" required />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label className="small" style={dynamicLabelStyle}>Customer ID</label>
              <input type="number" name="customerId" className="form-control shadow-none" style={dynamicInputStyle} placeholder="Enter Customer ID" required />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label className="small" style={dynamicLabelStyle}>Customer Type</label>
              <select name="customerType" className="form-select shadow-none" style={dynamicSelectStyle} required>
                <option value="" style={optionStyle}>Select Customer Type</option>
                <option value="Business" style={optionStyle}>Business</option>
                <option value="Student" style={optionStyle}>Student</option>
                <option value="Retail" style={optionStyle}>Retail</option>
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label className="small" style={dynamicLabelStyle}>Counterparty Account</label>
              <input type="text" name="counterpartyAccount" className="form-control shadow-none" style={dynamicInputStyle} placeholder="Enter Counterparty" required />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label className="small" style={dynamicLabelStyle}>Amount</label>
              <input type="number" step="0.01" name="amount" className="form-control shadow-none" style={dynamicInputStyle} placeholder="0.00" required />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label className="small" style={dynamicLabelStyle}>Currency</label>
              <input type="text" name="currency" className="form-control shadow-none" style={dynamicInputStyle} placeholder="USD" required />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label className="small" style={dynamicLabelStyle}>Transaction Type</label>
              <div className="d-flex gap-4 mt-2" style={{ color: currentColors.textPrimary }}>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="transactionType" value="Credit" id="typeCredit" style={{ cursor: "pointer" }} required />
                  <label className="form-check-label small" htmlFor="typeCredit" style={{ cursor: "pointer" }}>Credit</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="transactionType" value="Debit" id="typeDebit" style={{ cursor: "pointer" }} required />
                  <label className="form-check-label small" htmlFor="typeDebit" style={{ cursor: "pointer" }}>Debit</label>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label className="small" style={dynamicLabelStyle}>Channel</label>
              <select name="channel" className="form-select shadow-none" style={dynamicSelectStyle} required>
                <option value="" style={optionStyle}>Select Channel</option>
                <option value="Branch" style={optionStyle}>Branch</option>
                <option value="ATM" style={optionStyle}>ATM</option>
                <option value="Online" style={optionStyle}>Online</option>
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label className="small" style={dynamicLabelStyle}>Timestamp</label>
              <input type="datetime-local" name="timestamp" className="form-control shadow-none" style={dynamicInputStyle} required />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label className="small" style={dynamicLabelStyle}>GeoLocation</label>
              <input type="text" name="geoLocation" className="form-control shadow-none" style={dynamicInputStyle} placeholder="Lat, Long" />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label className="small" style={dynamicLabelStyle}>Status</label>
              <div className="d-flex gap-4 mt-2" style={{ color: currentColors.textPrimary }}>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="status" value="Posted" id="statusPosted" style={{ cursor: "pointer" }} required />
                  <label className="form-check-label small" htmlFor="statusPosted" style={{ cursor: "pointer" }}>Posted</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="status" value="Reversed" id="statusReversed" style={{ cursor: "pointer" }} required />
                  <label className="form-check-label small" htmlFor="statusReversed" style={{ cursor: "pointer" }}>Reversed</label>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <label className="small" style={dynamicLabelStyle}>Source Type</label>
              <input type="text" name="sourceType" className="form-control shadow-none" style={dynamicInputStyle} placeholder="Source Type" />
            </div>

            {/* Added pt-4 and pb-3 here to create clear breathing room above and below the buttons */}
            <div className="col-12 mt-4 pt-4 pb-3 border-top" style={{ borderColor: currentColors.border }}>
              <button type="submit" className="btn px-4 py-2 me-3 shadow-sm" style={{ backgroundColor: "#ff0080", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "8px" }}>Submit</button>
              <button type="reset" className="btn px-4 py-2 shadow-sm" style={{ backgroundColor: "#8e2de2", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "8px" }}>Reset</button>
            </div>
          </form>
        </div>
      </div>

      <hr style={{ borderColor: currentColors.border, margin: "3rem 0" }} />

      {/* 4. Charts Section */}
      <div className="row mt-4">
        
        <div className="col-lg-4 mb-5">
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

        <div className="col-lg-4 mb-5">
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

        <div className="col-lg-4 mb-5">
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