import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, TrendingUp, Activity, Network, Zap,
  FileSearch, Scale
} from 'lucide-react';
import { HeroAnimation } from "../components/common/HeroAnimation";
import Footer from "../components/common/Footer";

import { useTheme } from '../context/ThemeContext'; // 1. Added Theme Import
 
export function Home() {
  const { currentColors, actualTheme, fontSize } = useTheme(); // 2. Get dynamic theme data
 
  const stats = [
    { label: 'Transactions Scored Daily', value: '5M+', icon: Activity, color: '#34d399' },
    { label: 'False Positives Reduced', value: '45%', icon: TrendingUp, color: '#c084fc' },
    { label: 'Cases Resolved', value: '1M+', icon: Network, color: '#f472b6' },
    { label: 'Availability', value: '24/7', icon: Shield, color: '#22d3ee' },
  ];
 
  const features = [
    {
      title: 'Transaction Ingestion & Scoring',
      description: 'Analyze transactions in real-time and detect suspicious activities using risk-based rules.',
      icon: Zap,
      bgColor: '#9333ea',
    },
    {
      title: 'Alerts & Case Management',
      description: 'Monitor generated alerts and convert them into cases for investigation.',
      icon: FileSearch,
      bgColor: '#db2777',
    },
    {
      title: 'Customer Risk Tracking',
      description: 'Track customer behavior and identify high-risk users based on alerts and activity.',
      icon: Network,
      bgColor: '#059669',
    },
    {
      title: 'Regulatory Reporting (SAR/STR)',
      description: 'Generate reports and visual insights to understand fraud trends and system performance.',
      icon: Scale,
      bgColor: '#0891b2',
    },
  ];
 
  // 3. DYNAMIC STYLES: These now use currentColors from your context
  const styles = {
    pageBackground: {
        // Background swaps between your custom gradient and the theme's app background
        background: actualTheme === 'dark'
            ? 'linear-gradient(135deg, #4c1d95, #0f172a, #831843)'
            : currentColors.appBg,
        fontSize: `${fontSize}px`,
        transition: 'all 0.4s ease'
    },
    textGradient: {
        background: 'linear-gradient(to right, #9333ea, #db2777)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    glassCard: {
        backgroundColor: actualTheme === 'dark' ? 'rgba(30, 41, 59, 0.6)' : currentColors.cardBg,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${currentColors.border}`,
        boxShadow: actualTheme === 'light' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
    },
    btnGradient: {
        background: 'linear-gradient(to right, #9333ea, #db2777)',
        color: 'white',
        border: 'none',
        textDecoration: 'none'
    }
  };
 
  return (
    <div className="min-vh-100" style={styles.pageBackground}>
      {/* Navigation - Colors are now dynamic */}
      <nav className="navbar navbar-expand-lg sticky-top shadow-sm"
           style={{
             backgroundColor: actualTheme === 'dark' ? 'rgba(88, 28, 135, 0.5)' : currentColors.cardBg,
             backdropFilter: 'blur(8px)',
             borderBottom: `1px solid ${currentColors.border}`
           }}>
        <div className="container py-2">
          <Link to="/" className="d-flex align-items-center gap-3 text-decoration-none">
            <Shield size={32} color={actualTheme === 'light' ? '#9333ea' : "#c084fc"} />
            <div className="d-flex flex-column">
              <span className="fs-5 fw-bold lh-1" style={{ color: currentColors.textPrimary }}>FraudShield </span>
              <span className="text-uppercase fw-medium mt-1" style={{ fontSize: '0.75rem', color: currentColors.textSecondary, letterSpacing: '0.05em' }}>Real-Time AML & Fraud Monitoring</span>
            </div>
          </Link>
         
          <div className="d-flex align-items-center gap-3 ms-auto">
            <Link to="/login" className="btn fw-medium" style={{ color: currentColors.textPrimary }}>
              Login
            </Link>
            <Link to="/register" className="btn px-4 fw-medium shadow-sm" style={styles.btnGradient}>
              Register
            </Link>
          </div>
        </div>
      </nav>
 
    
           
      <section className="py-5 mt-4">
        <div className="container">
          
          {/* Using pure CSS flexbox here. 
            flexWrap: 'wrap' is allowed for mobile, but on laptops it will stay side-by-side. 
          */}
          <div 
            className="d-flex flex-column flex-lg-row align-items-center justify-content-between" 
            style={{ width: '100%', gap: '2rem' }}
          >
            
            {/* LEFT COLUMN: Text Content (Forced to take up 50% of the space) */}
            <div style={{ flex: '1 1 50%', minWidth: '300px' }} className="text-start">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4" 
                   style={{ 
                     backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                     border: '1px solid rgba(255, 255, 255, 0.1)', 
                     color: '#e9d5ff' 
                   }}>
                <Shield size={14} />
                <span className="fw-medium small">Internal AML & Fraud Monitoring Platform</span>
              </div>
              
              <h1 className="display-4 fw-bold mb-4" style={{ color: '#ffffff', lineHeight: '1.2' }}>
                Enterprise-Grade <br />
                <span style={styles.textGradient}>Transaction Monitoring</span>
              </h1>
              
              <p className="lead mb-5" style={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: '500px' }}>
                FraudShield provides real-time anti-money laundering (AML) and fraud risk scoring.It continuously monitors transactions in real time, applies advanced detection rules and behavioral scenarios, and assigns risk scores to highlight suspicious activities.
              </p>
              
             
            </div>

            {/* RIGHT COLUMN: Hero Animation (Forced to take up the other 50%) */}
            <div 
              style={{ flex: '1 1 50%', display: 'flex', justifyContent: 'center', minWidth: '300px' }}
            >
              {/* Added a subtle scale so it fits nicely inside its 50% half without overflowing */}
              <div style={{ width: '100%', maxWidth: '550px', transform: 'scale(0.95)', transformOrigin: 'center' }}>
                <HeroAnimation />
              </div>
            </div>

          </div>
        </div>
      </section>
 
      {/* Stats Section - Background scales with theme */}
     {/* STATS SECTION - FORCED SINGLE ROW */}
<section className="py-5 border-top border-bottom" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
  <div className="container">
    
    {/* d-flex and flex-md-nowrap force all items into one horizontal line on desktop */}
    <div className="d-flex flex-wrap flex-md-nowrap justify-content-center justify-content-md-between text-center gap-4">
      
      {stats.map((stat, i) => (
        
        <div key={i} style={{ flex: '1 1 0', minWidth: '200px' }}>
          {/* flex: '1 1 0' ensures every item takes up the exact same amount of space */}
          
          <stat.icon size={28} color={stat.color} className="mb-3" />
          <div className="display-6 fw-bold text-white mb-2">{stat.value}</div>
          <div className="small fw-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{stat.label}</div>
        </div>

      ))}
      
    </div>
  </div>
</section>
 
      {/* Features Section */}
   {/* FEATURES SECTION - FORCED SINGLE ROW */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-white mb-3">Comprehensive AML Application</h2>
            <p className="mx-auto" style={{ maxWidth: '600px', color: 'rgba(255,255,255,0.7)' }}>
             A real-time fraud monitoring system that detects suspicious transactions, generates alerts, and enables case-based investigation using a rule-driven approach.
            </p>
          </div>
          
          {/* d-flex and flex-xl-nowrap force all 4 cards into one horizontal line on desktops */}
          <div className="d-flex flex-wrap flex-xl-nowrap justify-content-center gap-4">
            
            {features.map((f, i) => (
              
              <div key={i} style={{ flex: '1 1 0', minWidth: '240px' }}>
                {/* flex: '1 1 0' ensures every card takes up exactly 25% of the space */}
                
                <div className="card h-100 border-0 shadow-sm p-4 text-start" style={styles.glassCard}>
                  <div className="d-inline-flex align-items-center justify-content-center mb-4" 
                       style={{ width: '45px', height: '45px', backgroundColor: f.bgColor, borderRadius: '10px' }}>
                    <f.icon size={22} color="white" />
                  </div>
                  <h6 className="fw-bold text-white mb-3">{f.title}</h6>
                  <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.6)' }}>{f.description}</p>
                </div>

              </div>

            ))}
            
          </div>
        </div>
      </section>
 
      <Footer />
    </div>
  );
}
 
export default Home;