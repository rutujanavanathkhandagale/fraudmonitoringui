import { Eye, CheckCircle, Ban, Shuffle } from "lucide-react";
import { useState } from "react";

import {
  approveSystemUser,
  deactivateSystemUser,
} from "../../../services/Admin/systemUserService";

import { getUserState } from "../../../utils/getUserState";

export default function SystemUserCardGrid({
  users,
  onView,
  onReload,
  onChangeRole,
}) {
  const [approvingId, setApprovingId] = useState(null);

  /* ✅ APPROVE USER */
  const handleApprove = async (userId) => {
    // Prevent duplicate clicks
    if (approvingId === userId) return;

    try {
      setApprovingId(userId);
      await approveSystemUser(userId);   // ✅ FIXED (no adminRegistrationId)
      await onReload();                  // ✅ reload updated data
    } catch (err) {
      alert(err.message || "Failed to approve user");
    } finally {
      setApprovingId(null);
    }
  };

  /* ✅ DEACTIVATE USER */
  const handleDeactivate = async (userId) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;

    try {
      await deactivateSystemUser(userId);
      await onReload();
    } catch (err) {
      alert(err.message || "Failed to deactivate user");
    }
  };

  return (
    <div className="system-user-card-grid">
      {users.map((user) => {
        const { label, css, state } = getUserState(user);

        const roleName =
          user.role ||
          user.lastAssignedRoleName ||
          "Role Deleted";

        const initials =
          (user.firstName?.[0] || "").toUpperCase() +
          (user.lastName?.[0] || "").toUpperCase();

        return (
          <div
            key={user.systemUserId}
            className={`system-user-card ${css}`}
          >
            <div className="card-top-accent" />

            {/* HEADER */}
            <div className="system-user-card-header">
              <div className="system-user-avatar">{initials}</div>
              <div className="system-user-info">
                <h4>{user.firstName} {user.lastName}</h4>
                <p className="user-email">{user.email}</p>
                <p className="role-display">{roleName}</p>
              </div>
            </div>

            {/* STATUS */}
            <div className="status-container">
              <div className={`status-tag ${css}`}>{label}</div>
            </div>

            {/* ACTIONS */}
            <div className="system-user-card-actions">
              {/* VIEW */}
              <button
                className="icon-btn view"
                onClick={() => onView(user)}
              >
                <Eye size={16} />
              </button>

              {/* ✅ PENDING → APPROVE + DEACTIVATE */}
              {state === "PENDING" && (
                <>
                  <button
                    className="icon-btn approve"
                    disabled={approvingId === user.systemUserId}
                    onClick={() => handleApprove(user.systemUserId)}
                    title={
                      approvingId === user.systemUserId
                        ? "Approving..."
                        : "Approve User"
                    }
                  >
                    <CheckCircle size={16} />
                  </button>

                  <button
                    className="icon-btn danger"
                    onClick={() =>
                      handleDeactivate(user.systemUserId)
                    }
                    title="Deactivate User"
                  >
                    <Ban size={16} />
                  </button>
                </>
              )}

              {/* ✅ ACTIVE → CHANGE ROLE + DEACTIVATE */}
              {state === "ACTIVE" && (
                <>
                  <button
                    className="icon-btn role"
                    title="Change Role"
                    onClick={() => onChangeRole(user)}
                  >
                    <Shuffle size={16} />
                  </button>

                  <button
                    className="icon-btn danger"
                    onClick={() =>
                      handleDeactivate(user.systemUserId)
                    }
                    title="Deactivate User"
                  >
                    <Ban size={16} />
                  </button>
                </>
              )}
              {/* ✅ DEACTIVATED → NO ACTIONS */}
            </div>
          </div>
        );
      })}
    </div>
  );
}