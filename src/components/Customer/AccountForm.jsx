import React, { useState, useEffect } from "react";
import { saveAccountDetails } from "../../services/Customer/api";
import "../../style/Customer/accountForm.css";
 
function AccountFormPage({ onSuccess }) {
  const [form, setForm] = useState({
    customerId: localStorage.getItem("customerId") || "", // Auto-pull from storage
    accountNumber: "",
    productType: "",
    currency: "",
    status: "Active"
  });
 
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
 
  // Update Customer ID if localStorage changes or component mounts
  useEffect(() => {
    const savedId = localStorage.getItem("customerId");
    if (savedId) {
      setForm((prev) => ({ ...prev, customerId: savedId }));
    }
  }, []);
 
  const validateField = (name, value) => {
    let error = "";
    if (name === "accountNumber") {
      if (!value) error = "Account Number is required";
      else if (!/^\d+$/.test(value)) error = "Digits only";
      else if (value.length < 4) error = "Too short (min 4)";
    }
    if (name === "productType" && !value) error = "Product Type is required";
    if (name === "currency" && !value) error = "Currency is required";
 
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    let isFormValid = true;
    // Validate fields before sending
    ["accountNumber", "productType", "currency"].forEach((key) => {
      if (!validateField(key, form[key])) isFormValid = false;
    });
 
    if (!isFormValid) {
      setMessage("❌ Please fix validation errors.");
      return;
    }
 
    try {
      const payload = {
        CustomerId: parseInt(form.customerId, 10),
        AccountNumber: form.accountNumber,
        ProductType: form.productType,
        Currency: form.currency,
        Status: form.status
      };
 
      const response = await saveAccountDetails(payload);
      if (response.status === 200 || response.status === 201) {
        setMessage(`✅ Account ${form.accountNumber} saved! You can add another.`);
       
        // Reset only the account-specific fields so user can add another account immediately
        setForm((prev) => ({
          ...prev,
          accountNumber: "",
          productType: "",
          currency: ""
        }));
 
        if (typeof onSuccess === "function") onSuccess(form.customerId);
      }
    } catch (error) {
      setMessage(error.response?.data?.Message || "❌ Failed to save.");
    }
  };
 
  return (
    <div className="account-form-container">
      <h2 className="account-form-title">Account Details</h2>
      <form onSubmit={handleSubmit} className="account-form" noValidate>
       
        {/* Customer ID - Automatic & Read-only */}
        <div className="form-group">
          <label className="form-label">Customer ID</label>
          <input
            name="customerId"
            value={form.customerId}
            readOnly
            className="form-control"
            style={{ backgroundColor: "#f4f4f4", cursor: "not-allowed" }}
          />
        </div>
 
        {/* Account Number */}
        <div className="form-group">
          <label className="form-label">Account Number</label>
          <input
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            className={`form-control ${errors.accountNumber ? "input-error" : ""}`}
            placeholder="Enter Account Number"
          />
          {errors.accountNumber && <span className="error-text">{errors.accountNumber}</span>}
        </div>
 
        {/* Product Type */}
        <div className="form-group">
          <label className="form-label">Product Type</label>
          <select
            name="productType"
            value={form.productType}
            onChange={handleChange}
            className={`form-control ${errors.productType ? "input-error" : ""}`}
          >
            <option value="">Select Product Type</option>
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
            <option value="Card">Card</option>
            <option value="Fixed Deposit">Fixed Deposit</option>
          </select>
          {errors.productType && <span className="error-text">{errors.productType}</span>}
        </div>
 
        {/* Currency */}
        <div className="form-group">
          <label className="form-label">Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className={`form-control ${errors.currency ? "input-error" : ""}`}
          >
            <option value="">Select Currency</option>
            <option value="USD">USD</option>
            <option value="INR">INR</option>
            <option value="EUR">EUR</option>
          </select>
          {errors.currency && <span className="error-text">{errors.currency}</span>}
        </div>
 
        <button type="submit" className="btn-submit">Add Account</button>
      </form>
 
      {message && <div className={`form-message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}
    </div>
  );
}
 
export default AccountFormPage;
 