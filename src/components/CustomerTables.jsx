import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export function CustomerTables({ searchQuery }) {
  // Removed TypeScript <Transaction[]> definition
  const [allCustomers] = useState([
    {
      id: 'TXN001',
      customerId: 'C1001',
      customerName: 'John Smith',
      amount: 1250.00,
      type: 'Purchase',
      location: 'New York, USA',
      timestamp: '2026-01-30 14:23',
      riskScore: 15,
      status: 'approved',
      flags: []
    },
    {
      id: 'TXN002',
      customerId: 'C1002',
      customerName: 'Sarah Johnson',
      amount: 450.00,
      type: 'ATM Withdrawal',
      location: 'Los Angeles, USA',
      timestamp: '2026-01-30 14:18',
      riskScore: 22,
      status: 'approved',
      flags: []
    },
    {
      id: 'TXN003',
      customerId: 'C1003',
      customerName: 'Michael Chen',
      amount: 8900.00,
      type: 'Wire Transfer',
      location: 'Singapore',
      timestamp: '2026-01-30 14:15',
      riskScore: 68,
      status: 'flagged',
      flags: ['High Amount', 'International']
    },
    {
      id: 'TXN004',
      customerId: 'C1004',
      customerName: 'Emma Williams',
      amount: 320.00,
      type: 'Online Purchase',
      location: 'Chicago, USA',
      timestamp: '2026-01-30 14:10',
      riskScore: 18,
      status: 'approved',
      flags: []
    },
    {
      id: 'TXN005',
      customerId: 'C1005',
      customerName: 'David Martinez',
      amount: 12000.00,
      type: 'Wire Transfer',
      location: 'Moscow, Russia',
      timestamp: '2026-01-30 14:05',
      riskScore: 92,
      status: 'blocked',
      flags: ['High Amount', 'High Risk Country', 'Unusual Pattern']
    },
    {
      id: 'TXN006',
      customerId: 'C1006',
      customerName: 'Lisa Anderson',
      amount: 680.00,
      type: 'Purchase',
      location: 'Miami, USA',
      timestamp: '2026-01-30 13:58',
      riskScore: 25,
      status: 'approved',
      flags: []
    },
    {
      id: 'TXN007',
      customerId: 'C1007',
      customerName: 'Robert Taylor',
      amount: 5400.00,
      type: 'Cash Deposit',
      location: 'Las Vegas, USA',
      timestamp: '2026-01-30 13:45',
      riskScore: 71,
      status: 'flagged',
      flags: ['Large Cash', 'Rapid Succession']
    },
    {
      id: 'TXN008',
      customerId: 'C1008',
      customerName: 'Jennifer Lee',
      amount: 195.00,
      type: 'Online Purchase',
      location: 'Seattle, USA',
      timestamp: '2026-01-30 13:42',
      riskScore: 12,
      status: 'approved',
      flags: []
    }
  ]);

  const suspiciousCustomers = allCustomers.filter(t => t.riskScore >= 65);

  const filteredAllCustomers = allCustomers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuspicious = suspiciousCustomers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mapped Tailwind colors to Bootstrap utility classes
  const getRiskColor = (score) => {
    if (score >= 80) return 'text-danger bg-danger bg-opacity-10 border border-danger';
    if (score >= 60) return 'text-warning bg-warning bg-opacity-10 border border-warning';
    if (score >= 40) return 'text-dark bg-warning bg-opacity-10 border border-warning';
    return 'text-success bg-success bg-opacity-10 border border-success';
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'text-success bg-success bg-opacity-10 border border-success',
      flagged: 'text-warning bg-warning bg-opacity-10 border border-warning',
      blocked: 'text-danger bg-danger bg-opacity-10 border border-danger'
    };
    return styles[status] || styles.approved;
  };

  return (
    <div className="d-flex flex-column gap-4">
      
      {/* All Customers Table */}
      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="card-header border-0 px-4 py-3" style={{ background: 'linear-gradient(to right, #2563eb, #1d4ed8)' }}>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="mb-0 text-white d-flex align-items-center fw-bold">
              <DollarSign className="me-2" size={24} />
              All Customer Transactions
            </h5>
            <span className="badge rounded-pill bg-white text-primary px-3 py-2">
              {filteredAllCustomers.length} transactions
            </span>
          </div>
        </div>
        
        <div className="table-responsive mb-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Transaction ID</th>
                <th className="px-4 py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Customer</th>
                <th className="px-4 py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Amount</th>
                <th className="px-4 py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Type</th>
                <th className="px-4 py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Location</th>
                <th className="px-4 py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Risk Score</th>
                <th className="px-4 py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllCustomers.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-4 py-3 text-nowrap fw-medium text-dark">
                    {transaction.id}
                  </td>
                  <td className="px-4 py-3 text-nowrap">
                    <div>
                      <div className="fw-medium text-dark">{transaction.customerName}</div>
                      <div className="text-secondary small">{transaction.customerId}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-nowrap fw-bold text-dark">
                    ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-nowrap text-secondary">
                    {transaction.type}
                  </td>
                  <td className="px-4 py-3 text-nowrap text-secondary">
                    {transaction.location}
                  </td>
                  <td className="px-4 py-3 text-nowrap">
                    <span className={`badge rounded-pill d-inline-flex align-items-center ${getRiskColor(transaction.riskScore)}`}>
                      {transaction.riskScore}
                      {transaction.riskScore >= 60 ? (
                        <TrendingUp className="ms-1" size={14} />
                      ) : (
                        <TrendingDown className="ms-1" size={14} />
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-nowrap">
                    <span className={`badge rounded-pill text-uppercase ${getStatusBadge(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suspicious Customers Table */}
      <div className="card shadow-sm overflow-hidden" style={{ border: '2px solid #fecaca' }}>
        <div className="card-header border-0 px-4 py-3" style={{ background: 'linear-gradient(to right, #dc2626, #b91c1c)' }}>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="mb-0 text-white d-flex align-items-center fw-bold">
              <AlertTriangle className="me-2" size={24} />
              Suspicious Transactions (High Risk)
            </h5>
            <span className="badge rounded-pill bg-white text-danger px-3 py-2">
              {filteredSuspicious.length} flagged
            </span>
          </div>
        </div>
        
        <div className="table-responsive mb-0">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ backgroundColor: '#fef2f2' }}>
              <tr>
                <th className="px-4 py-3 text-secondary text-uppercase border-bottom border-danger" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Transaction ID</th>
                <th className="px-4 py-3 text-secondary text-uppercase border-bottom border-danger" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Customer</th>
                <th className="px-4 py-3 text-secondary text-uppercase border-bottom border-danger" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Amount</th>
                <th className="px-4 py-3 text-secondary text-uppercase border-bottom border-danger" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Type</th>
                <th className="px-4 py-3 text-secondary text-uppercase border-bottom border-danger" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Risk Score</th>
                <th className="px-4 py-3 text-secondary text-uppercase border-bottom border-danger" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Flags</th>
                <th className="px-4 py-3 text-secondary text-uppercase border-bottom border-danger" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuspicious.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-4 py-3 text-nowrap fw-medium text-dark">
                    {transaction.id}
                  </td>
                  <td className="px-4 py-3 text-nowrap">
                    <div>
                      <div className="fw-medium text-dark">{transaction.customerName}</div>
                      <div className="text-secondary small">{transaction.customerId}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-nowrap fw-bold text-danger">
                    ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-nowrap text-secondary">
                    {transaction.type}
                  </td>
                  <td className="px-4 py-3 text-nowrap">
                    <span className={`badge rounded-pill d-inline-flex align-items-center fw-bold ${getRiskColor(transaction.riskScore)}`}>
                      {transaction.riskScore}
                      <TrendingUp className="ms-1" size={14} />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex flex-wrap gap-1">
                      {transaction.flags.map((flag, idx) => (
                        <span
                          key={idx}
                          className="badge bg-warning text-dark border border-warning"
                        >
                          {flag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-nowrap small text-secondary">
                    {transaction.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}