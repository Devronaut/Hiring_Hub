import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Search, Tag } from 'lucide-react';

interface SearchableSkillsFilterProps {
  allSkills: string[];
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
}

const SearchableSkillsFilter = ({ allSkills, selectedSkills, onSkillsChange }: SearchableSkillsFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSkills = allSkills.filter(skill =>
    skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSkills.includes(skill)
  );

  const handleSkillSelect = (skill: string) => {
    onSkillsChange([...selectedSkills, skill]);
    setSearchTerm('');
  };

  const handleSkillRemove = (skillToRemove: string) => {
    onSkillsChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleClearAll = () => {
    onSkillsChange([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Skills Display */}
      {selectedSkills.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Selected Skills</span>
            <button
              onClick={handleClearAll}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                <Tag className="h-3 w-3" />
                <span>{skill}</span>
                <button
                  onClick={() => handleSkillRemove(skill)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
      >
        <span className={selectedSkills.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
          {selectedSkills.length > 0 
            ? `${selectedSkills.length} skill${selectedSkills.length === 1 ? '' : 's'} selected`
            : 'Select skills...'
          }
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Skills List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredSkills.length > 0 ? (
              <div className="py-1">
                {filteredSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSkillSelect(skill)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 flex items-center space-x-2"
                  >
                    <Tag className="h-3 w-3 text-gray-400" />
                    <span>{skill}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                {searchTerm ? 'No skills found' : 'All skills selected'}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
            <div className="text-xs text-gray-500 text-center">
              {filteredSkills.length} skill{filteredSkills.length === 1 ? '' : 's'} available
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSkillsFilter;
