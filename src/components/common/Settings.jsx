import React, { useState } from 'react';
import {
  FiBell, FiMonitor, FiMoon, FiSun,
  FiCheck, FiLayers, FiDatabase, FiGlobe, FiLock, FiCpu, FiType
} from 'react-icons/fi';
import { useTheme } from "../../context/ThemeContext";

import 'bootstrap/dist/css/bootstrap.min.css';
 
const Settings = () => {
  const { themeMode, setThemeMode, currentColors, actualTheme, fontSize, setFontSize } = useTheme();
  const [emailAlerts, setEmailAlerts] = useState(true);
 
  const accentColor = actualTheme === 'frost' ? "#23a6d5" : "#d400ff";
  const glassStyle = actualTheme === 'frost' ? { backdropFilter: "blur(20px)", border: `1px solid ${currentColors.border}` } : {};
 
  const ThemeOption = ({ id, icon, title, desc }) => (
    <div className="col-md-4 mb-3" onClick={() => setThemeMode(id)} style={{ cursor: "pointer" }}>
      <div
        className="card h-100 border-0 p-3 shadow-sm text-center"
        style={{
          backgroundColor: themeMode === id ? "rgba(255,255,255,0.15)" : currentColors.cardBg,
          border: themeMode === id ? `2px solid ${accentColor}` : `1px solid ${currentColors.border}`,
          borderRadius: "12px",
          transition: "all 0.2s ease",
          ...glassStyle
        }}
      >
        <div className="fs-2 mb-2" style={{ color: themeMode === id ? accentColor : currentColors.textSecondary }}>{icon}</div>
        <h6 className="fw-bold mb-1" style={{ color: currentColors.textPrimary, fontSize: '0.9em' }}>{title}</h6>
        <p style={{ color: currentColors.textSecondary, fontSize: '0.75em' }} className="mb-0">{desc}</p>
        {themeMode === id && <div className="mt-2 fw-bold" style={{ color: accentColor, fontSize: '0.65em' }}><FiCheck /> ACTIVE</div>}
      </div>
    </div>
  );
 
  return (
    <div className="container-fluid py-4" style={{ background: "transparent", minHeight: "100vh" }}>
     
      {/* PAGE HEADER */}
      <header className="mb-5">
        <div className="d-flex align-items-center mb-1">
          <div className="p-2 rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ background: accentColor, width: '42px', height: '42px' }}>
            <FiCpu className="text-white" size={20} />
          </div>
          <h2 className="fw-bold mb-0" style={{ color: currentColors.textPrimary, fontSize: '1.6em' }}>Control Center</h2>
        </div>
        <p style={{ color: currentColors.textSecondary, fontSize: '0.9em' }} className="ms-5 opacity-75">Configure system-wide preferences and security protocols.</p>
      </header>
 
      <div className="row g-4">
        <div className="col-lg-8">
         
          {/* 1. APPEARANCE & TYPOGRAPHY SECTION */}
          <div className="card border-0 shadow-lg mb-4" style={{ backgroundColor: currentColors.cardBg, borderRadius: '16px', ...glassStyle }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: currentColors.textPrimary, fontSize: '1.05em' }}>
                <FiMonitor className="me-2" style={{ color: accentColor }} /> Visual Interface
              </h5>
             
              {/* Theme Selection */}
              <div className="row mb-4">
                <ThemeOption id="dark" icon={<FiMoon />} title="Midnight" desc="Pro dark environment" />
                <ThemeOption id="light" icon={<FiSun />} title="Daylight" desc="High contrast light" />
                <ThemeOption id="frost" icon={<FiLayers />} title="Frost UI" desc="Modern Glassmorphism" />
              </div>
 
              {/* Font Size Selection */}
              <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: currentColors.textPrimary, fontSize: '0.9em' }}>
                <FiType className="me-2" style={{ color: accentColor }} /> Typography Scale
              </h6>
              <div className="d-flex gap-2">
                {[
                  { label: "Small", size: 14 },
                  { label: "Default", size: 16 },
                  { label: "Large", size: 18 }
                ].map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setFontSize(f.size)}
                    className="btn btn-sm px-4 py-2 fw-bold"
                    style={{
                      backgroundColor: fontSize === f.size ? accentColor : "rgba(255,255,255,0.05)",
                      color: fontSize === f.size ? "#fff" : currentColors.textPrimary,
                      border: `1px solid ${fontSize === f.size ? accentColor : currentColors.border}`,
                      borderRadius: "8px",
                      fontSize: '0.8em',
                      transition: "0.3s"
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
 
          {/* 2. SYSTEM STATUS */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm" style={{ backgroundColor: currentColors.cardBg, borderRadius: '12px', ...glassStyle }}>
                <div className="card-body py-3 text-center">
                  <h6 className="fw-bold mb-2" style={{ color: currentColors.textSecondary, fontSize: '0.75em', textTransform: 'uppercase' }}><FiDatabase className="me-1" /> Database</h6>
                  <div className="text-success small fw-bold" style={{ fontSize: '0.8em' }}>Operational • 14ms</div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm" style={{ backgroundColor: currentColors.cardBg, borderRadius: '12px', ...glassStyle }}>
                <div className="card-body py-3 text-center">
                  <h6 className="fw-bold mb-2" style={{ color: currentColors.textSecondary, fontSize: '0.75em', textTransform: 'uppercase' }}><FiGlobe className="me-1" /> Node</h6>
                  <div className="text-info small fw-bold" style={{ fontSize: '0.8em' }}>Encrypted RSA-4096</div>
                </div>
              </div>
            </div>
          </div>
 
          {/* 3. NOTIFICATIONS */}
          <div className="card border-0 shadow-lg" style={{ backgroundColor: currentColors.cardBg, borderRadius: '16px', ...glassStyle }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3" style={{ color: currentColors.textPrimary, fontSize: '1.05em' }}><FiBell className="me-2" /> Alert Protocols</h5>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold" style={{ color: currentColors.textPrimary, fontSize: '0.9em' }}>Critical Risk Notification</div>
                  <p className="mb-0" style={{ color: currentColors.textSecondary, fontSize: '0.8em' }}>Instant push notifications for scores above 80</p>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" style={{ cursor: 'pointer', scale: '1.2' }} checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {/* RIGHT COLUMN */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg mb-4" style={{ backgroundColor: currentColors.cardBg, borderRadius: '16px', ...glassStyle }}>
            <div className="card-body p-4 text-center">
              <div className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold mb-3 shadow-lg"
                   style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #d400ff, #ff0080)", fontSize: '1.4em' }}>L</div>
              <h5 className="fw-bold mb-0" style={{ color: currentColors.textPrimary, fontSize: '1.1em' }}>Litika Gaikwad</h5>
              <p className="mb-4 opacity-75" style={{ color: currentColors.textSecondary, fontSize: '0.8em' }}>Investigator ID: #9921</p>
              <button className="btn btn-sm w-100 fw-bold py-2 rounded-pill" style={{ border: `1px solid ${accentColor}`, color: accentColor }}>Manage Account</button>
            </div>
          </div>
 
          <div className="card border-0 shadow-lg" style={{ backgroundColor: currentColors.cardBg, borderRadius: '16px', ...glassStyle }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: currentColors.textPrimary, fontSize: '0.85em' }}><FiLock className="me-2" /> Security Tier</h6>
              <div className="progress rounded-pill mb-2" style={{ height: "5px", backgroundColor: "rgba(0,0,0,0.1)" }}>
                <div className="progress-bar bg-success" style={{ width: "85%" }}></div>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <small style={{ color: currentColors.textSecondary, fontSize: '0.7em' }}>Strength: Strong</small>
                <small style={{ color: currentColors.textSecondary, fontSize: '0.7em' }}>85%</small>
              </div>
              <button className="btn btn-sm w-100 py-2 mb-2 text-white border-0 shadow-sm" style={{ backgroundColor: "rgba(255,255,255,0.05)", fontSize: '0.75em' }}>Audit History</button>
              <button className="btn btn-sm w-100 py-2 text-white border-0 shadow-sm" style={{ backgroundColor: "rgba(255,255,255,0.05)", fontSize: '0.75em' }}>Rotate Keys</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Settings;