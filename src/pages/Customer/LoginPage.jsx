import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
      console.log("Login response:", data);

      if (res.ok) {
        setMessage({ type: "success", text: successMsg });

        if (endpoint === "login") {
          localStorage.setItem("token", data.token);

          const decoded = jwtDecode(data.token);
          const rawRole =
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            decoded.role ||
            "";

          const role = rawRole.toUpperCase(); 
          const userId = decoded["RegistrationId"];
          const customerId = decoded.CustomerId;
          const firstName = decoded.FirstName;
          const lastName = decoded.LastName;

          if (firstName) localStorage.setItem("firstName", firstName);
          if (lastName) localStorage.setItem("lastName", lastName);

          localStorage.setItem("role", role);
          localStorage.setItem("userId", userId);
          if (customerId) localStorage.setItem("customerId", customerId);
          
          Swal.fire({
            title: "Login Successful!",
            text: "Redirecting...",
            icon: "success",
            background: "#2e003e",          // dark purple background
            color: "#ffffff",               // white text
            confirmButtonColor: "#ffb3d9",  // pink accent button
            timer: 2000,
            showConfirmButton: false
          });

          setTimeout(() => {
            switch (role) {
              case "ADMIN":
                navigate("/role");
                break;
              case "INVESTIGATOR":
                navigate("/Idashboard");
                break;
              case "COMPLIANCE":
                navigate("/Cdashboard");
                break;
              case "ANALYST":
                navigate("/alert/dashboard");
                break;
              case "MODELER":
                navigate("/scenarios");
                break;
              case "CUSTOMER":
                if (customerId) navigate(`/customer/dashboard/${customerId}`);
                else navigate("/fill-details");
                break;
              default:
                console.warn("Unknown role:", role);
                navigate("/unauthorized");
            }
          }, 1000);
        } else if (endpoint === "reset-password") {
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
    <>
      {/* CSS for the animated background gradient */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <div style={styles.container}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={styles.card}>
          <h2 style={styles.title}>Fraud Shield AML</h2>
          <p style={styles.subtitle}>Secure Access Control</p>

          {message.text && (
            <div
              style={{
                ...styles.alert,
                backgroundColor: message.type === "success" ? "rgba(44, 122, 123, 0.2)" : "rgba(197, 48, 48, 0.2)",
                color: message.type === "success" ? "#81e6d9" : "#feb2b2",
                border: message.type === "success" ? "1px solid rgba(129, 230, 217, 0.3)" : "1px solid rgba(254, 178, 178, 0.3)"
              }}
            >
              {message.text}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: LOGIN */}
            {step === "login" && (
              <motion.form
                key="login"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 10, opacity: 0 }}
                onSubmit={(e) =>
                  handleAction(e, "login", {
                    email: formData.email,
                    password: formData.password,
                  })
                }
                style={styles.form}
              >
                <input
                  style={styles.input}
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  style={styles.input}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button disabled={loading} style={styles.button}>
                  {loading ? "Verifying..." : "Login"}
                </button>
                
                <div style={styles.footer}>
                  <span onClick={() => setStep("forgot")} style={styles.link}>
                    Forgot Password?
                  </span>
                  <Link to="/register" style={styles.link}>
                    Register
                  </Link>
                </div>
              </motion.form>
            )}

            {/* Other steps (forgot, otp, reset) can go here following the same input/button structure */}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}

const styles = {
  container: { 
    minHeight: "100vh", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    padding: "20px",
    // Premium Animated Gradient
    background: "linear-gradient(-45deg, #0f172a, #3b0764, #1e1b4b, #000000)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 15s ease infinite",
  },
  card: { 
    background: "rgba(255, 255, 255, 0.03)", 
    backdropFilter: "blur(15px)",
    padding: "50px 40px", 
    borderRadius: "24px", 
    width: "100%", 
    maxWidth: "420px", // Wider box to prevent email text cutoff
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  title: { 
    textAlign: "center", 
    color: "#ffffff", 
    fontWeight: "800", 
    fontSize: "32px",
    letterSpacing: "0.5px",
    margin: "0 0 5px 0"
  },
  subtitle: { 
    textAlign: "center", 
    color: "#a0aec0", 
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "30px" 
  },
  form: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "20px" 
  },
  input: { 
    padding: "16px", 
    borderRadius: "12px", 
    border: "1px solid rgba(255, 255, 255, 0.1)", 
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    color: "white",
    width: "100%", 
    boxSizing: "border-box",
    outline: "none",
    fontSize: "15px",
    transition: "border 0.3s ease"
  },
  button: { 
    padding: "16px", 
    borderRadius: "12px", 
    border: "none", 
    backgroundColor: "#7c3aed", 
    color: "white", 
    fontWeight: "bold", 
    fontSize: "16px",
    cursor: "pointer",
    transition: "transform 0.2s ease, background-color 0.2s ease",
    boxShadow: "0 4px 14px 0 rgba(124, 58, 237, 0.3)",
    marginTop: "10px"
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  link: { 
    color: "#c4b5fd", 
    cursor: "pointer", 
    fontSize: "14px", 
    textDecoration: "none",
    fontWeight: "500"
  },
  alert: { 
    padding: "12px", 
    borderRadius: "8px", 
    marginBottom: "20px", 
    fontSize: "14px", 
    textAlign: "center" 
  }
};