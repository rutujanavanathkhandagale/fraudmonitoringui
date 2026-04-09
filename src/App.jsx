import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header"; 
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import ScenarioPage from "./pages/ScenarioPage";
import DetectionRulesPage from "./pages/DetectionRulesPage";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from './context/ThemeContext'; // ✅ Import Theme
import "./App.css";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  // Dynamic sidebar width for the Footer and Main Content
  const sidebarWidth = collapsed ? "80px" : "260px";

  return (
    <AuthProvider>
      <ThemeProvider> {/* ✅ ThemeProvider must wrap everything using currentColors */}
        <BrowserRouter>
          <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
            
            {/* 1. Sidebar on the left */}
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* 2. Main content area */}
            <div
              className={`main-content ${collapsed ? "sidebar-collapsed" : ""}`}
              style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                transition: "all 0.3s ease"
              }}
            >
              {/* Header at the top */}
              <Header />

              {/* Page content area (Scrollable) */}
              <main style={{ flex: 1, paddingBottom: "20px" }}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/scenarios" element={<ScenarioPage />} />
                  <Route path="/detection-rules" element={<DetectionRulesPage />} />
                </Routes>
              </main>

              {/* ✅ Footer sits at the bottom of the column */}
              <Footer sidebarWidth={sidebarWidth} />
            </div>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}