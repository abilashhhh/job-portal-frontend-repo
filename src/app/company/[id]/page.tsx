"use client";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Job_Service, useAppData } from "@/context/AppContext";
import { Company, Job } from "@/lib/type";
import axios from "axios";
import Loading from "@/components/ui/Loading";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import {
  Plus,
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Pencil,
  Trash2,
  Globe,
  Building2,
  Clock,
  Wifi,
  CheckCircle2,
  XCircle,
  ChevronRight,
  X,
  Sparkles,
  FileText,
  Eye,
} from "lucide-react";

/* ─────────────────────────────────────────────
   THEME TOKENS  (mirrors updated Company.tsx)
───────────────────────────────────────────── */
const buildTokens = (dark: boolean) => ({
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
  cardBg: dark ? "#1a1a18" : "#ffffff",
  cardBorder: dark ? "#2a2a28" : "#e8e4dc",
  headerBg: dark ? "#0d0d0c" : "#1a1a1a",
  inputBg: dark ? "#141413" : "#faf8f5",
  danger: "#ef4444",
  dangerBorder: "rgba(239,68,68,0.3)",
  dangerGlow: "rgba(239,68,68,0.1)",
  blue: "#3b82f6",
  blueGlow: "rgba(59,130,246,0.1)",
  emerald: "#10b981",
  rose: "#f43f5e",
  emeraldBg: dark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)",
  roseBg: dark ? "rgba(244,63,94,0.12)" : "rgba(244,63,94,0.08)",
});

type T = ReturnType<typeof buildTokens>;

/* ─────────────────────────────────────────────
   BADGE DATA
───────────────────────────────────────────── */
const jobTypeColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "Full-time": {
    bg: "rgba(16,185,129,0.12)",
    text: "#10b981",
    border: "rgba(16,185,129,0.3)",
  },
  "Part-time": {
    bg: "rgba(245,158,11,0.12)",
    text: "#f59e0b",
    border: "rgba(245,158,11,0.3)",
  },
  Contract: {
    bg: "rgba(139,92,246,0.12)",
    text: "#8b5cf6",
    border: "rgba(139,92,246,0.3)",
  },
  Internship: {
    bg: "rgba(14,165,233,0.12)",
    text: "#0ea5e9",
    border: "rgba(14,165,233,0.3)",
  },
};
const workLocColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "On-site": {
    bg: "rgba(249,115,22,0.12)",
    text: "#f97316",
    border: "rgba(249,115,22,0.3)",
  },
  Remote: {
    bg: "rgba(20,184,166,0.12)",
    text: "#14b8a6",
    border: "rgba(20,184,166,0.3)",
  },
  Hybrid: {
    bg: "rgba(236,72,153,0.12)",
    text: "#ec4899",
    border: "rgba(236,72,153,0.3)",
  },
};

/* ─────────────────────────────────────────────
   FIELD
───────────────────────────────────────────── */
const Field = ({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  type = "text",
  icon,
  t,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  type?: string;
  icon?: React.ReactNode;
  t: T;
}) => {
  const [focused, setFocused] = useState(false);
  const base: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: `1.5px solid ${focused ? t.gold : t.border}`,
    background: t.inputBg,
    color: t.text,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "all 0.2s",
    boxShadow: focused ? "0 0 0 3px rgba(212,160,23,0.1)" : "none",
    boxSizing: "border-box" as const,
    resize: "none" as const,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          fontSize: 13,
          fontWeight: 600,
          color: t.text,
          letterSpacing: "0.02em",
        }}
      >
        {icon && <span style={{ color: t.gold }}>{icon}</span>}
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={base}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...base, height: 48 }}
        />
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   SELECT
───────────────────────────────────────────── */
const SelectField = ({
  label,
  value,
  onChange,
  options,
  icon,
  t,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  icon?: React.ReactNode;
  t: T;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          fontSize: 13,
          fontWeight: 600,
          color: t.text,
          letterSpacing: "0.02em",
        }}
      >
        {icon && <span style={{ color: t.gold }}>{icon}</span>}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height: 48,
          padding: "0 36px 0 16px",
          borderRadius: 10,
          border: `1.5px solid ${focused ? t.gold : t.border}`,
          background: t.inputBg,
          color: value ? t.text : t.muted,
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
          cursor: "pointer",
          appearance: "none",
          boxShadow: focused ? "0 0 0 3px rgba(212,160,23,0.1)" : "none",
          transition: "all 0.2s",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
        }}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
};

