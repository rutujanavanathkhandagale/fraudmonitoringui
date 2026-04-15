import { useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

import { createDetectionRule } from "../../services/Rule/detectionRuleService";
import { getAllScenarios } from "../../services/Rule/scenarioService";
export default function DetectionRuleCreateForm({ onRuleCreated }) {
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [expression, setExpression] = useState("");
  const [threshold, setThreshold] = useState("");
  const [version, setVersion] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [status, setStatus] = useState("Active");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const data = await getAllScenarios();
        setScenarios(
          data.map((s) => ({
            value: s.scenarioId,
            label: s.name,
          }))
        );
      } catch (err) {
        console.error("Error fetching scenarios:", err);
      }
    };
    fetchScenarios();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!selectedScenario) newErrors.scenario = "Scenario is required.";
    if (!expression.trim()) newErrors.expression = "Expression is required.";
    if (!threshold || isNaN(threshold) || Number(threshold) <= 0) {
      newErrors.threshold = "Threshold must be a number greater than 0.";
    }
    if (!version.trim()) newErrors.version = "Version is required.";
    if (!customerType.trim()) newErrors.customerType = "Customer Type is required.";
    if (!status) newErrors.status = "Status is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createDetectionRule({
        scenarioId: selectedScenario.value,
        expression,
        threshold: Number(threshold),
        version,
        customerType,
        status,
      });

      Swal.fire({
        title: "Rule Created",
        text: `Detection rule "${expression}" has been created successfully!`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#198754",
        background: "#1e1e1e",
        color: "#fff",
        width: "350px",
      });

      if (onRuleCreated) onRuleCreated();

      // Reset form
      setSelectedScenario(null);
      setExpression("");
      setThreshold("");
      setVersion("");
      setCustomerType("");
      setStatus("Active");
      setErrors({});
    } catch (error) {
      console.error("Error creating detection rule:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to create detection rule.",
        icon: "error",
        confirmButtonText: "OK",
        background: "#1e1e1e",
        color: "#fff",
        width: "350px",
      });
    }
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#1e1e1e",
      color: "#fff",
      borderColor: "#444",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    input: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#aaa",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#333" : "#1e1e1e",
      color: "#fff",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1e1e1e",
    }),
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Scenario</label>
        <Select
          options={scenarios}
          value={selectedScenario}
          onChange={setSelectedScenario}
          placeholder="Search scenario by name..."
          styles={customSelectStyles}
        />
        {errors.scenario && <div className="text-danger">{errors.scenario}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Expression</label>
        <input
          type="text"
          className={`form-control ${errors.expression ? "is-invalid" : ""}`}
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          required
        />
        {errors.expression && <div className="invalid-feedback">{errors.expression}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Threshold</label>
        <input
          type="number"
          className={`form-control ${errors.threshold ? "is-invalid" : ""}`}
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          required
          min="1" // ensures threshold can't be 0 in UI
        />
        {errors.threshold && <div className="invalid-feedback">{errors.threshold}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Version</label>
        <input
          type="text"
          className={`form-control ${errors.version ? "is-invalid" : ""}`}
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          required
        />
        {errors.version && <div className="invalid-feedback">{errors.version}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Customer Type</label>
        <input
          type="text"
          className={`form-control ${errors.customerType ? "is-invalid" : ""}`}
          value={customerType}
          onChange={(e) => setCustomerType(e.target.value)}
          required
        />
        {errors.customerType && <div className="invalid-feedback">{errors.customerType}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Rule Status</label>
        <select
          className={`form-select ${errors.status ? "is-invalid" : ""}`}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        {errors.status && <div className="invalid-feedback">{errors.status}</div>}
      </div>

      <button type="submit" className="btn btn-success">Save Rule</button>
    </form>
  );
}
