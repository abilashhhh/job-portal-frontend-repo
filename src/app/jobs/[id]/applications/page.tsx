// "use client";

// import { useParams } from "next/navigation";
// import Cookies from "js-cookie";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Job_Service } from "@/context/AppContext";
// import Loading from "@/components/ui/Loading";
// import toast from "react-hot-toast";
// import { Mail, Phone, Calendar, CheckCircle2, XCircle } from "lucide-react";

// type Application = {
//   application_id: number;
//   job_id: number;
//   user_id: number;
//   name: string;
//   email: string;
//   phone?: string;
//   resume?: string;
//   status: "Submitted" | "Rejected" | "Hired";
//   created_at: string;
// };

// const ApplicationsPage = () => {
//   const params = useParams();
//   const id = params?.id;

//   const token = Cookies.get("token");

//   const [applications, setApplications] = useState<Application[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [btnLoading, setBtnLoading] = useState<number | null>(null);

//   const fetchApplications = async () => {
//     try {
//       setLoading(true);

//       const { data } = await axios.get(
//         `${Job_Service}/api/job/getAllApplications/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       setApplications(data);
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message || "Failed to load applications",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateApplicationStatus = async (
//     applicationId: number,
//     status: "Rejected" | "Hired",
//   ) => {
//     try {
//       setBtnLoading(applicationId);

//       await axios.put(
//         `${Job_Service}/api/job/updateApplication/${applicationId}`,
//         { status },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       toast.success(`Application ${status}`);

//       setApplications((prev) =>
//         prev.map((a) =>
//           a.application_id === applicationId ? { ...a, status } : a,
//         ),
//       );
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || "Failed to update");
//     } finally {
//       setBtnLoading(null);
//     }
//   };

//   useEffect(() => {
//     if (id) fetchApplications();
//   }, [id]);

//   if (loading) return <Loading />;

//   return (
//     <div
//       style={{
//         maxWidth: 1000,
//         margin: "0 auto",
//         padding: "40px 20px",
//       }}
//     >
//       <h1
//         style={{
//           fontSize: 28,
//           fontWeight: 700,
//           marginBottom: 30,
//         }}
//       >
//         Job Applications
//       </h1>

//       {applications.length === 0 ? (
//         <div
//           style={{
//             padding: 40,
//             textAlign: "center",
//             border: "1px solid #eee",
//             borderRadius: 10,
//           }}
//         >
//           No applications received yet.
//         </div>
//       ) : (
//         <div
//           style={{
//             display: "grid",
//             gap: 16,
//           }}
//         >
//           {applications.map((app) => (
//             <div
//               key={app.application_id}
//               style={{
//                 padding: 20,
//                 border: "1px solid #e5e5e5",
//                 borderRadius: 12,
//                 background: "#fff",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 10,
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <h3 style={{ margin: 0 }}>{app.name}</h3>

//                 <span
//                   style={{
//                     fontSize: 12,
//                     padding: "4px 10px",
//                     borderRadius: 20,
//                     background:
//                       app.status === "Hired"
//                         ? "#e6f9f0"
//                         : app.status === "Rejected"
//                         ? "#ffecec"
//                         : "#f3f4f6",
//                     color:
//                       app.status === "Hired"
//                         ? "#059669"
//                         : app.status === "Rejected"
//                         ? "#dc2626"
//                         : "#555",
//                   }}
//                 >
//                   {app.status}
//                 </span>
//               </div>

//               <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
//                 <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
//                   <Mail size={14} /> {app.email}
//                 </span>

//                 {app.phone && (
//                   <span
//                     style={{ display: "flex", gap: 6, alignItems: "center" }}
//                   >
//                     <Phone size={14} /> {app.phone}
//                   </span>
//                 )}

//                 <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
//                   <Calendar size={14} />
//                   {new Date(app.created_at).toLocaleDateString()}
//                 </span>
//               </div>

