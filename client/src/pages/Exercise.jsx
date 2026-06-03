import { useState } from "react";
import Navbar from "../components/Navbar";

const exerciseData = {
  none: {
    title: "No cramps today! 🎉",
    subtitle: "Great time for a stronger workout!",
    color: "#E1F5EE",
    textColor: "#0F6E56",
    exercises: [
      {
        icon: "🏃",
        name: "Running",
        desc: "Great cardio day — your energy is high and pain is low. Go for it!",
        duration: "30-45 mins",
        intensity: "High",
      },
      {
        icon: "🏋️",
        name: "Strength Training",
        desc: "Post-period is the best time to lift. Estrogen is on your side!",
        duration: "45 mins",
        intensity: "High",
      },
      {
        icon: "🚴",
        name: "Cycling or HIIT",
        desc: "Your body is strong and energetic. Push yourself today!",
        duration: "30 mins",
        intensity: "High",
      },
      {
        icon: "🏊",
        name: "Swimming",
        desc: "Full body workout with low impact. Perfect any day!",
        duration: "30-45 mins",
        intensity: "Medium",
      },
    ],
  },
  mild: {
    title: "Mild cramps 🌿",
    subtitle: "Gentle movement will actually help!",
    color: "#EEEDFE",
    textColor: "#534AB7",
    exercises: [
      {
        icon: "🧘",
        name: "Gentle Yoga",
        desc: "Cat-cow, cobra, and child's pose release tension from cramps beautifully.",
        duration: "20-30 mins",
        intensity: "Low",
      },
      {
        icon: "🚶",
        name: "Brisk Walking",
        desc: "A 20-min walk boosts endorphins and reduces mild discomfort naturally.",
        duration: "20 mins",
        intensity: "Low",
      },
      {
        icon: "🌊",
        name: "Swimming",
        desc: "Warm water relaxes muscles. Great low-impact option during periods.",
        duration: "20-30 mins",
        intensity: "Low",
      },
      {
        icon: "💃",
        name: "Light Dancing",
        desc: "Put on your fav songs and move gently. Mood booster guaranteed!",
        duration: "15-20 mins",
        intensity: "Low",
      },
    ],
  },
  moderate: {
    title: "Moderate cramps 😣",
    subtitle: "Take it easy — your body needs gentle care",
    color: "#FBEAF0",
    textColor: "#993556",
    exercises: [
      {
        icon: "🧘",
        name: "Child's Pose",
        desc: "Hold for 2-5 minutes. Gently stretches lower back and relieves cramp tension.",
        duration: "5-10 mins",
        intensity: "Very Low",
      },
      {
        icon: "🌬️",
        name: "Deep Breathing",
        desc: "Belly breathing activates your parasympathetic system to ease pain naturally.",
        duration: "5-10 mins",
        intensity: "Very Low",
      },
      {
        icon: "🛁",
        name: "Warm Bath Stretch",
        desc: "Soak in warm water and do gentle hip circles to loosen tight muscles.",
        duration: "15 mins",
        intensity: "Very Low",
      },
      {
        icon: "🐱",
        name: "Cat-Cow Stretch",
        desc: "On hands and knees, alternate arching and rounding your back slowly.",
        duration: "5-10 mins",
        intensity: "Very Low",
      },
    ],
  },
  severe: {
    title: "Severe cramps 😖",
    subtitle: "Rest is productive. Be kind to yourself today.",
    color: "#FAECE7",
    textColor: "#993C1D",
    exercises: [
      {
        icon: "🌡️",
        name: "Heat Pad + Rest",
        desc: "Place a heating pad on your lower abdomen. Rest is the best exercise today.",
        duration: "As needed",
        intensity: "None",
      },
      {
        icon: "🌬️",
        name: "Box Breathing",
        desc: "Breathe in 4 counts, hold 4, out 4, hold 4. Calms your nervous system instantly.",
        duration: "5-10 mins",
        intensity: "None",
      },
      {
        icon: "🧸",
        name: "Gentle Stretching",
        desc: "Only if comfortable — slow neck rolls and shoulder shrugs while lying down.",
        duration: "5 mins",
        intensity: "Very Low",
      },
      {
        icon: "🩺",
        name: "See a Doctor",
        desc: "Severe pain that doesn't improve with medication deserves medical attention. You matter!",
        duration: "Important",
        intensity: "⚠️",
      },
    ],
  },
};

