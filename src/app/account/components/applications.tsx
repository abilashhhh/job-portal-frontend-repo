"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { User_Service } from "@/context/AppContext";

interface Application {
  application_id: number;
  job_id: number;
  job_title: string;
  company_name: string;
  company_logo: string;
  status: string;
  location: string;
  applied_at: string;
}

const STATUS_CONFIG: Record<
  string,
  {
    bg: (dark: boolean) => string;
    color: string;
    border: (dark: boolean) => string;
    dot: string;
  }
> = {
  pending: {
    bg: (d) => (d ? "rgba(217,119,6,0.1)" : "#fffbeb"),
    color: "#d97706",
    border: (d) => (d ? "rgba(217,119,6,0.25)" : "#fde68a"),
    dot: "#d97706",
  },
  shortlisted: {
    bg: (d) => (d ? "rgba(59,130,246,0.1)" : "#eff6ff"),
    color: "#3b82f6",
    border: (d) => (d ? "rgba(59,130,246,0.25)" : "#bfdbfe"),
    dot: "#3b82f6",
  },
  accepted: {
    bg: (d) => (d ? "rgba(22,163,74,0.1)" : "#f0fdf4"),
    color: "#16a34a",
    border: (d) => (d ? "rgba(22,163,74,0.25)" : "#bbf7d0"),
    dot: "#16a34a",
  },
  rejected: {
    bg: (d) => (d ? "rgba(220,38,38,0.1)" : "#fff1f2"),
    color: "#dc2626",
    border: (d) => (d ? "rgba(220,38,38,0.25)" : "#fecdd3"),
    dot: "#dc2626",
  },
};

