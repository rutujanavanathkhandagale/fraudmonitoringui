import React, { useState, useEffect } from "react";
import { ShieldCheck, Zap, CheckCircle, RefreshCw, Cpu, BarChart3 } from "lucide-react";

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
      {/* 1. Header */}
      <header className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="text-white fw-bold h2 mb-1"> Rules, Scenarios & Thresholds Module</h1>
          <p className="text-white-50">Live monitoring of FraudShield detection performance.</p>
        </div>
        <div className={`sync-indicator ${isSyncing ? 'spinning' : ''}`}>
          <RefreshCw size={22} className="text-purple-light" />
        </div>
      </header>

      {/* 2. TOP SECTION: Module Description (Like your screenshot) */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="glass-panel p-4 rounded-4 border border-white border-opacity-10 d-flex align-items-center flex-wrap flex-md-nowrap">
            <div className="module-image-container me-md-5 mb-4 mb-md-0">
               <div className="module-illustration shadow-lg d-flex align-items-center justify-content-center">
                  <Cpu size={70} className="text-purple-light opacity-75" />
               </div>
            </div>
            <div className="module-text">
              {/*<h4 className="text-white fw-bold mb-3">Module 4.5: Rules, Scenarios & Thresholds</h4>*/}
              <p className="text-white-50 lh-lg mb-0">
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

      {/* 3. MIDDLE SECTION: KPI Cards */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-6">
          <div className="kpi-card p-4 rounded-4 border-start-blue shadow-sm">
            <div className="d-flex justify-content-between">
              <div>
                <p className="text-white-50 small mb-1">Total Scenarios</p>
                <h2 className="text-white fw-bold mb-0">{stats.totalScenarios}</h2>
              </div>
              <div className="kpi-icon blue"><ShieldCheck size={24} /></div>
            </div>
            <div className="mt-3 text-success small fw-bold">
              <CheckCircle size={14} className="me-2" /> {stats.activeScenarios} Active Scenarios
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="kpi-card p-4 rounded-4 border-start-green shadow-sm">
            <div className="d-flex justify-content-between">
              <div>
                <p className="text-white-50 small mb-1">Total Detection Rules</p>
                <h2 className="text-white fw-bold mb-0">{stats.totalRules}</h2>
              </div>
              <div className="kpi-icon green"><Zap size={24} /></div>
            </div>
            <div className="mt-3 text-success small fw-bold">
              <CheckCircle size={14} className="me-2" /> {stats.activeRules} Active Rules
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: Risk Domain Distribution */}
      <div className="glass-panel p-4 rounded-4 border border-white border-opacity-10">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="text-white fw-bold mb-0">Risk Domain Distribution</h5>
          <BarChart3 size={20} className="text-white-50 opacity-50" />
        </div>
        <div className="row g-4">
          {stats.domainData.map((domain, index) => (
            <div key={index} className="col-12 col-md-4">
              <div className="domain-item-box p-3 rounded-3 border border-white border-opacity-5">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-white small fw-bold">{domain.name}</span>
                  <span className="badge bg-purple-badge">{domain.count} Scenarios</span>
                </div>
                <div className="progress bg-dark-purple" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar bg-purple-gradient" 
                    style={{ width: `${(domain.count / stats.totalScenarios) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;