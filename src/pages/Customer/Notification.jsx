import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import "../../style/Customer/Notification.css";

function Notification({ notifications, setNotifications }) {
  const { id } = useParams();
  const connectionRef = useRef(null);

  // Initialize readIds from LocalStorage specific to THIS customer ID
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem(`read_notifs_${id}`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // 1. Fetch history & Clear old data when ID changes
  useEffect(() => {
    if (!id) return;

    // Clear old notifications immediately when ID changes
    setNotifications([]);
    setCurrentPage(1);

    // Sync readIds state when ID changes
    const saved = localStorage.getItem(`read_notifs_${id}`);
    setReadIds(saved ? new Set(JSON.parse(saved)) : new Set());

    fetch(`https://localhost:7181/api/notification/${id}`)
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error("Fetch error:", err));
  }, [id, setNotifications]);

  // 2. SignalR live updates
  useEffect(() => {
    if (!id) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7181/notificationHub?customerId=${id}`, {
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (message) => {
      const newNotif = {
        id: Date.now(),
        message,
        timestamp: new Date().toISOString(),
      };
      setNotifications(prev => [newNotif, ...prev]);
    });

    connection.start().catch(err => console.error("SignalR error:", err));
    connectionRef.current = connection;

    return () => { if (connectionRef.current) connectionRef.current.stop(); };
  }, [id, setNotifications]);

  // 3. Mark as read and Save to LocalStorage
  const handleMarkAsRead = (notifId) => {
    const newReadIds = new Set(readIds);
    newReadIds.add(notifId);
    setReadIds(newReadIds);
    localStorage.setItem(`read_notifs_${id}`, JSON.stringify(Array.from(newReadIds)));
  };

  const filteredList = notifications.filter(n => {
    const key = n.id || n.timestamp;
    const isRead = readIds.has(key);
    if (filter === "unread") return !isRead;
    if (filter === "read") return isRead;
    return true;
  });

  const totalPages = Math.ceil(filteredList.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedList = filteredList.slice(startIndex, startIndex + pageSize);

  return (
    <div className="notification-page">
      <h2 className="page-title">Notifications for Customer {id}</h2>

      <div className="tabs">
        {["all", "unread", "read"].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${filter === tab ? "active" : ""}`}
            onClick={() => { setFilter(tab); setCurrentPage(1); }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="notification-list">
        {paginatedList.length === 0 ? (
          <div className="notif-row empty">No {filter} notifications</div>
        ) : (
          paginatedList.map((n) => {
            const key = n.id || n.timestamp;
            const isRead = readIds.has(key);
            const dateObj = new Date(n.timestamp);

            return (
              <div
                key={key}
                className={`notif-row ${isRead ? "read" : "unread"}`}
                onClick={() => handleMarkAsRead(key)}
              >
                <div className="message">{n.message}</div>
                <div className="timestamp">
                  {/* ✅ Show only date in IST */}
                  {dateObj.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
          <span>{currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}

export default Notification;
