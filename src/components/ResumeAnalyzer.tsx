"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ResumeAnalysisResponse } from "@/lib/type";
import { Utils_Service } from "@/context/AppContext";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────────────────────────────────────────
   Score helpers
───────────────────────────────────────────────────────────────────────────── */
const scoreColor = (score: number, dark: boolean) => {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#d97706";
  return "#dc2626";
};

const scoreBg = (score: number, dark: boolean) => {
  if (score >= 80) return dark ? "rgba(22,163,74,0.1)" : "#f0fdf4";
  if (score >= 60) return dark ? "rgba(217,119,6,0.1)" : "#fffbeb";
  return dark ? "rgba(220,38,38,0.1)" : "#fff1f2";
};

const scoreBorder = (score: number, dark: boolean) => {
  if (score >= 80) return dark ? "rgba(22,163,74,0.25)" : "#bbf7d0";
  if (score >= 60) return dark ? "rgba(217,119,6,0.25)" : "#fde68a";
  return dark ? "rgba(220,38,38,0.25)" : "#fecdd3";
};

const scoreLabel = (score: number) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs Work";
  return "Poor";
};

const priorityConfig = (p: string, dark: boolean) => {
  if (p === "high")
    return {
      bg: dark ? "rgba(220,38,38,0.12)" : "#fff1f2",
      color: "#dc2626",
      border: dark ? "rgba(220,38,38,0.25)" : "#fecdd3",
    };
  if (p === "medium")
    return {
      bg: dark ? "rgba(217,119,6,0.12)" : "#fffbeb",
      color: "#d97706",
      border: dark ? "rgba(217,119,6,0.25)" : "#fde68a",
    };
  return {
    bg: dark ? "rgba(59,130,246,0.12)" : "#eff6ff",
    color: "#3b82f6",
    border: dark ? "rgba(59,130,246,0.25)" : "#bfdbfe",
  };
};

