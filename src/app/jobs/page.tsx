"use client";
import { Job } from "@/lib/type";
import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Job_Service, User_Service, useAppData } from "@/context/AppContext";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

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

const WORK_LOC_COLORS: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  Remote: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  Hybrid: { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  "On-site": { bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Skeleton card
───────────────────────────────────────────────────────────────────────────── */
const SkeletonCard = ({ dark }: { dark: boolean }) => {
  const shimmer: React.CSSProperties = {
    background: dark
      ? "linear-gradient(90deg,#252523 25%,#2e2e2b 50%,#252523 75%)"
      : "linear-gradient(90deg,#f0ece5 25%,#e8e4dc 50%,#f0ece5 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: 6,
  };

  return (
    <div
      style={{
        background: dark ? "#1a1a18" : "#fff",
        border: `1px solid ${dark ? "#2a2a28" : "#e8e4dc"}`,
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ ...shimmer, width: 44, height: 44, borderRadius: 10 }} />
        <div style={{ flex: 1 }}>
          <div
            style={{ ...shimmer, height: 13, width: "55%", marginBottom: 8 }}
          />
          <div style={{ ...shimmer, height: 11, width: "35%" }} />
        </div>
      </div>
      <div>
        <div
          style={{ ...shimmer, height: 20, width: "80%", marginBottom: 8 }}
        />
        <div
          style={{ ...shimmer, height: 13, width: "100%", marginBottom: 6 }}
        />
        <div style={{ ...shimmer, height: 13, width: "70%" }} />
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[72, 60, 56].map((w, i) => (
          <div
            key={i}
            style={{ ...shimmer, height: 24, width: w, borderRadius: 100 }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 16,
          borderTop: `1px solid ${dark ? "#252523" : "#f0ece5"}`,
        }}
      >
        <div style={{ ...shimmer, height: 22, width: 90 }} />
        <div style={{ ...shimmer, height: 36, width: 90, borderRadius: 10 }} />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────────────────────── */
const JobsPage = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";
  const { user } = useAppData();
  const token = Cookies.get("token");

  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [workLocFilter, setWorkLocFilter] = useState("");
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());
  const [applicationsLoaded, setApplicationsLoaded] = useState(false);
  const [hoverCard, setHoverCard] = useState<number | null>(null);
  const [hoverApply, setHoverApply] = useState<number | null>(null);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [hoverClear, setHoverClear] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchApplications();
  }, []);

  /* ── Theme tokens ──────────────────────────────────────────────────────── */
  const T = {
    bg: dark ? "#111110" : "#F7F4EF",
    surface: dark ? "#1a1a18" : "#ffffff",
    border: dark ? "#2a2a28" : "#e8e4dc",
    text: dark ? "#f0ede8" : "#1a1a1a",
    muted: dark ? "#888" : "#777",
    faint: dark ? "#555" : "#aaa",
    headerBg: dark ? "#0d0d0c" : "#1a1a1a",
    searchBg: dark ? "#1a1a18" : "#ffffff",
    cardBg: dark ? "#1a1a18" : "#ffffff",
    cardBorder: dark ? "#2a2a28" : "#e8e4dc",
    footerDivider: dark ? "#252523" : "#f0ece5",
    tagNeutralBg: dark ? "#252523" : "#f5f2ed",
    tagNeutralColor: dark ? "#999" : "#666",
    tagNeutralBorder: dark ? "#333330" : "#e8e4dc",
    selectBg: dark ? "#1a1a18" : "#ffffff",
    gold: "#d4a017",
    btnBg: dark ? "#d4a017" : "#1a1a1a",
    btnColor: dark ? "#1a1a1a" : "#f0ede8",
    emptyIcon: dark ? "#252523" : "#f0ece5",
    inputColor: dark ? "#f0ede8" : "#1a1a1a",
  };

  // Load all job applications for the current user and mark as applied
  async function fetchApplications() {
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${User_Service}/api/users/getAllApplications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (Array.isArray(data)) {
        const ids = data
          .map((app: any) => app.job_id)
          .filter((id: any) => typeof id === "number");
        setAppliedIds(new Set(ids));
      }
    } catch (error) {
      console.error("Failed to load applications", error);
    } finally {
      setApplicationsLoaded(true);
    }
  }

  /* ── Fetch jobs (server-side: title + location) ─────────────────────────── */
  async function fetchJob() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (titleFilter) params.set("title", titleFilter);
      if (locationFilter) params.set("location", locationFilter);

      const { data } = await axios.get(
        `${Job_Service}/api/job/getAllJobs/active?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  /* Trigger server fetch when title or location changes */
  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleFilter, locationFilter]);

  /* ── Dynamic locations extracted from fetched data ─────────────────────── */
  const locationOptions = useMemo(
    () =>
      Array.from(
        new Set(
          jobs.map((j) => j.location).filter((l): l is string => !!l),
        ),
      ).sort(),
    [jobs],
  );

  /* ── Client-side filters (job type, work location) ─────────────────────── */
  const filteredJobs = useMemo(
    () =>
      jobs.filter((j) => {
        if (jobTypeFilter && j.job_type !== jobTypeFilter) return false;
        if (workLocFilter && j.work_location !== workLocFilter) return false;
        return true;
      }),
    [jobs, jobTypeFilter, workLocFilter],
  );

  const hasActiveFilters =
    titleFilter || locationFilter || jobTypeFilter || workLocFilter;

  /* ── Apply API ─────────────────────────────────────────────────────────── */
  const applyHandler = async (e: React.MouseEvent, jobId: number) => {
    e.stopPropagation();
    if (!token) {
      toast.error("Please log in to apply");
      return;
    }
    if (appliedIds.has(jobId)) {
      toast("Already applied!", { icon: "ℹ️" });
      return;
    }
    setApplyingId(jobId);
    try {
      const { data } = await axios.post(
        `${User_Service}/api/users/applyJob`,
        { job_id: jobId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(data.message || "Application submitted!");
      setAppliedIds((prev) => new Set([...prev, jobId]));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to apply");
    } finally {
      setApplyingId(null);
    }
  };

  const clearAllFilters = () => {
    setTitleFilter("");
    setLocationFilter("");
    setJobTypeFilter("");
    setWorkLocFilter("");
  };

  /* ── Shared sub-styles ─────────────────────────────────────────────────── */
  const bareInput: React.CSSProperties = {
    border: "none",
    outline: "none",
    background: "transparent",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: T.inputColor,
    width: "100%",
  };

  const searchDivider: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    flex: "1 1 180px",
    minHeight: 42,
  };

  if (!mounted) return null;
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        /* make native selects look clean */
        select { appearance: none; -webkit-appearance: none; }
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
        {/* ── Hero Header ─────────────────────────────────────────────── */}
        <header
          style={{
            background: T.headerBg,
            padding: "56px 24px 48px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(212,160,23,0.13) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 10% 80%, rgba(16,185,129,0.08) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: T.gold,
                marginBottom: 14,
                margin: "0 0 14px",
              }}
            >
              Opportunities Board
            </p>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                fontWeight: 400,
                color: "#f0ede8",
                lineHeight: 1.1,
                margin: "0 0 10px",
                letterSpacing: "-0.02em",
              }}
            >
              Find your next{" "}
              <em style={{ fontStyle: "italic", color: T.gold }}>great</em> role
            </h1>
            <p
              style={{
                fontSize: 15,
                fontWeight: 300,
                color: "rgba(240,237,232,0.55)",
                margin: 0,
                maxWidth: 480,
              }}
            >
              Curated positions from top companies across India. Apply in
              seconds.
            </p>
            {!loading && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 20,
                  background: "rgba(212,160,23,0.15)",
                  border: "1px solid rgba(212,160,23,0.3)",
                  borderRadius: 100,
                  padding: "5px 14px",
                  fontSize: 12,
                  fontWeight: 500,
                  color: T.gold,
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
                {filteredJobs.length} active listing
                {filteredJobs.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </header>

        {/* ── Sticky Search / Filter Bar ──────────────────────────────── */}
        <div
          style={{
            background: T.searchBg,
            borderBottom: `1px solid ${T.border}`,
            padding: "0 24px",
            position: "sticky",
            top: 0,
            zIndex: 50,
            boxShadow: dark
              ? "0 2px 24px rgba(0,0,0,0.3)"
              : "0 2px 24px rgba(0,0,0,0.06)",
            transition: "background 0.3s",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "flex",
              alignItems: "stretch",
              flexWrap: "wrap",
              gap: 8,
              padding: "10px 0",
            }}
          >
            {/* Title search */}
            <div style={{ ...searchDivider, flex: 1 }}>
              <svg
                width="15"
                height="15"
                fill="none"
                stroke="#999"
                strokeWidth="2"
                viewBox="0 0 24 24"
                style={{ flexShrink: 0 }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search roles, skills, companies…"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                style={bareInput}
              />
              {titleFilter && (
                <button
                  onClick={() => setTitleFilter("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: T.faint,
                    padding: 0,
                    fontSize: 18,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* Location */}
            <div style={{ ...searchDivider, minWidth: 160 }}>
              <svg
                width="13"
                height="13"
                fill="none"
                stroke="#999"
                strokeWidth="2"
                viewBox="0 0 24 24"
                style={{ flexShrink: 0 }}
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                style={{ ...bareInput, cursor: "pointer" }}
              >
                <option value="">All Locations</option>
                {locationOptions.map((loc) => (
                  <option
                    key={loc}
                    value={loc}
                    style={{ background: T.selectBg, color: T.text }}
                  >
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div style={{ ...searchDivider, minWidth: 150 }}>
              <svg
                width="13"
                height="13"
                fill="none"
                stroke="#999"
                strokeWidth="2"
                viewBox="0 0 24 24"
                style={{ flexShrink: 0 }}
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                style={{ ...bareInput, cursor: "pointer" }}
              >
                <option value="">All Types</option>
                {["Full-time", "Part-time", "Contract", "Internship"].map(
                  (v) => (
                    <option
                      key={v}
                      value={v}
                      style={{ background: T.selectBg, color: T.text }}
                    >
                      {v}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Work Location */}
            <div style={{ ...searchDivider, minWidth: 148 }}>
              <svg
                width="13"
                height="13"
                fill="none"
                stroke="#999"
                strokeWidth="2"
                viewBox="0 0 24 24"
                style={{ flexShrink: 0 }}
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <select
                value={workLocFilter}
                onChange={(e) => setWorkLocFilter(e.target.value)}
                style={{ ...bareInput, cursor: "pointer" }}
              >
                <option value="">All Modes</option>
                {["On-site", "Remote", "Hybrid"].map((v) => (
                  <option
                    key={v}
                    value={v}
                    style={{ background: T.selectBg, color: T.text }}
                  >
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 6px",
                flex: "1 1 140px",
              }}
            >
              <button
                onClick={clearAllFilters}
                onMouseEnter={() => setHoverBtn(true)}
                onMouseLeave={() => setHoverBtn(false)}
                style={{
                  height: 40,
                  padding: "0 20px",
                  background: hoverBtn ? "#d4a017" : T.btnBg,
                  color: hoverBtn ? "#1a1a1a" : T.btnColor,
                  border: "none",
                  borderRadius: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  transform: hoverBtn ? "translateY(-1px)" : "none",
                }}
              >
                {hasActiveFilters ? "Clear Filters ×" : "Search"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Main ───────────────────────────────────────────────────── */}
        <main
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "36px 24px 60px",
          }}
        >
          {/* Toolbar row */}
          {!loading && filteredJobs.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 28,
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: T.muted,
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                Showing{" "}
                <strong style={{ color: T.text, fontWeight: 600 }}>
                  {filteredJobs.length}
                </strong>{" "}
                {filteredJobs.length === 1 ? "position" : "positions"}
                {hasActiveFilters && <> — filters active</>}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  onMouseEnter={() => setHoverClear(true)}
                  onMouseLeave={() => setHoverClear(false)}
                  style={{
                    background: "transparent",
                    border: `1px solid ${hoverClear ? T.gold : T.border}`,
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    fontWeight: 500,
                    color: hoverClear ? T.gold : T.muted,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Clear all ×
                </button>
              )}
            </div>
          )}

          {/* Skeleton */}
          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: 20,
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} dark={dark} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredJobs.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                animation: "fadeUp 0.4s ease",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: T.emptyIcon,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 4,
                }}
              >
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  stroke="#bbb"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <line x1="12" y1="12" x2="12" y2="16" />
                  <line x1="10" y1="14" x2="14" y2="14" />
                </svg>
              </div>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 22,
                  fontWeight: 400,
                  color: T.text,
                  margin: 0,
                }}
              >
                No positions found
              </h2>
              <p style={{ fontSize: 14, color: T.faint, margin: 0 }}>
                Try adjusting your search or clearing the filters.
              </p>
              <button
                onClick={clearAllFilters}
                style={{
                  marginTop: 8,
                  height: 40,
                  padding: "0 22px",
                  background: T.btnBg,
                  color: T.btnColor,
                  border: "none",
                  borderRadius: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Job cards grid */}
          {!loading && filteredJobs.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: 20,
              }}
            >
              {filteredJobs.map((job, idx) => {
                const isActive = activeCard === job.job_id;
                const isHover = hoverCard === job.job_id;
                const isApplying = applyingId === job.job_id;
                const isApplied = appliedIds.has(job.job_id);
                const isApplyHover = hoverApply === job.job_id;

                const jtC = JOB_TYPE_COLORS[job.job_type] ?? {
                  bg: T.tagNeutralBg,
                  color: T.tagNeutralColor,
                  border: T.tagNeutralBorder,
                };
                const wlC = WORK_LOC_COLORS[job.work_location] ?? {
                  bg: T.tagNeutralBg,
                  color: T.tagNeutralColor,
                  border: T.tagNeutralBorder,
                };

                /* Apply button derived colors */
                const applyBg = isApplied
                  ? "#16a34a"
                  : isApplyHover
                    ? "#d4a017"
                    : T.btnBg;
                const applyColor = isApplied
                  ? "#fff"
                  : isApplyHover
                    ? "#1a1a1a"
                    : T.btnColor;

                return (
                  <article
                    key={job.job_id}
                    onClick={() => setActiveCard(isActive ? null : job.job_id)}
                    onMouseEnter={() => setHoverCard(job.job_id)}
                    onMouseLeave={() => setHoverCard(null)}
                    style={{
                      background: T.cardBg,
                      border: `1px solid ${
                        isActive
                          ? T.gold
                          : isHover
                            ? dark
                              ? "#3a3a30"
                              : "#d4c08a"
                            : T.cardBorder
                      }`,
                      borderRadius: 16,
                      padding: 24,
                      display: "flex",
                      flexDirection: "column",
                      gap: 18,
                      cursor: "pointer",
                      transition: "all 0.25s cubic-bezier(0.2,0,0,1)",
                      position: "relative",
                      overflow: "hidden",
                      transform: isHover ? "translateY(-3px)" : "none",
                      boxShadow: isHover
                        ? dark
                          ? "0 12px 40px rgba(0,0,0,0.4)"
                          : "0 12px 40px rgba(0,0,0,0.1)"
                        : "none",
                      outline: isActive ? `2px solid ${T.gold}` : "none",
                      animation: `fadeUp 0.35s ease both`,
                      animationDelay: `${idx * 40}ms`,
                    }}
                  >
                    {/* Gold accent bar */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 4,
                        height: "100%",
                        background:
                          "linear-gradient(180deg, #d4a017 0%, #e8c350 100%)",
                        borderRadius: "16px 0 0 16px",
                        opacity: isHover || isActive ? 1 : 0,
                        transition: "opacity 0.2s",
                      }}
                    />

                    {/* Company row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        {job.company_logo ? (
                          <img
                            src={job.company_logo}
                            alt={job.company_name}
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 10,
                              objectFit: "cover",
                              border: `1px solid ${T.border}`,
                              background: T.tagNeutralBg,
                              flexShrink: 0,
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 10,
                              background: dark
                                ? "linear-gradient(135deg,#2a2a28,#333)"
                                : "linear-gradient(135deg,#e8e4dc,#d0c9be)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "'DM Serif Display', serif",
                              fontSize: 18,
                              color: T.faint,
                              flexShrink: 0,
                            }}
                          >
                            {job.company_name?.[0] ?? "?"}
                          </div>
                        )}
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 13.5,
                              color: T.text,
                              lineHeight: 1.2,
                            }}
                          >
                            {job.company_name}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: T.faint,
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                              marginTop: 2,
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
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {job.location}
                          </div>
                        </div>
                      </div>
                      {job.created_at && (
                        <span
                          style={{
                            fontSize: 11.5,
                            color: dark ? "#555" : "#bbb",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {timeAgo(job.created_at)}
                        </span>
                      )}
                    </div>

                    {/* Title & description */}
                    <div>
                      <h2
                        style={{
                          fontFamily: "'DM Serif Display', serif",
                          fontSize: 20,
                          fontWeight: 400,
                          color: T.text,
                          lineHeight: 1.25,
                          margin: 0,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {job.title}
                      </h2>
                      <p
                        style={{
                          fontSize: 13,
                          color: T.muted,
                          lineHeight: 1.65,
                          margin: "6px 0 0",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {job.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {/* Job type */}
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 500,
                          padding: "4px 10px",
                          borderRadius: 100,
                          border: `1px solid ${jtC.border}`,
                          background: jtC.bg,
                          color: jtC.color,
                          lineHeight: 1,
                        }}
                      >
                        {job.job_type}
                      </span>

                      {/* Work location */}
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 500,
                          padding: "4px 10px",
                          borderRadius: 100,
                          border: `1px solid ${wlC.border}`,
                          background: wlC.bg,
                          color: wlC.color,
                          lineHeight: 1,
                        }}
                      >
                        {job.work_location}
                      </span>

                      {/* Role */}
                      {job.role && (
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 500,
                            padding: "4px 10px",
                            borderRadius: 100,
                            border: `1px solid ${T.tagNeutralBorder}`,
                            background: T.tagNeutralBg,
                            color: T.tagNeutralColor,
                            lineHeight: 1,
                          }}
                        >
                          {job.role}
                        </span>
                      )}

                      {/* Openings */}
                      {job.openings && (
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 500,
                            padding: "4px 10px",
                            borderRadius: 100,
                            border: `1px solid ${T.tagNeutralBorder}`,
                            background: T.tagNeutralBg,
                            color: T.tagNeutralColor,
                            lineHeight: 1,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <svg
                            width="9"
                            height="9"
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

                    {/* Footer */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: 16,
                        borderTop: `1px solid ${T.footerDivider}`,
                        marginTop: "auto",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: 19,
                            fontWeight: 400,
                            color: T.text,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          ₹{Number(job.salary).toLocaleString("en-IN")}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: T.faint,
                            marginTop: 1,
                          }}
                        >
                          per annum
                        </div>
                      </div>

                      <button
                        onClick={(e) => applyHandler(e, job.job_id)}
                        disabled={isApplying || isApplied}
                        onMouseEnter={() => setHoverApply(job.job_id)}
                        onMouseLeave={() => setHoverApply(null)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 7,
                          background: applyBg,
                          color: applyColor,
                          border: "none",
                          borderRadius: 10,
                          padding: "9px 18px",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor:
                            isApplying || isApplied ? "not-allowed" : "pointer",
                          transition: "all 0.2s",
                          letterSpacing: "0.02em",
                          opacity: isApplying ? 0.7 : 1,
                          transform:
                            isApplyHover && !isApplied
                              ? "translateY(-1px)"
                              : "none",
                        }}
                      >
                        {isApplied ? (
                          <>
                            <svg
                              width="13"
                              height="13"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Applied
                          </>
                        ) : isApplying ? (
                          "Applying…"
                        ) : (
                          <>
                            Apply now
                            <svg
                              width="14"
                              height="14"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                              style={{
                                transition: "transform 0.2s",
                                transform: isApplyHover
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
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default JobsPage;