const MyApplications = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [focusSearch, setFocusSearch] = useState(false);
  const [hoverCard, setHoverCard] = useState<number | null>(null);
  const [hoverView, setHoverView] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    fetchApplications();
  }, []);

  const T = {
    bg: dark ? "#111110" : "#F7F4EF",
    surface: dark ? "#1a1a18" : "#ffffff",
    surfaceAlt: dark ? "#141413" : "#faf8f5",
    border: dark ? "#2a2a28" : "#e8e4dc",
    borderLight: dark ? "#222220" : "#f0ece5",
    text: dark ? "#f0ede8" : "#1a1a1a",
    muted: dark ? "#888" : "#666",
    faint: dark ? "#444" : "#bbb",
    gold: "#d4a017",
    // lighter gold used for gradients (added to fix missing property)
    goldLight: dark ? "#f5d18a" : "#ffd873",
    btnBg: dark ? "#d4a017" : "#1a1a1a",
    btnColor: dark ? "#1a1a1a" : "#f0ede8",
    inputBg: dark ? "#111110" : "#ffffff",
    inputBorder: dark ? "#2a2a28" : "#e0dcd5",
    cardBg: dark ? "#1a1a18" : "#ffffff",
    selectBg: dark ? "#1a1a18" : "#ffffff",
    tagNeutralBg: dark ? "#252523" : "#f5f2ed",
    tagNeutralColor: dark ? "#999" : "#666",
    tagNeutralBorder: dark ? "#333330" : "#e8e4dc",
  };

  const fetchApplications = async () => {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get(
        `${User_Service}/api/users/getAllApplications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setApplications(data || []);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchSearch =
        app.job_title?.toLowerCase().includes(search.toLowerCase()) ||
        app.company_name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || app.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [applications, search, statusFilter]);

  const timeAgo = (date: string) => {
    const d = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
    if (d === 0) return "Today";
    if (d === 1) return "Yesterday";
    if (d < 7) return `${d}d ago`;
    if (d < 30) return `${Math.floor(d / 7)}w ago`;
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  if (!mounted) return null;

  const shimmer: React.CSSProperties = {
    background: dark
      ? "linear-gradient(90deg,#252523 25%,#2e2e2b 50%,#252523 75%)"
      : "linear-gradient(90deg,#f0ece5 25%,#e8e4dc 50%,#f0ece5 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: 6,
  };

  return (
    <>
      <style>{`
        input::placeholder,select { color: ${T.faint}; }
        select { appearance: none; -webkit-appearance: none; }
        * { box-sizing: border-box; }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
      `}</style>

      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: T.cardBg,
          border: `1px solid ${T.border}`,
          borderRadius: 20,
          overflow: "hidden",
          animation: "fadeUp 0.4s ease 0.2s both",
          boxShadow: dark
            ? "0 4px 24px rgba(0,0,0,0.3)"
            : "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "22px 28px",
            borderBottom: `1px solid ${T.border}`,
            background: dark ? "#141413" : "#faf8f5",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: dark
                ? "rgba(59,130,246,0.12)"
                : "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 18,
                fontWeight: 400,
                color: T.text,
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              My Applications
            </h2>
            <p
              style={{
                fontSize: 12,
                color: T.muted,
                margin: "2px 0 0",
                fontWeight: 300,
              }}
            >
              Track all your job applications
            </p>
          </div>
          {!loading && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: dark
                  ? "rgba(212,160,23,0.1)"
                  : "rgba(212,160,23,0.08)",
                border: "1px solid rgba(212,160,23,0.22)",
                borderRadius: 100,
                padding: "4px 11px",
                fontSize: 11,
                fontWeight: 700,
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
              {applications.length} total
            </div>
          )}
        </div>

        <div style={{ padding: "20px 28px" }}>
          {/* Filters */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            {/* Search */}
            <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 13,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: focusSearch ? T.gold : T.faint,
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
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search job or company…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setFocusSearch(true)}
                onBlur={() => setFocusSearch(false)}
                style={{
                  width: "100%",
                  height: 40,
                  paddingLeft: 38,
                  paddingRight: 14,
                  background: T.inputBg,
                  border: `1.5px solid ${focusSearch ? T.gold : T.inputBorder}`,
                  borderRadius: 9,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13.5,
                  color: T.text,
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxShadow: focusSearch
                    ? "0 0 0 3px rgba(212,160,23,0.15)"
                    : "none",
                }}
              />
            </div>

            {/* Status filter */}
            <div style={{ position: "relative", minWidth: 150 }}>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: T.faint,
                }}
              >
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: "100%",
                  height: 40,
                  paddingLeft: 34,
                  paddingRight: 30,
                  background: T.selectBg,
                  border: `1.5px solid ${T.inputBorder}`,
                  borderRadius: 9,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13.5,
                  color: T.text,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {["all", "pending", "shortlisted", "accepted", "rejected"].map(
                  (s) => (
                    <option
                      key={s}
                      value={s}
                      style={{ background: T.selectBg }}
                    >
                      {s === "all"
                        ? "All Status"
                        : s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ),
                )}
              </select>
              <span
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: T.faint,
                }}
              >
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 14,
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    padding: 18,
                    border: `1px solid ${T.border}`,
                    borderRadius: 14,
                    display: "flex",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      ...shimmer,
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        ...shimmer,
                        height: 13,
                        width: "70%",
                        marginBottom: 8,
                      }}
                    />
                    <div
                      style={{
                        ...shimmer,
                        height: 11,
                        width: "50%",
                        marginBottom: 8,
                      }}
                    />
                    <div
                      style={{
                        ...shimmer,
                        height: 22,
                        width: 70,
                        borderRadius: 100,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredApps.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 24px" }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: dark ? "#252523" : "#f0ece5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <svg
                  width="26"
                  height="26"
                  fill="none"
                  stroke={T.faint}
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: T.text,
                  margin: "0 0 6px",
                  fontFamily: "'DM Serif Display', serif",
                }}
              >
                No applications found
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: T.muted,
                  margin: 0,
                  fontWeight: 300,
                }}
              >
                {search || statusFilter !== "all"
                  ? "Try adjusting your filters."
                  : "You haven't applied to any jobs yet."}
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && filteredApps.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 14,
              }}
            >
              {filteredApps.map((app, idx) => {
                const sc = STATUS_CONFIG[app.status] || {
                  bg: () => T.tagNeutralBg,
                  color: T.tagNeutralColor,
                  border: () => T.tagNeutralBorder,
                  dot: T.faint,
                };
                const isHov = hoverCard === app.application_id;
                const isViewHov = hoverView === app.application_id;

                return (
                  <div
                    key={app.application_id}
                    onMouseEnter={() => setHoverCard(app.application_id)}
                    onMouseLeave={() => setHoverCard(null)}
                    style={{
                      padding: "16px 16px 14px",
                      background: T.cardBg,
                      border: `1px solid ${isHov ? T.gold + "55" : T.border}`,
                      borderRadius: 14,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      transition: "all 0.25s cubic-bezier(0.2,0,0,1)",
                      transform: isHov ? "translateY(-2px)" : "none",
                      boxShadow: isHov
                        ? dark
                          ? "0 10px 30px rgba(0,0,0,0.35)"
                          : "0 10px 30px rgba(0,0,0,0.08)"
                        : "none",
                      animation: `fadeUp 0.35s ease both`,
                      animationDelay: `${idx * 40}ms`,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Gold bar */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 3,
                        height: "100%",
                        background: `linear-gradient(180deg, ${T.gold}, ${T.goldLight})`,
                        borderRadius: "14px 0 0 14px",
                        opacity: isHov ? 1 : 0,
                        transition: "opacity 0.2s",
                      }}
                    />

                    {/* Top row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      {app.company_logo ? (
                        <img
                          src={app.company_logo}
                          alt={app.company_name}
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 10,
                            objectFit: "cover",
                            border: `1px solid ${T.border}`,
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
                            background: dark ? "#252523" : "#f0ece5",
                            border: `1px solid ${T.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "'DM Serif Display',serif",
                            fontSize: 18,
                            color: T.faint,
                            flexShrink: 0,
                          }}
                        >
                          {app.company_name?.[0] ?? "?"}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: T.text,
                            marginBottom: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {app.job_title}
                        </div>
                        <div style={{ fontSize: 12.5, color: T.muted }}>
                          {app.company_name}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          color: T.faint,
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {timeAgo(app.applied_at)}
                      </span>
                    </div>

                    {/* Meta */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      {app.location && (
                        <span
                          style={{
                            fontSize: 11.5,
                            color: T.muted,
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
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
                          {app.location}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 100,
                          background: sc.bg(dark),
                          color: sc.color,
                          border: `1px solid ${sc.border(dark)}`,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          textTransform: "capitalize",
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: sc.dot,
                          }}
                        />
                        {app.status}
                      </span>
                    </div>

                    {/* View button */}
                    <button
                      onClick={() => router.push(`/jobs/${app.job_id}`)}
                      onMouseEnter={() => setHoverView(app.application_id)}
                      onMouseLeave={() => setHoverView(null)}
                      style={{
                        height: 34,
                        width: "100%",
                        background: "transparent",
                        border: `1.5px solid ${isViewHov ? T.gold : T.border}`,
                        borderRadius: 8,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: isViewHov ? T.gold : T.muted,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      View Job
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        style={{
                          transition: "transform 0.2s",
                          transform: isViewHov ? "translateX(2px)" : "none",
                        }}
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyApplications;
