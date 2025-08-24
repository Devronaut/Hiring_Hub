import { useState } from 'react';
import type { Candidate } from '../types/candidate';
import { Users, Target, MapPin, Briefcase, GraduationCap, X, TrendingUp, Award, Globe, BookOpen } from 'lucide-react';

interface TeamBuilderProps {
  selectedCandidates: Candidate[];
  onRemoveCandidate: (candidate: Candidate) => void;
}

const TeamBuilder = ({ selectedCandidates, onRemoveCandidate }: TeamBuilderProps) => {
  const [reasoning, setReasoning] = useState('');

  const calculateDiversityMetrics = () => {
    if (selectedCandidates.length === 0) return null;

    const skillDiversity = (new Set(selectedCandidates.flatMap(c => c.skills)).size / selectedCandidates.flatMap(c => c.skills).length) * 100;
    const locationDiversity = (new Set(selectedCandidates.map(c => c.location)).size / selectedCandidates.length) * 100;
    const experienceVariance = Math.max(...selectedCandidates.map(c => c.work_experiences.length)) - Math.min(...selectedCandidates.map(c => c.work_experiences.length));
    const experienceDiversity = Math.min((experienceVariance / 10) * 100, 100);
    const educationDiversity = (new Set(selectedCandidates.map(c => c.education.highest_level)).size / selectedCandidates.length) * 100;

    return {
      skillDiversity: Math.round(skillDiversity),
      locationDiversity: Math.round(locationDiversity),
      experienceDiversity: Math.round(experienceDiversity),
      educationDiversity: Math.round(educationDiversity),
      overallDiversity: Math.round((skillDiversity + locationDiversity + experienceDiversity + educationDiversity) / 4)
    };
  };

  const getTeamStrengths = () => {
    if (selectedCandidates.length === 0) return [];

    const skillCounts: Record<string, number> = {};
    selectedCandidates.forEach(candidate => {
      candidate.skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    return Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([skill, count]) => ({ skill, count }));
  };

  const diversityMetrics = calculateDiversityMetrics();
  const teamStrengths = getTeamStrengths();

  if (selectedCandidates.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <Users className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Your Team</h3>
        <p className="text-gray-600 mb-4">
          Select up to 5 candidates to build your diverse engineering team
        </p>
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <Target className="h-4 w-4" />
          <span>Click on candidate cards to select them</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Your Hiring Team</h3>
              <p className="text-green-100 text-sm">
                {selectedCandidates.length}/5 candidates selected
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{selectedCandidates.length}</div>
            <div className="text-green-100 text-sm">Team Size</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Diversity Metrics */}
        {diversityMetrics && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Team Diversity Analysis
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="bg-blue-100 p-2 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">{diversityMetrics.skillDiversity}%</div>
                <div className="text-sm text-blue-700">Skill Diversity</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="bg-green-100 p-2 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-900">{diversityMetrics.locationDiversity}%</div>
                <div className="text-sm text-green-700">Location Diversity</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="bg-yellow-100 p-2 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-yellow-900">{diversityMetrics.experienceDiversity}%</div>
                <div className="text-sm text-yellow-700">Experience Diversity</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="bg-purple-100 p-2 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-900">{diversityMetrics.educationDiversity}%</div>
                <div className="text-sm text-purple-700">Education Diversity</div>
              </div>
            </div>
            
            {/* Overall Diversity Score */}
            <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-lg text-white text-center">
              <div className="text-3xl font-bold mb-1">{diversityMetrics.overallDiversity}%</div>
              <div className="text-indigo-100">Overall Team Diversity Score</div>
            </div>
          </div>
        )}

        {/* Team Strengths */}
        {teamStrengths.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-600" />
              Team Strengths
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {teamStrengths.map(({ skill, count }) => (
                <div key={skill} className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-semibold text-gray-900">{skill}</div>
                  <div className="text-sm text-gray-600">{count} team members</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Candidates */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Selected Candidates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCandidates.map((candidate) => (
              <div key={candidate.email} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 truncate">{candidate.name}</h5>
                    <p className="text-sm text-gray-600">{candidate.location}</p>
                  </div>
                  <button
                    onClick={() => onRemoveCandidate(candidate)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    title="Remove candidate"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{candidate.work_experiences.length} roles</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{candidate.education.highest_level}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{candidate.skills.length} skills</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hiring Reasoning */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Hiring Justification</h4>
          <textarea
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            placeholder="Explain your team selection strategy and how it promotes diversity..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
            rows={4}
          />
          <div className="mt-2 text-sm text-gray-500">
            Describe how your selected team members complement each other and contribute to a diverse, high-performing engineering team.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-6">
          <button className="btn-success flex-1 flex items-center justify-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Finalize Team Selection</span>
          </button>
          <button className="btn-secondary flex-1 flex items-center justify-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Export Team Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamBuilder;