//               {app.resume && (
//                 <div>
//                   <a
//                     href={app.resume}
//                     target="_blank"
//                     rel="noreferrer"
//                     style={{
//                       color: "#d4a017",
//                       fontWeight: 600,
//                     }}
//                   >
//                     View Resume
//                   </a>
//                 </div>
//               )}

//               {app.status === "Submitted" && (
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 10,
//                     marginTop: 10,
//                   }}
//                 >
//                   <button
//                     disabled={btnLoading === app.application_id}
//                     onClick={() =>
//                       updateApplicationStatus(app.application_id, "Hired")
//                     }
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 6,
//                       padding: "6px 12px",
//                       borderRadius: 8,
//                       border: "none",
//                       cursor: "pointer",
//                       background: "#059669",
//                       color: "white",
//                     }}
//                   >
//                     <CheckCircle2 size={14} /> Hire
//                   </button>

//                   <button
//                     disabled={btnLoading === app.application_id}
//                     onClick={() =>
//                       updateApplicationStatus(app.application_id, "Rejected")
//                     }
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 6,
//                       padding: "6px 12px",
//                       borderRadius: 8,
//                       border: "none",
//                       cursor: "pointer",
//                       background: "#dc2626",
//                       color: "white",
//                     }}
//                   >
//                     <XCircle size={14} /> Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ApplicationsPage;

"use client";

import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Job_Service } from "@/context/AppContext";
import Loading from "@/components/ui/Loading";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import {
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  FileText,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type ApplicationStatus = "Submitted" | "Rejected" | "Hired";

type Application = {
  application_id: number;
  job_id: number;
  applicant_id: number;
  status: ApplicationStatus;
  subscribed?: boolean;
  applied_at: string;
  resume?: string;
  phone?: string;
  user_id: number;
  applicant_name: string;
  applicant_email: string;
  applicant_profile_picture?: string | null;
  applicant_profile_picture_id?: string | null;
  applicant_role?: string;
  applicant_bio?: string | null;
};

/* ─────────────────────────────────────────────
   THEME TOKENS
───────────────────────────────────────────── */
const buildTokens = (dark: boolean) => ({
  bg: dark ? "#111110" : "#F7F4EF",
  surface: dark ? "#1a1a18" : "#ffffff",
  surfaceAlt: dark ? "#141413" : "#faf8f5",
  border: dark ? "#2a2a28" : "#e8e4dc",
  borderLight: dark ? "#222220" : "#f0ece5",
  text: dark ? "#f0ede8" : "#1a1a1a",
  muted: dark ? "#888" : "#666",
  faint: dark ? "#555" : "#aaa",
  headerBg: dark ? "#0d0d0c" : "#1a1a1a",
  gold: "#d4a017",
  goldLight: "#e8c350",
  cardBg: dark ? "#1a1a18" : "#ffffff",
  cardBorder: dark ? "#2a2a28" : "#e8e4dc",
  inputBg: dark ? "#141413" : "#faf8f5",
  emerald: "#10b981",
  emeraldBg: dark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)",
  emeraldBorder: "rgba(16,185,129,0.3)",
  rose: "#f43f5e",
  roseBg: dark ? "rgba(244,63,94,0.12)" : "rgba(244,63,94,0.08)",
  roseBorder: "rgba(244,63,94,0.3)",
  amber: "#f59e0b",
  amberBg: dark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)",
  amberBorder: "rgba(245,158,11,0.3)",
});

