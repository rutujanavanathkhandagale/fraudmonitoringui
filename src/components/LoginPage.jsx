import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "https://localhost:44372/api/Auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("login"); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "", 
    newPassword: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAction = async (e, endpoint, payload, nextStep, successMsg) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage({ type: "success", text: successMsg });
        
        if (endpoint === "login") {
          localStorage.setItem("token", data.token);
          navigate("/");
        } else if (endpoint === "reset-password") {
          // Clear sensitive data and move to login after a short delay
          setFormData({ email: "", password: "", otp: "", newPassword: "" });
          setTimeout(() => setStep("login"), 2000);
        } else if (nextStep) {
          setStep(nextStep);
        }
      } else {
        setMessage({ type: "error", text: data.message || "Operation failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Check if Backend is running" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.card}>
        <h2 style={styles.title}>Fraud Shield AML</h2>
        <p style={styles.subtitle}>Secure Access Control</p>

        {message.text && (
          <div style={{ 
            ...styles.alert, 
            backgroundColor: message.type === "success" ? "#e6fffa" : "#fff5f5", 
            color: message.type === "success" ? "#2c7a7b" : "#c53030" 
          }}>
            {message.text}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: LOGIN */}
          {step === "login" && (
            <motion.form key="login" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 10, opacity: 0 }} 
              onSubmit={(e) => handleAction(e, "login", { email: formData.email, password: formData.password })} style={styles.form}>
              <input style={styles.input} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input style={styles.input} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <button disabled={loading} style={styles.button}>{loading ? "Verifying..." : "Login"}</button>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <span onClick={() => setStep("forgot")} style={styles.link}>Forgot Password?</span>
                <Link to="/register" style={styles.link}>Register</Link>
              </div>
            </motion.form>
          )}

          {/* STEP 2: FORGOT PASSWORD */}
          {step === "forgot" && (
            <motion.form key="forgot" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }}
              onSubmit={(e) => handleAction(e, "forgot-password", { email: formData.email }, "otp", "OTP sent to email!")} style={styles.form}>
              <input style={styles.input} type="email" name="email" placeholder="Enter registered email" value={formData.email} onChange={handleChange} required />
              <button disabled={loading} style={styles.button}>{loading ? "Sending..." : "Send OTP"}</button>
              <span onClick={() => setStep("login")} style={styles.backLink}>← Back to Login</span>
            </motion.form>
          )}

          {/* STEP 3: OTP VERIFICATION */}
          {step === "otp" && (
            <motion.form key="otp" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }}
              onSubmit={(e) => handleAction(e, "verify-email", { email: formData.email, otp: formData.otp }, "reset", "OTP Verified!")} style={styles.form}>
              <input style={styles.input} type="text" name="otp" placeholder="Enter 6-digit OTP" value={formData.otp} onChange={handleChange} required />
              <button disabled={loading} style={styles.button}>Verify OTP</button>
              <span onClick={() => setStep("login")} style={styles.backLink}>← Back to Login</span>
            </motion.form>
          )}

          {/* STEP 4: RESET PASSWORD */}
          {step === "reset" && (
            <motion.form key="reset" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }}
              onSubmit={(e) => handleAction(e, "reset-password", { 
                email: formData.email, 
                token: formData.otp, 
                newPassword: formData.newPassword 
              }, "login", "Password reset successfully!")} 
              style={styles.form}>
              <input 
                style={styles.input} 
                type="password" 
                name="newPassword" 
                placeholder="Enter New Password" 
                value={formData.newPassword}
                onChange={handleChange} 
                required 
              />
              <button disabled={loading} style={styles.button}>{loading ? "Updating..." : "Update Password"}</button>
              <span onClick={() => setStep("login")} style={styles.backLink}>← Back to Login</span>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f4f7f6" },
  card: { background: "white", padding: "40px", borderRadius: "12px", width: "350px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", color: "#2d3748", fontWeight: "bold" },
  subtitle: { textAlign: "center", color: "#718096", marginBottom: "20px", fontSize: "14px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e0", width: "100%", boxSizing: "border-box" },
  button: { padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#2b6cb0", color: "white", fontWeight: "bold", cursor: "pointer" },
  link: { color: "#3182ce", cursor: "pointer", fontSize: "13px", textDecoration: "none" },
  backLink: { color: "#718096", cursor: "pointer", fontSize: "13px", textAlign: "center", marginTop: "10px", display: "block" },
  alert: { padding: "10px", borderRadius: "6px", marginBottom: "15px", fontSize: "13px", textAlign: "center" }
};