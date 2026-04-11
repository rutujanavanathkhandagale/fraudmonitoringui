import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
 
// Update the port if your backend is running on a different one [cite: 5]
const API_BASE = "https://localhost:7181/api/Registration";
 
export function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
    role: "Customer", // Default value matching User Entity [cite: 46]
  });
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
 
    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      setLoading(false);
      return;
    }
 
    try {
      // The payload must match the backend 'dto' structure seen in your code logs
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
 
      const data = await res.json().catch(() => ({}));
 
      if (res.ok) {
        setMessage({ type: "success", text: "Registration Successful! Redirecting..." });
        // Successful registration should also trigger an AuditLog entry [cite: 49-55]
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage({ type: "error", text: data.message || "Registration failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Backend Connection Error" });
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.card}
      >
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join Fraud Shield AML</p>
 
        {message.text && (
          <div style={{
            ...styles.alert,
            backgroundColor: message.type === "success" ? "#e6fffa" : "#fff5f5",
            color: message.type === "success" ? "#2c7a7b" : "#c53030"
          }}>
            {message.text}
          </div>
        )}
 
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.row}>
            <input style={styles.input} name="firstName" placeholder="First Name" onChange={handleChange} required />
            <input style={styles.input} name="lastName" placeholder="Last Name" onChange={handleChange} required />
          </div>
 
          <input style={styles.input} type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          <input style={styles.input} type="text" name="phoneNo" placeholder="Phone Number" onChange={handleChange} required />
         
          <select style={styles.input} name="role" value={formData.role} onChange={handleChange}>
            <option value="Customer">Customer</option>
            <option value="Admin">Admin</option>
            <option value="Investigator">Fraud Investigator</option>
            <option value="Modeler">Rule Author</option>
            <option value="Analyst">Transaction Monitoring Analyst</option>
            {/* REMOVED THE SPACE IN THE VALUE TO FIX THE BACKEND ENUM ERROR */}
            <option value="Compliance">Compliance Officer</option>
          </select>
 
          <input style={styles.input} type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input style={styles.input} type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
 
          <button disabled={loading} style={styles.button}>
            {loading ? "Creating Account..." : "Register"}
          </button>
 
          <p style={styles.footerText}>
            Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
 
const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f4f7f6", padding: "20px" },
  card: { background: "white", padding: "40px", borderRadius: "12px", width: "100%", maxWidth: "450px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", color: "#2d3748", fontWeight: "bold", margin: "0 0 5px 0" },
  subtitle: { textAlign: "center", color: "#718096", marginBottom: "25px", fontSize: "14px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  row: { display: "flex", gap: "10px" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e0", width: "100%", boxSizing: "border-box", fontSize: "14px" },
  button: { padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#2b6cb0", color: "white", fontWeight: "bold", cursor: "pointer", marginTop: "10px" },
  link: { color: "#3182ce", textDecoration: "none", fontWeight: "500" },
  footerText: { textAlign: "center", fontSize: "13px", color: "#718096", marginTop: "15px" },
  alert: { padding: "10px", borderRadius: "6px", marginBottom: "15px", fontSize: "13px", textAlign: "center" }
};
 
export default RegisterPage;