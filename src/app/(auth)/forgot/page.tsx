"use client";

import { Auth_Service, useAppData } from "@/context/AppContext";
import axios from "axios";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

const ForgotPage = () => {
  const [email, setEmail] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);

  const { isAuth } = useAppData();

  if (isAuth) return redirect("/");

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

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-[#F7F4EF] dark:bg-[#0d0d0c] font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(212,160,23,0.1)_0%,transparent_65%)] blur-[50px]" />
        <div className="absolute -bottom-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.06)_0%,transparent_65%)] blur-[60px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.038)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.038)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_20%,transparent_100%)]" />
      </div>

      <div className="w-full max-w-105 relative z-10 animate-fade-up">
        {!sent ? (
          <>
            <div className="flex flex-col items-center text-center mb-9">
              <div className="w-14 h-14 rounded-full bg-[rgba(212,160,23,0.08)] dark:bg-[rgba(212,160,23,0.1)] border border-[rgba(212,160,23,0.25)] flex items-center justify-center mb-5">
                <Mail size={22} className="text-[#d4a017]" />
              </div>

              <span className="inline-flex items-center gap-1.5 bg-[rgba(212,160,23,0.08)] dark:bg-[rgba(212,160,23,0.1)] border border-[rgba(212,160,23,0.22)] rounded-full px-3 py-1 text-[10.5px] font-bold text-[#d4a017] tracking-[0.1em] uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a017] animate-pulse" />
                Password Reset
              </span>

              <h1 className="font-serif text-[clamp(1.75rem,4vw,2.25rem)] font-normal tracking-[-0.025em] mb-2 leading-[1.15]">
                Forgot your password?
              </h1>
              <p className="text-sm font-light text-[#888] dark:text-[#cfcfcf]">
                Enter your email and we'll send a reset link right away.
              </p>
            </div>
            <div className="bg-white dark:bg-[#1a1a18] border border-[#e8e4dc] dark:border-[#2a2a28] rounded-4xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.75 bg-[linear-gradient(90deg,#d4a017,#e8c350,transparent)] rounded-t-4xl" />

              <form onSubmit={submitHandler} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold tracking-[0.03em] text-gray-500"
                  >
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail
                      size={15}
                      className={`absolute left-3.5 z-10 shrink-0 transition-colors duration-200 ${
                        focusEmail ? "text-[#d4a017]" : "text-gray-400"
                      }`}
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
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-sm outline-none focus:ring-2 focus:ring-[#d4a017]"
                    />
                  </div>
                  <p className="text-[11.5px] text-gray-400 dark:text-gray-600">
                    We'll send a secure reset link to this address.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={btnLoading}
                  className="group flex items-center justify-center gap-2 w-full h-12 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 bg-black text-white dark:bg-[#d4a017] dark:text-black hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(212,160,23,0.35)] disabled:opacity-70 disabled:cursor-not-allowed"
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
                      Sending reset link…
                    </>
                  ) : (
                    <>
                      Send Reset Link
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

            {/* Footer */}
            <p className="text-center text-[11.5px] mt-5 text-[#bbb] dark:text-[#eee]">
              Need help?{" "}
              <Link href="/contact">
                <span className="text-[#888] dark:text-[#cfcfcf] cursor-pointer underline">
                  Contact support
                </span>
              </Link>
            </p>
          </>
        ) : (
          /* ── Success state ── */
          <>
            <div className="flex flex-col items-center text-center mb-9">
              {/* Check icon circle */}
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

              {/* Badge */}
              <span className="inline-flex items-center gap-1.5 bg-[rgba(22,163,74,0.07)] dark:bg-[rgba(22,163,74,0.1)] border border-[rgba(22,163,74,0.22)] rounded-full px-3 py-1 text-[10.5px] font-bold text-green-600 tracking-[0.1em] uppercase mb-3">
                Email Sent
              </span>

              <h1 className="font-serif text-[clamp(1.75rem,4vw,2.25rem)] font-normal tracking-[-0.025em] mb-2 leading-[1.15]">
                Check your inbox
              </h1>
              <p className="text-sm font-light text-[#888] dark:text-[#cfcfcf]">
                We've sent a password reset link to
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1a18] border border-[#e8e4dc] dark:border-[#2a2a28] rounded-4xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.75 bg-[linear-gradient(90deg,#16a34a,#4ade80,transparent)] rounded-t-4xl" />

              <div className="flex flex-col items-center gap-5">
                {/* Email badge */}
                <div className="inline-block px-4 py-2 bg-[#f5f2ed] dark:bg-[#252523] border border-[#e8e4dc] dark:border-[#2a2a28] rounded-xl text-sm font-semibold">
                  {email}
                </div>

                <p className="text-xs text-gray-400 dark:text-gray-600 text-center leading-relaxed">
                  Didn't receive it? Check your spam folder, or{" "}
                  <button
                    onClick={() => setSent(false)}
                    className="text-[#d4a017] font-semibold underline underline-offset-2 bg-transparent border-none cursor-pointer text-xs font-sans"
                  >
                    try again
                  </button>
                  .
                </p>

                <Link href="/login" className="w-full no-underline">
                  <button className="group flex items-center justify-center gap-2 w-full h-12 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 bg-black text-white dark:bg-[#d4a017] dark:text-black hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(212,160,23,0.35)]">
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      className="transition-transform group-hover:-translate-x-1"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Login
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-[#f0ece5] dark:border-[#2a2a28]">
                <p className="text-sm text-center w-full text-[#888] dark:text-[#cfcfcf]">
                  Remember your password?{" "}
                  <Link href="/login">
                    <span className="text-[#d4a017] font-semibold cursor-pointer hover:opacity-80 hover:underline underline-offset-[3px] transition-opacity duration-200">
                      Sign in
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPage;
