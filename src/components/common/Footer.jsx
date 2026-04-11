import React from 'react';
import { FiShield, FiMail, FiGlobe, FiLock } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { currentColors } = useTheme();

  return (
    <footer 
      className="mt-auto py-4" 
      style={{ 
        backgroundColor: currentColors.appBg, 
        color: currentColors.textPrimary, 
        borderTop: `1px solid ${currentColors.border}`,
        transition: "background-color 0.4s ease" 
      }}
    >
      <div className="container-fluid px-5">
        <div className="row justify-content-between">
          
          {/* 1. BRAND & DESCRIPTION */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="d-flex align-items-center mb-3">
              <FiShield className="me-2" style={{ color: "#d400ff", fontSize: "1.5rem" }} />
              <h5 className="mb-0 fw-bold">FraudShield</h5>
            </div>
            <p style={{ color: currentColors.textSecondary, fontSize: "0.85rem", lineHeight: "1.6", maxWidth: "300px" }}>
              Advanced AI-driven fraud detection and real-time monitoring to secure your financial ecosystem.
            </p>
          </div>

          {/* 2. QUICK LINKS (Standard for all sites) */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold mb-3" style={{ fontSize: "0.9rem" }}>Company</h6>
            <ul className="list-unstyled" style={{ fontSize: "0.8rem" }}>
              <li className="mb-2"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>About Us</a></li>
              <li className="mb-2"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>Contact Support</a></li>
              <li className="mb-2"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>System Status</a></li>
            </ul>
          </div>

          {/* 3. LEGAL & SECURITY (Standard for all sites) */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold mb-3" style={{ fontSize: "0.9rem" }}>Legal</h6>
            <ul className="list-unstyled" style={{ fontSize: "0.8rem" }}>
              <li className="mb-2"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>Privacy Policy</a></li>
              <li className="mb-2"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>Terms of Service</a></li>
              <li className="mb-2"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>Security Policy</a></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM STRIP */}
        <hr className="my-4" style={{ borderColor: currentColors.border, opacity: 0.1 }} />
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-0" style={{ color: currentColors.textSecondary, fontSize: "0.75rem" }}>
            © 2026 FraudShield Bank. All Rights Reserved.
          </p>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <FiLock title="Secure Connection" style={{ color: currentColors.textSecondary, cursor: 'help' }} />
            <FiGlobe title="Global Access" style={{ color: currentColors.textSecondary, cursor: 'help' }} />
            <FiMail title="Contact Support" style={{ color: currentColors.textSecondary, cursor: 'help' }} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;