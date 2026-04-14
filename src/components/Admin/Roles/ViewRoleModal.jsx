export default function ViewRoleModal({ role, onClose }) {
  const initials = role.roleName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* ✅ BLURRED BACKDROP */}
      <div
        className="modal-backdrop-custom"
        onClick={onClose}
      />

      {/* ✅ MODAL */}
      <div
        className="modal fade show d-block view-role-modal"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            {/* ✅ TOP ACCENT BAR (MATCHES ROLE CARD) */}
            <div className="modal-top-accent" />

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">Role Details</h5>
              <button
                className="btn-close"
                onClick={onClose}
              />
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="role-details-header">
                <div className="role-avatar">
                  {initials}
                </div>

                <div className="role-meta">
                  <div className="role-name">{role.roleName}</div>
                  <div className="role-id">
                    Role ID · {role.roleId}
                  </div>
                </div>
              </div>

              <div className="role-details-divider" />

              <div className="role-details-info">
                <span className="label">Created On</span>
                <div className="value">
                  {role.createdAt
  ? new Date(role.createdAt).toLocaleString("en-GB")
  : "N/A"}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}