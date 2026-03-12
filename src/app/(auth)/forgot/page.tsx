"use client";

import { Auth_Service, useAppData } from "@/context/AppContext";
import axios from "axios";
import { redirect } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useTheme } from "next-themes";

const ForgotPage = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";

  const [email, setEmail] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [hoverBack, setHoverBack] = useState(false);

  const { isAuth } = useAppData();
  useEffect(() => setMounted(true), []);

  if (isAuth) return redirect("/");

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
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${Auth_Service}/api/auth/forgot-password`,
        { email },
      );
      toast.success(data.message);
      setSent(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes checkPop { 0%{transform:scale(0)} 70%{transform:scale(1.15)} 100%{transform:scale(1)} }
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
        {/* Background gradient blobs */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            background: dark
              ? "radial-gradient(ellipse 50% 50% at 20% 30%, rgba(212,160,23,0.05) 0%, transparent 65%), radial-gradient(ellipse 40% 50% at 80% 70%, rgba(16,185,129,0.04) 0%, transparent 60%)"
              : "radial-gradient(ellipse 50% 50% at 20% 30%, rgba(212,160,23,0.07) 0%, transparent 65%), radial-gradient(ellipse 40% 50% at 80% 70%, rgba(16,185,129,0.05) 0%, transparent 60%)",
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

          {!sent ? (
            <>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                {/* Icon circle */}
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
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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
                  Forgot your password?
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
                  No worries — enter your email and we'll send a reset link
                  right away.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={submitHandler}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
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
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        color: focusEmail ? T.gold : T.faint,
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
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      required
                      onFocus={() => setFocusEmail(true)}
                      onBlur={() => setFocusEmail(false)}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%",
                        height: 46,
                        paddingLeft: 44,
                        paddingRight: 16,
                        background: T.inputBg,
                        border: `1.5px solid ${focusEmail ? T.gold : T.inputBorder}`,
                        borderRadius: 10,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14,
                        color: T.text,
                        outline: "none",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        boxShadow: focusEmail
                          ? "0 0 0 3px rgba(212,160,23,0.15)"
                          : "none",
                      }}
                    />
                  </div>
                  <p style={{ fontSize: 11.5, color: T.faint, marginTop: 6 }}>
                    We'll send a secure reset link to this address.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={btnLoading}
                  onMouseEnter={() => setHoverSubmit(true)}
                  onMouseLeave={() => setHoverSubmit(false)}
                  style={{
                    width: "100%",
                    height: 48,
                    background:
                      hoverSubmit && !btnLoading ? "#d4a017" : T.btnBg,
                    color: hoverSubmit && !btnLoading ? "#1a1a1a" : T.btnColor,
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
                    opacity: btnLoading ? 0.75 : 1,
                    transform:
                      hoverSubmit && !btnLoading ? "translateY(-1px)" : "none",
                    boxShadow:
                      hoverSubmit && !btnLoading
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
                      Sending reset link…
                    </>
                  ) : (
                    <>
                      Send Reset Link
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
            </>
          ) : (
            /* ── Success state ────────────────────────────────────────── */
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
                  animation: "checkPop 0.4s ease both",
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
                Email Sent
              </div>

              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.5rem, 4vw, 1.85rem)",
                  fontWeight: 400,
                  color: T.text,
                  margin: "0 0 12px",
                  letterSpacing: "-0.02em",
                }}
              >
                Check your inbox
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: T.muted,
                  lineHeight: 1.7,
                  margin: "0 0 8px",
                  fontWeight: 300,
                }}
              >
                We've sent a password reset link to
              </p>
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  background: dark ? "#252523" : "#f5f2ed",
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: T.text,
                  marginBottom: 24,
                }}
              >
                {email}
              </div>
              <p
                style={{
                  fontSize: 12.5,
                  color: T.faint,
                  lineHeight: 1.65,
                  margin: "0 0 28px",
                }}
              >
                Didn't receive it? Check your spam folder, or{" "}
                <button
                  onClick={() => setSent(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: T.gold,
                    fontWeight: 600,
                    fontSize: 12.5,
                    fontFamily: "'DM Sans', sans-serif",
                    padding: 0,
                    textDecoration: "underline",
                  }}
                >
                  try again
                </button>
                .
              </p>

              <Link href="/login" style={{ textDecoration: "none" }}>
                <button
                  onMouseEnter={() => setHoverBack(true)}
                  onMouseLeave={() => setHoverBack(false)}
                  style={{
                    width: "100%",
                    height: 46,
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
                    justifyContent: "center",
                    gap: 7,
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
                  Back to Login
                </button>
              </Link>
            </div>
          )}

          {/* Footer link */}
          {!sent && (
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

export default ForgotPage;
