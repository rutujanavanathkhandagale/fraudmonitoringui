import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../style/Customer/personalForm.css";

function PersonalForm() {
  const navigate = useNavigate();

  // 1. Initial State
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    customerType: "",
    email: "",
    phone: "",
    dob: "",
    permanentAddress: "",
    currentAddress: ""
  });

  const [isEditing, setIsEditing] = useState(true);
  const [message, setMessage] = useState("");
  const [customerId, setCustomerId] = useState(localStorage.getItem("customerId") || null);

  // 2. Fetch data if ID exists
  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (customerId && customerId !== "null") {
        try {
          const response = await axios.get(`https://localhost:44372/api/PersonalDetails/${customerId}`);
          if (response.data) {
            const d = response.data;
            setForm({
              firstName: d.firstName || "",
              middleName: d.middleName || "",
              lastName: d.lastName || "",
              fatherName: d.fatherName || "",
              motherName: d.motherName || "",
              customerType: d.customerType || "",
              email: d.email || "",
              phone: d.phone || "",
              dob: d.dob ? d.dob.split('T')[0] : "", 
              permanentAddress: d.permanentAddress || "",
              currentAddress: d.currentAddress || ""
            });
            setIsEditing(false); // Lock the form initially if data exists
          }
        } catch (error) {
          console.log("New user - no existing record found.");
        }
      }
    };
    fetchExistingProfile();
  }, [customerId]);

  // 3. Handle Input
  const handleChange = (e) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 4. Save/Update Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      CustomerId: customerId ? parseInt(customerId) : 0,
      ...form,
      ProfileImagePath: "" 
    };

    try {
      const url = "https://localhost:44372/api/PersonalDetails";
      let response;

      if (customerId) {
        response = await axios.put(`${url}/${customerId}`, payload);
      } else {
        response = await axios.post(url, payload);
      }

      if (response.status === 200 || response.status === 201) {
        const newCid = response.data.customerId || customerId;
        localStorage.setItem("customerId", newCid);
        setCustomerId(newCid);
        setIsEditing(false);
        setMessage(`✅ Details saved successfully.`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("❌ Failed to save. Please check your connection.");
    }
  };

  return (
    <div className="personal-form-container">
      
      {/* PROPER HEADER SECTION WITH INLINE CSS */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "30px",
        padding: "20px",
        backgroundColor: "#f8fafc",
        borderRadius: "12px",
        borderLeft: "6px solid #8e2de2",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
      }}>
        <div className="header-left">
          {customerId ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", letterSpacing: "1.5px" }}>
                CUSTOMER ID
              </span>
              <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1e293b" }}>
                #{customerId}
              </span>
            </div>
          ) : (
            <h2 style={{ margin: 0, color: "#1e293b", fontWeight: "700" }}>Personal Details Form</h2>
          )}
        </div>
        
        <div className="header-right">
          {customerId && (
            <button 
              type="button" 
              onClick={() => setIsEditing(!isEditing)}
              style={{
                padding: "10px 24px",
                backgroundColor: isEditing ? "#fee2e2" : "#ffffff",
                color: isEditing ? "#ef4444" : "#8e2de2",
                border: isEditing ? "1px solid #fca5a5" : "2px solid #8e2de2",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                fontSize: "13px"
              }}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="personal-details-form">
        
        {/* ROW 1 */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input 
              name="firstName" 
              value={form.firstName} 
              onChange={handleChange} 
              readOnly={!isEditing}
              className={`form-control ${!isEditing ? "readonly-input" : ""}`} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Middle Name</label>
            <input 
              name="middleName" 
              value={form.middleName} 
              onChange={handleChange} 
              readOnly={!isEditing}
              className={`form-control ${!isEditing ? "readonly-input" : ""}`} 
            />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input 
              name="lastName" 
              value={form.lastName} 
              onChange={handleChange} 
              readOnly={!isEditing}
              className={`form-control ${!isEditing ? "readonly-input" : ""}`} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Father Name</label>
            <input 
              name="fatherName" 
              value={form.fatherName} 
              onChange={handleChange} 
              readOnly={!isEditing}
              className={`form-control ${!isEditing ? "readonly-input" : ""}`} 
            />
          </div>
        </div>

        {/* ROW 3 */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Mother Name</label>
            <input 
              name="motherName" 
              value={form.motherName} 
              onChange={handleChange} 
              readOnly={!isEditing}
              className={`form-control ${!isEditing ? "readonly-input" : ""}`} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Customer Type</label>
            <select 
              name="customerType" 
              value={form.customerType} 
              onChange={handleChange} 
              disabled={!isEditing}
              className={`form-control ${!isEditing ? "readonly-input" : ""}`}
            >
              <option value="">Select Type</option>
              <option value="Business">Business</option>
              <option value="Student">Student</option>
              <option value="Retail">Retail</option>
            </select>
          </div>
        </div>

        {/* ROW 4 */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              readOnly={!isEditing}
              className={`form-control ${!isEditing ? "readonly-input" : ""}`} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input 
              name="phone" 
              value={form.phone} 
              onChange={handleChange} 
              readOnly={!isEditing}
              className={`form-control ${!isEditing ? "readonly-input" : ""}`} 
            />
          </div>
        </div>

        {/* ROW 5 */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input 
              type="date" 
              name="dob" 
              value={form.dob} 
              onChange={handleChange} 
              readOnly={!isEditing}
              className={`form-control ${!isEditing ? "readonly-input" : ""}`} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select 
              name="gender" 
              value={form.gender} 
              onChange={handleChange} 
              disabled={!isEditing}
              style={{ height: "48px" }} // Proper height fix for gender dropdown
              className={`form-control ${!isEditing ? "readonly-input" : ""}`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* ROW 6 (Addresses) */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Permanent Address</label>
            <textarea 
              name="permanentAddress" 
              value={form.permanentAddress} 
              onChange={handleChange} 
              readOnly={!isEditing}
              className={`form-control ${!isEditing ? "readonly-input" : ""}`} 
              rows="3" 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Current Address</label>
            <textarea 
              name="currentAddress" 
              value={form.currentAddress} 
              onChange={handleChange} 
              readOnly={!isEditing}
              className={`form-control ${!isEditing ? "readonly-input" : ""}`} 
              rows="3" 
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        {isEditing && (
          <div className="submit-container" style={{ textAlign: "center", marginTop: "30px" }}>
            <button type="submit" className="btn-submit" style={{
              padding: "16px 60px",
              background: "linear-gradient(135deg, #8e2de2 0%, #ff0080 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(142, 45, 226, 0.3)"
            }}>
              {customerId ? "Update Personal Details" : "Submit Personal Details"}
            </button>
          </div>
        )}
      </form>

      {/* Success/Error Banner */}
      {message && (
        <div className={`message-banner ${message.includes('✅') ? 'success' : 'error'}`} style={{
           marginTop: "25px", padding: "15px", borderRadius: "8px", textAlign: "center", fontWeight: "600"
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default PersonalForm;