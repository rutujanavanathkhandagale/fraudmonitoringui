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
    </div>
  );
};

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