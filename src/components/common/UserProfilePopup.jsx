import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiUser, FiX } from "react-icons/fi";
import "../../style/UserProfilePopup.css";
 
const UserProfilePopup = ({ user, onClose }) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    registrationId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    role: ""
  });
 
  useEffect(() => {
    setFormData({
      registrationId: user?.registrationId || localStorage.getItem("userId") || "",
      firstName: user?.firstName || localStorage.getItem("firstName") || "",
      lastName: user?.lastName || localStorage.getItem("lastName") || "",
      email: user?.email || localStorage.getItem("email") || "",
      phoneNo: user?.phoneNo || localStorage.getItem("phoneNo") || "",
      role: user?.role || localStorage.getItem("role") || "Customer"
    });
  }, [user]);
 
  const handleLogout = () => {
    localStorage.clear();
    onClose();
    navigate("/");
    window.location.reload();
  };
 
  return (
    <div className="profile-popup-card">
      <button className="close-popup-btn" onClick={onClose}><FiX /></button>
 
      {!showForm ? (
        <>
          <div className="popup-user-info">
            <div className="popup-large-avatar">
              {(formData.firstName.charAt(0) || "U").toUpperCase()}
            </div>
            <h3>Hi, {formData.firstName}</h3>
            <p className="popup-role">{formData.role}</p>
          </div>
 
          <div className="popup-menu-list">
            <button onClick={() => setShowForm(true)}>
              <FiUser /> My profile
            </button>
            <button className="logout-item" onClick={handleLogout}>
              <FiLogOut /> Log out
            </button>
          </div>
 
          <div className="popup-links">
            <span>Privacy policy</span> • <span>Terms of service</span>
          </div>
        </>
      ) : (
        <div className="popup-form">
          <h3>Profile Details</h3>
          <form>
         
            <label>First Name</label>
            <input name="firstName" value={formData.firstName} readOnly />
 
            <label>Last Name</label>
            <input name="lastName" value={formData.lastName} readOnly />
 
            <label>Email</label>
            <input name="email" value={formData.email} readOnly />
 
            <label>Phone No</label>
            <input name="phoneNo" value={formData.phoneNo} readOnly />
 
            <label>Role</label>
            <input name="role" value={formData.role} readOnly />
 
            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)}>Close</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
 
export default UserProfilePopup;
 
 