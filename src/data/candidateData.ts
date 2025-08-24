import type { Candidate } from '../types/candidate';

const FORM_SUBMISSIONS_URL = import.meta.env.DATA_URL;

export const fetchCandidates = async (): Promise<Candidate[]> => {
  try {
    const response = await fetch(FORM_SUBMISSIONS_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch candidates: ${response.status}`);
    }
    const data = await response.json();
    return data as Candidate[];
  } catch (error) {
    console.error('Error fetching candidates:', error);
    // Fallback to sample data if fetch fails
    return [];
  }
};

// For development/testing, we can also use a subset of the data
export const getSampleCandidates = (): Candidate[] => {
  return [
    {
      "name": "Clever Monkey",
      "email": "clever-monkey@example.com",
      "phone": "5582981474204",
      "location": "Maceió",
      "submitted_at": "2025-01-28 09:02:16.000000",
      "work_availability": ["full-time", "part-time"],
      "annual_salary_expectation": { "full-time": "$117548" },
      "work_experiences": [
        { "company": "StarLab Digital Ventures", "roleName": "Full Stack Developer" },
        { "company": "OrbitalLife", "roleName": "Project Manager" },
        { "company": "Carrot Hosting", "roleName": "Full Stack Developer" },
        { "company": "Bitbay Solutions", "roleName": "Full Stack Developer" },
        { "company": "Federal Institute of Science, Education & Technology - Alagoas", "roleName": "Project Manager" },
        { "company": "Usina Caeté", "roleName": "Scientist" },
        { "company": "Cyberia", "roleName": "System Administrator" }
      ],
      "education": {
        "highest_level": "Bachelor's Degree",
        "degrees": [
          {
            "degree": "Bachelor's Degree",
            "subject": "Computer Science",
            "school": "International Institutions",
            "gpa": "GPA 3.0-3.4",
            "startDate": "2023",
            "endDate": "2027",
            "originalSchool": "Faculdade Descomplica",
            "isTop50": false
          }
        ]
      },
      "skills": ["Data Analysis", "Docker", "Microservices"]
    },
    {
      "name": "Noble Flamingo",
      "email": "noble-flamingo@example.com",
      "phone": "12156688210",
      "location": "Philadelphia",
      "submitted_at": "2025-01-26 07:40:39.000000",
      "work_availability": ["full-time", "part-time"],
      "annual_salary_expectation": { "full-time": "$112253" },
      "work_experiences": [
        { "company": "Intellectual Asset Management Group", "roleName": "Managing Director" },
        { "company": "Raju LLP", "roleName": "Partner" },
        { "company": "Angeion Group", "roleName": "Legal Specialist" }
      ],
      "education": {
        "highest_level": "Juris Doctor (J.D)",
        "degrees": [
          {
            "degree": "Master's Degree",
            "subject": "Accounting",
            "school": "Top Schools",
            "gpa": "GPA 3.5-3.9",
            "startDate": "2005",
            "endDate": "2006",
            "originalSchool": "The Wharton School",
            "isTop50": true
          }
        ]
      },
      "skills": []
    },
    {
      "name": "Noble Antelope",
      "email": "noble-antelope@example.com",
      "phone": "8801993762548",
      "location": "Bangladesh",
      "submitted_at": "2025-01-28 07:29:47.000000",
      "work_availability": ["full-time", "part-time"],
      "annual_salary_expectation": { "full-time": "$63556" },
      "work_experiences": [
        { "company": "Red.Digital", "roleName": "Software Engineer" },
        { "company": "Robi-HRIS SaaS Product", "roleName": "Software Engineer" },
        { "company": "Dotlines", "roleName": "Software Engineer" },
        { "company": "BJIT Group", "roleName": "Software Engineer" }
      ],
      "education": {
        "highest_level": "Bachelor's Degree",
        "degrees": [
          {
            "degree": "Bachelor's Degree",
            "subject": "Computer Science",
            "school": "International Institutions",
            "gpa": "GPA 3.5-3.9",
            "startDate": "2016",
            "endDate": "2021",
            "originalSchool": "Chittagong University of Engineering & Technology",
            "isTop50": false
          }
        ]
      },
      "skills": ["Laravel", "Next JS", "React", "React Native", "Redux", "Angular"]
    },
    {
      "name": "Unique Platypus",
      "email": "unique-platypus@example.com",
      "phone": "55118120974",
      "location": "Brazil",
      "submitted_at": "2025-01-28 23:29:29.000000",
      "work_availability": ["full-time", "part-time"],
      "annual_salary_expectation": { "full-time": "$143487" },
      "work_experiences": [
        { "company": "Autônomo", "roleName": "Backend Engineer" },
        { "company": "CI&T", "roleName": "Software Engineer" },
        { "company": "CIOESTE", "roleName": "Project Manager" }
      ],
      "education": {
        "highest_level": "Bachelor's Degree",
        "degrees": [
          {
            "degree": "Bachelor's Degree",
            "subject": "Information Technology",
            "school": "International Institutions",
            "gpa": "GPA 3.0-3.4",
            "startDate": "2019",
            "endDate": "2022",
            "originalSchool": "FAM",
            "isTop50": false
          }
        ]
      },
      "skills": ["Amazon Web Services", "Python", "Flask", "Agile", "REST APIs"]
    },
    {
      "name": "Adorable",
      "email": "adorable-urchin@example.com",
      "phone": "5544499991181",
      "location": "Maringa",
      "submitted_at": "2025-01-28 10:22:18.000000",
      "work_availability": ["full-time", "part-time"],
      "annual_salary_expectation": { "full-time": "$127892" },
      "work_experiences": [
        { "company": "Nelogica", "roleName": "Data Scientist" },
        { "company": "Alltech", "roleName": "Data Scientist" },
        { "company": "RGK4IT", "roleName": "Data Analyst" },
        { "company": "SVN Investments", "roleName": "Financial Analyst" }
      ],
      "education": {
        "highest_level": "Master's Degree",
        "degrees": [
          {
            "degree": "Master's Degree",
            "subject": "Data Science",
            "school": "International Institutions",
            "gpa": "GPA 3.5-3.9",
            "startDate": "2021",
            "endDate": "2023",
            "originalSchool": "University of São Paulo",
            "isTop50": true
          }
        ]
      },
      "skills": ["NLP", "SQL", "Power BI", "Amazon Web Services", "Excel", "Azure", "Web Scraping", "Pandas", "Pytorch", "ETL", "Python", "R", "Tensorflow", "Google Cloud Platform", "Data Analysis", "Matplotlib", "Tableau"]
    }
  ];
};