type T = ReturnType<typeof buildTokens>;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function timeAgo(date: string): string {
  const diffDays = Math.floor(
    (Date.now() - new Date(date).getTime()) / 86_400_000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

const statusConfig = (
  t: T,
): Record<
  ApplicationStatus,
  { bg: string; color: string; border: string; label: string }
> => ({
  Submitted: {
    bg: t.amberBg,
    color: t.amber,
    border: t.amberBorder,
    label: "Submitted",
  },
  Hired: {
    bg: t.emeraldBg,
    color: t.emerald,
    border: t.emeraldBorder,
    label: "Hired",
  },
  Rejected: {
    bg: t.roseBg,
    color: t.rose,
    border: t.roseBorder,
    label: "Rejected",
  },
});

/* ─────────────────────────────────────────────
   AVATAR INITIALS
───────────────────────────────────────────── */
const Avatar = ({ name, img, t }: { name: string; img?: string | null; t: T }) => {
  const safeName = (name || "").trim();

  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        overflow: "hidden",
        flexShrink: 0,
        border: `1.5px solid ${t.border}`,
        background: t.surfaceAlt,
      }}
    >
      <img
        src={img || "/userimg.jpg"}
        alt={safeName}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/userimg.jpg";
        }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   STATUS SELECT
───────────────────────────────────────────── */
const StatusSelect = ({
  appId,
  current,
  onUpdate,
  loading,
  t,
}: {
  appId: number;
  current: ApplicationStatus;
  onUpdate: (id: number, s: ApplicationStatus) => void;
  loading: boolean;
  t: T;
}) => {
  const [open, setOpen] = useState(false);
  const cfg = statusConfig(t);
  const c = cfg[current];

  return (
    <div style={{ position: "relative" }}>
      <button
        disabled={loading}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "6px 12px 6px 10px",
          borderRadius: 99,
          border: `1.5px solid ${c.border}`,
          background: c.bg,
          color: c.color,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          opacity: loading ? 0.6 : 1,
          letterSpacing: "0.03em",
        }}
      >
        {current === "Hired" && <CheckCircle2 size={12} />}
        {current === "Rejected" && <XCircle size={12} />}
        {current === "Submitted" && <Clock size={12} />}
        {c.label}
        <ChevronDown
          size={11}
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 10 }}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              zIndex: 20,
              background: t.surface,
              border: `1.5px solid ${t.border}`,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
              minWidth: 140,
            }}
          >
            {(["Submitted", "Hired", "Rejected"] as ApplicationStatus[]).map(
              (s) => {
                const sc = cfg[s];
                const isActive = s === current;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      onUpdate(appId, s);
                      setOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: "10px 14px",
                      background: isActive ? sc.bg : "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: isActive ? sc.color : t.muted,
                      transition: "background 0.15s",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.background = t.surfaceAlt;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {s === "Hired" && (
                      <CheckCircle2
                        size={13}
                        color={isActive ? sc.color : t.faint}
                      />
                    )}
                    {s === "Rejected" && (
                      <XCircle
                        size={13}
                        color={isActive ? sc.color : t.faint}
                      />
                    )}
                    {s === "Submitted" && (
                      <Clock size={13} color={isActive ? sc.color : t.faint} />
                    )}
                    {s}
                  </button>
                );
              },
            )}
          </div>
        </>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
