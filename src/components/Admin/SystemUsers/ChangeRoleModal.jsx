import { useState } from "react";

export default function ChangeRoleModal({ user, roles, onClose, onSave }) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const [newRoleId, setNewRoleId] = useState(user.roleId);

  return (
    <>
      <div className="modal-backdrop-custom" onClick={onClose} />

      <div className="modal fade show d-block view-role-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-top-accent" />

            <div className="modal-header">
              <h5 className="modal-title">Change User Role</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="role-details-header">
                <div className="role-avatar">{initials}</div>

                <div className="role-meta">
                  <div className="role-name">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="role-id">
                    Current Role · {user.role}
                  </div>
                </div>
              </div>

              <div className="role-details-divider" />

              <label className="label">Select New Role</label>
              <select
                className="form-select mt-2"
                value={newRoleId}
                onChange={(e) => setNewRoleId(e.target.value)}
              >
                {roles.map((r) => (
                  <option key={r.roleId} value={r.roleId}>
                    {r.roleName}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn purple-btn"
                onClick={() => onSave(newRoleId)}
              >
                Update Role
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}