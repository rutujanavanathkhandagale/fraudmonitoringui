import React from 'react';
import { Shield, Mail, Phone, MapPin, Clock } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-auto">
      <div className="container py-5">
        <div className="row gy-4">
          
          {/* Company Info */}
          <div className="col-12 col-md-3">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary p-2 rounded me-2 d-flex align-items-center justify-content-center">
                <Shield size={20} className="text-white" />
              </div>
              <span className="fw-bold fs-5 text-white">SecureBank</span>
            </div>
            <p className="small text-secondary mb-0">
              Advanced fraud detection and prevention system protecting your financial transactions 24/7.
            </p>
          </div>

          {/* Contact Info */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold text-white mb-3">Contact Us</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li className="d-flex align-items-center text-secondary">
                <Phone size={16} className="text-primary me-2 flex-shrink-0" />
                <span>1-800-FRAUD-HELP</span>
              </li>
              <li className="d-flex align-items-center text-secondary">
                <Mail size={16} className="text-primary me-2 flex-shrink-0" />
                <span>fraud@securebank.com</span>
              </li>
              <li className="d-flex align-items-center text-secondary">
                <MapPin size={16} className="text-primary me-2 flex-shrink-0" />
                <span>123 Security Blvd, NY 10001</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li>
                <a href="#" className="text-secondary text-decoration-none">Dashboard</a>
              </li>
              <li>
                <a href="#" className="text-secondary text-decoration-none">Reports</a>
              </li>
              <li>
                <a href="#" className="text-secondary text-decoration-none">Settings</a>
              </li>
              <li>
                <a href="#" className="text-secondary text-decoration-none">Help Center</a>
              </li>
            </ul>
          </div>

          {/* System Status */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold text-white mb-3">System Status</h6>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center">
                {/* Bootstrap uses spinner-grow for pulsing dots */}
                <div className="spinner-grow text-success me-2" style={{ width: '0.5rem', height: '0.5rem' }} role="status">
                  <span className="visually-hidden">Operational</span>
                </div>
                <span className="small text-secondary">All Systems Operational</span>
              </div>
              <div className="d-flex align-items-center small text-secondary">
                <Clock size={16} className="text-primary me-2 flex-shrink-0" />
                <span>Last Update: {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="bg-secondary bg-opacity-25 p-3 rounded">
                <p className="small text-secondary mb-1" style={{ fontSize: '0.75rem' }}>API Response Time</p>
                <p className="fs-5 fw-bold text-success mb-0">42ms</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Footer Bottom */}
        <div className="border-top border-secondary border-opacity-25 mt-5 pt-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary">
            <p className="mb-3 mb-md-0">
              &copy; {currentYear} SecureBank Fraud Detection System. All rights reserved.
            </p>
            <div className="d-flex gap-4">
              <a href="#" className="text-secondary text-decoration-none">Privacy Policy</a>
              <a href="#" className="text-secondary text-decoration-none">Terms of Service</a>
              <a href="#" className="text-secondary text-decoration-none">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}