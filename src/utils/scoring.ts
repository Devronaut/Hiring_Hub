import type { Candidate } from '../types/candidate';

export interface CandidateScore {
  total: number;
  skills: number;
  experience: number;
  salary: number;
  education: number;
  breakdown: {
    skillsMatch: number;
    experienceYears: number;
    salaryCompetitive: number;
    educationLevel: number;
    topSchool: number;
  };
}

export const calculateCandidateScore = (
  candidate: Candidate, 
  requiredSkills: string[] = [], 
  targetSalary?: number
): CandidateScore => {
  let totalScore = 0;
  const breakdown = {
    skillsMatch: 0,
    experienceYears: 0,
    salaryCompetitive: 0,
    educationLevel: 0,
    topSchool: 0
  };

  // Skills Match (0-30 points)
  if (requiredSkills.length > 0) {
    const matchedSkills = candidate.skills.filter(skill => 
      requiredSkills.some(required => 
        skill.toLowerCase().includes(required.toLowerCase()) ||
        required.toLowerCase().includes(skill.toLowerCase())
      )
    );
    breakdown.skillsMatch = Math.min(30, (matchedSkills.length / requiredSkills.length) * 30);
  } else {
    // If no required skills, give points for having diverse skills
    breakdown.skillsMatch = Math.min(30, candidate.skills.length * 3);
  }
  totalScore += breakdown.skillsMatch;

  // Experience Years (0-25 points)
  const experienceYears = candidate.work_experiences.length;
  if (experienceYears >= 8) {
    breakdown.experienceYears = 25; // Senior level
  } else if (experienceYears >= 5) {
    breakdown.experienceYears = 20; // Mid-senior level
  } else if (experienceYears >= 3) {
    breakdown.experienceYears = 15; // Mid level
  } else if (experienceYears >= 1) {
    breakdown.experienceYears = 10; // Junior level
  } else {
    breakdown.experienceYears = 5; // Entry level
  }
  totalScore += breakdown.experienceYears;

  // Salary Competitiveness (0-20 points)
  if (candidate.annual_salary_expectation["full-time"]) {
    const salary = parseInt(candidate.annual_salary_expectation["full-time"].replace(/[^0-9]/g, ''));
    if (targetSalary) {
      // Score based on how close to target salary (closer = higher score)
      const salaryDiff = Math.abs(salary - targetSalary);
      const maxDiff = targetSalary * 0.5; // 50% tolerance
      breakdown.salaryCompetitive = Math.max(0, 20 - (salaryDiff / maxDiff) * 20);
    } else {
      // Score based on reasonable salary range
      if (salary >= 50000 && salary <= 150000) {
        breakdown.salaryCompetitive = 20; // Competitive range
      } else if (salary >= 30000 && salary <= 200000) {
        breakdown.salaryCompetitive = 15; // Acceptable range
      } else {
        breakdown.salaryCompetitive = 10; // Outside typical range
      }
    }
  } else {
    breakdown.salaryCompetitive = 10; // No salary info
  }
  totalScore += breakdown.salaryCompetitive;

  // Education Level (0-15 points)
  const educationLevel = candidate.education.highest_level;
  if (educationLevel.includes('PhD') || educationLevel.includes('Doctorate')) {
    breakdown.educationLevel = 15;
  } else if (educationLevel.includes('Master')) {
    breakdown.educationLevel = 12;
  } else if (educationLevel.includes('Bachelor')) {
    breakdown.educationLevel = 10;
  } else if (educationLevel.includes('Associate')) {
    breakdown.educationLevel = 8;
  } else {
    breakdown.educationLevel = 5;
  }
  totalScore += breakdown.educationLevel;

  // Top School Bonus (0-10 points)
  const topSchoolCount = candidate.education.degrees.filter(degree => degree.isTop50).length;
  breakdown.topSchool = Math.min(10, topSchoolCount * 5);
  totalScore += breakdown.topSchool;

  return {
    total: Math.round(totalScore),
    skills: Math.round(breakdown.skillsMatch),
    experience: Math.round(breakdown.experienceYears),
    salary: Math.round(breakdown.salaryCompetitive),
    education: Math.round(breakdown.educationLevel + breakdown.topSchool),
    breakdown
  };
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600 bg-green-100';
  if (score >= 60) return 'text-blue-600 bg-blue-100';
  if (score >= 40) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};

