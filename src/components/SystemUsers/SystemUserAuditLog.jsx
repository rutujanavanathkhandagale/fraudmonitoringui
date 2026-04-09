import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import SystemUserAuditLog from "../../components/SystemUsers/SystemUserAuditLog";
import "../../styles/audit.css";

export default function SystemUserAuditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="system-user-audit-page">
      {/* Top bar */}
      <div className="system-user-audit-header">
        <button
          className="system-user-back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Back to Profile
        </button>

        <h2>
          <ShieldCheck size={20} /> Audit & Activity
        </h2>
      </div>

      {/* Audit log full-width */}
      <SystemUserAuditLog systemUserId={Number(id)} />
    </div>
  );
}
