// src/context/AuthContext.js
import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("userEmail");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    if (token) {
      setUser({ token, role, email, userId, firstName, lastName });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.roleName);
    localStorage.setItem("userId", userData.userId);
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("firstName", userData.firstName);
    localStorage.setItem("lastName", userData.lastName);

    setUser({
      token: userData.token,
      role: userData.roleName,
      userId: userData.userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });
  };

  const logout = async () => {
    try {
      await fetch("https://localhost:7181/api/Auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      localStorage.clear();
      setUser(null);

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
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
