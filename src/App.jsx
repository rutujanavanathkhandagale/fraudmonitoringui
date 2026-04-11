// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useTheme, ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Customer
import RegisterPage from "./pages/Customer/RegisterPage"; 
import LoginPage from "./pages/Customer/LoginPage";
import CustSidebar from "./components/Customer/CustSidebar";
import CusDashboard from "./components/Customer/cusdashboard";
import CustomerOnboardingForm from "./pages/Customer/CustomerOnboardingForm";
import CustomerProfile from "./pages/Customer/CustomerProfile";
import AboutPage from "./pages/Customer/AboutPage";
import Notification from "./pages/Customer/Notification";

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
import ComplianceSidebar from "./components/Compliance/Sidebar";
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

import AuthGuard from "./guards/AuthGuard";
import RoleGuard from "./guards/RoleGuard";
import "./App.css";

// --- Layout Wrapper ---
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
  const [notifications, setNotifications] = useState([]);

  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/settings" element={<Settings />} />


            {/* Customer Module */}
            <Route element={<DashboardWrapper SidebarComponent={CustSidebar} />}>
              <Route
                path="/customer/dashboard/:id"
                element={
                  <AuthGuard>
                    <RoleGuard>
                      <CusDashboard />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/fill-details"
                element={
                  <AuthGuard>
                    <RoleGuard>
                      <CustomerOnboardingForm />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <AuthGuard>
                    <RoleGuard>
                      <CustomerProfile />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/notification/:id"
                element={
                  <AuthGuard>
                    <RoleGuard>
                      <Notification
                        notifications={notifications}
                        setNotifications={setNotifications}
                      />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route path="/about" element={<AboutPage />} />
            </Route>

            {/* Public Landing Page */}
            <Route path="/" element={<Home />} />

            {/* Rule Module */}
            <Route element={<DashboardWrapper SidebarComponent={RuleSidebar} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scenarios" element={<ScenarioPage />} />
              <Route path="/detection-rules" element={<DetectionRulePage />} />
            </Route>

            {/* Investigator Module */}
            <Route element={<DashboardWrapper SidebarComponent={InvestigatorSidebar} />}>
              <Route path="/Idashboard" element={<InvestigatorDashboard />} />
              <Route path="/transaction" element={<Transactions />} />
              <Route path="/risk" element={<RiskScoring />} />
            </Route>

            {/* Compliance Module */}
            <Route element={<DashboardWrapper SidebarComponent={ComplianceSidebar} />}>
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
