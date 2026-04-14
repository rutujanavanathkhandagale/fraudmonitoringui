import { Eye, Trash2 } from "lucide-react";
import "../../../styles/roleCard.css";

export default function RoleCard({ role, onView, onDelete }) {
  const initials = role.roleName
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="role-card">
      <div className="card-top-border" />

      <div className="role-card-header">
        <div className="role-avatar">{initials}</div>

        <div className="role-info">
          <h4>{role.roleName}</h4>

          {/* ✅ ADDED: USER COUNT */}
          <span className="role-user-count">
            👥 {role.activeUserCount} Active Users
          </span>
        </div>
      </div>

      <div className="role-card-actions">
        <button className="icon-btn view" onClick={onView}>
          <Eye size={16} />
        </button>

        <button className="icon-btn delete" onClick={onDelete}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}