// src/components/Layout.jsx
import React from "react";
import Header from "./common/Header"; 
import Sidebar from "./Sidebar";
import Footer from "./common/Footer"; // <-- Import your Footer

export default function Layout({ children, collapsed, setCollapsed }) {
  const SIDEBAR_WIDTH = collapsed ? 80 : 240;

  return (
    <div style={{ background: "black", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header collapsed={collapsed} setCollapsed={setCollapsed} />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* We use flex-grow: 1 on the main container so the footer 
          is pushed to the bottom even if the page has little content 
      */}
      <div
        style={{
          blackground: "transparent",
          marginLeft: SIDEBAR_WIDTH,
          marginTop: "75px",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1, 
          transition: "margin-left 0.3s ease",
          minHeight: "calc(100vh - 75px)"
        }}
      >
        <main style={{ flexGrow: 1, padding: "20px" }}>
          {children}
        </main>

        {/* Footer is placed here so it follows the sidebar margin */}
        <Footer />
      </div>
    </div>
  );
}