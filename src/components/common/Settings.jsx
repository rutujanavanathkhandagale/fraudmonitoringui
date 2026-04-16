import React, { useState, useEffect } from 'react';
import { FiMonitor, FiMoon, FiSun, FiCheck, FiLayers, FiCpu, FiType } from 'react-icons/fi';
import { useTheme } from "../../context/ThemeContext";
import 'bootstrap/dist/css/bootstrap.min.css';

// --- Layout Components ---
import Header from "./Header"; 
import Footer from "./Footer";
import Sidebar from "../Investigator/Isidebar"; 

const Settings = () => {
  const { themeMode, setThemeMode, currentColors, actualTheme, fontSize, setFontSize } = useTheme();
  
  const [collapsed, setCollapsed] = useState(false);

  const accentColor = actualTheme === 'frost' ? "#23a6d5" : "#d400ff";
  const glassStyle = actualTheme === 'frost' ? { backdropFilter: "blur(20px)", border: `1px solid ${currentColors.border}` } : {};

  // Determine if we are currently in light mode
  const isLight = themeMode === 'light' || actualTheme === 'light';
  
  // Keep the active card white in light mode so it pops against the light grey background
  const activeCardBg = isLight ? "#ffffff" : "rgba(255, 255, 255, 0.15)";

  const ThemeOption = ({ id, icon, title, desc }) => (
    <div className="col-12 col-md-4 mb-3 mb-md-0" onClick={() => setThemeMode(id)} style={{ cursor: "pointer" }}>
      <div
        className="card h-100 border-0 p-3 shadow-sm text-center d-flex flex-column align-items-center justify-content-center"
        style={{
          backgroundColor: themeMode === id ? activeCardBg : currentColors.cardBg,
          border: themeMode === id ? `2px solid ${accentColor}` : `1px solid ${currentColors.border}`,
          borderRadius: "10px",
          transition: "all 0.2s ease",
          ...glassStyle
        }}
      >
        <div className="fs-3 mb-2" style={{ color: themeMode === id ? accentColor : currentColors.textSecondary }}>{icon}</div>
        <h6 className="fw-bold mb-1" style={{ color: currentColors.textPrimary, fontSize: '0.85rem' }}>{title}</h6>
        <p style={{ color: currentColors.textSecondary, fontSize: '0.7rem', lineHeight: '1.3' }} className="mb-0 px-1">{desc}</p>
        {themeMode === id && <div className="mt-2 fw-bold" style={{ color: accentColor, fontSize: '0.65rem' }}><FiCheck className="me-1"/> ACTIVE</div>}
      </div>
    </div>
  );

  return (
    <>
      {/* THE NUCLEAR CSS OPTION: 
        This <style> tag forcefully injects !important rules into the browser. 
        It guarantees that if isLight is true, the background WILL be light grey (#f4f5f8), 
        overriding any conflicting global CSS or Context bugs.
      */}
      <style>
        {`
          body {
            background-color: ${isLight ? '#f4f5f8' : currentColors.appBg} !important;
            margin: 0;
            min-height: 100vh;
          }
          .settings-page-wrapper {
            background: ${isLight ? '#f4f5f8' : currentColors.appBg} !important;
          }
          .settings-main-area {
            background: ${isLight ? '#f4f5f8' : (currentColors.mainGradient || 'transparent')} !important;
          }
        `}
      </style>

      <div className="settings-page-wrapper d-flex flex-column min-vh-100 w-100">
        
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="d-flex flex-grow-1 w-100">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          
          <main
            className={`settings-main-area main-content flex-grow-1 d-flex flex-column ${collapsed ? "sidebar-collapsed" : ""}`}
            style={{
              backdropFilter: actualTheme === "frost" ? "blur(10px)" : "none",
            }}
          >
            <div className="container-fluid pt-5 pb-4 mt-4 d-flex justify-content-center">
              <div className="w-100" style={{ maxWidth: "650px" }}>
                
                {/* PAGE HEADER */}
                <header className="mb-4">
                  <div className="d-flex align-items-center mb-1">
                    <div className="p-2 rounded me-3 d-flex align-items-center justify-content-center shadow-sm" style={{ background: accentColor, width: '38px', height: '38px' }}>
                      <FiCpu className="text-white" size={20} />
                    </div>
                    <h3 className="fw-bold mb-0" style={{ color: currentColors.textPrimary, fontSize: '1.4rem' }}>Control Center</h3>
                  </div>
                  <p style={{ color: currentColors.textSecondary, fontSize: '0.9rem' }} className="ms-5 opacity-75">Configure visual interface and typography preferences.</p>
                </header>

                {/* APPEARANCE & TYPOGRAPHY SECTION */}
                <div className="card border-0 shadow-sm" style={{ backgroundColor: currentColors.cardBg, borderRadius: '12px', ...glassStyle }}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: currentColors.textPrimary, fontSize: '1rem' }}>
                      <FiMonitor className="me-2" style={{ color: accentColor }} /> Visual Interface
                    </h6>
                    
                    {/* Theme Selection */}
                    <div className="row g-3 mb-4">
                      <ThemeOption id="dark" icon={<FiMoon />} title="Midnight" desc="Pro dark environment" />
                      <ThemeOption id="light" icon={<FiSun />} title="Daylight" desc="High contrast light" />
                      <ThemeOption id="frost" icon={<FiLayers />} title="Frost UI" desc="Modern Glassmorphism" />
                    </div>

                    <h6 className="fw-bold mb-3 d-flex align-items-center pt-2 border-top" style={{ color: currentColors.textPrimary, fontSize: '1rem', borderColor: currentColors.border }}>
                      <FiType className="me-2 mt-3" style={{ color: accentColor }} /> <span className="mt-3">Typography Scale</span>
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
                          className="btn flex-fill py-2 fw-bold shadow-none"
                          style={{
                            backgroundColor: fontSize === f.size ? accentColor : (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)'),
                            color: fontSize === f.size ? "#fff" : currentColors.textPrimary,
                            border: `1px solid ${fontSize === f.size ? accentColor : currentColors.border}`,
                            borderRadius: "8px",
                            fontSize: '0.85rem',
                            transition: "0.2s"
                          }}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-auto">
              <Footer />
            </div>

          </main>
        </div>
      </div>
    </>
  );
};

export default Settings;