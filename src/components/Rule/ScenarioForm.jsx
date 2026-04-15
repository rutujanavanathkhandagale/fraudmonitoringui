import { useState } from "react";
import Swal from "sweetalert2";
import { createScenario } from "../../services/Rule/scenarioService";

export default function ScenarioForm({ onScenarioCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    riskDomain: "",
    status: "Active",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.length > 250) {
      newErrors.description = "Description must be less than 250 characters.";
    }

    if (!formData.riskDomain.trim()) {
      newErrors.riskDomain = "Risk Domain is required.";
    } else if (formData.riskDomain.length > 50) {
      newErrors.riskDomain = "Risk Domain must be less than 50 characters.";
    }

    if (!formData.status) {
      newErrors.status = "Status is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createScenario(formData);

      Swal.fire({
        title: "Scenario Created",
        text: `Scenario "${formData.name}" has been added successfully!`,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#198754",
        cancelButtonColor: "#333",
        background: "#1e1e1e",
        color: "#fff",
        width: "350px",
        customClass: {
          popup: "rounded-4 shadow-lg border-0",
          title: "fw-bold text-success",
          htmlContainer: "text-light"
        }
      });

      setFormData({ name: "", description: "", riskDomain: "", status: "Active" });
      setErrors({});
      onScenarioCreated();
    } catch (error) {
      console.error("Error creating scenario:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to create scenario.",
        icon: "error",
        confirmButtonText: "OK",
        background: "#1e1e1e",
        color: "#fff",
        width: "350px",
        customClass: {
          popup: "rounded-4 shadow-lg border-0",
          title: "fw-bold text-danger",
          htmlContainer: "text-light"
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          name="name"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className={`form-control ${errors.description ? "is-invalid" : ""}`}
          value={formData.description}
          onChange={handleChange}
          required
        />
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Risk Domain</label>
        <input
          type="text"
          name="riskDomain"
          className={`form-control ${errors.riskDomain ? "is-invalid" : ""}`}
          value={formData.riskDomain}
          onChange={handleChange}
          required
        />
        {errors.riskDomain && <div className="invalid-feedback">{errors.riskDomain}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Status</label>
        <select
          name="status"
          className={`form-select ${errors.status ? "is-invalid" : ""}`}
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        {errors.status && <div className="invalid-feedback">{errors.status}</div>}
      </div>

      <button type="submit" className="btn btn-success">Create Scenario</button>
    </form>
  );
}
