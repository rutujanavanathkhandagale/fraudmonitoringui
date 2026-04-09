import { useState } from "react";
import { deleteRole } from "../../services/roleService";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

export default function DeleteRoleModal({ role, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteRole(role.roleId);

      toast.success("Role deleted successfully ✅");
      onDeleted();
      onClose();
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ BLURRED BACKDROP */}
      <div
        className="modal-backdrop-custom"
        onClick={onClose}
      />

      {/* ✅ MODAL */}
      <div
        className="modal fade show d-block delete-role-modal"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content delete-role-content">

            {/* ✅ TOP ACCENT BAR (MATCHES CARDS & OTHER MODALS) */}
            <div className="modal-top-accent" />

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title delete-title">
                <Trash2 size={18} />
                Confirm Delete
              </h5>
              <button
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              />
            </div>

            {/* Body */}
            <div className="modal-body">
              <p className="delete-text">
                Are you sure you want to delete the role
                <strong> “{role.roleName}”</strong>?
              </p>

              <div className="delete-warning">
                This action cannot be undone.
              </div>
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
                className="btn btn-danger delete-btn-primary"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}