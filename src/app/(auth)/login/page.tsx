"use client";

import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Auth_Service, useAppData } from "@/context/AppContext";
import CareerStackLogo from "@/components/common/CareerStackLogo";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);

  const { isAuth, setUser, setIsAuth } = useAppData();

  if (isAuth) return redirect("/");

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

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-[#F7F4EF] dark:bg-[#0d0d0c] font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(212,160,23,0.1)_0%,transparent_65%)] blur-[50px]" />
        <div className="absolute -bottom-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.06)_0%,transparent_65%)] blur-[60px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.038)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.038)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_70%_70%_at_50%_50%,black_20%,transparent_100%)]" />
      </div>

      {/* ── Card ── */}
      <div className="w-full max-w-110 relative z-10 animate-fade-up">
        <div className="flex flex-col items-center text-center mb-9">
          <span className="mb-5">
            <CareerStackLogo />
          </span>
          <h1 className="font-serif text-[clamp(1.75rem,4vw,2.25rem)] font-normal tracking-[-0.025em] mb-2 leading-[1.15]">
            Welcome back
          </h1>
          <p className="text-sm font-light text-[#888] dark:text-[#cfcfcf]">
            Sign in to continue your journey
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white dark:bg-[#1a1a18] border border-[#e8e4dc] dark:border-[#2a2a28] rounded-4xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.75 bg-[linear-gradient(90deg,#d4a017,#e8c350,transparent)] rounded-t-4xl" />

          <form onSubmit={submitHandler} className="flex flex-col gap-5">
            {/* Email */}
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
                  className="w-full h-12 pl-10 pr-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-[#d4a017]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-xs font-semibold tracking-[0.03em] text-gray-500"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <Lock
                  size={15}
                  className={`absolute left-3.5 z-10 shrink-0 transition-colors duration-200 ${
                    focusPassword ? "text-[#d4a017]" : "text-gray-400"
                  }`}
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
                  className="w-full h-12 pl-10 pr-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-[#d4a017]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 p-1 text-gray-400 hover:text-[#d4a017] transition-colors duration-200 flex items-center bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end -mt-2">
              <Link href="/forgot">
                <span className="text-[12.5px] font-medium text-[#9ca3af] hover:text-[#d4a017] hover:underline underline-offset-[3px] transition-colors duration-200 cursor-pointer">
                  Forgot password?
                </span>
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={btnLoading}
              className="group flex items-center justify-center gap-2 w-full h-12.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 bg-black text-white dark:bg-[#d4a017] dark:text-black hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(212,160,23,0.35)] disabled:opacity-70 disabled:cursor-not-allowed"
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
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Divider + register link */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-[#f0ece5] dark:border-[#2a2a28]">
            <p className="text-sm text-center w-full text-[#888] dark:text-[#cfcfcf]">
              Don't have an account?{" "}
              <Link href="/register">
                <span className="text-[#d4a017] font-semibold cursor-pointer hover:opacity-80 hover:underline underline-offset-[3px] transition-opacity duration-200">
                  Create account
                </span>
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11.5px] mt-5 text-[#bbb] dark:text-[#eee]">
          By signing in you agree to our{" "}
          <span className="text-[#888] dark:text-[#cfcfcf] cursor-pointer">
            Terms
          </span>
          {" & "}
          <span className="text-[#888] dark:text-[#cfcfcf] cursor-pointer">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
