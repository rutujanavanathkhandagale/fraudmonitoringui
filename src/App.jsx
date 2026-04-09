<<<<<<< HEAD
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
=======
import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Styling
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Components
import Sidebar from './components/Sidebar';
// import Header from './components/Header';

// Pages
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Role from './pages/Role'; // ✅ ROLE PAGE IMPORT
import User from './pages/User'; // ✅ SYSTEM USER PAGE
import SystemUserProfile from './components/SystemUsers/SystemUserProfile';
import AdminAuditLogPage from './pages/audit';
/**
 * LAYOUT COMPONENT
 * This wraps your routes to provide the persistent Sidebar.
 */
const RootLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const layoutStyles = {
    wrapper: {
      backgroundColor: '#020617',
      minHeight: '100vh',
      color: '#fff',
      display: 'flex'
    },
    mainContent: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      marginLeft: collapsed ? '80px' : '260px',
      background: 'linear-gradient(135deg, #2e003e 0%, #35174fff 50%, #38041eff 100%)',
      transition: 'margin-left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
    },
    pageContainer: {
      padding: '0',
      flexGrow: 1
    }
  };

  return (
    <div style={layoutStyles.wrapper}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main style={layoutStyles.mainContent}>
        {/* <Header /> */}
        <div style={layoutStyles.pageContainer}>
          <Outlet />
        </div>
      </main>
>>>>>>> main
    </div>
  );
};

<<<<<<< HEAD
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
=======
/**
 * ROUTER CONFIGURATION
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/role", element: <Role /> }, // ✅ ROLE ROUTE
      { path: "/users", element: <User /> }, // ✅ SYSTEM USERS ROUTE
       { path: "/users/:id", element: <SystemUserProfile /> },
      { path: "/audit", element: <AdminAuditLogPage /> },
      { path: "*", element: <Navigate to="/dashboard" replace /> }
    ]
  }
]);

const App = () => {
  return (
    <AuthProvider>
  <RouterProvider router={router} />
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnHover
    theme="light"
  />
</AuthProvider>
  );
};

export default App;
>>>>>>> main