const yogaPoses = [
  {
    icon: "🧘",
    name: "Child's Pose",
    benefit: "Relieves lower back + cramps",
    day: "Any day",
    youtube:
      "https://www.youtube.com/results?search_query=childs+pose+for+period+cramps",
  },
  {
    icon: "🐱",
    name: "Cat-Cow",
    benefit: "Loosens spine tension",
    day: "Day 1-3",
    youtube:
      "https://www.youtube.com/results?search_query=cat+cow+pose+for+menstrual+cramps",
  },
  {
    icon: "🦋",
    name: "Butterfly Pose",
    benefit: "Opens hips, reduces bloating",
    day: "Day 2-4",
    youtube:
      "https://www.youtube.com/results?search_query=butterfly+pose+for+periods",
  },
  {
    icon: "🐍",
    name: "Cobra Pose",
    benefit: "Stretches abdomen gently",
    day: "Day 3-5",
    youtube:
      "https://www.youtube.com/results?search_query=cobra+pose+for+period+pain",
  },
  {
    icon: "🌙",
    name: "Supine Twist",
    benefit: "Releases back tension",
    day: "Any day",
    youtube:
      "https://www.youtube.com/results?search_query=supine+twist+yoga+for+periods",
  },
  {
    icon: "🦵",
    name: "Legs Up Wall",
    benefit: "Reduces fatigue + swelling",
    day: "Day 1-2",
    youtube:
      "https://www.youtube.com/results?search_query=legs+up+wall+pose+period+relief",
  },
];

