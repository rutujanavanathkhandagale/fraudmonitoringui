import { Eye, CheckCircle } from "lucide-react";
import { approveSystemUser } from "../../services/systemUserService";

export default function SystemUserCardGrid({ users, onView, onReload }) {
  const adminRegistrationId = 1; // replace later with auth context

  async function handleApprove(id) {
    await approveSystemUser(id, adminRegistrationId);
    onReload();
  }

  return (
    <div className="system-user-card-grid">
      {users.map((user) => {
        const initials =
          user.firstName?.[0]?.toUpperCase() +
          user.lastName?.[0]?.toUpperCase();

        return (
          <div key={user.systemUserId} className="system-user-card">
            <div className="system-user-top-accent" />

            {/* HEADER */}
            <div className="system-user-card-header">
              <div className="system-user-avatar">{initials}</div>

              <div className="system-user-info">
                <h4>
                  {user.firstName} {user.lastName}
                </h4>
                <p>{user.email}</p>
              </div>
            </div>

            {/* STATUS (✅ use isActive ONLY) */}
            <div
              className={`system-user-status ${
                user.isActive ? "active" : "inactive"
              }`}
            >
              {user.isActive ? "Active" : "Inactive – Role Deleted"}
            </div>

            {/* ACTIONS */}
            <div className="system-user-card-actions">
              <button
                className="icon-btn view"
                onClick={() => onView(user)}
              >
                <Eye size={16} />
              </button>

              {/* ✅ Approve only if user is active AND not approved */}
              {!user.isApproved && user.isActive && (
                <button
                  className="icon-btn approve"
                  onClick={() => handleApprove(user.systemUserId)}
                >
                  <CheckCircle size={16} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
