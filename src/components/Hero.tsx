"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Search,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

/* ─────────────────────────────────────────────────────────────────────────────
   Animated counter hook
───────────────────────────────────────────────────────────────────────────── */
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Stat item
───────────────────────────────────────────────────────────────────────────── */
const StatItem = ({
  value,
  suffix,
  label,
  dark,
  animStart,
}: {
  value: number;
  suffix: string;
  label: string;
  dark: boolean;
  animStart: boolean;
}) => {
  const count = useCounter(value, 1800, animStart);
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
          fontWeight: 400,
          color: "#d4a017",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {count.toLocaleString()}
        {suffix}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: dark ? "rgba(240,237,232,0.45)" : "rgba(26,26,26,0.5)",
          marginTop: 5,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Hero
───────────────────────────────────────────────────────────────────────────── */
const Hero = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [animStart, setAnimStart] = useState(false);
  const [hoverBrowse, setHoverBrowse] = useState(false);
  const [hoverLearn, setHoverLearn] = useState(false);

  const dark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setAnimStart(true), 400);
    return () => clearTimeout(t);
  }, []);

  /* ── Theme tokens ──────────────────────────────────────────────────────── */
  const T = {
    bg: dark ? "#0d0d0c" : "#F7F4EF",
    text: dark ? "#f0ede8" : "#1a1a1a",
    muted: dark ? "rgba(240,237,232,0.5)" : "rgba(26,26,26,0.55)",
    faint: dark ? "rgba(240,237,232,0.25)" : "rgba(26,26,26,0.25)",
    gold: "#d4a017",
    goldLight: "#e8c350",
    surface: dark ? "rgba(255,255,255,0.04)" : "rgba(26,26,26,0.04)",
    surfaceBorder: dark ? "rgba(255,255,255,0.08)" : "rgba(26,26,26,0.1)",
    badgeBg: dark ? "rgba(212,160,23,0.12)" : "rgba(212,160,23,0.1)",
    badgeBorder: dark ? "rgba(212,160,23,0.28)" : "rgba(212,160,23,0.3)",
    btnPrimaryBg: dark ? "#d4a017" : "#1a1a1a",
    btnPrimaryColor: dark ? "#1a1a1a" : "#f0ede8",
    btnSecondaryBorder: dark ? "rgba(240,237,232,0.18)" : "rgba(26,26,26,0.18)",
    btnSecondaryColor: dark ? "rgba(240,237,232,0.75)" : "rgba(26,26,26,0.75)",
    divider: dark ? "rgba(255,255,255,0.07)" : "rgba(26,26,26,0.08)",
    companiesDot: dark ? "rgba(240,237,232,0.15)" : "rgba(26,26,26,0.15)",
    cardBg: dark ? "#1a1a18" : "#ffffff",
    cardBorder: dark ? "#2a2a28" : "#e8e4dc",
    cardIconBg: dark ? "#252523" : "#f5f2ed",
    cardSubtext: dark ? "#666" : "#999",
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeRight { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(0.8)} }
        .hero-badge   { animation: fadeRight 0.5s ease 0.1s both; }
        .hero-heading { animation: fadeUp 0.6s ease 0.2s both; }
        .hero-sub     { animation: fadeUp 0.6s ease 0.35s both; }
        .hero-stats   { animation: fadeUp 0.6s ease 0.5s both; }
        .hero-btns    { animation: fadeUp 0.6s ease 0.65s both; }
        .hero-trust   { animation: fadeUp 0.6s ease 0.8s both; }
        .hero-img     { animation: fadeIn 0.9s ease 0.4s both; }
        .hero-float   { animation: floatY 5s ease-in-out infinite; }
        .float-card   { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .float-card:hover { transform: translateY(-5px) !important; }
        .trust-name   { transition: color 0.2s; }
        @media (max-width: 800px) {
          .hero-grid { grid-template-columns: 1fr !important; padding: 60px 24px !important; }
          .hero-right { display: none !important; }
          .hero-left  { align-items: center !important; }
          .hero-left h1,
          .hero-left p { text-align: center !important; }
          .hero-left p { margin: 0 auto !important; }
          .hero-btns-row { justify-content: center !important; }
          .hero-trust-row { justify-content: center !important; }
          .hero-trust p { text-align: center !important; }
        }
      `}</style>

      <section
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: T.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          transition: "background 0.3s",
        }}
      >
        {/* ── Atmospheric background ──────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-10%",
              left: "-5%",
              width: "55vw",
              height: "55vw",
              borderRadius: "50%",
              background: dark
                ? "radial-gradient(circle, rgba(212,160,23,0.07) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(212,160,23,0.1) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-15%",
              right: "-10%",
              width: "60vw",
              height: "60vw",
              borderRadius: "50%",
              background: dark
                ? "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: dark
                ? `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`
                : `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
              maskImage:
                "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: "30%",
              width: 1,
              height: "100%",
              background: dark
                ? "linear-gradient(180deg, transparent 0%, rgba(212,160,23,0.12) 40%, rgba(212,160,23,0.06) 70%, transparent 100%)"
                : "linear-gradient(180deg, transparent 0%, rgba(212,160,23,0.15) 40%, rgba(212,160,23,0.08) 70%, transparent 100%)",
              transform: "skewX(-8deg)",
            }}
          />
        </div>

        {/* ── Content grid ────────────────────────────────────────────── */}
        <div
          className="hero-grid"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "80px 32px",
            width: "100%",
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(40px, 6vw, 100px)",
            alignItems: "center",
          }}
        >
          {/* ── LEFT: Copy ──────────────────────────────────────────── */}
          <div
            className="hero-left"
            style={{ display: "flex", flexDirection: "column", gap: 28 }}
          >
            {/* Badge */}
            <div
              className="hero-badge"
              style={{ display: "inline-flex", alignSelf: "flex-start" }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 16px",
                  borderRadius: 100,
                  background: T.badgeBg,
                  border: `1px solid ${T.badgeBorder}`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: T.gold,
                    animation: "pulse 2s infinite",
                    flexShrink: 0,
                  }}
                />
                <TrendingUp size={13} color={T.gold} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: T.gold,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  #1 Job Platform in India
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="hero-heading">
              <h1
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(2.6rem, 5vw, 4.2rem)",
                  fontWeight: 400,
                  lineHeight: 1.08,
                  letterSpacing: "-0.025em",
                  color: T.text,
                  margin: 0,
                }}
              >
                Find your next{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    color: T.gold,
                    display: "inline-block",
                    position: "relative",
                  }}
                >
                  great
                  <span
                    style={{
                      position: "absolute",
                      bottom: -4,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight}, transparent)`,
                      borderRadius: 100,
                    }}
                  />
                </em>{" "}
                role at{" "}
                <span
                  style={{
                    display: "inline-block",
                    backgroundImage: dark
                      ? "linear-gradient(135deg, #f0ede8 30%, #d4a017 100%)"
                      : "linear-gradient(135deg, #1a1a1a 30%, #d4a017 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Career
                  <span
                    style={{
                      background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Stack
                  </span>
                </span>
              </h1>
            </div>

            {/* Sub */}
            <p
              className="hero-sub"
              style={{
                fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                fontWeight: 300,
                color: T.muted,
                lineHeight: 1.75,
                margin: 0,
                maxWidth: 460,
              }}
            >
              Connect with top employers and discover opportunities tailored to
              your skills. Your dream role is one click away.
            </p>

            {/* Stats */}
            <div
              className="hero-stats"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 32,
                padding: "22px 26px",
                background: T.surface,
                border: `1px solid ${T.surfaceBorder}`,
                borderRadius: 16,
                backdropFilter: "blur(12px)",
                flexWrap: "wrap",
              }}
            >
              <StatItem
                value={10}
                suffix="K+"
                label="Active Jobs"
                dark={dark}
                animStart={animStart}
              />
              <div
                style={{
                  width: 1,
                  height: 40,
                  background: T.divider,
                  flexShrink: 0,
                }}
              />
              <StatItem
                value={52}
                suffix="K+"
                label="Companies"
                dark={dark}
                animStart={animStart}
              />
              <div
                style={{
                  width: 1,
                  height: 40,
                  background: T.divider,
                  flexShrink: 0,
                }}
              />
              <StatItem
                value={235}
                suffix="K+"
                label="Job Seekers"
                dark={dark}
                animStart={animStart}
              />
            </div>

            {/* Buttons */}
            <div
              className="hero-btns hero-btns-row"
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <Link href="/jobs" style={{ textDecoration: "none" }}>
                <button
                  onMouseEnter={() => setHoverBrowse(true)}
                  onMouseLeave={() => setHoverBrowse(false)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    height: 50,
                    padding: "0 28px",
                    background: hoverBrowse ? T.gold : T.btnPrimaryBg,
                    color: hoverBrowse ? "#1a1a1a" : T.btnPrimaryColor,
                    border: "none",
                    borderRadius: 12,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    cursor: "pointer",
                    transition: "all 0.22s cubic-bezier(0.2,0,0,1)",
                    transform: hoverBrowse ? "translateY(-2px)" : "none",
                    boxShadow: hoverBrowse
                      ? "0 10px 32px rgba(212,160,23,0.35)"
                      : dark
                        ? "0 4px 20px rgba(0,0,0,0.4)"
                        : "0 4px 20px rgba(0,0,0,0.15)",
                  }}
                >
                  <Search size={16} />
                  Browse Jobs
                  <ArrowRight
                    size={16}
                    style={{
                      transition: "transform 0.2s",
                      transform: hoverBrowse ? "translateX(4px)" : "none",
                    }}
                  />
                </button>
              </Link>

              <Link href="/about" style={{ textDecoration: "none" }}>
                <button
                  onMouseEnter={() => setHoverLearn(true)}
                  onMouseLeave={() => setHoverLearn(false)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    height: 50,
                    padding: "0 28px",
                    background: hoverLearn
                      ? dark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(26,26,26,0.05)"
                      : "transparent",
                    color: hoverLearn ? T.text : T.btnSecondaryColor,
                    border: `1.5px solid ${
                      hoverLearn
                        ? dark
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(26,26,26,0.25)"
                        : T.btnSecondaryBorder
                    }`,
                    borderRadius: 12,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    cursor: "pointer",
                    transition: "all 0.22s",
                    transform: hoverLearn ? "translateY(-2px)" : "none",
                  }}
                >
                  <Briefcase size={16} />
                  Learn More
                </button>
              </Link>
            </div>

            {/* Trust */}
            <div className="hero-trust">
              <p
                style={{
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: T.faint,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Trusted by professionals from
              </p>
              <div
                className="hero-trust-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                {["Google", "Amazon", "Microsoft", "Meta", "Netflix"].map(
                  (name, i) => (
                    <React.Fragment key={name}>
                      {i !== 0 && (
                        <span
                          style={{
                            width: 3,
                            height: 3,
                            borderRadius: "50%",
                            background: T.companiesDot,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <span
                        className="trust-name"
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: T.muted,
                          letterSpacing: "0.02em",
                        }}
                        onMouseEnter={(e) =>
                          ((e.target as HTMLSpanElement).style.color = T.gold)
                        }
                        onMouseLeave={(e) =>
                          ((e.target as HTMLSpanElement).style.color = T.muted)
                        }
                      >
                        {name}
                      </span>
                    </React.Fragment>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Illustration ──────────────────────────────────── */}
          <div
            className="hero-img hero-right"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Glow */}
            <div
              style={{
                position: "absolute",
                width: "75%",
                aspectRatio: "1",
                borderRadius: "50%",
                background: dark
                  ? "radial-gradient(circle, rgba(212,160,23,0.12) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(212,160,23,0.15) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />
            {/* Decorative rings */}
            <div
              style={{
                position: "absolute",
                width: "80%",
                aspectRatio: "1",
                borderRadius: "50%",
                border: `1px solid ${dark ? "rgba(212,160,23,0.1)" : "rgba(212,160,23,0.12)"}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "95%",
                aspectRatio: "1",
                borderRadius: "50%",
                border: `1px dashed ${dark ? "rgba(212,160,23,0.05)" : "rgba(212,160,23,0.08)"}`,
              }}
            />

            {/* Floating image */}
            <div
              className="hero-float border-red-900 "
              style={{
                position: "relative",
                width: "clamp(260px, 38vw, 500px)",
                aspectRatio: "1",
                zIndex: 2,
              }}
            >
              <Image
                src="/career.png"
                alt="Job search illustration"
                fill
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                 priority
              />
            </div>

            {/* Float card: Active Jobs */}
            <div
              className="float-card"
              style={{
                position: "absolute",
                top: "12%",
                left: "0%",
                background: T.cardBg,
                border: `1px solid ${T.cardBorder}`,
                borderRadius: 14,
                padding: "12px 16px",
                boxShadow: dark
                  ? "0 16px 48px rgba(0,0,0,0.5)"
                  : "0 16px 48px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                animation: "fadeUp 0.7s ease 0.8s both",
                zIndex: 3,
                minWidth: 160,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: T.cardIconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Briefcase size={16} color={T.gold} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 18,
                    fontWeight: 400,
                    color: T.text,
                    lineHeight: 1,
                  }}
                >
                  10K+
                </div>
                <div
                  style={{ fontSize: 11, color: T.cardSubtext, marginTop: 2 }}
                >
                  Open Positions
                </div>
              </div>
            </div>

            {/* Float card: New Match */}
            <div
              className="float-card"
              style={{
                position: "absolute",
                bottom: "14%",
                right: "-2%",
                background: dark
                  ? "linear-gradient(135deg, #1a1505, #201a08)"
                  : "linear-gradient(135deg, #fefce8, #fdf6d3)",
                border: `1px solid ${dark ? "#3a3010" : "#fde68a"}`,
                borderRadius: 14,
                padding: "12px 16px",
                boxShadow: dark
                  ? "0 16px 48px rgba(0,0,0,0.5)"
                  : "0 16px 48px rgba(212,160,23,0.15)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                animation: "fadeUp 0.7s ease 1.0s both",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(212,160,23,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Sparkles size={16} color={T.gold} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: dark ? "#f0ede8" : "#1a1a1a",
                    lineHeight: 1.2,
                  }}
                >
                  New Match Found!
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: dark ? "#a07a20" : "#b45309",
                    marginTop: 2,
                  }}
                >
                  3 roles suit your profile
                </div>
              </div>
            </div>

            {/* Hiring badge */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: "2%",
                transform: "translateY(-50%)",
                background: dark ? "#052e16" : "#f0fdf4",
                border: `1px solid ${dark ? "#14532d" : "#bbf7d0"}`,
                borderRadius: 100,
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                animation: "fadeUp 0.7s ease 1.2s both",
                zIndex: 3,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#22c55e",
                  animation: "pulse 2s infinite",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: dark ? "#4ade80" : "#15803d",
                  whiteSpace: "nowrap",
                }}
              >
                52K+ Hiring Now
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
