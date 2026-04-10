import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { updateDetectionRule } from "../../services/Rule/detectionRuleService";
 
export default function DetectionRuleEditForm({ rule, onRuleUpdated }) {
  const [formData, setFormData] = useState({
    scenarioName: "",
    riskDomain: "",
    scenarioStatus: "",
    expression: "",
    threshold: "",
    version: "",
    customerType: "",
    ruleStatus: "Active",
  });
  const [errors, setErrors] = useState({});
 
  useEffect(() => {
    if (rule) {
      setFormData({
        scenarioName: rule.scenario?.name || "",
        riskDomain: rule.scenario?.riskDomain || "",
        scenarioStatus: rule.scenario?.status || "",
        expression: rule.expression || "",
        threshold: rule.threshold?.toString() || "",
        version: rule.version || "",
        customerType: rule.customerType || "",
        ruleStatus: rule.status || "Active",
      });
    }
  }, [rule]);
 
  // Logic to disable the Save button if required fields are empty
  const isFormInvalid =
    !formData.expression.trim() ||
    !formData.threshold.toString().trim() ||
    !formData.version.trim() ||
    !formData.customerType.trim();
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
 
    // Real-time validation for error messages
    if (value.trim() === "") {
      setErrors(prev => ({ ...prev, [name]: "This field is required." }));
    } else {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    const payload = {
      ruleId: rule.ruleId,
      scenarioId: rule.scenarioId,
      expression: formData.expression.trim(),
      threshold: Number(formData.threshold),
      version: formData.version.trim(),
      customerType: formData.customerType.trim(),
      status: formData.ruleStatus,
    };
 
    try {
      await updateDetectionRule(rule.ruleId, payload);
      Swal.fire({
        title: "Rule Updated",
        text: "Detection rule has been updated successfully!",
        icon: "success",
        confirmButtonColor: "#198754",
        background: "#1e1e1e",
        color: "#fff",
      });
      onRuleUpdated();
    } catch (error) {
      console.error("Error updating detection rule:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update detection rule.",
        icon: "error",
        background: "#1e1e1e",
        color: "#fff",
      });
    }
  };
 
  // Inline style for the blurred/disabled look
  const disabledStyle = {
    filter: "blur(0.5px)",
    opacity: 0.6,
    cursor: "not-allowed",
    backgroundColor: "rgba(255, 255, 255, 0.05)"
  };
 
  return (
    <form onSubmit={handleSubmit} className="text-white">
      {/* Read-Only Section (Blurred) */}
      <div className="mb-3">
        <label className="form-label small opacity-50">Scenario Name (Read-only)</label>
        <input
            type="text"
            className="form-control border-secondary text-white"
            value={formData.scenarioName}
            disabled
            style={disabledStyle}
        />
      </div>
     
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label small opacity-50">Risk Domain</label>
          <input type="text" className="form-control border-secondary text-white" value={formData.riskDomain} disabled style={disabledStyle} />
        </div>
        <div className="col-md-6">
          <label className="form-label small opacity-50">Scenario Status</label>
          <input type="text" className="form-control border-secondary text-white" value={formData.scenarioStatus} disabled style={disabledStyle} />
        </div>
      </div>
 
      <hr className="border-secondary opacity-25" />
 
      {/* Editable Section */}
      <div className="mb-3">
        <label className="form-label">Expression <span className="text-danger">*</span></label>
        <input
          type="text"
          name="expression"
          className={`form-control bg-dark text-white ${errors.expression ? "is-invalid" : "border-secondary"}`}
          value={formData.expression}
          onChange={handleChange}
        />
        {errors.expression && <div className="invalid-feedback">{errors.expression}</div>}
      </div>
 
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Threshold <span className="text-danger">*</span></label>
          <input
            type="number"
            name="threshold"
            className={`form-control bg-dark text-white ${errors.threshold ? "is-invalid" : "border-secondary"}`}
            value={formData.threshold}
            onChange={handleChange}
          />
          {errors.threshold && <div className="invalid-feedback text-danger small">{errors.threshold}</div>}
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Version <span className="text-danger">*</span></label>
          <input
            type="text"
            name="version"
            className={`form-control bg-dark text-white ${errors.version ? "is-invalid" : "border-secondary"}`}
            value={formData.version}
            onChange={handleChange}
          />
          {errors.version && <div className="invalid-feedback">{errors.version}</div>}
        </div>
      </div>
 
      <div className="mb-3">
        <label className="form-label">Customer Type <span className="text-danger">*</span></label>
        <input
          type="text"
          name="customerType"
          className={`form-control bg-dark text-white ${errors.customerType ? "is-invalid" : "border-secondary"}`}
          value={formData.customerType}
          onChange={handleChange}
        />
        {errors.customerType && <div className="invalid-feedback">{errors.customerType}</div>}
      </div>
 
      <div className="mb-4">
        <label className="form-label">Rule Status</label>
        <select
          name="ruleStatus"
          className="form-select bg-dark text-white border-secondary"
          value={formData.ruleStatus}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
 
      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-success fw-bold"
          disabled={isFormInvalid}
        >
          {isFormInvalid ? "Please fill all required fields" : "Update Rule"}
        </button>
      </div>
    </form>
  );
}