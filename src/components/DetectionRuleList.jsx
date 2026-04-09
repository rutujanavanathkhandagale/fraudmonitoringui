import React from 'react';

export default function DetectionRuleList({ rules, onEdit, onDelete }) {
  if (!rules || rules.length === 0) {
    return <p className="text-white-50 p-5 text-center">No detection rules found.</p>;
  }

  const renderStatusBadge = (status) => {
    const isActive = status?.toLowerCase() === "active";
    return (
      <span className={`badge ${isActive ? "bg-success" : "bg-secondary"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Scenario Name</th>
            <th>Risk Domain</th>
            <th>Scenario Status</th>
            <th>Expression</th>
            <th>Threshold</th>
            <th>Version</th>
            <th>Customer Type</th>
            <th>Rule Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.ruleId}>
              <td className="fw-bold text-white">{rule.scenario?.name}</td>
              <td className="text-white">{rule.scenario?.riskDomain}</td>
              <td>{renderStatusBadge(rule.scenario?.status)}</td>
              <td className="text-white opacity-75">{rule.expression}</td>
              <td className="text-white">{rule.threshold}</td>
              <td className="text-white">{rule.version}</td>
              <td className="text-white">{rule.customerType}</td>
              <td>{renderStatusBadge(rule.status)}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-sm"
                    onClick={() => onEdit(rule)}
                    style={{ color: "rgba(255,255,255,0.7)", background: "transparent", border: "none" }}
                  >
                    <i className="bi bi-pencil-square fs-5"></i>
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => onDelete(rule)}
                    style={{ color: "rgba(255,255,255,0.7)", background: "transparent", border: "none" }}
                  >
                    <i className="bi bi-trash-fill fs-5"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}