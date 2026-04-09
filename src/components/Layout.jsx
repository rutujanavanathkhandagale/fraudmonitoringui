import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "../components/Footer";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  // dynamic width for layout alignment
  const SIDEBAR_WIDTH = collapsed ? 80 : 240;

  return (
    <div style={{ background: "black", minHeight: "100vh" }}>

      <Navbar />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN CONTENT */}
      <div
        style={{
          marginLeft: SIDEBAR_WIDTH,
          marginTop: 55,
          padding: "10px",
          marginRight:10,
      
          paddingBottom: "120px",
          transition: "all 0.3s ease"
        }}
      >
        {children}
      </div>

      {/* FIXED FOOTER  <Footer sidebarWidth={SIDEBAR_WIDTH} />*/}
     
    </div>
  );
}