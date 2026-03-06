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

export const Utils_Service= "http://localhost:5002"