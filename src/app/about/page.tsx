"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

/* ─────────────────────────────────────────────────────────────────────────────
   Stat counter hook
───────────────────────────────────────────────────────────────────────────── */
const useCounter = (target: number, duration = 1800) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const t = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(t);
      } else setCount(start);
    }, 16);
    return () => clearInterval(t);
  }, [started, target, duration]);

  return { count, ref };
};

/* ─────────────────────────────────────────────────────────────────────────────
   Stat card
───────────────────────────────────────────────────────────────────────────── */
const StatCard = ({
  value,
  suffix,
  label,
  T,
  dark,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  T: Record<string, string>;
  dark: boolean;
  delay: number;
}) => {
  const { count, ref } = useCounter(value);
  return (
    <div
      ref={ref}
      style={{
        textAlign: "center",
        padding: "32px 24px",
        background: T.cardBg,
        border: `1px solid ${T.cardBorder}`,
        borderRadius: 20,
        animation: "fadeUp 0.6s ease both",
        animationDelay: `${delay}ms`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 2,
          background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
        }}
      />
      <div
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(2.2rem, 4vw, 3rem)",
          fontWeight: 400,
          color: T.gold,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        {count.toLocaleString()}
        {suffix}
      </div>
      <div
        style={{
          fontSize: 13,
          color: T.muted,
          fontWeight: 500,
          marginTop: 8,
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Value card
───────────────────────────────────────────────────────────────────────────── */
const ValueCard = ({
  icon,
  title,
  desc,
  accent,
  T,
  dark,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: string;
  T: Record<string, string>;
  dark: boolean;
  delay: number;
}) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "28px 24px",
        background: T.cardBg,
        border: `1px solid ${hover ? accent + "55" : T.cardBorder}`,
        borderRadius: 18,
        transition: "all 0.3s cubic-bezier(0.2,0,0,1)",
        transform: hover ? "translateY(-5px)" : "none",
        boxShadow: hover
          ? dark
            ? "0 20px 50px rgba(0,0,0,0.4)"
            : "0 20px 50px rgba(0,0,0,0.08)"
          : "none",
        animation: "fadeUp 0.6s ease both",
        animationDelay: `${delay}ms`,
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${accent}99, transparent)`,
          opacity: hover ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          marginBottom: 18,
          background: dark ? "#252523" : "#f5f2ed",
          border: `1px solid ${T.cardBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.3s",
          transform: hover ? "scale(1.06)" : "none",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15.5,
          fontWeight: 700,
          color: T.text,
          margin: "0 0 9px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 13.5,
          color: T.muted,
          lineHeight: 1.7,
          margin: 0,
          fontWeight: 300,
        }}
      >
        {desc}
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Team card
───────────────────────────────────────────────────────────────────────────── */
const TeamCard = ({
  initials,
  name,
  role,
  accent,
  T,
  dark,
  delay,
}: {
  initials: string;
  name: string;
  role: string;
  accent: string;
  T: Record<string, string>;
  dark: boolean;
  delay: number;
}) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "28px 20px 24px",
        background: T.cardBg,
        border: `1px solid ${hover ? accent + "44" : T.cardBorder}`,
        borderRadius: 18,
        textAlign: "center",
        transition: "all 0.3s cubic-bezier(0.2,0,0,1)",
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover
          ? dark
            ? "0 16px 40px rgba(0,0,0,0.35)"
            : "0 16px 40px rgba(0,0,0,0.07)"
          : "none",
        animation: "fadeUp 0.6s ease both",
        animationDelay: `${delay}ms`,
        cursor: "default",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${accent}33, ${accent}66)`,
          border: `2px solid ${accent}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          fontFamily: "'DM Serif Display', serif",
          fontSize: 24,
          color: accent,
          fontWeight: 400,
          transition: "transform 0.3s",
          transform: hover ? "scale(1.07)" : "none",
        }}
      >
        {initials}
      </div>
      <div
        style={{
          fontSize: 14.5,
          fontWeight: 700,
          color: T.text,
          marginBottom: 4,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontSize: 12,
          color: T.muted,
          fontWeight: 500,
          letterSpacing: "0.05em",
        }}
      >
        {role}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────────────────────── */
