// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";   // <-- import AuthProvider

// Rule
import Dashboard from "./pages/Rule/Dashboard";
import ScenarioPage from "./pages/Rule/ScenarioPage";
import RuleSidebar from "./components/Rule/RuleSidebar";

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

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
        {/* If you want a general sidebar, create Sidebar.jsx. For now, use RuleSidebar */}
        <RuleSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main style={{ flexGrow: 1, paddingTop: "70px", background: currentColors.mainGradient, backdropFilter: actualTheme === "frost" ? "blur(10px)" : "none" }}>
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
        <main style={{ flexGrow: 1, paddingTop: "70px", background: currentColors.mainGradient, backdropFilter: actualTheme === "frost" ? "blur(10px)" : "none" }}>
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
    <AuthProvider>   {/* <-- wrap everything in AuthProvider */}
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
              {/* Add more rule routes here */}
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
