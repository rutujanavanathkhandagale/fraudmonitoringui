import React, { useState, useEffect } from "react";
import { ShieldCheck, Zap, CheckCircle, Cpu, BarChart3 } from "lucide-react";
 
import { getAllScenarios } from "../../services/Rule/scenarioService";
import { getAllDetectionRules } from "../../services/Rule/detectionRuleService";
 
import "../../styles/Rule/Dashboard.css";
 
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalScenarios: 0,
    activeScenarios: 0,
    totalRules: 0,
    activeRules: 0,
    domainData: []
  });
  const [isSyncing, setIsSyncing] = useState(false);
 
  const fetchStats = async () => {
    setIsSyncing(true);
    try {
      const [scenarios, rules] = await Promise.all([
        getAllScenarios(),
        getAllDetectionRules()
      ]);
 
      const domains = scenarios.reduce((acc, curr) => {
        const domain = curr.riskDomain || 'General';
        acc[domain] = (acc[domain] || 0) + 1;
        return acc;
      }, {});
 
      setStats({
        totalScenarios: scenarios?.length || 0,
        activeScenarios: scenarios?.filter(s => s.status?.toLowerCase() === 'active').length || 0,
        totalRules: rules?.length || 0,
        activeRules: rules?.filter(r => r.status?.toLowerCase() === 'active').length || 0,
        domainData: Object.entries(domains).map(([name, count]) => ({ name, count }))
      });
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  };
 
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);
 
  return (
    <div className="container-fluid dashboard-container p-4 p-md-5 text-start">
     
      <div className="row mb-5">
        <div className="col-12">
          <div className="glass-panel p-5 rounded-4 border border-white border-opacity-10 d-flex align-items-center flex-wrap flex-md-nowrap">
            <div className="module-image-container me-md-5 mb-4 mb-md-0">
               <div className="module-illustration shadow-lg d-flex align-items-center justify-content-center" style={{ width: '280px', height: '180px' }}>
                  <Cpu size={90} className="text-purple-light opacity-75" />
               </div>
            </div>
            <div className="module-text">
              <p className="text-white-50 lh-lg mb-0 fs-5">
                FraudShield’s core intelligence is driven by this module, which serves as the central
                configuration engine for the entire system. It empowers Risk Modelers and Rule Authors
                to design, manage, and version the detection logic used to monitor transactions in real time.
                By defining Scenarios and authoring specific Detection Rules, this module enables the
                system to evaluate transaction events against complex behavioral profiles and custom
                thresholds.
              </p>
            </div>
          </div>
        </div>
      </div>
 
      <div className="row g-4 mb-5">
        <div className="col-6">
          <div className="kpi-card p-4 py-5 rounded-4 border-start-blue shadow-sm">
            <div className="d-flex justify-content-between">
              <div>
                <p className="text-white-50 fs-6 mb-2">Total Scenarios</p>
                <h1 className="text-white fw-bold mb-0 display-5">{stats.totalScenarios}</h1>
              </div>
              <div className="kpi-icon blue" style={{ width: '64px', height: '64px' }}>
                <ShieldCheck size={32} />
              </div>
            </div>
            <div className="mt-4 text-success fs-6 fw-bold">
              <CheckCircle size={18} className="me-2" /> {stats.activeScenarios} Active Scenarios
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="kpi-card p-4 py-5 rounded-4 border-start-green shadow-sm">
            <div className="d-flex justify-content-between">
              <div>
                <p className="text-white-50 fs-6 mb-2">Total Detection Rules</p>
                <h1 className="text-white fw-bold mb-0 display-5">{stats.totalRules}</h1>
              </div>
              <div className="kpi-icon green" style={{ width: '64px', height: '64px' }}>
                <Zap size={32} />
              </div>
            </div>
            <div className="mt-4 text-success fs-6 fw-bold">
              <CheckCircle size={18} className="me-2" /> {stats.activeRules} Active Rules
            </div>
          </div>
        </div>
      </div>
 
      <div className="glass-panel p-5 rounded-4 border border-white border-opacity-10">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2">
          <h4 className="text-white fw-bold mb-0">Risk Domain Distribution</h4>
          <BarChart3 size={24} className="text-white-50 opacity-50" />
        </div>
       
        <div className="domain-strict-grid">
          {stats.domainData.map((domain, index) => (
            <div key={index} className="domain-item-box py-4 px-4 rounded-4 border border-white border-opacity-5 d-flex flex-column justify-content-center" style={{ minHeight: "140px" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="text-white fw-bold fs-5">{domain.name}</span>
                <span className="badge bg-purple-badge px-3 py-2 fs-6">
                  {domain.count} Scenarios
                </span>
              </div>
              <div className="progress bg-dark-purple rounded-pill" style={{ height: '14px' }}>
                <div
                  className="progress-bar bg-purple-gradient rounded-pill"
                  style={{ width: `${stats.totalScenarios > 0 ? (domain.count / stats.totalScenarios) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default Dashboard;