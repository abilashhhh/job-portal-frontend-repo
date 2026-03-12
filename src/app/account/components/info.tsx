"use client";
import { useAppData } from "@/context/AppContext";
import { AccountProps } from "@/lib/type";
import Link from "next/link";
import React, { ChangeEvent, useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";

const Info: React.FC<AccountProps> = ({ user, isYourAccount }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";

  const inputRef = useRef<HTMLInputElement | null>(null);
  const resumeRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);
  const [hoverSave, setHoverSave] = useState(false);
  const [hoverCancel, setHoverCancel] = useState(false);
  const [hoverResume, setHoverResume] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const { updateProfilePic, updateResume, btnLoading, updateUser } =
    useAppData();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        setModalOpen(false);
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
    goldLight: "#e8c350",
    btnBg: dark ? "#d4a017" : "#1a1a1a",
    btnColor: dark ? "#1a1a1a" : "#f0ede8",
    inputBg: dark ? "#111110" : "#ffffff",
    inputBorder: dark ? "#2a2a28" : "#e0dcd5",
    cardBg: dark ? "#1a1a18" : "#ffffff",
    overlay: dark ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.45)",
    divider: dark ? "#222220" : "#f0ece5",
  };

  const handleClick = () => inputRef.current?.click();
  const handleResumeClick = () => resumeRef.current?.click();

  const openEdit = () => {
    setName(user.name);
    setPhoneNumber(String(user.phone_number));
    setBio(user.bio || "");
    setModalOpen(true);
  };

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      updateProfilePic(formData);
    }
  };

  

  const changeResume = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      updateResume(formData);
    }
  };

  const updateProfileHandler = async () => {
    await updateUser(name, Number(phone_number), bio);
    setModalOpen(false);
  };

  const inputStyle = (id: string): React.CSSProperties => ({
    width: "100%",
    height: 44,
    paddingLeft: 42,
    paddingRight: 14,
    background: T.inputBg,
    border: `1.5px solid ${focusField === id ? T.gold : T.inputBorder}`,
    borderRadius: 10,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: T.text,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: focusField === id ? "0 0 0 3px rgba(212,160,23,0.15)" : "none",
    boxSizing: "border-box",
  });

  if (!mounted) return null;

  const roleBadge =
    user.role === "recruiter"
      ? {
          bg: dark ? "rgba(139,92,246,0.12)" : "rgba(139,92,246,0.08)",
          color: "#8b5cf6",
          border: "rgba(139,92,246,0.25)",
        }
      : {
          bg: dark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)",
          color: "#10b981",
          border: "rgba(16,185,129,0.25)",
        };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp{ from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder,textarea::placeholder { color: ${T.faint}; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 10px; }
      `}</style>

      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: T.cardBg,
          border: `1px solid ${T.border}`,
          borderRadius: 20,
          overflow: "hidden",
          animation: "fadeUp 0.4s ease both",
          boxShadow: dark
            ? "0 4px 24px rgba(0,0,0,0.3)"
            : "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Banner */}
        <div
          style={{
            height: 140,
            background: `linear-gradient(135deg, #0d0d0c 0%, #1a1505 40%, #2a1f08 70%, #0d0d0c 100%)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative elements */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(212,160,23,0.18) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 32,
              top: "50%",
              transform: "translateY(-50%)",
              width: 100,
              height: 100,
              borderRadius: "50%",
              border: "1px solid rgba(212,160,23,0.12)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 52,
              top: "50%",
              transform: "translateY(-50%)",
              width: 60,
              height: 60,
              borderRadius: "50%",
              border: "1px solid rgba(212,160,23,0.08)",
              pointerEvents: "none",
            }}
          />

          {/* Avatar */}
          <div style={{ position: "absolute", bottom: 28, left: 28 }}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  border: `3px solid ${T.cardBg}`,
                  overflow: "hidden",
                  background: T.cardBg,
                  boxShadow: dark
                    ? "0 4px 20px rgba(0,0,0,0.5)"
                    : "0 4px 20px rgba(0,0,0,0.15)",
                }}
              >
                <img
                  src={user?.profile_pic || "/userimg.jpg"}
                  alt={user.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/userimg.jpg";
                  }}
                />
              </div>
              {isYourAccount && (
                <>
                  <button
                    onClick={handleClick}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: T.gold,
                      border: `2px solid ${T.cardBg}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <svg
                      width="13"
                      height="13"
                      fill="none"
                      stroke="#1a1a1a"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={changeHandler}
                    style={{ display: "none" }}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "44px 28px 32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <h1
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    fontWeight: 400,
                    color: T.text,
                    margin: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {user.name}
                </h1>
                {isYourAccount && (
                  <button
                    onClick={openEdit}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      background: dark ? "#252523" : "#f5f2ed",
                      border: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: T.muted,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        T.gold;
                      (e.currentTarget as HTMLButtonElement).style.color =
                        T.gold;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        T.border;
                      (e.currentTarget as HTMLButtonElement).style.color =
                        T.muted;
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
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 12px",
                    borderRadius: 100,
                    background: roleBadge.bg,
                    border: `1px solid ${roleBadge.border}`,
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: roleBadge.color,
                    textTransform: "capitalize",
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
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.role === "jobseeker" && user.bio && (
            <div
              style={{
                padding: "16px 18px",
                background: dark
                  ? "rgba(212,160,23,0.06)"
                  : "rgba(212,160,23,0.04)",
                border: `1px solid rgba(212,160,23,0.18)`,
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 8,
                }}
              >
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  stroke={T.gold}
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: T.gold,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  About
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: T.muted,
                  lineHeight: 1.75,
                  margin: 0,
                  fontWeight: 300,
                }}
              >
                {user.bio}
              </p>
            </div>
          )}

          {/* Contact */}
          <div style={{ marginBottom: 24 }}>
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
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  background: "rgba(212,160,23,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  stroke={T.gold}
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
                Contact Information
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 10,
              }}
            >
              {[
                {
                  label: "Email",
                  value: user.email,
                  icon: (
                    <svg
                      width="15"
                      height="15"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  ),
                  accent: "#3b82f6",
                },
                {
                  label: "Phone",
                  value: String(user.phone_number),
                  icon: (
                    <svg
                      width="15"
                      height="15"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l1.27-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  ),
                  accent: "#10b981",
                },
              ].map(({ label, value, icon, accent }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    background: T.surfaceAlt,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = accent + "66")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = T.border)
                  }
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: dark ? "#252523" : "#f5f2ed",
                      border: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: T.faint,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 13.5,
                        color: T.text,
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resume */}
          {user.role === "jobseeker" && user.resume && (
            <div>
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
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    background: "rgba(239,68,68,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
                  Resume
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  background: dark
                    ? "rgba(239,68,68,0.06)"
                    : "rgba(239,68,68,0.03)",
                  border: `1px solid ${dark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.15)"}`,
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: dark
                      ? "rgba(239,68,68,0.12)"
                      : "rgba(239,68,68,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: T.text,
                      marginBottom: 3,
                    }}
                  >
                    Resume Document
                  </div>
                  <Link
                    href={user.resume}
                    target="_blank"
                    style={{
                      fontSize: 12.5,
                      color: "#ef4444",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.textDecoration = "none")
                    }
                  >
                    View PDF →
                  </Link>
                </div>
                {isYourAccount && (
                  <>
                    <button
                      onClick={handleResumeClick}
                      onMouseEnter={() => setHoverResume(true)}
                      onMouseLeave={() => setHoverResume(false)}
                      style={{
                        height: 34,
                        padding: "0 14px",
                        background: "transparent",
                        border: `1.5px solid ${hoverResume ? "#ef4444" : T.border}`,
                        borderRadius: 8,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: hoverResume ? "#ef4444" : T.muted,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Update
                    </button>
                    <input
                      type="file"
                      ref={resumeRef}
                      accept="application/pdf"
                      onChange={changeResume}
                      style={{ display: "none" }}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
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
              maxWidth: 460,
              background: dark ? "#1a1a18" : "#ffffff",
              border: `1px solid ${T.border}`,
              borderRadius: 22,
              overflow: "hidden",
              animation: "slideUp 0.28s ease both",
              boxShadow: dark
                ? "0 32px 80px rgba(0,0,0,0.65)"
                : "0 32px 80px rgba(0,0,0,0.14)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 28,
                right: 28,
                height: 3,
                background: `linear-gradient(90deg, transparent, ${T.gold}, ${T.goldLight}, ${T.gold}, transparent)`,
                borderRadius: "0 0 4px 4px",
              }}
            />

            {/* Modal header */}
            <div
              style={{
                padding: "26px 28px 18px",
                borderBottom: `1px solid ${T.borderLight}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 20,
                    fontWeight: 400,
                    color: T.text,
                    margin: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Edit Profile
                </h3>
                <p
                  style={{ fontSize: 12.5, color: T.muted, margin: "3px 0 0" }}
                >
                  Update your personal information
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: dark ? "#252523" : "#f5f2ed",
                  border: `1px solid ${T.border}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: T.muted,
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div
              style={{
                padding: "22px 28px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {[
                {
                  id: "name",
                  label: "Full Name",
                  value: name,
                  setter: setName,
                  type: "text",
                  placeholder: "John Doe",
                  icon: (
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  ),
                },
                {
                  id: "phone",
                  label: "Phone Number",
                  value: phone_number,
                  setter: setPhoneNumber,
                  type: "tel",
                  placeholder: "+91 98765 43210",
                  icon: (
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l1.27-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  ),
                },
              ].map(({ id, label, value, setter, type, placeholder, icon }) => (
                <div key={id}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: T.muted,
                      letterSpacing: "0.09em",
                      textTransform: "uppercase",
                      marginBottom: 7,
                    }}
                  >
                    {label}
                  </label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 13,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        color: focusField === id ? T.gold : T.faint,
                        transition: "color 0.2s",
                      }}
                    >
                      {icon}
                    </span>
                    <input
                      type={type}
                      value={value}
                      placeholder={placeholder}
                      onChange={(e) => setter(e.target.value)}
                      onFocus={() => setFocusField(id)}
                      onBlur={() => setFocusField(null)}
                      style={inputStyle(id)}
                    />
                  </div>
                </div>
              ))}

              {user.role === "jobseeker" && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: T.muted,
                      letterSpacing: "0.09em",
                      textTransform: "uppercase",
                      marginBottom: 7,
                    }}
                  >
                    Bio
                  </label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 13,
                        top: 13,
                        pointerEvents: "none",
                        color: focusField === "bio" ? T.gold : T.faint,
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
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </span>
                    <textarea
                      value={bio}
                      placeholder="Write a short bio…"
                      onChange={(e) => setBio(e.target.value)}
                      onFocus={() => setFocusField("bio")}
                      onBlur={() => setFocusField(null)}
                      rows={3}
                      style={{
                        width: "100%",
                        paddingLeft: 40,
                        paddingRight: 14,
                        paddingTop: 11,
                        paddingBottom: 11,
                        background: T.inputBg,
                        border: `1.5px solid ${focusField === "bio" ? T.gold : T.inputBorder}`,
                        borderRadius: 10,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14,
                        color: T.text,
                        outline: "none",
                        resize: "vertical",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        boxShadow:
                          focusField === "bio"
                            ? "0 0 0 3px rgba(212,160,23,0.15)"
                            : "none",
                        lineHeight: 1.6,
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  onClick={() => setModalOpen(false)}
                  onMouseEnter={() => setHoverCancel(true)}
                  onMouseLeave={() => setHoverCancel(false)}
                  style={{
                    height: 44,
                    padding: "0 20px",
                    background: "transparent",
                    border: `1.5px solid ${hoverCancel ? T.gold : T.border}`,
                    borderRadius: 11,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: hoverCancel ? T.gold : T.muted,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={updateProfileHandler}
                  disabled={btnLoading}
                  onMouseEnter={() => setHoverSave(true)}
                  onMouseLeave={() => setHoverSave(false)}
                  style={{
                    flex: 1,
                    height: 44,
                    background: hoverSave ? "#d4a017" : T.btnBg,
                    color: hoverSave ? "#1a1a1a" : T.btnColor,
                    border: "none",
                    borderRadius: 11,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: btnLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    transition: "all 0.2s",
                    opacity: btnLoading ? 0.75 : 1,
                  }}
                >
                  {btnLoading ? (
                    <>
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          border: "2px solid currentColor",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                          display: "inline-block",
                        }}
                      />
                      Saving…
                    </>
                  ) : (
                    <>
                      Save Changes
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
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Info;