const About = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";
  const [hoverCta, setHoverCta] = useState(false);
  const [hoverSecondary, setHoverSecondary] = useState(false);

  useEffect(() => setMounted(true), []);

  const T: Record<string, string> = {
    bg: dark ? "#111110" : "#F7F4EF",
    surface: dark ? "#1a1a18" : "#ffffff",
    surfaceAlt: dark ? "#141413" : "#faf8f5",
    border: dark ? "#2a2a28" : "#e8e4dc",
    borderLight: dark ? "#222220" : "#f0ece5",
    text: dark ? "#f0ede8" : "#1a1a1a",
    muted: dark ? "#888" : "#666",
    faint: dark ? "#444" : "#bbb",
    gold: "#d4a017",
    goldLight: "#e8c350",
    btnBg: dark ? "#d4a017" : "#1a1a1a",
    btnColor: dark ? "#1a1a1a" : "#f0ede8",
    cardBg: dark ? "#1a1a18" : "#ffffff",
    cardBorder: dark ? "#2a2a28" : "#e8e4dc",
    headerBg: dark ? "#0d0d0c" : "#1a1a1a",
    divider: dark ? "#222220" : "#f0ece5",
  };

  const values = [
    {
      title: "Transparency",
      accent: "#3b82f6",
      desc: "We believe in open, honest communication at every step — from job listings to the hiring process.",
      icon: (
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      title: "Inclusivity",
      accent: "#8b5cf6",
      desc: "Every talent deserves a fair shot. We champion diverse candidates and equitable hiring practices.",
      icon: (
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Innovation",
      accent: "#10b981",
      desc: "AI-powered tools that help candidates prepare, apply smarter, and land roles they love.",
      icon: (
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      title: "Impact",
      accent: "#ef4444",
      desc: "Every placement is a life changed. We measure success by the growth of the people we connect.",
      icon: (
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      title: "Trust",
      accent: "#d4a017",
      desc: "Verified listings, transparent companies, and a community built on reliability and respect.",
      icon: (
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="#d4a017"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: "Growth",
      accent: "#f59e0b",
      desc: "Career guidance, skill roadmaps, and resources designed to help you grow continuously.",
      icon: (
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M23 6l-9.5 9.5-5-5L1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
  ];

  const team = [
    {
      initials: "AN",
      name: "Abilash Narayanan",
      role: "Founder & CEO",
      accent: "#d4a017",
    },
    {
      initials: "SVK",
      name: "Sajith VK",
      role: "Head of Product",
      accent: "#8b5cf6",
    },
    {
      initials: "TJ",
      name: "Thomas Jithin",
      role: "Lead Engineer",
      accent: "#10b981",
    },
    {
      initials: "AS",
      name: "Arun S",
      role: "Head of Design",
      accent: "#3b82f6",
    },
  ];

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes drift    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        * { box-sizing: border-box; }
      `}</style>

      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: T.bg,
          color: T.text,
          transition: "background 0.3s, color 0.3s",
        }}
      >
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header
          style={{
            background: T.headerBg,
            padding: "80px 24px 72px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 60% 80% at 75% 50%, rgba(212,160,23,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 15% 80%, rgba(139,92,246,0.07) 0%, transparent 60%)",
            }}
          />

          {/* Floating decorative ring */}
          <div
            style={{
              position: "absolute",
              right: "8%",
              top: "15%",
              width: 220,
              height: 220,
              borderRadius: "50%",
              border: "1.5px solid rgba(212,160,23,0.15)",
              animation: "drift 6s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "10.5%",
              top: "20%",
              width: 140,
              height: 140,
              borderRadius: "50%",
              border: "1px solid rgba(212,160,23,0.1)",
              animation: "drift 6s ease-in-out 1s infinite",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              position: "relative",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(212,160,23,0.12)",
                border: "1px solid rgba(212,160,23,0.25)",
                borderRadius: 100,
                padding: "6px 16px",
                fontSize: 11,
                fontWeight: 700,
                color: "#d4a017",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 24,
                animation: "fadeUp 0.5s ease both",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#d4a017",
                  animation: "pulse 2s infinite",
                }}
              />
              Our Story
            </div>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2.4rem, 6vw, 4rem)",
                fontWeight: 400,
                color: "#f0ede8",
                margin: "0 0 20px",
                letterSpacing: "-0.025em",
                lineHeight: 1.08,
                animation: "fadeUp 0.5s ease 0.1s both",
              }}
            >
              Built for people,{" "}
              <em style={{ fontStyle: "italic", color: "#d4a017" }}>not</em>{" "}
              just positions
            </h1>
            <p
              style={{
                fontSize: 17,
                fontWeight: 300,
                color: "rgba(240,237,232,0.55)",
                maxWidth: 560,
                margin: "0 auto",
                lineHeight: 1.75,
                animation: "fadeUp 0.5s ease 0.2s both",
              }}
            >
              CareerStack was founded on a simple belief — that finding
              meaningful work should be effortless, fair, and human.
            </p>
          </div>
        </header>

        {/* ── Stats bar ────────────────────────────────────────────────── */}
        <div
          style={{
            background: T.surface,
            borderBottom: `1px solid ${T.border}`,
            padding: "0 24px",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 0,
            }}
          >
            {[
              { value: 50000, suffix: "+", label: "Active Job Seekers" },
              { value: 3200, suffix: "+", label: "Partner Companies" },
              { value: 120000, suffix: "+", label: "Jobs Posted" },
              { value: 94, suffix: "%", label: "Placement Rate" },
            ].map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: "28px 20px",
                  textAlign: "center",
                  borderRight: i < 3 ? `1px solid ${T.border}` : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                    fontWeight: 400,
                    color: T.gold,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {s.value.toLocaleString()}
                  {s.suffix}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: T.muted,
                    fontWeight: 600,
                    marginTop: 6,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Mission ──────────────────────────────────────────────────── */}
        <section
          style={{ padding: "96px 24px", maxWidth: 1100, margin: "0 auto" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 64,
              alignItems: "center",
            }}
          >
            {/* Image */}
            <div
              style={{
                animation: "fadeUp 0.6s ease both",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: -12,
                  borderRadius: 28,
                  border: `1px solid rgba(212,160,23,0.2)`,
                  pointerEvents: "none",
                }}
              />
              <img
                src="/img1.png"
                alt="About CareerStack"
                style={{
                  width: "100%",
                  borderRadius: 20,
                  display: "block",
                  objectFit: "cover",
                  aspectRatio: "4/3",
                  border: `1px solid ${T.border}`,
                  boxShadow: dark
                    ? "0 32px 80px rgba(0,0,0,0.5)"
                    : "0 32px 80px rgba(0,0,0,0.1)",
                }}
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                }}
              />
              {/* Floating tag */}
              <div
                style={{
                  position: "absolute",
                  bottom: -18,
                  right: 24,
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: "12px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: dark
                    ? "0 8px 30px rgba(0,0,0,0.4)"
                    : "0 8px 30px rgba(0,0,0,0.1)",
                  animation: "fadeUp 0.7s ease 0.3s both",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: dark
                      ? "rgba(212,160,23,0.12)"
                      : "rgba(212,160,23,0.1)",
                    border: "1px solid rgba(212,160,23,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="#d4a017"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>
                    Founded 2026
                  </div>
                  <div style={{ fontSize: 11, color: T.muted }}>
                    Bengaluru, India
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div style={{ animation: "fadeUp 0.6s ease 0.15s both" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: dark
                    ? "rgba(212,160,23,0.08)"
                    : "rgba(212,160,23,0.07)",
                  border: "1px solid rgba(212,160,23,0.22)",
                  borderRadius: 100,
                  padding: "5px 14px",
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: T.gold,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                Our Mission
              </div>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.7rem)",
                  fontWeight: 400,
                  color: T.text,
                  margin: "0 0 20px",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                Connecting talent with{" "}
                <em style={{ fontStyle: "italic", color: T.gold }}>
                  opportunity
                </em>
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: T.muted,
                  lineHeight: 1.8,
                  margin: "0 0 16px",
                  fontWeight: 300,
                }}
              >
                At CareerStack, we're dedicated to revolutionizing the job
                search experience. Our mission is to create meaningful
                connections between talented individuals and forward-thinking
                companies, fostering growth and success for both.
              </p>
              <p
                style={{
                  fontSize: 15,
                  color: T.muted,
                  lineHeight: 1.8,
                  margin: 0,
                  fontWeight: 300,
                }}
              >
                We combine AI-powered tools with a human-first approach — giving
                every candidate the guidance, confidence, and access they need
                to land a role that truly fits.
              </p>

              {/* Decorative divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 32,
                }}
              >
                <div
                  style={{
                    height: 2,
                    flex: 1,
                    background: `linear-gradient(90deg, ${T.gold}, transparent)`,
                    borderRadius: 100,
                  }}
                />
                <svg width="14" height="14" fill={T.gold} viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <div
                  style={{
                    height: 2,
                    flex: 1,
                    background: `linear-gradient(90deg, transparent, ${T.gold})`,
                    borderRadius: 100,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Responsive override */}
          <style>{`
            @media (max-width: 700px) {
              .mission-grid { grid-template-columns: 1fr !important; }
              .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
              .stats-grid > div { border-right: none !important; border-bottom: 1px solid ${T.border}; }
            }
          `}</style>
        </section>

        {/* ── Values ───────────────────────────────────────────────────── */}
        <section
          style={{
            background: T.surfaceAlt,
            borderTop: `1px solid ${T.border}`,
            borderBottom: `1px solid ${T.border}`,
            padding: "96px 24px",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: dark
                    ? "rgba(139,92,246,0.1)"
                    : "rgba(139,92,246,0.07)",
                  border: "1px solid rgba(139,92,246,0.22)",
                  borderRadius: 100,
                  padding: "5px 14px",
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#8b5cf6",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                What We Stand For
              </div>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 400,
                  color: T.text,
                  margin: "0 0 14px",
                  letterSpacing: "-0.02em",
                }}
              >
                Our core{" "}
                <em style={{ fontStyle: "italic", color: T.gold }}>values</em>
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: T.muted,
                  maxWidth: 460,
                  margin: "0 auto",
                  fontWeight: 300,
                  lineHeight: 1.7,
                }}
              >
                These principles guide everything we build and every decision we
                make.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 18,
              }}
            >
              {values.map((v, i) => (
                <ValueCard
                  key={v.title}
                  {...v}
                  T={T}
                  dark={dark}
                  delay={i * 70}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ─────────────────────────────────────────────────────── */}
        <section style={{ padding: "96px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: dark
                    ? "rgba(16,185,129,0.1)"
                    : "rgba(16,185,129,0.07)",
                  border: "1px solid rgba(16,185,129,0.22)",
                  borderRadius: 100,
                  padding: "5px 14px",
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#10b981",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                The Team
              </div>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 400,
                  color: T.text,
                  margin: "0 0 14px",
                  letterSpacing: "-0.02em",
                }}
              >
                The people{" "}
                <em style={{ fontStyle: "italic", color: T.gold }}>behind</em>{" "}
                the mission
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: T.muted,
                  maxWidth: 460,
                  margin: "0 auto",
                  fontWeight: 300,
                  lineHeight: 1.7,
                }}
              >
                A small but mighty team passionate about transforming careers
                across India.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 18,
              }}
            >
              {team.map((m, i) => (
                <TeamCard
                  key={m.name}
                  {...m}
                  T={T}
                  dark={dark}
                  delay={i * 80}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section
          style={{
            background: T.headerBg,
            padding: "96px 24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 70% 80% at 50% 100%, rgba(212,160,23,0.1) 0%, transparent 65%)",
            }}
          />
          {/* Decorative rings */}
          <div
            style={{
              position: "absolute",
              left: "5%",
              bottom: "-10%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              border: "1px solid rgba(212,160,23,0.1)",
              animation: "drift 8s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "5%",
              top: "-10%",
              width: 260,
              height: 260,
              borderRadius: "50%",
              border: "1px solid rgba(212,160,23,0.08)",
              animation: "drift 8s ease-in-out 2s infinite",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: 680,
              margin: "0 auto",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(212,160,23,0.12)",
                border: "1px solid rgba(212,160,23,0.25)",
                borderRadius: 100,
                padding: "6px 16px",
                fontSize: 11,
                fontWeight: 700,
                color: "#d4a017",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 24,
                animation: "fadeUp 0.5s ease both",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#d4a017",
                  animation: "pulse 2s infinite",
                }}
              />
              Start Today
            </div>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2rem, 5vw, 3.4rem)",
                fontWeight: 400,
                color: "#f0ede8",
                margin: "0 0 16px",
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                animation: "fadeUp 0.5s ease 0.1s both",
              }}
            >
              Ready to find your{" "}
              <em style={{ fontStyle: "italic", color: "#d4a017" }}>
                dream job?
              </em>
            </h2>
            <p
              style={{
                fontSize: 16,
                fontWeight: 300,
                color: "rgba(240,237,232,0.55)",
                margin: "0 0 40px",
                lineHeight: 1.75,
                animation: "fadeUp 0.5s ease 0.2s both",
              }}
            >
              Join thousands of successful job seekers on CareerStack. Your next
              great role is waiting.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                flexWrap: "wrap",
                animation: "fadeUp 0.5s ease 0.3s both",
              }}
            >
              <Link href="/jobs" style={{ textDecoration: "none" }}>
                <button
                  onMouseEnter={() => setHoverCta(true)}
                  onMouseLeave={() => setHoverCta(false)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    height: 54,
                    padding: "0 32px",
                    background: hoverCta ? "#d4a017" : "#d4a017",
                    color: "#1a1a1a",
                    border: "none",
                    borderRadius: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.25s",
                    letterSpacing: "0.03em",
                    transform: hoverCta ? "translateY(-3px)" : "none",
                    boxShadow: hoverCta
                      ? "0 16px 40px rgba(212,160,23,0.4)"
                      : "0 4px 20px rgba(212,160,23,0.2)",
                  }}
                >
                  Browse Jobs
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    style={{
                      transition: "transform 0.2s",
                      transform: hoverCta ? "translateX(4px)" : "none",
                    }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>

              <Link href="/register" style={{ textDecoration: "none" }}>
                <button
                  onMouseEnter={() => setHoverSecondary(true)}
                  onMouseLeave={() => setHoverSecondary(false)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    height: 54,
                    padding: "0 28px",
                    background: "transparent",
                    color: hoverSecondary
                      ? "#d4a017"
                      : "rgba(240,237,232,0.75)",
                    border: `1.5px solid ${hoverSecondary ? "rgba(212,160,23,0.6)" : "rgba(240,237,232,0.2)"}`,
                    borderRadius: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.25s",
                    letterSpacing: "0.03em",
                    transform: hoverSecondary ? "translateY(-3px)" : "none",
                  }}
                >
                  Create Account
                </button>
              </Link>
            </div>

            {/* Social proof */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginTop: 32,
                animation: "fadeUp 0.5s ease 0.4s both",
              }}
            >
              <div style={{ display: "flex" }}>
                {["#d4a017", "#8b5cf6", "#10b981", "#3b82f6"].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${c}55, ${c}99)`,
                      border: "2px solid rgba(240,237,232,0.15)",
                      marginLeft: i === 0 ? 0 : -8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      color: c,
                      fontWeight: 700,
                    }}
                  >
                    {["A", "S", "T", "A"][i]}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 12.5, color: "rgba(240,237,232,0.4)" }}>
                Join{" "}
                <strong style={{ color: "rgba(240,237,232,0.7)" }}>
                  50,000+
                </strong>{" "}
                job seekers already on CareerStack
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
