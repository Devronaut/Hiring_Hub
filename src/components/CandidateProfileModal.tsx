import React from 'react';
import { X, Mail, Phone, MapPin, Briefcase, Calendar, GraduationCap, Building, Clock, DollarSign, Star, Globe } from 'lucide-react';
import type { Candidate } from '../types/candidate';

interface CandidateProfileModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  candidate,
  isOpen,
  onClose
}) => {
  if (!isOpen || !candidate) return null;

  const annualSalary = candidate.annual_salary_expectation["full-time"] || 'Not specified';
  const getExperienceLevel = (experiences: any[]) => {
    if (experiences.length >= 5) return { level: 'Senior', color: 'bg-purple-100 text-purple-700' };
    if (experiences.length >= 2) return { level: 'Mid-Level', color: 'bg-blue-100 text-blue-700' };
    return { level: 'Junior', color: 'bg-green-100 text-green-700' };
  };

  const { level, color } = getExperienceLevel(candidate.work_experiences);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{candidate.name}</h2>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                    {level} Level
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {annualSalary !== 'Not specified' 
                      ? `$${parseInt(annualSalary.replace(/[^0-9]/g, '')).toLocaleString()}` 
                      : 'Not specified'
                    }
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-8 relative">
          {/* Contact & Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span>Contact Information</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{candidate.email}</span>
                </div>
                {candidate.phone && (
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3 text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{candidate.location}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span>Work Availability</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.work_availability.map((availability, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    {availability}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Star className="h-5 w-5 text-gray-500" />
              <span>Skills & Expertise</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {candidate.skills.map((skill, index) => (
                <span key={index} className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Work Experience Timeline */}
          <div className="relative">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-gray-500" />
              <span>Work Experience Timeline</span>
            </h3>
            <div className="space-y-6">
              {candidate.work_experiences.map((exp, index) => (
                <div key={index} className="relative">
                  {/* Timeline Line - Only show between items, positioned well below header */}
                  {index < candidate.work_experiences.length - 1 && (
                    <div className="absolute left-6 top-20 w-0.5 h-16 bg-gray-200"></div>
                  )}
                  
                  {/* Timeline Dot - positioned well below header */}
                  <div className="absolute left-5 top-8 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                  
                  {/* Content */}
                  <div className="ml-12">
                    <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{exp.roleName}</h4>
                          <div className="flex items-center space-x-2 text-gray-600 mt-1">
                            <Building className="h-4 w-4" />
                            <span className="font-medium">{exp.company}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Experience #{index + 1}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-gray-500" />
              <span>Education</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidate.education.degrees.map((degree, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">{degree.degree}</span>
                    </div>
                    {degree.isTop50 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>Top 50</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-700">
                    <div><span className="font-medium">Subject:</span> {degree.subject}</div>
                    <div><span className="font-medium">School:</span> {degree.school}</div>
                    <div><span className="font-medium">GPA:</span> {degree.gpa}</div>
                    <div><span className="font-medium">Duration:</span> {degree.startDate} - {degree.endDate}</div>
                    {degree.originalSchool && (
                      <div><span className="font-medium">Original:</span> {degree.originalSchool}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Highest Education Level:</span> {candidate.education.highest_level}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>Application Details</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Submitted:</span> {new Date(candidate.submitted_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Globe className="h-5 w-5 text-gray-500" />
                <span>Location & Availability</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-700 space-y-1">
                  <div><span className="font-medium">Location:</span> {candidate.location}</div>
                  <div><span className="font-medium">Availability:</span> {candidate.work_availability.join(', ')}</div>
                </div>
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
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
