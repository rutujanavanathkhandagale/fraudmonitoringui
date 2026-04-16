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

      setHistory(mergedHistory.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Error fetching from APIs:", err);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // --- ACTIONS & VALIDATION ---
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!searchId) return;

    // FIX: Added Validation Check for Transaction ID starting with '1'
    if (!searchId.toString().startsWith("1")) {
      alert("Invalid Input: Transaction ID must start with the number 1.");
      return;
    }
    
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

    // FIX: Added Validation Check for Transaction ID starting with '1'
    if (!searchId.toString().startsWith("1")) {
      alert("Invalid Input: Transaction ID must start with the number 1.");
      return;
    }

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

  // --- CALCULATED METRICS ---
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
    <main className="pt-4 pb-4" style={{ backgroundColor: "transparent", minHeight: "100vh" }}>
      <div className="container-fluid px-4">
        
        {/* HEADER */}
        <header className="mb-4 mt-2">
          <h2 className="fw-bold mb-1" style={{ color: currentColors.textPrimary }}>
            <FiShield className="me-2 mb-1" style={{ color: "#e63077" }} />
            Risk Intelligence <span style={{ color: "#e63077", fontWeight: "300" }}>Engine</span>
          </h2>
          <p style={{ color: currentColors.textSecondary, fontSize: "0.95rem" }}>AI-driven transaction profiling and real-time anomaly detection.</p>
        </header>

        {/* TOP KPI CARDS */}
        <div className="d-flex flex-wrap flex-lg-nowrap gap-3 mb-4 w-100">
          <div className="card border-0 shadow-sm flex-fill" style={{ backgroundColor: currentColors.cardBg, border: `1px solid ${currentColors.border}`, minWidth: "250px" }}>
            <div className="card-body d-flex align-items-center py-3">
              <div className="rounded-circle p-2 d-flex align-items-center justify-content-center me-3" style={{ backgroundColor: "rgba(142, 45, 226, 0.15)", color: "#8e2de2", width: "45px", height: "45px" }}>
                <FiActivity size={20} />
              </div>
              <div>
                <p className="mb-0 fw-bold text-uppercase" style={{ color: currentColors.textSecondary, fontSize: "0.65rem", letterSpacing: "1px" }}>Total Analyzed</p>
                <h4 className="mb-0 fw-bold" style={{ color: currentColors.textPrimary }}>{totalCases}</h4>
              </div>
            </div>
          </div>
          
          <div className="card border-0 shadow-sm flex-fill" style={{ backgroundColor: currentColors.cardBg, border: `1px solid ${currentColors.border}`, minWidth: "250px" }}>
            <div className="card-body d-flex align-items-center py-3">
              <div className="rounded-circle p-2 d-flex align-items-center justify-content-center me-3" style={{ backgroundColor: "rgba(255, 77, 77, 0.15)", color: "#ff4d4d", width: "45px", height: "45px" }}>
                <FiAlertTriangle size={20} />
              </div>
              <div>
                <p className="mb-0 fw-bold text-uppercase" style={{ color: currentColors.textSecondary, fontSize: "0.65rem", letterSpacing: "1px" }}>Critical Alerts</p>
                <h4 className="mb-0 fw-bold" style={{ color: currentColors.textPrimary }}>{highRiskCases}</h4>
              </div>
            </div>
          </div>
          
          <div className="card border-0 shadow-sm flex-fill" style={{ backgroundColor: currentColors.cardBg, border: `1px solid ${currentColors.border}`, minWidth: "250px" }}>
            <div className="card-body d-flex align-items-center py-3">
              <div className="rounded-circle p-2 d-flex align-items-center justify-content-center me-3" style={{ backgroundColor: "rgba(32, 201, 151, 0.15)", color: "#20c997", width: "45px", height: "45px" }}>
                <FiTarget size={20} />
              </div>
              <div>
                <p className="mb-0 fw-bold text-uppercase" style={{ color: currentColors.textSecondary, fontSize: "0.65rem", letterSpacing: "1px" }}>System Avg Score</p>
                <h4 className="mb-0 fw-bold" style={{ color: currentColors.textPrimary }}>{avgScore}<span style={{ fontSize: "0.85rem", color: currentColors.textSecondary }}>/100</span></h4>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH BAR ROW */}
        <section className="card border-0 mb-4 shadow-sm" style={{ backgroundColor: currentColors.cardBg, border: `1px solid ${currentColors.border}` }}>
          <div className="card-body p-2">
            <form className="d-flex flex-column flex-md-row gap-2 align-items-center" onSubmit={handleGenerate}>
              
              <div className="input-group border-0 rounded overflow-hidden flex-grow-1 px-2" style={{ backgroundColor: actualTheme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
                <span className="input-group-text border-0 bg-transparent px-2" style={{ color: currentColors.textSecondary }}>
                  <FiSearch />
                </span>
                {/* Notice the input type is "number" but we still treat it like a string for validation */}
                <input
                  type="number"
                  className="form-control border-0 shadow-none bg-transparent"
                  placeholder="Enter Transaction ID for deep analysis..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  style={{ color: currentColors.textPrimary }}
                />
              </div>

              <div className="d-flex gap-2 pe-2">
                <button
                  type="submit"
                  className="btn fw-bold text-white shadow-sm px-4 py-2"
                  disabled={loading}
                  style={{ background: accentGradient, border: "none", whiteSpace: "nowrap" }}
                >
                  {loading ? "Scanning..." : "Execute Scan"}
                </button>
                <button
                  type="button"
                  className="btn fw-bold shadow-sm px-4 py-2"
                  onClick={handleSearch}
                  style={{ 
                    color: currentColors.textPrimary, 
                    border: `1px solid ${currentColors.border}`, 
                    backgroundColor: actualTheme === 'dark' ? "rgba(255,255,255,0.05)" : "transparent",
                    whiteSpace: "nowrap"
                  }}
                >
                  Pull Existing
                </button>
              </div>

            </form>
          </div>
        </section>

        {/* MAIN CONTENT ROW */}
        <div className="row g-4 align-items-stretch">
          
          {/* LEFT: GAUGE VISUALIZATION */}
          <section className="col-12 col-md-5 col-lg-4">
            <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: currentColors.cardBg, border: `1px solid ${currentColors.border}` }}>
              <div className="card-body p-4 d-flex flex-column">
                <h6 className="fw-bold mb-4" style={{ color: currentColors.textPrimary, fontSize: "0.9rem" }}>
                  Case Analysis: {activeData ? <span style={{ color: currentColors.textPrimary }}>#{activeData.transactionID}</span> : <span style={{ color: currentColors.textSecondary }}>STANDBY</span>}
                </h6>
                
                {activeData ? (
                  // ----- POPULATED STATE -----
                  <div className="animate__animated animate__fadeIn flex-grow-1 d-flex flex-column">
                    
                    <div style={{ height: "160px", position: "relative", marginTop: "10px" }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={gaugeData}
                            cx="50%" cy="100%" startAngle={180} endAngle={0}
                            innerRadius={80} outerRadius={110} paddingAngle={2}
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
                        <h2 className="display-4 fw-bold m-0" style={{ color: gaugeColor, lineHeight: "1" }}>{score}</h2>
                        <p className="fw-bold text-uppercase mb-0" style={{ color: currentColors.textSecondary, letterSpacing: "1px", fontSize: "0.7rem" }}>
                          {score > 70 ? 'Critical Risk' : score > 40 ? 'Elevated Risk' : 'Low Risk'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-start">
                      <p className="small fw-bold text-uppercase mb-3" style={{ color: currentColors.textSecondary, letterSpacing: "1px", fontSize: "0.7rem" }}>Identified Risk Factors</p>
                      {activeData.reasonsJSON ? (
                        JSON.parse(activeData.reasonsJSON).map((r, i) => (
                          <div key={i} className="d-flex align-items-center p-3 mb-2 rounded border border-danger shadow-sm" style={{ background: "rgba(220, 53, 69, 0.05)", color: currentColors.textPrimary, fontSize: "0.8rem" }}>
                            <FiAlertTriangle className="text-danger me-3 flex-shrink-0" size={16} />
                            <span>{r}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 rounded border border-success d-flex align-items-center" style={{ background: "rgba(0, 230, 118, 0.05)", color: currentColors.textPrimary, fontSize: "0.8rem" }}>
                          <FiShield className="text-success me-3" size={16} />
                          <span>Transaction falls within normal parameters. No flags detected.</span>
                        </div>
                      )}
                    </div>
                  </div>

                ) : (
                  // ----- STANDBY / EMPTY STATE -----
                  <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 animate__animated animate__fadeIn" style={{ minHeight: "250px" }}>
                    
                    <div style={{ position: "relative", width: "100%", height: "140px", opacity: 0.3 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={[{ value: 100 }]}
                            cx="50%" cy="100%" startAngle={180} endAngle={0}
                            innerRadius={80} outerRadius={110}
                            dataKey="value" stroke="none"
                            fill={actualTheme === 'dark' ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
                        <FiTarget size={40} style={{ color: currentColors.textSecondary, marginBottom: "15px" }} />
                      </div>
                    </div>

                    <div className="text-center mt-4 w-100 px-2">
                      <h6 className="fw-bold text-uppercase mb-3" style={{ color: currentColors.textSecondary, letterSpacing: "2px" }}>System Ready</h6>
                      <div className="p-3 rounded" style={{ backgroundColor: actualTheme === 'dark' ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px dashed ${currentColors.border}` }}>
                         <p className="mb-0" style={{ color: currentColors.textSecondary, lineHeight: "1.6", fontSize: "0.75rem" }}>
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
          <section className="col-12 col-md-7 col-lg-8">
            <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: currentColors.cardBg, border: `1px solid ${currentColors.border}` }}>
              <div className="card-header bg-transparent py-4 text-center" style={{ borderBottom: `1px solid ${currentColors.border}` }}>
                <h6 className="mb-0 fw-bold" style={{ color: currentColors.textPrimary, fontSize: "0.9rem" }}>Audit Log & Recent Scans</h6>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: "550px", overflowY: "auto" }}>
                  <table className={`table ${actualTheme === 'dark' ? 'table-dark' : 'table-light'} table-hover mb-0 bg-transparent align-middle`}>
                    <thead className="text-uppercase" style={{ position: "sticky", top: 0, background: actualTheme === 'dark' ? '#121212' : '#ffffff', zIndex: 1, color: currentColors.textSecondary, fontSize: "0.75rem" }}>
                      <tr>
                        <th className="py-3 px-4 border-0">TX ID</th>
                        <th className="py-3 border-0">Account</th>
                        <th className="py-3 border-0">Location</th>
                        <th className="py-3 border-0 text-center">Score</th>
                        <th className="py-3 border-0 text-end pe-4">Manage</th>
                      </tr>
                    </thead>
                    <tbody className="border-0" style={{ fontSize: "0.85rem" }}>
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
                                  fontSize: "0.8rem", minWidth: "35px"
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