/* ─────────────────────────────────────────────────────────────────────────────
   Score ring SVG
───────────────────────────────────────────────────────────────────────────── */
const ScoreRing = ({ score, dark }: { score: number; dark: boolean }) => {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score, dark);
  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke={dark ? "#252523" : "#f0ece5"}
        strokeWidth="10"
      />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 64 64)"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text
        x="64"
        y="60"
        textAnchor="middle"
        fill={color}
        fontSize="26"
        fontWeight="700"
        fontFamily="'DM Sans',sans-serif"
      >
        {score}
      </text>
      <text
        x="64"
        y="76"
        textAnchor="middle"
        fill={dark ? "#666" : "#999"}
        fontSize="10"
        fontFamily="'DM Sans',sans-serif"
      >
        out of 100
      </text>
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Score bar
───────────────────────────────────────────────────────────────────────────── */
const ScoreBar = ({
  label,
  score,
  dark,
  T,
}: {
  label: string;
  score: number;
  dark: boolean;
  T: Record<string, string>;
}) => {
  const color = scoreColor(score, dark);
  return (
    <div
      style={{
        padding: "14px 16px",
        background: T.cardBg,
        border: `1px solid ${T.cardBorder}`,
        borderRadius: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: T.text,
            textTransform: "capitalize",
          }}
        >
          {label.replace(/([A-Z])/g, " $1")}
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color,
            fontFamily: "'DM Serif Display',serif",
          }}
        >
          {score}%
        </span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 100,
          background: dark ? "#252523" : "#f0ece5",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 100,
            width: `${score}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            transition: "width 1s ease",
          }}
        />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────────────────── */
const ResumeAnalyzer = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";

  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResumeAnalysisResponse | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [hoverCta, setHoverCta] = useState(false);
  const [hoverAnalyze, setHoverAnalyze] = useState(false);
  const [hoverReset, setHoverReset] = useState(false);
  const [expandedSugg, setExpandedSugg] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        resetDialog();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [modalOpen]);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  /* ── Theme tokens ─────────────────────────────────────────────────────── */
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
    divider: dark ? "#222220" : "#f0ece5",
    inputBorder: dark ? "#2a2a28" : "#e0dcd5",
    overlay: dark ? "rgba(0,0,0,0.78)" : "rgba(0,0,0,0.45)",
    tagBg: dark ? "#252523" : "#f5f2ed",
    tagBorder: dark ? "#333330" : "#e8e4dc",
    tagColor: dark ? "#999" : "#666",
  };

  /* ── File handlers ────────────────────────────────────────────────────── */
  const processFile = (f: File) => {
    if (f.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    setFile(f);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => res(reader.result as string);
      reader.onerror = rej;
    });

  const analyzeResume = async () => {
    if (!file) {
      toast.error("Please upload a resume");
      return;
    }
    setLoading(true);
    try {
      const base64 = await convertToBase64(file);
      const { data } = await axios.post(
        `${Utils_Service}/api/utils/resumeAnalyzer`,
        { pdfBase64: base64 },
      );
      setResponse(data);
      toast.success("Resume analyzed successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setFile(null);
    setResponse(null);
    setModalOpen(false);
    setExpandedSugg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Feature cards ────────────────────────────────────────────────────── */
  const features = [
    {
      title: "ATS Score",
      desc: "Instant compatibility score against modern applicant tracking systems.",
      accent: "#ef4444",
      icon: (
        <svg
          width="26"
          height="26"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
      ),
    },
    {
      title: "Keyword Check",
      desc: "Identify missing keywords and phrases that ATS scanners look for.",
      accent: "#3b82f6",
      icon: (
        <svg
          width="26"
          height="26"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      ),
    },
    {
      title: "Deep Analysis",
      desc: "Section-by-section breakdown of formatting, content, and structure.",
      accent: "#8b5cf6",
      icon: (
        <svg
          width="26"
          height="26"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      title: "Smart Fixes",
      desc: "Prioritized, actionable recommendations to boost your resume score.",
      accent: "#10b981",
      icon: (
        <svg
          width="26"
          height="26"
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 10px; }
      `}</style>

      {/* ── Section ──────────────────────────────────────────────────────── */}
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
        {/* BG blobs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              top: "5%",
              right: "6%",
              width: 380,
              height: 380,
              borderRadius: "50%",
              background: dark
                ? "rgba(239,68,68,0.05)"
                : "rgba(239,68,68,0.06)",
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "5%",
              left: "6%",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: dark
                ? "rgba(212,160,23,0.05)"
                : "rgba(212,160,23,0.07)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          {/* Header */}
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
                  ? "rgba(239,68,68,0.1)"
                  : "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.22)",
                borderRadius: 100,
                padding: "6px 16px",
                fontSize: 11,
                fontWeight: 700,
                color: "#ef4444",
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
                  background: "#ef4444",
                  animation: "pulse 2s infinite",
                }}
              />
              AI-Powered ATS Analysis
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
              Optimize your resume for{" "}
              <em style={{ fontStyle: "italic", color: T.gold }}>ATS</em>
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
              Get instant, AI-powered feedback on your resume's compatibility
              with applicant tracking systems. Know exactly what to fix.
            </p>
          </div>

          {/* Feature cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
              marginBottom: 60,
            }}
          >
            {features.map((f, i) => (
              <FeatureCard
                key={f.title}
                f={f}
                T={T}
                dark={dark}
                delay={i * 80}
              />
            ))}
          </div>

          {/* CTA */}
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
                  ? "0 16px 40px rgba(212,160,23,0.32)"
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Analyze My Resume
              <svg
                width="15"
                height="15"
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

      {/* ── Modal ────────────────────────────────────────────────────────── */}
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
            padding: 16,
            animation: "fadeIn 0.2s ease both",
          }}
        >
          <div
            ref={modalRef}
            style={{
              width: "100%",
              maxWidth: 740,
              maxHeight: "92vh",
              background: dark ? "#1a1a18" : "#ffffff",
              border: `1px solid ${T.border}`,
              borderRadius: 24,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              animation: "slideUp 0.3s ease both",
              boxShadow: dark
                ? "0 40px 100px rgba(0,0,0,0.7)"
                : "0 40px 100px rgba(0,0,0,0.16)",
              position: "relative",
            }}
          >
            {/* Top accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 32,
                right: 32,
                height: 3,
                background: `linear-gradient(90deg, transparent, #ef4444, #f87171, #ef4444, transparent)`,
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
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: dark
                      ? "rgba(239,68,68,0.12)"
                      : "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
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
                      stroke="#ef4444"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
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
                    {response ? "Your ATS Analysis" : "Upload Your Resume"}
                  </h3>
                  <p
                    style={{ fontSize: 13, color: T.muted, margin: "3px 0 0" }}
                  >
                    {response
                      ? `Score: ${response.atsScore}/100 — ${scoreLabel(response.atsScore)}`
                      : "PDF only · Max 5MB"}
                  </p>
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
              {/* ── Upload view ──────────────────────────────────────── */}
              {!response && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    animation: "fadeUp 0.3s ease both",
                  }}
                >
                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${dragOver ? "#ef4444" : file ? "#16a34a" : T.inputBorder}`,
                      borderRadius: 16,
                      padding: "48px 24px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: dragOver
                        ? dark
                          ? "rgba(239,68,68,0.06)"
                          : "rgba(239,68,68,0.03)"
                        : file
                          ? dark
                            ? "rgba(22,163,74,0.06)"
                            : "rgba(22,163,74,0.03)"
                          : dark
                            ? "#141413"
                            : "#faf8f5",
                      transition: "all 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileInput}
                      style={{ display: "none" }}
                    />

                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: file
                          ? dark
                            ? "rgba(22,163,74,0.15)"
                            : "#f0fdf4"
                          : dark
                            ? "#252523"
                            : "#f0ece5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s",
                      }}
                    >
                      {file ? (
                        <svg
                          width="28"
                          height="28"
                          fill="none"
                          stroke="#16a34a"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg
                          width="28"
                          height="28"
                          fill="none"
                          stroke={T.muted}
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      )}
                    </div>

                    {file ? (
                      <div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "#16a34a",
                            marginBottom: 4,
                          }}
                        >
                          {file.name}
                        </div>
                        <div style={{ fontSize: 12, color: T.muted }}>
                          {(file.size / 1024).toFixed(0)} KB · Click to change
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 500,
                            color: T.text,
                            marginBottom: 5,
                          }}
                        >
                          {dragOver ? "Drop it here!" : "Drop your resume or "}
                          {!dragOver && (
                            <span style={{ color: T.gold, fontWeight: 700 }}>
                              browse files
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12.5, color: T.muted }}>
                          PDF format only · Maximum 5MB
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Analyze button */}
                  <button
                    onClick={analyzeResume}
                    disabled={loading || !file}
                    onMouseEnter={() => setHoverAnalyze(true)}
                    onMouseLeave={() => setHoverAnalyze(false)}
                    style={{
                      width: "100%",
                      height: 50,
                      background: !file
                        ? dark
                          ? "#252523"
                          : "#f0ece5"
                        : hoverAnalyze
                          ? "#d4a017"
                          : T.btnBg,
                      color: !file
                        ? T.faint
                        : hoverAnalyze
                          ? "#1a1a1a"
                          : T.btnColor,
                      border: "none",
                      borderRadius: 12,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: loading || !file ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 9,
                      transition: "all 0.25s",
                      opacity: loading ? 0.8 : 1,
                      transform:
                        hoverAnalyze && file && !loading
                          ? "translateY(-1px)"
                          : "none",
                      boxShadow:
                        hoverAnalyze && file
                          ? "0 8px 24px rgba(212,160,23,0.28)"
                          : "none",
                    }}
                  >
                    {loading ? (
                      <>
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            border: `2.5px solid currentColor`,
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            animation: "spin 0.7s linear infinite",
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        Analyzing your resume…
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
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        Analyze Resume
                        <svg
                          width="15"
                          height="15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                          style={{
                            transition: "transform 0.2s",
                            transform: hoverAnalyze
                              ? "translateX(3px)"
                              : "none",
                          }}
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* ── Results view ──────────────────────────────────────── */}
              {response && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 22,
                    animation: "fadeUp 0.35s ease both",
                  }}
                >
                  {/* Score hero */}
                  <div
                    style={{
                      padding: "28px 24px",
                      background: scoreBg(response.atsScore, dark),
                      border: `1px solid ${scoreBorder(response.atsScore, dark)}`,
                      borderRadius: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 20,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: scoreColor(response.atsScore, dark),
                          marginBottom: 8,
                        }}
                      >
                        ATS Compatibility Score
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Serif Display',serif",
                          fontSize: 14,
                          color: T.muted,
                          fontWeight: 300,
                          maxWidth: 320,
                          lineHeight: 1.6,
                        }}
                      >
                        {scoreLabel(response.atsScore) === "Excellent"
                          ? "Your resume is well-optimized for ATS systems."
                          : scoreLabel(response.atsScore) === "Good"
                            ? "Your resume passes most ATS filters with some room to improve."
                            : "Your resume needs significant improvements to pass ATS filters."}
                      </div>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          marginTop: 12,
                          padding: "5px 13px",
                          background: dark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.05)",
                          borderRadius: 100,
                          border: `1px solid ${scoreBorder(response.atsScore, dark)}`,
                          fontSize: 12,
                          fontWeight: 700,
                          color: scoreColor(response.atsScore, dark),
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: scoreColor(response.atsScore, dark),
                            animation: "pulse 2s infinite",
                          }}
                        />
                        {scoreLabel(response.atsScore)}
                      </div>
                    </div>
                    <ScoreRing score={response.atsScore} dark={dark} />
                  </div>

                  {/* Summary */}
                  <div
                    style={{
                      padding: "18px 20px",
                      background: dark
                        ? "rgba(212,160,23,0.07)"
                        : "rgba(212,160,23,0.06)",
                      border: "1px solid rgba(212,160,23,0.2)",
                      borderRadius: 14,
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
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
                        width="15"
                        height="15"
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
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: T.gold,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: 5,
                        }}
                      >
                        Summary
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

                  {/* Score breakdown */}
                  <div>
                    <ResultSectionHeader
                      label="Score Breakdown"
                      icon={
                        <svg
                          width="15"
                          height="15"
                          fill="none"
                          stroke={T.gold}
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                      }
                      T={T}
                    />
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: 10,
                        marginTop: 12,
                      }}
                    >
                      {Object.entries(response.scoreBreakdown).map(
                        ([key, value]) => (
                          <ScoreBar
                            key={key}
                            label={key}
                            score={(value as any).score}
                            dark={dark}
                            T={T}
                          />
                        ),
                      )}
                    </div>
                  </div>

                  {/* Strengths */}
                  <div
                    style={{
                      padding: "20px 22px",
                      background: dark
                        ? "rgba(22,163,74,0.07)"
                        : "rgba(22,163,74,0.05)",
                      border: `1px solid ${dark ? "rgba(22,163,74,0.18)" : "rgba(22,163,74,0.22)"}`,
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
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          background: dark
                            ? "rgba(22,163,74,0.15)"
                            : "rgba(22,163,74,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          stroke="#16a34a"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: T.text,
                        }}
                      >
                        What Your Resume Does Well
                      </span>
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: 9,
                      }}
                    >
                      {response.strengths.map((s, i) => (
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
                              marginTop: 1,
                              background: dark
                                ? "rgba(22,163,74,0.18)"
                                : "rgba(22,163,74,0.12)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="9"
                              height="9"
                              fill="none"
                              stroke="#16a34a"
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
                          >
                            {s}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <ResultSectionHeader
                      label="Recommendations"
                      icon={
                        <svg
                          width="15"
                          height="15"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      }
                      T={T}
                      count={response.suggestions.length}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        marginTop: 12,
                      }}
                    >
                      {response.suggestions.map((sug, i) => {
                        const pc = priorityConfig(sug.priority, dark);
                        const isOpen = expandedSugg === i;
                        return (
                          <div
                            key={i}
                            style={{
                              border: `1px solid ${isOpen ? pc.border : T.cardBorder}`,
                              borderRadius: 12,
                              background: T.cardBg,
                              overflow: "hidden",
                              transition: "border-color 0.2s",
                            }}
                          >
                            <button
                              onClick={() => setExpandedSugg(isOpen ? null : i)}
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
                                <span
                                  style={{
                                    fontSize: 10.5,
                                    fontWeight: 700,
                                    padding: "3px 10px",
                                    borderRadius: 100,
                                    background: pc.bg,
                                    color: pc.color,
                                    border: `1px solid ${pc.border}`,
                                    textTransform: "capitalize",
                                    letterSpacing: "0.04em",
                                    flexShrink: 0,
                                  }}
                                >
                                  {sug.priority}
                                </span>
                                <span
                                  style={{
                                    fontSize: 13.5,
                                    fontWeight: 600,
                                    color: T.text,
                                    textAlign: "left",
                                  }}
                                >
                                  {sug.category}
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
                                  transform: isOpen ? "rotate(180deg)" : "none",
                                  flexShrink: 0,
                                  marginLeft: 8,
                                }}
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>

                            {isOpen && (
                              <div
                                style={{
                                  padding: "0 18px 18px",
                                  borderTop: `1px solid ${T.divider}`,
                                  animation: "fadeUp 0.2s ease both",
                                }}
                              >
                                <div
                                  style={{
                                    marginTop: 14,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                  }}
                                >
                                  <div>
                                    <span
                                      style={{
                                        fontSize: 10.5,
                                        fontWeight: 700,
                                        color: "#ef4444",
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      Issue
                                    </span>
                                    <p
                                      style={{
                                        fontSize: 13.5,
                                        color: T.muted,
                                        lineHeight: 1.65,
                                        margin: "5px 0 0",
                                        fontWeight: 300,
                                      }}
                                    >
                                      {sug.issue}
                                    </p>
                                  </div>
                                  <div>
                                    <span
                                      style={{
                                        fontSize: 10.5,
                                        fontWeight: 700,
                                        color: "#16a34a",
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      Fix
                                    </span>
                                    <p
                                      style={{
                                        fontSize: 13.5,
                                        color: T.muted,
                                        lineHeight: 1.65,
                                        margin: "5px 0 0",
                                        fontWeight: 300,
                                      }}
                                    >
                                      {sug.recommendation}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reset */}
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
                    Analyze Another Resume
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
const FeatureCard = ({
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
            ? `0 20px 50px rgba(0,0,0,0.4)`
            : `0 20px 50px rgba(0,0,0,0.08)`
          : "none",
        animation: "fadeUp 0.5s ease both",
        animationDelay: `${delay}ms`,
        position: "relative",
        overflow: "hidden",
      }}
    >
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
          transition: "transform 0.3s",
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

const ResultSectionHeader = ({
  label,
  icon,
  T,
  count,
}: {
  label: string;
  icon: React.ReactNode;
  T: Record<string, string>;
  count?: number;
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 7,
        background: "rgba(212,160,23,0.08)",
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
    {count !== undefined && (
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          background: T.tagBg,
          border: `1px solid ${T.tagBorder}`,
          color: T.tagColor,
          borderRadius: 100,
          padding: "2px 9px",
        }}
      >
        {count}
      </span>
    )}
  </div>
);

export default ResumeAnalyzer;
