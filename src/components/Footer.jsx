import React from 'react';
import { Shield } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTheme } from '../context/ThemeContext'; 

const Footer = () => {
  const { currentColors } = useTheme();

  return (
    <footer 
      className="py-4 mt-auto" // mt-auto pushes footer to bottom of flex container
      style={{ 
        backgroundColor: currentColors.appBg, 
        color: currentColors.textPrimary, 
        borderTop: `1px solid ${currentColors.border}`, 
        transition: "background-color 0.4s ease",
        width: "100%"
      }}
    >
      <div className="container-fluid px-4">
        <div className="row mb-3 text-start">
          
          {/* Brand & Admin Info (Matches image_9c995e.png) */}
          <div className="col-lg-5 col-md-6 mb-4">
            <h6 className="fw-bold d-flex align-items-center mb-2 fs-5">
              <Shield className="me-2" size={24} style={{ color: "#7c3aed" }} />
              FraudShield
            </h6>
            <p className="mb-3 opacity-75" style={{ fontSize: "0.8rem", lineHeight: "1.4", maxWidth: "90%" }}>
              Internal AML & Risk Monitoring System. Property of FraudGuard Bank Information Security.
            </p>
            
            <div className="p-2 rounded border border-primary border-opacity-50" 
                 style={{ backgroundColor: currentColors.cardBg, maxWidth: "300px" }}>
              <p className="text-uppercase fw-bold mb-0" style={{ fontSize: "0.6rem", letterSpacing: "0.5px" }}>System Administrator</p>
              <div className="d-flex align-items-baseline gap-2 mt-1">
                <span className="fw-bold" style={{ fontSize: "0.85rem" }}>Svarupa Kadam</span>
                <span className="opacity-75" style={{ fontSize: "0.75rem" }}>| Investigator</span>
              </div>
            </div>
          </div>

          {/* Rules Engine Column */}
          <div className="col-lg-3 col-md-3 col-6 mb-3">
            <h6 className="fw-bold mb-2" style={{ fontSize: "0.9rem" }}>Rules Engine</h6>
            <ul className="list-unstyled mb-0 opacity-75" style={{ fontSize: "0.8rem" }}>
              <li className="mb-1">Scenario Config</li>
              <li className="mb-1">DSL Expressions</li>
              <li className="mb-1">Thresholds</li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="col-lg-4 col-md-3 col-6 mb-3">
            <h6 className="fw-bold mb-2" style={{ fontSize: "0.9rem" }}>Support</h6>
            <p className="mb-0 opacity-75" style={{ fontSize: "0.8rem" }}>support@fraudshield.com</p>
            <p className="mb-0 opacity-75" style={{ fontSize: "0.8rem" }}>+91 98765 43210</p>
          </div>
        </div>

        <div className="text-center pt-3 mt-2 border-top border-white border-opacity-10">
          <p className="mb-0 opacity-50" style={{ fontSize: "0.75rem" }}>
            © 2026 FraudShield Bank. Confidential & Proprietary.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;