import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const features = [
  {
    icon: "🗓️",
    title: "Cycle Tracker",
    desc: "Log and predict your period with a beautiful interactive calendar",
  },
  {
    icon: "💬",
    title: "Ask Anything",
    desc: "AI companion that answers period questions without judgment — for everyone",
  },
  {
    icon: "🧘",
    title: "Exercise Guide",
    desc: "Gentle movements tailored to your cramp level each day",
  },
  {
    icon: "🥗",
    title: "Care & Food",
    desc: "What to eat, avoid, and how to take care of yourself in 5 days",
  },
  {
    icon: "🎮",
    title: "Stress Relief",
    desc: "Pop bubbles and smash stress away with our mini games",
  },
  {
    icon: "💡",
    title: "Break the Taboo",
    desc: "Learn and share — because periods are not shameful, they are natural",
  },
];

const quotes = [
  "Your body is doing something remarkable 🌸",
  "No question is too shy here 💕",
  "For everyone who ever needed a safe space 🌿",
  "Track it. Understand it. Own it. ✨",
];

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const blobs = heroRef.current?.querySelectorAll(".blob");
      blobs?.forEach((blob) => {
        blob.style.transform = `translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(${0.95 + Math.random() * 0.1})`;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#FDF6F9",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.25rem 2rem",
          position: "sticky",
          top: 0,
          background: "rgba(253,246,249,0.85)",
          backdropFilter: "blur(12px)",
          zIndex: 100,
          borderBottom: "0.5px solid rgba(212,83,126,0.1)",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "1.5rem",
            color: "#993556",
          }}
        >
          Flow
          <span style={{ fontStyle: "italic", color: "#7B68CC" }}>Buddy</span>{" "}
          🌸
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              border: "1.5px solid #D4537E",
              background: "transparent",
              color: "#D4537E",
              padding: "8px 20px",
              borderRadius: "50px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            style={{
              border: "none",
              background: "linear-gradient(135deg, #D4537E, #993556)",
              color: "white",
              padding: "8px 20px",
              borderRadius: "50px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "4rem 1.5rem",
          overflow: "hidden",
        }}
      >
        {/* blobs */}
        {[
          {
            w: 400,
            h: 400,
            top: "-10%",
            left: "-10%",
            color: "rgba(212,83,126,0.12)",
          },
          {
            w: 350,
            h: 350,
            top: "60%",
            right: "-5%",
            color: "rgba(123,104,204,0.12)",
          },
          {
            w: 250,
            h: 250,
            top: "30%",
            left: "60%",
            color: "rgba(212,83,126,0.08)",
          },
        ].map((b, i) => (
          <div
            key={i}
            className="blob"
            style={{
              position: "absolute",
              width: b.w,
              height: b.h,
              top: b.top,
              left: b.left,
              right: b.right,
              background: b.color,
              borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
              filter: "blur(40px)",
              transition: "transform 3s ease-in-out",
              pointerEvents: "none",
            }}
          />
        ))}

        <div style={{ position: "relative", zIndex: 1, maxWidth: "720px" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(212,83,126,0.1)",
              border: "1px solid rgba(212,83,126,0.2)",
              borderRadius: "50px",
              padding: "6px 18px",
              fontSize: "13px",
              color: "#993556",
              fontWeight: 500,
              marginBottom: "1.5rem",
              letterSpacing: "0.5px",
            }}
          >
            For everyone. No shame. No taboo.
          </div>

          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              lineHeight: 1.1,
              color: "#2D1B2E",
              marginBottom: "1.5rem",
              fontWeight: 400,
            }}
          >
            Your gentle
            <br />
            <span style={{ fontStyle: "italic", color: "#D4537E" }}>
              cycle companion
            </span>
            <br />
            for every body
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              color: "#7A5C6E",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              fontWeight: 300,
            }}
          >
            Track periods, understand your body, ask questions freely,
            <br />
            and find comfort — whether you menstruate or just want to
            understand.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/signup")}
              style={{
                background: "linear-gradient(135deg, #D4537E, #993556)",
                color: "white",
                border: "none",
                padding: "14px 32px",
                borderRadius: "50px",
                fontSize: "16px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 8px 32px rgba(153,53,86,0.3)",
              }}
            >
              Start for free
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "white",
                color: "#993556",
                border: "1.5px solid rgba(212,83,126,0.3)",
                padding: "14px 32px",
                borderRadius: "50px",
                fontSize: "16px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              I have an account
            </button>
          </div>

          {/* floating quotes */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "3rem",
            }}
          >
            {quotes.map((q, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  border: "0.5px solid rgba(212,83,126,0.2)",
                  borderRadius: "50px",
                  padding: "8px 16px",
                  fontSize: "13px",
                  color: "#7A5C6E",
                  boxShadow: "0 2px 12px rgba(212,83,126,0.08)",
                }}
              >
                {q}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "5rem 1.5rem", background: "white" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                color: "#2D1B2E",
                fontWeight: 400,
                marginBottom: "1rem",
              }}
            >
              Everything you need,
              <br />
              <span style={{ fontStyle: "italic", color: "#7B68CC" }}>
                in one cozy space
              </span>
            </h2>
            <p
              style={{ color: "#7A5C6E", fontSize: "1.1rem", fontWeight: 300 }}
            >
              No judgment. No shame. Just support.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  background: "#FDF6F9",
                  border: "0.5px solid rgba(212,83,126,0.15)",
                  borderRadius: "20px",
                  padding: "1.75rem",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 40px rgba(212,83,126,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "1.2rem",
                    color: "#2D1B2E",
                    marginBottom: "0.5rem",
                    fontWeight: 400,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    color: "#7A5C6E",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    fontWeight: 300,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TABOO BREAKING SECTION */}
      <section
        style={{
          padding: "5rem 1.5rem",
          background: "linear-gradient(135deg, #FDF6F9, #F0EBF8)",
        }}
      >
        <div
          style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "#2D1B2E",
              fontWeight: 400,
              marginBottom: "1.5rem",
            }}
          >
            Periods are{" "}
            <span style={{ fontStyle: "italic", color: "#D4537E" }}>
              not shameful.
            </span>
            <br />
            Let's talk about them.
          </h2>
          <p
            style={{
              color: "#7A5C6E",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              fontWeight: 300,
              marginBottom: "2rem",
            }}
          >
            800 million people menstruate every day. Yet most of us grew up too
            shy to ask basic questions. FlowBuddy is for the girl who was too
            shy to ask her mom, the boy who wants to understand, the partner who
            wants to support, and everyone in between.
          </p>
          <button
            onClick={() => navigate("/signup")}
            style={{
              background: "linear-gradient(135deg, #7B68CC, #534AB7)",
              color: "white",
              border: "none",
              padding: "14px 32px",
              borderRadius: "50px",
              fontSize: "16px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 8px 32px rgba(83,74,183,0.3)",
            }}
          >
            Join FlowBuddy
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "2rem",
          textAlign: "center",
          background: "white",
          borderTop: "0.5px solid rgba(212,83,126,0.1)",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "1.2rem",
            color: "#993556",
            marginBottom: "0.5rem",
          }}
        >
          Flow
          <span style={{ fontStyle: "italic", color: "#7B68CC" }}>Buddy</span>{" "}
          🌸
        </div>
        <p
          style={{
            color: "#7A5C6E",
            fontSize: "13px",
            fontWeight: 300,
            marginBottom: "0.5rem",
          }}
        >
          Made with 💕 for everyone. Not a medical app — always consult a doctor
          for medical concerns.
        </p>
        <p style={{ color: "#7A5C6E", fontSize: "12px", fontWeight: 300 }}>
          © 2026 FlowBuddy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
