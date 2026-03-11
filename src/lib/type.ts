import { ReactNode } from "react";

export interface JobOptions {
  title: string;
  responsibilites: string;
  why: string;
}

export interface SkillsToLearn {
  title: string;
  how: string;
  why: string;
}

export interface skillCategory {
  category: string;
  skills: SkillsToLearn[];
}

export interface LearningApproach {
  title: string;
  points: string[];
}

export interface CareerGuideResponse {
  summary: string;
  jobOptions: JobOptions[];
  skillsToLearn: skillCategory[];
  learningApproach: LearningApproach;
}

export interface ScoreBreakDown {
  formatting: { score: number; feedback: string };
  keywords: { score: number; feedback: string };
  structure: { score: number; feedback: string };
  readability: { score: number; feedback: string };
}

export interface Suggestion {
  category: string;
  issue: string;
  recommendation: string;
  priority: "high" | "medium" | "low";
}

export interface ResumeAnalysisResponse {
  atsScore: number;
  scoreBreakdown: ScoreBreakDown;
  suggestions: Suggestion[];
  strengths: string[];
  summary: string;
}
export interface User {
  user_id: number;
  email: string;
  name: string;
  phone_number: string;
  role: "recruiter" | "jobseeker";
  bio: string | null;
  profile_pic_public_id: string | null;
  profile_pic: string | null;
  resume: string | null;
  resume_public_id: string | null;
  skills: string[] | null;
  subscription: string | null;
}

export interface AppContextType {
  user: User | null;
  loading: boolean;
  btnLoading: boolean;
  isAuth: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  logOutUser: () => Promise<void>;
  updateProfilePic: (formData: any) => Promise<void>;
  updateResume: (formData: any) => Promise<void>;
  updateUser: (
    name: string,
    phone_number: number,
    bio: string,
  ) => Promise<void>;
  addSkill: (
    skill: string,
    setSkill: React.Dispatch<React.SetStateAction<string>>,
  ) => Promise<void>;
  deleteSkill: (skill: string) => Promise<void>;
}

export interface AppProviderProps {
  children: ReactNode;
}

export interface AccountProps {
  user: User;
  isYourAccount: boolean;
}

export interface Job {
  job_id: number;
  title: string;
  description: string;
  salary: number | null;
  location: string | null;
  job_type: "Full-time" | "Part-time" | "Contract" | "Internship";
  openings: number;
  role: string;
  work_location: "On-site" | "Remote" | "Hybrid";
  company_id: number;
  posted_by_recruiter_id: number;
  created_at: string;
  is_active: boolean;
}

export interface Company {
  company_id: string;
  name: string;
  description: string;
  website: string;
  logo: string;
  logo_public_id: string;
  recruiter_id: number;
  created_at: string;
  job?: Job[];
}

type ApplicationStatus = "Submitted" | "Rejeted" | "Hired";

export interface Application {
  application_id: number;
  job_id: number;
  applicant_id: number;
  applicant_email: string;
  status: ApplicationStatus;
  resume: string;
  applied_at: string;
  subscribed: boolean;
  job_title: string;
  job_salary: number;
  job_location: string;
}
