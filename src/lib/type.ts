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
}

export interface AppProviderProps {
  children: ReactNode;
}

export interface AccountProps {
  user: User;
  isYourAccount: boolean;
}
