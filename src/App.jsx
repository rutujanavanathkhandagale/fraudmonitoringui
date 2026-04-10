// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useTheme, ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

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

// Pages
import Home from "./pages/Home";
import Settings from "./components/common/Settings";

// Layout Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// --- General Dashboard Layout ---
const RootLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();

  if (!theme || !theme.currentColors) {
    return <div style={{ background: "#020617", minHeight: "100vh" }} />;
  }
  const { currentColors, actualTheme } = theme;

  return (
    <div style={{ backgroundColor: currentColors.appBg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ display: "flex", flexGrow: 1 }}>
        {/* General sidebar could go here if needed */}
        <main
          style={{
            flexGrow: 1,
            paddingTop: "70px",
            background: currentColors.mainGradient,
            backdropFilter: actualTheme === "frost" ? "blur(10px)" : "none"
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

// --- Rule Dashboard Layout ---
const RuleLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();

  if (!theme || !theme.currentColors) {
    return <div style={{ background: "#020617", minHeight: "100vh" }} />;
  }
  const { currentColors, actualTheme } = theme;

  return (
    <div style={{ backgroundColor: currentColors.appBg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ display: "flex", flexGrow: 1 }}>
        <RuleSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main
          style={{
            flexGrow: 1,
            paddingTop: "70px",
            background: currentColors.mainGradient,
            backdropFilter: actualTheme === "frost" ? "blur(10px)" : "none"
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

// --- Investigator Dashboard Layout ---
const InvestigatorLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();

  if (!theme || !theme.currentColors) {
    return <div style={{ background: "#020617", minHeight: "100vh" }} />;
  }
  const { currentColors, actualTheme } = theme;

  return (
    <div style={{ backgroundColor: currentColors.appBg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ display: "flex", flexGrow: 1 }}>
        <InvestigatorSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main
          style={{
            flexGrow: 1,
            paddingTop: "70px",
            background: currentColors.mainGradient,
            backdropFilter: actualTheme === "frost" ? "blur(10px)" : "none"
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
            {/* Public route */}
            <Route path="/" element={<Home />} />

            {/* General dashboard routes */}
            <Route element={<RootLayout />}>
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Rule dashboard routes */}
            <Route element={<RuleLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scenarios" element={<ScenarioPage />} />
              <Route path="/detection-rules" element={<DetectionRulePage />} />
            </Route>

            {/* Investigator dashboard routes */}
            <Route element={<InvestigatorLayout />}>
              <Route path="/Idashboard" element={<InvestigatorDashboard />} />
              <Route path="/transaction" element={<Transactions />} />
              <Route path="/risk" element={<RiskScoring />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
