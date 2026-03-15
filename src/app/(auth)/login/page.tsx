"use client";

import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useTheme } from "next-themes";
import { Auth_Service, useAppData } from "@/context/AppContext";

const LoginPage = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [hoverForgot, setHoverForgot] = useState(false);
  const [hoverRegister, setHoverRegister] = useState(false);

  const { isAuth, setUser, setIsAuth } = useAppData();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (isAuth) return redirect("/");

  /* ── Theme tokens ──────────────────────────────────────────────────────── */
  const T = {
    pageBg: dark ? "#0d0d0c" : "#F7F4EF",
    cardBg: dark ? "#1a1a18" : "#ffffff",
    cardBorder: dark ? "#2a2a28" : "#e8e4dc",
    text: dark ? "#f0ede8" : "#1a1a1a",
    muted: dark ? "rgba(240,237,232,0.5)" : "rgba(26,26,26,0.5)",
    faint: dark ? "rgba(240,237,232,0.25)" : "rgba(26,26,26,0.25)",
    gold: "#d4a017",
    goldLight: "#e8c350",
    inputBg: dark ? "#141413" : "#faf8f5",
    inputBorder: dark ? "#2e2e2c" : "#e0dcd5",
    inputFocusBorder: "#d4a017",
    inputText: dark ? "#f0ede8" : "#1a1a1a",
    inputPlaceholder: dark ? "rgba(240,237,232,0.28)" : "rgba(26,26,26,0.3)",
    labelColor: dark ? "rgba(240,237,232,0.7)" : "rgba(26,26,26,0.7)",
    iconColor: dark ? "rgba(240,237,232,0.3)" : "rgba(26,26,26,0.3)",
    iconFocusColor: "#d4a017",
    divider: dark ? "#252523" : "#f0ece5",
    btnBg: dark ? "#d4a017" : "#1a1a1a",
    btnColor: dark ? "#1a1a1a" : "#f0ede8",
    linkColor: "#d4a017",
    shadowFocus: "0 0 0 3px rgba(212,160,23,0.18)",
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${Auth_Service}/api/auth/login`, {
        email,
        password,
      });
      Cookies.set("token", data.token, {
        expires: 15,
        secure: true,
        path: "/",
      });
      setUser(data.userObject);
      setIsAuth(true);
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
      setIsAuth(false);
    } finally {
      setBtnLoading(false);
    }
  };

  const inputWrap = (focused: boolean): React.CSSProperties => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
  });

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: "100%",
    height: 48,
    padding: "0 44px 0 42px",
    background: T.inputBg,
    border: `1.5px solid ${focused ? T.inputFocusBorder : T.inputBorder}`,
    borderRadius: 12,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: T.inputText,
    outline: "none",
    boxShadow: focused ? T.shadowFocus : "none",
    transition: "all 0.2s",
    boxSizing: "border-box" as const,
  });

  if (!mounted)
    return <div style={{ minHeight: "100vh", background: "#0d0d0c" }} />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(0.8)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        input::placeholder  { color: ${T.inputPlaceholder}; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px ${T.inputBg} inset !important;
          -webkit-text-fill-color: ${T.inputText} !important;
          caret-color: ${T.inputText};
        }
      `}</style>

      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          minHeight: "100vh",
          background: T.pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          position: "relative",
          overflow: "hidden",
          transition: "background 0.3s",
        }}
      >
        {/* ── Background atmosphere ─────────────────────────────────── */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "60vw",
              height: "60vw",
              borderRadius: "50%",
              background: dark
                ? "radial-gradient(circle, rgba(212,160,23,0.07) 0%, transparent 65%)"
                : "radial-gradient(circle, rgba(212,160,23,0.1) 0%, transparent 65%)",
              filter: "blur(50px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-15%",
              left: "-10%",
              width: "55vw",
              height: "55vw",
              borderRadius: "50%",
              background: dark
                ? "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 65%)"
                : "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
          />
          {/* Grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: dark
                ? `linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)`
                : `linear-gradient(rgba(0,0,0,0.038) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.038) 1px, transparent 1px)`,
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)",
            }}
          />
        </div>

        {/* ── Card ──────────────────────────────────────────────────── */}
        <div
          style={{
            width: "100%",
            maxWidth: 440,
            position: "relative",
            zIndex: 1,
            animation: "fadeUp 0.5s ease both",
          }}
        >
          {/* Brand */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 26,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  backgroundImage: dark
                    ? "linear-gradient(135deg, #f0ede8 30%, #d4a017 100%)"
                    : "linear-gradient(135deg, #1a1a1a 30%, #d4a017 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Career
              </span>
              <span
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 26,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  backgroundImage: "linear-gradient(135deg, #ef4444, #dc2626)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Stack
              </span>
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: T.gold,
                  animation: "pulse 2.5s infinite",
                  marginLeft: 3,
                  marginBottom: 14,
                  flexShrink: 0,
                }}
              />
            </Link>

            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                fontWeight: 400,
                letterSpacing: "-0.025em",
                color: T.text,
                margin: "0 0 8px",
                lineHeight: 1.15,
              }}
            >
              Welcome back
            </h1>
            <p
              style={{
                fontSize: 14,
                fontWeight: 300,
                color: T.muted,
                margin: 0,
              }}
            >
              Sign in to continue your journey
            </p>
          </div>

          {/* Form card */}
          <div
            style={{
              background: T.cardBg,
              border: `1px solid ${T.cardBorder}`,
              borderRadius: 20,
              padding: "clamp(24px, 5vw, 36px)",
              boxShadow: dark
                ? "0 24px 80px rgba(0,0,0,0.45)"
                : "0 24px 80px rgba(0,0,0,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Gold top accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight}, transparent)`,
                borderRadius: "20px 20px 0 0",
              }}
            />

            <form
              onSubmit={submitHandler}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label
                  htmlFor="email"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.labelColor,
                    letterSpacing: "0.03em",
                  }}
                >
                  Email Address
                </label>
                <div style={inputWrap(focusEmail)}>
                  <Mail
                    size={15}
                    style={{
                      position: "absolute",
                      left: 14,
                      zIndex: 1,
                      flexShrink: 0,
                      color: focusEmail ? T.iconFocusColor : T.iconColor,
                      transition: "color 0.2s",
                    }}
                  />
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    value={email}
                    required
                    autoComplete="email"
                    onFocus={() => setFocusEmail(true)}
                    onBlur={() => setFocusEmail(false)}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle(focusEmail)}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label
                  htmlFor="password"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.labelColor,
                    letterSpacing: "0.03em",
                  }}
                >
                  Password
                </label>
                <div style={inputWrap(focusPassword)}>
                  <Lock
                    size={15}
                    style={{
                      position: "absolute",
                      left: 14,
                      zIndex: 1,
                      flexShrink: 0,
                      color: focusPassword ? T.iconFocusColor : T.iconColor,
                      transition: "color 0.2s",
                    }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••••"
                    value={password}
                    required
                    autoComplete="current-password"
                    onFocus={() => setFocusPassword(true)}
                    onBlur={() => setFocusPassword(false)}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle(focusPassword)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    style={{
                      position: "absolute",
                      right: 12,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                      color: T.iconColor,
                      display: "flex",
                      alignItems: "center",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color =
                        T.gold)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color =
                        T.iconColor)
                    }
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: -8,
                }}
              >
                <Link href="/forgot" style={{ textDecoration: "none" }}>
                  <span
                    onMouseEnter={() => setHoverForgot(true)}
                    onMouseLeave={() => setHoverForgot(false)}
                    style={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: hoverForgot ? T.gold : T.muted,
                      cursor: "pointer",
                      transition: "color 0.2s",
                      textDecoration: hoverForgot ? "underline" : "none",
                      textUnderlineOffset: 3,
                    }}
                  >
                    Forgot password?
                  </span>
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={btnLoading}
                onMouseEnter={() => setHoverBtn(true)}
                onMouseLeave={() => setHoverBtn(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  height: 50,
                  background: btnLoading
                    ? dark
                      ? "rgba(212,160,23,0.5)"
                      : "rgba(26,26,26,0.4)"
                    : hoverBtn
                      ? T.gold
                      : T.btnBg,
                  color: hoverBtn && !btnLoading ? "#1a1a1a" : T.btnColor,
                  border: "none",
                  borderRadius: 12,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  cursor: btnLoading ? "not-allowed" : "pointer",
                  transition: "all 0.22s cubic-bezier(0.2,0,0,1)",
                  transform:
                    hoverBtn && !btnLoading ? "translateY(-2px)" : "none",
                  boxShadow:
                    hoverBtn && !btnLoading
                      ? "0 8px 28px rgba(212,160,23,0.35)"
                      : dark
                        ? "0 4px 16px rgba(0,0,0,0.3)"
                        : "0 4px 16px rgba(0,0,0,0.12)",
                  opacity: btnLoading ? 0.7 : 1,
                }}
              >
                {btnLoading ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      style={{ animation: "spin 0.8s linear infinite" }}
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={16}
                      style={{
                        transition: "transform 0.2s",
                        transform: hoverBtn ? "translateX(3px)" : "none",
                      }}
                    />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "24px 0 0",
                paddingTop: 24,
                borderTop: `1px solid ${T.divider}`,
              }}
            >
              <p
                style={{
                  fontSize: 13.5,
                  color: T.muted,
                  margin: 0,
                  textAlign: "center",
                  width: "100%",
                }}
              >
                Don't have an account?{" "}
                <Link href="/register" style={{ textDecoration: "none" }}>
                  <span
                    onMouseEnter={() => setHoverRegister(true)}
                    onMouseLeave={() => setHoverRegister(false)}
                    style={{
                      color: T.gold,
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: hoverRegister ? "underline" : "none",
                      textUnderlineOffset: 3,
                      transition: "opacity 0.2s",
                      opacity: hoverRegister ? 0.8 : 1,
                    }}
                  >
                    Create account
                  </span>
                </Link>
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p
            style={{
              textAlign: "center",
              fontSize: 11.5,
              color: T.faint,
              marginTop: 20,
            }}
          >
            By signing in you agree to our{" "}
            <span style={{ color: T.muted, cursor: "pointer" }}>Terms</span>
            {" & "}
            <span style={{ color: T.muted, cursor: "pointer" }}>
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
