"use client";
import { Job_Service, useAppData } from "@/context/AppContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/ui/Loading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Building2,
  Eye,
  FileText,
  Globe,
  Image,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Company as CompanyType } from "@/lib/type";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

const Company = () => {
  const { loading } = useAppData();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dark = mounted && resolvedTheme === "dark";

  const addRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const openDialog = () => {
    setOpen(true);
  };

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoverCta, setHoverCta] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCompanyId, setDeleteCompanyId] = useState<string | null>(null);

  const clearData = () => {
    setName("");
    setDescription("");
    setWebsite("");
    setLogo(null);
  };

  const token = Cookies.get("token");
  const [companyLoading, setCompanyLoading] = useState(true);

  async function fetchCompanies() {
    try {
      const { data } = await axios.get(
        `${Job_Service}/api/job/getCompany/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCompanies(data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setCompanyLoading(false);
    }
  }

  async function addCompanyHandler() {
    if (!name || !description || !website || !logo) {
      toast.error("Please provide all details");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("website", website);
    formData.append("file", logo);

    try {
      setBtnLoading(true);
      const { data } = await axios.post(
        `${Job_Service}/api/job/createCompany`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(data.message);
      fetchCompanies();
      clearData();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setBtnLoading(false);
    }
  }

  async function deleteCompany(id: string) {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(
        `${Job_Service}/api/job/deleteCompany/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(data.message);
      fetchCompanies();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setBtnLoading(false);
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Theme colors
  const T: Record<string, string> = {
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
    cardBg: dark ? "#1a1a18" : "#ffffff",
    cardBorder: dark ? "#2a2a28" : "#e8e4dc",
    headerBg: dark ? "#0d0d0c" : "#1a1a1a",
    divider: dark ? "#222220" : "#f0ece5",
  };

  if (loading || !mounted) return <Loading />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        * { box-sizing: border-box; }
      `}</style>

      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: T.bg,
          minHeight: "100vh",
          transition: "background 0.3s, color 0.3s",
        }}
      >
        {/* Hero Header */}
        <header
          style={{
            background: T.headerBg,
            padding: "64px 24px 56px",
            position: "relative",
            overflow: "hidden",
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          {/* Background gradient effects */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 60% 80% at 70% 50%, rgba(212,160,23,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(59,130,246,0.08) 0%, transparent 60%)",
            }}
          />

          {/* Floating decorative ring */}
          <div
            style={{
              position: "absolute",
              right: "10%",
              top: "20%",
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: "1.5px solid rgba(212,160,23,0.15)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 24,
              }}
            >
              <div style={{ flex: 1, minWidth: 280 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    background: "rgba(212,160,23,0.12)",
                    border: "1px solid rgba(212,160,23,0.25)",
                    borderRadius: 100,
                    padding: "6px 16px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#d4a017",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    marginBottom: 16,
                    animation: "fadeUp 0.5s ease both",
                  }}
                >
                  <Building2 size={14} />
                  Company Management
                </div>
                <h1
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                    fontWeight: 400,
                    color: "#f0ede8",
                    margin: "0 0 12px",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.1,
                    animation: "fadeUp 0.5s ease 0.1s both",
                  }}
                >
                  Your{" "}
                  <em style={{ fontStyle: "italic", color: "#d4a017" }}>
                    Companies
                  </em>
                </h1>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 300,
                    color: "rgba(240,237,232,0.55)",
                    margin: 0,
                    lineHeight: 1.6,
                    animation: "fadeUp 0.5s ease 0.2s both",
                  }}
                >
                  Manage your registered companies and start posting
                  opportunities
                </p>
              </div>

              {companies.length < 3 && (
                <div style={{ animation: "fadeUp 0.5s ease 0.3s both" }}>
                  <button
                    onClick={openDialog}
                    onMouseEnter={() => setHoverCta(true)}
                    onMouseLeave={() => setHoverCta(false)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      height: 50,
                      padding: "0 28px",
                      background: hoverCta ? "#e8c350" : "#d4a017",
                      color: "#1a1a1a",
                      border: "none",
                      borderRadius: 12,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.25s",
                      letterSpacing: "0.03em",
                      transform: hoverCta ? "translateY(-2px)" : "none",
                      boxShadow: hoverCta
                        ? "0 12px 32px rgba(212,160,23,0.35)"
                        : "0 4px 16px rgba(212,160,23,0.2)",
                    }}
                  >
                    <Plus size={18} />
                    Add Company
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Stats bar */}
        <div
          style={{
            background: T.surface,
            borderBottom: `1px solid ${T.border}`,
            padding: "24px",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                padding: "20px",
                textAlign: "center" as const,
                borderRight: `1px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                  fontWeight: 400,
                  color: T.gold,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {companies.length}
                <span style={{ fontSize: "0.6em", opacity: 0.7 }}>/3</span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: T.muted,
                  fontWeight: 600,
                  marginTop: 6,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase" as const,
                }}
              >
                Active Companies
              </div>
            </div>

            <div
              style={{
                padding: "20px",
                textAlign: "center" as const,
                borderRight: `1px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                  fontWeight: 400,
                  color: T.gold,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {3 - companies.length}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: T.muted,
                  fontWeight: 600,
                  marginTop: 6,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase" as const,
                }}
              >
                Slots Available
              </div>
            </div>

            <div
              style={{
                padding: "20px",
                textAlign: "center" as const,
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                  fontWeight: 400,
                  color: companies.length > 0 ? "#10b981" : T.muted,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {companies.length > 0 ? (
                  <CheckCircle2 size={32} style={{ display: "inline" }} />
                ) : (
                  <AlertCircle size={32} style={{ display: "inline" }} />
                )}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: T.muted,
                  fontWeight: 600,
                  marginTop: 6,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase" as const,
                }}
              >
                {companies.length > 0 ? "Ready to Post" : "Get Started"}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: "56px 24px", maxWidth: 1100, margin: "0 auto" }}>
          {companyLoading ? (
            <div style={{ textAlign: "center" as const, padding: "80px 0" }}>
              <Loading />
            </div>
          ) : companies.length > 0 ? (
            <div style={{ display: "grid", gap: 20 }}>
              {companies.map((c, index) => (
                <div
                  key={c.company_id}
                  onMouseEnter={() => setHoveredCard(c.company_id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    padding: 28,
                    background: T.cardBg,
                    border: `1px solid ${
                      hoveredCard === c.company_id
                        ? "rgba(212,160,23,0.4)"
                        : T.cardBorder
                    }`,
                    borderRadius: 18,
                    transition: "all 0.3s cubic-bezier(0.2,0,0,1)",
                    transform:
                      hoveredCard === c.company_id
                        ? "translateY(-4px)"
                        : "none",
                    boxShadow:
                      hoveredCard === c.company_id
                        ? dark
                          ? "0 20px 50px rgba(0,0,0,0.4)"
                          : "0 20px 50px rgba(0,0,0,0.08)"
                        : "none",
                    animation: `fadeUp 0.6s ease ${index * 0.1}s both`,
                    position: "relative" as const,
                    overflow: "hidden",
                    flexWrap: "wrap" as const,
                  }}
                >
                  {/* Top accent line */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "20%",
                      right: "20%",
                      height: 2,
                      background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
                      opacity: hoveredCard === c.company_id ? 1 : 0,
                      transition: "opacity 0.3s",
                    }}
                  />

                  {/* Logo */}
                  <div
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: 16,
                      border: `2px solid ${
                        hoveredCard === c.company_id
                          ? "rgba(212,160,23,0.3)"
                          : T.border
                      }`,
                      overflow: "hidden",
                      flexShrink: 0,
                      background: dark ? "#252523" : "#f5f2ed",
                      transition: "all 0.3s",
                      transform:
                        hoveredCard === c.company_id ? "scale(1.05)" : "none",
                    }}
                  >
                    <img
                      src={c.logo}
                      alt={c.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover" as const,
                      }}
                    />
                  </div>

                  {/* Company Info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h3
                      style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: "clamp(1.3rem, 2vw, 1.6rem)",
                        fontWeight: 400,
                        color: T.text,
                        margin: "0 0 8px",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {c.name}
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        color: T.muted,
                        lineHeight: 1.6,
                        margin: "0 0 12px",
                        fontWeight: 300,
                      }}
                    >
                      {c.description}
                    </p>
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        color: "#3b82f6",
                        textDecoration: "none",
                        fontWeight: 500,
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#2563eb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#3b82f6")
                      }
                    >
                      <Globe size={14} />
                      <span
                        style={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap" as const,
                        }}
                      >
                        {c.website}
                      </span>
                    </a>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flexShrink: 0,
                    }}
                  >
                    <Link href={`/company/${c.company_id}`}>
                      <button
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 10,
                          border: `1.5px solid ${T.border}`,
                          background: "transparent",
                          color: T.text,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#3b82f6";
                          e.currentTarget.style.background =
                            "rgba(59,130,246,0.1)";
                          e.currentTarget.style.color = "#3b82f6";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = T.border;
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = T.text;
                        }}
                      >
                        <Eye size={18} />
                      </button>
                    </Link>

                    <button
                      onClick={() => {
                        setDeleteCompanyId(c.company_id);
                        setDeleteDialogOpen(true);
                      }}
                      disabled={btnLoading}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        border: "1.5px solid rgba(239,68,68,0.3)",
                        background: "transparent",
                        color: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: btnLoading ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                        opacity: btnLoading ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!btnLoading) {
                          e.currentTarget.style.borderColor = "#ef4444";
                          e.currentTarget.style.background =
                            "rgba(239,68,68,0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(239,68,68,0.3)";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center" as const,
                padding: "80px 24px",
                background: T.cardBg,
                border: `1px solid ${T.cardBorder}`,
                borderRadius: 20,
                animation: "fadeUp 0.6s ease both",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: dark
                    ? "rgba(212,160,23,0.1)"
                    : "rgba(212,160,23,0.08)",
                  border: `2px solid rgba(212,160,23,0.2)`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                <Building2 size={36} color={T.gold} />
              </div>

              <h3
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                  fontWeight: 400,
                  color: T.text,
                  margin: "0 0 12px",
                  letterSpacing: "-0.02em",
                }}
              >
                No companies registered yet
              </h3>

              <p
                style={{
                  fontSize: 15,
                  color: T.muted,
                  margin: "0 0 32px",
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                Add your first company to start posting jobs and connecting with
                talent
              </p>

              <button
                onClick={openDialog}
                onMouseEnter={() => setHoverCta(true)}
                onMouseLeave={() => setHoverCta(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  height: 50,
                  padding: "0 28px",
                  background: hoverCta ? "#e8c350" : "#d4a017",
                  color: "#1a1a1a",
                  border: "none",
                  borderRadius: 12,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.25s",
                  letterSpacing: "0.03em",
                  transform: hoverCta ? "translateY(-2px)" : "none",
                  boxShadow: hoverCta
                    ? "0 12px 32px rgba(212,160,23,0.35)"
                    : "0 4px 16px rgba(212,160,23,0.2)",
                }}
              >
                <Plus size={18} />
                Add Your First Company
              </button>
            </div>
          )}
        </div>

        {/* Add company dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="hidden" ref={addRef}></Button>
          </DialogTrigger>

          <DialogContent
            className="sm:max-w-125"
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 20,
              padding: 0,
              overflow: "hidden",
            }}
          >
            {/* Dialog Header with accent */}
            <div
              style={{
                background: T.headerBg,
                padding: "28px 32px",
                borderBottom: `1px solid ${T.border}`,
                position: "relative" as const,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "20%",
                  right: "20%",
                  height: 3,
                  background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
                }}
              />
              <DialogHeader>
                <DialogTitle
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                    fontWeight: 400,
                    color: "#f0ede8",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    letterSpacing: "-0.02em",
                  }}
                >
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
                    <Building2 size={20} color="#d4a017" />
                  </div>
                  Add New Company
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="pl-10 pr-10 pb-5">
              <div style={{ display: "grid", gap: 24 }}>
                {/* Company Name */}
                <div>
                  <Label
                    htmlFor="name"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.text,
                      marginBottom: 10,
                      letterSpacing: "0.02em",
                    }}
                  >
                    <Briefcase size={16} color={T.gold} />
                    Company Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Acme Corporation"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      height: 48,
                      borderRadius: 10,
                      border: `1.5px solid ${T.border}`,
                      background: T.surfaceAlt,
                      color: T.text,
                      fontSize: 14,
                      padding: "0 16px",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = T.gold;
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(212,160,23,0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = T.border;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Description */}
                <div>
                  <Label
                    htmlFor="description"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.text,
                      marginBottom: 10,
                      letterSpacing: "0.02em",
                    }}
                  >
                    <FileText size={16} color={T.gold} />
                    Description
                  </Label>
                  <Input
                    id="description"
                    type="text"
                    placeholder="Brief description of your company"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      height: 48,
                      borderRadius: 10,
                      border: `1.5px solid ${T.border}`,
                      background: T.surfaceAlt,
                      color: T.text,
                      fontSize: 14,
                      padding: "0 16px",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = T.gold;
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(212,160,23,0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = T.border;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Website */}
                <div>
                  <Label
                    htmlFor="website"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.text,
                      marginBottom: 10,
                      letterSpacing: "0.02em",
                    }}
                  >
                    <Globe size={16} color={T.gold} />
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="text"
                    placeholder="https://yourcompany.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    style={{
                      height: 48,
                      borderRadius: 10,
                      border: `1.5px solid ${T.border}`,
                      background: T.surfaceAlt,
                      color: T.text,
                      fontSize: 14,
                      padding: "0 16px",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = T.gold;
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(212,160,23,0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = T.border;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <Label
                    htmlFor="logo"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.text,
                      marginBottom: 10,
                      letterSpacing: "0.02em",
                    }}
                  >
                    <Image size={16} color={T.gold} />
                    Company Logo
                  </Label>
                  <div
                    style={{
                      position: "relative" as const,
                      border: `2px dashed ${T.border}`,
                      borderRadius: 10,
                      padding: 5,
                      textAlign: "center" as const,
                      background: T.surfaceAlt,
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = T.gold;
                      e.currentTarget.style.background = dark
                        ? "rgba(212,160,23,0.05)"
                        : "rgba(212,160,23,0.03)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = T.border;
                      e.currentTarget.style.background = T.surfaceAlt;
                    }}
                  >
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLogo(e.target.files?.[0] || null)
                      }
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0,
                        cursor: "pointer",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column" as const,
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 10,
                          background: dark
                            ? "rgba(212,160,23,0.1)"
                            : "rgba(212,160,23,0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image size={24} color={T.gold} />
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 13,
                            color: T.text,
                            fontWeight: 600,
                            margin: "0 0 4px",
                          }}
                        >
                          {logo ? logo.name : "Click to upload logo"}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: T.muted,
                            margin: 0,
                          }}
                        >
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter style={{ marginTop: 32 }}>
                <button
                  onClick={addCompanyHandler}
                  disabled={btnLoading}
                  style={{
                    width: "100%",
                    height: 52,
                    background: btnLoading ? T.muted : T.gold,
                    color: "#1a1a1a",
                    border: "none",
                    borderRadius: 12,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: btnLoading ? "not-allowed" : "pointer",
                    transition: "all 0.25s",
                    letterSpacing: "0.03em",
                    opacity: btnLoading ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!btnLoading) {
                      e.currentTarget.style.background = "#e8c350";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(212,160,23,0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = T.gold;
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {btnLoading ? "Adding Company..." : "Add Company"}
                </button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
            }}
          >
            <DialogHeader>
              <DialogTitle
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1.4rem",
                  color: T.text,
                }}
              >
                Delete Company
              </DialogTitle>
            </DialogHeader>

            <p style={{ color: T.muted, fontSize: 14 }}>
              Are you sure you want to delete this company? This action cannot be undone.
            </p>

            <DialogFooter style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <button
                onClick={() => setDeleteDialogOpen(false)}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  background: "transparent",
                  color: T.text,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (deleteCompanyId) {
                    deleteCompany(deleteCompanyId);
                  }
                  setDeleteDialogOpen(false);
                  setDeleteCompanyId(null);
                }}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 10,
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Delete
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Company;