import { useEffect, useState } from "react";
import { getCases } from "../../services/AlertCase/caseApi";


import { Line, Doughnut } from "react-chartjs-2";
import { getAllAlerts } from "../../services/AlertCase/alertApi";
import { useTheme } from "../../context/ThemeContext";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
 
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);
 
export default function Dashboard() {
  const { currentColors, actualTheme } = useTheme();
  const [alerts, setAlerts] = useState([]);
  const [cases, setCases] = useState([]);
 
  useEffect(() => {
    fetchData();
  }, []);
 
  const fetchData = async () => {
    try {
      const alertRes = await getAllAlerts();
      setAlerts(alertRes.data || []);
      const caseRes = await getCases();
      const caseData = caseRes?.data?.$values || caseRes?.data?.data || caseRes.data || [];
      setCases(Array.isArray(caseData) ? caseData : []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
 
  const totalAlerts = alerts.length;
  const openCases = cases.filter((c) => c.status === "Investigating").length;
  const closedCases = cases.filter((c) => c.status === "Closed").length;
  const highRisk = alerts.filter((a) => a.severity === "Critical").length;
 
  const cardBg = actualTheme === 'frost' ? "rgba(255, 255, 255, 0.7)" : "rgba(10, 10, 20, 0.6)";
  const cardBorder = actualTheme === 'frost' ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.1)";
 
  const getSeverityStyle = (s) => ({
    background: s === "Critical" ? "rgba(139, 92, 246, 0.25)" : s === "High" ? "rgba(167, 139, 250, 0.25)" : s === "Medium" ? "rgba(196, 181, 253, 0.25)" : "rgba(221, 214, 254, 0.25)",
    color: "#e0e7ff",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid rgba(255,255,255,0.1)"
  });
 
  const getStatusStyle = (s) => ({
    background: s === "Open" ? "rgba(99, 102, 241, 0.25)" : s === "Investigating" ? "rgba(139, 92, 246, 0.25)" : "rgba(167, 139, 250, 0.25)",
    color: "#e0e7ff",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid rgba(255,255,255,0.1)"
  });
 
  const doughnutData = {
    labels: ["Critical", "High", "Medium", "Low"],
    datasets: [{
      data: [
        alerts.filter((a) => a.severity === "Critical").length,
        alerts.filter((a) => a.severity === "High").length,
        alerts.filter((a) => a.severity === "Medium").length,
        alerts.filter((a) => a.severity === "Low").length,
      ],
      backgroundColor: ["#6d28d9", "#7c3aed", "#8b5cf6", "#c4b5fd"],
    }],
  };
 
  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Fraud Activity",
      data: [20, 15, 30, 25, 45, 35, 50],
      borderColor: "#8b5cf6",
      tension: 0.4,
    }],
  };
 
  return (
    <div style={{ padding: "20px", color: currentColors.textPrimary, maxWidth: "1200px", margin: "0 auto" }}>
      <style>
        {`
          .dashboard-card {
            transition: all 0.3s ease;
            cursor: pointer;
            flex: 1;
          }
          .dashboard-card:hover {
            transform: translateY(-5px); /* Reduced movement to match other pages */
            filter: brightness(1.1);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          }
        `}
      </style>
 
      <h2 style={sectionHeading}>Dashboard</h2>
 
      {/* UPDATED: Container width restricted to match compact style of other pages */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "15px",
        marginTop: "20px",
        width: "80%", // Adjusted to prevent cards from being too large/stretched
        justifyContent: "flex-start"
      }}>
        <Card title="CRITICAL" value={highRisk} color="#4c1d95" bg={cardBg} borderColor={cardBorder} />
        <Card title="HIGH" value={totalAlerts} color="#7c3aed" bg={cardBg} borderColor={cardBorder} />
        <Card title="MEDIUM" value={openCases} color="#a78bfa" bg={cardBg} borderColor={cardBorder} />
        <Card title="LOW" value={closedCases} color="#ddd6fe" bg={cardBg} borderColor={cardBorder} />
      </div>
 
      <div style={{ display: "flex", gap: "20px", marginTop: "30px", flexWrap: "wrap", justifyContent: "space-between" }}>
        <div style={box}>
          <h4>Fraud Activity Over Time</h4>
          <Line data={lineData} />
        </div>
 
        <div style={box}>
          <h4>Severity Distribution</h4>
          <div style={{ width: "260px", height: "260px", margin: "auto" }}>
            <Doughnut data={doughnutData} options={{ cutout: "70%", plugins: { legend: { labels: { color: currentColors.textSecondary } } } }} />
          </div>
        </div>
      </div>
 
      <div style={box}>
        <h3 style={sectionHeading}>Recent Alerts 🚨</h3>
        <table style={table}>
          <thead>
            <tr>
              <th style={headerStyle}>ID</th>
              <th style={headerStyle}>Transaction</th>
              <th style={headerStyle}>Severity</th>
              <th style={headerStyle}>Status</th>
              <th style={headerStyle}>Date</th>
              <th style={headerStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.slice(0, 5).map((a) => (
              <tr key={a.alertID}>
                <td style={cellStyle}>{a.alertID}</td>
                <td style={cellStyle}>{a.transactionID}</td>
                <td style={cellStyle}><span style={getSeverityStyle(a.severity)}>{a.severity}</span></td>
                <td style={cellStyle}><span style={getStatusStyle(a.status)}>{a.status}</span></td>
                <td style={cellStyle}>{a.createdDate ? new Date(a.createdDate).toLocaleString() : "N/A"}</td>
                <td style={cellStyle}>👁️ ➕</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      <div style={box}>
        <h3 style={sectionHeading}>Recent Cases 📝</h3>
        <table style={table}>
          <thead>
            <tr>
              <th style={headerStyle}>CaseID</th>
              <th style={headerStyle}>Customer</th>
              <th style={headerStyle}>Transaction</th>
              <th style={headerStyle}>Type</th>
              <th style={headerStyle}>Priority</th>
              <th style={headerStyle}>Status</th>
              <th style={headerStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {cases.slice(0, 5).map((c) => (
              <tr key={c.caseID}>
                <td style={cellStyle}>CASE-{c.caseID}</td>
                <td style={cellStyle}>
                  <strong>{c.customerName}</strong>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>ID: {c.customerId}</div>
                </td>
                <td style={cellStyle}>{c.transactionId}</td>
                <td style={cellStyle}><span style={{ ...getSeverityStyle("Default"), padding: "4px 10px" }}>{c.caseType}</span></td>
                <td style={cellStyle}><span style={{ ...getSeverityStyle("High"), padding: "4px 10px" }}>{c.priority}</span></td>
                <td style={cellStyle}><span style={getStatusStyle(c.status)}>{c.status}</span></td>
                <td style={cellStyle}>{c.createdDate ? new Date(c.createdDate).toLocaleString() : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
// THEMED CARD COMPONENT - Compacted to match Alerts/Cases page
function Card({ title, value, color, bg, borderColor }) {
  return (
    <div className="dashboard-card" style={{
      background: bg,
      border: `1px solid ${borderColor}`,
      borderRadius: "12px", // Matches standard border radius from other pages
      padding: "15px 10px", // Much more compact padding
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      backdropFilter: "blur(10px)",
      minWidth: "140px" // Ensures they stay consistent
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: "20%",
        height: "60%",
        width: "3px",
        background: color,
        borderRadius: "0 4px 4px 0",
        boxShadow: `0 0 10px ${color}`
      }} />
 
      <p style={{
        color: color,
        fontSize: "10px", // Smaller label
        fontWeight: "800",
        letterSpacing: "1px",
        marginBottom: "5px",
        margin: 0
      }}>{title}</p>
      <h2 style={{
        fontSize: "22px", // Smaller value
        fontWeight: "900",
        margin: 0
      }}>{value}</h2>
    </div>
  );
}
 
const box = {
  flex: "1 1 300px",
  minWidth: "300px",
  padding: "20px",
  borderRadius: "12px",
  background: "rgba(45,19,74,0.4)",
  marginBottom: "30px",
  backdropFilter: "blur(5px)",
  border: "1px solid rgba(255,255,255,0.05)"
};
 
const table = {
  width: "100%",
  marginTop: "10px",
  borderCollapse: "separate",
  borderSpacing: "0 12px",
};
 
const cellStyle = {
  padding: "12px",
  textAlign: "center",
  borderBottom: "1px solid rgba(255,255,255,0.08)"
};
 
const headerStyle = {
  padding: "12px",
  textAlign: "center",
  color: "#cbd5f5",
  fontSize: "16px",
  fontWeight: "700",
  borderBottom: "1px solid rgba(255,255,255,0.15)"
};
 
const sectionHeading = {
  fontSize: "26px",
  fontWeight: "700",
  marginBottom: "15px",
  borderBottom: "2px solid rgba(255,255,255,0.2)",
  paddingBottom: "5px"
};