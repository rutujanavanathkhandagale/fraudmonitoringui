import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { 
  User, CreditCard, ShieldCheck, Activity, 
  Mail, Phone
} from "lucide-react"; 

import {
  Chart as ChartJS, CategoryScale, LinearScale, 
  BarElement, Title, Tooltip, Legend,
} from "chart.js";

import { getPersonalDetails, getAccountDetails, getKYCProfile } from "../../services/Customer/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CustomerProfile() {
  const { id } = useParams();
  const [personal, setPersonal] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState({ personal: 0, account: 0, kyc: 0, overall: 0 });

  useEffect(() => {
    // Matches the deep FraudShield midnight background
    document.body.style.backgroundColor = "#08041C";
    document.body.style.margin = "0";
    
    const fetchProfile = async () => {
      try {
        const [p, a, k] = await Promise.all([
          getPersonalDetails(id),
          getAccountDetails(id),
          getKYCProfile(id),
        ]);
        setPersonal(p.data);
        setAccounts(Array.isArray(a.data) ? a.data : a.data ? [a.data] : []);
        setKyc(k.data);
      } catch (err) { 
        console.error("API Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    const pC = personal ? 100 : 0;
    const aC = accounts.length > 0 ? 100 : 0;
    const kC = kyc?.status === "Verified" ? 100 : 0;
    const total = Math.round(pC * 0.4 + aC * 0.3 + kC * 0.3);
    setCompletion({ personal: pC, account: aC, kyc: kC, overall: total });
  }, [personal, accounts, kyc]);

  if (loading) return <div style={styles.loader}><span>Initializing Dashboard...</span></div>;

  const chartData = {
    labels: ["Personal Info", "Account Details", "KYC Profile"],
    datasets: [{
      label: 'Completion %',
      data: [completion.personal, completion.account, completion.kyc],
      backgroundColor: ["#940c84ff", "#7C3AED", "#10B981"], // Matches brand colors
      borderRadius: 12,
      barThickness: 35,
    }],
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* WELCOME HERO - Uses the pink-to-purple gradient */}
        <div style={styles.welcomeHero}>
          <div style={styles.heroContent}>
            <div style={styles.avatarLarge}>
              {personal?.firstName ? personal.firstName[0].toUpperCase() : <User size={30}/>}
            </div>
            <div>
              <h1 style={styles.heroTitle}>
                Welcome, {personal?.firstName || 'Guest'}
              </h1>
              <p style={styles.heroSub}></p>
            </div>
          </div>
        </div>

        {/* KPI GRID - Glassmorphic cards */}
        <div style={styles.statsGrid}>
          <KpiCard icon={<User size={18} />} label="Customer ID" value={personal?.customerId || '—'} color="#E02596" />
          <KpiCard icon={<CreditCard size={18} />} label="Account" value={accounts[0]?.accountNumber || 'Not Linked'} color="#7C3AED" />
          <KpiCard 
            icon={<ShieldCheck size={18} />} 
            label="KYC Status" 
            value={kyc?.status || 'NOT STARTED'} 
            isStatus 
            statusType={kyc?.status === "Verified" ? "success" : "warning"} 
            color="#0a963dff" 
          />
          <KpiCard 
            icon={<Activity size={18} />} 
            label="Account Status" 
            value={accounts[0]?.status || 'INACTIVE'} 
            isStatus 
            statusType={accounts[0]?.status === "ACTIVE" ? "success" : "error"} 
            color="#0ca955ff" 
          />
        </div>

        {/* MAIN GRID */}
        <div style={styles.mainGrid}>
          <div style={styles.leftCol}>
            <div style={styles.glassCard}>
              <h3 style={styles.cardHeader}>Contact Details</h3>
              <div style={styles.contactItem}>
                <div style={{...styles.contactIcon, color: "#91085aff"}}><Mail size={16}/></div>
                <div>
                  <small style={styles.contactLabel}>Email</small>
                  <p style={styles.contactVal}>{personal?.email || 'N/A'}</p>
                </div>
              </div>
              <div style={styles.contactItem}>
                <div style={{...styles.contactIcon, color: "#E02596"}}><Phone size={16}/></div>
                <div>
                  <small style={styles.contactLabel}>Phone</small>
                  <p style={styles.contactVal}>{personal?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div style={styles.scoreCard}>
              <div style={styles.scoreFlex}>
                <span style={styles.scoreLabel}>Profile Completion</span>
                <span style={styles.scorePercent}>{completion.overall}%</span>
              </div>
              <div style={styles.progressContainer}>
                <div style={{...styles.progressFill, width: `${completion.overall}%`}} />
              </div>
            </div>
          </div>

          <div style={styles.chartCol}>
            <h3 style={styles.cardHeader}>Completion Metrics</h3>
            <div style={{height: '250px', marginTop: '15px'}}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const KpiCard = ({icon, label, value, color, isStatus, statusType}) => (
  <div style={styles.kpiCard}>
    <div style={{...styles.kpiIcon, backgroundColor: `${color}15`, color: color}}>{icon}</div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <p style={styles.kpiLabel}>{label}</p>
      {isStatus ? (
        <span style={{...styles.statusBadge, ...styles[statusType]}}>{value}</span>
      ) : (
        <p style={styles.kpiValue}>{value}</p>
      )}
    </div>
  </div>
);

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
    x: { grid: { display: false }, ticks: { font: { size: 11, weight: '600' }, color: '#94a3b8' } }
  }
};

const styles = {
  page: { backgroundColor: "#2e0741ff", minHeight: "100vh", padding: "40px 20px", display: "flex", justifyContent: "center", color: "#fff", fontFamily: "'Inter', sans-serif" },
  container: { width: "100%", maxWidth: "1150px" },
  
  welcomeHero: { 
    background: "linear-gradient(135deg, #30164d 0%, #af1a6cff 100%)", 
    padding: "45px", borderRadius: "32px", marginBottom: "30px", 
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)"
  },
  heroContent: { display: "flex", alignItems: "center", gap: "25px" },
  avatarLarge: { width: "70px", height: "70px", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "bold", backdropFilter: "blur(10px)" },
  heroTitle: { fontSize: "34px", fontWeight: "800", margin: 0, letterSpacing: "-0.5px" },
  heroSub: { opacity: 0.8, margin: "5px 0 0 0", fontSize: "16px" },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" },
  kpiCard: { 
    backgroundColor: "rgba(255, 255, 255, 0.03)", 
    backdropFilter: "blur(20px)", 
    padding: "26px", borderRadius: "28px", display: "flex", gap: "15px", alignItems: "center", 
    border: "1px solid rgba(255,255,255,0.08)", transition: "all 0.3s ease" 
  },
  kpiIcon: { width: "50px", height: "50px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center" },
  kpiLabel: { fontSize: "11px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", margin: "0 0 4px 0", letterSpacing: "1px" },
  kpiValue: { fontSize: "17px", fontWeight: "800", color: "#fff", margin: 0 },

  mainGrid: { display: "flex", gap: "30px", flexWrap: "wrap" },
  leftCol: { flex: "1", minWidth: "340px", display: "flex", flexDirection: "column", gap: "30px" },
  chartCol: { 
    flex: "1.8", minWidth: "400px", 
    backgroundColor: "rgba(255, 255, 255, 0.03)", 
    backdropFilter: "blur(20px)", 
    padding: "35px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.08)" 
  },
  
  glassCard: { 
    backgroundColor: "rgba(255, 255, 255, 0.03)", 
    backdropFilter: "blur(20px)", 
    padding: "35px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.08)" 
  },
  cardHeader: { fontSize: "13px", fontWeight: "800", color: "#8f0959ff", margin: "0 0 25px 0", textTransform: "uppercase", letterSpacing: "2px" },
  
  contactItem: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" },
  contactIcon: { backgroundColor: "rgba(255,255,255,0.05)", width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" },
  contactLabel: { display: "block", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase" },
  contactVal: { fontWeight: "600", color: "#fff", margin: 0, fontSize: "15px" },

  scoreCard: { backgroundColor: "rgba(15, 1, 30, 0.4)", padding: "35px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.05)" },
  scoreFlex: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  scoreLabel: { fontWeight: "700", opacity: 0.9, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" },
  scorePercent: { fontSize: "32px", fontWeight: "900", color: "#10B981" },
  progressContainer: { height: "12px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "20px", overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #30164d, #a50b84ff)", borderRadius: "20px" },

  statusBadge: { padding: "6px 14px", borderRadius: "10px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase" },
  success: { backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.2)" },
  warning: { backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#F59E0B", border: "1px solid rgba(245, 158, 11, 0.2)" },
  error: { backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.2)" },

  loader: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#08041C", color: "#8d0c59ff", fontWeight: "800", fontSize: "22px" }
};

export default CustomerProfile;