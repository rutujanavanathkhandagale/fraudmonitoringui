export default function RecentAlertsTable({ alerts }) {
  const recentAlerts = alerts
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
    .slice(0, 8);

  return (
    <div className="dashboard-table">
      <h4>Recent Alerts</h4>
      <table>
        <thead>
          <tr>
            <th>Alert ID</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {recentAlerts.map(a => (
            <tr key={a.alertID}>
              <td>{a.alertID}</td>
              <td>{a.severity}</td>
              <td>{a.status}</td>
              <td>{new Date(a.createdDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}