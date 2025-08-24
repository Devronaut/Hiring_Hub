import React, { useState, useEffect } from 'react';
import type { Candidate } from './types/candidate';
import { fetchCandidates, getSampleCandidates } from './data/candidateData';
import { CandidateCard } from './components/CandidateCard';
import FilterPanel from './components/FilterPanel';
import TeamBuilder from './components/TeamBuilder';
import { Header } from './components/Header';
import Pagination from './components/Pagination';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { Search, Users, Filter as FilterIcon, BarChart3, Star, Scale } from 'lucide-react';
import { CandidateProfileModal } from './components/CandidateProfileModal';
import { CandidateComparison } from './components/CandidateComparison';
import { ScoringSystemModal } from './components/ScoringSystemModal';
import { QuickActions } from './components/QuickActions';

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [bookmarkedCandidates, setBookmarkedCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    skills: [] as string[],
    location: '',
    availability: [] as string[],
    minExperience: 0,
    maxSalary: Infinity
  });
  const [selectedProfileCandidate, setSelectedProfileCandidate] = useState<Candidate | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [comparisonCandidates, setComparisonCandidates] = useState<Candidate[]>([]);
  const [isScoringSystemOpen, setIsScoringSystemOpen] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const ITEMS_PER_PAGE = 6;
  const MAX_SELECTED_CANDIDATES = 5;

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true);
        const data = await fetchCandidates();
        if (data.length > 0) {
          setCandidates(data);
        } else {
          setCandidates(getSampleCandidates());
        }
      } catch (err) {
        console.error('Failed to load candidates:', err);
        setError('Failed to load candidate data. Using sample data instead.');
        setCandidates(getSampleCandidates());
      } finally {
        setLoading(false);
      }
    };
    loadCandidates();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const handleCandidateSelect = (candidate: Candidate) => {
    if (selectedCandidates.some(c => c.email === candidate.email)) {
      setSelectedCandidates(selectedCandidates.filter(c => c.email !== candidate.email));
    } else if (selectedCandidates.length < 5) {
      setSelectedCandidates([...selectedCandidates, candidate]);
    }
  };

  const handleCandidateRemove = (candidate: Candidate) => {
    setSelectedCandidates(selectedCandidates.filter(c => c.email !== candidate.email));
  };

  const handleOpenProfile = (candidate: Candidate) => {
    setSelectedProfileCandidate(candidate);
    setIsProfileModalOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfileModalOpen(false);
    setSelectedProfileCandidate(null);
  };

  const handleToggleBookmark = (candidate: Candidate) => {
    setBookmarkedCandidates(prev => {
      const isBookmarked = prev.some(c => c.email === candidate.email);
      if (isBookmarked) {
        return prev.filter(c => c.email !== candidate.email);
      } else {
        return [...prev, candidate];
      }
    });
  };

  const handleOpenComparison = () => {
    if (selectedCandidates.length >= 2) {
      setComparisonCandidates(selectedCandidates);
      setIsComparisonOpen(true);
    }
  };

  const handleCloseComparison = () => {
    setIsComparisonOpen(false);
    setComparisonCandidates([]);
  };

  const handleShowScoringSystem = () => {
    setIsScoringSystemOpen(true);
  };

  const handleShowBookmarks = () => {
    setShowBookmarksOnly(true);
  };

  const handleQuickSelect = (candidates: Candidate[]) => {
    // Max 5 candidates
    const newSelection = candidates.slice(0, MAX_SELECTED_CANDIDATES);
    setSelectedCandidates(newSelection);
  };

  const filteredCandidates = candidates.filter(candidate => {
    // Enhanced search filter - search across multiple fields
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      
      // Basic info search
      const basicMatch = 
        candidate.name.toLowerCase().includes(searchLower) ||
        candidate.email.toLowerCase().includes(searchLower) ||
        candidate.location.toLowerCase().includes(searchLower);
      
      // Skills search
      const skillsMatch = candidate.skills.some(skill => 
        skill.toLowerCase().includes(searchLower)
      );
      
      // Company search (work experiences)
      const companyMatch = candidate.work_experiences.some(exp => 
        exp.company.toLowerCase().includes(searchLower) ||
        exp.roleName.toLowerCase().includes(searchLower)
      );
      
      // Education search
      const educationMatch = 
        candidate.education.highest_level.toLowerCase().includes(searchLower) ||
        candidate.education.degrees.some(degree => 
          degree.degree.toLowerCase().includes(searchLower) ||
          degree.subject.toLowerCase().includes(searchLower) ||
          degree.school.toLowerCase().includes(searchLower)
        );
      
      // If any of the search criteria match, include the candidate
      if (!(basicMatch || skillsMatch || companyMatch || educationMatch)) {
        return false;
      }
    }

    // Skills filter
    if (filters.skills.length > 0) {
      const hasRequiredSkills = filters.skills.every(skill => 
        candidate.skills.includes(skill)
      );
      if (!hasRequiredSkills) return false;
    }

    // Location filter
    if (filters.location && candidate.location !== filters.location) {
      return false;
    }

    // Availability filter
    if (filters.availability.length > 0) {
      const hasRequiredAvailability = filters.availability.some(availability =>
        candidate.work_availability.includes(availability)
      );
      if (!hasRequiredAvailability) return false;
    }

    // Experience filter
    if (filters.minExperience > 0 && candidate.work_experiences.length < filters.minExperience) {
      return false;
    }

    // Salary filter
    if (filters.maxSalary !== Infinity) {
      const salaryStr = candidate.annual_salary_expectation["full-time"];
      if (salaryStr) {
        const salary = parseInt(salaryStr.replace(/[$,]/g, ''));
        if (salary > filters.maxSalary) return false;
      }
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

  // Determine which candidates to show based on view mode
  const displayCandidates = showBookmarksOnly ? bookmarkedCandidates : filteredCandidates;
  const displayCurrentCandidates = showBookmarksOnly ? displayCandidates : currentCandidates;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onShowScoringSystem={handleShowScoringSystem}
        onShowBookmarks={handleShowBookmarks}
      />
      
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} setFilters={setFilters} candidates={candidates} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Stats Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    {showBookmarksOnly ? (
                      <Star className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <Users className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
      <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {showBookmarksOnly 
                        ? `${bookmarkedCandidates.length} Bookmarked Candidate${bookmarkedCandidates.length !== 1 ? 's' : ''}`
                        : `${filteredCandidates.length} Candidate${filteredCandidates.length !== 1 ? 's' : ''}`
                      }
                    </h2>
                    <p className="text-sm text-gray-600">
                      {showBookmarksOnly 
                        ? 'Your saved candidates for review'
                        : `${selectedCandidates.length}/5 selected for your team`
                      }
                    </p>
                  </div>
                </div>

                {/* Search Bar - Only show for main view */}
                {!showBookmarksOnly && (
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, skills, company, education..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                )}
              </div>

              {/* Search Tips */}
              {!searchTerm && (
                <div className="mt-3 text-xs text-gray-500">
                  💡 Search tips: Try "Docker", "React", "Google", "Computer Science", "Senior", etc.
                </div>
              )}

              {/* Search Results Summary */}
              {searchTerm && filteredCandidates.length > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                  🔍 Found {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} matching "{searchTerm}"
                </div>
              )}

              {/* Active Filters Summary */}
              {(filters.skills.length > 0 || filters.location || filters.availability.length > 0 || filters.minExperience > 0 || filters.maxSalary !== Infinity) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {filters.skills.map((skill) => (
                      <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                    {filters.location && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Location: {filters.location}
                      </span>
                    )}
                    {filters.availability.map((availability) => (
                      <span key={availability} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                        {availability}
                      </span>
                    ))}
                    {filters.minExperience > 0 && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                        Min Experience: {filters.minExperience} years
                      </span>
                    )}
                    {filters.maxSalary !== Infinity && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                        Max ${filters.maxSalary.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions - NEW FEATURE */}
              {!showBookmarksOnly && (
                <div className="mt-8">
                  <QuickActions
                    candidates={filteredCandidates}
                    requiredSkills={filters.skills}
                    targetSalary={filters.maxSalary !== Infinity ? filters.maxSalary : undefined}
                    onQuickSelect={handleQuickSelect}
                    selectedCandidates={selectedCandidates}
                    allFilters={filters}
                    onOpenProfile={handleOpenProfile}
                  />
                </div>
              )}
            </div>

            {/* Filter Summary - NEW FEATURE */}
            {!showBookmarksOnly && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FilterIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Filter Summary</h3>
                      <p className="text-sm text-blue-700">
                        {filteredCandidates.length} candidates match your current filters
                        {filteredCandidates.length !== candidates.length && (
                          <span className="text-blue-600 font-medium">
                            {' '}(from {candidates.length} total candidates)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {/* Active Filters Display */}
                  {(filters.skills.length > 0 || filters.location || filters.availability.length > 0 || filters.minExperience > 0 || filters.maxSalary !== Infinity) ? (
                    <div className="flex flex-wrap gap-2">
                      {filters.skills.map((skill) => (
                        <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          🎯 {skill}
                        </span>
                      ))}
                      {filters.location && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          📍 {filters.location}
                        </span>
                      )}
                      {filters.availability.map((availability) => (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          ⏰ {availability}
                        </span>
                      ))}
                      {filters.minExperience > 0 && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                          👔 {filters.minExperience}+ years
                        </span>
                        )}
                      {filters.maxSalary !== Infinity && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          💰 ${filters.maxSalary.toLocaleString()}
                        </span>
                      )}
                      
                      {/* Clear All Filters Button */}
                      <button
                        onClick={() => {
                          setFilters({
                            skills: [],
                            location: '',
                            availability: [],
                            minExperience: 0,
                            maxSalary: Infinity
                          });
                          setSearchTerm('');
                        }}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-200 transition-colors flex items-center space-x-1"
                      >
                        <span>🗑️</span>
                        <span>Clear All</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-blue-600 text-sm font-medium">
                      No filters applied - showing all {candidates.length} candidates
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Candidate Grid */}
            {displayCurrentCandidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                {displayCurrentCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.email}
                    candidate={candidate}
                    isSelected={selectedCandidates.some(c => c.email === candidate.email)}
                    onSelect={handleCandidateSelect}
                    onOpenProfile={handleOpenProfile}
                    searchTerm={searchTerm}
                    requiredSkills={filters.skills}
                    targetSalary={filters.maxSalary !== Infinity ? filters.maxSalary : undefined}
                    onToggleBookmark={handleToggleBookmark}
                    isBookmarked={bookmarkedCandidates.some(c => c.email === candidate.email)}
                    selectedCount={selectedCandidates.length}
                    maxSelection={5}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  {showBookmarksOnly ? (
                    <Star className="h-12 w-12 text-gray-400" />
                  ) : (
                    <Users className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {showBookmarksOnly ? 'No bookmarked candidates' : 'No candidates found'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {showBookmarksOnly 
                    ? 'Start bookmarking candidates you find interesting to see them here.'
                    : 'Try adjusting your search terms or filters to find more candidates.'
                  }
                </p>
                {showBookmarksOnly && (
                  <button
                    onClick={() => setShowBookmarksOnly(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View All Candidates
                  </button>
                )}
                {!showBookmarksOnly && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({
                        skills: [],
                        location: '',
                        availability: [],
                        minExperience: 0,
                        maxSalary: Infinity
                      });
                    }}
                    className="btn-primary"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Always show View All Candidates button in bookmarks view when there are candidates */}
            {showBookmarksOnly && displayCurrentCandidates.length > 0 && (
              <div className="text-center mb-6">
                <button
                  onClick={() => setShowBookmarksOnly(false)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  ← View All Candidates
                </button>
              </div>
            )}

            {/* Pagination - Only show for main view, not bookmarks */}
            {!showBookmarksOnly && filteredCandidates.length > 0 && (
              <div className="mb-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredCandidates.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              </div>
            )}
          </div>
        </div>

        {/* Analytics Dashboard - Only show in main view */}
        {!showBookmarksOnly && (
          <div className="mt-12">
            <div className="flex items-center space-x-3 mb-6">
              {/* <div className="bg-purple-100 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Analytics & Insights</h2> */}
            </div>
            <AnalyticsDashboard
              allCandidates={candidates}
              selectedCandidates={selectedCandidates}
            />
          </div>
        )}

        {/* Bookmarks Section - Only show in main view */}
        {!showBookmarksOnly && bookmarkedCandidates.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Bookmarked Candidates</h2>
              <span className="text-sm text-gray-500">({bookmarkedCandidates.length} saved)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {bookmarkedCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.email}
                  candidate={candidate}
                  isSelected={selectedCandidates.some(c => c.email === candidate.email)}
                  onSelect={handleCandidateSelect}
                  onOpenProfile={handleOpenProfile}
                  searchTerm={searchTerm}
                  requiredSkills={filters.skills}
                  targetSalary={filters.maxSalary !== Infinity ? filters.maxSalary : undefined}
                  onToggleBookmark={handleToggleBookmark}
                  isBookmarked={true}
                  selectedCount={selectedCandidates.length}
                  maxSelection={5}
                />
              ))}
            </div>
      </div>
        )}

        {/* Team Builder - Only show in main view */}
        {!showBookmarksOnly && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Team Builder</h2>
              {selectedCandidates.length >= 2 && (
                <button
                  onClick={handleOpenComparison}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Scale className="h-4 w-4" />
                  <span>Compare Candidates</span>
        </button>
              )}
            </div>
            <TeamBuilder
              selectedCandidates={selectedCandidates}
              onRemoveCandidate={handleCandidateRemove}
            />
          </div>
        )}
      </div>

      {/* Candidate Profile Modal */}
      <CandidateProfileModal
        candidate={selectedProfileCandidate}
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfile}
      />

      {/* Candidate Comparison Modal */}
      <CandidateComparison
        candidates={comparisonCandidates}
        isOpen={isComparisonOpen}
        onClose={handleCloseComparison}
        requiredSkills={filters.skills}
        targetSalary={filters.maxSalary !== Infinity ? filters.maxSalary : undefined}
      />

      {/* Scoring System Modal */}
      <ScoringSystemModal
        isOpen={isScoringSystemOpen}
        onClose={() => setIsScoringSystemOpen(false)}
      />
    </div>
  );
}

export default App;
