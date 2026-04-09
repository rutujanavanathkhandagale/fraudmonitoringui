import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllSystemUsers } from "../../services/systemUserService";
import {
  ArrowLeft,
  Mail,
  Phone,
  ShieldCheck,
  Fingerprint,
  User,
  Calendar
} from "lucide-react";

import "../../styles/userProfile.css";

export default function SystemUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, [id]);

  async function loadUser() {
    const data = await getAllSystemUsers();
    const found = data.find(u => u.systemUserId === Number(id));
    setUser(found);
  }

  if (!user) {
    return (
      <div className="p-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3 text-muted">Loading System User Profile…</p>
      </div>
    );
  }

  return (
    <div className="system-user-profile-page">
      {/* ===== TOP BAR ===== */}
      <div className="system-user-profile-top">
        <button
          onClick={() => navigate(-1)}
          className="system-user-back-btn"
        >
          <ArrowLeft size={16} /> Back
        </button>

       <span
  className={`system-user-status-badge ${
    !user.isActive ? "inactive" : "active"
  }`}
>
  ● {!user.isActive
      ? "Inactive – Role Deleted"
      : "Active User"}
</span>

      </div>

      <div className="row g-4">
        {/* ===== LEFT: IDENTITY CARD ===== */}
        <div className="col-lg-4">
          <div className="system-user-profile-card system-user-identity">
            <div className="system-user-avatar-lg">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>

            <div className="system-user-name-lg">
              {user.firstName} {user.lastName}
            </div>

            <div className="system-user-username">
              @{user.systemUserCode}
            </div>

            <span className="system-user-role-badge">
              {user.role} .  {user.roleId} 
            </span>
{/*             
<div className="system-user-role-id">
   <span className="system-user-role-id"> {user.roleId} </span> 
</div> */}

          </div>
        </div>

        {/* ===== RIGHT: DETAILS CARD ===== */}
        <div className="col-lg-8">
          <div className="system-user-profile-card">
            <div className="system-user-details-title">
              <User size={18} />
              User Details
            </div>

            <div className="system-user-details-divider" />

            <div className="system-user-details-grid">
              {/* Email */}
              <Detail
                icon={<Mail size={18} />}
                label="Email"
                value={user.email}
              />

              {/* Phone */}
              <Detail
                icon={<Phone size={18} />}
                label="Phone"
                value={user.phoneNo}
              />

              {/* Registration ID */}
              <Detail
                icon={<Fingerprint size={18} />}
                label="Registration ID"
                value={user.registrationId}
              />

              {/* Approved At */}
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
              Managed by System Administration
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== DETAIL ITEM COMPONENT ===== */

function Detail({ icon, label, value }) {
  return (
    <div className="system-user-detail">
      <div className="system-user-detail-icon">
        {icon}
      </div>

      <div>
        <div className="system-user-detail-label">
          {label}
        </div>
        <div className="system-user-detail-value">
          {value}
        </div>
      </div>
    </div>
  );
}