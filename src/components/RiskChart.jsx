import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Shield, Activity, TrendingUp } from 'lucide-react';

export function RiskChart() {
  const riskData = [
    { name: 'Low Risk (0-39)', value: 35, color: '#10b981' }, // Bootstrap success approx
    { name: 'Medium Risk (40-59)', value: 28, color: '#f59e0b' }, // Bootstrap warning approx
    { name: 'High Risk (60-79)', value: 22, color: '#f97316' }, // Orange
    { name: 'Critical (80+)', value: 15, color: '#ef4444' } // Bootstrap danger approx
  ];

  // Mapped Tailwind colors to Bootstrap utility classes
  const stats = [
    { label: 'Total Transactions', value: '1,247', icon: Activity, textColor: 'text-primary', bgClass: 'bg-primary' },
    { label: 'Flagged Today', value: '47', icon: Shield, textColor: 'text-warning', bgClass: 'bg-warning' },
    { label: 'Blocked', value: '12', icon: TrendingUp, textColor: 'text-danger', bgClass: 'bg-danger' }
  ];

  return (
    <div className="d-flex flex-column gap-4">
      
      {/* Risk Distribution Chart */}
      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="card-header border-0 px-4 py-3" style={{ background: 'linear-gradient(to right, #9333ea, #7e22ce)' }}>
          <h5 className="fw-bold text-white mb-0">Risk Distribution</h5>
          <small className="text-white opacity-75">Transaction risk breakdown</small>
        </div>
        <div className="card-body p-4">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="d-flex flex-column gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="card border-0 shadow-sm p-3"
              style={{ transition: 'box-shadow 0.2s ease-in-out' }}
              onMouseEnter={(e) => e.currentTarget.classList.add('shadow')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('shadow')}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-secondary small mb-1">{stat.label}</p>
                  <p className={`fs-3 fw-bold mb-0 ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`${stat.bgClass} bg-opacity-10 p-2 rounded-3 d-flex align-items-center justify-content-center`}>
                  <Icon size={32} className={stat.textColor} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert Panel */}
      <div 
        className="card border-0 shadow-sm p-4" 
        style={{ 
          background: 'linear-gradient(to bottom right, #fffbeb, #fff7ed)', 
          borderLeft: '4px solid #f97316 !important' // Orange left border
        }}
      >
        <div className="d-flex align-items-start">
          <div className="flex-shrink-0">
            <Shield size={24} style={{ color: '#ea580c' }} />
          </div>
          <div className="ms-3">
            <h6 className="fw-bold mb-2" style={{ color: '#7c2d12' }}>Active Alerts</h6>
            <div className="small mb-0" style={{ color: '#9a3412' }}>
              <ul className="mb-0 ps-3">
                <li className="mb-1">3 unusual location patterns detected</li>
                <li className="mb-1">5 high-value wire transfers pending</li>
                <li>2 velocity rule violations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}