/* ─────────────────────────────────────────────
   TOGGLE
───────────────────────────────────────────── */
const Toggle = ({
  active,
  onToggle,
  t,
}: {
  active: boolean;
  onToggle: () => void;
  t: T;
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <button
      type="button"
      onClick={onToggle}
      style={{
        position: "relative",
        width: 46,
        height: 26,
        borderRadius: 99,
        border: "none",
        cursor: "pointer",
        padding: 0,
        background: active ? t.gold : t.border,
        transition: "background 0.25s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: active ? "#1a1a1a" : "#888",
          left: active ? 23 : 3,
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          transition: "left 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />
    </button>
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {active ? (
        <CheckCircle2 size={14} color={t.emerald} />
      ) : (
        <XCircle size={14} color={t.rose} />
      )}
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: active ? t.emerald : t.rose,
        }}
      >
        {active ? "Active" : "Inactive"}
      </span>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   JOB FORM
───────────────────────────────────────────── */
const JobForm = ({
  title,
  setTitle,
  description,
  setDescription,
  role,
  setRole,
  salary,
  setSalary,
  location,
  setLocation,
  openings,
  setOpenings,
  jobType,
  setJobType,
  workLocation,
  setWorkLocation,
  showActiveToggle = false,
  isActive,
  setIsActive,
  t,
}: any) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <Field
      label="Job Title"
      placeholder="e.g. Senior Frontend Engineer"
      value={title}
      onChange={setTitle}
      icon={<Briefcase size={15} />}
      t={t}
    />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Field
        label="Role / Department"
        placeholder="e.g. Engineering"
        value={role}
        onChange={setRole}
        t={t}
      />
      <Field
        label="Location"
        placeholder="e.g. Bangalore, India"
        value={location}
        onChange={setLocation}
        icon={<MapPin size={15} />}
        t={t}
      />
      <Field
        label="Salary (₹ / year)"
        placeholder="e.g. 1200000"
        type="number"
        value={salary}
        onChange={setSalary}
        icon={<DollarSign size={15} />}
        t={t}
      />
      <Field
        label="Openings"
        placeholder="e.g. 3"
        type="number"
        value={openings}
        onChange={setOpenings}
        icon={<Users size={15} />}
        t={t}
      />
    </div>
    <Field
      label="Description"
      placeholder="Describe the role, responsibilities and requirements…"
      value={description}
      onChange={setDescription}
      multiline
      icon={<FileText size={15} />}
      t={t}
    />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <SelectField
        label="Job Type"
        value={jobType}
        onChange={setJobType}
        options={["Full-time", "Part-time", "Contract", "Internship"]}
        icon={<Clock size={15} />}
        t={t}
      />
      <SelectField
        label="Work Location"
        value={workLocation}
        onChange={setWorkLocation}
        options={["On-site", "Remote", "Hybrid"]}
        icon={<Wifi size={15} />}
        t={t}
      />
    </div>
    {showActiveToggle && (
      <div
        style={{
          padding: "14px 16px",
          borderRadius: 10,
          background: t.surfaceAlt,
          border: `1.5px solid ${t.border}`,
        }}
      >
        <p
          style={{
            margin: "0 0 10px",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: t.muted,
          }}
        >
          Listing Status
        </p>
        <Toggle
          active={isActive}
          onToggle={() => setIsActive(!isActive)}
          t={t}
        />
      </div>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */
const Modal = ({
  open,
  onClose,
  title: modalTitle,
  icon,
  t,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  t: T;
  children: React.ReactNode;
  footer: React.ReactNode;
}) => {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (open) setTimeout(() => setVis(true), 10);
    else setVis(false);
  }, [open]);
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        opacity: vis ? 1 : 0,
        transition: "opacity 0.25s",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: t.surface,
          borderRadius: 20,
          overflow: "hidden",
          width: "100%",
          maxWidth: 540,
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          border: `1px solid ${t.border}`,
          transform: vis
            ? "translateY(0) scale(1)"
            : "translateY(22px) scale(0.97)",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Dark stripe header */}
        <div
          style={{
            background: t.headerBg,
            padding: "26px 28px",
            borderBottom: `1px solid ${t.border}`,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "20%",
              right: "20%",
              height: 3,
              background: `linear-gradient(90deg, transparent, ${t.gold}, transparent)`,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(212,160,23,0.15)",
                  border: "1px solid rgba(212,160,23,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon ?? <Briefcase size={20} color={t.gold} />}
              </div>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                  fontWeight: 400,
                  color: "#f0ede8",
                  letterSpacing: "-0.02em",
                }}
              >
                {modalTitle}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 6,
                borderRadius: 8,
                color: "#888",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          {children}
          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
            }}
          >
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   JOB CARD
───────────────────────────────────────────── */
const JobCard = ({
  job,
  t,
  isOwner,
  onEdit,
  onDelete,
  onView,
  btnLoading,
  index,
}: {
  job: Job;
  t: T;
  isOwner: boolean;
  onEdit: (j: Job) => void;
  onDelete: (id: number) => void;
  onView: (j: Job) => void;
  btnLoading: boolean;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);
  const jt = jobTypeColors[job.job_type];
  const wl = workLocColors[job.work_location];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: t.cardBg,
        border: `1px solid ${hovered ? "rgba(212,160,23,0.4)" : t.cardBorder}`,
        borderRadius: 18,
        padding: 24,
        boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.12)" : "none",
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all 0.3s cubic-bezier(0.2,0,0,1)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "relative",
        overflow: "hidden",
        opacity: 0,
        animation: `fadeUp 0.6s ease ${index * 0.08}s both`,
      }}
    >
      {/* Gold top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 2,
          background: `linear-gradient(90deg, transparent, ${t.gold}, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 4,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                fontWeight: 400,
                color: t.text,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {job.title}
            </h3>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 9px",
                borderRadius: 99,
                border: `1px solid ${job.is_active ? "rgba(16,185,129,0.35)" : "rgba(244,63,94,0.35)"}`,
                background: job.is_active ? t.emeraldBg : t.roseBg,
                color: job.is_active ? t.emerald : t.rose,
                letterSpacing: "0.05em",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: job.is_active ? t.emerald : t.rose,
                }}
              />
              {job.is_active ? "Active" : "Closed"}
            </span>
          </div>
          <p
            style={{ margin: 0, fontSize: 12, color: t.muted, fontWeight: 400 }}
          >
            {job.role}
          </p>
        </div>

        {isOwner && (
          <div
            style={{
              display: "flex",
              gap: 7,
              flexShrink: 0,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          >
            <button
              onClick={() => onView(job)}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: `1.5px solid ${t.border}`,
                background: "transparent",
                cursor: "pointer",
                color: t.gold,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(212,160,23,0.12)";
                e.currentTarget.style.borderColor = t.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = t.border;
              }}
            >
              <Eye size={13} />
            </button>
            <button
              onClick={() => onEdit(job)}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: `1.5px solid ${t.border}`,
                background: "transparent",
                cursor: "pointer",
                color: t.blue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = t.blueGlow;
                e.currentTarget.style.borderColor = t.blue;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = t.border;
              }}
            >
              <Pencil size={13} />
            </button>
            <button
              disabled={btnLoading}
              onClick={() => onDelete(job.job_id)}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: `1.5px solid ${t.dangerBorder}`,
                background: "transparent",
                cursor: btnLoading ? "not-allowed" : "pointer",
                color: t.danger,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!btnLoading) {
                  e.currentTarget.style.background = t.dangerGlow;
                  e.currentTarget.style.borderColor = t.danger;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = t.dangerBorder;
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      <p
        style={{
          margin: 0,
          fontSize: 13.5,
          color: t.muted,
          lineHeight: 1.6,
          fontWeight: 300,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {job.description}
      </p>

      {/* Badges */}
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {jt && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontWeight: 600,
              padding: "4px 11px",
              borderRadius: 99,
              border: `1px solid ${jt.border}`,
              background: jt.bg,
              color: jt.text,
            }}
          >
            <Clock size={10} />
            {job.job_type}
          </span>
        )}
        {wl && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontWeight: 600,
              padding: "4px 11px",
              borderRadius: 99,
              border: `1px solid ${wl.border}`,
              background: wl.bg,
              color: wl.text,
            }}
          >
            <Wifi size={10} />
            {job.work_location}
          </span>
        )}
      </div>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          paddingTop: 14,
          borderTop: `1px solid ${t.borderLight}`,
        }}
      >
        {job.location && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12,
              color: t.muted,
            }}
          >
            <MapPin size={12} color={t.gold} />
            {job.location}
          </span>
        )}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            color: t.muted,
          }}
        >
          <DollarSign size={12} color={t.gold} />₹
          {Number(job.salary).toLocaleString("en-IN")} / yr
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            color: t.muted,
          }}
        >
          <Users size={12} color={t.gold} />
          {job.openings} opening{job.openings > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const CompanyPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const viewJobHandler = (job: Job) => {
    router.push(`/jobs/${job.job_id}/applications`);
  };
  const token = Cookies.get("token");
  const { user, loading, isAuth } = useAppData();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";
  const t = buildTokens(dark);

  useEffect(() => {
    if (!loading && !isAuth) {
      router.push("/login");
    }
  }, [isAuth, loading, router]);
  const [pageLoading, setPageLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [hoverAddBtn, setHoverAddBtn] = useState(false);
  const [hoverWebsite, setHoverWebsite] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [openings, setOpenings] = useState("");
  const [jobType, setJobType] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [isActive, setIsActive] = useState(true);

  const isOwner = user && company && user.user_id === company.recruiter_id;

  const clearInput = () => {
    setTitle("");
    setDescription("");
    setRole("");
    setSalary("");
    setLocation("");
    setOpenings("");
    setJobType("");
    setWorkLocation("");
    setIsActive(true);
  };

  const fetchCompany = async () => {
    try {
      setPageLoading(true);
      const { data } = await axios.get(
        `${Job_Service}/api/job/getCompany/${id}`,
      );
      setCompany(data);
    } catch {
      toast.error("Failed to load company");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    fetchCompany();
  }, [id]);

  const addJobHandler = async () => {
    if (
      !title ||
      !description ||
      !role ||
      !salary ||
      !location ||
      !openings ||
      !jobType ||
      !workLocation
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setBtnLoading(true);
      const { data } = await axios.post(
        `${Job_Service}/api/job/createJob`,
        {
          title,
          description,
          role,
          salary: Number(salary),
          location,
          openings: Number(openings),
          job_type: jobType,
          work_location: workLocation,
          company_id: Number(id),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(data.message);
      clearInput();
      setIsAddOpen(false);
      fetchCompany();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create job");
    } finally {
      setBtnLoading(false);
    }
  };

  const openDeleteDialog = (jobId: number) => {
    setDeleteJobId(jobId);
    setDeleteDialogOpen(true);
  };

  const deleteJobHandler = async () => {
    if (!deleteJobId) return;

    try {
      setBtnLoading(true);
      const { data } = await axios.delete(
        `${Job_Service}/api/job/deleteJob/${deleteJobId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(data.message);
      fetchCompany();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    } finally {
      setBtnLoading(false);
      setDeleteDialogOpen(false);
      setDeleteJobId(null);
    }
  };

  const updateJobHandler = async () => {
    if (!selectedJob) return;
    try {
      setBtnLoading(true);
      const { data } = await axios.put(
        `${Job_Service}/api/job/updateJob/${selectedJob.job_id}`,
        {
          title,
          description,
          role,
          salary: Number(salary),
          location,
          openings: Number(openings),
          job_type: jobType,
          work_location: workLocation,
          company_id: Number(id),
          is_active: isActive,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(data.message);
      clearInput();
      setIsEditOpen(false);
      setSelectedJob(null);
      fetchCompany();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const openEditModal = (job: Job) => {
    setSelectedJob(job);
    setTitle(job.title);
    setDescription(job.description);
    setRole(job.role);
    setSalary(String(job.salary));
    setLocation(job.location || "");
    setOpenings(String(job.openings));
    setJobType(job.job_type);
    setWorkLocation(job.work_location);
    setIsActive(job.is_active);
    setIsEditOpen(true);
  };

  if (!mounted || pageLoading) return <Loading />;

  const goldBtn = (hov: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    height: 50,
    padding: "0 28px",
    background: hov ? t.goldLight : t.gold,
    color: "#1a1a1a",
    border: "none",
    borderRadius: 12,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14.5,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.25s",
    letterSpacing: "0.03em",
    transform: hov ? "translateY(-2px)" : "none",
    boxShadow: hov
      ? "0 12px 32px rgba(212,160,23,0.35)"
      : "0 4px 16px rgba(212,160,23,0.2)",
    flexShrink: 0,
  });

  const outlineBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    padding: "0 20px",
    borderRadius: 10,
    border: `1.5px solid ${t.border}`,
    background: "transparent",
    color: t.text,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const jobCount = company?.jobs?.length ?? 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        * { box-sizing: border-box; }
      `}</style>

      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: t.bg,
          minHeight: "100vh",
          transition: "background 0.3s, color 0.3s",
        }}
      >
        {/* ── HERO HEADER ── */}
        <header
          style={{
            background: t.headerBg,
            position: "relative",
            overflow: "hidden",
            borderBottom: `1px solid ${t.border}`,
          }}
        >
          {/* Radial glows */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 60% 80% at 70% 50%, rgba(212,160,23,0.1) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(59,130,246,0.07) 0%, transparent 60%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "8%",
              top: "15%",
              width: 200,
              height: 200,
              borderRadius: "50%",
              border: "1.5px solid rgba(212,160,23,0.12)",
              pointerEvents: "none",
            }}
          />

          {/* Banner strip */}
          {company && (
            <div
              style={{
                height: 130,
                position: "relative",
                background:
                  "linear-gradient(135deg, #1a1a1a 0%, #2a2010 50%, #1a1a1a 100%)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.1,
                  backgroundImage:
                    "radial-gradient(circle, rgba(212,160,23,0.8) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: "5%",
                  top: "10%",
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: "rgba(212,160,23,0.06)",
                  pointerEvents: "none",
                }}
              />
            </div>
          )}

          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "0 24px",
              position: "relative",
            }}
          >
            {/* Logo */}
            {company && (
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 18,
                  overflow: "hidden",
                  border: `3px solid ${t.headerBg}`,
                  boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
                  background: t.surfaceAlt,
                  marginTop: -48,
                  marginBottom: 20,
                }}
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 24,
                paddingBottom: 40,
              }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: 260,
                  animation: "fadeUp 0.5s ease 0.1s both",
                }}
              >
                {/* Label pill */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    background: "rgba(212,160,23,0.12)",
                    border: "1px solid rgba(212,160,23,0.25)",
                    borderRadius: 100,
                    padding: "5px 14px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: t.gold,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  <Building2 size={12} /> Company Profile
                </div>

                <h1
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                    fontWeight: 400,
                    color: "#f0ede8",
                    margin: "0 0 10px",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.1,
                  }}
                >
                  {company?.name ?? "Loading…"}
                  {jobCount > 0 && (
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: 14,
                        fontSize: "0.4em",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700,
                        verticalAlign: "middle",
                        padding: "4px 12px",
                        borderRadius: 99,
                        background: "rgba(212,160,23,0.15)",
                        border: "1px solid rgba(212,160,23,0.3)",
                        color: t.gold,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {jobCount} role{jobCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </h1>

                {company && (
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 300,
                      color: "rgba(240,237,232,0.55)",
                      margin: "0 0 16px",
                      lineHeight: 1.6,
                      maxWidth: 520,
                    }}
                  >
                    {company.description}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 16,
                    alignItems: "center",
                  }}
                >
                  {company && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        color: "rgba(240,237,232,0.45)",
                      }}
                    >
                      <Briefcase size={14} color={t.gold} />
                      {jobCount} job{jobCount !== 1 ? "s" : ""} posted
                    </span>
                  )}
                  {company?.website && (
                    <a
                      href={
                        company.website.startsWith("http")
                          ? company.website
                          : `https://${company.website}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      onMouseEnter={() => setHoverWebsite(true)}
                      onMouseLeave={() => setHoverWebsite(false)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        height: 40,
                        padding: "0 20px",
                        borderRadius: 10,
                        background: hoverWebsite
                          ? "rgba(212,160,23,0.15)"
                          : "rgba(212,160,23,0.08)",
                        border: `1px solid ${hoverWebsite ? "rgba(212,160,23,0.5)" : "rgba(212,160,23,0.25)"}`,
                        color: t.gold,
                        textDecoration: "none",
                        fontSize: 13,
                        fontWeight: 600,
                        transition: "all 0.2s",
                        transform: hoverWebsite ? "translateY(-1px)" : "none",
                      }}
                    >
                      <Globe size={14} /> Visit Website{" "}
                      <ChevronRight size={13} />
                    </a>
                  )}
                </div>
              </div>

              {/* Stats mini card */}
              {company && (
                <div
                  style={{
                    display: "flex",
                    gap: 0,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    overflow: "hidden",
                    animation: "fadeUp 0.5s ease 0.2s both",
                  }}
                >
                  {[
                    {
                      label: "Jobs Posted",
                      value: String(jobCount),
                      isText: false,
                    },
                    {
                      label: "Status",
                      value: jobCount > 0 ? "Hiring" : "Idle",
                      isText: true,
                    },
                  ].map(({ label, value, isText }, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "18px 28px",
                        textAlign: "center",
                        borderRight:
                          i === 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: isText
                            ? "'DM Sans',sans-serif"
                            : "'DM Serif Display', serif",
                          fontSize: isText ? 15 : "clamp(1.6rem, 3vw, 2rem)",
                          fontWeight: isText ? 700 : 400,
                          color: isText
                            ? jobCount > 0
                              ? t.emerald
                              : t.muted
                            : t.gold,
                          letterSpacing: "-0.03em",
                          lineHeight: 1,
                        }}
                      >
                        {value}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "rgba(240,237,232,0.4)",
                          fontWeight: 600,
                          marginTop: 5,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── JOBS SECTION ── */}
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "52px 24px 80px",
          }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 36,
              animation: "fadeUp 0.5s ease 0.25s both",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: "rgba(212,160,23,0.1)",
                  border: "1px solid rgba(212,160,23,0.2)",
                  borderRadius: 100,
                  padding: "5px 14px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: t.gold,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                <Briefcase size={12} /> Open Positions
              </div>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                  fontWeight: 400,
                  color: t.text,
                  margin: "0 0 6px",
                  letterSpacing: "-0.025em",
                }}
              >
                {jobCount > 0 ? (
                  <>
                    Current{" "}
                    <em style={{ color: t.gold, fontStyle: "italic" }}>
                      Openings
                    </em>
                  </>
                ) : (
                  "No Open Roles"
                )}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: t.muted,
                  fontWeight: 300,
                }}
              >
                {jobCount
                  ? `${jobCount} role${jobCount > 1 ? "s" : ""} currently available`
                  : "No open roles right now"}
              </p>
            </div>

            {isOwner && (
              <button
                onClick={() => setIsAddOpen(true)}
                onMouseEnter={() => setHoverAddBtn(true)}
                onMouseLeave={() => setHoverAddBtn(false)}
                style={goldBtn(hoverAddBtn)}
              >
                <Plus size={18} /> Post a Job
              </button>
            )}
          </div>

          {/* Cards grid */}
          {jobCount > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 420px), 1fr))",
                gap: 18,
              }}
            >
              {company!.jobs!.map((job, i) => (
                <JobCard
                  key={job.job_id}
                  job={job}
                  t={t}
                  isOwner={!!isOwner}
                  onView={viewJobHandler}
                  onEdit={openEditModal}
                  onDelete={openDeleteDialog}
                  btnLoading={btnLoading}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
                background: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
                borderRadius: 20,
                animation: "fadeUp 0.6s ease both",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(212,160,23,0.1)",
                  border: "2px solid rgba(212,160,23,0.2)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                <Briefcase size={34} color={t.gold} />
              </div>
              <h3
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                  fontWeight: 400,
                  color: t.text,
                  margin: "0 0 10px",
                  letterSpacing: "-0.02em",
                }}
              >
                No jobs posted yet
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: t.muted,
                  margin: "0 0 32px",
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                {isOwner
                  ? "Post your first job opening to start receiving applications."
                  : "Check back later for new opportunities."}
              </p>
              {isOwner && (
                <button
                  onClick={() => setIsAddOpen(true)}
                  onMouseEnter={() => setHoverAddBtn(true)}
                  onMouseLeave={() => setHoverAddBtn(false)}
                  style={goldBtn(hoverAddBtn)}
                >
                  <Sparkles size={16} /> Post First Job
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── ADD JOB MODAL ── */}
      <Modal
        open={isAddOpen}
        onClose={() => {
          if (!btnLoading) {
            setIsAddOpen(false);
            clearInput();
          }
        }}
        title="Post a New Job"
        icon={<Briefcase size={20} color={t.gold} />}
        t={t}
        footer={
          <>
            <button
              style={outlineBtn}
              onClick={() => {
                setIsAddOpen(false);
                clearInput();
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = t.surfaceAlt)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Cancel
            </button>
            <button
              disabled={btnLoading}
              onClick={addJobHandler}
              style={{
                ...goldBtn(false),
                height: 44,
                padding: "0 24px",
                fontSize: 14,
                opacity: btnLoading ? 0.6 : 1,
                cursor: btnLoading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!btnLoading) {
                  e.currentTarget.style.background = t.goldLight;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = t.gold;
                e.currentTarget.style.transform = "none";
              }}
            >
              {btnLoading ? "Posting…" : "Post Job"}
            </button>
          </>
        }
      >
        <JobForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          role={role}
          setRole={setRole}
          salary={salary}
          setSalary={setSalary}
          location={location}
          setLocation={setLocation}
          openings={openings}
          setOpenings={setOpenings}
          jobType={jobType}
          setJobType={setJobType}
          workLocation={workLocation}
          setWorkLocation={setWorkLocation}
          t={t}
        />
      </Modal>

      {/* ── EDIT JOB MODAL ── */}
      <Modal
        open={isEditOpen}
        onClose={() => {
          if (!btnLoading) {
            setIsEditOpen(false);
            setSelectedJob(null);
            clearInput();
          }
        }}
        title="Edit Job Posting"
        icon={<Pencil size={20} color={t.gold} />}
        t={t}
        footer={
          <>
            <button
              style={outlineBtn}
              onClick={() => {
                setIsEditOpen(false);
                setSelectedJob(null);
                clearInput();
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = t.surfaceAlt)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Cancel
            </button>
            <button
              disabled={btnLoading}
              onClick={updateJobHandler}
              style={{
                ...goldBtn(false),
                height: 44,
                padding: "0 24px",
                fontSize: 14,
                opacity: btnLoading ? 0.6 : 1,
                cursor: btnLoading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!btnLoading) {
                  e.currentTarget.style.background = t.goldLight;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = t.gold;
                e.currentTarget.style.transform = "none";
              }}
            >
              {btnLoading ? "Saving…" : "Save Changes"}
            </button>
          </>
        }
      >
        <JobForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          role={role}
          setRole={setRole}
          salary={salary}
          setSalary={setSalary}
          location={location}
          setLocation={setLocation}
          openings={openings}
          setOpenings={setOpenings}
          jobType={jobType}
          setJobType={setJobType}
          workLocation={workLocation}
          setWorkLocation={setWorkLocation}
          showActiveToggle
          isActive={isActive}
          setIsActive={setIsActive}
          t={t}
        />
      </Modal>
      {/* ── DELETE JOB CONFIRMATION MODAL ── */}
      <Modal
        open={deleteDialogOpen}
        onClose={() => {
          if (!btnLoading) {
            setDeleteDialogOpen(false);
            setDeleteJobId(null);
          }
        }}
        title="Delete Job Posting"
        icon={<Trash2 size={20} color={t.danger} />}
        t={t}
        footer={
          <>
            <button
              style={outlineBtn}
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteJobId(null);
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = t.surfaceAlt)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Cancel
            </button>

            <button
              disabled={btnLoading}
              onClick={deleteJobHandler}
              style={{
                ...goldBtn(false),
                height: 44,
                padding: "0 24px",
                fontSize: 14,
                background: t.danger,
                color: "#fff",
                opacity: btnLoading ? 0.6 : 1,
                cursor: btnLoading ? "not-allowed" : "pointer",
              }}
            >
              {btnLoading ? "Deleting…" : "Delete Job"}
            </button>
          </>
        }
      >
        <p
          style={{
            fontSize: 14,
            color: t.muted,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Are you sure you want to delete this job posting? This action cannot
          be undone.
        </p>
      </Modal>
    </>
  );
};

export default CompanyPage;
