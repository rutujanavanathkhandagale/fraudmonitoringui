import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiX } from "react-icons/fi";
import Swal from "sweetalert2";
import "../../style/UserProfilePopup.css";

export default function UserProfilePopup({ user, onClose }) {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.clear();

    Swal.fire({
      title: "Logout Successful!",
      text: "Redirecting to login...",
      icon: "success",
      background: "#2e003e",
      color: "#ffffff",
      confirmButtonColor: "#ffb3d9",
      timer: 2000,
      showConfirmButton: false
    });

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2000);
  };

  return (
    <>
      <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>

        <div className="avatar">
          {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
        </div>

        {/* ✅ Use firstName + lastName from Registration table */}
<h4>Hi, {user?.firstName} {user?.lastName}</h4>
        <p>{user?.role || "Profile"}</p>

        <div className="popup-actions">
          <button
            className="action-btn"
            onClick={() => {
              onClose();
              navigate(`/profile/${user?.registrationId || ""}`);
            }}
          >
            <FiUser size={16} />
            <span>My profile</span>
          </button>

          <button
            className="action-btn"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <FiLogOut size={16} />
            <span>Log out</span>
          </button>
        </div>

        <div className="popup-footer">
          <span>Privacy policy</span>
          <span>·</span>
          <span>Terms of service</span>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <h4>Confirm Log Out</h4>
            <p>Are you sure you want to log out?</p>

            <div className="logout-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>

              <button className="confirm-btn" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
