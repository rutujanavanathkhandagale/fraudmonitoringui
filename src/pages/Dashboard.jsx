// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
 
// /**
//  * Dashboard Component
//  * Displays a list of transactions with search and filter capabilities.
//  */
// const Dashboard = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [search, setSearch] = useState({ location: "", id: "", amount: "" });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
 
//   // --- Fetch Data ---
//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const res = await axios.get("https://localhost:7181/api/Transaction");
//         setTransactions(res.data);
//       } catch (err) {
//         console.error("Error fetching transactions:", err);
//         setError("Failed to fetch transactions. Please ensure the API is online.");
//       } finally {
//         setLoading(false);
//       }
//     };
 
//     fetchTransactions();
//   }, []);
 
//   // --- Search Logic (Optimized with useMemo) ---
//   const filteredTransactions = useMemo(() => {
//     return transactions.filter((t) => {
//       const matchLocation = (t.geoLocation || "")
//         .toLowerCase()
//         .includes(search.location.toLowerCase());
     
//       const matchId = search.id
//         ? String(t.transactionID) === String(search.id)
//         : true;
 
//       const matchAmount = search.amount
//         ? t.amount >= parseFloat(search.amount)
//         : true;
 
//       return matchLocation && matchId && matchAmount;
//     });
//   }, [transactions, search]);
 
//   const handleSearchChange = (e) => {
//     const { name, value } = e.target;
//     setSearch((prev) => ({ ...prev, [name]: value }));
//   };
 
//   const resetSearch = () => {
//     setSearch({ location: "", id: "", amount: "" });
//   };
 
//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <div className="spinner-border text-light" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }
 
//   return (
//     <div
//       className="container-fluid py-4"
//       style={{
//         background: "transparent",
//         minHeight: "100%",
//         color: "#fff",
//       }}
//     >
//       <header className="mb-4">
//         <h2 className="fw-bold text-light">FraudShield Dashboard</h2>
//         <p className="text-muted small">Real-time Transaction Monitoring</p>
//       </header>
 
//       {error && <div className="alert alert-danger">{error}</div>}
 
//       {/* Search Bar Section */}
//       <section
//         className="card shadow-sm mb-4 border-0"
//         style={{ backgroundColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", color: "#fff" }}
//       >
//         <div className="card-body">
//           <h5 className="card-title mb-3">Filter Transactions</h5>
//           <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
//             <div className="col-md-4">
//               <label className="form-label small opacity-75">Location</label>
//               <input
//                 type="text"
//                 name="location"
//                 className="form-control bg-dark text-white border-secondary"
//                 value={search.location}
//                 onChange={handleSearchChange}
//                 placeholder="City or Country"
//               />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label small opacity-75">Transaction ID</label>
//               <input
//                 type="text"
//                 name="id"
//                 className="form-control bg-dark text-white border-secondary"
//                 value={search.id}
//                 onChange={handleSearchChange}
//                 placeholder="Exact ID"
//               />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label small opacity-75">Min. Amount</label>
//               <input
//                 type="number"
//                 name="amount"
//                 className="form-control bg-dark text-white border-secondary"
//                 value={search.amount}
//                 onChange={handleSearchChange}
//                 placeholder="0.00"
//               />
//             </div>
//             <div className="col-12 pt-2">
//               <button
//                 type="button"
//                 onClick={resetSearch}
//                 className="btn btn-outline-light px-4"
//                 style={{ fontWeight: "bold" }}
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </form>
//         </div>
//       </section>
 
//       {/* Transactions Table Section */}
//       <section
//         className="card shadow-sm border-0"
//         style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#fff" }}
//       >
//         <div className="card-body p-0">
//           <div className="table-responsive">
//             <table className="table table-dark table-hover mb-0 align-middle">
//               <thead className="bg-dark">
//                 <tr>
//                   <th className="ps-3 py-3">ID</th>
//                   <th className="py-3">Account</th>
//                   <th className="py-3">Amount</th>
//                   <th className="py-3">Status</th>
//                   <th className="py-3">Customer</th>
//                   <th className="py-3">Location</th>
//                   <th className="py-3 pe-3">Timestamp</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTransactions.length > 0 ? (
//                   filteredTransactions.map((t) => (
//                     <tr key={t.transactionID}>
//                       <td className="ps-3 fw-bold">#{t.transactionID}</td>
//                       <td>{t.accountID}</td>
//                       <td className="fw-bold">${t.amount?.toLocaleString()}</td>
//                       <td>
//                         <span
//                           className={`badge ${
//                             t.status === "Posted" ? "bg-success" :
//                             t.status === "Reversed" ? "bg-danger" : "bg-secondary"
//                           }`}
//                         >
//                           {t.status || "N/A"}
//                         </span>
//                       </td>
//                       <td className="small">{t.customerType}</td>
//                       <td className="small">{t.geoLocation}</td>
//                       {/* --- FIX APPLIED HERE --- */}
//                       <td className="pe-3 small text-light">
//                         {t.timestamp
//                           ? new Date(t.timestamp).toLocaleString()
//                           : t.date
//                             ? new Date(t.date).toLocaleString()
//                             : "N/A"}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="text-center py-5 text-muted">
//                       No transactions match your search criteria.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };
 
// export default Dashboard;