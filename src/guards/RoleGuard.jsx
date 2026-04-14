import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RoleGuard = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token"); // ✅ matches LoginPage
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
   const rawRole =
  decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
  decodedToken.role ||
  localStorage.getItem("role") ||
  "";

const userRole = rawRole.toUpperCase(); // ✅ normalizhasAc
   const hasAccess = allowedRoles?.includes(userRole);

    if (hasAccess) {
      return children;
    } else {
      console.warn("Access Denied. Required roles:", allowedRoles, "Found:", userRole);
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default RoleGuard;