export const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
};

// New function for skill match percentage
export const calculateSkillMatchPercentage = (
  candidateSkills: string[], 
  requiredSkills: string[]
): { percentage: number; matchedSkills: string[]; missingSkills: string[]; extraSkills: string[] } => {
  if (requiredSkills.length === 0) {
    return { percentage: 100, matchedSkills: [], missingSkills: [], extraSkills: candidateSkills };
  }

  // Normalize skills for better matching (case-insensitive, trim whitespace)
  const normalizedCandidateSkills = candidateSkills.map(skill => skill.toLowerCase().trim());
  const normalizedRequiredSkills = requiredSkills.map(skill => skill.toLowerCase().trim());

  // Find matched skills
  const matchedSkills = normalizedRequiredSkills.filter(requiredSkill => 
    normalizedCandidateSkills.some(candidateSkill => 
      candidateSkill.includes(requiredSkill) || requiredSkill.includes(candidateSkill)
    )
  );

  // Find missing skills
  const missingSkills = normalizedRequiredSkills.filter(requiredSkill => 
    !matchedSkills.includes(requiredSkill)
  );

  // Find extra skills (candidate has but not required)
  const extraSkills = normalizedCandidateSkills.filter(candidateSkill => 
    !normalizedRequiredSkills.some(requiredSkill => 
      candidateSkill.includes(requiredSkill) || requiredSkill.includes(candidateSkill)
    )
  );

  // Calculate percentage
  const percentage = Math.round((matchedSkills.length / normalizedRequiredSkills.length) * 100);

  return {
    percentage,
    matchedSkills: matchedSkills.map(skill => 
      requiredSkills.find(original => original.toLowerCase().trim() === skill) || skill
    ),
    missingSkills: missingSkills.map(skill => 
      requiredSkills.find(original => original.toLowerCase().trim() === skill) || skill
    ),
    extraSkills: extraSkills.map(skill => 
      candidateSkills.find(original => original.toLowerCase().trim() === skill) || skill
    )
  };
};

// Function to get skill match color based on percentage
export const getSkillMatchColor = (percentage: number): string => {
  if (percentage >= 90) return 'text-green-600 bg-green-100';
  if (percentage >= 75) return 'text-blue-600 bg-blue-100';
  if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
  if (percentage >= 25) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};

// Function to get skill match label
export const getSkillMatchLabel = (percentage: number): string => {
  if (percentage >= 90) return 'Perfect Match';
  if (percentage >= 75) return 'Strong Match';
  if (percentage >= 50) return 'Good Match';
  if (percentage >= 25) return 'Partial Match';
  return 'Poor Match';
};

// Quick Actions / Smart Filters
export interface QuickActionResult {
  candidates: Candidate[];
  criteria: string;
  description: string;
  icon: string;
}

// Get top candidates by experience level
export const getTopByExperience = (candidates: Candidate[], count: number = 5): QuickActionResult => {
  const sorted = [...candidates].sort((a, b) => {
    const aExp = a.work_experiences.length;
    const bExp = b.work_experiences.length;
    return bExp - aExp; // Descending order
  });
  
  return {
    candidates: sorted.slice(0, count),
    criteria: 'Experience',
    description: `Top ${count} candidates with most work experience`,
    icon: '👔'
  };
};

// Get top candidates by salary fit (closest to target)
export const getTopBySalaryFit = (candidates: Candidate[], targetSalary: number, count: number = 5): QuickActionResult => {
  const withSalary = candidates.filter(c => c.annual_salary_expectation["full-time"]);
  
  const sorted = withSalary.sort((a, b) => {
    const aSalary = parseInt(a.annual_salary_expectation["full-time"].replace(/[^0-9]/g, ''));
    const bSalary = parseInt(b.annual_salary_expectation["full-time"].replace(/[^0-9]/g, ''));
    
    const aDiff = Math.abs(aSalary - targetSalary);
    const bDiff = Math.abs(bSalary - targetSalary);
    
    return aDiff - bDiff; // Closest to target first
  });
  
  return {
    candidates: sorted.slice(0, count),
    criteria: 'Salary Fit',
    description: `Top ${count} candidates with salary closest to $${targetSalary.toLocaleString()}`,
    icon: '💰'
  };
};

