import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/audit.css";

const AUDIT_API = "https://localhost:7181/api/admin/audit";
const USER_API = "https://localhost:7181/api/system-users";

const PAGE_SIZE = 6; // ✅ rows per page

export default function AdminAudit() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [userMap, setUserMap] = useState({});

  /* ---------------- FETCH AUDIT LOGS ---------------- */
  const loadLogs = async () => {
    setLoading(true);
    try {
      let url = `${AUDIT_API}/all`;
      if (filter === "ROLE") url = `${AUDIT_API}/roles`;
      if (filter === "SYSTEMUSER") url = `${AUDIT_API}/system-users`;

      const res = await axios.get(url);
      setLogs(res.data || []);
      setCurrentPage(1); // ✅ reset pagination
    } catch (err) {
      console.error("Failed to load audit logs", err);
    }
    setLoading(false);
  };

  /* ---------------- FETCH SYSTEM USERS ---------------- */
  const loadSystemUsers = async () => {
    try {
      const res = await axios.get(USER_API);
      const map = {};
      (res.data || []).forEach((u) => {
        map[u.systemUserId] = u.systemUserCode;
      });
      setUserMap(map);
    } catch (err) {
      console.error("Failed to load system users", err);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [filter]);

  useEffect(() => {
    loadSystemUsers();
  }, []);

  /* ---------------- SEARCH ---------------- */
  const filteredLogs = search
    ? logs.filter((log) => {
        const q = search.toLowerCase();
        return (
          String(log.entityType || "").toLowerCase().includes(q) ||
          String(log.entityId || "").toLowerCase().includes(q) ||
          String(log.action || "").toLowerCase().includes(q) ||
          String(log.description || "").toLowerCase().includes(q) ||
          String(userMap[log.performedBy] || "").toLowerCase().includes(q)
        );
      })
    : logs;

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
    <div className="audit-page">
      {/* HEADER */}
      <div className="audit-header">
        <h2>Audit Management</h2>
        <p>Track all administrative activities across the system</p>
      </div>

      {/* CONTROLS */}
      <div className="audit-controls">
        <input
          placeholder="Search by entity, action, ID or user"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All Logs</option>
          <option value="ROLE">Role Logs</option>
          <option value="SYSTEMUSER">System User Logs</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="audit-table-container">
        {loading ? (
          <div className="loading">Loading audit logs...</div>
        ) : (
          <>
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Entity</th>
                  <th>ID</th>
                  <th>Action</th>
                  <th>Description</th>
                  <th>Performed By</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty">
                      No audit logs found
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((log) => (
                    <tr key={log.auditLogId}>
                      <td>{log.entityType}</td>

                      <td>
                        {log.entityType === "SystemUser"
                          ? userMap[log.entityId] || log.entityId
                          : log.entityId}
                      </td>

                      <td className={`action ${log.action.toLowerCase()}`}>
                        {log.action}
                      </td>

                      <td>{log.description}</td>

                      <td>
                        {userMap[log.performedBy] || log.performedBy}
                      </td>

                      <td>
                        {new Date(log.performedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* ✅ PAGINATION RENDER */}
            {totalPages > 1 && (
              <div className="audit-pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