const Skeleton = ({ dark }: { dark: boolean }) => {
  const t = buildTokens(dark);
  const shimmer: React.CSSProperties = {
    backgroundImage: dark
      ? "linear-gradient(90deg,#252523 25%,#2e2e2b 50%,#252523 75%)"
      : "linear-gradient(90deg,#f0ece5 25%,#e8e4dc 50%,#f0ece5 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: 8,
  };
  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        minHeight: "100vh",
        background: t.bg,
      }}
    >
      <div style={{ background: t.headerBg, padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{ ...shimmer, height: 11, width: 140, marginBottom: 18 }}
          />
          <div
            style={{ ...shimmer, height: 40, width: "45%", marginBottom: 12 }}
          />
          <div style={{ ...shimmer, height: 14, width: "25%" }} />
        </div>
      </div>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "36px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 18,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div
                style={{ ...shimmer, width: 48, height: 48, borderRadius: 12 }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    ...shimmer,
                    height: 18,
                    width: "40%",
                    marginBottom: 8,
                  }}
                />
                <div style={{ ...shimmer, height: 12, width: "60%" }} />
              </div>
              <div
                style={{ ...shimmer, height: 28, width: 90, borderRadius: 99 }}
              />
            </div>
            <div
              style={{ ...shimmer, height: 1, width: "100%", borderRadius: 0 }}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ ...shimmer, height: 12, width: 180 }} />
              <div style={{ ...shimmer, height: 12, width: 120 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   APPLICATION CARD
───────────────────────────────────────────── */
const AppCard = ({
  app,
  t,
  onUpdate,
  btnLoading,
  index,
}: {
  app: Application;
  t: T;
  onUpdate: (id: number, s: ApplicationStatus) => void;
  btnLoading: number | null;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: t.cardBg,
        border: `1px solid ${hovered ? "rgba(212,160,23,0.35)" : t.cardBorder}`,
        borderRadius: 18,
        padding: "22px 24px",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.1)" : "none",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "all 0.28s cubic-bezier(0.2,0,0,1)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "relative",
        overflow: "hidden",
        opacity: 0,
        animation: `fadeUp 0.5s ease ${index * 0.07}s both`,
      }}
    >
      {/* Gold accent top line on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 2,
          background:
            "linear-gradient(90deg, transparent, #d4a017, transparent)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* ── Header row ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <Avatar
          name={app.applicant_name}
          img={app.applicant_profile_picture}
          t={t}
        />

        <div style={{ flex: 1, minWidth: 160 }}>
          <h3
            style={{
              margin: "0 0 4px",
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              fontWeight: 400,
              color: t.text,
              letterSpacing: "-0.01em",
            }}
          >
            {app.applicant_name}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <a
              href={`mailto:${app.applicant_email}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                color: t.muted,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = t.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = t.muted)}
            >
              <Mail size={12} /> {app.applicant_email}
            </a>
            {/* phone display left as is, as phone is not in new type, but keep in case */}
            {"phone" in app && app.phone && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  color: t.muted,
                }}
              >
                <Phone size={12} /> {app.phone}
              </span>
            )}
          </div>
        </div>

        {/* Status select */}
        <StatusSelect
          appId={app.application_id}
          current={app.status}
          onUpdate={onUpdate}
          loading={btnLoading === app.application_id}
          t={t}
        />
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: t.borderLight }} />

      {/* ── Meta row ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            color: t.muted,
          }}
        >
          <Calendar size={12} color={t.gold} />
          Applied {timeAgo(app.applied_at)} ·{" "}
          {new Date(app.applied_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
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
          Applicant #{app.application_id}
        </span>
      </div>
      {app.applicant_bio && (
        <div
          style={{
            fontSize: 12,
            color: t.muted,
            marginTop: 4,
            lineHeight: 1.5,
            maxWidth: 520,
          }}
        >
          {app.applicant_bio}
        </div>
      )}

      {/* ── Resume and Candidate links ── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {app.resume && (
          <a
            href={app.resume}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              width: "fit-content",
              padding: "8px 16px",
              borderRadius: 10,
              border: `1.5px solid rgba(212,160,23,0.3)`,
              background: "rgba(212,160,23,0.06)",
              color: t.gold,
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 700,
              transition: "all 0.2s",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(212,160,23,0.12)";
              e.currentTarget.style.borderColor = "rgba(212,160,23,0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(212,160,23,0.06)";
              e.currentTarget.style.borderColor = "rgba(212,160,23,0.3)";
            }}
          >
            <FileText size={13} /> View Resume <ExternalLink size={11} />
          </a>
        )}

        <a
          href={`/account/${app?.applicant_id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            width: "fit-content",
            padding: "8px 16px",
            borderRadius: 10,
            border: `1.5px solid ${t.border}`,
            background: t.surfaceAlt,
            color: t.text,
            textDecoration: "none",
            fontSize: 12,
            fontWeight: 700,
            transition: "all 0.2s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = t.gold;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = t.border;
          }}
        >
          <Users size={13} /> View Candidate
        </a>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const ApplicationsPage = () => {
  const params = useParams();
  // Support both /jobs/9/applications and /applications/9
  const id = params?.id ?? params?.jobId;

  const token = Cookies.get("token");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";
  const t = buildTokens(dark);

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (id) fetchApplications();
  }, [id]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${Job_Service}/api/job/getAllApplications/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setApplications(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load applications",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (
    applicationId: number,
    status: ApplicationStatus,
  ) => {
    try {
      setBtnLoading(applicationId);
      await axios.put(
        `${Job_Service}/api/job/updateApplication/${applicationId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      toast.success(`Marked as ${status}`);
      setApplications((prev) =>
        prev.map((a) =>
          a.application_id === applicationId ? { ...a, status } : a,
        ),
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update");
    } finally {
      setBtnLoading(null);
    }
  };

  if (!mounted || loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
          @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        `}</style>
        <Skeleton dark={dark} />
      </>
    );
  }

  /* ── Stats ── */
  const total = applications.length;
  const hired = applications.filter((a) => a.status === "Hired").length;
  const rejected = applications.filter((a) => a.status === "Rejected").length;
  const pending = applications.filter((a) => a.status === "Submitted").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.35} }
        * { box-sizing: border-box; }
      `}</style>

      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          minHeight: "100vh",
          background: t.bg,
          color: t.text,
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
                "radial-gradient(ellipse 60% 80% at 70% 50%, rgba(212,160,23,0.1) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 15% 80%, rgba(16,185,129,0.07) 0%, transparent 60%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "8%",
              top: "10%",
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: "1.5px solid rgba(212,160,23,0.1)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: "52px 24px 44px",
              position: "relative",
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
                marginBottom: 16,
                animation: "fadeUp 0.4s ease both",
              }}
            >
              <Users size={12} /> Job Applications
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
                animation: "fadeUp 0.4s ease 0.08s both",
              }}
            >
              Candidate{" "}
              <em style={{ fontStyle: "italic", color: t.gold }}>
                Applications
              </em>
            </h1>

            <p
              style={{
                fontSize: 14,
                fontWeight: 300,
                color: "rgba(240,237,232,0.5)",
                margin: "0 0 28px",
                lineHeight: 1.6,
                animation: "fadeUp 0.4s ease 0.14s both",
              }}
            >
              Job ID #{id} · Review and manage all candidates for this role
            </p>

            {/* Stats pills */}
            {total > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  animation: "fadeUp 0.4s ease 0.2s both",
                }}
              >
                {[
                  {
                    label: `${total} Total`,
                    bg: "rgba(255,255,255,0.06)",
                    color: "rgba(240,237,232,0.7)",
                    border: "rgba(255,255,255,0.1)",
                  },
                  {
                    label: `${pending} Pending`,
                    bg: t.amberBg,
                    color: t.amber,
                    border: t.amberBorder,
                  },
                  {
                    label: `${hired} Hired`,
                    bg: t.emeraldBg,
                    color: t.emerald,
                    border: t.emeraldBorder,
                  },
                  {
                    label: `${rejected} Rejected`,
                    bg: t.roseBg,
                    color: t.rose,
                    border: t.roseBorder,
                  },
                ].map(({ label, bg, color, border }) => (
                  <span
                    key={label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "5px 14px",
                      borderRadius: 99,
                      background: bg,
                      border: `1px solid ${border}`,
                      fontSize: 12,
                      fontWeight: 700,
                      color,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* ── CONTENT ── */}
        <main
          style={{ maxWidth: 900, margin: "0 auto", padding: "36px 24px 72px" }}
        >
          {applications.length === 0 ? (
            /* Empty state */
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
                background: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
                borderRadius: 20,
                animation: "fadeUp 0.5s ease both",
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
                <Users size={34} color={t.gold} />
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
                No applications yet
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: t.muted,
                  margin: 0,
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                Once candidates apply for this role, they'll appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {applications.map((app, i) => (
                <AppCard
                  key={app.application_id}
                  app={app}
                  t={t}
                  onUpdate={updateApplicationStatus}
                  btnLoading={btnLoading}
                  index={i}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ApplicationsPage;
