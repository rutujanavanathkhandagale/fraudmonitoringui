import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";//beased on door mumber
import * as signalR from "@microsoft/signalr";
import { useTheme } from "../../context/ThemeContext";
import "../../style/Customer/Notification.css";
 
function Notification({ notifications, setNotifications }) {
  const { id } = useParams();
  const connectionRef = useRef(null);
 
  // 1. Get Theme Context
  const { currentColors, actualTheme, fontSize } = useTheme();
 
  // Dynamic variables for gradients and accents
  const accentColor = actualTheme === 'frost' ? "#23a6d5" : "#B51B75";
  const activeGradient = actualTheme === 'frost'
    ? "linear-gradient(90deg, #23a6d5 0%, #23a6d5 100%)"
    : "linear-gradient(90deg, #6B1D4F 0%, #a30762 100%)";
 
  // Notification Logic
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem(`read_notifs_${id}`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
 
  useEffect(() => {
    if (!id) return;
    setNotifications([]);
    setCurrentPage(1);
    const saved = localStorage.getItem(`read_notifs_${id}`);
    setReadIds(saved ? new Set(JSON.parse(saved)) : new Set());
    fetch(`https://localhost:44372/api/notification/${id}`)
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error("Fetch error:", err));
  }, [id, setNotifications]);
 
  useEffect(() => {
    if (!id) return;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:44372/notificationHub?customerId=${id}`, {
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();
    connection.on("ReceiveNotification", (message) => {
      const newNotif = { id: Date.now(), message, timestamp: new Date().toISOString() };
      setNotifications(prev => [newNotif, ...prev]);
    });
    connection.start().catch(err => console.error("SignalR error:", err));
    connectionRef.current = connection;
    return () => { if (connectionRef.current) connectionRef.current.stop(); };
  }, [id, setNotifications]);
 
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
    <div
      className="notification-page"
      style={{
        backgroundColor: currentColors.pageBg, // Fills background
        color: currentColors.textPrimary,
        fontSize: `${fontSize}px`,
        minHeight: "100vh"
      }}
    >
      <h2 className="page-title" style={{ color: currentColors.textPrimary, textAlign: 'center' }}>
        Notifications for Customer {id}
      </h2>
 
      {/* TABS SECTION */}
      <div className="tabs">
        {["all", "unread", "read"].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${filter === tab ? "active" : ""}`}
            onClick={() => { setFilter(tab); setCurrentPage(1); }}
            style={filter === tab ? {
              background: activeGradient,
              border: 'none',
              color: '#ffffff'
            } : {
              backgroundColor: currentColors.cardBg, // Ensures buttons match theme
              color: currentColors.textSecondary,
              border: `1px solid ${currentColors.border}`
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
 
      {/* NOTIFICATION LIST SECTION */}
      <div className="notification-list">
        {paginatedList.length === 0 ? (
          <div className="notif-row empty" style={{ backgroundColor: currentColors.cardBg, color: currentColors.textSecondary }}>
            No {filter} notifications
          </div>
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
                style={{
                  backgroundColor: isRead ? currentColors.activeBg : currentColors.cardBg,
                  borderColor: currentColors.border,
                  borderLeft: isRead ? `1px solid ${currentColors.border}` : `5px solid ${accentColor}`,
                  color: isRead ? currentColors.textSecondary : currentColors.textPrimary
                }}
              >
                <div className="message">{n.message}</div>
                <div className="timestamp" style={{ color: currentColors.textSecondary }}>
                  {dateObj.toLocaleDateString("en-IN")}
                </div>
              </div>
            );
          })
        )}
      </div>
 
      {/* PAGINATION SECTION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            style={{
              backgroundColor: currentColors.buttonBg,
              color: currentColors.textPrimary,
              border: `1px solid ${currentColors.border}`
            }}
          >
            Prev
          </button>
          <span style={{ color: currentColors.textSecondary }}>{currentPage} / {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            style={{
              backgroundColor: currentColors.buttonBg,
              color: currentColors.textPrimary,
              border: `1px solid ${currentColors.border}`
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
 
export default Notification;
 