// Get top candidates by skill match
export const getTopBySkillMatch = (candidates: Candidate[], requiredSkills: string[], count: number = 5): QuickActionResult => {
  if (requiredSkills.length === 0) {
    return {
      candidates: candidates.slice(0, count),
      criteria: 'Skills',
      description: `Top ${count} candidates (no requirements set)`,
      icon: '🎯'
    };
  }
  
  const withScores = candidates.map(candidate => ({
    candidate,
    score: calculateSkillMatchPercentage(candidate.skills, requiredSkills).percentage
  }));
  
  const sorted = withScores.sort((a, b) => b.score - a.score);
  
  return {
    candidates: sorted.slice(0, count).map(item => item.candidate),
    criteria: 'Skills',
    description: `Top ${count} candidates by skill match to requirements`,
    icon: '🎯'
  };
};

// Get diverse team (different backgrounds, skills, locations)
export const getDiverseTeam = (candidates: Candidate[], count: number = 5): QuickActionResult => {
  const selected: Candidate[] = [];
  const usedSkills = new Set<string>();
  const usedLocations = new Set<string>();
  const usedExperienceLevels = new Set<string>();
  const usedEducationLevels = new Set<string>();
  
  // Helper function to calculate diversity score
  const getDiversityScore = (candidate: Candidate): number => {
    let score = 0;
    
    // New skills
    const newSkills = candidate.skills.filter(skill => !usedSkills.has(skill));
    score += newSkills.length * 10;
    
    // New location
    if (!usedLocations.has(candidate.location)) score += 20;
    
    // New experience level
    const expLevel = candidate.work_experiences.length >= 5 ? 'senior' : 
                    candidate.work_experiences.length >= 2 ? 'mid' : 'junior';
    if (!usedExperienceLevels.has(expLevel)) score += 15;
    
    // New education level
    const eduLevel = candidate.education.highest_level.toLowerCase();
    if (!usedEducationLevels.has(eduLevel)) score += 15;
    
    return score;
  };
  
  // Select candidates one by one, prioritizing diversity
  for (let i = 0; i < count && i < candidates.length; i++) {
    let bestCandidate = candidates[0];
    let bestScore = -1;
    
    for (const candidate of candidates) {
      if (selected.some(c => c.email === candidate.email)) continue;
      
      const diversityScore = getDiversityScore(candidate);
      if (diversityScore > bestScore) {
        bestScore = diversityScore;
        bestCandidate = candidate;
      }
    }
    
    if (bestScore >= 0) {
      selected.push(bestCandidate);
      
      // Update used sets
      bestCandidate.skills.forEach(skill => usedSkills.add(skill));
      usedLocations.add(bestCandidate.location);
      const expLevel = bestCandidate.work_experiences.length >= 5 ? 'senior' : 
                      bestCandidate.work_experiences.length >= 2 ? 'mid' : 'junior';
      usedExperienceLevels.add(expLevel);
      usedEducationLevels.add(bestCandidate.education.highest_level.toLowerCase());
    }
  }
  
  return {
    candidates: selected,
    criteria: 'Diversity',
    description: `Top ${count} candidates with diverse backgrounds and skills`,
    icon: '🌈'
  };
};

