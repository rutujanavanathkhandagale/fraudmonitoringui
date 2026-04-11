// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useTheme, ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Investigator
import InvestigatorSidebar from "./components/Investigator/Isidebar";
import Transactions from "./pages/Investigator/Transactions";
import RiskScoring from "./pages/Investigator/RiskScoring";
import InvestigatorDashboard from "./pages/Investigator/IDashboard";

// Rule
import Dashboard from "./pages/Rule/Dashboard";
import ScenarioPage from "./pages/Rule/ScenarioPage";
import RuleSidebar from "./components/Rule/RuleSidebar";
import DetectionRulePage from "./pages/Rule/DetectionRulePage";

// Compliance
import Sidebar from "./components/Compliance/Sidebar";
import CDashboard from "./pages/Compliance/CDashboard";
import KYCVerification from "./pages/Compliance/KYCVerification";
import TransactionPattern from "./pages/Compliance/TransactionPattern";
import WatchlistPageForm from "./pages/Compliance/WatchlistPageForm";
import ControlChecklist from "./pages/Compliance/ControlChecklist";
import RegulatoryReport from "./pages/Compliance/RegulatoryReport";

// Common Pages
import Home from "./pages/Home";
import Settings from "./components/common/Settings";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// --- Layout Wrapper for Rule and Investigator ---
const DashboardWrapper = ({ SidebarComponent }) => {
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();

  if (!theme || !theme.currentColors) {
    return <div style={{ backgroundColor: "transparent", minHeight: "100vh" }} />;
  }
  const { currentColors, actualTheme } = theme;

  return (
    <div style={{ backgroundColor: currentColors.appBg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ display: "flex", flexGrow: 1 }}>
        {SidebarComponent && <SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />}
        <main
          style={{
            flexGrow: 1,
            paddingTop: "75px",
            background: currentColors.mainGradient,
            backdropFilter: actualTheme === "frost" ? "blur(10px)" : "none",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div style={{ flexGrow: 1, padding: "20px" }}>
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. Public Landing Page */}
            <Route path="/" element={<Home />} />

            {/* 2. Rule Module */}
            <Route element={<DashboardWrapper SidebarComponent={RuleSidebar} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scenarios" element={<ScenarioPage />} />
              <Route path="/detection-rules" element={<DetectionRulePage />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* 3. Investigator Module */}
            <Route element={<DashboardWrapper SidebarComponent={InvestigatorSidebar} />}>
              <Route path="/Idashboard" element={<InvestigatorDashboard />} />
              <Route path="/transaction" element={<Transactions />} />
              <Route path="/risk" element={<RiskScoring />} />
            </Route>

            {/* 4. Compliance Module (Uses your specific ComplianceLayout.jsx) */}
            
               <Route element={<DashboardWrapper SidebarComponent={Sidebar} />}>
              <Route path="/Cdashboard" element={<CDashboard />} />
              <Route path="/kyc" element={<KYCVerification />} />
              <Route path="/transaction-pattern" element={<TransactionPattern />} />
              <Route path="/watchlist" element={<WatchlistPageForm />} />
              <Route path="/control-checklist" element={<ControlChecklist />} />
              <Route path="/regulatory-report" element={<RegulatoryReport />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}