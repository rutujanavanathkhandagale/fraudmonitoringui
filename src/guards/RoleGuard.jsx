import { Navigate } from "react-router-dom";

const RoleGuard = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "Customer" ? children : <Navigate to="/login" />;
};

export default RoleGuard;
