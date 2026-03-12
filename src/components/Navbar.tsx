"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Briefcase,
  Home,
  Info,
  LogOut,
  Menu,
  User,
  X,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAppData } from "@/context/AppContext";

/* ─────────────────────────────────────────────────────────────────────────────
   ModeToggle — inline version (no shadcn dep)
───────────────────────────────────────────────────────────────────────────── */
const ModeToggle = ({ dark }: { dark: boolean }) => {
  const { setTheme } = useTheme();
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Toggle theme"
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(26,26,26,0.12)"}`,
        background: hover
          ? dark
            ? "rgba(255,255,255,0.07)"
            : "rgba(26,26,26,0.06)"
          : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
    >
      {dark ? (
        /* Sun icon */
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d4a017"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        /* Moon icon */
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#555"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   NavLink
───────────────────────────────────────────────────────────────────────────── */
const NavLink = ({
  href,
  icon,
  label,
  dark,
  onClick,
  mobile = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  dark: boolean;
  onClick?: () => void;
  mobile?: boolean;
}) => {
  const [hover, setHover] = useState(false);
  return (
    <Link href={href} onClick={onClick} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: mobile ? 12 : 7,
          padding: mobile ? "12px 14px" : "7px 13px",
          borderRadius: 10,
          background: hover
            ? dark
              ? "rgba(255,255,255,0.06)"
              : "rgba(26,26,26,0.055)"
            : "transparent",
          color: hover
            ? dark
              ? "#f0ede8"
              : "#1a1a1a"
            : dark
              ? "rgba(240,237,232,0.6)"
              : "rgba(26,26,26,0.6)",
          fontSize: mobile ? 14.5 : 13.5,
          fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer",
          transition: "all 0.18s",
          width: mobile ? "100%" : "auto",
          letterSpacing: "0.01em",
        }}
      >
        <span
          style={{
            opacity: hover ? 1 : 0.7,
            transition: "opacity 0.18s",
            display: "flex",
          }}
        >
          {icon}
        </span>
        {label}
      </div>
    </Link>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Navbar
───────────────────────────────────────────────────────────────────────────── */
const Navbar = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoverSignIn, setHoverSignIn] = useState(false);
  const [hoverLogout, setHoverLogout] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const dark = mounted && resolvedTheme === "dark";
  const { isAuth, user, loading, logOutUser } = useAppData();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close popover on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Close mobile menu on resize to desktop */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const logoutHandler = () => {
    logOutUser();
    setPopoverOpen(false);
    setMobileOpen(false);
  };

  /* ── Theme tokens ──────────────────────────────────────────────────────── */
  const T = {
    bg: dark
      ? scrolled
        ? "rgba(13,13,12,0.92)"
        : "rgba(13,13,12,0.8)"
      : scrolled
        ? "rgba(247,244,239,0.94)"
        : "rgba(247,244,239,0.82)",
    border: dark ? "rgba(255,255,255,0.07)" : "rgba(26,26,26,0.09)",
    shadow: scrolled
      ? dark
        ? "0 4px 32px rgba(0,0,0,0.5)"
        : "0 4px 32px rgba(0,0,0,0.08)"
      : "none",
    text: dark ? "#f0ede8" : "#1a1a1a",
    muted: dark ? "rgba(240,237,232,0.45)" : "rgba(26,26,26,0.45)",
    gold: "#d4a017",
    popBg: dark ? "#1a1a18" : "#ffffff",
    popBorder: dark ? "#2a2a28" : "#e8e4dc",
    mobileBg: dark ? "rgba(17,17,16,0.97)" : "rgba(247,244,239,0.98)",
    avatarRing: dark ? "rgba(212,160,23,0.35)" : "rgba(212,160,23,0.4)",
    divider: dark ? "#252523" : "#f0ece5",
  };

  const avatarInitial = user?.name?.charAt(0)?.toUpperCase() || "A";

  if (!mounted) return <div style={{ height: 64 }} />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(0.8)} }
      `}</style>

      <nav
        style={{
          fontFamily: "'DM Sans', sans-serif",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: T.bg,
          borderBottom: `1px solid ${T.border}`,
          boxShadow: T.shadow,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          transition: "background 0.3s, box-shadow 0.3s",
        }}
      >
        {/* ── Main bar ────────────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <span
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 22,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  backgroundImage: dark
                    ? "linear-gradient(135deg, #f0ede8 30%, #d4a017 100%)"
                    : "linear-gradient(135deg, #1a1a1a 30%, #d4a017 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                }}
              >
                Hire
              </span>
              <span
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 22,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  backgroundImage: "linear-gradient(135deg, #ef4444, #dc2626)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                }}
              >
                Heaven
              </span>
              {/* Live dot */}
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: T.gold,
                  animation: "pulse 2.5s infinite",
                  marginLeft: 3,
                  marginBottom: 10,
                  flexShrink: 0,
                }}
              />
            </div>
          </Link>

          {/* Desktop nav links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flex: 1,
              justifyContent: "center",
            }}
            className="desktop-nav"
          >
            <NavLink
              href="/"
              icon={<Home size={15} />}
              label="Home"
              dark={dark}
            />
            <NavLink
              href="/jobs"
              icon={<Briefcase size={15} />}
              label="Jobs"
              dark={dark}
            />
            <NavLink
              href="/about"
              icon={<Info size={15} />}
              label="About"
              dark={dark}
            />
          </div>

          {/* Desktop right actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
            className="desktop-actions"
          >
            {!loading && (
              <>
                {isAuth ? (
                  /* Avatar + Popover */
                  <div ref={popoverRef} style={{ position: "relative" }}>
                    <button
                      onClick={() => setPopoverOpen((p) => !p)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "transparent",
                        border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(26,26,26,0.1)"}`,
                        borderRadius: 100,
                        padding: "4px 10px 4px 4px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.borderColor = T.gold;
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = dark
                          ? "rgba(212,160,23,0.06)"
                          : "rgba(212,160,23,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.borderColor = dark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(26,26,26,0.1)";
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "transparent";
                      }}
                    >
                      {/* Avatar circle */}
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: user?.profile_pic
                            ? "transparent"
                            : `linear-gradient(135deg, #d4a017, #e8c350)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#1a1a1a",
                          overflow: "hidden",
                          flexShrink: 0,
                          boxShadow: `0 0 0 2px ${T.avatarRing}`,
                        }}
                      >
                        {user?.profile_pic ? (
                          <img
                            src={user.profile_pic as string}
                            alt={user.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          avatarInitial
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: T.text,
                          maxWidth: 90,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user?.name?.split(" ")[0] || "Account"}
                      </span>
                      <ChevronDown
                        size={13}
                        color={T.muted}
                        style={{
                          transition: "transform 0.2s",
                          transform: popoverOpen ? "rotate(180deg)" : "none",
                        }}
                      />
                    </button>

                    {/* Dropdown */}
                    {popoverOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 10px)",
                          right: 0,
                          minWidth: 220,
                          background: T.popBg,
                          border: `1px solid ${T.popBorder}`,
                          borderRadius: 14,
                          boxShadow: dark
                            ? "0 20px 60px rgba(0,0,0,0.6)"
                            : "0 20px 60px rgba(0,0,0,0.12)",
                          overflow: "hidden",
                          animation: "slideDown 0.2s ease",
                          zIndex: 200,
                        }}
                      >
                        {/* User info */}
                        <div
                          style={{
                            padding: "14px 16px 12px",
                            borderBottom: `1px solid ${T.divider}`,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              background: user?.profile_pic
                                ? "transparent"
                                : "linear-gradient(135deg, #d4a017, #e8c350)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 15,
                              fontWeight: 700,
                              color: "#1a1a1a",
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            {user?.profile_pic ? (
                              <img
                                src={user.profile_pic as string}
                                alt=""
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              avatarInitial
                            )}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 13.5,
                                fontWeight: 600,
                                color: T.text,
                                lineHeight: 1.3,
                              }}
                            >
                              {user?.name || "User"}
                            </div>
                            <div
                              style={{
                                fontSize: 11.5,
                                color: dark ? "#555" : "#aaa",
                                marginTop: 2,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {user?.email || ""}
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <div style={{ padding: "6px 6px" }}>
                          <PopMenuItem
                            href="/account"
                            icon={<User size={14} />}
                            label="My Profile"
                            dark={dark}
                            onClick={() => setPopoverOpen(false)}
                          />
                          <PopMenuItem
                            href="/jobs"
                            icon={<Briefcase size={14} />}
                            label="Browse Jobs"
                            dark={dark}
                            onClick={() => setPopoverOpen(false)}
                          />
                        </div>

                        {/* Logout */}
                        <div
                          style={{
                            padding: "6px 6px 8px",
                            borderTop: `1px solid ${T.divider}`,
                          }}
                        >
                          <button
                            onClick={logoutHandler}
                            onMouseEnter={() => setHoverLogout(true)}
                            onMouseLeave={() => setHoverLogout(false)}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: 9,
                              padding: "9px 12px",
                              borderRadius: 8,
                              background: hoverLogout
                                ? dark
                                  ? "rgba(239,68,68,0.12)"
                                  : "rgba(239,68,68,0.07)"
                                : "transparent",
                              border: "none",
                              cursor: "pointer",
                              color: hoverLogout
                                ? "#ef4444"
                                : dark
                                  ? "rgba(240,237,232,0.55)"
                                  : "rgba(26,26,26,0.55)",
                              fontSize: 13.5,
                              fontWeight: 500,
                              fontFamily: "'DM Sans', sans-serif",
                              transition: "all 0.18s",
                              textAlign: "left",
                            }}
                          >
                            <LogOut size={14} />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Sign In button */
                  <Link href="/login" style={{ textDecoration: "none" }}>
                    <button
                      onMouseEnter={() => setHoverSignIn(true)}
                      onMouseLeave={() => setHoverSignIn(false)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        height: 38,
                        padding: "0 18px",
                        background: hoverSignIn
                          ? T.gold
                          : dark
                            ? "#d4a017"
                            : "#1a1a1a",
                        color: hoverSignIn
                          ? "#1a1a1a"
                          : dark
                            ? "#1a1a1a"
                            : "#f0ede8",
                        border: "none",
                        borderRadius: 10,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        transform: hoverSignIn ? "translateY(-1px)" : "none",
                        boxShadow: hoverSignIn
                          ? "0 6px 20px rgba(212,160,23,0.35)"
                          : dark
                            ? "0 2px 12px rgba(0,0,0,0.3)"
                            : "0 2px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      <User size={14} />
                      Sign In
                    </button>
                  </Link>
                )}
              </>
            )}
            <ModeToggle dark={dark} />
          </div>

          {/* Mobile: toggle + theme */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 8 }}
            className="mobile-actions"
          >
            <ModeToggle dark={dark} />
            <button
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(26,26,26,0.12)"}`,
                background: mobileOpen
                  ? dark
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(26,26,26,0.06)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                color: T.text,
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ─────────────────────────────────────────────── */}
        <div
          style={{
            overflow: "hidden",
            maxHeight: mobileOpen ? 600 : 0,
            opacity: mobileOpen ? 1 : 0,
            transition:
              "max-height 0.35s cubic-bezier(0.2,0,0,1), opacity 0.25s ease",
            background: T.mobileBg,
            backdropFilter: "blur(20px)",
            borderTop: mobileOpen ? `1px solid ${T.border}` : "none",
          }}
        >
          <div
            style={{
              padding: "10px 14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* User info strip (if auth) */}
            {isAuth && user && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px 14px",
                  marginBottom: 6,
                  borderBottom: `1px solid ${T.divider}`,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: user?.profile_pic
                      ? "transparent"
                      : "linear-gradient(135deg, #d4a017, #e8c350)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    overflow: "hidden",
                    flexShrink: 0,
                    boxShadow: `0 0 0 2px ${T.avatarRing}`,
                  }}
                >
                  {user?.profile_pic ? (
                    <img
                      src={user.profile_pic as string}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    avatarInitial
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>
                    {user?.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: dark ? "#555" : "#aaa",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.email}
                  </div>
                </div>
              </div>
            )}

            <NavLink
              href="/"
              icon={<Home size={17} />}
              label="Home"
              dark={dark}
              onClick={() => setMobileOpen(false)}
              mobile
            />
            <NavLink
              href="/jobs"
              icon={<Briefcase size={17} />}
              label="Jobs"
              dark={dark}
              onClick={() => setMobileOpen(false)}
              mobile
            />
            <NavLink
              href="/about"
              icon={<Info size={17} />}
              label="About"
              dark={dark}
              onClick={() => setMobileOpen(false)}
              mobile
            />

            {isAuth ? (
              <>
                <NavLink
                  href="/account"
                  icon={<User size={17} />}
                  label="My Profile"
                  dark={dark}
                  onClick={() => setMobileOpen(false)}
                  mobile
                />
                <div style={{ marginTop: 4 }}>
                  <button
                    onClick={logoutHandler}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 10,
                      background: dark
                        ? "rgba(239,68,68,0.1)"
                        : "rgba(239,68,68,0.07)",
                      border: `1px solid ${dark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.15)"}`,
                      color: "#ef4444",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14.5,
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div style={{ marginTop: 4 }}>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  style={{ textDecoration: "none" }}
                >
                  <button
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 10,
                      background: dark ? "#d4a017" : "#1a1a1a",
                      color: dark ? "#1a1a1a" : "#f0ede8",
                      border: "none",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      textAlign: "left",
                      letterSpacing: "0.02em",
                    }}
                  >
                    <User size={17} />
                    Sign In
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Responsive: hide/show desktop vs mobile sections */}
      <style>{`
        .desktop-nav     { display: flex !important; }
        .desktop-actions { display: flex !important; }
        .mobile-actions  { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav     { display: none !important; }
          .desktop-actions { display: none !important; }
          .mobile-actions  { display: flex !important; }
        }
      `}</style>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Popover menu item
───────────────────────────────────────────────────────────────────────────── */
const PopMenuItem = ({
  href,
  icon,
  label,
  dark,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  dark: boolean;
  onClick?: () => void;
}) => {
  const [hover, setHover] = useState(false);
  return (
    <Link href={href} onClick={onClick} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "9px 12px",
          borderRadius: 8,
          background: hover
            ? dark
              ? "rgba(255,255,255,0.06)"
              : "rgba(26,26,26,0.05)"
            : "transparent",
          color: hover
            ? dark
              ? "#f0ede8"
              : "#1a1a1a"
            : dark
              ? "rgba(240,237,232,0.6)"
              : "rgba(26,26,26,0.6)",
          fontSize: 13.5,
          fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        {icon}
        {label}
      </div>
    </Link>
  );
};

export default Navbar;
