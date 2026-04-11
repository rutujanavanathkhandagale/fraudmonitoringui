
import React, { useState, useEffect } from "react";

function AboutPage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      icon: "⚡",
      title: "Real-Time Alerts",
      description: "Immediate notifications when suspicious activity is detected."
    },
    {
      icon: "🔒",
      title: "Enhanced Security",
      description: "Bank-level encryption keeps your data safe and confidential."
    },
    {
      icon: "📊",
      title: "Transparent Monitoring",
      description: "Clear communication about risks and fraud prevention steps."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const styles = {
    container: {
      padding: "40px",
      fontFamily: "Segoe UI, Arial, sans-serif",
      lineHeight: "1.8",
      background: "linear-gradient(135deg, #f8f7fb, #eae6f7, #d8c7f9)",
      backgroundSize: "200% 200%",
      minHeight: "100vh",
      animation: "gradientShift 15s ease infinite",
    },
    header: {
      textAlign: "center",
      marginBottom: "50px",
      animation: "fadeInDown 1s ease",
    },
    title: {
      color: "#4a2c63",
      fontSize: "2.8rem",
      fontWeight: "bold",
      marginBottom: "15px",
      letterSpacing: "1px",
      textShadow: "2px 2px 6px rgba(0,0,0,0.15)",
    },
    subtitle: {
      fontSize: "1.2rem",
      color: "#444",
      maxWidth: "800px",
      margin: "0 auto",
      opacity: 0.9,
      animation: "fadeIn 2s ease",
    },
    section: {
      marginTop: "50px",
      animation: "fadeInUp 1s ease",
    },
    sectionTitle: {
      color: "#7b3fa1",
      marginBottom: "20px",
      borderBottom: "3px solid #b10380",
      display: "inline-block",
      paddingBottom: "5px",
      fontSize: "1.5rem",
      fontWeight: "600",
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "20px",
      marginTop: "20px",
    },
    card: {
      background: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      transition: "transform 0.4s, box-shadow 0.4s",
      cursor: "pointer",
      borderLeft: "5px solid #7b3fa1",
    },
    cardHover: {
      transform: "translateY(-8px) scale(1.05)",
      boxShadow: "0 12px 28px rgba(123,63,161,0.3)",
    },
    cardActive: {
      borderLeft: "5px solid #b10380",
      boxShadow: "0 8px 20px rgba(177,3,128,0.3)",
    },
    cardTitle: {
      color: "#2e3b4e",
      marginBottom: "10px",
      fontWeight: "600",
      fontSize: "1.1rem",
    },
    cardText: {
      color: "#555",
      fontSize: "0.95rem",
    },
    circleContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "300px",
      position: "relative",
      marginTop: "30px",
    },
    circle: {
      width: "220px",
      height: "220px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #7b3fa1, #b10380)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      textAlign: "center",
      padding: "20px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
      position: "absolute",
      transition: "all 1s ease",
    },
    icon: {
      fontSize: "2rem",
      marginBottom: "10px",
    },
    description: {
      fontSize: "0.9rem",
    },
  };

  const positions = [
    { top: "20%", left: "50%", transform: "translate(-50%, -50%)" },
    { top: "70%", left: "20%", transform: "translate(-50%, -50%)" },
    { top: "70%", left: "80%", transform: "translate(-50%, -50%)" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>About FraudShield Customer Dashboard</h1>
        <p style={styles.subtitle}>
          The <strong>FraudShield Customer Dashboard</strong> is a secure platform 
          where customers can connect with us whenever they suspect fraudulent activity. 
          It allows you to fill in your details, verify your identity, and receive real-time protection.
        </p>
      </div>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Why This Page Exists</h2>
        <div style={styles.cardGrid}>
          {["✔️ Personal Details", "✔️ Account Information", "✔️ KYC Verification", "✔️ Direct Communication"].map((title, index) => (
            <div
              key={index}
              style={{
                ...styles.card,
                ...(hoveredCard === index ? styles.cardHover : {}),
                ...(activeIndex === index ? styles.cardActive : {})
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h5 style={styles.cardTitle}>{title}</h5>
              <p style={styles.cardText}>
                {index === 0 && "Collect your personal details securely to build a trusted profile."}
                {index === 1 && "Gather account details for monitoring and fraud detection."}
                {index === 2 && "Upload and verify identity documents with multi-layered security."}
                {index === 3 && "Stay connected with our fraud team through secure channels."}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Fraud Detection Process</h2>
        <div style={styles.circleContainer}>
          {features.map((feature, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                style={{
                  ...styles.circle,
                  ...positions[index],
                  opacity: isActive ? 1 : 0.3,
                  transform: isActive
                    ? `${positions[index].transform} scale(1.1)`
                    : `${positions[index].transform} scale(0.9)`,
                  zIndex: isActive ? 2 : 1,
                }}
              >
                <div style={styles.icon}>{feature.icon}</div>
                <div style={styles.cardTitle}>{feature.title}</div>
                <div style={styles.description}>{feature.description}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Commitment</h2>
        <p style={styles.cardText}>
          At FraudShield, we are committed to protecting our customers from fraud. This dashboard is not just a form-filling 
          tool — it is a gateway to safety, trust, and transparency. By working together, we can ensure 
          that your financial journey remains secure.
        </p>
      </section>

      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default AboutPage;
