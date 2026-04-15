import { useState, useEffect } from "react";
import { updateScenario } from "../../services/Rule/scenarioService";
import Swal from "sweetalert2";

export default function ScenarioEditForm({ scenario, onScenarioUpdated }) {
  const [formData, setFormData] = useState({ ...scenario });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (scenario) {
      setFormData({ ...scenario });
    }
  }, [scenario]);

  const validateField = (name, value) => {
    let error = "";
    if (name === "description") {
      if (!value?.trim()) error = "Description is required.";
      else if (value.length > 250) error = "Description must be less than 250 characters.";
    }
    if (name === "riskDomain") {
      if (!value?.trim()) error = "Risk Domain is required.";
      else if (value.length > 50) error = "Risk Domain must be less than 50 characters.";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const isFormInvalid = 
    !formData.description?.trim() || 
    !formData.riskDomain?.trim() || 
    Object.values(errors).some(err => err !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateScenario(formData.scenarioId, formData);

      Swal.fire({
        title: "Scenario Updated",
        text: `Scenario "${formData.name}" has been updated successfully!`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#198754",
        background: "#1e1e1e",
        color: "#fff",
        width: "350px",
      });

      onScenarioUpdated();
    } catch (error) {
      console.error("Error updating scenario:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update scenario.",
        icon: "error",
        confirmButtonText: "OK",
        background: "#1e1e1e",
        color: "#fff",
        width: "350px",
      });
    }
  };

  // CORRECTED: Highly subtle blur/opacity style
  const subtleDisabledStyle = {
    filter: "blur(0.4px)", // Reduced blur significantly
    opacity: 0.75, // Increased opacity to keep it legible
    cursor: "not-allowed",
    backgroundColor: "rgba(255, 255, 255, 0.05)"
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name - Subtly Non-Editable */}
      <div className="mb-3">
        <label className="form-label opacity-75 small">Name (Read-only)</label>
        <input
          type="text"
          name="name"
          className="form-control border-secondary text-white"
          value={formData.name || ""}
          disabled
          style={subtleDisabledStyle}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description <span className="text-danger">*</span></label>
        <textarea
          name="description"
          className={`form-control bg-dark text-white ${errors.description ? "is-invalid" : "border-secondary"}`}
          value={formData.description || ""}
          onChange={handleChange}
        />
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Risk Domain <span className="text-danger">*</span></label>
        <input
          type="text"
          name="riskDomain"
          className={`form-control bg-dark text-white ${errors.riskDomain ? "is-invalid" : "border-secondary"}`}
          value={formData.riskDomain || ""}
          onChange={handleChange}
        />
        {errors.riskDomain && <div className="invalid-feedback">{errors.riskDomain}</div>}
      </div>

      <div className="mb-4">
        <label className="form-label">Status</label>
        <select
          name="status"
          className="form-select bg-dark text-white border-secondary"
          value={formData.status || ""}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <button 
        type="submit" 
        className="btn btn-success w-100" 
        disabled={isFormInvalid}
      >
        {isFormInvalid ? "Please fill required fields" : "Update Scenario"}
      </button>
    </form>
  );
}