"use client";
import React, { useState, useEffect, useRef } from "react";
import { CareerGuideResponse } from "@/lib/type";
import axios from "axios";
import { Utils_Service } from "@/context/AppContext";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
type FeatureCard = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: string;
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────────────────── */
const CareerGuide = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CareerGuideResponse | null>(null);
  const [currentSkill, setCurrentSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [focusSkill, setFocusSkill] = useState(false);
  const [hoverAdd, setHoverAdd] = useState(false);
  const [hoverGenerate, setHoverGenerate] = useState(false);
  const [hoverReset, setHoverReset] = useState(false);
  const [hoverCta, setHoverCta] = useState(false);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [expandedCat, setExpandedCat] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on outside click
  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        resetDialog();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [modalOpen]);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  /* ── Theme tokens ──────────────────────────────────────────────────────── */
  const T = {
    bg: dark ? "#111110" : "#F7F4EF",
    surface: dark ? "#1a1a18" : "#ffffff",
    surfaceAlt: dark ? "#141413" : "#faf8f5",
    border: dark ? "#2a2a28" : "#e8e4dc",
    borderLight: dark ? "#222220" : "#f0ece5",
    text: dark ? "#f0ede8" : "#1a1a1a",
    muted: dark ? "#888" : "#666",
    faint: dark ? "#444" : "#ccc",
    gold: "#d4a017",
    goldLight: "#e8c350",
    btnBg: dark ? "#d4a017" : "#1a1a1a",
    btnColor: dark ? "#1a1a1a" : "#f0ede8",
    inputBg: dark ? "#111110" : "#ffffff",
    inputBorder: dark ? "#2a2a28" : "#e0dcd5",
    tagBg: dark ? "#1e1d1b" : "#f5f2ed",
    tagBorder: dark ? "#333330" : "#e8e4dc",
    tagColor: dark ? "#ccc" : "#444",
    cardBg: dark ? "#1a1a18" : "#ffffff",
    cardBorder: dark ? "#2a2a28" : "#e8e4dc",
    divider: dark ? "#222220" : "#f0ece5",
    overlay: dark ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.45)",
    modalBg: dark ? "#1a1a18" : "#ffffff",
    successGreen: "#16a34a",
  };

  /* ── Skill handlers ──────────────────────────────────────────────────── */
  const addSkill = () => {
    const s = currentSkill.trim();
    if (s && !skills.includes(s)) {
      setSkills((prev) => [...prev, s]);
      setCurrentSkill("");
      inputRef.current?.focus();
    }
  };
  const removeSkill = (s: string) =>
    setSkills((prev) => prev.filter((x) => x !== s));
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  /* ── API ─────────────────────────────────────────────────────────────── */
  const getCareerGuidance = async () => {
    if (skills.length === 0) {
      toast.error("Add at least one skill");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${Utils_Service}/api/utils/careerGuidance`,
        { skills },
      );
      setResponse(data);
      toast.success("Career guidance generated!");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to generate guidance",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setSkills([]);
    setCurrentSkill("");
    setResponse(null);
    setModalOpen(false);
    setExpandedJob(null);
    setExpandedCat(null);
  };

  /* ── Feature cards data ──────────────────────────────────────────────── */
  const features: FeatureCard[] = [
    {
      title: "Skill Analysis",
      desc: "Analyze your current skills and identify gaps needed for your dream role.",
      accent: "#3b82f6",
      icon: (
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
        </svg>
      ),
    },
    {
      title: "Career Matching",
      desc: "Discover the best career opportunities perfectly tailored to your profile.",
      accent: "#8b5cf6",
      icon: (
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      ),
    },
    {
      title: "Learning Roadmap",
      desc: "Get step-by-step learning paths to level up your skillset efficiently.",
      accent: "#10b981",
      icon: (
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    {
      title: "AI Suggestions",
      desc: "Receive intelligent job and skill recommendations powered by AI.",
      accent: "#f59e0b",
      icon: (
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  if (!mounted) return null;

  /* ── Shared styles ───────────────────────────────────────────────────── */
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: T.muted,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 8,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer   { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        input::placeholder   { color: ${T.faint}; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 10px; }
      `}</style>

      <section
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: T.bg,
          color: T.text,
          padding: "96px 24px",
          position: "relative",
          overflow: "hidden",
          transition: "background 0.3s, color 0.3s",
        }}
      >
        {/* Background blobs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              top: "5%",
              left: "8%",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: dark
                ? "rgba(212,160,23,0.05)"
                : "rgba(212,160,23,0.07)",
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "5%",
              right: "8%",
              width: 350,
              height: 350,
              borderRadius: "50%",
              background: dark
                ? "rgba(139,92,246,0.05)"
                : "rgba(139,92,246,0.07)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          {/* ── Header ─────────────────────────────────────────────────── */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 72,
              animation: "fadeUp 0.5s ease both",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: dark
                  ? "rgba(212,160,23,0.1)"
                  : "rgba(212,160,23,0.09)",
                border: "1px solid rgba(212,160,23,0.25)",
                borderRadius: 100,
                padding: "6px 16px",
                fontSize: 11,
                fontWeight: 700,
                color: T.gold,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: T.gold,
                  animation: "pulse 2s infinite",
                }}
              />
              AI-Powered Career Guidance
            </div>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2rem, 5vw, 3.4rem)",
                fontWeight: 400,
                color: T.text,
                margin: "0 0 16px",
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
              }}
            >
              Discover your{" "}
              <em style={{ fontStyle: "italic", color: T.gold }}>
                career path
              </em>
            </h2>
            <p
              style={{
                fontSize: 16,
                fontWeight: 300,
                color: T.muted,
                maxWidth: 520,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Get personalized job recommendations and learning roadmaps based
              on your skills, interests, and industry demand.
            </p>
          </div>

          {/* ── Feature cards grid ────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
              marginBottom: 60,
            }}
          >
            {features.map((f, i) => (
              <FeatureCardComponent
                key={f.title}
                f={f}
                T={T}
                dark={dark}
                delay={i * 80}
              />
            ))}
          </div>

          {/* ── CTA button ───────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              animation: "fadeUp 0.5s ease 0.3s both",
            }}
          >
            <button
              onClick={() => setModalOpen(true)}
              onMouseEnter={() => setHoverCta(true)}
              onMouseLeave={() => setHoverCta(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                height: 54,
                padding: "0 32px",
                background: hoverCta ? "#d4a017" : T.btnBg,
                color: hoverCta ? "#1a1a1a" : T.btnColor,
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
                  ? "0 16px 40px rgba(212,160,23,0.35)"
                  : dark
                    ? "0 4px 20px rgba(0,0,0,0.4)"
                    : "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Get Career Guidance
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
          </div>
        </div>
      </section>

      {/* ── Modal overlay ────────────────────────────────────────────────── */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: T.overlay,
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            animation: "fadeIn 0.2s ease both",
          }}
        >
          <div
            ref={modalRef}
            style={{
              width: "100%",
              maxWidth: 720,
              maxHeight: "90vh",
              background: T.modalBg,
              border: `1px solid ${T.border}`,
              borderRadius: 24,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              animation: "slideUp 0.3s ease both",
              boxShadow: dark
                ? "0 40px 100px rgba(0,0,0,0.7)"
                : "0 40px 100px rgba(0,0,0,0.18)",
              position: "relative",
            }}
          >
            {/* Gold top accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 32,
                right: 32,
                height: 3,
                background: `linear-gradient(90deg, transparent, ${T.gold}, ${T.goldLight}, ${T.gold}, transparent)`,
                borderRadius: "0 0 4px 4px",
              }}
            />

            {/* Modal header */}
            <div
              style={{
                padding: "28px 32px 20px",
                borderBottom: `1px solid ${T.borderLight}`,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: dark
                        ? "rgba(212,160,23,0.12)"
                        : "rgba(212,160,23,0.1)",
                      border: "1px solid rgba(212,160,23,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {response ? (
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke={T.gold}
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke={T.gold}
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: 22,
                        fontWeight: 400,
                        color: T.text,
                        margin: 0,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {response ? "Your Career Guide" : "Tell us your skills"}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: T.muted,
                        margin: "3px 0 0",
                      }}
                    >
                      {response
                        ? `Personalized for: ${skills.join(", ")}`
                        : "Add skills to receive personalized recommendations"}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={resetDialog}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: dark ? "#252523" : "#f5f2ed",
                  border: `1px solid ${T.border}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: T.muted,
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div
              style={{ flex: 1, overflowY: "auto", padding: "24px 32px 32px" }}
            >
              {/* ── Input view ─────────────────────────────────────────── */}
              {!response && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <div>
                    <label style={labelStyle}>Add Your Skills</label>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ flex: 1, position: "relative" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: focusSkill ? T.gold : T.faint,
                            pointerEvents: "none",
                            transition: "color 0.2s",
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </span>
                        <input
                          ref={inputRef}
                          type="text"
                          placeholder="e.g. React, Python, Node.js…"
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          onKeyDown={handleKey}
                          onFocus={() => setFocusSkill(true)}
                          onBlur={() => setFocusSkill(false)}
                          style={{
                            width: "100%",
                            height: 46,
                            paddingLeft: 42,
                            paddingRight: 16,
                            background: T.inputBg,
                            border: `1.5px solid ${focusSkill ? T.gold : T.inputBorder}`,
                            borderRadius: 10,
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 14,
                            color: T.text,
                            outline: "none",
                            transition: "border-color 0.2s, box-shadow 0.2s",
                            boxShadow: focusSkill
                              ? "0 0 0 3px rgba(212,160,23,0.15)"
                              : "none",
                          }}
                        />
                      </div>
                      <button
                        onClick={addSkill}
                        onMouseEnter={() => setHoverAdd(true)}
                        onMouseLeave={() => setHoverAdd(false)}
                        style={{
                          height: 46,
                          padding: "0 20px",
                          background: hoverAdd ? "#d4a017" : T.btnBg,
                          color: hoverAdd ? "#1a1a1a" : T.btnColor,
                          border: "none",
                          borderRadius: 10,
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add
                      </button>
                    </div>
                    <p style={{ fontSize: 11.5, color: T.faint, marginTop: 7 }}>
                      Press Enter or click Add · Add multiple skills for better
                      results
                    </p>
                  </div>

                  {/* Skills list */}
                  {skills.length > 0 && (
                    <div>
                      <label style={labelStyle}>
                        Your Skills ({skills.length})
                      </label>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                      >
                        {skills.map((s) => (
                          <div
                            key={s}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "6px 10px 6px 14px",
                              background: dark
                                ? "rgba(212,160,23,0.08)"
                                : "rgba(212,160,23,0.07)",
                              border: `1px solid rgba(212,160,23,0.25)`,
                              borderRadius: 100,
                              animation: "fadeUp 0.2s ease both",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: dark ? "#e5c56d" : "#92610a",
                              }}
                            >
                              {s}
                            </span>
                            <button
                              onClick={() => removeSkill(s)}
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                background: dark
                                  ? "rgba(239,68,68,0.2)"
                                  : "#fee2e2",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ef4444",
                                padding: 0,
                                transition: "background 0.15s",
                              }}
                            >
                              <svg
                                width="9"
                                height="9"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Generate button */}
                  <button
                    onClick={getCareerGuidance}
                    disabled={loading || skills.length === 0}
                    onMouseEnter={() => setHoverGenerate(true)}
                    onMouseLeave={() => setHoverGenerate(false)}
                    style={{
                      width: "100%",
                      height: 50,
                      background:
                        skills.length === 0
                          ? dark
                            ? "#252523"
                            : "#f0ece5"
                          : hoverGenerate
                            ? "#d4a017"
                            : T.btnBg,
                      color:
                        skills.length === 0
                          ? T.faint
                          : hoverGenerate
                            ? "#1a1a1a"
                            : T.btnColor,
                      border: "none",
                      borderRadius: 12,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor:
                        loading || skills.length === 0
                          ? "not-allowed"
                          : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 9,
                      transition: "all 0.25s",
                      letterSpacing: "0.03em",
                      opacity: loading ? 0.8 : 1,
                      transform:
                        hoverGenerate && skills.length > 0 && !loading
                          ? "translateY(-1px)"
                          : "none",
                      boxShadow:
                        hoverGenerate && skills.length > 0
                          ? "0 8px 24px rgba(212,160,23,0.3)"
                          : "none",
                      marginTop: 4,
                    }}
                  >
                    {loading ? (
                      <>
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            border: `2.5px solid ${T.btnColor}`,
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            animation: "spin 0.7s linear infinite",
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        Analyzing your skills…
                      </>
                    ) : (
                      <>
                        <svg
                          width="17"
                          height="17"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Generate Career Guidance
                        <svg
                          width="15"
                          height="15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* ── Response view ─────────────────────────────────────── */}
              {response && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    animation: "fadeUp 0.35s ease both",
                  }}
                >
                  {/* Summary */}
                  <div
                    style={{
                      padding: "20px 22px",
                      background: dark
                        ? "rgba(212,160,23,0.07)"
                        : "rgba(212,160,23,0.06)",
                      border: `1px solid rgba(212,160,23,0.2)`,
                      borderRadius: 14,
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        flexShrink: 0,
                        background: dark
                          ? "rgba(212,160,23,0.15)"
                          : "rgba(212,160,23,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke={T.gold}
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: T.gold,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        Career Summary
                      </div>
                      <p
                        style={{
                          fontSize: 14,
                          color: T.text,
                          lineHeight: 1.75,
                          margin: 0,
                          fontWeight: 300,
                        }}
                      >
                        {response.summary}
                      </p>
                    </div>
                  </div>

                  {/* Job Options */}
                  <div>
                    <SectionHeader
                      icon={
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke={T.gold}
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <rect x="2" y="7" width="20" height="14" rx="2" />
                          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                        </svg>
                      }
                      label="Recommended Career Paths"
                      count={response.jobOptions.length}
                      T={T}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        marginTop: 12,
                      }}
                    >
                      {response.jobOptions.map((job, i) => (
                        <div
                          key={i}
                          style={{
                            border: `1px solid ${expandedJob === i ? T.gold : T.cardBorder}`,
                            borderRadius: 12,
                            overflow: "hidden",
                            background: T.cardBg,
                            transition: "border-color 0.2s",
                          }}
                        >
                          <button
                            onClick={() =>
                              setExpandedJob(expandedJob === i ? null : i)
                            }
                            style={{
                              width: "100%",
                              padding: "14px 18px",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <div
                                style={{
                                  width: 26,
                                  height: 26,
                                  borderRadius: 6,
                                  background: dark ? "#252523" : "#f5f2ed",
                                  border: `1px solid ${T.border}`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: T.gold,
                                  flexShrink: 0,
                                }}
                              >
                                {i + 1}
                              </div>
                              <span
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: T.text,
                                }}
                              >
                                {job.title}
                              </span>
                            </div>
                            <svg
                              width="14"
                              height="14"
                              fill="none"
                              stroke={T.muted}
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              style={{
                                transition: "transform 0.2s",
                                transform:
                                  expandedJob === i ? "rotate(180deg)" : "none",
                                flexShrink: 0,
                              }}
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>

                          {expandedJob === i && (
                            <div
                              style={{
                                padding: "0 18px 18px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                                borderTop: `1px solid ${T.divider}`,
                                animation: "fadeUp 0.2s ease both",
                              }}
                            >
                              <InfoBlock
                                label="Responsibilities"
                                value={job.responsibilites}
                                T={T}
                              />
                              <InfoBlock
                                label="Why this role"
                                value={job.why}
                                T={T}
                                accent
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills to Learn */}
                  <div>
                    <SectionHeader
                      icon={
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke={T.gold}
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                      }
                      label="Skills to Enhance"
                      count={response.skillsToLearn.length}
                      T={T}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        marginTop: 12,
                      }}
                    >
                      {response.skillsToLearn.map((cat, ci) => (
                        <div
                          key={ci}
                          style={{
                            border: `1px solid ${expandedCat === ci ? T.gold : T.cardBorder}`,
                            borderRadius: 12,
                            overflow: "hidden",
                            background: T.cardBg,
                            transition: "border-color 0.2s",
                          }}
                        >
                          <button
                            onClick={() =>
                              setExpandedCat(expandedCat === ci ? null : ci)
                            }
                            style={{
                              width: "100%",
                              padding: "14px 18px",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: T.gold,
                                  letterSpacing: "0.08em",
                                  textTransform: "uppercase",
                                }}
                              >
                                {cat.category}
                              </span>
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  color: T.muted,
                                  background: dark ? "#252523" : "#f0ece5",
                                  border: `1px solid ${T.border}`,
                                  borderRadius: 100,
                                  padding: "2px 8px",
                                }}
                              >
                                {cat.skills.length} skills
                              </span>
                            </div>
                            <svg
                              width="14"
                              height="14"
                              fill="none"
                              stroke={T.muted}
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              style={{
                                transition: "transform 0.2s",
                                transform:
                                  expandedCat === ci
                                    ? "rotate(180deg)"
                                    : "none",
                                flexShrink: 0,
                              }}
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>

                          {expandedCat === ci && (
                            <div
                              style={{
                                padding: "0 18px 18px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                                borderTop: `1px solid ${T.divider}`,
                                animation: "fadeUp 0.2s ease both",
                              }}
                            >
                              {cat.skills.map((skill, si) => (
                                <div
                                  key={si}
                                  style={{
                                    padding: "14px 16px",
                                    background: T.surfaceAlt,
                                    border: `1px solid ${T.borderLight}`,
                                    borderRadius: 10,
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: 13.5,
                                      fontWeight: 600,
                                      color: T.text,
                                      marginBottom: 8,
                                    }}
                                  >
                                    {skill.title}
                                  </div>
                                  <InfoBlock
                                    label="Why"
                                    value={skill.why}
                                    T={T}
                                    small
                                  />
                                  <InfoBlock
                                    label="How"
                                    value={skill.how}
                                    T={T}
                                    small
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learning Approach */}
                  <div
                    style={{
                      padding: "20px 22px",
                      background: dark
                        ? "rgba(16,185,129,0.06)"
                        : "rgba(16,185,129,0.05)",
                      border: `1px solid ${dark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.2)"}`,
                      borderRadius: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 14,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                      <span
                        style={{ fontSize: 14, fontWeight: 600, color: T.text }}
                      >
                        {response.learningApproach.title}
                      </span>
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {response.learningApproach.points.map((point, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-start",
                          }}
                        >
                          <span
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              flexShrink: 0,
                              background: dark
                                ? "rgba(16,185,129,0.15)"
                                : "rgba(16,185,129,0.12)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: 1,
                            }}
                          >
                            <svg
                              width="9"
                              height="9"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span
                            style={{
                              fontSize: 13.5,
                              color: T.muted,
                              lineHeight: 1.65,
                            }}
                            dangerouslySetInnerHTML={{ __html: point }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Reset button */}
                  <button
                    onClick={resetDialog}
                    onMouseEnter={() => setHoverReset(true)}
                    onMouseLeave={() => setHoverReset(false)}
                    style={{
                      width: "100%",
                      height: 46,
                      background: "transparent",
                      border: `1.5px solid ${hoverReset ? T.gold : T.border}`,
                      borderRadius: 12,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: hoverReset ? T.gold : T.muted,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      transition: "all 0.2s",
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
                    </svg>
                    Start New Analysis
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────────────────────── */
const FeatureCardComponent = ({
  f,
  T,
  dark,
  delay,
}: {
  f: { icon: React.ReactNode; title: string; desc: string; accent: string };
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
        border: `1px solid ${hover ? f.accent + "55" : T.cardBorder}`,
        borderRadius: 18,
        transition: "all 0.3s cubic-bezier(0.2,0,0,1)",
        transform: hover ? "translateY(-5px)" : "none",
        boxShadow: hover
          ? dark
            ? `0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px ${f.accent}22`
            : `0 20px 50px rgba(0,0,0,0.08), 0 0 0 1px ${f.accent}22`
          : "none",
        animation: `fadeUp 0.5s ease both`,
        animationDelay: `${delay}ms`,
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${f.accent}88, transparent)`,
          borderRadius: "18px 18px 0 0",
          opacity: hover ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          marginBottom: 20,
          background: dark ? "#252523" : "#f5f2ed",
          border: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s",
          transform: hover ? "scale(1.05)" : "none",
        }}
      >
        {f.icon}
      </div>
      <h3
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15.5,
          fontWeight: 600,
          color: T.text,
          margin: "0 0 8px",
        }}
      >
        {f.title}
      </h3>
      <p
        style={{
          fontSize: 13.5,
          color: T.muted,
          lineHeight: 1.65,
          margin: 0,
          fontWeight: 300,
        }}
      >
        {f.desc}
      </p>
    </div>
  );
};

const SectionHeader = ({
  icon,
  label,
  count,
  T,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  T: Record<string, string>;
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 7,
        background: T.dark ? "rgba(212,160,23,0.1)" : "rgba(212,160,23,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </div>
    <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
      {label}
    </span>
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 700,
        background: T.tagBg,
        border: `1px solid ${T.tagBorder}`,
        color: T.muted,
        borderRadius: 100,
        padding: "2px 9px",
      }}
    >
      {count}
    </span>
  </div>
);

const InfoBlock = ({
  label,
  value,
  T,
  accent,
  small,
}: {
  label: string;
  value: string;
  T: Record<string, string>;
  accent?: boolean;
  small?: boolean;
}) => (
  <div style={{ marginTop: small ? 8 : 12 }}>
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: accent ? T.gold : T.muted,
      }}
    >
      {label}
    </span>
    <p
      style={{
        fontSize: small ? 12.5 : 13.5,
        color: T.muted,
        lineHeight: 1.65,
        margin: "4px 0 0",
        fontWeight: 300,
      }}
    >
      {value}
    </p>
  </div>
);

export default CareerGuide;
