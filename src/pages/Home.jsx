import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, TrendingUp, Users, Activity, CheckCircle, Zap, 
  FileSearch, Network, Bell, Database, Scale, Lock 
} from 'lucide-react';
import { HeroAnimation } from '../components/HeroAnimation';

export function Home() {
  const stats = [
    { label: 'Transactions Scored Daily', value: '50M+', icon: Activity, color: '#34d399' }, // emerald-400
    { label: 'False Positives Reduced', value: '45%', icon: TrendingUp, color: '#c084fc' }, // purple-400
    { label: 'Entities Resolved', value: '12M+', icon: Network, color: '#f472b6' }, // pink-400
    { label: 'System Uptime Target', value: '99.9%', icon: Shield, color: '#22d3ee' }, // cyan-400
  ];

  const features = [
    {
      title: 'Transaction Ingestion & Scoring',
      description: 'Ingest events via REST API and evaluate them in real-time against rules, scenarios, and behavioral profiles.',
      icon: Zap,
      bgColor: '#9333ea', // purple-600
    },
    {
      title: 'Alerts & Case Management',
      description: 'Bundle threshold-breaching alerts into prioritized cases for in-depth investigation and resolution.',
      icon: FileSearch,
      bgColor: '#db2777', // pink-600
    },
    {
      title: 'Entity Resolution & Watchlists',
      description: 'Maintain internal watchlists and resolve entity linkages across customer accounts and counterparties.',
      icon: Network,
      bgColor: '#059669', // emerald-600
    },
    {
      title: 'Regulatory Reporting (SAR/STR)',
      description: 'Seamlessly prepare, approve, and maintain comprehensive audit evidence for regulatory submissions.',
      icon: Scale,
      bgColor: '#0891b2', // cyan-600
    },
  ];

  const steps = [
    { number: '01', title: 'Real-Time Ingestion', description: 'FraudShield securely ingests cross-channel transaction events from your core banking system.' },
    { number: '02', title: 'Rules & Profiling', description: 'Events are evaluated instantly against dynamic AML scenarios, KYC profiles, and historical behavior.' },
    { number: '03', title: 'Alert Generation', description: 'Risk scores that breach configured thresholds automatically generate high-severity alerts.' },
    { number: '04', title: 'Investigation', description: 'Analysts utilize the unified Case Workspace to investigate entities, record notes, and take action.' },
  ];

  // Custom reusable styles for elements that standard Bootstrap doesn't cover natively
  const styles = {
    pageBackground: { background: 'linear-gradient(135deg, #4c1d95, #0f172a, #831843)' },
    textGradient: { background: 'linear-gradient(to right, #c084fc, #f472b6, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    glassCard: { backgroundColor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(126, 34, 206, 0.3)' },
    btnGradient: { background: 'linear-gradient(to right, #9333ea, #db2777)', color: 'white', border: 'none' }
  };

  return (
    <div className="min-vh-100 text-light" style={styles.pageBackground}>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: 'rgba(88, 28, 135, 0.5)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(126, 34, 206, 0.3)' }}>
        <div className="container py-2">
          <div className="d-flex align-items-center gap-3">
            <Shield size={32} color="#c084fc" />
            <div className="d-flex flex-column">
              <span className="fs-5 fw-bold lh-1 text-white">FraudGuard Bank</span>
              <span className="text-uppercase fw-medium mt-1" style={{ fontSize: '0.75rem', color: '#d8b4fe', letterSpacing: '0.05em' }}>Real-Time AML & Fraud Monitoring</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3 ms-auto">
            <button className="btn text-light btn-link text-decoration-none">Sign Up</button>
            <button className="btn px-4 fw-medium shadow-sm" style={styles.btnGradient}>Register</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="position-relative overflow-hidden py-5 mt-5">
        <div className="container position-relative z-1 py-5">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6 text-start">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', color: '#d8b4fe' }}>
                <Shield size={16} />
                <span className="fw-medium small">Internal AML & Fraud Monitoring Platform</span>
              </div>
              <h1 className="display-4 fw-bold text-white mb-4 lh-sm">
                Enterprise-Grade <br />
                <span style={styles.textGradient}>Transaction Monitoring</span>
              </h1>
              <p className="lead text-light opacity-75 mb-0" style={{ maxWidth: '600px' }}>
                FraudShield provides real-time anti-money laundering (AML) and fraud risk scoring. Designed to empower analysts, investigators, and compliance officers with intelligent case management.
              </p>
            </div>
            <div className="col-lg-6 d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5" style={{ background: 'linear-gradient(to right, rgba(88, 28, 135, 0.5), rgba(131, 24, 67, 0.5))', backdropFilter: 'blur(4px)', borderTop: '1px solid rgba(126, 34, 206, 0.2)', borderBottom: '1px solid rgba(126, 34, 206, 0.2)' }}>
        <div className="container">
          <div className="row g-4 text-center">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="col-6 col-md-3">
                  <div className="d-flex justify-content-center mb-3">
                    <Icon size={32} color={stat.color} />
                  </div>
                  <div className="display-6 fw-bold text-white mb-2">{stat.value}</div>
                  <div className="text-light opacity-75 fw-medium">{stat.label}</div>
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
            <h2 className="display-6 text-white fw-semibold mb-3">Comprehensive AML Framework</h2>
            <p className="lead text-light opacity-75 mx-auto" style={{ maxWidth: '700px' }}>
              A modular system built for RBAC compliance, securing retail and corporate banking products through advanced rule authoring.
            </p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="col-md-6 col-lg-3">
                  <div className="card h-100 text-light shadow-sm transition-all" style={{ ...styles.glassCard, transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div className="card-body p-4">
                      <div className="rounded-3 d-inline-flex align-items-center justify-content-center mb-4 shadow" style={{ width: '48px', height: '48px', backgroundColor: feature.bgColor }}>
                        <Icon size={24} color="white" />
                      </div>
                      <h5 className="card-title text-white fw-bold mb-3">{feature.title}</h5>
                      <p className="card-text text-light opacity-75" style={{ fontSize: '0.95rem' }}>
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

      {/* How It Works Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.3), rgba(15, 23, 42, 0.5), rgba(131, 24, 67, 0.3))' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-6 text-white fw-semibold mb-3">End-to-End Investigation Lifecycle</h2>
            <p className="lead text-light opacity-75 mx-auto" style={{ maxWidth: '700px' }}>
              Our automated workflow processes transactions from raw ingestion to documented regulatory reporting.
            </p>
          </div>
          <div className="row g-4 position-relative">
            {steps.map((step, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="card h-100 p-4 border-0 text-light shadow" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(5px)' }}>
                  <div className="fw-bold mb-3 opacity-75" style={{ ...styles.textGradient, fontSize: '3rem', lineHeight: '1' }}>
                    {step.number}
                  </div>
                  <h5 className="text-white mb-3 fw-medium">{step.title}</h5>
                  <p className="text-light opacity-75 small mb-0">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Preview */}
      <section className="py-5" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', borderTop: '1px solid rgba(126, 34, 206, 0.2)' }}>
        <div className="container py-5">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6">
              <h2 className="display-6 text-white fw-semibold mb-4">Operational KPIs & Case Workspace</h2>
              <p className="lead text-light opacity-75 mb-4 pb-2">
                Empower your Compliance Officers and Admin teams. Track alert volumes, monitor hit rates, and visualize case outcomes. The operational dashboard delivers actionable insights to continuously refine rule thresholds.
              </p>
              <div className="d-flex flex-column gap-3">
                {[
                  'Live alert streams with severity filtering',
                  'Interactive case timelines and attachment management',
                  'Visual entity relationship linking',
                  'Control checklist adherence tracking',
                  'Auditable system and session logging',
                ].map((item, index) => (
                  <div key={index} className="d-flex align-items-center gap-3">
                    <CheckCircle size={20} color="#34d399" className="flex-shrink-0" />
                    <span className="text-light opacity-75">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBhbmFseXRpY3MlMjBkYXRhfGVufDF8fHx8MTc3NDQ3Mzc3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Case Management Dashboard"
                  className="img-fluid rounded-4 shadow-lg w-100 object-fit-cover"
                  style={{ height: '400px', border: '1px solid rgba(126, 34, 206, 0.5)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-5 my-5 position-relative">
        <div className="container">
          <div className="card border-0 text-center text-white shadow-lg mx-auto" style={{ background: 'linear-gradient(to right, #6b21a8, #9d174d)', maxWidth: '900px', borderRadius: '1.5rem' }}>
            <div className="card-body p-5">
              <Lock size={64} className="text-white opacity-75 mb-4 mx-auto" />
              <h2 className="display-6 fw-semibold mb-3">Access the FraudShield Portal</h2>
              <p className="lead opacity-75 mb-5 mx-auto" style={{ maxWidth: '600px' }}>
                Authorized personnel only. Please ensure you are connected to the internal bank network before proceeding to the live monitoring dashboard.
              </p>
              
              <div className="mx-auto" style={{ maxWidth: '400px' }}>
                <div className="input-group input-group-lg mb-3">
                  <input 
                    type="password" 
                    className="form-control bg-dark bg-opacity-25 text-white border-light border-opacity-25" 
                    placeholder="Enter Secure Access Token..." 
                    style={{ backdropFilter: 'blur(5px)' }}
                  />
                  <Link to="/dashboard">
                    <button className="btn btn-light text-dark fw-bold px-4" type="button">
                      Authenticate
                    </button>
                  </Link>
                </div>
                <div className="d-flex justify-content-between align-items-center small px-2">
                  <span className="d-flex align-items-center gap-2" style={{ color: '#d8b4fe' }}>
                    <CheckCircle size={16} color="#34d399" />
                    Network Secured
                  </span>
                  <a href="#" className="text-white text-decoration-none border-bottom border-light border-opacity-50">
                    Forgot Token?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="py-5" style={{ backgroundColor: '#020617', borderTop: '1px solid rgba(126, 34, 206, 0.3)' }}>
        <div className="container pt-4">
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Shield size={24} color="#c084fc" />
                <span className="fs-5 fw-bold text-white">FraudGuard Bank</span>
              </div>
              <p className="small text-light opacity-50 pe-4">
                FraudShield Internal AML & Risk Monitoring System.
                Property of FraudGuard Bank Information Security.
              </p>
            </div>
            <div className="col-md-3">
              <h6 className="text-white fw-bold mb-3">Modules</h6>
              <ul className="list-unstyled small text-light opacity-50 d-flex flex-column gap-2">
                <li><a href="#" className="text-decoration-none text-reset">Transaction Scoring</a></li>
                <li><a href="#" className="text-decoration-none text-reset">Case Management</a></li>
                <li><a href="#" className="text-decoration-none text-reset">Watchlists</a></li>
                <li><a href="#" className="text-decoration-none text-reset">Regulatory Reporting</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="text-white fw-bold mb-3">Staff Resources</h6>
              <ul className="list-unstyled small text-light opacity-50 d-flex flex-column gap-2">
                <li><a href="#" className="text-decoration-none text-reset">User Manuals</a></li>
                <li><a href="#" className="text-decoration-none text-reset">Rules Engine Guide</a></li>
                <li><a href="#" className="text-decoration-none text-reset">System Status</a></li>
                <li><a href="#" className="text-decoration-none text-reset">IT Support</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="text-white fw-bold mb-3">Compliance</h6>
              <ul className="list-unstyled small text-light opacity-50 d-flex flex-column gap-2">
                <li><a href="#" className="text-decoration-none text-reset">Audit Logs</a></li>
                <li><a href="#" className="text-decoration-none text-reset">Access Policy</a></li>
                <li><a href="#" className="text-decoration-none text-reset">Data Privacy Framework</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-5 pt-4 small text-light opacity-50" style={{ borderTop: '1px solid rgba(126, 34, 206, 0.2)' }}>
            <p className="mb-0">&copy; 2026 FraudGuard Bank. Confidential & Proprietary.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default Home;