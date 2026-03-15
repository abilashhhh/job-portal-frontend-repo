"use client";

import { Auth_Service, useAppData } from "@/context/AppContext";
import axios from "axios";
import { redirect, useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowRight, Lock, Eye, EyeOff } from "lucide-react";

const ResetPage = () => {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);

  const { isAuth } = useAppData();

  if (isAuth) return redirect("/");

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

  const confirmBorderClass = passwordsMismatch
    ? "border-red-400 dark:border-red-500 focus:ring-red-400"
    : passwordsMatch
      ? "border-green-500 dark:border-green-600 focus:ring-green-500"
      : "border-gray-300 dark:border-gray-700 focus:ring-[#d4a017]";

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-[#F7F4EF] dark:bg-[#0d0d0c] font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(212,160,23,0.1)_0%,transparent_65%)] blur-[50px]" />
        <div className="absolute -bottom-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.05)_0%,transparent_65%)] blur-[60px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.038)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.038)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_20%,transparent_100%)]" />
      </div>

      <div className="w-full max-w-105 relative z-10 animate-fade-up">
        {done ? (
          <>
            <div className="flex flex-col items-center text-center mb-9">
              <div className="w-14 h-14 rounded-full bg-[rgba(22,163,74,0.08)] dark:bg-[rgba(22,163,74,0.12)] border border-[rgba(22,163,74,0.3)] flex items-center justify-center mb-5">
                <svg
                  width="26"
                  height="26"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <span className="inline-flex items-center gap-1.5 bg-[rgba(22,163,74,0.07)] dark:bg-[rgba(22,163,74,0.1)] border border-[rgba(22,163,74,0.22)] rounded-full px-3 py-1 text-[10.5px] font-bold text-green-600 tracking-[0.1em] uppercase mb-3">
                Password Updated
              </span>

              <h1 className="font-serif text-[clamp(1.75rem,4vw,2.25rem)] font-normal tracking-[-0.025em] mb-2 leading-[1.15]">
                All set!
              </h1>
              <p className="text-sm font-light text-[#888] dark:text-[#cfcfcf]">
                Your password has been reset. You can now sign in with your new
                password.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1a18] border border-[#e8e4dc] dark:border-[#2a2a28] rounded-4xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.75 bg-[linear-gradient(90deg,#16a34a,#4ade80,transparent)] rounded-t-4xl" />

              <button
                onClick={() => router.push("/login")}
                className="group flex items-center justify-center gap-2 w-full h-12 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 bg-black text-white dark:bg-[#d4a017] dark:text-black hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(212,160,23,0.35)]"
              >
                Go to Login
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-[#f0ece5] dark:border-[#2a2a28]">
                <p className="text-sm text-center w-full text-[#888] dark:text-[#cfcfcf]">
                  Need help?{" "}
                  <Link href="/contact">
                    <span className="text-[#d4a017] font-semibold cursor-pointer hover:opacity-80 hover:underline underline-offset-[3px] transition-opacity duration-200">
                      Contact support
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center text-center mb-9">
              <div className="w-14 h-14 rounded-full bg-[rgba(212,160,23,0.08)] dark:bg-[rgba(212,160,23,0.1)] border border-[rgba(212,160,23,0.25)] flex items-center justify-center mb-5">
                <Lock size={22} className="text-[#d4a017]" />
              </div>

              <span className="inline-flex items-center gap-1.5 bg-[rgba(212,160,23,0.08)] dark:bg-[rgba(212,160,23,0.1)] border border-[rgba(212,160,23,0.22)] rounded-full px-3 py-1 text-[10.5px] font-bold text-[#d4a017] tracking-[0.1em] uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a017] animate-pulse" />
                Password Reset
              </span>

              <h1 className="font-serif text-[clamp(1.75rem,4vw,2.25rem)] font-normal tracking-[-0.025em] mb-2 leading-[1.15]">
                Set a new password
              </h1>
              <p className="text-sm font-light text-[#888] dark:text-[#cfcfcf]">
                Choose a strong password to secure your account.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1a18] border border-[#e8e4dc] dark:border-[#2a2a28] rounded-4xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.75 bg-[linear-gradient(90deg,#d4a017,#e8c350,transparent)] rounded-t-4xl" />

              <form onSubmit={submitHandler} className="flex flex-col gap-5">
                {/* New Password */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold tracking-[0.03em] text-gray-500"
                  >
                    New Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock
                      size={15}
                      className={`absolute left-3.5 z-10 shrink-0 transition-colors duration-200 ${
                        focusField === "password"
                          ? "text-[#d4a017]"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Min 8 characters"
                      value={password}
                      required
                      onFocus={() => setFocusField("password")}
                      onBlur={() => setFocusField(null)}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 pl-10 pr-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-sm outline-none focus:ring-2 focus:ring-[#d4a017]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 p-1 text-gray-400 hover:text-[#d4a017] transition-colors duration-200 flex items-center bg-transparent border-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {/* Strength meter */}
                  {password.length > 0 && (
                    <div className="mt-1">
                      <div className="flex gap-1.5 mb-1.5">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="flex-1 h-1 rounded-full transition-all duration-300"
                            style={{
                              background:
                                i <= strength
                                  ? strengthColor
                                  : "var(--strength-track, #f0ece5)",
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className="text-[11px] font-semibold"
                          style={{ color: strengthColor }}
                        >
                          {strengthLabel}
                        </span>
                        <span className="text-[11px] text-gray-400 dark:text-gray-600">
                          Use uppercase, numbers &amp; symbols
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="confirm"
                    className="text-xs font-semibold tracking-[0.03em] text-gray-500"
                  >
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock
                      size={15}
                      className={`absolute left-3.5 z-10 shrink-0 transition-colors duration-200 ${
                        passwordsMismatch
                          ? "text-red-400"
                          : passwordsMatch
                            ? "text-green-500"
                            : focusField === "confirm"
                              ? "text-[#d4a017]"
                              : "text-gray-400"
                      }`}
                    />
                    <input
                      type={showConfirm ? "text" : "password"}
                      id="confirm"
                      placeholder="Re-enter your password"
                      value={confirm}
                      required
                      onFocus={() => setFocusField("confirm")}
                      onBlur={() => setFocusField(null)}
                      onChange={(e) => setConfirm(e.target.value)}
                      className={`w-full h-12 pl-10 pr-16 rounded-xl border bg-transparent text-sm outline-none focus:ring-2 ${confirmBorderClass}`}
                    />

                    {(passwordsMatch || passwordsMismatch) && (
                      <span className="absolute right-10 pointer-events-none flex items-center">
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
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 p-1 text-gray-400 hover:text-[#d4a017] transition-colors duration-200 flex items-center bg-transparent border-none cursor-pointer"
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {passwordsMismatch && (
                    <p className="flex items-center gap-1 text-[11.5px] text-red-500 mt-0.5">
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
                    <p className="flex items-center gap-1 text-[11.5px] text-green-600 mt-0.5">
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

                <button
                  type="submit"
                  disabled={btnLoading || passwordsMismatch}
                  className="group flex items-center justify-center gap-2 w-full h-12 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 bg-black text-white dark:bg-[#d4a017] dark:text-black hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(212,160,23,0.35)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
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
                        className="animate-spin"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Resetting password…
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-[#f0ece5] dark:border-[#2a2a28]">
                <p className="text-sm text-center w-full text-[#888] dark:text-[#cfcfcf]">
                  Remember your password?{" "}
                  <Link href="/login">
                    <span className="text-[#d4a017] font-semibold cursor-pointer hover:opacity-80 hover:underline underline-offset-[3px] transition-opacity duration-200">
                      Back to login
                    </span>
                  </Link>
                </p>
              </div>
            </div>

            <p className="text-center text-[11.5px] mt-5 text-[#bbb] dark:text-[#eee]">
              Need help?{" "}
              <Link href="/contact">
                <span className="text-[#888] dark:text-[#cfcfcf] cursor-pointer underline">
                  Contact support
                </span>
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPage;
