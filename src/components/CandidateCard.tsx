import React, { useState } from 'react';
import { Mail, Phone, MapPin, Briefcase, Calendar, GraduationCap, Building, Clock, DollarSign, Star, Target } from 'lucide-react';
import type { Candidate } from '../types/candidate';
import { calculateCandidateScore, getScoreColor, getScoreLabel, calculateSkillMatchPercentage, getSkillMatchColor, getSkillMatchLabel } from '../utils/scoring';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: (candidate: Candidate) => void;
  onOpenProfile: (candidate: Candidate) => void;
  searchTerm?: string;
  requiredSkills?: string[];
  targetSalary?: number;
  isBookmarked?: boolean;
  onToggleBookmark?: (candidate: Candidate) => void;
  selectedCount?: number;
  maxSelection?: number;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSelected,
  onSelect,
  onOpenProfile,
  searchTerm,
  requiredSkills = [],
  targetSalary,
  isBookmarked = false,
  onToggleBookmark,
  selectedCount = 0,
  maxSelection = 5
}) => {
  const [showMaxSelectionPopup, setShowMaxSelectionPopup] = useState(false);
  
  const getExperienceLevel = (experiences: any[]) => {
    if (experiences.length >= 5) return { level: 'Senior', color: 'bg-purple-100 text-purple-700' };
    if (experiences.length >= 2) return { level: 'Mid-Level', color: 'bg-blue-100 text-blue-700' };
    return { level: 'Junior', color: 'bg-green-100 text-purple-700' };
  };

  // Function to highlight search matches
  const highlightSearchMatch = (text: string, searchTerm?: string) => {
    if (!searchTerm || searchTerm.trim() === '') return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  };

  const { level, color } = getExperienceLevel(candidate.work_experiences);
  const annualSalary = candidate.annual_salary_expectation["full-time"] || 'Not specified';
  
  // Calculate candidate score
  const score = calculateCandidateScore(candidate, requiredSkills, targetSalary);
  const scoreColor = getScoreColor(score.total);
  const scoreLabel = getScoreLabel(score.total);

  // Calculate skill match percentage
  const skillMatch = calculateSkillMatchPercentage(candidate.skills, requiredSkills);
  const skillMatchColor = getSkillMatchColor(skillMatch.percentage);
  const skillMatchLabel = getSkillMatchLabel(skillMatch.percentage);

  // Check if candidate can be selected
  const canSelect = isSelected || selectedCount < maxSelection;
  const isAtMaxSelection = selectedCount >= maxSelection && !isSelected;

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isSelected) {
      // Deselect candidate
      onSelect(candidate);
    } else if (canSelect) {
      // Select candidate
      onSelect(candidate);
    }
    // No popup on click - only on hover
  };

  const handleButtonHover = () => {
    if (isAtMaxSelection) {
      setShowMaxSelectionPopup(true);
    }
  };

  const handleButtonLeave = () => {
    setShowMaxSelectionPopup(false);
  };

  return (
    <div 
      className={`card card-hover overflow-hidden transition-all duration-300 flex flex-col h-full cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
      onClick={() => onOpenProfile(candidate)}
    >
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 flex-1">
        {/* Name and Experience Level */}
        <div className="flex items-start justify-between mb-4">
  <div>
    <div className="flex items-center space-x-2">
      <h3 className="text-xl font-bold text-gray-900 truncate">
        <span dangerouslySetInnerHTML={{ 
          __html: highlightSearchMatch(candidate.name, searchTerm) 
        }} />
      </h3>
      {/* Bookmark Button */}
      {onToggleBookmark && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(candidate);
          }}
          className={`p-1 rounded-full transition-all duration-200 hover:scale-110 ${
            isBookmarked 
              ? 'text-yellow-500 hover:text-yellow-600' 
              : 'text-gray-400 hover:text-yellow-500'
          }`}
          title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        >
          <Star className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      )}
    </div>

    {/* Chips row BELOW the name */}
    <div className="flex flex-row flex-wrap gap-2 mt-2">
      {requiredSkills.length > 0 && (
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${skillMatchColor}`}>
          <Target className="h-3 w-3" />
          <span>{skillMatch.percentage}% Match</span>
        </div>
      )}
      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${scoreColor}`}>
        <Star className="h-3 w-3" />
        <span>{score.total}/100</span>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${color}`}>
        <Briefcase className="h-3 w-3" />
        <span>{level}</span>
      </div>
    </div>
  </div>
</div>


        {/* Score Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Score: {scoreLabel}</span>
            <span>{score.total}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                score.total >= 80 ? 'bg-green-500' : 
                score.total >= 60 ? 'bg-blue-500' : 
                score.total >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${score.total}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>S: {score.skills}</span>
            <span>E: {score.experience}</span>
            <span>$: {score.salary}</span>
            <span>Ed: {score.education}</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{candidate.location}</span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="truncate">{candidate.email}</span>
          </div>
          
          {candidate.phone && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{candidate.phone}</span>
            </div>
          )}
        </div>

        {/* Salary */}
        <div className="mb-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {annualSalary !== 'Not specified' 
                ? `$${parseInt(annualSalary.replace(/[^0-9]/g, '')).toLocaleString()}` 
                : 'Not specified'
              }
            </div>
            <div className="text-sm text-gray-500">Annual Salary</div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Skills</h4>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                <span dangerouslySetInnerHTML={{ 
                  __html: highlightSearchMatch(skill, searchTerm) 
                }} />
              </span>
            ))}
            {candidate.skills.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{candidate.skills.length - 3} more
              </span>
            )}
          </div>

          {/* Skill Match Breakdown - NEW FEATURE */}
          {requiredSkills.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Skill Match vs Job Requirements</span>
                <span className={`text-xs font-bold ${skillMatchColor.replace('bg-', 'text-').replace('-100', '-600')}`}>
                  {skillMatch.percentage}% - {skillMatchLabel}
                </span>
              </div>
              
              {/* Matched Skills */}
              {skillMatch.matchedSkills.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs text-gray-500">✓ Matched: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {skillMatch.matchedSkills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {skillMatch.missingSkills.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs text-gray-500">✗ Missing: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {skillMatch.missingSkills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra Skills */}
              {skillMatch.extraSkills.length > 0 && (
                <div>
                  <span className="text-xs text-gray-500">+ Bonus: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {skillMatch.extraSkills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                    {skillMatch.extraSkills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{skillMatch.extraSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Work Experience Summary */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Briefcase className="h-4 w-4 text-gray-400" />
          <span>{candidate.work_experiences.length} work experiences</span>
        </div>
      </div>

      {/* Action Button - Always at bottom */}
      <div className="p-6 pt-0 relative">
        <button
          onClick={handleSelectClick}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
            isSelected
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : isAtMaxSelection
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
          }`}
          disabled={!canSelect}
          title={isAtMaxSelection ? `Maximum ${maxSelection} candidates already selected` : ''}
        >
          {isSelected ? 'Selected ✓' : 'Select Candidate'}
        </button>

        {/* Max Selection Popup - appears above button on hover */}
        {showMaxSelectionPopup && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-xl z-[9999] min-w-max border-2 border-red-700">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">⚠️ Max {maxSelection} candidates reached</span>
            </div>
          </div>
        )}

        {/* Debug info - temporary */}
        {isAtMaxSelection && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            Max reached
          </div>
        )}
      </div>
    </div>
  );
};
