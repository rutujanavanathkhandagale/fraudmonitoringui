import { useEffect, useState } from "react";
import { getAllAuditLogs } from "../services/auditService";
import { ShieldCheck, Clock, User } from "lucide-react";
import "../styles/audit.css";

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      const data = await getAllAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="text-muted">Loading audit logs...</p>;

  return (
    <div className="admin-audit-page">
      <h2 className="admin-audit-title">
        <ShieldCheck size={20} /> Admin Audit Logs
      </h2>

      <div className="admin-audit-list">
        {logs.map(log => (
          <div key={log.auditLogId} className="admin-audit-card">
            <div className="admin-audit-header">
              <span className="admin-audit-action">{log.action}</span>
              <span className="admin-audit-time">
                <Clock size={12} />
                {new Date(log.performedAt).toLocaleString()}
              </span>
            </div>

            <div className="admin-audit-description">
              {log.description}
            </div>

            <div className="admin-audit-meta">
              <User size={14} />
              Entity: {log.entityType} (ID: {log.entityId}) | By: {log.performedBy}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}