import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../api/index";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const quotes = {
  1: [
    "You started, you're already winning 💪",
    "Day 1 — your body is strong 🌸",
    "The hardest day is day 1. You got this! ✨",
  ],
  2: [
    "Day 2 is tough but you're tougher 💕",
    "Heating pad + chocolate = day 2 survival kit 🍫",
    "Being strong doesn't mean it doesn't hurt 🌿",
  ],
  3: [
    "Halfway there queen! 👑",
    "Day 3 — you're doing amazing 🌸",
    "Your body is working hard, rest is okay 💕",
  ],
  4: [
    "Almost done, you're incredible 💪",
    "Day 4 — the light is at the end 🌟",
    "You've handled harder things than this 🌸",
  ],
  5: [
    "Last day — YOU SURVIVED! 🎉",
    "Day 5 — celebrate yourself today 🌸",
    "You did it! Your body is remarkable 💕",
  ],
};

function getRandomQuote(day) {
  const dayQuotes = quotes[day] || quotes[1];
  return dayQuotes[Math.floor(Math.random() * dayQuotes.length)];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  const [periodDays, setPeriodDays] = useState(new Set());
  const [cycles, setCycles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [periodQuote, setPeriodQuote] = useState("");
  const [periodDay, setPeriodDay] = useState(null);
  const { user, setTracking, trackingFor } = useAuth();
  const isMale = user?.gender === "male";

  const trackingLabels = {
  self: { emoji: "🧑", label: "yourself" },
  girlfriend: { emoji: "💑", label: "your girlfriend" },
  daughter: { emoji: "👨‍👧", label: "your daughter" },
  sister: { emoji: "🤝", label: "your sister/mom" },
};

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cyclesRes, statsRes] = await Promise.all([
        api.get("/periods"),
        api.get("/periods/stats"),
      ]);
      setCycles(cyclesRes.data);
      setStats(statsRes.data);

      const days = new Set();
      cyclesRes.data.forEach((cycle) => {
        const start = new Date(cycle.startDate);
        const end = cycle.endDate
          ? new Date(cycle.endDate)
          : new Date(start.getTime() + 5 * 24 * 60 * 60 * 1000);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          days.add(dateKey(d.getFullYear(), d.getMonth(), d.getDate()));
        }
      });
      setPeriodDays(days);

      if (cyclesRes.data.length > 0) {
        const lastCycle = cyclesRes.data[0];
        const start = new Date(lastCycle.startDate);
        const dayNum = Math.round((today - start) / (1000 * 60 * 60 * 24)) + 1;
        if (dayNum >= 1 && dayNum <= 5) {
          setPeriodDay(dayNum);
          setPeriodQuote(getRandomQuote(dayNum));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const dateKey = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const togglePeriodDay = async (key) => {
    const newDays = new Set(periodDays);
    if (newDays.has(key)) {
      newDays.delete(key);
    } else {
      newDays.add(key);
      try {
        await api.post("/periods", {
          startDate: key,
          flowLevel: selectedFlow || "medium",
        });
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
    setPeriodDays(newDays);
  };

  const saveLog = async () => {
    try {
      await api.post("/symptoms", {
        date: new Date().toISOString(),
        mood: selectedMood,
        cramps: selectedSymptoms.includes("Cramps"),
        bloating: selectedSymptoms.includes("Bloating"),
        headache: selectedSymptoms.includes("Headache"),
        fatigue: selectedSymptoms.includes("Fatigue"),
        backPain: selectedSymptoms.includes("Back pain"),
      });
      setSaveMsg("Saved! You are doing great 🌸");
      setTimeout(() => setSaveMsg(""), 3000);
      setSelectedFlow("");
      setSelectedSymptoms([]);
      setSelectedMood("");
    } catch (err) {
      setSaveMsg("Something went wrong 😔");
    }
  };

  const renderCalendar = () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`e${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const key = dateKey(y, m, day);
      const thisDate = new Date(y, m, day);
      const isPeriod = periodDays.has(key);
      const isToday = thisDate.toDateString() === today.toDateString();

      let isFertile = false,
        isOvulation = false,
        isPredicted = false;
      if (stats && stats.lastPeriodStart) {
        const lastStart = new Date(stats.lastPeriodStart);
        const cycleLen = stats.avgCycleLength || 28;
        const diff = Math.round((thisDate - lastStart) / (1000 * 60 * 60 * 24));
        const mod = ((diff % cycleLen) + cycleLen) % cycleLen;
        if (!isPeriod && diff > 5) {
          if (mod === 14) isOvulation = true;
          else if (mod >= 12 && mod <= 16) isFertile = true;
        }
        const nextStart = new Date(
          lastStart.getTime() + cycleLen * 24 * 60 * 60 * 1000,
        );
        const daysToNext = Math.round(
          (thisDate - nextStart) / (1000 * 60 * 60 * 24),
        );
        if (daysToNext >= 0 && daysToNext < 5 && !isPeriod) isPredicted = true;
      }

      let bg = "transparent",
        color = "#2D1B2E",
        border = "none";
      if (isPeriod) {
        bg = "linear-gradient(135deg, #ED93B1, #D4537E)";
        color = "white";
      } else if (isOvulation) {
        bg = "#AFA9EC";
        color = "white";
      } else if (isFertile) {
        bg = "#EEEDFE";
        color = "#534AB7";
      } else if (isPredicted) {
        border = "1.5px dashed #ED93B1";
        color = "#D4537E";
      }

      cells.push(
        <div
          key={day}
          onClick={() => togglePeriodDay(key)}
          style={{
            aspectRatio: "1",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            cursor: "pointer",
            background: bg,
            color,
            border: isToday ? "2px solid #D4537E" : border,
            fontWeight: isToday ? 600 : 400,
            transition: "all 0.15s",
            position: "relative",
          }}
        >
          {day}
        </div>,
      );
    }
    return cells;
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#FDF6F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "#D4537E",
            fontSize: "1.2rem",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Loading your FlowBuddy 🌸
        </div>
      </div>
    );

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
      {/* MALE ONBOARDING MODAL */}
      {isMale && !trackingFor && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(45,27,46,0.5)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "2rem",
              maxWidth: "440px",
              width: "100%",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>👋</div>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.6rem",
                color: "#2D1B2E",
                fontWeight: 400,
                marginBottom: "0.5rem",
              }}
            >
              Hey {user?.name?.split(" ")[0]}!
            </h2>
            <p
              style={{
                color: "#7A5C6E",
                fontSize: "14px",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
                fontWeight: 300,
              }}
            >
              Great to have you here! FlowBuddy is for everyone 💕
              <br />
              How are you planning to use this app?
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {[
                {
                  val: "girlfriend",
                  emoji: "💑",
                  label: "Track for my girlfriend",
                  desc: "Be the most supportive partner",
                },
                {
                  val: "daughter",
                  emoji: "👨‍👧",
                  label: "Track for my daughter",
                  desc: "Help her understand her body",
                },
                {
                  val: "sister",
                  emoji: "🤝",
                  label: "Track for my sister/mom",
                  desc: "Be a caring family member",
                },
                {
                  val: "self",
                  emoji: "📚",
                  label: "Just learning & exploring",
                  desc: "Understand periods better",
                },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setTracking(opt.val)}
                  style={{
                    border: "1.5px solid rgba(212,83,126,0.2)",
                    background: "#FDF6F9",
                    borderRadius: "14px",
                    padding: "12px 16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    textAlign: "left",
                    transition: "all 0.15s",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#D4537E";
                    e.currentTarget.style.background = "rgba(212,83,126,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(212,83,126,0.2)";
                    e.currentTarget.style.background = "#FDF6F9";
                  }}
                >
                  <span style={{ fontSize: "1.8rem" }}>{opt.emoji}</span>
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#2D1B2E",
                      }}
                    >
                      {opt.label}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#7A5C6E",
                        fontWeight: 300,
                      }}
                    >
                      {opt.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}
      >
        {/* WELCOME + QUOTE */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
              color: "#2D1B2E",
              fontWeight: 400,
              marginBottom: "0.5rem",
            }}
          >
            Hey {user?.name?.split(" ")[0]} {isMale ? "👋" : "🌸"}
          </h1>
          {isMale && trackingFor && (
            <p
              style={{
                color: "#7A5C6E",
                fontSize: "14px",
                fontWeight: 300,
                marginTop: "4px",
              }}
            >
              Tracking for {trackingLabels[trackingFor]?.emoji}{" "}
              {trackingLabels[trackingFor]?.label}
            </p>
          )}
          {periodQuote && (
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,83,126,0.08), rgba(123,104,204,0.08))",
                border: "1px solid rgba(212,83,126,0.15)",
                borderRadius: "16px",
                padding: "14px 20px",
                display: "inline-block",
                marginTop: "8px",
              }}
            >
              <span
                style={{ fontSize: "13px", color: "#7A5C6E", fontWeight: 300 }}
              >
                Day {periodDay} •{" "}
              </span>
              <span
                style={{ fontSize: "14px", color: "#993556", fontWeight: 500 }}
              >
                {periodQuote}
              </span>
            </div>
          )}
        </div>

        {/* STATS ROW */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
            marginBottom: "2rem",
          }}
        >
          {[
            {
              label: "Days since",
              value: stats?.daysSinceLastPeriod ?? "—",
              unit: "days",
            },
            {
              label: "Cycle length",
              value: stats?.avgCycleLength ?? 28,
              unit: "days",
            },
            {
              label: "Next period",
              value: stats?.nextPredictedPeriod
                ? Math.max(
                    0,
                    Math.round(
                      (new Date(stats.nextPredictedPeriod) - today) /
                        (1000 * 60 * 60 * 24),
                    ),
                  )
                : "—",
              unit: "days away",
            },
            {
              label: "Total cycles",
              value: stats?.totalCycles ?? 0,
              unit: "logged",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "white",
                border: "0.5px solid rgba(212,83,126,0.15)",
                borderRadius: "16px",
                padding: "1.25rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "2rem",
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
              <div
                style={{ fontSize: "11px", color: "#C9B8E8", fontWeight: 300 }}
              >
                {s.unit}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* CALENDAR */}
          <div
            style={{
              background: "white",
              border: "0.5px solid rgba(212,83,126,0.15)",
              borderRadius: "20px",
              padding: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1.1rem",
                  color: "#2D1B2E",
                  fontWeight: 400,
                }}
              >
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <div style={{ display: "flex", gap: "6px" }}>
                {["‹", "›"].map((arrow, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setCurrentDate(
                        new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth() + (i === 0 ? -1 : 1),
                          1,
                        ),
                      )
                    }
                    style={{
                      border: "0.5px solid rgba(212,83,126,0.2)",
                      background: "#FDF6F9",
                      color: "#D4537E",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {arrow}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                marginBottom: "6px",
              }}
            >
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div
                  key={d}
                  style={{
                    textAlign: "center",
                    fontSize: "11px",
                    color: "#7A5C6E",
                    fontWeight: 600,
                    padding: "4px 0",
                    textTransform: "uppercase",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "2px",
              }}
            >
              {renderCalendar()}
            </div>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "0.5px solid rgba(212,83,126,0.1)",
              }}
            >
              {[
                { color: "#D4537E", label: "Period" },
                { color: "#AFA9EC", label: "Ovulation" },
                {
                  color: "#EEEDFE",
                  label: "Fertile",
                  border: "1px solid #AFA9EC",
                },
                {
                  color: "transparent",
                  label: "Predicted",
                  border: "1.5px dashed #ED93B1",
                },
              ].map((l, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "11px",
                    color: "#7A5C6E",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: l.color,
                      border: l.border,
                    }}
                  />
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          {/* LOG TODAY */}
          <div
            style={{
              background: "white",
              border: "0.5px solid rgba(212,83,126,0.15)",
              borderRadius: "20px",
              padding: "1.5rem",
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
              Log today 🌿
            </h3>

            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#7A5C6E",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "8px",
                }}
              >
                Flow
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["Light", "Medium", "Heavy", "Spotting"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFlow(selectedFlow === f ? "" : f)}
                    style={{
                      border: `1.5px solid ${selectedFlow === f ? "#D4537E" : "rgba(212,83,126,0.2)"}`,
                      background:
                        selectedFlow === f ? "rgba(212,83,126,0.1)" : "#FDF6F9",
                      color: selectedFlow === f ? "#993556" : "#7A5C6E",
                      padding: "6px 14px",
                      borderRadius: "50px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: selectedFlow === f ? 500 : 400,
                      transition: "all 0.15s",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#7A5C6E",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "8px",
                }}
              >
                Symptoms
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  "Cramps",
                  "Bloating",
                  "Headache",
                  "Fatigue",
                  "Back pain",
                  "Mood swings",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setSelectedSymptoms((prev) =>
                        prev.includes(s)
                          ? prev.filter((x) => x !== s)
                          : [...prev, s],
                      )
                    }
                    style={{
                      border: `1.5px solid ${selectedSymptoms.includes(s) ? "#7B68CC" : "rgba(123,104,204,0.2)"}`,
                      background: selectedSymptoms.includes(s)
                        ? "rgba(123,104,204,0.1)"
                        : "#FDF6F9",
                      color: selectedSymptoms.includes(s)
                        ? "#534AB7"
                        : "#7A5C6E",
                      padding: "6px 14px",
                      borderRadius: "50px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: selectedSymptoms.includes(s) ? 500 : 400,
                      transition: "all 0.15s",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#7A5C6E",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "8px",
                }}
              >
                Mood
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  { val: "happy", emoji: "😊" },
                  { val: "sad", emoji: "😢" },
                  { val: "irritable", emoji: "😤" },
                  { val: "tired", emoji: "😴" },
                  { val: "anxious", emoji: "😰" },
                ].map((m) => (
                  <button
                    key={m.val}
                    onClick={() =>
                      setSelectedMood(selectedMood === m.val ? "" : m.val)
                    }
                    style={{
                      border: `1.5px solid ${selectedMood === m.val ? "#D4537E" : "rgba(212,83,126,0.2)"}`,
                      background:
                        selectedMood === m.val
                          ? "rgba(212,83,126,0.1)"
                          : "#FDF6F9",
                      padding: "6px 12px",
                      borderRadius: "50px",
                      cursor: "pointer",
                      fontSize: "18px",
                      transition: "all 0.15s",
                    }}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={saveLog}
              style={{
                width: "100%",
                padding: "12px",
                background: "linear-gradient(135deg, #D4537E, #993556)",
                color: "white",
                border: "none",
                borderRadius: "50px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 20px rgba(153,53,86,0.2)",
              }}
            >
              Save today's log ✨
            </button>

            {saveMsg && (
              <div
                style={{
                  marginTop: "10px",
                  background: "rgba(212,83,126,0.08)",
                  border: "1px solid rgba(212,83,126,0.2)",
                  borderRadius: "12px",
                  padding: "10px",
                  textAlign: "center",
                  fontSize: "13px",
                  color: "#993556",
                }}
              >
                {saveMsg}
              </div>
            )}
          </div>
        </div>

        {/* QUICK ACCESS */}
        <div style={{ marginTop: "2rem" }}>
          <h3
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.1rem",
              color: "#2D1B2E",
              fontWeight: 400,
              marginBottom: "1rem",
            }}
          >
            Quick access 🌸
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "12px",
            }}
          >
            {[
              {
                icon: "💬",
                label: "Ask AI",
                path: "/chat",
                color: "#EEEDFE",
                textColor: "#534AB7",
              },
              {
                icon: "🧘",
                label: "Exercise",
                path: "/exercise",
                color: "#E1F5EE",
                textColor: "#0F6E56",
              },
              {
                icon: "🥗",
                label: "Care Guide",
                path: "/care",
                color: "#FDF6F9",
                textColor: "#993556",
              },
              {
                icon: "💡",
                label: "Learn",
                path: "/awareness",
                color: "#FEF3C7",
                textColor: "#854F0B",
              },
              {
                icon: "🎮",
                label: "Games",
                path: "/games",
                color: "#FBEAF0",
                textColor: "#993556",
              },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                style={{
                  background: item.color,
                  border: "none",
                  borderRadius: "16px",
                  padding: "1.25rem",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-3px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>
                  {item.icon}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: item.textColor,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
