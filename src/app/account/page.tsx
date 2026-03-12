"use client";
import { useAppData } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import Info from "./components/info";
import Skills from "./components/skills";
import Company from "./components/company";
import { useRouter } from "next/navigation";
import MyApplications from "./components/applications";
import { useTheme } from "next-themes";

const AccountPage = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";

  const { isAuth, loading, user } = useAppData();
  const router = useRouter();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!loading && !isAuth) router.push("/login");
  }, [isAuth, loading, router]);

  if (loading) return <Loading />;

  const T = {
    bg: dark ? "#111110" : "#F7F4EF",
    text: dark ? "#f0ede8" : "#1a1a1a",
    gold: "#d4a017",
    muted: dark ? "#888" : "#666",
    border: dark ? "#2a2a28" : "#e8e4dc",
    headerBg: dark ? "#0d0d0c" : "#1a1a1a",
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.35} }
        * { box-sizing: border-box; }
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
        {/* Page header */}
        <header
          style={{
            background: T.headerBg,
            padding: "36px 24px 32px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 50% 80% at 80% 50%, rgba(212,160,23,0.1) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(212,160,23,0.12)",
                border: "1px solid rgba(212,160,23,0.25)",
                borderRadius: 100,
                padding: "4px 12px",
                fontSize: 10.5,
                fontWeight: 700,
                color: T.gold,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 12,
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
              {user?.role === "recruiter"
                ? "Recruiter Dashboard"
                : "My Account"}
            </div>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                fontWeight: 400,
                color: "#f0ede8",
                margin: "0 0 6px",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {user ? `Welcome back, ${user.name.split(" ")[0]}` : "My Account"}
            </h1>
            <p
              style={{
                fontSize: 14,
                fontWeight: 300,
                color: "rgba(240,237,232,0.5)",
                margin: 0,
              }}
            >
              {user?.role === "recruiter"
                ? "Manage your company and job listings"
                : "Manage your profile, skills, and applications"}
            </p>
          </div>
        </header>

        {/* Content */}
        {user && (
          <div
            style={{
              maxWidth: 860,
              margin: "0 auto",
              padding: "32px 24px 72px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <Info user={user} isYourAccount={true} />
            {user.role === "jobseeker" && (
              <>
                <Skills user={user} isYourAccount={true} />
                <MyApplications />
              </>
            )}
            {user.role === "recruiter" && <Company />}
          </div>
        )}
      </div>
    </>
  );
};

export default AccountPage;
