import { useEffect, useState } from "react";
import { getAllCases } from "../services/caseService";
import { getAllAlerts } from "../services/alertService";
import { getAllRiskScores } from "../services/riskScoreService";
import { getAllTransactions } from "../services/transactionService";

import AlertsTrendChart from "../components/Dashboard/AlertsTrendChart";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    transactions: 0,
    alerts: 0,
    blocked: 0,
    fraudRate: 0,
  });

  const [cases, setCases] = useState([]);
  const [riskScores, setRiskScores] = useState([]);
  const [alertTrend, setAlertTrend] = useState([]); // ✅ REQUIRED

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    // ✅ Fetch all data
    const transactions = await getAllTransactions();
    const alerts = await getAllAlerts();
    const casesData = await getAllCases();
    const scores = await getAllRiskScores();

    // ✅ High severity alerts
    const highAlerts = alerts.filter(
      a => a.severity === "High" || a.severity === "Critical"
    );

    // ✅ KPI Cards
    setStats({
      transactions: transactions.length,
      alerts: alerts.length,
      blocked: alerts.filter(a => a.status === "Closed").length,
      fraudRate: transactions.length
        ? ((highAlerts.length / transactions.length) * 100).toFixed(1)
        : 0,
    });

    // ✅ Tables
    setCases(casesData.slice(0, 5));
    setRiskScores(scores.filter(s => s.scoreValue >= 70).slice(0, 5));

    // ✅ ALERT TREND GRAPH DATA
    const alertMap = {};
    alerts.forEach(a => {
      const date = new Date(a.createdDate).toLocaleDateString();
      alertMap[date] = (alertMap[date] || 0) + 1;
    });

    const trendData = Object.keys(alertMap).map(d => ({
      date: d,
      count: alertMap[d]
    }));

    setAlertTrend(trendData);
  }

  return (
    <div className="dashboard-page">

      {/* KPI CARDS */}
      <div className="dashboard-cards">
        <StatCard title="Total Transactions" value={stats.transactions} />
        <StatCard title="Total Alerts" value={stats.alerts} />
        <StatCard title="Blocked Users" value={stats.blocked} />
        <StatCard title="Fraud Rate" value={`${stats.fraudRate}%`} />
      </div>

      {/* ✅ ALERT TREND GRAPH */}
      <AlertsTrendChart data={alertTrend} />

      {/* CASES */}
      <div className="dashboard-section">
        <h4>Fraud / AML Cases</h4>
        <table>
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(c => (
              <tr key={c.caseID}>
                <td>{c.caseID}</td>
                <td>{c.caseType}</td>
                <td>{c.status}</td>
                <td>{c.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SUSPICIOUS TRANSACTIONS */}
      <div className="dashboard-section">
        <h4>Recent Suspicious Transactions</h4>
        <table>
          <thead>
            <tr>
              <th>TX ID</th>
              <th>Risk Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {riskScores.map(r => (
              <tr key={r.transactionID}>
                <td>{r.transactionID}</td>
                <td>{r.scoreValue}</td>
                <td>{r.scoreValue >= 90 ? "Blocked" : "Review"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}