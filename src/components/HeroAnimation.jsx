import React from 'react';
import { motion } from 'motion/react';
import { Shield, Activity, Users, AlertTriangle, FileText, Database } from 'lucide-react';

export function HeroAnimation() {
  // Replaced Tailwind gradient classes with exact hex-based linear gradients
  const nodes = [
    { icon: Activity, label: 'Live Txn', color: 'linear-gradient(to bottom right, #3b82f6, #06b6d4)' },
    { icon: AlertTriangle, label: 'High Risk Alert', color: 'linear-gradient(to bottom right, #ef4444, #f43f5e)' },
    { icon: Users, label: 'Entity Link', color: 'linear-gradient(to bottom right, #a855f7, #ec4899)' },
    { icon: FileText, label: 'SAR Report', color: 'linear-gradient(to bottom right, #10b981, #14b8a6)' },
    { icon: Database, label: 'KYC Profile', color: 'linear-gradient(to bottom right, #f59e0b, #f97316)' },
  ];

  return (
    <div className="position-relative w-100 d-flex align-items-center justify-content-center overflow-visible" style={{ height: '500px' }}>
      
      {/* CSS for SVG spinning animations */}
      <style>
        {`
          @keyframes spinSlow {
            from { transform: rotate(0deg); transform-origin: center; }
            to { transform: rotate(360deg); transform-origin: center; }
          }
          @keyframes spinSlowReverse {
            from { transform: rotate(360deg); transform-origin: center; }
            to { transform: rotate(0deg); transform-origin: center; }
          }
          .anim-spin-slow { animation: spinSlow 60s linear infinite; }
          .anim-spin-reverse { animation: spinSlowReverse 40s linear infinite; }
        `}
      </style>

      {/* Background radial glow */}
      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
        <div 
          className="rounded-circle" 
          style={{ width: '300px', height: '300px', backgroundColor: 'rgba(147, 51, 234, 0.2)', filter: 'blur(100px)' }} 
        />
      </div>

      {nodes.map((node, index) => {
        const total = nodes.length;
        const angle = (index * (360 / total) * Math.PI) / 180;
        const radius = 180; // Distance from center
        
        return (
          <motion.div
            key={index}
            className="position-absolute d-flex align-items-center shadow-lg rounded-3 p-3"
            style={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              backdropFilter: 'blur(16px)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              gap: '0.75rem',
              zIndex: 20
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: [
                Math.cos(angle) * radius,
                Math.cos(angle + Math.PI / 4) * radius,
                Math.cos(angle + Math.PI / 2) * radius,
                Math.cos(angle + (3 * Math.PI) / 4) * radius,
                Math.cos(angle + Math.PI) * radius,
                Math.cos(angle + (5 * Math.PI) / 4) * radius,
                Math.cos(angle + (3 * Math.PI) / 2) * radius,
                Math.cos(angle + (7 * Math.PI) / 4) * radius,
                Math.cos(angle) * radius,
              ],
              y: [
                Math.sin(angle) * radius,
                Math.sin(angle + Math.PI / 4) * radius,
                Math.sin(angle + Math.PI / 2) * radius,
                Math.sin(angle + (3 * Math.PI) / 4) * radius,
                Math.sin(angle + Math.PI) * radius,
                Math.sin(angle + (5 * Math.PI) / 4) * radius,
                Math.sin(angle + (3 * Math.PI) / 2) * radius,
                Math.sin(angle + (7 * Math.PI) / 4) * radius,
                Math.sin(angle) * radius,
              ],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div 
              className="d-flex align-items-center justify-content-center rounded" 
              style={{ width: '40px', height: '40px', background: node.color, boxShadow: '0 .5rem 1rem rgba(0,0,0,.15)' }}
            >
              <node.icon size={20} className="text-white" />
            </div>
            <div>
              <p className="mb-0 text-white fw-semibold text-nowrap" style={{ fontSize: '0.875rem' }}>{node.label}</p>
              <p className="mb-0 text-secondary" style={{ fontSize: '0.75rem' }}>Processing</p>
            </div>
          </motion.div>
        );
      })}
      
      {/* Center Hub */}
      <div className="position-relative d-flex flex-column align-items-center justify-content-center" style={{ zIndex: 30 }}>
        <div 
          className="rounded-4 p-4 text-center border" 
          style={{ 
            background: 'linear-gradient(to bottom right, #7e22ce, #be185d)',
            borderColor: 'rgba(192, 132, 252, 0.3)',
            boxShadow: '0 0 60px -15px rgba(168,85,247,0.5)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <Shield size={64} className="text-white mb-3 mx-auto" />
          <div>
            <p className="text-white fw-bold mb-0" style={{ letterSpacing: '0.2em', fontSize: '1.125rem' }}>FRAUDSHIELD</p>
            <p className="text-uppercase mb-0 mt-1" style={{ color: '#e9d5ff', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Core Engine</p>
          </div>
        </div>
      </div>
      
      {/* Connecting lines - SVG in background */}
      <svg className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none opacity-50" style={{ zIndex: 10 }}>
        <circle cx="50%" cy="50%" r="180" fill="none" stroke="url(#circle-grad)" strokeWidth="1.5" strokeDasharray="4 6" className="anim-spin-slow" />
        <circle cx="50%" cy="50%" r="240" fill="none" stroke="url(#circle-grad)" strokeWidth="1" strokeDasharray="2 10" className="anim-spin-reverse" />
        <defs>
          <linearGradient id="circle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}