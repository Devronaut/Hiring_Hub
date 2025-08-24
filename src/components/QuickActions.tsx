import React, { useState } from 'react';
import { Zap, Target, Users, TrendingUp, Star, Lightbulb, CheckCircle, X, Filter } from 'lucide-react';
import type { Candidate } from '../types/candidate';
import { 
  getTopByExperience, 
  getTopBySalaryFit, 
  getTopBySkillMatch, 
  getDiverseTeam, 
  getBalancedTeam,
  getTopByOverallScore,
  getLocationDiverseTeam,
  type QuickActionResult 
} from '../utils/scoring';

interface QuickActionsProps {
  candidates: Candidate[];
  requiredSkills: string[];
  targetSalary?: number;
  onQuickSelect: (candidates: Candidate[]) => void;
  selectedCandidates: Candidate[];
  // Add all filter properties
  allFilters?: {
    skills: string[];
    location: string;
    availability: string[];
    minExperience: number;
    maxSalary: number;
  };
  // Add profile opening functionality
  onOpenProfile?: (candidate: Candidate) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  candidates,
  requiredSkills,
  targetSalary,
  onQuickSelect,
  selectedCandidates,
  allFilters,
  onOpenProfile
}) => {
  const [showResults, setShowResults] = useState(false);
  const [currentResult, setCurrentResult] = useState<QuickActionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if any filters are active
  const hasActiveFilters = () => {
    if (!allFilters) return false;
    
    return (
      allFilters.skills.length > 0 ||
      allFilters.location !== '' ||
      allFilters.availability.length > 0 ||
      allFilters.minExperience > 0 ||
      allFilters.maxSalary !== Infinity
    );
  };

  const handleQuickAction = async (action: string) => {
    setIsLoading(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let result: QuickActionResult;
    
    switch (action) {
      case 'experience':
        result = getTopByExperience(candidates);
        break;
      case 'salary':
        if (targetSalary) {
          result = getTopBySalaryFit(candidates, targetSalary);
        } else {
          result = {
            candidates: candidates.slice(0, 5),
            criteria: 'Salary',
            description: 'Top 5 candidates (set target salary for better results)',
            icon: '💰'
          };
        }
        break;
      case 'skills':
        if (requiredSkills.length > 0) {
          result = getTopBySkillMatch(candidates, requiredSkills);
        } else {
          // When no required skills, show candidates with diverse skill sets
          const withSkillCounts = candidates.map(candidate => ({
            candidate,
            skillCount: candidate.skills.length,
            uniqueSkills: new Set(candidate.skills).size
          }));
          
          const sorted = withSkillCounts.sort((a, b) => {
            // Prioritize candidates with more unique skills
            if (a.uniqueSkills !== b.uniqueSkills) {
              return b.uniqueSkills - a.uniqueSkills;
            }
            // Then by total skill count
            return b.skillCount - a.skillCount;
          });
          
          result = {
            candidates: sorted.slice(0, 5).map(item => item.candidate),
            criteria: 'Skills',
            description: `Top 5 candidates by skill diversity`,
            icon: '🎯'
          };
        }
        break;
      case 'diversity':
        result = getDiverseTeam(candidates);
        break;
      case 'balance':
        result = getBalancedTeam(candidates);
        break;
      case 'overall':
        result = getTopByOverallScore(candidates, requiredSkills, targetSalary);
        break;
      case 'location':
        result = getLocationDiverseTeam(candidates);
        break;
      default:
        result = {
          candidates: candidates.slice(0, 5),
          criteria: 'General',
          description: 'Top 5 candidates',
          icon: '👥'
        };
    }
    
    setCurrentResult(result);
    setShowResults(true);
    setIsLoading(false);
  };

  const handleApplySelection = () => {
    if (currentResult) {
      onQuickSelect(currentResult.candidates);
      setShowResults(false);
      setCurrentResult(null);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleClearSelection = () => {
    onQuickSelect([]);
    setShowResults(false);
    setCurrentResult(null);
  };

  const quickActionButtons = [
    {
      id: 'overall',
      label: 'Top 5 Overall',
      description: hasActiveFilters()
        ? `Best overall candidates (from ${candidates.length} filtered)`
        : `Best overall candidates (from ${candidates.length} total)`,
      icon: '🏆',
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
      disabled: false
    },
    {
      id: 'experience',
      label: 'Top 5 by Experience',
      description: hasActiveFilters()
        ? `Most experienced (from ${candidates.length} filtered)`
        : `Most experienced (from ${candidates.length} total)`,
      icon: '👔',
      color: 'bg-blue-500 hover:bg-blue-600',
      disabled: false
    },
    {
      id: 'salary',
      label: 'Top 5 by Salary Fit',
      description: targetSalary ? `Closest to $${targetSalary.toLocaleString()}` : 'Set target salary first',
      icon: '💰',
      color: 'bg-green-800 hover:bg-green-900',
      disabled: !targetSalary
    },
    {
      id: 'skills',
      label: 'Top 5 by Skills',
      description: requiredSkills.length > 0 
        ? `${requiredSkills.length} required skills (from ${candidates.length} filtered)`
        : `Best skill diversity (from ${candidates.length} total)`,
      icon: '🎯',
      color: 'bg-purple-500 hover:bg-purple-600',
      disabled: false
    },
    {
      id: 'diversity',
      label: 'Top 5 Diverse',
      description: hasActiveFilters()
        ? `Different backgrounds (from ${candidates.length} filtered)`
        : `Different backgrounds (from ${candidates.length} total)`,
      icon: '🌈',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      disabled: false
    },
    {
      id: 'balance',
      label: 'Top 5 Balanced',
      description: hasActiveFilters()
        ? `Mix of experience levels (from ${candidates.length} filtered)`
        : `Mix of experience levels (from ${candidates.length} total)`,
      icon: '⚖️',
      color: 'bg-orange-500 hover:bg-orange-600',
      disabled: false
    },
    {
      id: 'location',
      label: 'Top 5 by Location',
      description: hasActiveFilters()
        ? `Different locations (from ${candidates.length} filtered)`
        : `Different locations (from ${candidates.length} total)`,
      icon: '🌍',
      color: 'bg-teal-500 hover:bg-teal-600',
      disabled: false
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-2 rounded-lg">
            <Zap className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600">
              Smart filters for instant shortlisting
              {candidates.length !== 0 && (
                <span className="text-blue-600 font-medium">
                  {' '}(Working with {candidates.length} {hasActiveFilters() ? 'filtered' : 'total'} candidates)
                </span>
              )}
            </p>
          </div>
        </div>
        
        {/* Current Selection Status */}
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {selectedCandidates.length}/5 Selected
          </div>
          {selectedCandidates.length > 0 && (
            <button
              onClick={handleClearSelection}
              className="text-red-600 hover:text-red-800 text-sm font-medium underline"
              title="Clear all selected candidates"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter Status Indicator */}
      {hasActiveFilters() ? (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Active Filters Affecting Quick Actions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allFilters && allFilters.skills.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                Skills: {allFilters.skills.join(', ')}
              </span>
            )}
            {allFilters && allFilters.location && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Location: {allFilters.location}
              </span>
            )}
            {allFilters && allFilters.availability.length > 0 && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                Availability: {allFilters.availability.join(', ')}
              </span>
            )}
            {allFilters && allFilters.minExperience > 0 && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                Min Experience: {allFilters.minExperience} years
              </span>
            )}
            {allFilters && allFilters.maxSalary !== Infinity && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                Max Salary: ${allFilters.maxSalary.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Quick Actions will select from candidates matching these filters
          </p>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600">ℹ️</span>
            <div className="text-sm text-blue-800">
              <span className="font-medium">No filters applied:</span> Quick Actions will select from all {candidates.length} available candidates. 
              Consider setting job requirements, location, availability, or salary filters for more targeted results.
            </div>
          </div>
        </div>
      )}

      {/* Candidate Count Warning */}
      {candidates.length < 5 && candidates.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <div className="text-sm text-yellow-800">
              <span className="font-medium">Limited candidates available:</span> Only {candidates.length} candidates match your current filters. 
              Consider adjusting filters for more options.
            </div>
          </div>
        </div>
      )}

      {/* No Candidates Warning */}
      {candidates.length === 0 && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">🚫</span>
            <div className="text-sm text-red-800">
              <span className="font-medium">No candidates available:</span> Your current filters return no results. 
              Try adjusting your search criteria or filters.
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {quickActionButtons.map((button) => (
          <button
            key={button.id}
            onClick={() => handleQuickAction(button.id)}
            disabled={button.disabled || isLoading}
            className={`${button.color} text-white p-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:transform-none`}
            title={button.disabled ? button.description : ''}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{button.icon}</span>
              <div className="text-left">
                <div className="font-semibold text-sm">{button.label}</div>
                <div className="text-xs opacity-90">{button.description}</div>
                <div className="text-xs opacity-75 mt-1">→ Selects 5 candidates</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Results Modal */}
      {showResults && currentResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{currentResult.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{currentResult.criteria} Selection</h3>
                    <p className="text-gray-600">{currentResult.description}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Selected from {candidates.length} {hasActiveFilters() ? 'filtered' : 'total'} candidates
                    </p>
                    {onOpenProfile && (
                      <p className="text-xs text-blue-500 mt-1 flex items-center space-x-1">
                        <span>💡</span>
                        <span>Click candidate names to view full profiles</span>
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Selected Candidates */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {currentResult.candidates.map((candidate, index) => (
                  <div key={candidate.email} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <div>
                          {onOpenProfile ? (
                            <button
                              onClick={() => onOpenProfile(candidate)}
                              className="text-left hover:bg-blue-100 p-2 rounded transition-all duration-200 group"
                            >
                              <div className="font-medium text-gray-900 group-hover:text-blue-600 cursor-pointer flex items-center space-x-2">
                                <span>{candidate.name}</span>
                                <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                  👁️ View Profile
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">{candidate.location}</div>
                            </button>
                          ) : (
                            <div>
                              <div className="font-medium text-gray-900">{candidate.name}</div>
                              <div className="text-sm text-gray-600">{candidate.location}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {candidate.work_experiences.length} years exp
                        </div>
                        <div className="text-xs text-gray-500">
                          {candidate.skills.slice(0, 2).join(', ')}
                          {candidate.skills.length > 2 && '...'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{currentResult.candidates.length}</span> candidates selected
                  {candidates.length < 5 && (
                    <span className="text-orange-600 ml-2">(limited by filters)</span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleClearSelection}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                  >
                    Clear Current
                  </button>
                  <button
                    onClick={handleApplySelection}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Apply Selection</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="text-gray-700 font-medium">Analyzing candidates...</div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">💡 Pro Tips:</div>
            <ul className="space-y-1 text-xs">
              <li>• <strong>Current state:</strong> {hasActiveFilters() ? 'Working with filtered candidates' : 'Working with all candidates'}</li>
              <li>• <strong>Quick Actions work with your current filters</strong> - set filters first for better results</li>
              <li>• Set <strong>job requirements</strong> first for better skill matching</li>
              <li>• Set <strong>target salary</strong> for optimal salary fit results</li>
              <li>• Use <strong>Diverse</strong> for teams with varied backgrounds</li>
              <li>• Use <strong>Balanced</strong> for mix of experience levels</li>
              <li>• <strong>Adjust filters</strong> if you need more targeted results</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-in slide-in-from-right-2">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Quick selection applied successfully!</span>
        </div>
      )}
    </div>
  );
};
