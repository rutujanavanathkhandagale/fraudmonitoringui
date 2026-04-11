import React, { useState, useEffect } from "react";
import { saveKYCProfile } from "../../services/Customer/api";
import "../../style/Customer/kycForm.css";

function KYCFormPage({ onSuccess }) {
  const [form, setForm] = useState({
    customerId: localStorage.getItem("customerId") || "", // Auto-pull ID from storage
    aadhaarFile: null,
    voterFile: null,
    status: "Pending"
  });

  const [previews, setPreviews] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // Sync ID if localStorage updates
  useEffect(() => {
    const savedId = localStorage.getItem("customerId");
    if (savedId) {
      setForm((prev) => ({ ...prev, customerId: savedId }));
    }
  }, []);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setForm({ ...form, [name]: file });
      setPreviews({ ...previews, [name]: URL.createObjectURL(file) });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!form.customerId) {
      newErrors.customerId = "Customer ID is missing. Please complete personal details.";
    }
    if (!form.aadhaarFile) {
      newErrors.aadhaarFile = "Aadhaar document is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setMessage("❌ Please fix validation errors.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("customerId", form.customerId);
      formData.append("status", form.status);

      // Add Aadhaar
      formData.append("documents", form.aadhaarFile);
      formData.append("requiredDocs", "AADHAAR");

      // Add Voter (Optional)
      if (form.voterFile) {
        formData.append("documents", form.voterFile);
        formData.append("requiredDocs", "VOTER");
      }

      const response = await saveKYCProfile(formData);

      if (response.status === 200 || response.status === 201) {
        setMessage(`✅ KYC details saved for ID: ${form.customerId}`);
        if (typeof onSuccess === "function") onSuccess(form.customerId);
      }
    } catch (error) {
      setMessage("❌ Failed to save KYC details.");
    }
  };

  return (
    <div className="kyc-form-container">
      <h2 className="kyc-form-title">KYC Details</h2>
      <form onSubmit={handleSubmit} className="kyc-form" noValidate>

        {/* Customer ID Row - Automatic */}
        <div className="form-group">
          <label className="form-label">Customer ID</label>
          <input
            name="customerId"
            value={form.customerId}
            readOnly
            className="form-control"
            style={{ backgroundColor: "#f4f4f4", cursor: "not-allowed" }}
          />
          {errors.customerId && <span className="error-text">{errors.customerId}</span>}
        </div>

        {/* Aadhaar Upload */}
        <div className="form-group">
          <label className="form-label">Upload Aadhaar (Required)</label>
          <input
            type="file"
            name="aadhaarFile"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="form-control"
          />
          {previews.aadhaarFile && (
            <img src={previews.aadhaarFile} alt="Preview" className="preview-img" style={{ marginTop: "10px", maxHeight: "150px" }} />
          )}
          {errors.aadhaarFile && <span className="error-text">{errors.aadhaarFile}</span>}
        </div>

        {/* Voter ID Upload */}
        <div className="form-group">
          <label className="form-label">Upload Voter ID (Optional)</label>
          <input
            type="file"
            name="voterFile"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="form-control"
          />
          {previews.voterFile && (
            <img src={previews.voterFile} alt="Preview" className="preview-img" style={{ marginTop: "10px", maxHeight: "150px" }} />
          )}
        </div>

        {/* Status Row */}
        <div className="form-group">
          <label className="form-label">KYC Status</label>
          <input
            type="text"
            value={form.status}
            readOnly
            className="form-control"
            style={{ backgroundColor: "#f4f4f4" }}
          />
        </div>

        <button type="submit" className="btn-submit">Submit KYC Details</button>
      </form>

      {message && (
        <div className={`form-message ${message.includes('✅') ? 'success' : 'error'}`} style={{ textAlign: "center", marginTop: "15px" }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default KYCFormPage;