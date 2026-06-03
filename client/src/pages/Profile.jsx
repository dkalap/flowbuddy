import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../api/index";

export default function Profile() {
  const { user, login, logout } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    gender: user?.gender || "",
    dob: user?.dob ? user.dob.split("T")[0] : "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [stats, setStats] = useState(null);
  const [chatCount, setChatCount] = useState(0);
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwMsg, setPwMsg] = useState("");

  const changePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword)
      return setPwMsg("Passwords don't match!");
    if (pwForm.newPassword.length < 6)
      return setPwMsg("Password must be at least 6 characters!");
    try {
      await api.put("/auth/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg("Password changed successfully! 🌸");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPwMsg(""), 3000);
    } catch (err) {
      setPwMsg(err.response?.data?.message || "Something went wrong!");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        api.get("/periods/stats"),
        api.get("/chat/history"),
      ]);
      setStats(statsRes.data);
      setChatCount(historyRes.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    setLoading(true);
    try {
      await api.put("/auth/profile", form);
      login({ ...user, ...form }, localStorage.getItem("flowbuddy_token"));
      setMsg("Profile updated! 🌸");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("Something went wrong 😔");
    } finally {
      setLoading(false);
    }
  };

  const isMale = user?.gender === "male";

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh",
        background: "#FDF6F9",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <Navbar />

      <div
        style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem" }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          {/* Avatar */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #F4C0D1, #C9B8E8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 1rem",
              border: "3px solid white",
              boxShadow: "0 4px 20px rgba(212,83,126,0.2)",
            }}
          >
            {isMale ? "👨" : "👩"}
          </div>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.8rem",
              color: "#2D1B2E",
              fontWeight: 400,
              marginBottom: "0.25rem",
            }}
          >
            {user?.name} {isMale ? "👋" : "🌸"}
          </h1>
          <p style={{ color: "#7A5C6E", fontSize: "14px", fontWeight: 300 }}>
            {user?.email}
          </p>
        </div>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginBottom: "2rem",
          }}
        >
          {[
            {
              label: "Cycles logged",
              value: stats?.totalCycles ?? 0,
              icon: "🗓️",
            },
            {
              label: "Avg cycle",
              value: stats?.avgCycleLength ? `${stats.avgCycleLength}d` : "—",
              icon: "📊",
            },
            { label: "AI chats", value: chatCount, icon: "💬" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "white",
                border: "0.5px solid rgba(212,83,126,0.15)",
                borderRadius: "16px",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>
                {s.icon}
              </div>
              <div
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1.5rem",
                  color: "#D4537E",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#7A5C6E",
                  marginTop: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* EDIT PROFILE */}
        <div
          style={{
            background: "white",
            border: "0.5px solid rgba(212,83,126,0.15)",
            borderRadius: "20px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.1rem",
              color: "#2D1B2E",
              fontWeight: 400,
              marginBottom: "1.25rem",
            }}
          >
            Edit profile ✏️
          </h3>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#2D1B2E",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handle}
                style={{
                  width: "100%",
                  padding: "11px 16px",
                  border: "1.5px solid rgba(212,83,126,0.2)",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                  background: "#FDF6F9",
                  color: "#2D1B2E",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#D4537E")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(212,83,126,0.2)")
                }
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#2D1B2E",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Date of Birth
              </label>
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={handle}
                style={{
                  width: "100%",
                  padding: "11px 16px",
                  border: "1.5px solid rgba(212,83,126,0.2)",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                  background: "#FDF6F9",
                  color: "#2D1B2E",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#D4537E")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(212,83,126,0.2)")
                }
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#2D1B2E",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                I am
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  { val: "female", label: "👩 Female" },
                  { val: "male", label: "👨 Male" },
                  { val: "other", label: "🌈 Other" },
                  { val: "prefer_not", label: "🤐 Prefer not to say" },
                ].map((g) => (
                  <button
                    key={g.val}
                    onClick={() => setForm({ ...form, gender: g.val })}
                    style={{
                      border: `1.5px solid ${form.gender === g.val ? "#D4537E" : "rgba(212,83,126,0.2)"}`,
                      background:
                        form.gender === g.val
                          ? "rgba(212,83,126,0.1)"
                          : "#FDF6F9",
                      color: form.gender === g.val ? "#993556" : "#7A5C6E",
                      padding: "7px 14px",
                      borderRadius: "50px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: form.gender === g.val ? 500 : 400,
                      transition: "all 0.15s",
                    }}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {msg && (
              <div
                style={{
                  background: msg.includes("wrong")
                    ? "#FEE2E2"
                    : "rgba(212,83,126,0.08)",
                  border: `1px solid ${msg.includes("wrong") ? "#FECACA" : "rgba(212,83,126,0.2)"}`,
                  borderRadius: "12px",
                  padding: "10px 16px",
                  fontSize: "13px",
                  color: msg.includes("wrong") ? "#991B1B" : "#993556",
                  textAlign: "center",
                }}
              >
                {msg}
              </div>
            )}

            <button
              onClick={save}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: loading
                  ? "#C9B8E8"
                  : "linear-gradient(135deg, #D4537E, #993556)",
                color: "white",
                border: "none",
                borderRadius: "50px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 20px rgba(153,53,86,0.2)",
              }}
            >
              {loading ? "Saving... 🌸" : "Save changes 🌸"}
            </button>
          </div>
        </div>

        {/* ACCOUNT */}
        <div
          style={{
            background: "white",
            border: "0.5px solid rgba(212,83,126,0.15)",
            borderRadius: "20px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.1rem",
              color: "#2D1B2E",
              fontWeight: 400,
              marginBottom: "1rem",
            }}
          >
            Account 🔐
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "0.5px solid rgba(212,83,126,0.1)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#2D1B2E",
                  }}
                >
                  Email
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#7A5C6E",
                    fontWeight: 300,
                  }}
                >
                  {user?.email}
                </div>
              </div>
              <div
                style={{
                  background: "#E1F5EE",
                  color: "#0F6E56",
                  fontSize: "11px",
                  padding: "3px 10px",
                  borderRadius: "50px",
                  fontWeight: 500,
                }}
              >
                Verified ✅
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "0.5px solid rgba(212,83,126,0.1)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#2D1B2E",
                  }}
                >
                  Member since
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#7A5C6E",
                    fontWeight: 300,
                  }}
                >
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Recently joined"}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#2D1B2E",
                  }}
                >
                  Data & Privacy
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#7A5C6E",
                    fontWeight: 300,
                  }}
                >
                  Your data is encrypted and private
                </div>
              </div>
              <div style={{ fontSize: "16px" }}>🔒</div>
            </div>
          </div>
        </div>
        {/* CHANGE PASSWORD */}
        <div
          style={{
            background: "white",
            border: "0.5px solid rgba(212,83,126,0.15)",
            borderRadius: "20px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.1rem",
              color: "#2D1B2E",
              fontWeight: 400,
              marginBottom: "1rem",
            }}
          >
            Change password 🔑
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {[
              { label: "Current Password", key: "currentPassword" },
              { label: "New Password", key: "newPassword" },
              { label: "Confirm New Password", key: "confirmPassword" },
            ].map((field) => (
              <div key={field.key}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#2D1B2E",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {field.label}
                </label>
                <input
                  type="password"
                  value={pwForm[field.key]}
                  onChange={(e) =>
                    setPwForm({ ...pwForm, [field.key]: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "11px 16px",
                    border: "1.5px solid rgba(212,83,126,0.2)",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontFamily: "'DM Sans', sans-serif",
                    outline: "none",
                    background: "#FDF6F9",
                    color: "#2D1B2E",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#D4537E")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(212,83,126,0.2)")
                  }
                />
              </div>
            ))}
            {pwMsg && (
              <div
                style={{
                  background:
                    pwMsg.includes("wrong") ||
                    pwMsg.includes("incorrect") ||
                    pwMsg.includes("match")
                      ? "#FEE2E2"
                      : "rgba(212,83,126,0.08)",
                  border: `1px solid ${pwMsg.includes("wrong") || pwMsg.includes("incorrect") || pwMsg.includes("match") ? "#FECACA" : "rgba(212,83,126,0.2)"}`,
                  borderRadius: "12px",
                  padding: "10px 16px",
                  fontSize: "13px",
                  color:
                    pwMsg.includes("wrong") ||
                    pwMsg.includes("incorrect") ||
                    pwMsg.includes("match")
                      ? "#991B1B"
                      : "#993556",
                  textAlign: "center",
                }}
              >
                {pwMsg}
              </div>
            )}
            <button
              onClick={changePassword}
              style={{
                width: "100%",
                padding: "12px",
                background: "linear-gradient(135deg, #7B68CC, #534AB7)",
                color: "white",
                border: "none",
                borderRadius: "50px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Update password 🔑
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <div
          style={{
            background: "white",
            border: "0.5px solid rgba(212,83,126,0.15)",
            borderRadius: "20px",
            padding: "1.5rem",
            marginBottom: "4rem",
          }}
        >
          <h3
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.1rem",
              color: "#2D1B2E",
              fontWeight: 400,
              marginBottom: "1rem",
            }}
          >
            Account actions
          </h3>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "12px",
              background: "transparent",
              color: "#993556",
              border: "1.5px solid rgba(212,83,126,0.3)",
              borderRadius: "50px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FEE2E2";
              e.currentTarget.style.borderColor = "#993556";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(212,83,126,0.3)";
            }}
          >
            Logout from FlowBuddy 👋
          </button>
        </div>
      </div>
    </div>
  );
}
