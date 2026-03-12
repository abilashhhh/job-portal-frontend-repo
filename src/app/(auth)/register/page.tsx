"use client";
import { Auth_Service, useAppData } from "@/context/AppContext";
import axios from "axios";
import { redirect } from "next/navigation";
import React, { FormEvent, useState, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Link from "next/link";
import { useTheme } from "next-themes";
import Loading from "@/components/ui/Loading";

/* ─────────────────────────────────────────────────────────────────────────────
   Step config
───────────────────────────────────────────────────────────────────────────── */
const STEPS_JOBSEEKER = ["Role", "Account", "Profile"];
const STEPS_RECRUITER = ["Role", "Account"];

const RegisterPage = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [step, setStep] = useState(0); // 0 = role select, 1 = account, 2 = profile (jobseeker)

  // hover states
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [hoverBack, setHoverBack] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);
  const [hoverRole, setHoverRole] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const { isAuth, setUser, loading, setIsAuth } = useAppData();

  useEffect(() => setMounted(true), []);

  if (loading) return <Loading />;
  if (isAuth) return redirect("/");

  const steps =
    role === "jobseeker"
      ? STEPS_JOBSEEKER
      : role === "recruiter"
        ? STEPS_RECRUITER
        : [];

  /* ── Theme tokens ──────────────────────────────────────────────────────── */
  const T = {
    bg: dark ? "#111110" : "#F7F4EF",
    surface: dark ? "#1a1a18" : "#ffffff",
    surfaceAlt: dark ? "#141413" : "#faf8f5",
    border: dark ? "#2a2a28" : "#e8e4dc",
    borderFocus: "#d4a017",
    text: dark ? "#f0ede8" : "#1a1a1a",
    muted: dark ? "#888" : "#666",
    faint: dark ? "#444" : "#ccc",
    gold: "#d4a017",
    goldLight: "#e8c350",
    btnBg: dark ? "#d4a017" : "#1a1a1a",
    btnColor: dark ? "#1a1a1a" : "#f0ede8",
    inputBg: dark ? "#111110" : "#ffffff",
    inputBorder: dark ? "#2a2a28" : "#e0dcd5",
    placeholderColor: dark ? "#444" : "#bbb",
    stepInactive: dark ? "#252523" : "#f0ece5",
    stepInactiveText: dark ? "#555" : "#bbb",
    divider: dark ? "#222220" : "#f0ece5",
    errorRed: "#ef4444",
    successGreen: "#16a34a",
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);

    const formData = new FormData();
    formData.append("role", role);
    formData.append("name", name);
    formData.append("phone_number", phoneNumber);
    formData.append("password", password);
    formData.append("email", email);
    if (role === "jobseeker") {
      formData.append("bio", bio);
      if (resume) formData.append("file", resume);
    }

    try {
      const { data } = await axios.post(
        `${Auth_Service}/api/auth/register`,
        formData,
      );
      Cookies.set("token", data.token, {
        expires: 15,
        secure: true,
        path: "/",
      });
      setUser(data.registeredUser);
      setIsAuth(true);
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
      setIsAuth(false);
    } finally {
      setBtnLoading(false);
    }
  };

  /* ── Shared input style ──────────────────────────────────────────────── */
  const inputStyle = (id: string): React.CSSProperties => ({
    width: "100%",
    height: 46,
    paddingLeft: 44,
    paddingRight: 16,
    background: T.inputBg,
    border: `1.5px solid ${focusField === id ? T.borderFocus : T.inputBorder}`,
    borderRadius: 10,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: T.text,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: focusField === id ? `0 0 0 3px rgba(212,160,23,0.15)` : "none",
    boxSizing: "border-box",
  });

  const iconWrap: React.CSSProperties = {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: focusField ? T.gold : T.faint,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: T.muted,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 7,
  };

  const fieldWrap: React.CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes slideIn { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:translateX(0)} }
        input::placeholder { color: ${T.placeholderColor}; }
        textarea::placeholder { color: ${T.placeholderColor}; }
        select option { background: ${T.surface}; color: ${T.text}; }
        * { box-sizing: border-box; }
      `}</style>

      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          minHeight: "100vh",
          background: T.bg,
          color: T.text,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
          transition: "background 0.3s, color 0.3s",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient blobs */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            background: dark
              ? "radial-gradient(ellipse 55% 50% at 15% 20%, rgba(212,160,23,0.06) 0%, transparent 65%), radial-gradient(ellipse 45% 55% at 85% 80%, rgba(16,185,129,0.05) 0%, transparent 60%)"
              : "radial-gradient(ellipse 55% 50% at 15% 20%, rgba(212,160,23,0.08) 0%, transparent 65%), radial-gradient(ellipse 45% 55% at 85% 80%, rgba(16,185,129,0.06) 0%, transparent 60%)",
          }}
        />

        {/* Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 480,
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 24,
            padding: "40px 36px 36px",
            position: "relative",
            animation: "fadeUp 0.45s ease both",
            boxShadow: dark
              ? "0 32px 80px rgba(0,0,0,0.5)"
              : "0 32px 80px rgba(0,0,0,0.09)",
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

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: dark
                  ? "rgba(212,160,23,0.12)"
                  : "rgba(212,160,23,0.1)",
                border: `1px solid rgba(212,160,23,0.25)`,
                borderRadius: 100,
                padding: "5px 14px",
                fontSize: 11,
                fontWeight: 600,
                color: T.gold,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 14,
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
              HireHeaven
            </div>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.7rem, 4vw, 2.2rem)",
                fontWeight: 400,
                color: T.text,
                margin: "0 0 8px",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Create your account
            </h1>
            <p
              style={{
                fontSize: 13.5,
                color: T.muted,
                margin: 0,
                fontWeight: 300,
              }}
            >
              Join thousands finding their next{" "}
              <em style={{ fontStyle: "italic", color: T.gold }}>great</em> role
            </p>
          </div>

          {/* Step indicator */}
          {steps.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                marginBottom: 32,
              }}
            >
              {steps.map((s, i) => {
                const isActive = i === step;
                const isDone = i < step;
                return (
                  <React.Fragment key={s}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: isDone
                            ? T.successGreen
                            : isActive
                              ? T.gold
                              : T.stepInactive,
                          border: `2px solid ${isDone ? T.successGreen : isActive ? T.gold : T.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s",
                          marginBottom: 5,
                        }}
                      >
                        {isDone ? (
                          <svg
                            width="13"
                            height="13"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: isActive ? "#1a1a1a" : T.stepInactiveText,
                            }}
                          >
                            {i + 1}
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: isActive
                            ? T.gold
                            : isDone
                              ? T.successGreen
                              : T.stepInactiveText,
                          transition: "color 0.3s",
                        }}
                      >
                        {s}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        style={{
                          height: 2,
                          flex: 0.6,
                          background:
                            i < step
                              ? `linear-gradient(90deg, ${T.successGreen}, ${T.gold})`
                              : T.stepInactive,
                          borderRadius: 2,
                          marginBottom: 20,
                          transition: "background 0.3s",
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          <form
            onSubmit={
              step === steps.length - 1 || (role === "recruiter" && step === 1)
                ? submitHandler
                : (e) => {
                    e.preventDefault();
                    setStep((s) => s + 1);
                  }
            }
          >
            {/* ── STEP 0: Role Selection ────────────────────────────────── */}
            {step === 0 && (
              <div style={{ animation: "slideIn 0.3s ease both" }}>
                <p style={{ ...labelStyle, marginBottom: 14 }}>I want to</p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  {[
                    {
                      value: "jobseeker",
                      title: "Find a Job",
                      sub: "Browse & apply to listings",
                      icon: (
                        <svg
                          width="22"
                          height="22"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.35-4.35" />
                        </svg>
                      ),
                    },
                    {
                      value: "recruiter",
                      title: "Hire Talent",
                      sub: "Post jobs & find candidates",
                      icon: (
                        <svg
                          width="22"
                          height="22"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      ),
                    },
                  ].map((opt) => {
                    const isSelected = role === opt.value;
                    const isHov = hoverRole === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRole(opt.value)}
                        onMouseEnter={() => setHoverRole(opt.value)}
                        onMouseLeave={() => setHoverRole(null)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 10,
                          padding: "20px 14px",
                          background: isSelected
                            ? dark
                              ? "rgba(212,160,23,0.12)"
                              : "rgba(212,160,23,0.07)"
                            : isHov
                              ? dark
                                ? "#222220"
                                : "#faf8f5"
                              : T.surfaceAlt,
                          border: `2px solid ${isSelected ? T.gold : isHov ? T.border : T.border}`,
                          borderRadius: 14,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          fontFamily: "'DM Sans', sans-serif",
                          transform: isHov ? "translateY(-2px)" : "none",
                          boxShadow: isSelected
                            ? `0 0 0 3px rgba(212,160,23,0.18)`
                            : "none",
                        }}
                      >
                        <div
                          style={{
                            color: isSelected ? T.gold : T.muted,
                            transition: "color 0.2s",
                          }}
                        >
                          {opt.icon}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 13.5,
                              fontWeight: 600,
                              color: T.text,
                              marginBottom: 3,
                            }}
                          >
                            {opt.title}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: T.muted,
                              lineHeight: 1.4,
                            }}
                          >
                            {opt.sub}
                          </div>
                        </div>
                        {isSelected && (
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background: T.successGreen,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="10"
                              height="10"
                              fill="none"
                              stroke="#fff"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  disabled={!role}
                  onMouseEnter={() => setHoverNext(true)}
                  onMouseLeave={() => setHoverNext(false)}
                  style={{
                    width: "100%",
                    height: 48,
                    background: !role
                      ? T.stepInactive
                      : hoverNext
                        ? "#d4a017"
                        : T.btnBg,
                    color: !role
                      ? T.stepInactiveText
                      : hoverNext
                        ? "#1a1a1a"
                        : T.btnColor,
                    border: "none",
                    borderRadius: 12,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: !role ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s",
                    letterSpacing: "0.03em",
                    transform: hoverNext && role ? "translateY(-1px)" : "none",
                  }}
                >
                  Continue
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    style={{
                      transform: hoverNext ? "translateX(3px)" : "none",
                      transition: "transform 0.2s",
                    }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* ── STEP 1: Account Details ───────────────────────────────── */}
            {step === 1 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  animation: "slideIn 0.3s ease both",
                }}
              >
                {/* Full Name */}
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        ...iconWrap,
                        color: focusField === "name" ? T.gold : T.faint,
                      }}
                    >
                      <svg
                        width="15"
                        height="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      required
                      onFocus={() => setFocusField("name")}
                      onBlur={() => setFocusField(null)}
                      onChange={(e) => setName(e.target.value)}
                      style={inputStyle("name")}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        ...iconWrap,
                        color: focusField === "phone" ? T.gold : T.faint,
                      }}
                    >
                      <svg
                        width="15"
                        height="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l1.27-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </span>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phoneNumber}
                      required
                      onFocus={() => setFocusField("phone")}
                      onBlur={() => setFocusField(null)}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      style={inputStyle("phone")}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        ...iconWrap,
                        color: focusField === "email" ? T.gold : T.faint,
                      }}
                    >
                      <svg
                        width="15"
                        height="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      required
                      onFocus={() => setFocusField("email")}
                      onBlur={() => setFocusField(null)}
                      onChange={(e) => setEmail(e.target.value)}
                      style={inputStyle("email")}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        ...iconWrap,
                        color: focusField === "password" ? T.gold : T.faint,
                      }}
                    >
                      <svg
                        width="15"
                        height="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 characters"
                      value={password}
                      required
                      onFocus={() => setFocusField("password")}
                      onBlur={() => setFocusField(null)}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ ...inputStyle("password"), paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: T.faint,
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {showPassword ? (
                        <svg
                          width="15"
                          height="15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="15"
                          height="15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  {/* Back */}
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    onMouseEnter={() => setHoverBack(true)}
                    onMouseLeave={() => setHoverBack(false)}
                    style={{
                      height: 48,
                      padding: "0 20px",
                      background: "transparent",
                      border: `1.5px solid ${hoverBack ? T.gold : T.border}`,
                      borderRadius: 12,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: hoverBack ? T.gold : T.muted,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
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
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>

                  {/* Next / Submit */}
                  <button
                    type="submit"
                    disabled={btnLoading}
                    onMouseEnter={() => setHoverSubmit(true)}
                    onMouseLeave={() => setHoverSubmit(false)}
                    style={{
                      flex: 1,
                      height: 48,
                      background: hoverSubmit ? "#d4a017" : T.btnBg,
                      color: hoverSubmit ? "#1a1a1a" : T.btnColor,
                      border: "none",
                      borderRadius: 12,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: btnLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      transition: "all 0.2s",
                      letterSpacing: "0.03em",
                      opacity: btnLoading ? 0.7 : 1,
                      transform:
                        hoverSubmit && !btnLoading
                          ? "translateY(-1px)"
                          : "none",
                    }}
                  >
                    {role === "jobseeker" ? (
                      <>
                        Next: Profile
                        <svg
                          width="15"
                          height="15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                          style={{
                            transform: hoverSubmit ? "translateX(3px)" : "none",
                            transition: "transform 0.2s",
                          }}
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    ) : btnLoading ? (
                      "Creating account…"
                    ) : (
                      <>
                        Create Account
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
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Jobseeker Profile ─────────────────────────────── */}
            {step === 2 && role === "jobseeker" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  animation: "slideIn 0.3s ease both",
                }}
              >
                {/* Resume upload */}
                <div>
                  <label style={labelStyle}>Resume (PDF)</label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      const file = e.dataTransfer.files[0];
                      if (file && file.type === "application/pdf") {
                        setResume(file);
                        setResumeName(file.name);
                      } else {
                        toast.error("Please upload a PDF file");
                      }
                    }}
                    onClick={() =>
                      document.getElementById("resume-input")?.click()
                    }
                    style={{
                      border: `2px dashed ${dragOver ? T.gold : resume ? T.successGreen : T.inputBorder}`,
                      borderRadius: 12,
                      padding: "24px 16px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: dragOver
                        ? dark
                          ? "rgba(212,160,23,0.06)"
                          : "rgba(212,160,23,0.04)"
                        : resume
                          ? dark
                            ? "rgba(22,163,74,0.07)"
                            : "rgba(22,163,74,0.04)"
                          : T.inputBg,
                      transition: "all 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <input
                      type="file"
                      id="resume-input"
                      accept="application/pdf"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setResume(file);
                          setResumeName(file.name);
                        }
                      }}
                    />
                    {resume ? (
                      <>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: dark
                              ? "rgba(22,163,74,0.15)"
                              : "#f0fdf4",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            stroke="#16a34a"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.successGreen,
                          }}
                        >
                          {resumeName}
                        </div>
                        <div style={{ fontSize: 11, color: T.muted }}>
                          Click to change file
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: dark ? "#252523" : "#f5f2ed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            stroke={T.muted}
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: T.text,
                          }}
                        >
                          Drop your resume here or{" "}
                          <span style={{ color: T.gold, fontWeight: 600 }}>
                            browse
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: T.muted }}>
                          PDF only · Max 10MB
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label style={labelStyle}>Bio</label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 14,
                        top: 14,
                        pointerEvents: "none",
                        color: focusField === "bio" ? T.gold : T.faint,
                      }}
                    >
                      <svg
                        width="15"
                        height="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <textarea
                      placeholder="e.g. Full-stack developer with 3 years experience in React and Node.js…"
                      value={bio}
                      required
                      onFocus={() => setFocusField("bio")}
                      onBlur={() => setFocusField(null)}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      style={{
                        width: "100%",
                        paddingLeft: 44,
                        paddingRight: 16,
                        paddingTop: 12,
                        paddingBottom: 12,
                        background: T.inputBg,
                        border: `1.5px solid ${focusField === "bio" ? T.borderFocus : T.inputBorder}`,
                        borderRadius: 10,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14,
                        color: T.text,
                        outline: "none",
                        resize: "vertical",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        boxShadow:
                          focusField === "bio"
                            ? `0 0 0 3px rgba(212,160,23,0.15)`
                            : "none",
                        lineHeight: 1.6,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 5 }}>
                    {bio.length}/300 characters
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    onMouseEnter={() => setHoverBack(true)}
                    onMouseLeave={() => setHoverBack(false)}
                    style={{
                      height: 48,
                      padding: "0 20px",
                      background: "transparent",
                      border: `1.5px solid ${hoverBack ? T.gold : T.border}`,
                      borderRadius: 12,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: hoverBack ? T.gold : T.muted,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
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
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={btnLoading}
                    onMouseEnter={() => setHoverSubmit(true)}
                    onMouseLeave={() => setHoverSubmit(false)}
                    style={{
                      flex: 1,
                      height: 48,
                      background: hoverSubmit ? "#d4a017" : T.btnBg,
                      color: hoverSubmit ? "#1a1a1a" : T.btnColor,
                      border: "none",
                      borderRadius: 12,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: btnLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      transition: "all 0.2s",
                      letterSpacing: "0.03em",
                      opacity: btnLoading ? 0.7 : 1,
                      transform:
                        hoverSubmit && !btnLoading
                          ? "translateY(-1px)"
                          : "none",
                      boxShadow:
                        hoverSubmit && !btnLoading
                          ? "0 8px 24px rgba(212,160,23,0.28)"
                          : "none",
                    }}
                  >
                    {btnLoading ? (
                      "Creating account…"
                    ) : (
                      <>
                        Create Account
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
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Divider + Login link */}
          <div
            style={{
              marginTop: 28,
              paddingTop: 24,
              borderTop: `1px solid ${T.divider}`,
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>
              Already have an account?{" "}
              <Link
                href="/login"
                style={{
                  color: T.gold,
                  fontWeight: 600,
                  textDecoration: "none",
                  borderBottom: `1px solid transparent`,
                  paddingBottom: 1,
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderBottomColor = T.gold)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderBottomColor = "transparent")
                }
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p
          style={{
            fontSize: 11.5,
            color: T.faint,
            marginTop: 24,
            textAlign: "center",
          }}
        >
          By registering, you agree to our{" "}
          <Link
            href="/terms"
            style={{ color: T.muted, textDecoration: "underline" }}
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            style={{ color: T.muted, textDecoration: "underline" }}
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </>
  );
};

export default RegisterPage;
