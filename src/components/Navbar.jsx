import React, { useState } from 'react';
import { Search, Shield, Info } from 'lucide-react';

export function Navbar({ searchQuery, onSearchChange }) {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <nav className="shadow-lg text-white" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="container px-3">
          <div className="d-flex align-items-center justify-content-between" style={{ height: '4rem' }}>
            
            {/* Logo and Brand */}
            <div className="d-flex align-items-center gap-3">
              <div className="bg-white p-2 rounded">
                <Shield size={24} style={{ color: '#1e3a8a' }} />
              </div>
              <div className="d-flex flex-column justify-content-center">
                <div className="fw-bold fs-5 lh-1 text-white">SecureBank</div>
                <div className="small mt-1" style={{ color: '#bfdbfe', fontSize: '0.75rem' }}>
                  Fraud Detection System
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-grow-1 mx-3 mx-md-5" style={{ maxWidth: '28rem' }}>
              <div className="position-relative">
                <Search 
                  className="position-absolute top-50 translate-middle-y" 
                  size={16} 
                  style={{ left: '12px', color: '#9ca3af' }} 
                />
                <input
                  type="text"
                  placeholder="Search customers, transactions..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="form-control text-white border-0 shadow-none"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                    paddingLeft: '2.5rem' 
                  }}
                />
              </div>
            </div>

            {/* About Button */}
            <button
              onClick={() => setShowAbout(!showAbout)}
              className="btn text-white d-flex align-items-center gap-2 px-3 border-0"
              style={{ backgroundColor: showAbout ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = showAbout ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
            >
              <Info size={20} />
              <span className="d-none d-sm-inline">About</span>
            </button>
            
          </div>
        </div>
      </nav>

      {/* About Modal/Panel */}
      {showAbout && (
        <div className="border-bottom" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
          <div className="container px-3 py-4 py-md-5">
            <div style={{ maxWidth: '48rem' }}>
              <h3 className="fw-bold fs-5 mb-3" style={{ color: '#1e3a8a' }}>
                About Fraud Detection System
              </h3>
              <p className="text-secondary mb-4">
                Our advanced fraud detection system uses real-time transaction monitoring,
                behavioral analysis, and machine learning algorithms to identify and prevent
                fraudulent activities.
              </p>
              
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                  <div className="card h-100 border-0 shadow-sm p-3">
                    <h6 className="fw-bold mb-2" style={{ color: '#1e3a8a' }}>Rule-Based Detection</h6>
                    <p className="small text-secondary mb-0">
                      Configurable rules to flag suspicious patterns
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="card h-100 border-0 shadow-sm p-3">
                    <h6 className="fw-bold mb-2" style={{ color: '#1e3a8a' }}>Behavioral Analysis</h6>
                    <p className="small text-secondary mb-0">
                      Monitors deviation from normal customer behavior
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="card h-100 border-0 shadow-sm p-3">
                    <h6 className="fw-bold mb-2" style={{ color: '#1e3a8a' }}>Risk Scoring</h6>
                    <p className="small text-secondary mb-0">
                      AI-powered risk assessment for each transaction
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowAbout(false)}
                className="btn btn-link text-decoration-none fw-medium p-0"
                style={{ color: '#1d4ed8' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}