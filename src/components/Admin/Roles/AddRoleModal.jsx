import { useState, useEffect } from "react";
import { createRole } from "../../../services/Admin/roleService";
import { toast } from "react-toastify";
import "../../../styles/addRoleModal.css";
export default function AddRoleModal({ onClose, onAdded }) {
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById("roleNameInput")?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleAddRole = async () => {
    if (!roleName.trim()) {
      toast.warning("Role name is required");
      return;
    }

    try {
      setLoading(true);
      await createRole(roleName.trim());
      toast.success("Role added successfully ✅");
      onAdded();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ BLURRED BACKDROP */}
      <div className="modal-backdrop-custom" onClick={onClose} />

      {/* ✅ MODAL */}
      <div
        className="modal fade show d-block add-role-modal"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content add-role-content">

            {/* ✅ TOP ACCENT BAR (MATCHES CARDS + VIEW MODAL) */}
            <div className="modal-top-accent" />

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">Add Role</h5>
              <button
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              />
            </div>

            {/* Body */}
            <div className="modal-body">
              <label htmlFor="roleNameInput">
                Role Name
              </label>
              <input
                id="roleNameInput"
                type="text"
                placeholder="Enter role name (e.g. Admin)"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddRole()}
              />
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary purple-btn"
                onClick={handleAddRole}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Role"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
