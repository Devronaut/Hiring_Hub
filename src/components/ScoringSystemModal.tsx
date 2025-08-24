import React from 'react';
import { X, Star, Briefcase, GraduationCap, DollarSign, Target, TrendingUp, Award } from 'lucide-react';

interface ScoringSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScoringSystemModal: React.FC<ScoringSystemModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Candidate Scoring System</h2>
                <p className="text-gray-600 mt-1">Transparent, rule-based evaluation methodology</p>
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
        <div className="px-8 py-6 space-y-8">
          {/* Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>How It Works</span>
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Our data-driven scoring system evaluates candidates across multiple dimensions using 
              transparent, rule-based criteria. Each candidate receives a score from 0-100, calculated 
              using weighted factors that matter most for engineering roles. The algorithm is consistent, 
              objective, and provides clear insights into candidate strengths.
            </p>
          </div>

          {/* Scoring Breakdown */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Award className="h-5 w-5 text-gray-500" />
              <span>Scoring Breakdown</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills Score */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Skills Match</h4>
                    <div className="text-2xl font-bold text-blue-600">30 Points</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Required skills alignment</p>
                  <p>• Skill diversity bonus</p>
                  <p>• Technology stack relevance</p>
                  <p>• Industry-specific expertise</p>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              {/* Experience Score */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Work Experience</h4>
                    <div className="text-2xl font-bold text-purple-600">25 Points</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Years of experience</p>
                  <p>• Role complexity</p>
                  <p>• Company reputation</p>
                  <p>• Project scope</p>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              {/* Salary Score */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Salary Fit</h4>
                    <div className="text-2xl font-bold text-orange-600">20 Points</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Market competitiveness</p>
                  <p>• Budget alignment</p>
                  <p>• Experience value</p>
                  <p>• Location adjustment</p>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>

              {/* Education Score */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Education</h4>
                    <div className="text-2xl font-bold text-green-600">25 Points</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Degree level (15 pts)</p>
                  <p>• Field relevance</p>
                  <p>• School reputation</p>
                  <p>• Top 50 bonus (10 pts)</p>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Score Ranges */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Interpretation</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-green-600">80+</span>
                </div>
                <div className="font-medium text-gray-900">Excellent</div>
                <div className="text-sm text-gray-500">Top tier candidate</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-blue-600">60-79</span>
                </div>
                <div className="font-medium text-gray-900">Good</div>
                <div className="text-sm text-gray-500">Strong contender</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-yellow-600">40-59</span>
                </div>
                <div className="font-medium text-gray-900">Fair</div>
                <div className="text-sm text-gray-500">Consider if needed</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-red-600">0-39</span>
                </div>
                <div className="font-medium text-gray-900">Poor</div>
                <div className="text-sm text-gray-500">Not recommended</div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span>Pro Tips</span>
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• <strong>Use scores as guidance</strong> - they're objective but not absolute</p>
              <p>• <strong>Consider team diversity</strong> - balance high scores with varied backgrounds</p>
              <p>• <strong>Review breakdowns</strong> - understand why a candidate scored high/low</p>
              <p>• <strong>Combine with interviews</strong> - scores complement human judgment</p>
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
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
