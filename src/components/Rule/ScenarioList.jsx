import { useState } from "react";

export default function ScenarioList({ scenarios, onUpdated, onEdit, onDelete }) {
  const [deletingScenario, setDeletingScenario] = useState(null);

  return (
    <>
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Risk Domain</th>
            <th>Status</th>
            <th className="text-center" style={{ width: "120px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-white-50 py-5">
                No scenarios found.
              </td>
            </tr>
          ) : (
            scenarios.map((s) => (
              <tr key={s.scenarioId}>
                <td className="fw-bold">{s.name}</td>
                {/* Description column styled for visibility */}
                <td className="description-cell small" style={{ maxWidth: "300px" }}>
                  {s.description || "—"}
                </td>
                <td>{s.riskDomain}</td>
                <td>
                  <span className={`badge ${s.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                    {s.status}
                  </span>
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm"
                      onClick={() => onEdit(s)}
                      style={{ background: "transparent", border: "none", color: "#b18cf5" }}
                    >
                      <i className="bi bi-pencil-square fs-5"></i>
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => setDeletingScenario(s)}
                      style={{ background: "transparent", border: "none", color: "#ff6b6b" }}
                    >
                      <i className="bi bi-trash-fill fs-5"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {deletingScenario && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.8)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title text-danger">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setDeletingScenario(null)}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete scenario <strong>{deletingScenario.name}</strong>?
                </p>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-outline-light" onClick={() => setDeletingScenario(null)}>Cancel</button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    onDelete(deletingScenario.scenarioId, deletingScenario.name);
                    setDeletingScenario(null);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
