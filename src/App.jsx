// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Admin
import ASidebar from "./components/Admin/ASidebar";
import AdminAudit from "./pages/Admin/AdminAudit";
import Role from "./pages/Admin/Role";
import User from "./pages/Admin/User";

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
import KYCNotification from "./pages/Compliance/Notification";
import WatchlistPageForm from "./pages/Compliance/WatchlistPageForm";
import ControlChecklist from "./pages/Compliance/ControlChecklist";
import RegulatoryReport from "./pages/Compliance/RegulatoryReport";

// Common
import Home from "./pages/Home";
import Settings from "./components/common/Settings";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

import AuthGuard from "./guards/AuthGuard";
import RoleGuard from "./guards/RoleGuard";
import "./App.css";

/* ---------------- Layout Wrapper ---------------- */
const DashboardWrapper = ({ SidebarComponent }) => {
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();

  if (!theme || !theme.currentColors) {
    return <div style={{ minHeight: "100vh" }} />;
  }

  const { currentColors, actualTheme } = theme;

  return (
    <div style={{ backgroundColor: currentColors.appBg, minHeight: "100vh" }}>
      <Header collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{ display: "flex" }}>
        {SidebarComponent && (
          <SidebarComponent
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        )}

        <main
          className={`main-content ${collapsed ? "sidebar-collapsed" : ""}`}
          style={{
            background: currentColors.mainGradient,
            backdropFilter:
              actualTheme === "frost" ? "blur(10px)" : "none",
          }}
        >
          <div style={{ padding: "20px" }}>
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

/* ---------------- Main App ---------------- */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
           <Route
  path="/settings"
  element={
    <AuthGuard>
      <Settings />
    </AuthGuard>
  }
/>
            {/* Admin */}
            <Route element={<DashboardWrapper SidebarComponent={ASidebar} />}>
              <Route
                path="/role"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["ADMIN"]}>
                      <Role />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/users"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["ADMIN"]}>
                      <User />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/audit"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["ADMIN"]}>
                      <AdminAudit />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
            </Route>

            {/* Rule (Modeler) */}
            <Route element={<DashboardWrapper SidebarComponent={RuleSidebar} />}>
              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["MODELER"]}>
                      <Dashboard />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/scenarios"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["MODELER"]}>
                      <ScenarioPage />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/detection-rules"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["MODELER"]}>
                      <DetectionRulePage />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
            </Route>

            {/* Investigator */}
            <Route element={<DashboardWrapper SidebarComponent={InvestigatorSidebar} />}>
              <Route
                path="/Idashboard"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["Investigator"]}>
                      <InvestigatorDashboard />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/transaction"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["Investigator"]}>
                      <Transactions />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/risk"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["Analyst"]}>
                      <RiskScoring />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
            </Route>

            {/* Compliance */}
            <Route element={<DashboardWrapper SidebarComponent={ComplianceSidebar} />}>
              <Route
                path="/Cdashboard"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["COMPLIANCE"]}>
                      <CDashboard />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/kyc"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["COMPLIANCE"]}>
                      <KYCVerification />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/transaction-pattern"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["COMPLIANCE"]}>
                      <TransactionPattern />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/watchlist"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["COMPLIANCE"]}>
                      <WatchlistPageForm />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/Notification"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["COMPLIANCE"]}>
                      <KYCNotification />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/control-checklist"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["COMPLIANCE"]}>
                      <ControlChecklist />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
              <Route
                path="/regulatory-report"
                element={
                  <AuthGuard>
                    <RoleGuard allowedRoles={["COMPLIANCE"]}>
                      <RegulatoryReport />
                    </RoleGuard>
                  </AuthGuard>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}