export default function Exercise() {
  const [crampLevel, setCrampLevel] = useState(null);

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
        style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              color: "#2D1B2E",
              fontWeight: 400,
              marginBottom: "0.5rem",
            }}
          >
            Move with your{" "}
            <span style={{ fontStyle: "italic", color: "#D4537E" }}>body</span>{" "}
            🧘
          </h1>
          <p style={{ color: "#7A5C6E", fontSize: "15px", fontWeight: 300 }}>
            Exercise adapted to how you feel today — not against it
          </p>
        </div>

        {/* CRAMP SELECTOR */}
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
            How are your cramps today?
          </h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              {
                val: "none",
                label: "No cramps 😊",
                color: "#E1F5EE",
                activeColor: "#0F6E56",
              },
              {
                val: "mild",
                label: "Mild 🌿",
                color: "#EEEDFE",
                activeColor: "#534AB7",
              },
              {
                val: "moderate",
                label: "Moderate 😣",
                color: "#FBEAF0",
                activeColor: "#993556",
              },
              {
                val: "severe",
                label: "Severe 😖",
                color: "#FAECE7",
                activeColor: "#993C1D",
              },
            ].map((c) => (
              <button
                key={c.val}
                onClick={() => setCrampLevel(c.val)}
                style={{
                  border: `1.5px solid ${crampLevel === c.val ? c.activeColor : "rgba(212,83,126,0.2)"}`,
                  background: crampLevel === c.val ? c.color : "white",
                  color: crampLevel === c.val ? c.activeColor : "#7A5C6E",
                  padding: "10px 20px",
                  borderRadius: "50px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: crampLevel === c.val ? 500 : 400,
                  transition: "all 0.2s",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* EXERCISE CARDS */}
        {crampLevel && (
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                background: exerciseData[crampLevel].color,
                borderRadius: "16px",
                padding: "1rem 1.5rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "1.2rem",
                    color: exerciseData[crampLevel].textColor,
                    fontWeight: 400,
                  }}
                >
                  {exerciseData[crampLevel].title}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: exerciseData[crampLevel].textColor,
                    opacity: 0.8,
                    fontWeight: 300,
                  }}
                >
                  {exerciseData[crampLevel].subtitle}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "12px",
              }}
            >
              {exerciseData[crampLevel].exercises.map((ex, i) => (
                <div
                  key={i}
                  style={{
                    background: "white",
                    border: "0.5px solid rgba(212,83,126,0.15)",
                    borderRadius: "16px",
                    padding: "1.25rem",
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: exerciseData[crampLevel].color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      flexShrink: 0,
                    }}
                  >
                    {ex.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "#2D1B2E",
                        marginBottom: "4px",
                      }}
                    >
                      {ex.name}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#7A5C6E",
                        lineHeight: 1.5,
                        marginBottom: "8px",
                        fontWeight: 300,
                      }}
                    >
                      {ex.desc}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span
                        style={{
                          background: exerciseData[crampLevel].color,
                          color: exerciseData[crampLevel].textColor,
                          fontSize: "11px",
                          padding: "3px 10px",
                          borderRadius: "50px",
                          fontWeight: 500,
                        }}
                      >
                        ⏱ {ex.duration}
                      </span>
                      <span
                        style={{
                          background: "#F8F0F4",
                          color: "#993556",
                          fontSize: "11px",
                          padding: "3px 10px",
                          borderRadius: "50px",
                          fontWeight: 500,
                        }}
                      >
                        {ex.intensity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!crampLevel && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#7A5C6E",
              fontSize: "15px",
              fontWeight: 300,
            }}
          >
            👆 Select your cramp level above to see personalized exercises!
          </div>
        )}

        {/* YOGA POSES SECTION */}
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
              marginBottom: "0.5rem",
            }}
          >
            Best yoga poses for your cycle 🌸
          </h3>
          <p
            style={{
              color: "#7A5C6E",
              fontSize: "13px",
              fontWeight: 300,
              marginBottom: "1.25rem",
            }}
          >
            These poses work with your body during menstruation
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "10px",
            }}
          >
            {yogaPoses.map((pose, i) => (
              <div
                key={i}
                style={{
                  background: "#FDF6F9",
                  border: "0.5px solid rgba(212,83,126,0.1)",
                  borderRadius: "12px",
                  padding: "1rem",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ fontSize: "1.8rem" }}>{pose.icon}</div>
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#2D1B2E",
                      marginBottom: "2px",
                    }}
                  >
                    {pose.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#7A5C6E",
                      fontWeight: 300,
                      marginBottom: "4px",
                    }}
                  >
                    {pose.benefit}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "4px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#D4537E",
                        fontWeight: 500,
                      }}
                    >
                      {pose.day}
                    </div>
                    <a
                      href={pose.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: "#D4537E",
                        color: "white",
                        fontSize: "10px",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        textDecoration: "none",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      Watch ▶
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIPS */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(212,83,126,0.06), rgba(123,104,204,0.06))",
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
              marginBottom: "1rem",
            }}
          >
            General tips 💕
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "10px",
            }}
          >
            {[
              {
                icon: "💧",
                tip: "Stay hydrated — drink water before, during and after exercise",
              },
              {
                icon: "🌡️",
                tip: "Warm up longer than usual — your body needs extra care",
              },
              {
                icon: "👂",
                tip: "Listen to your body — rest is not weakness, it's wisdom",
              },
              {
                icon: "⏰",
                tip: "Even 10 minutes of movement counts — don't pressure yourself",
              },
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>
                  {t.icon}
                </span>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#7A5C6E",
                    lineHeight: 1.5,
                    fontWeight: 300,
                    margin: 0,
                  }}
                >
                  {t.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
