import React, { useState } from 'react';
import type { Candidate } from '../types/candidate';
import SearchableSkillsFilter from './SearchableSkillsFilter';
import { Filter, MapPin, Briefcase, DollarSign, Clock, Target, Star, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    skills: string[];
    location: string;
    availability: string[];
    minExperience: number;
    maxSalary: number;
  };
  setFilters: (filters: any) => void;
  candidates: Candidate[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, candidates }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get unique values for filter options
  const uniqueLocations = Array.from(new Set(candidates.map(c => c.location))).sort();
  const uniqueAvailability = Array.from(new Set(candidates.flatMap(c => c.work_availability))).sort();

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    setFilters({
      skills: [],
      location: '',
      availability: [],
      minExperience: 0,
      maxSalary: Infinity
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => 
    Array.isArray(v) ? v.length > 0 : v !== '' && v !== 0 && v !== Infinity
  ).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Filter className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <p className="text-sm text-gray-600">Candidate search</p>
          </div>
        </div>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          role = "button"
        >
         {isExpanded ? (
        <ChevronUp className="h-5 w-5" />
        ) : (
       <ChevronDown className="h-5 w-5" />
       )}
        </div>
      </div>

      {/* Active Filters Badge */}
      {activeFiltersCount > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          </div>
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      <div className={`space-y-6 transition-all duration-300 ${isExpanded ? 'block' : 'hidden'}`}>
        {/* Job Requirements Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-blue-900">Job Requirements</h3>
          </div>
          <p className="text-xs text-blue-700">
            Set the required skills for this role. Candidates will be scored based on how well they match these requirements.
          </p>
        </div>

        {/* Skills Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-gray-500" />
              <span>Required Skills</span>
            </div>
          </label>
          <SearchableSkillsFilter
            selectedSkills={filters.skills}
            onSkillsChange={(skills) => handleFilterChange('skills', skills)}
            allSkills={[...new Set(candidates.flatMap(c => c.skills))].sort()}
          />
          
          {/* Demo Job Requirements */}
          {/* {filters.skills.length === 0 && (
            <div className="mt-3">
              <button
                onClick={() => handleFilterChange('skills', ['React', 'Node.js', 'SQL'])}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Try demo: React, Node.js, SQL
              </button>
            </div>
          )} */}
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>Location</span>
            </div>
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="input-field"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>Work Availability</span>
            </div>
          </label>
          <div className="space-y-2">
            {uniqueAvailability.map(availability => (
              <label key={availability} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.availability.includes(availability)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleFilterChange('availability', [...filters.availability, availability]);
                    } else {
                      handleFilterChange('availability', filters.availability.filter(a => a !== availability));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {availability}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <span>Minimum Experience (Years)</span>
            </div>
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={filters.minExperience}
            onChange={(e) => handleFilterChange('minExperience', parseInt(e.target.value))}
            className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer
             accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0 years</span>
            <span className="font-medium text-blue-600">{filters.minExperience} years</span>
            <span>10+ years</span>
          </div>
        </div>

        {/* Salary Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>Maximum Salary</span>
            </div>
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="Enter max salary"
              value={filters.maxSalary === Infinity ? '' : filters.maxSalary}
              onChange={(e) => {
                const value = e.target.value === '' ? Infinity : parseInt(e.target.value);
                handleFilterChange('maxSalary', value);
              }}
              className="input-field pr-12"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">USD</span>
            </div>
          </div>
          {filters.maxSalary !== Infinity && (
            <p className="text-xs text-gray-500 mt-1">
              Max: ${filters.maxSalary.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-gray-50 p-2 rounded-lg">
            <div className="font-semibold text-gray-900">{candidates.length}</div>
            <div className="text-gray-600">Total Candidates</div>
          </div>
          <div className="bg-blue-50 p-2 rounded-lg">
            <div className="font-semibold text-blue-900">{uniqueLocations.length}</div>
            <div className="text-blue-700">Locations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
