"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Job } from "@/lib/type";
import { Job_Service, User_Service, useAppData } from "@/context/AppContext";
import { useTheme } from "next-themes";

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────────────── */
function timeAgo(date: string): string {
  const diffDays = Math.floor(
    (Date.now() - new Date(date).getTime()) / 86_400_000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

const JOB_TYPE_COLORS: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  "Full-time": { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  "Part-time": { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  Contract: { bg: "#faf5ff", color: "#7e22ce", border: "#e9d5ff" },
  Internship: { bg: "#f0f9ff", color: "#0369a1", border: "#bae6fd" },
};

const JOB_TYPE_COLORS_DARK: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  "Full-time": { bg: "#052e16", color: "#4ade80", border: "#14532d" },
  "Part-time": { bg: "#1c1007", color: "#fbbf24", border: "#451a03" },
  Contract: { bg: "#1a0533", color: "#c084fc", border: "#3b0764" },
  Internship: { bg: "#0c1a26", color: "#38bdf8", border: "#0c4a6e" },
};

const WORK_LOC_COLORS: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  Remote: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  Hybrid: { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  "On-site": { bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
};

const WORK_LOC_COLORS_DARK: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  Remote: { bg: "#0f1f3d", color: "#60a5fa", border: "#1e3a5f" },
  Hybrid: { bg: "#2a1505", color: "#fb923c", border: "#431407" },
  "On-site": { bg: "#2d0a10", color: "#fb7185", border: "#4c0519" },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Skeleton
───────────────────────────────────────────────────────────────────────────── */
const SkeletonPage = ({ dark }: { dark: boolean }) => {
  const shimmer: React.CSSProperties = {
    backgroundImage: dark
      ? "linear-gradient(90deg,#252523 25%,#2e2e2b 50%,#252523 75%)"
      : "linear-gradient(90deg,#f0ece5 25%,#e8e4dc 50%,#f0ece5 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: 6,
  };
  const T = {
    bg: dark ? "#111110" : "#F7F4EF",
    headerBg: dark ? "#0d0d0c" : "#1a1a1a",
    surface: dark ? "#1a1a18" : "#ffffff",
    border: dark ? "#2a2a28" : "#e8e4dc",
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh",
        background: T.bg,
      }}
    >
      <div style={{ background: T.headerBg, padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{ ...shimmer, height: 11, width: 120, marginBottom: 18 }}
          />
          <div
            style={{ ...shimmer, height: 44, width: "55%", marginBottom: 12 }}
          />
          <div style={{ ...shimmer, height: 16, width: "35%" }} />
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            padding: 36,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{ ...shimmer, width: 72, height: 72, borderRadius: 14 }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  ...shimmer,
                  height: 28,
                  width: "50%",
                  marginBottom: 10,
                }}
              />
              <div style={{ ...shimmer, height: 16, width: "30%" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[80, 72, 66, 88].map((w, i) => (
              <div
                key={i}
                style={{ ...shimmer, height: 26, width: w, borderRadius: 100 }}
              />
            ))}
          </div>
          <div style={{ ...shimmer, height: 1, width: "100%" }} />
          {[100, 85, 90, 70, 95, 60].map((w, i) => (
            <div key={i} style={{ ...shimmer, height: 14, width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────────────────────── */
const JobsIndividualPage = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";

  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const token = Cookies.get("token");

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [hoverBack, setHoverBack] = useState(false);
  const [hoverApply, setHoverApply] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (id) {
      fetchJob();
      fetchApplicationStatus();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(
        `${Job_Service}/api/job/getSingleJob/${id}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
      );
      setJob(data);
    } catch (error) {
      console.error("Failed to fetch job", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationStatus = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${User_Service}/api/users/getAllApplications`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (Array.isArray(data)) {
        const ids = data.map((app: any) => app.job_id);
        if (ids.includes(Number(id))) setApplied(true);
      }
    } catch {}
  };

  const applyHandler = async () => {
    if (!token) {
      toast.error("Please log in to apply");
      return;
    }
    if (applied) {
      toast("Already applied!", { icon: "ℹ️" });
      return;
    }
    setApplying(true);
    try {
      const { data } = await axios.post(
        `${User_Service}/api/users/applyJob`,
        { job_id: Number(id) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(data.message || "Application submitted!");
      setApplied(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  /* ── Theme tokens ──────────────────────────────────────────────────────── */
  const T = {
    bg: dark ? "#111110" : "#F7F4EF",
    surface: dark ? "#1a1a18" : "#ffffff",
    surfaceAlt: dark ? "#141413" : "#faf8f5",
    border: dark ? "#2a2a28" : "#e8e4dc",
    borderLight: dark ? "#222220" : "#f0ece5",
    text: dark ? "#f0ede8" : "#1a1a1a",
    muted: dark ? "#888" : "#666",
    faint: dark ? "#555" : "#aaa",
    headerBg: dark ? "#0d0d0c" : "#1a1a1a",
    gold: "#d4a017",
    goldLight: "#e8c350",
    btnBg: dark ? "#d4a017" : "#1a1a1a",
    btnColor: dark ? "#1a1a1a" : "#f0ede8",
    tagNeutralBg: dark ? "#252523" : "#f5f2ed",
    tagNeutralColor: dark ? "#999" : "#666",
    tagNeutralBorder: dark ? "#333330" : "#e8e4dc",
    divider: dark ? "#222220" : "#f0ece5",
  };

  if (!mounted || loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
          @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        `}</style>
        <SkeletonPage dark={dark} />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');`}</style>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            minHeight: "100vh",
            background: T.bg,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: dark ? "#252523" : "#f0ece5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="32"
              height="32"
              fill="none"
              stroke="#bbb"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 26,
              fontWeight: 400,
              color: T.text,
              margin: 0,
            }}
          >
            Job not found
          </h2>
          <p style={{ fontSize: 14, color: T.faint, margin: 0 }}>
            This listing may have been removed or doesn't exist.
          </p>
          <button
            onClick={() => router.push("/jobs")}
            style={{
              marginTop: 8,
              height: 42,
              padding: "0 24px",
              background: T.btnBg,
              color: T.btnColor,
              border: "none",
              borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ← Back to Jobs
          </button>
        </div>
      </>
    );
  }

  const jtColors = (dark ? JOB_TYPE_COLORS_DARK : JOB_TYPE_COLORS)[
    job.job_type
  ] ?? {
    bg: T.tagNeutralBg,
    color: T.tagNeutralColor,
    border: T.tagNeutralBorder,
  };
  const wlColors = (dark ? WORK_LOC_COLORS_DARK : WORK_LOC_COLORS)[
    job.work_location
  ] ?? {
    bg: T.tagNeutralBg,
    color: T.tagNeutralColor,
    border: T.tagNeutralBorder,
  };

  const applyBg = applied ? "#16a34a" : hoverApply ? "#d4a017" : T.btnBg;
  const applyColor = applied ? "#fff" : hoverApply ? "#1a1a1a" : T.btnColor;

  /* ── Info row helper ─────────────────────────────────────────────────── */
  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
  }) => (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "16px 0",
        borderBottom: `1px solid ${T.borderLight}`,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: dark ? "#252523" : "#f5f2ed",
          border: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: T.faint,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 3,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 500, color: T.text }}>
          {value}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          minHeight: "100vh",
          background: T.bg,
          color: T.text,
          transition: "background 0.3s, color 0.3s",
        }}
      >
        {/* ── Hero Header ──────────────────────────────────────────────── */}
        <header
          style={{
            background: T.headerBg,
            padding: "48px 24px 44px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(212,160,23,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 10% 80%, rgba(16,185,129,0.07) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}
          >
            {/* Back link */}
            <button
              onClick={() => router.push("/jobs")}
              onMouseEnter={() => setHoverBack(true)}
              onMouseLeave={() => setHoverBack(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: hoverBack ? T.gold : "rgba(240,237,232,0.45)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: 0,
                marginBottom: 22,
                transition: "color 0.2s",
              }}
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                style={{
                  transition: "transform 0.2s",
                  transform: hoverBack ? "translateX(-3px)" : "none",
                }}
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              All Jobs
            </button>

            {/* Company + Title */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                flexWrap: "wrap",
              }}
            >
              {job.company_logo ? (
                <img
                  src={job.company_logo}
                  alt={job.company_name}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 14,
                    objectFit: "cover",
                    border: "2px solid rgba(255,255,255,0.12)",
                    background: "#222",
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 14,
                    background: "linear-gradient(135deg,#2a2a28,#3a3a33)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 24,
                    color: "rgba(240,237,232,0.4)",
                    border: "2px solid rgba(255,255,255,0.08)",
                    flexShrink: 0,
                  }}
                >
                  {job.company_name?.[0] ?? "?"}
                </div>
              )}
              <div>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: T.gold,
                    margin: "0 0 6px",
                  }}
                >
                  {job.company_name}
                </p>
                <h1
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    fontWeight: 400,
                    color: "#f0ede8",
                    lineHeight: 1.1,
                    margin: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {job.title}
                </h1>
              </div>
            </div>

            {/* Posted time + active badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 20,
                flexWrap: "wrap",
              }}
            >
              {job.created_at && (
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(240,237,232,0.35)",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <svg
                    width="11"
                    height="11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  Posted {timeAgo(job.created_at)}
                </span>
              )}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(212,160,23,0.14)",
                  border: "1px solid rgba(212,160,23,0.28)",
                  borderRadius: 100,
                  padding: "4px 12px",
                  fontSize: 11,
                  fontWeight: 500,
                  color: T.gold,
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
                Active listing
              </div>
            </div>
          </div>
        </header>

        {/* ── Main Content ─────────────────────────────────────────────── */}
        <main
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "36px 24px 72px",
            animation: "fadeUp 0.4s ease both",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 300px",
              gap: 24,
              alignItems: "start",
            }}
          >
            {/* ── Left col: Description ───────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Tags */}
              <div
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 16,
                  padding: "20px 24px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "5px 13px",
                    borderRadius: 100,
                    border: `1px solid ${jtColors.border}`,
                    background: jtColors.bg,
                    color: jtColors.color,
                  }}
                >
                  {job.job_type}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "5px 13px",
                    borderRadius: 100,
                    border: `1px solid ${wlColors.border}`,
                    background: wlColors.bg,
                    color: wlColors.color,
                  }}
                >
                  {job.work_location}
                </span>
                {job.role && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "5px 13px",
                      borderRadius: 100,
                      border: `1px solid ${T.tagNeutralBorder}`,
                      background: T.tagNeutralBg,
                      color: T.tagNeutralColor,
                    }}
                  >
                    {job.role}
                  </span>
                )}
                {job.openings && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "5px 13px",
                      borderRadius: 100,
                      border: `1px solid ${T.tagNeutralBorder}`,
                      background: T.tagNeutralBg,
                      color: T.tagNeutralColor,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    {job.openings} opening
                    {Number(job.openings) !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Description card */}
              <div
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 16,
                  padding: "28px 28px 32px",
                }}
              >
                {/* Gold accent top bar */}
                <div
                  style={{
                    height: 3,
                    width: 48,
                    background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight})`,
                    borderRadius: 100,
                    marginBottom: 22,
                  }}
                />
                <h2
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 20,
                    fontWeight: 400,
                    color: T.text,
                    margin: "0 0 16px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  About this role
                </h2>
                <p
                  style={{
                    fontSize: 14.5,
                    color: T.muted,
                    lineHeight: 1.8,
                    margin: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {job.description}
                </p>
              </div>
            </div>

            {/* ── Right col: Info sidebar ──────────────────────────────── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                position: "sticky",
                top: 24,
              }}
            >
              {/* Salary card */}
              <div
                style={{
                  background: dark
                    ? "linear-gradient(135deg, #1a1505 0%, #201a08 100%)"
                    : "linear-gradient(135deg, #fefce8 0%, #fdf6d3 100%)",
                  border: `1px solid ${dark ? "#3a3010" : "#fde68a"}`,
                  borderRadius: 16,
                  padding: "24px 24px 20px",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: T.gold,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Annual Salary
                </div>
                <div
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 34,
                    fontWeight: 400,
                    color: dark ? "#f0ede8" : "#1a1a1a",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  ₹{Number(job.salary).toLocaleString("en-IN")}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: dark ? "#6b5a1a" : "#a16207",
                    marginTop: 4,
                  }}
                >
                  per annum (CTC)
                </div>
              </div>

              {/* Job details card */}
              <div
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 16,
                  padding: "8px 20px 4px",
                }}
              >
                <InfoRow
                  icon={
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke={T.gold}
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  }
                  label="Location"
                  value={job.location}
                />
                <InfoRow
                  icon={
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke={T.gold}
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                  }
                  label="Job Type"
                  value={job.job_type}
                />
                <InfoRow
                  icon={
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke={T.gold}
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  }
                  label="Work Mode"
                  value={job.work_location}
                />
                {job.role && (
                  <InfoRow
                    icon={
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke={T.gold}
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    }
                    label="Role"
                    value={job.role}
                  />
                )}
                {job.openings && (
                  <InfoRow
                    icon={
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke={T.gold}
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    }
                    label="Openings"
                    value={`${job.openings} position${Number(job.openings) !== 1 ? "s" : ""}`}
                  />
                )}
              </div>

              {/* Apply button */}
              <button
                onClick={applyHandler}
                disabled={applying || applied}
                onMouseEnter={() => setHoverApply(true)}
                onMouseLeave={() => setHoverApply(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  height: 50,
                  background: applyBg,
                  color: applyColor,
                  border: "none",
                  borderRadius: 12,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: applying || applied ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  letterSpacing: "0.03em",
                  opacity: applying ? 0.7 : 1,
                  transform:
                    hoverApply && !applied ? "translateY(-2px)" : "none",
                  boxShadow:
                    hoverApply && !applied
                      ? "0 8px 24px rgba(212,160,23,0.3)"
                      : "none",
                }}
              >
                {applied ? (
                  <>
                    <svg
                      width="15"
                      height="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Application Submitted
                  </>
                ) : applying ? (
                  "Submitting…"
                ) : (
                  <>
                    Apply Now
                    <svg
                      width="15"
                      height="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      style={{
                        transition: "transform 0.2s",
                        transform: hoverApply ? "translateX(3px)" : "none",
                      }}
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              {!token && (
                <p
                  style={{
                    fontSize: 12,
                    color: T.faint,
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  You must be logged in to apply
                </p>
              )}
            </div>
          </div>
        </main>

        {/* ── Responsive styles ─────────────────────────────────────────── */}
        <style>{`
          @media (max-width: 700px) {
            main > div {
              grid-template-columns: 1fr !important;
            }
            main > div > div:last-child {
              position: static !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default JobsIndividualPage;