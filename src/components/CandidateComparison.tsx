import React from 'react';
import { X, Star, Briefcase, GraduationCap, DollarSign, MapPin, Mail, Phone } from 'lucide-react';
import type { Candidate } from '../types/candidate';
import { calculateCandidateScore, getScoreColor, getScoreLabel } from '../utils/scoring';

interface CandidateComparisonProps {
  candidates: Candidate[];
  isOpen: boolean;
  onClose: () => void;
  requiredSkills?: string[];
  targetSalary?: number;
}

export const CandidateComparison: React.FC<CandidateComparisonProps> = ({
  candidates,
  isOpen,
  onClose,
  requiredSkills = [],
  targetSalary
}) => {
  if (!isOpen || candidates.length === 0) return null;

  const maxCandidates = Math.min(candidates.length, 3);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Candidate Comparison</h2>
              <p className="text-gray-600 mt-1">Compare {candidates.length} candidates side-by-side</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 gap-8">
            {/* Basic Info Row */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Star className="h-5 w-5 text-gray-500" />
                <span>Basic Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.slice(0, maxCandidates).map((candidate, index) => {
                  const score = calculateCandidateScore(candidate, requiredSkills, targetSalary);
                  const scoreColor = getScoreColor(score.total);
                  
                  return (
                    <div key={candidate.email} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-xl font-bold text-white">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${scoreColor}`}>
                          {score.total}/100 - {getScoreLabel(score.total)}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{candidate.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{candidate.location}</span>
                        </div>
                        {candidate.phone && (
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{candidate.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skills Row */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Star className="h-5 w-5 text-gray-500" />
                <span>Skills & Expertise</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.slice(0, maxCandidates).map((candidate, index) => {
                  const score = calculateCandidateScore(candidate, requiredSkills, targetSalary);
                  
                  return (
                    <div key={candidate.email} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Skills Score</span>
                          <span className="text-sm font-bold text-blue-600">{score.skills}/30</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(score.skills / 30) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Experience Row */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <span>Work Experience</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.slice(0, maxCandidates).map((candidate, index) => {
                  const score = calculateCandidateScore(candidate, requiredSkills, targetSalary);
                  
                  return (
                    <div key={candidate.email} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Experience Score</span>
                          <span className="text-sm font-bold text-purple-600">{score.experience}/25</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(score.experience / 25) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{candidate.work_experiences.length} roles</span>
                        </div>
                        {candidate.work_experiences.slice(0, 3).map((exp, expIndex) => (
                          <div key={expIndex} className="text-xs text-gray-500">
                            <div className="font-medium">{exp.roleName}</div>
                            <div>{exp.company}</div>
                          </div>
                        ))}
                        {candidate.work_experiences.length > 3 && (
                          <div className="text-xs text-gray-400">
                            +{candidate.work_experiences.length - 3} more roles
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Education Row */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-gray-500" />
                <span>Education</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.slice(0, maxCandidates).map((candidate, index) => {
                  const score = calculateCandidateScore(candidate, requiredSkills, targetSalary);
                  
                  return (
                    <div key={candidate.email} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Education Score</span>
                          <span className="text-sm font-bold text-green-600">{score.education}/25</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(score.education / 25) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-900">
                          {candidate.education.highest_level}
                        </div>
                        {candidate.education.degrees.slice(0, 2).map((degree, degreeIndex) => (
                          <div key={degreeIndex} className="text-xs text-gray-600">
                            <div>{degree.degree} in {degree.subject}</div>
                            <div className="text-gray-500">{degree.school}</div>
                            {degree.isTop50 && (
                              <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full mt-1">
                                Top 50 School
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Salary Row */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <span>Salary Expectations</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.slice(0, maxCandidates).map((candidate, index) => {
                  const score = calculateCandidateScore(candidate, requiredSkills, targetSalary);
                  const salary = candidate.annual_salary_expectation["full-time"];
                  
                  return (
                    <div key={candidate.email} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Salary Score</span>
                          <span className="text-sm font-bold text-orange-600">{score.salary}/20</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(score.salary / 20) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {salary ? `$${parseInt(salary.replace(/[^0-9]/g, '')).toLocaleString()}` : 'Not specified'}
                        </div>
                        <div className="text-sm text-gray-500">Annual Salary</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-4 rounded-b-2xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Close Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
