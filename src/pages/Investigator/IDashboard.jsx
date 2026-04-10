import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTheme } from "../../context/ThemeContext";
 // <-- IMPORT THEME CONTEXT
 
const Dashboard = () => {
  const { currentColors, actualTheme } = useTheme(); // <-- GET DYNAMIC COLORS
 
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState({ location: "", id: "", amount: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
 
  // --- Fetch Data ---
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("https://localhost:44372/api/Transaction");
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to fetch transactions. Please ensure the API is online.");
      } finally {
        setLoading(false);
      }
    };
 
    fetchTransactions();
  }, []);
 
  // --- Search Logic (Optimized with useMemo) ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchLocation = (t.geoLocation || "")
        .toLowerCase()
        .includes(search.location.toLowerCase());
     
      const matchId = search.id
        ? String(t.transactionID) === String(search.id)
        : true;
 
      const matchAmount = search.amount
        ? t.amount >= parseFloat(search.amount)
        : true;
 
      return matchLocation && matchId && matchAmount;
    });
  }, [transactions, search]);
 
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  };
 
  const resetSearch = () => {
    setSearch({ location: "", id: "", amount: "" });
  };
 
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
 
  // DYNAMIC STYLE LOGIC FOR INPUTS
  const dynamicInputStyle = {
    backgroundColor: actualTheme === 'dark' ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
    color: currentColors.textPrimary,
    border: `1px solid ${currentColors.border}`,
  };
 
  // DYNAMIC TABLE CLASS
  const tableClass = actualTheme === 'dark' ? 'table-dark' : 'table-light';
 
  return (
    <div
      className="container-fluid py-4 pt-4"
      style={{
        background: "transparent",
        minHeight: "100%",
        color: currentColors.textPrimary, // Changed from hardcoded #fff
      }}
    >
      <header className="mb-4 mt-4">
        {/* Changed from text-light */}
        <h2 className="fw-bold" style={{ color: currentColors.textPrimary }}>FraudShield Dashboard</h2>
        <p className="small" style={{ color: currentColors.textSecondary }}>Real-time Transaction Monitoring</p>
      </header>
 
      {error && <div className="alert alert-danger">{error}</div>}
 
      {/* Search Bar Section */}
      <section
        className="card shadow-sm mb-4 border-0"
        style={{
          backgroundColor: currentColors.cardBg, // Changed from hardcoded rgba
          backdropFilter: actualTheme === 'frost' ? "blur(10px)" : "none",
          border: `1px solid ${currentColors.border}`
        }}
      >
        <div className="card-body p-4">
          <h5 className="card-title mb-3 fw-bold" style={{ color: currentColors.textPrimary }}>Filter Transactions</h5>
          <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
            <div className="col-md-4">
              <label className="form-label small fw-bold" style={{ color: currentColors.textPrimary }}>Location</label>
              <input
                type="text"
                name="location"
                className="form-control shadow-none"
                style={dynamicInputStyle} // Applies dynamic theme
                value={search.location}
                onChange={handleSearchChange}
                placeholder="City or Country"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold" style={{ color: currentColors.textPrimary }}>Transaction ID</label>
              <input
                type="text"
                name="id"
                className="form-control shadow-none"
                style={dynamicInputStyle} // Applies dynamic theme
                value={search.id}
                onChange={handleSearchChange}
                placeholder="Exact ID"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold" style={{ color: currentColors.textPrimary }}>Min. Amount</label>
              <input
                type="number"
                name="amount"
                className="form-control shadow-none"
                style={dynamicInputStyle} // Applies dynamic theme
                value={search.amount}
                onChange={handleSearchChange}
                placeholder="0.00"
              />
            </div>
            <div className="col-12 pt-2">
              <button
                type="button"
                onClick={resetSearch}
                className="btn px-4 py-2 fw-bold shadow-sm"
                style={{
                  color: currentColors.textPrimary,
                  border: `1px solid ${currentColors.border}`,
                  backgroundColor: actualTheme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                }}
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>
      </section>
 
      {/* Transactions Table Section */}
      <section
        className="card shadow-sm border-0 mb-5"
        style={{
          backgroundColor: currentColors.cardBg, // Dynamic Background
          border: `1px solid ${currentColors.border}`,
          overflow: 'hidden'
        }}
      >
        <div className="card-body p-0">
          <div className="table-responsive">
            {/* Dynamic Table Class applied here */}
            <table className={`table ${tableClass} table-hover mb-0 align-middle bg-transparent`}>
              <thead style={{ position: "sticky", top: 0, zIndex: 1, borderBottom: `2px solid ${currentColors.border}` }}>
                <tr>
                  <th className="ps-4 py-3 border-0" style={{ color: currentColors.textSecondary }}>ID</th>
                  <th className="py-3 border-0" style={{ color: currentColors.textSecondary }}>Account</th>
                  <th className="py-3 border-0" style={{ color: currentColors.textSecondary }}>Amount</th>
                  <th className="py-3 border-0" style={{ color: currentColors.textSecondary }}>Status</th>
                  <th className="py-3 border-0" style={{ color: currentColors.textSecondary }}>Customer</th>
                  <th className="py-3 border-0" style={{ color: currentColors.textSecondary }}>Location</th>
                  <th className="py-3 pe-4 border-0" style={{ color: currentColors.textSecondary }}>Timestamp</th>
                </tr>
              </thead>
              <tbody className="border-0">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <tr key={t.transactionID}>
                      <td className="ps-4 fw-bold py-3" style={{ color: currentColors.textPrimary }}>#{t.transactionID}</td>
                      <td style={{ color: currentColors.textSecondary }}>{t.accountID}</td>
                      <td className="fw-bold" style={{ color: currentColors.textPrimary }}>${t.amount?.toLocaleString()}</td>
                      <td>
                        {/* Dynamic Badges that look good in both light and dark mode */}
                        <span
                          className="badge px-2 py-1"
                          style={{
                            backgroundColor: t.status === "Posted" ? "rgba(0, 230, 118, 0.15)" : t.status === "Reversed" ? "rgba(255, 77, 77, 0.15)" : "rgba(100, 100, 100, 0.15)",
                            color: t.status === "Posted" ? (actualTheme === 'dark' ? "#00e676" : "#00a152") : t.status === "Reversed" ? "#ff4d4d" : currentColors.textSecondary,
                            fontSize: "0.85rem",
                            border: `1px solid ${t.status === "Posted" ? "rgba(0, 230, 118, 0.3)" : t.status === "Reversed" ? "rgba(255, 77, 77, 0.3)" : "transparent"}`
                          }}
                        >
                          {t.status || "N/A"}
                        </span>
                      </td>
                      <td className="small" style={{ color: currentColors.textSecondary }}>{t.customerType}</td>
                      <td className="small" style={{ color: currentColors.textSecondary }}>{t.geoLocation}</td>
                      <td className="pe-4 small" style={{ color: currentColors.textSecondary }}>
                        {t.timestamp
                          ? new Date(t.timestamp).toLocaleString()
                          : t.date
                            ? new Date(t.date).toLocaleString()
                            : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5" style={{ color: currentColors.textSecondary }}>
                      No transactions match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
 
export default Dashboard;