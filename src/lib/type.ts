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

export const Utils_Service = "http://localhost:5002";
