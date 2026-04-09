export default function AlertSummaryCards({ alerts }) {
  const total = alerts.length;
  const open = alerts.filter(a => a.status === "Open").length;
  const critical = alerts.filter(
    a => a.severity === "Critical" || a.severity === "High"
  ).length;

  return (
    <div className="dashboard-cards">
      <div className="card">Total Alerts<br /><strong>{total}</strong></div>
      <div className="card">Open Alerts<br /><strong>{open}</strong></div>
      <div className="card critical">High / Critical<br /><strong>{critical}</strong></div>
      <div className="card">Cases Generated<br /><strong>{critical}</strong></div>
    </div>
  );
}