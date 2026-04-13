import React from 'react';
import { useNavigate } from 'react-router-dom';
 
const LogoutButton = () => {
  const navigate = useNavigate();
 
  const handleLogout = async () => {
    try {
      // Optional: Notify backend about the logout
      await fetch("https://localhost:44372/api/Auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      // Always clear local storage and redirect regardless of API success
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
 
  return (
<button onClick={handleLogout} style={styles.logoutBtn}>
<span style={{ marginRight: '8px' }}>➔</span> Logout
</button>
  );
};
 
const styles = {
  container: { 
    height: "100vh", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#1a0b2e", // Deep purple background
    backgroundImage: "radial-gradient(circle at top right, #2d1b4d, #1a0b2e)" 
  },
    logoutBtn: {
    background: "transparent",
    border: "none",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    padding: "10px",
    width: "100%",
    transition: "0.3s",
    borderRadius: "8px",
    // Hover effect can be handled via CSS-in-JS or external CSS
  },
  card: { 
    background: "rgba(255, 255, 255, 0.05)", // Glassmorphism
    backdropFilter: "blur(10px)",
    padding: "40px", 
    borderRadius: "16px", 
    width: "380px", 
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  title: { 
    textAlign: "center", 
    color: "#ffffff", 
    fontWeight: "bold", 
    fontSize: "24px",
    letterSpacing: "1px" 
  },
  subtitle: { 
    textAlign: "center", 
    color: "#a0aec0", 
    marginBottom: "30px", 
    fontSize: "14px",
    textTransform: "uppercase" 
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  input: { 
    padding: "14px", 
    borderRadius: "10px", 
    border: "1px solid rgba(255, 255, 255, 0.2)", 
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    color: "white",
    width: "100%", 
    boxSizing: "border-box",
    outline: "none"
  },
  button: { 
    padding: "14px", 
    borderRadius: "10px", 
    border: "none", 
    backgroundColor: "#6b46c1", // Vibrant purple
    color: "white", 
    fontWeight: "bold", 
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 4px 14px 0 rgba(107, 70, 193, 0.4)"
  },
  link: { 
    color: "#b794f4", 
    cursor: "pointer", 
    fontSize: "13px", 
    textDecoration: "none" 
  },
  backLink: { 
    color: "#a0aec0", 
    cursor: "pointer", 
    fontSize: "13px", 
    textAlign: "center", 
    marginTop: "15px", 
    display: "block" 
  },
  alert: { 
    padding: "12px", 
    borderRadius: "8px", 
    marginBottom: "20px", 
    fontSize: "13px", 
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)" 
  }
};
 
export default LogoutButton;