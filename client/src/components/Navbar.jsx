import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { path: "/dashboard", icon: "🗓️", label: "Tracker" },
  { path: "/chat", icon: "💬", label: "Ask" },
  { path: "/exercise", icon: "🧘", label: "Exercise" },
  { path: "/care", icon: "🥗", label: "Care" },
  { path: "/awareness", icon: "💡", label: "Learn" },
  { path: "/games", icon: "🎮", label: "Games" },
  { path: "/profile", icon: "👤", label: "Profile" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* TOP NAV - Desktop */}
      <nav
        style={{
          fontFamily: "'DM Sans', sans-serif",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(253,246,249,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "0.5px solid rgba(212,83,126,0.12)",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />

        {/* Logo */}
        <div
          onClick={() => navigate("/dashboard")}
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "1.4rem",
            color: "#993556",
            cursor: "pointer",
          }}
        >
          Flow
          <span style={{ fontStyle: "italic", color: "#7B68CC" }}>Buddy</span>{" "}
          🌸
        </div>

        {/* Nav links - desktop */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                border: "none",
                background:
                  location.pathname === item.path
                    ? "rgba(212,83,126,0.1)"
                    : "transparent",
                color: location.pathname === item.path ? "#993556" : "#7A5C6E",
                padding: "8px 14px",
                borderRadius: "50px",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: location.pathname === item.path ? 500 : 400,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s",
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* User + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "13px", color: "#7A5C6E" }}>
            Hey, {user?.name?.split(" ")[0]} 👋
          </div>
          <button
            onClick={handleLogout}
            style={{
              border: "1.5px solid rgba(212,83,126,0.2)",
              background: "transparent",
              color: "#D4537E",
              padding: "6px 16px",
              borderRadius: "50px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* BOTTOM NAV - Mobile */}
      <div
        style={{
          display: "none",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(253,246,249,0.95)",
          backdropFilter: "blur(12px)",
          borderTop: "0.5px solid rgba(212,83,126,0.12)",
          padding: "8px 0",
          id: "mobile-nav",
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              color: location.pathname === item.path ? "#993556" : "#7A5C6E",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              padding: "4px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
            }}
          >
            <span style={{ fontSize: "20px" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          nav { display: none !important; }
          #mobile-nav { display: flex !important; }
        }
      `}</style>
      {/* FOOTER */}
      <footer
        style={{
          textAlign: "center",
          padding: "0.75rem",
          background: "white",
          borderTop: "0.5px solid rgba(212,83,126,0.08)",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 99,
        }}
      >
        <p
          style={{
            color: "#7A5C6E",
            fontSize: "11px",
            fontWeight: 300,
            margin: 0,
          }}
        >
          © 2026 FlowBuddy. Made with 💕 for everyone. Not a medical app.
        </p>
      </footer>
    </>
  );
}
