import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FiShield, FiAlertTriangle, FiActivity, FiTarget, FiSearch, FiTrash2 } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTheme } from "../../context/ThemeContext";

 
const RISK_API = "https://localhost:44372/api/RiskScore";
const TRANSACTION_API = "https://localhost:44372/api/Transaction";
 
const RiskScoring = () => {
  const { currentColors, actualTheme } = useTheme();
 
  const [searchId, setSearchId] = useState("");
  const [activeData, setActiveData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const accentGradient = "linear-gradient(90deg, #9d2a8a 0%, #e63077 100%)";
 
  // --- API FETCH ---
  const fetchHistory = useCallback(async () => {
    try {
      const [riskRes, transRes] = await Promise.all([
        axios.get(RISK_API),
        axios.get(TRANSACTION_API)
      ]);
 
      const riskData = riskRes.data || [];
      const allTransactions = transRes.data || [];
 
      const mergedHistory = riskData.map((riskItem) => {
        const matchingTx = allTransactions.find((t) => {
          const transIdToMatch = t.id || t.transactionId || t.transactionID;
          return String(transIdToMatch) === String(riskItem.transactionID);
        });
       
        return {
          ...riskItem,
          accountId: matchingTx?.accountId || matchingTx?.accountID || matchingTx?.AccountID || "N/A",
          location: matchingTx?.geoLocation || matchingTx?.GeoLocation || matchingTx?.location || matchingTx?.Location || "N/A"
        };
      });
 
      // Sort history to show newest first
      setHistory(mergedHistory.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Error fetching from APIs:", err);
    }
  }, []);
 
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
 
  // --- ACTIONS ---
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!searchId) return;
   
    setLoading(true);
    try {
      const res = await axios.post(`${RISK_API}/generate/${searchId}`);
      setActiveData(res.data);
      fetchHistory();
    } catch (err) {
      alert("Generation failed. Check if ID exists and API is running.");
    } finally {
      setLoading(false);
    }
  };
 
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) return;
 
    try {
      const res = await axios.get(`${RISK_API}/search/${searchId}`);
      setActiveData(res.data);
    } catch (err) {
      alert("Risk record not found for this ID.");
    }
  };
 
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this risk record?")) {
      try {
        await axios.delete(`${RISK_API}/${id}`);
        if (activeData?.id === id) setActiveData(null);
        fetchHistory();
      } catch (err) {
        alert("Failed to delete record.");
      }
    }
  };
 
  // --- CALCULATED METRICS FOR KPI DASHBOARD ---
  const totalCases = history.length;
  const highRiskCases = history.filter(item => item.scoreValue > 70).length;
  const avgScore = totalCases > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.scoreValue, 0) / totalCases) : 0;
 
  // --- CHART DATA ---
  const score = activeData?.scoreValue || 0;
 
  const gaugeData = useMemo(() => [
    { name: "Risk Score", value: score },
    { name: "Safe Margin", value: Math.max(0, 100 - score) }
  ], [score]);
 
  const gaugeColor = useMemo(() => {
    if (score > 70) return "#ff4d4d"; // High Risk
    if (score > 40) return "#ffc107"; // Medium Risk
    return "#00e676"; // Low Risk
  }, [score]);
 
  return (
    // FIX APPLIED HERE: Changed padding to "80px 0 30px" to permanently push content below the header!
    <main style={{ backgroundColor: "transparent", minHeight: "100vh", paddingTop: "80px", paddingBottom: "30px" }}>
      <div className="container-fluid px-4">
       
        {/* HEADER */}
        <header className="mb-4">
          <h2 className="fw-bold mb-1" style={{ color: currentColors.textPrimary }}>
            <FiShield className="me-2 mb-1" style={{ color: "#e63077" }} />
            Risk Intelligence <span style={{ color: "#e63077", fontWeight: "300" }}>Engine</span>
          </h2>
          <p style={{ color: currentColors.textSecondary, fontSize: "0.95rem" }}>AI-driven transaction profiling and real-time anomaly detection.</p>
        </header>
 
        {/* TOP KPI CARDS */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: currentColors.cardBg, border: `1px solid ${currentColors.border}` }}>
              <div className="card-body d-flex align-items-center">
                <div className="rounded-circle p-3 d-flex align-items-center justify-content-center me-3" style={{ backgroundColor: "rgba(142, 45, 226, 0.15)", color: "#8e2de2", width: "60px", height: "60px" }}>
                  <FiActivity size={24} />
                </div>
                <div>
                  <p className="mb-0 fw-bold text-uppercase" style={{ color: currentColors.textSecondary, fontSize: "0.75rem", letterSpacing: "1px" }}>Total Analyzed</p>
                  <h3 className="mb-0 fw-bold" style={{ color: currentColors.textPrimary }}>{totalCases}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: currentColors.cardBg, border: `1px solid ${currentColors.border}` }}>
              <div className="card-body d-flex align-items-center">
                <div className="rounded-circle p-3 d-flex align-items-center justify-content-center me-3" style={{ backgroundColor: "rgba(255, 77, 77, 0.15)", color: "#ff4d4d", width: "60px", height: "60px" }}>
                  <FiAlertTriangle size={24} />
                </div>
                <div>
                  <p className="mb-0 fw-bold text-uppercase" style={{ color: currentColors.textSecondary, fontSize: "0.75rem", letterSpacing: "1px" }}>Critical Alerts</p>
                  <h3 className="mb-0 fw-bold" style={{ color: currentColors.textPrimary }}>{highRiskCases}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: currentColors.cardBg, border: `1px solid ${currentColors.border}` }}>
              <div className="card-body d-flex align-items-center">
                <div className="rounded-circle p-3 d-flex align-items-center justify-content-center me-3" style={{ backgroundColor: "rgba(32, 201, 151, 0.15)", color: "#20c997", width: "60px", height: "60px" }}>
                  <FiTarget size={24} />
                </div>
                <div>
                  <p className="mb-0 fw-bold text-uppercase" style={{ color: currentColors.textSecondary, fontSize: "0.75rem", letterSpacing: "1px" }}>System Avg Score</p>
                  <h3 className="mb-0 fw-bold" style={{ color: currentColors.textPrimary }}>{avgScore}<span style={{ fontSize: "1rem", color: currentColors.textSecondary }}>/100</span></h3>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {/* SEARCH BAR ROW */}
        <section className="card border-0 mb-4 shadow-sm" style={{ backgroundColor: currentColors.cardBg, border: `1px solid ${currentColors.border}` }}>
          <div className="card-body p-4">
            <form className="row g-2 align-items-center" onSubmit={handleGenerate}>
              <div className="col-md-8">
                <div className="input-group input-group-lg shadow-sm rounded overflow-hidden">
                  <span className="input-group-text border-0" style={{ backgroundColor: actualTheme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", color: currentColors.textSecondary }}>
                    <FiSearch />
                  </span>
                  <input
                    type="number"
                    className="form-control border-0"
                    placeholder="Enter Transaction ID for deep analysis..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    style={{
                      backgroundColor: actualTheme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                      color: currentColors.textPrimary,
                      boxShadow: "none"
                    }}
                  />
                </div>
              </div>
              <div className="col-md-4 d-flex gap-2">
                <button
                  type="submit"
                  className="btn w-50 fw-bold text-white shadow-sm"
                  disabled={loading}
                  style={{ background: accentGradient, border: "none" }}
                >
                  {loading ? "Scanning..." : "Execute Scan"}
                </button>
                <button
                  type="button"
                  className="btn w-50 fw-bold"
                  onClick={handleSearch}
                  style={{ color: currentColors.textPrimary, border: `1px solid ${currentColors.border}`, backgroundColor: actualTheme === 'dark' ? "rgba(255,255,255,0.05)" : "transparent" }}
                >
                  Pull Existing
                </button>
              </div>
            </form>
          </div>
        </section>
 
        {/* MAIN CONTENT ROW */}
        <div className="row g-4">
         
          {/* LEFT: GAUGE VISUALIZATION */}
          <section className="col-lg-5">
            <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: currentColors.cardBg, border: `1px solid ${currentColors.border}` }}>
              <div className="card-body p-4 d-flex flex-column">
                <h6 className="fw-bold mb-4" style={{ color: currentColors.textPrimary }}>
                  Case Analysis: {activeData ? `#${activeData.transactionID}` : <span style={{ color: currentColors.textSecondary }}>STANDBY</span>}
                </h6>
               
                {activeData ? (
                  // ----- POPULATED STATE (WHEN DATA IS SEARCHED) -----
                  <div className="animate__animated animate__fadeIn flex-grow-1 d-flex flex-column">
                   
                    {/* Semi-Circle Gauge */}
                    <div style={{ height: "200px", position: "relative", marginTop: "10px" }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={gaugeData}
                            cx="50%" cy="100%" startAngle={180} endAngle={0}
                            innerRadius={100} outerRadius={140} paddingAngle={2}
                            dataKey="value" stroke="none"
                          >
                            <Cell fill={gaugeColor} />
                            <Cell fill={actualTheme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: currentColors.cardBg, border: `1px solid ${currentColors.border}`, borderRadius: "8px" }}
                            itemStyle={{ color: currentColors.textPrimary }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
                        <h1 className="display-2 fw-bold m-0" style={{ color: gaugeColor, lineHeight: "1" }}>{score}</h1>
                        <p className="fw-bold text-uppercase mb-0" style={{ color: currentColors.textSecondary, letterSpacing: "2px", fontSize: "0.8rem" }}>
                          {score > 70 ? 'Critical Risk' : score > 40 ? 'Elevated Risk' : 'Low Risk'}
                        </p>
                      </div>
                    </div>
                   
                    {/* Detected Flags */}
                    <div className="mt-5 text-start">
                      <p className="small fw-bold text-uppercase mb-3" style={{ color: currentColors.textSecondary, letterSpacing: "1px" }}>Identified Risk Factors</p>
                      {activeData.reasonsJSON ? (
                        JSON.parse(activeData.reasonsJSON).map((r, i) => (
                          <div key={i} className="d-flex align-items-center p-3 mb-2 rounded border border-danger shadow-sm" style={{ background: "rgba(220, 53, 69, 0.05)", color: currentColors.textPrimary, fontSize: "0.85rem" }}>
                            <FiAlertTriangle className="text-danger me-3 flex-shrink-0" size={18} />
                            <span>{r}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 rounded border border-success d-flex align-items-center" style={{ background: "rgba(0, 230, 118, 0.05)", color: currentColors.textPrimary, fontSize: "0.85rem" }}>
                          <FiShield className="text-success me-3" size={18} />
                          <span>Transaction falls within normal parameters. No flags detected.</span>
                        </div>
                      )}
                    </div>
                  </div>
 
                ) : (
                  // ----- STANDBY / EMPTY STATE (BEFORE SEARCH) -----
                  <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 animate__animated animate__fadeIn" style={{ minHeight: "380px" }}>
                   
                    {/* Dimmed Placeholder Gauge */}
                    <div style={{ position: "relative", width: "100%", height: "180px", opacity: 0.3 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={[{ value: 100 }]}
                            cx="50%" cy="100%" startAngle={180} endAngle={0}
                            innerRadius={100} outerRadius={140}
                            dataKey="value" stroke="none"
                            fill={actualTheme === 'dark' ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
                        <FiTarget size={60} style={{ color: currentColors.textSecondary, marginBottom: "15px" }} />
                      </div>
                    </div>
 
                    {/* Placeholder Text Box */}
                    <div className="text-center mt-5 w-100 px-2">
                      <h5 className="fw-bold text-uppercase mb-3" style={{ color: currentColors.textSecondary, letterSpacing: "2px" }}>System Ready</h5>
                      <div className="p-3 rounded" style={{ backgroundColor: actualTheme === 'dark' ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px dashed ${currentColors.border}` }}>
                         <p className="small mb-0" style={{ color: currentColors.textSecondary, lineHeight: "1.6" }}>
                           Enter a Transaction ID in the search bar above and click <strong style={{ color: currentColors.textPrimary }}>Execute Scan</strong> to generate a real-time anomaly profile.
                         </p>
                      </div>
                    </div>
 
                  </div>
                )}
              </div>
            </div>
          </section>
 
          {/* RIGHT: RECENT HISTORY TABLE */}
          <section className="col-lg-7">
            <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: currentColors.cardBg, border: `1px solid ${currentColors.border}` }}>
              <div className="card-header bg-transparent py-4" style={{ borderBottom: `1px solid ${currentColors.border}` }}>
                <h6 className="mb-0 fw-bold" style={{ color: currentColors.textPrimary }}>Audit Log & Recent Scans</h6>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: "550px", overflowY: "auto" }}>
                  <table className={`table ${actualTheme === 'dark' ? 'table-dark' : 'table-light'} table-hover mb-0 bg-transparent align-middle`}>
                    <thead className="small text-uppercase" style={{ position: "sticky", top: 0, background: actualTheme === 'dark' ? '#121212' : '#ffffff', zIndex: 1, color: currentColors.textSecondary }}>
                      <tr>
                        <th className="py-3 px-4 border-0">TX ID</th>
                        <th className="py-3 border-0">Account</th>
                        <th className="py-3 border-0">Location</th>
                        <th className="py-3 border-0 text-center">Score</th>
                        <th className="py-3 border-0 text-end pe-4">Manage</th>
                      </tr>
                    </thead>
                    <tbody className="border-0">
                      {history.length > 0 ? (
                        history.map((item) => (
                          <tr key={item.id} style={{ cursor: "pointer" }} onClick={() => { setSearchId(item.transactionID); handleSearch({ preventDefault: () => {} }); }}>
                            <td className="fw-bold py-3 px-4" style={{ color: currentColors.textPrimary }}>#{item.transactionID}</td>
                            <td style={{ color: currentColors.textSecondary }}>{item.accountId}</td>
                            <td style={{ color: currentColors.textSecondary }}>{item.location}</td>
                           
                            <td className="text-center">
                              <div className="d-inline-flex align-items-center justify-content-center fw-bold rounded px-2 py-1"
                                style={{
                                  backgroundColor: item.scoreValue > 70 ? "rgba(255, 77, 77, 0.15)" : item.scoreValue > 40 ? "rgba(255, 193, 7, 0.15)" : "rgba(0, 230, 118, 0.15)",
                                  color: item.scoreValue > 70 ? "#ff4d4d" : item.scoreValue > 40 ? "#ffc107" : "#00e676",
                                  fontSize: "0.85rem", minWidth: "40px"
                                }}>
                                {item.scoreValue}
                              </div>
                            </td>
                           
                            <td className="text-end pe-4">
                              <button
                                className="btn btn-sm py-1 px-2 border-0"
                                onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                style={{ color: currentColors.textSecondary }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#ff4d4d"}
                                onMouseLeave={(e) => e.currentTarget.style.color = currentColors.textSecondary}
                                title="Delete Record"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-5 bg-transparent" style={{ color: currentColors.textSecondary }}>
                            No scan history available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
         
        </div>
      </div>
    </main>
  );
};
 
export default RiskScoring;