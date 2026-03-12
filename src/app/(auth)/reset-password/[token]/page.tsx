"use client";

import { Auth_Service, useAppData } from "@/context/AppContext";
import axios from "axios";
import { redirect, useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useTheme } from "next-themes";

const ResetPage = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";

  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [hoverLogin, setHoverLogin] = useState(false);

  const { isAuth } = useAppData();
  useEffect(() => setMounted(true), []);

  if (isAuth) return redirect("/");

  /* ── Password strength ──────────────────────────────────────────────── */
  const getStrength = (p: string) => {
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  const strength = getStrength(password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#16a34a"][
    strength
  ];

  const passwordsMatch = confirm.length > 0 && password === confirm;
  const passwordsMismatch = confirm.length > 0 && password !== confirm;

  /* ── Theme tokens ─────────────────────────────────────────────────────── */
  const T = {
    bg: dark ? "#111110" : "#F7F4EF",
    surface: dark ? "#1a1a18" : "#ffffff",
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
    divider: dark ? "#222220" : "#f0ece5",
    strengthTrack: dark ? "#252523" : "#f0ece5",
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (strength < 2) {
      toast.error("Please choose a stronger password");
      return;
    }
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${Auth_Service}/api/auth/reset-password/${token}`,
        { password },
      );
      toast.success(data.message);
      setDone(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  const inputStyle = (
    id: string,
    extra?: React.CSSProperties,
  ): React.CSSProperties => ({
    width: "100%",
    height: 46,
    paddingLeft: 44,
    paddingRight: 44,
    background: T.inputBg,
    border: `1.5px solid ${focusField === id ? T.gold : T.inputBorder}`,
    borderRadius: 10,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: T.text,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: focusField === id ? "0 0 0 3px rgba(212,160,23,0.15)" : "none",
    ...extra,
  });

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes checkPop{ 0%{transform:scale(0)} 70%{transform:scale(1.18)} 100%{transform:scale(1)} }
        @keyframes barGrow { from{width:0} to{width:100%} }
        input::placeholder { color: ${T.faint}; }
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
        {/* Background blobs */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            background: dark
              ? "radial-gradient(ellipse 50% 50% at 80% 20%, rgba(212,160,23,0.05) 0%, transparent 65%), radial-gradient(ellipse 40% 50% at 15% 75%, rgba(139,92,246,0.04) 0%, transparent 60%)"
              : "radial-gradient(ellipse 50% 50% at 80% 20%, rgba(212,160,23,0.07) 0%, transparent 65%), radial-gradient(ellipse 40% 50% at 15% 75%, rgba(139,92,246,0.05) 0%, transparent 60%)",
          }}
        />

        {/* Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 440,
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

          {/* ── Success state ─────────────────────────────────────────── */}
          {done ? (
            <div
              style={{
                textAlign: "center",
                animation: "fadeUp 0.4s ease both",
                padding: "8px 0",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: dark
                    ? "rgba(22,163,74,0.12)"
                    : "rgba(22,163,74,0.08)",
                  border: "1.5px solid rgba(22,163,74,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  animation: "checkPop 0.45s ease both",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: dark
                    ? "rgba(22,163,74,0.1)"
                    : "rgba(22,163,74,0.07)",
                  border: "1px solid rgba(22,163,74,0.22)",
                  borderRadius: 100,
                  padding: "4px 13px",
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#16a34a",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Password Updated
              </div>

              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.5rem, 4vw, 1.9rem)",
                  fontWeight: 400,
                  color: T.text,
                  margin: "0 0 12px",
                  letterSpacing: "-0.02em",
                }}
              >
                All set!
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: T.muted,
                  lineHeight: 1.7,
                  margin: "0 0 28px",
                  fontWeight: 300,
                }}
              >
                Your password has been reset successfully. You can now sign in
                with your new password.
              </p>

              <button
                onClick={() => router.push("/login")}
                onMouseEnter={() => setHoverLogin(true)}
                onMouseLeave={() => setHoverLogin(false)}
                style={{
                  width: "100%",
                  height: 48,
                  background: hoverLogin ? "#d4a017" : T.btnBg,
                  color: hoverLogin ? "#1a1a1a" : T.btnColor,
                  border: "none",
                  borderRadius: 12,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  letterSpacing: "0.03em",
                  transform: hoverLogin ? "translateY(-1px)" : "none",
                  boxShadow: hoverLogin
                    ? "0 8px 24px rgba(212,160,23,0.28)"
                    : "none",
                }}
              >
                Go to Login
                <svg
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  style={{
                    transition: "transform 0.2s",
                    transform: hoverLogin ? "translateX(3px)" : "none",
                  }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              {/* ── Header ──────────────────────────────────────────────── */}
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: dark
                      ? "rgba(212,160,23,0.1)"
                      : "rgba(212,160,23,0.08)",
                    border: "1.5px solid rgba(212,160,23,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke={T.gold}
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: dark
                      ? "rgba(212,160,23,0.1)"
                      : "rgba(212,160,23,0.08)",
                    border: "1px solid rgba(212,160,23,0.22)",
                    borderRadius: 100,
                    padding: "4px 13px",
                    fontSize: 10.5,
                    fontWeight: 700,
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
                  Password Reset
                </div>

                <h1
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(1.6rem, 4vw, 2rem)",
                    fontWeight: 400,
                    color: T.text,
                    margin: "0 0 8px",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                  }}
                >
                  Set a new password
                </h1>
                <p
                  style={{
                    fontSize: 13.5,
                    color: T.muted,
                    margin: 0,
                    fontWeight: 300,
                    lineHeight: 1.6,
                  }}
                >
                  Choose a strong password to secure your account.
                </p>
              </div>

              {/* ── Form ──────────────────────────────────────────────── */}
              <form
                onSubmit={submitHandler}
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                {/* New password */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: T.muted,
                      letterSpacing: "0.09em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        color: focusField === "password" ? T.gold : T.faint,
                        transition: "color 0.2s",
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
                        <rect x="3" y="11" width="18" height="11" rx="2" />
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
                      style={inputStyle("password")}
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
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
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

                  {/* Strength meter */}
                  {password.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: 4,
                              borderRadius: 100,
                              background:
                                i <= strength ? strengthColor : T.strengthTrack,
                              transition: "background 0.3s",
                            }}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: strengthColor,
                          }}
                        >
                          {strengthLabel}
                        </span>
                        <span style={{ fontSize: 11, color: T.faint }}>
                          Use uppercase, numbers & symbols
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: T.muted,
                      letterSpacing: "0.09em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Confirm Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        color: passwordsMismatch
                          ? "#ef4444"
                          : passwordsMatch
                            ? "#16a34a"
                            : focusField === "confirm"
                              ? T.gold
                              : T.faint,
                        transition: "color 0.2s",
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
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirm}
                      required
                      onFocus={() => setFocusField("confirm")}
                      onBlur={() => setFocusField(null)}
                      onChange={(e) => setConfirm(e.target.value)}
                      style={inputStyle("confirm", {
                        borderColor: passwordsMismatch
                          ? "#ef4444"
                          : passwordsMatch
                            ? "#16a34a"
                            : focusField === "confirm"
                              ? T.gold
                              : T.inputBorder,
                        boxShadow: passwordsMismatch
                          ? "0 0 0 3px rgba(239,68,68,0.12)"
                          : passwordsMatch
                            ? "0 0 0 3px rgba(22,163,74,0.12)"
                            : focusField === "confirm"
                              ? "0 0 0 3px rgba(212,160,23,0.15)"
                              : "none",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
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
                      {showConfirm ? (
                        <svg
                          width="15"
                          height="15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
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

                    {/* Match icon */}
                    {(passwordsMatch || passwordsMismatch) && (
                      <span
                        style={{
                          position: "absolute",
                          right: 40,
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                        }}
                      >
                        {passwordsMatch ? (
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
                        ) : (
                          <svg
                            width="14"
                            height="14"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                  {passwordsMismatch && (
                    <p
                      style={{
                        fontSize: 11.5,
                        color: "#ef4444",
                        marginTop: 5,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Passwords do not match
                    </p>
                  )}
                  {passwordsMatch && (
                    <p
                      style={{
                        fontSize: 11.5,
                        color: "#16a34a",
                        marginTop: 5,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Passwords match
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={btnLoading || passwordsMismatch}
                  onMouseEnter={() => setHoverSubmit(true)}
                  onMouseLeave={() => setHoverSubmit(false)}
                  style={{
                    width: "100%",
                    height: 48,
                    marginTop: 4,
                    background: passwordsMismatch
                      ? dark
                        ? "#252523"
                        : "#f0ece5"
                      : hoverSubmit && !btnLoading
                        ? "#d4a017"
                        : T.btnBg,
                    color: passwordsMismatch
                      ? T.faint
                      : hoverSubmit && !btnLoading
                        ? "#1a1a1a"
                        : T.btnColor,
                    border: "none",
                    borderRadius: 12,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor:
                      btnLoading || passwordsMismatch
                        ? "not-allowed"
                        : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s",
                    letterSpacing: "0.03em",
                    opacity: btnLoading ? 0.75 : 1,
                    transform:
                      hoverSubmit && !btnLoading && !passwordsMismatch
                        ? "translateY(-1px)"
                        : "none",
                    boxShadow:
                      hoverSubmit && !btnLoading && !passwordsMismatch
                        ? "0 8px 24px rgba(212,160,23,0.28)"
                        : "none",
                  }}
                >
                  {btnLoading ? (
                    <>
                      <span
                        style={{
                          width: 17,
                          height: 17,
                          border: `2px solid currentColor`,
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      Resetting password…
                    </>
                  ) : (
                    <>
                      Reset Password
                      <svg
                        width="15"
                        height="15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        style={{
                          transition: "transform 0.2s",
                          transform: hoverSubmit ? "translateX(3px)" : "none",
                        }}
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div
                style={{
                  marginTop: 26,
                  paddingTop: 22,
                  borderTop: `1px solid ${T.divider}`,
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    style={{
                      color: T.gold,
                      fontWeight: 600,
                      textDecoration: "none",
                      borderBottom: "1px solid transparent",
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
                    Back to login
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Bottom note */}
        <p
          style={{
            fontSize: 11.5,
            color: T.faint,
            marginTop: 24,
            textAlign: "center",
          }}
        >
          Need help?{" "}
          <Link
            href="/contact"
            style={{ color: T.muted, textDecoration: "underline" }}
          >
            Contact support
          </Link>
        </p>
      </div>
    </>
  );
};

export default ResetPage;
