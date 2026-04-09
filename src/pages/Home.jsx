import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, TrendingUp, Activity, Network, Zap,
  FileSearch, Scale
} from 'lucide-react';
import { HeroAnimation } from '../components/HeroAnimation';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext'; // 1. Added Theme Import
 
export function Home() {
  const { currentColors, actualTheme, fontSize } = useTheme(); // 2. Get dynamic theme data
 
  const stats = [
    { label: 'Transactions Scored Daily', value: '50M+', icon: Activity, color: '#34d399' },
    { label: 'False Positives Reduced', value: '45%', icon: TrendingUp, color: '#c084fc' },
    { label: 'Entities Resolved', value: '12M+', icon: Network, color: '#f472b6' },
    { label: 'System Uptime Target', value: '99.9%', icon: Shield, color: '#22d3ee' },
  ];
 
  const features = [
    {
      title: 'Transaction Ingestion & Scoring',
      description: 'Ingest events via REST API and evaluate them in real-time against rules, scenarios, and behavioral profiles.',
      icon: Zap,
      bgColor: '#9333ea',
    },
    {
      title: 'Alerts & Case Management',
      description: 'Bundle threshold-breaching alerts into prioritized cases for in-depth investigation and resolution.',
      icon: FileSearch,
      bgColor: '#db2777',
    },
    {
      title: 'Entity Resolution & Watchlists',
      description: 'Maintain internal watchlists and resolve entity linkages across customer accounts and counterparties.',
      icon: Network,
      bgColor: '#059669',
    },
    {
      title: 'Regulatory Reporting (SAR/STR)',
      description: 'Seamlessly prepare, approve, and maintain comprehensive audit evidence for regulatory submissions.',
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
              <span className="fs-5 fw-bold lh-1" style={{ color: currentColors.textPrimary }}>FraudGuard Bank</span>
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
 
      {/* Hero Section */}
      <section className="position-relative overflow-hidden py-5 mt-5">
        <div className="container position-relative z-1 py-5">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6 text-start">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4"
                   style={{
                     backgroundColor: actualTheme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(147, 51, 234, 0.05)',
                     border: `1px solid ${currentColors.border}`,
                     color: actualTheme === 'dark' ? '#d8b4fe' : '#9333ea'
                   }}>
                <Shield size={16} />
                <span className="fw-medium small">Internal AML & Fraud Monitoring Platform</span>
              </div>
              <h1 className="display-4 fw-bold mb-4 lh-sm" style={{ color: currentColors.textPrimary }}>
                Enterprise-Grade <br />
                <span style={styles.textGradient}>Transaction Monitoring</span>
              </h1>
              <p className="lead mb-4 opacity-75" style={{ maxWidth: '600px', color: currentColors.textPrimary }}>
                FraudShield provides real-time anti-money laundering (AML) and fraud risk scoring. Designed to empower analysts, investigators, and compliance officers.
              </p>
              <Link to="/login" className="btn btn-lg px-5 fw-bold shadow" style={styles.btnGradient}>
                Launch Portal
              </Link>
            </div>
            <div className="col-lg-6 d-flex justify-content-center align-items-center">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>
 
      {/* Stats Section - Background scales with theme */}
      <section className="py-5"
               style={{
                 background: actualTheme === 'dark'
                   ? 'linear-gradient(to right, rgba(88, 28, 135, 0.5), rgba(131, 24, 67, 0.5))'
                   : 'rgba(0,0,0,0.02)',
                 backdropFilter: 'blur(4px)',
                 borderTop: `1px solid ${currentColors.border}`,
                 borderBottom: `1px solid ${currentColors.border}`
               }}>
        <div className="container">
          <div className="row g-4 text-center">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="col-6 col-md-3">
                  <div className="d-flex justify-content-center mb-3">
                    <Icon size={32} color={stat.color} />
                  </div>
                  <div className="display-6 fw-bold mb-2" style={{ color: currentColors.textPrimary }}>{stat.value}</div>
                  <div className="fw-medium" style={{ color: currentColors.textSecondary }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
 
      {/* Features Section */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-semibold mb-3" style={{ color: currentColors.textPrimary }}>Comprehensive AML Framework</h2>
            <p className="lead opacity-75 mx-auto" style={{ maxWidth: '700px', color: currentColors.textPrimary }}>
              A modular system built for RBAC compliance, securing retail and corporate banking products through advanced rule authoring.
            </p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="col-md-6 col-lg-3">
                  <div className="card h-100 shadow-sm transition-all"
                       style={{ ...styles.glassCard, transition: 'transform 0.2s' }}
                       onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                       onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div className="card-body p-4">
                      <div className="rounded-3 d-inline-flex align-items-center justify-content-center mb-4 shadow"
                           style={{ width: '48px', height: '48px', backgroundColor: feature.bgColor }}>
                        <Icon size={24} color="white" />
                      </div>
                      <h5 className="fw-bold mb-3" style={{ color: currentColors.textPrimary }}>{feature.title}</h5>
                      <p style={{ fontSize: '0.95rem', color: currentColors.textSecondary }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
 
      <Footer />
    </div>
  );
}
 
export default Home;