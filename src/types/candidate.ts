export interface WorkExperience {
  company: string;
  roleName: string;
}

export interface EducationDegree {
  degree: string;
  subject: string;
  school: string;
  gpa: string;
  startDate: string;
  endDate: string;
  originalSchool: string;
  isTop50: boolean;
}

export interface Education {
  highest_level: string;
  degrees: EducationDegree[];
}

export interface AnnualSalaryExpectation {
  "full-time": string;
  "part-time"?: string;
}

export interface Candidate {
  name: string;
  email: string;
  phone: string;
  location: string;
  submitted_at: string;
  work_availability: string[];
  annual_salary_expectation: AnnualSalaryExpectation;
  work_experiences: WorkExperience[];
  education: Education;
  skills: string[];
}

export interface HiringTeam {
  candidates: Candidate[];
  reasoning: string;
  diversityMetrics: {
    skillDiversity: number;
    experienceDiversity: number;
    locationDiversity: number;
    educationDiversity: number;
  };
}