// Get balanced team (mix of experience levels)
export const getBalancedTeam = (candidates: Candidate[], count: number = 5): QuickActionResult => {
  const experienceGroups = {
    junior: candidates.filter(c => c.work_experiences.length < 2),
    mid: candidates.filter(c => c.work_experiences.length >= 2 && c.work_experiences.length < 5),
    senior: candidates.filter(c => c.work_experiences.length >= 5)
  };
  
  const selected: Candidate[] = [];
  const targetPerGroup = Math.ceil(count / 3);
  
  // Add from each experience level
  ['senior', 'mid', 'junior'].forEach(level => {
    const available = experienceGroups[level as keyof typeof experienceGroups];
    const toAdd = Math.min(targetPerGroup, available.length);
    
    // Sort by overall score and add top candidates
    const sorted = available.sort((a, b) => {
      const scoreA = calculateCandidateScore(a).total;
      const scoreB = calculateCandidateScore(b).total;
      return scoreB - scoreA;
    });
    
    selected.push(...sorted.slice(0, toAdd));
  });
  
  // Fill remaining slots with best available candidates
  const remaining = count - selected.length;
  if (remaining > 0) {
    const available = candidates.filter(c => !selected.some(s => s.email === c.email));
    const sorted = available.sort((a, b) => {
      const scoreA = calculateCandidateScore(a).total;
      const scoreB = calculateCandidateScore(b).total;
      return scoreB - scoreA;
    });
    
    selected.push(...sorted.slice(0, remaining));
  }
  
  return {
    candidates: selected.slice(0, count),
    criteria: 'Balance',
    description: `Balanced team with mix of experience levels`,
    icon: '⚖️'
  };
};

// Get candidates by specific criteria
export const getCandidatesByCriteria = (candidates: Candidate[], criteria: string, count: number = 5): QuickActionResult => {
  switch (criteria.toLowerCase()) {
    case 'experience':
      return getTopByExperience(candidates, count);
    case 'diversity':
      return getDiverseTeam(candidates, count);
    case 'balance':
      return getBalancedTeam(candidates, count);
    default:
      return {
        candidates: candidates.slice(0, count),
        criteria: 'General',
        description: `Top ${count} candidates`,
        icon: '👥'
      };
  }
};

// Get top candidates by overall score
export const getTopByOverallScore = (candidates: Candidate[], requiredSkills: string[] = [], targetSalary?: number, count: number = 5): QuickActionResult => {
  const withScores = candidates.map(candidate => ({
    candidate,
    score: calculateCandidateScore(candidate, requiredSkills, targetSalary).total
  }));
  
  const sorted = withScores.sort((a, b) => b.score - a.score);
  
  return {
    candidates: sorted.slice(0, count).map(item => item.candidate),
    criteria: 'Overall Score',
    description: `Top ${count} candidates by comprehensive scoring`,
    icon: '🏆'
  };
};

// Get candidates by location diversity
export const getLocationDiverseTeam = (candidates: Candidate[], count: number = 5): QuickActionResult => {
  const locationGroups = new Map<string, Candidate[]>();
  
  // Group candidates by location
  candidates.forEach(candidate => {
    const location = candidate.location;
    if (!locationGroups.has(location)) {
      locationGroups.set(location, []);
    }
    locationGroups.get(location)!.push(candidate);
  });
  
  const selected: Candidate[] = [];
  const locations = Array.from(locationGroups.keys());
  
  // Try to get one candidate from each location
  for (let i = 0; i < Math.min(count, locations.length); i++) {
    const location = locations[i];
    const candidatesInLocation = locationGroups.get(location)!;
    
    // Get the best candidate from this location
    const bestCandidate = candidatesInLocation.sort((a, b) => {
      const scoreA = calculateCandidateScore(a).total;
      const scoreB = calculateCandidateScore(b).total;
      return scoreB - scoreA;
    })[0];
    
    selected.push(bestCandidate);
  }
  
  // Fill remaining slots with best available candidates
  const remaining = count - selected.length;
  if (remaining > 0) {
    const available = candidates.filter(c => !selected.some(s => s.email === c.email));
    const sorted = available.sort((a, b) => {
      const scoreA = calculateCandidateScore(a).total;
      const scoreB = calculateCandidateScore(b).total;
      return scoreB - scoreA;
    });
    
    selected.push(...sorted.slice(0, remaining));
  }
  
  return {
    candidates: selected.slice(0, count),
    criteria: 'Location Diversity',
    description: `Top ${count} candidates from different locations`,
    icon: '🌍'
  };
};
