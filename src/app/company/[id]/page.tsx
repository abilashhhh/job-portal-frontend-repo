"use client";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Job_Service, useAppData } from "@/context/AppContext";
import { Company, Job } from "@/lib/type";
import axios from "axios";
import Loading from "@/components/ui/Loading";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
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
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   Tiny reusable labelled input / textarea
───────────────────────────────────────────────────────────────────────────── */
const Field = ({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  type?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
      {label}
    </label>
    {multiline ? (
      <textarea
        rows={3}
        className="border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input
        type={type}
        className="border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Job type & work-location badge colours
───────────────────────────────────────────────────────────────────────────── */
const jobTypeBadge: Record<string, string> = {
  "Full-time": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Part-time": "bg-amber-100 text-amber-700 border-amber-200",
  Contract: "bg-violet-100 text-violet-700 border-violet-200",
  Internship: "bg-sky-100 text-sky-700 border-sky-200",
};

const workLocationBadge: Record<string, string> = {
  "On-site": "bg-orange-100 text-orange-700 border-orange-200",
  Remote: "bg-teal-100 text-teal-700 border-teal-200",
  Hybrid: "bg-pink-100 text-pink-700 border-pink-200",
};

/* ─────────────────────────────────────────────────────────────────────────────
   Job Form fields (shared between Add & Edit dialogs)
───────────────────────────────────────────────────────────────────────────── */
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
}: any) => (
  <div className="grid gap-4">
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <Field
          label="Job Title"
          placeholder="e.g. Senior Frontend Engineer"
          value={title}
          onChange={setTitle}
        />
      </div>
      <Field
        label="Role / Department"
        placeholder="e.g. Engineering"
        value={role}
        onChange={setRole}
      />
      <Field
        label="Location"
        placeholder="e.g. Bangalore, India"
        value={location}
        onChange={setLocation}
      />
      <Field
        label="Salary (₹ / year)"
        placeholder="e.g. 1200000"
        type="number"
        value={salary}
        onChange={setSalary}
      />
      <Field
        label="Openings"
        placeholder="e.g. 3"
        type="number"
        value={openings}
        onChange={setOpenings}
      />
    </div>

    <Field
      label="Description"
      placeholder="Describe the role, responsibilities and requirements…"
      value={description}
      onChange={setDescription}
      multiline
    />

    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Job Type
        </label>
        <Select value={jobType} onValueChange={setJobType}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {["Full-time", "Part-time", "Contract", "Internship"].map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Work Location
        </label>
        <Select value={workLocation} onValueChange={setWorkLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            {["On-site", "Remote", "Hybrid"].map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    {showActiveToggle && (
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? "bg-primary" : "bg-muted"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
        <span className="text-sm font-medium">
          {isActive ? "Active" : "Inactive"}
        </span>
        {isActive ? (
          <CheckCircle2 size={14} className="text-emerald-500" />
        ) : (
          <XCircle size={14} className="text-rose-500" />
        )}
      </div>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────────────────────── */
const CompanyPage = () => {
  const { id } = useParams();
  const token = Cookies.get("token");
  const { user } = useAppData();

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdatedModalOpen, setIsUpdatedModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [openings, setOpenings] = useState("");
  const [jobType, setJobType] = useState<
    "Full-time" | "Part-time" | "Contract" | "Internship" | ""
  >("");
  const [workLocation, setWorkLocation] = useState<
    "On-site" | "Remote" | "Hybrid" | ""
  >("");
  const [isActive, setIsActive] = useState(true);

  const isRecruiterOwner =
    user && company && user.user_id === company.recruiter_id;

  /* ── API calls ─────────────────────────────────────────────────────────── */
  const fetchCompany = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${Job_Service}/api/job/getCompany/${id}`,
      );
      setCompany(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load company");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

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

  const addJobHandler = async () => {
    try {
      setBtnLoading(true);
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
      setIsAddModalOpen(false);
      fetchCompany();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create job");
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteJobHandler = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(
        `${Job_Service}/api/job/deleteJob/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(data.message);
      fetchCompany();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    } finally {
      setBtnLoading(false);
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
      setIsUpdatedModalOpen(false);
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
    setIsUpdatedModalOpen(true);
  };

  /* ── Render ────────────────────────────────────────────────────────────── */
  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* ── Company Header ─────────────────────────────────────────────────── */}
      {company && (
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-6">
          <Card className="overflow-hidden rounded-3xl border border-border/50 shadow-xl bg-background">
            <div className="relative h-52 bg-linear-to-r from-indigo-600 via-blue-600 to-violet-600">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              <div className="absolute -bottom-12 left-8">
                <div className="w-28 h-28 rounded-2xl bg-white shadow-xl border-4 border-background overflow-hidden backdrop-blur">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="px-8 pt-16 pb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl font-bold tracking-tight">
                      {company.name}
                    </h1>

                    {(company.jobs?.length ?? 0) > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-2.5 py-1 rounded-full"
                      >
                        {company.jobs?.length ?? 0} open role
                        {(company.jobs?.length ?? 0) !== 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
                    {company.description}
                  </p>

                  <div className="flex flex-wrap gap-6 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Building2 size={14} className="text-primary" />
                      Company
                    </span>

                    {company.jobs && (
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={14} className="text-primary" />
                        {company.jobs.length} job
                        {company.jobs.length !== 1 ? "s" : ""} posted
                      </span>
                    )}
                  </div>
                </div>

                {company.website && (
                  <a
                    href={
                      company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow hover:scale-[1.02] hover:opacity-90 transition"
                  >
                    <Globe size={15} />
                    Visit Website
                    <ChevronRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── Jobs Section ───────────────────────────────────────────────────── */}
      {company && (
        <div className="max-w-5xl mx-auto px-4 pb-16">
          {/* Section header */}
          <div className="flex items-center justify-between mb-5 mt-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Briefcase size={18} className="text-primary" />
                Open Positions
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {company.jobs?.length
                  ? `${company.jobs.length} role${company.jobs.length > 1 ? "s" : ""} currently available`
                  : "No open roles right now"}
              </p>
            </div>

            {/* Add Job Dialog */}
            {isRecruiterOwner && (
              <Dialog
                open={isAddModalOpen}
                onOpenChange={(open) => {
                  setIsAddModalOpen(open);
                  if (!open) clearInput();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 rounded-xl shadow">
                    <Plus size={15} /> Post a Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg">
                      Post a New Job
                    </DialogTitle>
                  </DialogHeader>
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
                  />
                  <DialogFooter className="mt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddModalOpen(false);
                        clearInput();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={btnLoading}
                      onClick={addJobHandler}
                      className="min-w-25"
                    >
                      {btnLoading ? "Posting…" : "Post Job"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Job Cards */}
          {company.jobs?.length ? (
            <div className="grid md:grid-cols-2 gap-4">
              {company.jobs.map((job) => (
                <Card
                  key={job.job_id}
                  className="group p-5 rounded-2xl border border-border/60 hover:border-primary/40 hover:shadow-md transition-all duration-200 bg-background flex flex-col gap-4"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base leading-snug truncate">
                          {job.title}
                        </h3>
                        {/* Active indicator */}
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${job.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-500 border-rose-200"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${job.is_active ? "bg-emerald-500" : "bg-rose-400"}`}
                          />
                          {job.is_active ? "Active" : "Closed"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {job.role}
                      </p>
                    </div>

                    {isRecruiterOwner && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(job)}
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteJobHandler(job.job_id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {job.job_type && (
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${jobTypeBadge[job.job_type] ?? "bg-muted text-muted-foreground border-border"}`}
                      >
                        <Clock size={10} />
                        {job.job_type}
                      </span>
                    )}
                    {job.work_location && (
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${workLocationBadge[job.work_location] ?? "bg-muted text-muted-foreground border-border"}`}
                      >
                        <Wifi size={10} />
                        {job.work_location}
                      </span>
                    )}
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground border-t border-border/50 pt-3 mt-auto">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-primary/60" />
                        {job.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <DollarSign size={12} className="text-primary/60" />₹
                      {Number(job.salary).toLocaleString("en-IN")} / yr
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} className="text-primary/60" />
                      {job.openings} opening{job.openings > 1 ? "s" : ""}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Briefcase size={28} className="text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">No jobs posted yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                {isRecruiterOwner
                  ? "Post your first job opening to start receiving applications."
                  : "Check back later for new opportunities."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Edit Job Dialog ─────────────────────────────────────────────────── */}
      <Dialog
        open={isUpdatedModalOpen}
        onOpenChange={(open) => {
          setIsUpdatedModalOpen(open);
          if (!open) {
            setSelectedJob(null);
            clearInput();
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Edit Job Posting</DialogTitle>
          </DialogHeader>
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
          />
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdatedModalOpen(false);
                setSelectedJob(null);
                clearInput();
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={btnLoading}
              onClick={updateJobHandler}
              className="min-w-27.5"
            >
              {btnLoading ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyPage;
