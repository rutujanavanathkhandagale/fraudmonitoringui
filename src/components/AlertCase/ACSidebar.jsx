import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiShield,
  FiBell,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiBriefcase
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
 
export default function ACSidebar({ collapsed, setCollapsed }) {
  const { currentColors, actualTheme } = useTheme();
  const { user, logout } = useAuth();
 
  const toggleSidebar = () => {
    if (setCollapsed) setCollapsed(!collapsed);
  };
 
  // Theme-based background
  const sidebarBg =
    actualTheme === "frost"
      ? "rgba(255, 255, 255, 0.4)"
      : actualTheme === "light"
      ? "#ffffff"
      : "linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)";
 
  const accentColor =
    actualTheme === "frost"
      ? "#34abe0"
      : actualTheme === "light"
      ? "#7c3aed"
      : "#d000f5";
 
  const sidebarStyle = {
    width: collapsed ? "80px" : "260px",
    height: "100vh",
    background: sidebarBg,
    backdropFilter: actualTheme === "frost" ? "blur(20px)" : "none",
    color: currentColors.textPrimary,
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 999,
    transition: "width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRight: `1px solid ${currentColors.border}`,
    boxShadow:
      actualTheme === "light" ? "4px 0 10px rgba(0,0,0,0.05)" : "none"
  };
 
  return (
    <div style={sidebarStyle}>
      {/* TOP SECTION */}
      <div>
        <div
          style={{
            padding: collapsed ? "20px 0" : "20px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
          }}
        >
          {/* ✅ FIXED DASHBOARD ROUTE */}
          <Link
            to="/alert/dashboard"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              maxWidth: collapsed ? "0px" : "200px",
              opacity: collapsed ? 0 : 1,
              transition: "all 0.4s ease",
            }}
          >
            <FiShield
              className="fs-3"
              style={{ color: accentColor, marginRight: "10px" }}
            />
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: "900",
                color: currentColors.textPrimary,
              }}
            >
              FraudShield
            </span>
          </Link>
 
          <FiMenu
            onClick={toggleSidebar}
            style={{ cursor: "pointer", fontSize: "24px", color: accentColor }}
          />
        </div>
 
        <hr
          style={{
            margin: "0 15px 20px 15px",
            borderColor: currentColors.border,
            opacity: 0.2,
          }}
        />
 
        <SidebarMenu
          collapsed={collapsed}
          accentColor={accentColor}
          currentColors={currentColors}
        />
      </div>
 
      {/* BOTTOM SECTION */}
      <div style={{ paddingBottom: "20px" }}>
        <MenuItem
          icon={<FiSettings />}
          text="Settings"
          path="/settings"
          collapsed={collapsed}
          accentColor={accentColor}
          currentColors={currentColors}
        />
 
        <div
          style={{
            padding: collapsed ? "0px" : "15px 20px",
            opacity: collapsed ? 0 : 0.7,
            fontSize: "12px",
            color: currentColors.textSecondary,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          Logged in as:
          <br />
          <strong style={{ color: currentColors.textPrimary }}>
            {user?.name || "Analyst"}
          </strong>
        </div>
 
        <div
          onClick={logout}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: "12px 15px",
            margin: collapsed ? "5px auto" : "5px 15px",
            borderRadius: "12px",
            cursor: "pointer",
            color: accentColor,
            fontWeight: "800",
            transition: "all 0.3s ease",
          }}
        >
          <FiLogOut style={{ fontSize: "1.2rem" }} />
          {!collapsed && <span style={{ marginLeft: "12px" }}>Logout</span>}
        </div>
      </div>
    </div>
  );
}
 
/* ---------------- MENU ---------------- */
 
function SidebarMenu({ collapsed, accentColor, currentColors }) {
  return (
    <div>
      {/* ✅ FIXED DASHBOARD ROUTE */}
      <MenuItem
        icon={<FiHome />}
        text="Dashboard"
        path="/alert/dashboard"
        collapsed={collapsed}
        accentColor={accentColor}
        currentColors={currentColors}
      />
 
      <MenuItem
        icon={<FiBell />}
        text="Alerts"
        path="/alert/alerts"
        collapsed={collapsed}
        accentColor={accentColor}
        currentColors={currentColors}
      />
 
      <MenuItem
        icon={<FiBriefcase />}
        text="Cases"
        path="/alert/cases"
        collapsed={collapsed}
        accentColor={accentColor}
        currentColors={currentColors}
      />
    </div>
  );
}
 
function MenuItem({ icon, text, collapsed, path, accentColor, currentColors }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;
 
  return (
    <div
      onClick={() => navigate(path)}
      title={collapsed ? text : ""}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        padding: "12px 15px",
        margin: collapsed ? "5px auto" : "5px 15px",
        borderRadius: "12px",
        cursor: "pointer",
        color: isActive ? accentColor : currentColors.textPrimary,
        background: isActive ? `${accentColor}15` : "transparent",
        borderLeft:
          isActive && !collapsed
            ? `4px solid ${accentColor}`
            : "4px solid transparent",
      }}
    >
      <span style={{ fontSize: "1.2rem", minWidth: "24px", display: "flex", justifyContent: "center" }}>
        {icon}
      </span>
      {!collapsed && (
        <span style={{ marginLeft: "12px", fontWeight: isActive ? "900" : "600" }}>
          {text}
        </span>
      )}
    </div>
  );
}
 