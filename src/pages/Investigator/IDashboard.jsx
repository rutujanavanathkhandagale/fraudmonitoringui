import React, { useEffect, useReducer, useMemo, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTheme } from "../../context/ThemeContext";

// --- Reducer for Alternative Data Handling ---
const initialState = {
  transactions: [],
  loading: true,
  error: null,
  filters: { location: "", id: "", amount: "" }
};

function dashboardReducer(state, action) {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, transactions: action.payload, loading: false };
    case "FETCH_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "APPLY_FILTERS":
      return { ...state, filters: action.payload };
    case "CLEAR_FILTERS":
      return { ...state, filters: { location: "", id: "", amount: "" } };
    default:
      return state;
  }
}

const Dashboard = () => {
  const { currentColors, actualTheme } = useTheme();
  
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const formRef = useRef(null);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("https://localhost:44372/api/Transaction");
        dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      } catch (err) {
        console.error("Error fetching transactions:", err);
        dispatch({ 
          type: "FETCH_ERROR", 
          payload: "Failed to fetch transactions. Please ensure the API is online." 
        });
      }
    };

    fetchTransactions();
  }, []);

  // --- Search Logic ---
  const filteredTransactions = useMemo(() => {
    return state.transactions.filter((t) => {
      const matchLocation = (t.geoLocation || "")
        .toLowerCase()
        .includes(state.filters.location.toLowerCase());
      
      const matchId = state.filters.id
        ? String(t.transactionID) === String(state.filters.id)
        : true;

      const matchAmount = state.filters.amount
        ? t.amount >= parseFloat(state.filters.amount)
        : true;

      return matchLocation && matchId && matchAmount;
    });
  }, [state.transactions, state.filters]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    dispatch({
      type: "APPLY_FILTERS",
      payload: {
        location: formData.get("location") || "",
        id: formData.get("id") || "",
        amount: formData.get("amount") || ""
      }
    });
  };

  const handleClearFilters = () => {
    if (formRef.current) formRef.current.reset();
    dispatch({ type: "CLEAR_FILTERS" });
  };

  if (state.loading) {
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

  const tableClass = actualTheme === 'dark' ? 'table-dark' : 'table-light';

  return (
    <div
      className="container-fluid py-3"
      style={{
        background: "transparent",
        minHeight: "100%",
        color: currentColors.textPrimary,
      }}
    >
      <header className="mb-3">
        <h2 className="fw-bold mb-1" style={{ color: currentColors.textPrimary }}>FraudShield Dashboard</h2>
        <p className="small mb-0" style={{ color: currentColors.textSecondary }}>Real-time Transaction Monitoring</p>
      </header>

      {state.error && <div className="alert alert-danger">{state.error}</div>}

      {/* Search Bar Section */}
      <section
        className="card shadow-sm mb-4 border-0"
        style={{
          backgroundColor: currentColors.cardBg,
          backdropFilter: actualTheme === 'frost' ? "blur(10px)" : "none",
          border: `1px solid ${currentColors.border}`
        }}
      >
        <div className="card-body p-4">
          
          {/* Title with the required bottom margin (mb-4) to separate it from the inputs */}
          <h5 className="fw-bold mb-4" style={{ color: currentColors.textPrimary }}>
            Filter Transactions
          </h5>

          {/* Strict Bootstrap Grid Structure */}
          <form ref={formRef} className="row g-3 align-items-end" onSubmit={handleApplyFilters}>
            
            <div className="col-12 col-md-6 col-xl-3">
              <label className="form-label small fw-bold mb-2" style={{ color: currentColors.textPrimary }}>Location</label>
              <input
                type="text"
                name="location"
                className="form-control shadow-none py-2"
                style={dynamicInputStyle}
                placeholder="City or Country"
              />
            </div>
            
            <div className="col-12 col-md-6 col-xl-3">
              <label className="form-label small fw-bold mb-2" style={{ color: currentColors.textPrimary }}>Transaction ID</label>
              <input
                type="text"
                name="id"
                className="form-control shadow-none py-2"
                style={dynamicInputStyle}
                placeholder="Exact ID"
              />
            </div>
            
            <div className="col-12 col-md-6 col-xl-3">
              <label className="form-label small fw-bold mb-2" style={{ color: currentColors.textPrimary }}>Min. Amount</label>
              <input
                type="number"
                name="amount"
                className="form-control shadow-none py-2"
                style={dynamicInputStyle}
                placeholder="0.00"
              />
            </div>
            
            {/* Buttons perfectly spanning the final grid column */}
            <div className="col-12 col-md-6 col-xl-3">
              <div className="d-flex gap-2 w-100">
                <button
                  type="submit"
                  className="btn flex-grow-1 py-2 fw-bold shadow-sm"
                  style={{
                    backgroundColor: "#8e2de2",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn flex-grow-1 py-2 fw-bold shadow-sm"
                  style={{
                    color: currentColors.textPrimary,
                    border: `1px solid ${currentColors.border}`,
                    backgroundColor: actualTheme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

          </form>
        </div>
      </section>

      {/* Transactions Table Section */}
      <section
        className="card shadow-sm border-0 mb-5"
        style={{
          backgroundColor: currentColors.cardBg,
          border: `1px solid ${currentColors.border}`,
          overflow: 'hidden'
        }}
      >
        <div className="card-body p-0">
          <div className="table-responsive">
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