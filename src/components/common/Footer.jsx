import React from 'react';

import { FiShield } from 'react-icons/fi';

import 'bootstrap/dist/css/bootstrap.min.css';

import { useTheme } from '../../context/ThemeContext'; // <-- IMPORT THEME



const Footer = () => {

  const { currentColors } = useTheme(); // <-- GET DYNAMIC COLORS



  return (

    <footer className="mt-auto py-4" style={{ backgroundColor: currentColors.appBg, color: currentColors.textPrimary, borderTop: `1px solid ${currentColors.border}`, transition: "background-color 0.4s ease" }}>

      <div className="container-fluid px-4">

       

        <div className="row mb-3">

         

          {/* Column 1: Brand & Personal Info */}

          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">

            <h6 className="fw-bold d-flex align-items-center mb-2 fs-5" style={{ color: currentColors.textPrimary }}>

              <FiShield className="me-2" style={{ color: "#d400ff" }} />

              FraudGuard Bank

            </h6>

            <p className="mb-3" style={{ color: currentColors.textSecondary, fontSize: "0.8rem", lineHeight: "1.4", maxWidth: "90%" }}>

              FraudShield Internal AML & Risk Monitoring System. Property of FraudGuard Bank Information Security.

            </p>

           

            {/* Compressed Personal Info Card */}

            <div className="p-2 rounded border-start border-2 border-primary" style={{ backgroundColor: currentColors.cardBg, maxWidth: "90%", border: `1px solid ${currentColors.border}` }}>

              <p className="text-uppercase fw-bold mb-0" style={{ color: currentColors.textPrimary, fontSize: "0.65rem", letterSpacing: "0.5px" }}>System Administrator</p>

              <div className="d-flex align-items-baseline gap-2 mt-1">

                <span className="fw-bold" style={{ color: currentColors.textPrimary, fontSize: "0.85rem" }}>Litika Gaikwad</span>

                <span style={{ color: currentColors.textSecondary, fontSize: "0.75rem" }}>| Fraud Investigator</span>

              </div>

              <p className="mb-0 mt-1" style={{ color: currentColors.textSecondary, fontSize: "0.75rem" }}></p>

            </div>

          </div>



          {/* Column 2: Modules */}

          <div className="col-lg-2 col-md-3 col-sm-6 mb-3 mb-md-0">

            <h6 className="fw-bold mb-2" style={{ color: currentColors.textPrimary, fontSize: "0.9rem" }}>Modules</h6>

            <ul className="list-unstyled mb-0" style={{ fontSize: "0.8rem" }}>

              <li className="mb-1"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>Transaction Scoring</a></li>

              <li className="mb-1"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>Case Management</a></li>

              <li className="mb-1"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>Watchlists</a></li>

              <li className="mb-1"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>Regulatory Reporting</a></li>

            </ul>

          </div>



          {/* Column 3: Staff Resources */}

          <div className="col-lg-3 col-md-3 col-sm-6 mb-3 mb-md-0">

            <h6 className="fw-bold mb-2" style={{ color: currentColors.textPrimary, fontSize: "0.9rem" }}>Staff Resources</h6>

            <ul className="list-unstyled mb-0" style={{ fontSize: "0.8rem" }}>

              <li className="mb-1"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>User Manuals</a></li>

              <li className="mb-1"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>Rules Engine Guide</a></li>

              <li className="mb-1"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>System Status</a></li>

              <li className="mb-1"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>IT Support</a></li>

            </ul>

          </div>



          {/* Column 4: Compliance */}

          <div className="col-lg-3 col-md-12 mb-3 mb-md-0">

            <h6 className="fw-bold mb-2" style={{ color: currentColors.textPrimary, fontSize: "0.9rem" }}>Compliance</h6>

            <ul className="list-unstyled mb-0" style={{ fontSize: "0.8rem" }}>

              <li className="mb-1"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>Audit Logs</a></li>

              <li className="mb-1"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>Access Policy</a></li>

              <li className="mb-1"><a href="#!" className="text-decoration-none" style={{ color: currentColors.textSecondary }}>Data Privacy Framework</a></li>

            </ul>

          </div>

        </div>



        {/* Bottom Copyright Bar */}

        <div className="text-center pt-3 mt-2" style={{ borderTop: `1px solid ${currentColors.border}` }}>

          <p className="mb-0" style={{ color: currentColors.textSecondary, fontSize: "0.75rem" }}>

            © 2026 FraudGuard Bank. Confidential & Proprietary.

          </p>

        </div>

      </div>

    </footer>

  );

};



export default Footer;