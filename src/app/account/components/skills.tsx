"use client";
import { useAppData } from "@/context/AppContext";
import { AccountProps } from "@/lib/type";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

const Skills: React.FC<AccountProps> = ({ user, isYourAccount }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";

  const [skill, setSkill] = useState("");
  const [focusSkill, setFocusSkill] = useState(false);
  const [hoverAdd, setHoverAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { addSkill, btnLoading, deleteSkill } = useAppData();
  useEffect(() => setMounted(true), []);

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
  };

  const addSkillHandler = () => {
    const s = skill.trim();
    if (!s) {
      toast.error("Please enter a skill");
      return;
    }
    addSkill(s, setSkill);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkillHandler();
    }
  };

  const removeSkillHandler = (s: string) => setConfirmDelete(s);
  const confirmRemove = () => {
    if (confirmDelete) {
      deleteSkill(confirmDelete);
      setConfirmDelete(null);
    }
  };

  // Skill tag colors cycling
  const tagPalette = [
    {
      bg: dark ? "rgba(212,160,23,0.1)" : "rgba(212,160,23,0.08)",
      color: dark ? "#e5c56d" : "#92610a",
      border: dark ? "rgba(212,160,23,0.22)" : "rgba(212,160,23,0.25)",
    },
    {
      bg: dark ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.07)",
      color: dark ? "#60a5fa" : "#1d4ed8",
      border: dark ? "rgba(59,130,246,0.22)" : "rgba(59,130,246,0.22)",
    },
    {
      bg: dark ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.07)",
      color: dark ? "#34d399" : "#065f46",
      border: dark ? "rgba(16,185,129,0.22)" : "rgba(16,185,129,0.22)",
    },
    {
      bg: dark ? "rgba(139,92,246,0.1)" : "rgba(139,92,246,0.07)",
      color: dark ? "#a78bfa" : "#5b21b6",
      border: dark ? "rgba(139,92,246,0.22)" : "rgba(139,92,246,0.22)",
    },
    {
      bg: dark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.07)",
      color: dark ? "#f87171" : "#991b1b",
      border: dark ? "rgba(239,68,68,0.22)" : "rgba(239,68,68,0.22)",
    },
  ];

  if (!mounted) return null;

  return (
    <>
      <style>{`input::placeholder { color: ${T.faint}; } * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes tagIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
        @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: T.cardBg,
          border: `1px solid ${T.border}`,
          borderRadius: 20,
          overflow: "hidden",
          animation: "fadeUp 0.4s ease 0.1s both",
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
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: dark ? "#141413" : "#faf8f5",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: dark
                ? "rgba(212,160,23,0.12)"
                : "rgba(212,160,23,0.1)",
              border: "1px solid rgba(212,160,23,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke={T.gold}
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="6" />
              <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
            </svg>
          </div>
          <div>
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
              {isYourAccount ? "Your Skills" : "Skills"}
            </h2>
            {isYourAccount && (
              <p
                style={{
                  fontSize: 12,
                  color: T.muted,
                  margin: "2px 0 0",
                  fontWeight: 300,
                }}
              >
                Showcase your expertise
              </p>
            )}
          </div>
          {user.skills && user.skills.length > 0 && (
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                fontWeight: 700,
                background: dark ? "#252523" : "#f0ece5",
                border: `1px solid ${T.border}`,
                color: T.muted,
                borderRadius: 100,
                padding: "3px 10px",
              }}
            >
              {user.skills.length}
            </span>
          )}
        </div>

        <div style={{ padding: "22px 28px" }}>
          {/* Add skill input */}
          {isYourAccount && (
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 22,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: focusSkill ? T.gold : T.faint,
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
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="e.g. React, Python, Node.js…"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  onKeyDown={handleKey}
                  onFocus={() => setFocusSkill(true)}
                  onBlur={() => setFocusSkill(false)}
                  style={{
                    width: "100%",
                    height: 42,
                    paddingLeft: 40,
                    paddingRight: 14,
                    background: T.inputBg,
                    border: `1.5px solid ${focusSkill ? T.gold : T.inputBorder}`,
                    borderRadius: 10,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: T.text,
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxShadow: focusSkill
                      ? "0 0 0 3px rgba(212,160,23,0.15)"
                      : "none",
                  }}
                />
              </div>
              <button
                onClick={addSkillHandler}
                disabled={!skill.trim() || btnLoading}
                onMouseEnter={() => setHoverAdd(true)}
                onMouseLeave={() => setHoverAdd(false)}
                style={{
                  height: 42,
                  padding: "0 18px",
                  background: !skill.trim()
                    ? dark
                      ? "#252523"
                      : "#f0ece5"
                    : hoverAdd
                      ? "#d4a017"
                      : T.btnBg,
                  color: !skill.trim()
                    ? T.faint
                    : hoverAdd
                      ? "#1a1a1a"
                      : T.btnColor,
                  border: "none",
                  borderRadius: 10,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor:
                    !skill.trim() || btnLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {btnLoading ? (
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
                ) : (
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
                Add Skill
              </button>
            </div>
          )}

          {/* Skills */}
          {user.skills && user.skills.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {user.skills.map((s, i) => {
                const c = tagPalette[i % tagPalette.length];
                return (
                  <div
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: isYourAccount ? "6px 8px 6px 13px" : "6px 13px",
                      background: c.bg,
                      border: `1px solid ${c.border}`,
                      borderRadius: 100,
                      animation: "tagIn 0.25s ease both",
                      animationDelay: `${i * 30}ms`,
                    }}
                  >
                    <span
                      style={{ fontSize: 13, fontWeight: 600, color: c.color }}
                    >
                      {s}
                    </span>
                    {isYourAccount && (
                      <button
                        onClick={() => removeSkillHandler(s)}
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: dark ? "rgba(239,68,68,0.18)" : "#fee2e2",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ef4444",
                          padding: 0,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#ef4444")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = dark
                            ? "rgba(239,68,68,0.18)"
                            : "#fee2e2")
                        }
                      >
                        <svg
                          width="9"
                          height="9"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 24px" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: dark ? "#252523" : "#f0ece5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke={T.faint}
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="8" r="6" />
                  <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
                </svg>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: T.muted,
                  margin: 0,
                  fontWeight: 300,
                }}
              >
                {isYourAccount
                  ? "No skills added yet — start building your profile!"
                  : "No skills listed."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm delete mini-modal */}
      {confirmDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: T.overlay,
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            animation: "fadeIn 0.15s ease both",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 360,
              background: dark ? "#1a1a18" : "#ffffff",
              border: `1px solid ${T.border}`,
              borderRadius: 18,
              padding: "28px 28px 24px",
              boxShadow: dark
                ? "0 24px 60px rgba(0,0,0,0.6)"
                : "0 24px 60px rgba(0,0,0,0.12)",
              animation: "fadeUp 0.2s ease both",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: dark
                  ? "rgba(239,68,68,0.12)"
                  : "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </div>
            <h3
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 18,
                fontWeight: 400,
                color: T.text,
                margin: "0 0 8px",
              }}
            >
              Remove skill?
            </h3>
            <p
              style={{
                fontSize: 13.5,
                color: T.muted,
                margin: "0 0 22px",
                lineHeight: 1.6,
              }}
            >
              Remove{" "}
              <strong style={{ color: T.text }}>"{confirmDelete}"</strong> from
              your profile?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  flex: 1,
                  height: 40,
                  background: "transparent",
                  border: `1.5px solid ${T.border}`,
                  borderRadius: 9,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.muted,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                style={{
                  flex: 1,
                  height: 40,
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 9,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Skills;
