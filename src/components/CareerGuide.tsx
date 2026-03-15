"use client";
import React, { useState, useEffect, useRef } from "react";
import { CareerGuideResponse, FeatureCard } from "@/lib/type";
import axios from "axios";
import { Utils_Service } from "@/context/AppContext";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Pencil,
  Plus,
  RotateCcw,
  Star,
  Briefcase,
  TrendingUp,
  BookOpen,
  X,
  ChevronDown,
} from "lucide-react";

const CareerGuide = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CareerGuideResponse | null>(null);
  const [currentSkill, setCurrentSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [focusSkill, setFocusSkill] = useState(false);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [expandedCat, setExpandedCat] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        resetDialog();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [modalOpen]);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const addSkill = () => {
    const s = currentSkill.trim();
    if (s && !skills.includes(s)) {
      setSkills((prev) => [...prev, s]);
      setCurrentSkill("");
      inputRef.current?.focus();
    }
  };

  const removeSkill = (s: string) =>
    setSkills((prev) => prev.filter((x) => x !== s));

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const getCareerGuidance = async () => {
    if (skills.length === 0) {
      toast.error("Add at least one skill");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${Utils_Service}/api/utils/careerGuidance`,
        { skills },
      );
      setResponse(data);
      toast.success("Career guidance generated!");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to generate guidance",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setSkills([]);
    setCurrentSkill("");
    setResponse(null);
    setModalOpen(false);
    setExpandedJob(null);
    setExpandedCat(null);
  };

  const features: FeatureCard[] = [
    {
      title: "Skill Analysis",
      desc: "Analyze your current skills and identify gaps needed for your dream role.",
      accent: "#3b82f6",
      icon: (
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
        </svg>
      ),
    },
    {
      title: "Career Matching",
      desc: "Discover the best career opportunities perfectly tailored to your profile.",
      accent: "#8b5cf6",
      icon: (
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      ),
    },
    {
      title: "Learning Roadmap",
      desc: "Get step-by-step learning paths to level up your skillset efficiently.",
      accent: "#10b981",
      icon: (
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    {
      title: "AI Suggestions",
      desc: "Receive intelligent job and skill recommendations powered by AI.",
      accent: "#f59e0b",
      icon: (
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <section className="bg-[#F7F4EF] dark:bg-[#111110] text-[#1a1a1a] dark:text-[#f0ede8] py-24 px-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[5%] left-[8%] w-100 h-100 rounded-full bg-[rgba(212,160,23,0.07)] dark:bg-[rgba(212,160,23,0.05)] blur-[80px]" />
          <div className="absolute bottom-[5%] right-[8%] w-87.5 h-87.5 rounded-full bg-[rgba(139,92,246,0.07)] dark:bg-[rgba(139,92,246,0.05)] blur-[80px]" />
        </div>

        <div className="max-w-300 mx-auto relative">
          <div className="text-center mb-18 animate-fade-up">
            <span className="inline-flex items-center gap-1.5 bg-[rgba(212,160,23,0.09)] dark:bg-[rgba(212,160,23,0.1)] border border-[rgba(212,160,23,0.25)] rounded-full px-4 py-1.5 text-[11px] font-bold text-[#d4a017] tracking-[0.12em] uppercase mb-5">
              <span className="w-1.25 h-1.25 rounded-full bg-[#d4a017] animate-pulse" />
              AI-Powered Career Guidance
            </span>
            <h2 className="font-serif text-[clamp(2rem,5vw,3.4rem)] font-normal tracking-[-0.025em] leading-[1.1] mb-4">
              Discover your{" "}
              <em className="font-serif italic text-[#d4a017]">career path</em>
            </h2>
            <p className="text-base font-light text-[#666] dark:text-[#888] max-w-[520px] mx-auto leading-[1.7]">
              Get personalized job recommendations and learning roadmaps based
              on your skills, interests, and industry demand.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 mb-[60px]">
            {features.map((f, i) => (
              <FeatureCardComponent key={f.title} f={f} delay={i * 80} />
            ))}
          </div>

          <div className="flex justify-center animate-fade-up">
            <button
              onClick={() => setModalOpen(true)}
              className="group inline-flex items-center gap-2.5 h-[54px] px-8 bg-black dark:bg-[#d4a017] text-white dark:text-black rounded-[14px] text-[15px] font-bold tracking-wide transition-all duration-200 hover:-translate-y-[3px] hover:bg-[#d4a017] hover:text-black hover:shadow-[0_16px_40px_rgba(212,160,23,0.35)]"
            >
              <Star size={18} />
              Get Career Guidance
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/45 dark:bg-black/75 backdrop-blur-[6px] flex items-center justify-center p-4 animate-fade-in">
          <div
            ref={modalRef}
            className="w-full max-w-[720px] max-h-[90vh] bg-white dark:bg-[#1a1a18] border border-[#e8e4dc] dark:border-[#2a2a28] rounded-3xl flex flex-col overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.18)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.7)] relative animate-slide-up"
          >
            <div className="absolute top-0 left-8 right-8 h-[3px] bg-[linear-gradient(90deg,transparent,#d4a017,#e8c350,#d4a017,transparent)] rounded-b-[4px]" />

            <div className="px-8 pt-7 pb-5 border-b border-[#f0ece5] dark:border-[#222220] flex items-start justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-[38px] h-[38px] rounded-[10px] bg-[rgba(212,160,23,0.1)] dark:bg-[rgba(212,160,23,0.12)] border border-[rgba(212,160,23,0.2)] flex items-center justify-center">
                  {response ? (
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#d4a017"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  ) : (
                    <Star size={18} className="text-[#d4a017]" />
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-[22px] font-normal text-[#1a1a1a] dark:text-[#f0ede8] tracking-[-0.02em]">
                    {response ? "Your Career Guide" : "Tell us your skills"}
                  </h3>
                  <p className="text-[13px] text-[#888] dark:text-[#666] mt-0.5">
                    {response
                      ? `Personalized for: ${skills.join(", ")}`
                      : "Add skills to receive personalized recommendations"}
                  </p>
                </div>
              </div>
              <button
                onClick={resetDialog}
                className="w-[34px] h-[34px] rounded-lg bg-[#f5f2ed] dark:bg-[#252523] border border-[#e8e4dc] dark:border-[#2a2a28] flex items-center justify-center text-[#666] dark:text-[#888] hover:text-[#d4a017] transition-colors shrink-0 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              {!response && (
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#666] dark:text-[#888] tracking-[0.1em] uppercase mb-2">
                      Add Your Skills
                    </label>
                    <div className="flex gap-2.5">
                      <div className="flex-1 relative">
                        <Pencil
                          size={14}
                          className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${focusSkill ? "text-[#d4a017]" : "text-gray-400"}`}
                        />
                        <input
                          ref={inputRef}
                          type="text"
                          placeholder="e.g. React, Python, Node.js…"
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          onKeyDown={handleKey}
                          onFocus={() => setFocusSkill(true)}
                          onBlur={() => setFocusSkill(false)}
                          className="w-full h-[46px] pl-10 pr-4 bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-[#1a1a1a] dark:text-[#f0ede8] outline-none focus:ring-2 focus:ring-[#d4a017]"
                        />
                      </div>
                      <button
                        onClick={addSkill}
                        className="h-[46px] px-5 bg-black dark:bg-[#d4a017] text-white dark:text-black rounded-xl text-[13px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 hover:bg-[#d4a017] hover:text-black cursor-pointer"
                      >
                        <Plus size={14} />
                        Add
                      </button>
                    </div>
                    <p className="text-[11.5px] text-gray-400 dark:text-gray-600 mt-1.5">
                      Press Enter or click Add · Add multiple skills for better
                      results
                    </p>
                  </div>

                  {skills.length > 0 && (
                    <div>
                      <label className="block text-[11px] font-bold text-[#666] dark:text-[#888] tracking-[0.1em] uppercase mb-2">
                        Your Skills ({skills.length})
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((s) => (
                          <div
                            key={s}
                            className="inline-flex items-center gap-2 py-1.5 pl-3.5 pr-2.5 bg-[rgba(212,160,23,0.07)] dark:bg-[rgba(212,160,23,0.08)] border border-[rgba(212,160,23,0.25)] rounded-full animate-fade-up"
                          >
                            <span className="text-[13px] font-medium text-[#92610a] dark:text-[#e5c56d]">
                              {s}
                            </span>
                            <button
                              onClick={() => removeSkill(s)}
                              className="w-[18px] h-[18px] rounded-full bg-red-100 dark:bg-[rgba(239,68,68,0.2)] flex items-center justify-center text-red-500 cursor-pointer border-none transition-colors hover:bg-red-200"
                            >
                              <X size={9} strokeWidth={3} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={getCareerGuidance}
                    disabled={loading || skills.length === 0}
                    className="group flex items-center justify-center gap-2 w-full h-[50px] mt-1 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 bg-black text-white dark:bg-[#d4a017] dark:text-black hover:-translate-y-px hover:bg-[#d4a017] hover:text-black hover:shadow-[0_8px_24px_rgba(212,160,23,0.3)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {loading ? (
                      <>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="animate-spin"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Analyzing your skills…
                      </>
                    ) : (
                      <>
                        <Star size={17} />
                        Generate Career Guidance
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </div>
              )}

              {response && (
                <div className="flex flex-col gap-5 animate-fade-up">
                  <div className="p-5 bg-[rgba(212,160,23,0.06)] dark:bg-[rgba(212,160,23,0.07)] border border-[rgba(212,160,23,0.2)] rounded-2xl flex gap-3.5 items-start">
                    <div className="w-[34px] h-[34px] rounded-lg shrink-0 bg-[rgba(212,160,23,0.12)] dark:bg-[rgba(212,160,23,0.15)] flex items-center justify-center">
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="#d4a017"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-[#d4a017] tracking-[0.1em] uppercase mb-1.5">
                        Career Summary
                      </div>
                      <p className="text-sm text-[#1a1a1a] dark:text-[#f0ede8] leading-[1.75] font-light m-0">
                        {response.summary}
                      </p>
                    </div>
                  </div>

                  <div>
                    <SectionHeader
                      icon={<Briefcase size={16} className="text-[#d4a017]" />}
                      label="Recommended Career Paths"
                      count={response.jobOptions.length}
                    />
                    <div className="flex flex-col gap-2.5 mt-3">
                      {response.jobOptions.map((job, i) => (
                        <div
                          key={i}
                          className={`border rounded-xl overflow-hidden bg-white dark:bg-[#1a1a18] transition-colors duration-200 ${expandedJob === i ? "border-[#d4a017]" : "border-[#e8e4dc] dark:border-[#2a2a28]"}`}
                        >
                          <button
                            onClick={() =>
                              setExpandedJob(expandedJob === i ? null : i)
                            }
                            className="w-full px-[18px] py-3.5 bg-transparent border-none cursor-pointer flex items-center justify-between font-sans"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-[26px] h-[26px] rounded-[6px] bg-[#f5f2ed] dark:bg-[#252523] border border-[#e8e4dc] dark:border-[#2a2a28] flex items-center justify-center text-[11px] font-bold text-[#d4a017] shrink-0">
                                {i + 1}
                              </div>
                              <span className="text-sm font-semibold text-[#1a1a1a] dark:text-[#f0ede8]">
                                {job.title}
                              </span>
                            </div>
                            <ChevronDown
                              size={14}
                              className={`text-[#888] shrink-0 transition-transform duration-200 ${expandedJob === i ? "rotate-180" : ""}`}
                            />
                          </button>
                          {expandedJob === i && (
                            <div className="px-[18px] pb-[18px] flex flex-col gap-3 border-t border-[#f0ece5] dark:border-[#222220] animate-fade-up">
                              <InfoBlock
                                label="Responsibilities"
                                value={job.responsibilites}
                              />
                              <InfoBlock
                                label="Why this role"
                                value={job.why}
                                accent
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionHeader
                      icon={<TrendingUp size={16} className="text-[#d4a017]" />}
                      label="Skills to Enhance"
                      count={response.skillsToLearn.length}
                    />
                    <div className="flex flex-col gap-2.5 mt-3">
                      {response.skillsToLearn.map((cat, ci) => (
                        <div
                          key={ci}
                          className={`border rounded-xl overflow-hidden bg-white dark:bg-[#1a1a18] transition-colors duration-200 ${expandedCat === ci ? "border-[#d4a017]" : "border-[#e8e4dc] dark:border-[#2a2a28]"}`}
                        >
                          <button
                            onClick={() =>
                              setExpandedCat(expandedCat === ci ? null : ci)
                            }
                            className="w-full px-[18px] py-3.5 bg-transparent border-none cursor-pointer flex items-center justify-between font-sans"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-[#d4a017] tracking-[0.08em] uppercase">
                                {cat.category}
                              </span>
                              <span className="text-[10px] font-semibold text-[#888] bg-[#f0ece5] dark:bg-[#252523] border border-[#e8e4dc] dark:border-[#2a2a28] rounded-full px-2 py-0.5">
                                {cat.skills.length} skills
                              </span>
                            </div>
                            <ChevronDown
                              size={14}
                              className={`text-[#888] shrink-0 transition-transform duration-200 ${expandedCat === ci ? "rotate-180" : ""}`}
                            />
                          </button>
                          {expandedCat === ci && (
                            <div className="px-[18px] pb-[18px] flex flex-col gap-2.5 border-t border-[#f0ece5] dark:border-[#222220] animate-fade-up">
                              {cat.skills.map((skill, si) => (
                                <div
                                  key={si}
                                  className="p-3.5 bg-[#faf8f5] dark:bg-[#141413] border border-[#f0ece5] dark:border-[#222220] rounded-xl"
                                >
                                  <div className="text-[13.5px] font-semibold text-[#1a1a1a] dark:text-[#f0ede8] mb-2">
                                    {skill.title}
                                  </div>
                                  <InfoBlock
                                    label="Why"
                                    value={skill.why}
                                    small
                                  />
                                  <InfoBlock
                                    label="How"
                                    value={skill.how}
                                    small
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 bg-[rgba(16,185,129,0.05)] dark:bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.2)] dark:border-[rgba(16,185,129,0.15)] rounded-2xl">
                    <div className="flex items-center gap-2 mb-3.5">
                      <BookOpen size={16} className="text-[#10b981]" />
                      <span className="text-sm font-semibold text-[#1a1a1a] dark:text-[#f0ede8]">
                        {response.learningApproach.title}
                      </span>
                    </div>
                    <ul className="m-0 p-0 list-none flex flex-col gap-2">
                      {response.learningApproach.points.map((point, i) => (
                        <li key={i} className="flex gap-2.5 items-start">
                          <span className="w-[18px] h-[18px] rounded-full shrink-0 bg-[rgba(16,185,129,0.12)] dark:bg-[rgba(16,185,129,0.15)] flex items-center justify-center mt-0.5">
                            <svg
                              width="9"
                              height="9"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span
                            className="text-[13.5px] text-[#666] dark:text-[#888] leading-[1.65]"
                            dangerouslySetInnerHTML={{ __html: point }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={resetDialog}
                    className="group flex items-center justify-center gap-2 w-full h-[46px] bg-transparent border border-[#e8e4dc] dark:border-[#2a2a28] hover:border-[#d4a017] rounded-xl text-[13px] font-semibold text-[#888] hover:text-[#d4a017] transition-all duration-200 cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    Start New Analysis
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const FeatureCardComponent = ({
  f,
  delay,
}: {
  f: { icon: React.ReactNode; title: string; desc: string; accent: string };
  delay: number;
}) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="p-7 bg-white dark:bg-[#1a1a18] border border-[#e8e4dc] dark:border-[#2a2a28] rounded-[18px] transition-all duration-300 cursor-default relative overflow-hidden animate-fade-up"
      style={{
        animationDelay: `${delay}ms`,
        transform: hover ? "translateY(-5px)" : "none",
        borderColor: hover ? f.accent + "55" : undefined,
        boxShadow: hover
          ? `0 20px 50px rgba(0,0,0,0.08), 0 0 0 1px ${f.accent}22`
          : undefined,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[18px] transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${f.accent}88, transparent)`,
          opacity: hover ? 1 : 0,
        }}
      />
      <div
        className="w-[52px] h-[52px] rounded-xl mb-5 bg-[#f5f2ed] dark:bg-[#252523] border border-[#e8e4dc] dark:border-[#2a2a28] flex items-center justify-center transition-transform duration-300"
        style={{ transform: hover ? "scale(1.05)" : "none" }}
      >
        {f.icon}
      </div>
      <h3 className="text-[15.5px] font-semibold text-[#1a1a1a] dark:text-[#f0ede8] mb-2">
        {f.title}
      </h3>
      <p className="text-[13.5px] text-[#666] dark:text-[#888] leading-[1.65] font-light m-0">
        {f.desc}
      </p>
    </div>
  );
};

const SectionHeader = ({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
}) => (
  <div className="flex items-center gap-2">
    <div className="w-[28px] h-[28px] rounded-[7px] bg-[rgba(212,160,23,0.08)] flex items-center justify-center">
      {icon}
    </div>
    <span className="text-sm font-bold text-[#1a1a1a] dark:text-[#f0ede8]">
      {label}
    </span>
    <span className="text-[10.5px] font-bold bg-[#f5f2ed] dark:bg-[#1e1d1b] border border-[#e8e4dc] dark:border-[#333330] text-[#666] dark:text-[#888] rounded-full px-2.5 py-0.5">
      {count}
    </span>
  </div>
);

const InfoBlock = ({
  label,
  value,
  accent,
  small,
}: {
  label: string;
  value: string;
  accent?: boolean;
  small?: boolean;
}) => (
  <div className={small ? "mt-2" : "mt-3"}>
    <span
      className={`text-[10px] font-bold tracking-[0.1em] uppercase ${accent ? "text-[#d4a017]" : "text-[#666] dark:text-[#888]"}`}
    >
      {label}
    </span>
    <p
      className={`${small ? "text-[12.5px]" : "text-[13.5px]"} text-[#666] dark:text-[#888] leading-[1.65] mt-1 font-light`}
    >
      {value}
    </p>
  </div>
);

export default CareerGuide;
