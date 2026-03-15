"use client";

import { Auth_Service, useAppData } from "@/context/AppContext";
import axios from "axios";
import { redirect } from "next/navigation";
import React, { FormEvent, useState, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Link from "next/link";
import Loading from "@/components/ui/Loading";
import CareerStackLogo from "@/components/common/CareerStackLogo";

const STEPS_JOBSEEKER = ["Role", "Account", "Profile"];
const STEPS_RECRUITER = ["Role", "Account"];

const RegisterPage = () => {
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
  const [step, setStep] = useState(0);
  const [focusField, setFocusField] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const { isAuth, setUser, loading, setIsAuth } = useAppData();

  if (loading) return <Loading />;
  if (isAuth) return redirect("/");

  const steps =
    role === "jobseeker"
      ? STEPS_JOBSEEKER
      : role === "recruiter"
        ? STEPS_RECRUITER
        : [];

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

  const inputClass = (id: string) =>
    `w-full h-[46px] pl-11 pr-4 rounded-xl border bg-transparent text-foreground text-sm outline-none transition-all duration-200 ${
      focusField === id
        ? "border-[#d4a017] ring-2 ring-[#d4a017]/15"
        : "border-border"
    }`;

  const iconClass = (id: string) =>
    `absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
      focusField === id ? "text-[#d4a017]" : "text-muted-foreground/40"
    }`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4  bg-[#F7F4EF] dark:bg-[#0d0d0c]  relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(212,160,23,0.1)_0%,transparent_65%)] blur-[50px]" />
        <div className="absolute -bottom-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.06)_0%,transparent_65%)] blur-[60px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.038)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.038)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_70%_70%_at_50%_50%,black_20%,transparent_100%)]" />
      </div>

      <div className="w-full max-w-105 bg-white dark:bg-[#1a1a18] border border-[#e8e4dc] dark:border-[#2a2a28] rounded-4xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-[linear-gradient(90deg,#d4a017,#e8c350,transparent)] rounded-t-4xl" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 mb-5">
            <CareerStackLogo />
          </div>
          <h1 className="font-serif text-[clamp(1.7rem,4vw,2.2rem)] font-normal tracking-[-0.02em] leading-[1.15] mb-2">
            Create your account
          </h1>
          <p className="text-[13.5px] text-muted-foreground font-light">
            Join thousands finding their next{" "}
            <em className="font-serif text-[#d4a017]">great</em> role
          </p>
        </div>

        {/* Step indicator */}
        {steps.length > 0 && (
          <div className="flex items-center gap-0 mb-8">
            {steps.map((s, i) => {
              const isActive = i === step;
              const isDone = i < step;
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-7.5 h-7.5 rounded-full border-2 flex items-center justify-center mb-1.5 transition-all duration-300 ${
                        isDone
                          ? "bg-green-600 border-green-600"
                          : isActive
                            ? "bg-[#d4a017] border-[#d4a017]"
                            : "bg-muted border-border"
                      }`}
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
                          className={`text-[11px] font-bold ${isActive ? "text-background" : "text-muted-foreground/50"}`}
                        >
                          {i + 1}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-semibold tracking-[0.06em] uppercase transition-colors duration-300 ${
                        isActive
                          ? "text-[#d4a017]"
                          : isDone
                            ? "text-green-600"
                            : "text-muted-foreground/40"
                      }`}
                    >
                      {s}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-[0.6] rounded-sm mb-5 transition-all duration-300 ${
                        i < step
                          ? "bg-[linear-gradient(90deg,#16a34a,#d4a017)]"
                          : "bg-muted"
                      }`}
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
          {/* Step 0: Role Selection */}
          {step === 0 && (
            <div className="animate-[slideIn_0.3s_ease_both]">
              <p className="text-xs font-semibold text-muted-foreground tracking-[0.08em] uppercase mb-3.5">
                I want to
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
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
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRole(opt.value)}
                      className={`group flex flex-col items-center gap-2.5 p-5 rounded-[14px] border-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/50 ${
                        isSelected
                          ? "border-[#d4a017] bg-[#d4a017]/10 shadow-[0_0_0_3px_rgba(212,160,23,0.18)]"
                          : "border-border bg-transparent hover:bg-muted/30"
                      }`}
                    >
                      <span
                        className={`transition-colors duration-200 ${isSelected ? "text-[#d4a017]" : "text-muted-foreground"}`}
                      >
                        {opt.icon}
                      </span>
                      <div>
                        <div className="text-[13.5px] font-semibold text-foreground mb-0.5">
                          {opt.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground leading-snug">
                          {opt.sub}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-4.5 h-4.5 rounded-full bg-green-600 flex items-center justify-center">
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
                className="group w-full h-12 rounded-xl text-sm font-semibold tracking-[0.03em] flex items-center justify-center gap-2 transition-all duration-200 border border-border bg-[#efeae2] dark:bg-[#141412] text-muted-foreground hover:bg-[#e7e1d7] dark:hover:bg-[#1a1a18] hover:text-foreground disabled:cursor-not-allowed disabled:bg-[#f2eee7] dark:disabled:bg-[#111110] disabled:text-muted-foreground/50 disabled:border-border"
              >
                Continue
                <svg
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Step 1: Account Details */}
          {step === 1 && (
            <div className="flex flex-col gap-4.5 animate-[slideIn_0.3s_ease_both]">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground tracking-[0.08em] uppercase mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className={iconClass("name")}>
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
                    className={inputClass("name")}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground tracking-[0.08em] uppercase mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <span className={iconClass("phone")}>
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
                    className={inputClass("phone")}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground tracking-[0.08em] uppercase mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className={iconClass("email")}>
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
                    className={inputClass("email")}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground tracking-[0.08em] uppercase mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className={iconClass("password")}>
                    <svg
                      width="15"
                      height="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
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
                    className={`${inputClass("password")} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-[#d4a017] transition-colors duration-200 flex items-center bg-transparent border-none cursor-pointer p-0"
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

              <div className="flex gap-2.5 mt-1">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="h-12 px-5 bg-transparent border border-border hover:border-[#d4a017] text-muted-foreground hover:text-[#d4a017] rounded-xl text-[13px] font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
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
                  className="group w-full h-12 rounded-xl text-sm font-semibold tracking-[0.03em] flex items-center justify-center gap-2 transition-all duration-200 border border-border bg-[#efeae2] dark:bg-[#141412] text-muted-foreground hover:bg-[#e7e1d7] dark:hover:bg-[#1a1a18] hover:text-foreground disabled:cursor-not-allowed disabled:bg-[#f2eee7] dark:disabled:bg-[#111110] disabled:text-muted-foreground/50 disabled:border-border"
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
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
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

          {/* Step 2: Jobseeker Profile */}
          {step === 2 && role === "jobseeker" && (
            <div className="flex flex-col gap-4.5 animate-[slideIn_0.3s_ease_both]">
              {/* Resume upload */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground tracking-[0.08em] uppercase mb-1.5">
                  Resume (PDF)
                </label>
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
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer flex flex-col items-center gap-2 transition-all duration-200 ${
                    dragOver
                      ? "border-[#d4a017] bg-[#d4a017]/5"
                      : resume
                        ? "border-green-600 bg-green-600/5"
                        : "border-border bg-transparent hover:bg-muted/30"
                  }`}
                >
                  <input
                    type="file"
                    id="resume-input"
                    accept="application/pdf"
                    className="hidden"
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
                      <div className="w-9 h-9 rounded-lg bg-green-600/10 flex items-center justify-center">
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
                      <div className="text-[13px] font-semibold text-green-600">
                        {resumeName}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Click to change file
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          className="text-muted-foreground"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <div className="text-[13px] font-medium text-foreground">
                        Drop your resume here or{" "}
                        <span className="text-[#d4a017] font-semibold">
                          browse
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        PDF only · Max 10MB
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground tracking-[0.08em] uppercase mb-1.5">
                  Bio
                </label>
                <div className="relative">
                  <span
                    className={`absolute left-3.5 top-3.5 pointer-events-none transition-colors duration-200 ${focusField === "bio" ? "text-[#d4a017]" : "text-muted-foreground/40"}`}
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
                    className={`w-full pl-11 pr-4 pt-3 pb-3 rounded-xl border bg-transparent text-foreground text-sm outline-none resize-y transition-all duration-200 leading-relaxed ${
                      focusField === "bio"
                        ? "border-[#d4a017] ring-2 ring-[#d4a017]/15"
                        : "border-border"
                    }`}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground mt-1.5">
                  {bio.length}/300 characters
                </div>
              </div>

              <div className="flex gap-2.5 mt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="h-12 px-5 bg-transparent border border-border hover:border-[#d4a017] text-muted-foreground hover:text-[#d4a017] rounded-xl text-[13px] font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
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
                  className="flex-1 h-12 bg-foreground text-background hover:bg-[#d4a017] hover:text-background rounded-xl text-sm font-bold tracking-[0.03em] flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(212,160,23,0.28)] disabled:opacity-70 disabled:cursor-not-allowed border-none cursor-pointer"
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

        {/* Login link */}
        <div className="mt-7 pt-6 border-t border-border text-center">
          <p className="text-[13px] text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#d4a017] font-semibold hover:underline underline-offset-[3px] transition-all duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-[11.5px] text-muted-foreground/50 mt-6 text-center z-10">
        By registering, you agree to our{" "}
        <Link href="/terms" className="text-muted-foreground underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-muted-foreground underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;

