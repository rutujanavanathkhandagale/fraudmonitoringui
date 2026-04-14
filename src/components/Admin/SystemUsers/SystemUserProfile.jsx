import {
  Ban,
  Mail,
  Phone,
  ShieldCheck,
  Fingerprint,
  User,
  Calendar,
  X,
} from "lucide-react";
import { getUserState } from "../../../utils/getUserState";
import "../../../styles/userProfile.css";

export default function SystemUserProfile({ user, onClose, onDeactivate }) {
  if (!user) return null;

  const { label, css, state } = getUserState(user);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("user-profile-overlay")) {
      onClose();
    }
  };

  return (
    <div className="user-profile-overlay" onClick={handleOverlayClick}>
      <div className="system-user-profile-page">
        {/* TOP ACCENT */}
        <div className="profile-top-accent" />

        {/* HEADER */}
        <div className="system-user-profile-top">
          <button className="system-user-back-btn" onClick={onClose}>
            <X size={16} /> Close
          </button>

          <div className="profile-actions">
            <span className={`system-user-status-badge ${css}`}>
              ● {label}
            </span>

            {(state === "PENDING" || state === "ACTIVE") && (
              <button
                className="system-user-deactivate-btn"
                onClick={() => onDeactivate(user.systemUserId)}
              >
                <Ban size={16} /> Deactivate
              </button>
            )}
          </div>
        </div>

        <div className="profile-content">
          {/* LEFT */}
          <div className="system-user-profile-card system-user-identity">
            <div className="system-user-avatar-lg">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </div>

            <h2 className="system-user-name-lg">
              {user.firstName} {user.lastName}
            </h2>
            <div className="system-user-username">@{user.systemUserCode}</div>

            <span className="system-user-role-badge">
              {user.role || user.lastAssignedRoleName || "Role Deleted"}
            </span>
          </div>

          {/* RIGHT */}
          <div className="system-user-profile-card">
            <div className="system-user-details-title">
              <User size={18} /> User Details
            </div>

            <div className="system-user-details-grid">
              <Detail
                icon={<Mail size={18} />}
                label="Email Address"
                value={user.email}
              />
              <Detail
                icon={<Phone size={18} />}
                label="Phone Number"
                value={user.phoneNo}
              />
              <Detail
                icon={<Fingerprint size={18} />}
                label="Registration ID"
                value={user.registrationId}
              />
              <Detail
                icon={<Calendar size={18} />}
                label="Approved At"
                value={
                  user.approvedAt
                    ? new Date(user.approvedAt).toLocaleString()
                    : "Not Approved"
                }
              />
            </div>

            <div className="system-user-info-note">
              <ShieldCheck size={16} />
              <span>
                This user profile is securely managed by System Administration.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="system-user-detail">
      <div className="system-user-detail-icon">{icon}</div>
      <div>
        <div className="system-user-detail-label">{label}</div>
        <div className="system-user-detail-value">
          {value || "N/A"}
        </div>
      </div>
    </div>
  );
}