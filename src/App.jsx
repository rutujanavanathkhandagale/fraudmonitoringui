import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import Layout from "./components/Layout";

// Auth (components folder)
import LoginPage from "./components/LoginPage";
import ForgotPassword from "./components/ForgotPassword";
import VerifyEmail from "./components/VerifyEmail";
import ResetPassword from "./components/ResetPassword";
import RegisterPage from "./components/RegisterPage"; 

// Pages (pages folder)
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Cases from "./pages/Cases";
import ControlChecklist from "./pages/ControlChecklist";
import KYCVerification from "./pages/KYCVerification";
import RegulatoryReport from "./pages/RegulatoryReport";
import TransactionPattern from "./pages/TransactionPattern";
import WatchlistPageForm from "./pages/WatchlistPageForm";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <Layout collapsed={collapsed} setCollapsed={setCollapsed}>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Main Pages */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/control-checklist" element={<ControlChecklist />} />
          <Route path="/kyc" element={<KYCVerification />} />
          <Route path="/regulatory-report" element={<RegulatoryReport />} />
          <Route path="/transaction-pattern" element={<TransactionPattern />} />
          <Route path="/watchlist" element={<WatchlistPageForm />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}