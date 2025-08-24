import { useState } from 'react';
import type { Candidate } from '../types/candidate';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, ComposedChart, Area
} from 'recharts';
import { BarChart3, TrendingUp, MapPin, Users, Clock, Briefcase, Target } from 'lucide-react';

interface AnalyticsDashboardProps {
  allCandidates: Candidate[];
  selectedCandidates: Candidate[];
}

const AnalyticsDashboard = ({ allCandidates, selectedCandidates }: AnalyticsDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'locations' | 'salary' | 'availability' | 'experience'>('overview');
  const [dataScope, setDataScope] = useState<'all' | 'team'>('all');

  // Calculate location distribution
  const getLocationDistribution = (candidates: Candidate[]) => {
    const locationCounts: Record<string, number> = {};
    candidates.forEach(candidate => {
      locationCounts[candidate.location] = (locationCounts[candidate.location] || 0) + 1;
    });

    return Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([location, count]) => ({ location, count }));
  };

  // Calculate salary distribution with statistics
  const getSalaryDistribution = (candidates: Candidate[]) => {
    const salaryRanges = [
      { range: '$0-50k', min: 0, max: 50000, count: 0 },
      { range: '$50k-75k', min: 50000, max: 75000, count: 0 },
      { range: '$75k-100k', min: 75000, max: 100000, count: 0 },
      { range: '$100k-125k', min: 100000, max: 125000, count: 0 },
      { range: '$125k-150k', min: 125000, max: 150000, count: 0 },
      { range: '$150k+', min: 150000, max: Infinity, count: 0 },
    ];

    candidates.forEach(candidate => {
      const salaryStr = candidate.annual_salary_expectation["full-time"];
      if (salaryStr) {
        const salary = parseInt(salaryStr.replace(/[$,]/g, ''));
        const range = salaryRanges.find(r => salary >= r.min && salary < r.max);
        if (range) range.count++;
      }
    });

    return salaryRanges.filter(r => r.count > 0);
  };

  // Calculate salary statistics for box plot
  const getSalaryStatistics = (candidates: Candidate[]) => {
    const salaries = candidates
      .map(candidate => {
        const salaryStr = candidate.annual_salary_expectation["full-time"];
        return salaryStr ? parseInt(salaryStr.replace(/[$,]/g, '')) : 0;
      })
      .filter(salary => salary > 0)
      .sort((a, b) => a - b);

    if (salaries.length === 0) {
      return { min: 0, max: 0, median: 0, q1: 0, q3: 0, mean: 0, count: 0 };
    }

    const min = salaries[0];
    const max = salaries[salaries.length - 1];
    const median = salaries[Math.floor(salaries.length / 2)];
    const q1 = salaries[Math.floor(salaries.length * 0.25)];
    const q3 = salaries[Math.floor(salaries.length * 0.75)];
    const mean = Math.round(salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length);

    return { min, max, median, q1, q3, mean, count: salaries.length };
  };

  // Calculate work availability distribution
  const getWorkAvailabilityDistribution = (candidates: Candidate[]) => {
    const availabilityCounts: Record<string, number> = {};
    
    candidates.forEach(candidate => {
      candidate.work_availability.forEach((avail: string) => {
        availabilityCounts[avail] = (availabilityCounts[avail] || 0) + 1;
      });
    });

    return Object.entries(availabilityCounts)
      .map(([availability, count]) => ({ availability, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Calculate experience levels distribution
  const getExperienceLevelsDistribution = (candidates: Candidate[]) => {
    const experienceRanges = [
      { range: '0-2 years', min: 0, max: 2, count: 0 },
      { range: '3-5 years', min: 3, max: 5, count: 0 },
      { range: '6-8 years', min: 6, max: 8, count: 0 },
      { range: '9+ years', min: 9, max: Infinity, count: 0 },
    ];

    candidates.forEach(candidate => {
      const experience = candidate.work_experiences.length;
      const range = experienceRanges.find(r => experience >= r.min && experience <= r.max);
      if (range) range.count++;
    });

    return experienceRanges.filter(r => r.count > 0);
  };

  // Calculate roles per candidate distribution
  const getRolesPerCandidateDistribution = (candidates: Candidate[]) => {
    const roleCounts: Record<number, number> = {};
    
    candidates.forEach(candidate => {
      const roleCount = candidate.work_experiences.length;
      roleCounts[roleCount] = (roleCounts[roleCount] || 0) + 1;
    });

    return Object.entries(roleCounts)
      .map(([roles, count]) => ({ roles: parseInt(roles), count }))
      .sort((a, b) => a.roles - b.roles);
  };

  // Calculate team diversity metrics
  const getTeamDiversity = () => {
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

  // Get current dataset based on scope
  const currentDataset = dataScope === 'team' ? selectedCandidates : allCandidates;
  const isTeamMode = dataScope === 'team' && selectedCandidates.length > 0;

  const locationData = getLocationDistribution(currentDataset);
  const salaryData = getSalaryDistribution(currentDataset);
  const salaryStats = getSalaryStatistics(currentDataset);
  const availabilityData = getWorkAvailabilityDistribution(currentDataset);
  const experienceData = getExperienceLevelsDistribution(currentDataset);
  const rolesData = getRolesPerCandidateDistribution(currentDataset);
  const teamDiversity = getTeamDiversity();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-600 p-2 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            <p className="text-sm text-gray-600">
              {isTeamMode 
                ? `Team Analytics (${selectedCandidates.length} selected candidates)` 
                : `Overall Dataset Analytics (${allCandidates.length} total candidates)`
              }
            </p>
          </div>
        </div>

        {/* Data Scope Toggle */}
        {selectedCandidates.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Data Scope:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setDataScope('all')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  dataScope === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Data
              </button>
              <button
                onClick={() => setDataScope('team')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  dataScope === 'team'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Team Only
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'locations', label: 'Locations', icon: MapPin },
          { id: 'salary', label: 'Salary', icon: Users },
          { id: 'availability', label: 'Availability', icon: Clock },
          { id: 'experience', label: 'Experience', icon: Briefcase }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === id
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Team Diversity Metrics - Only show when in team mode */}
          {isTeamMode && teamDiversity && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Team Diversity Analysis
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">{teamDiversity.skillDiversity}%</div>
                  <div className="text-sm text-blue-700">Skill Diversity</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">{teamDiversity.locationDiversity}%</div>
                  <div className="text-sm text-green-700">Location Diversity</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-900">{teamDiversity.experienceDiversity}%</div>
                  <div className="text-sm text-yellow-700">Experience Diversity</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-900">{teamDiversity.overallDiversity}%</div>
                  <div className="text-sm text-purple-700">Overall Diversity</div>
                </div>
              </div>
            </div>
          )}

          {/* Experience Distribution */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Experience Distribution {isTeamMode && '(Team)'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={experienceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Salary Distribution */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Salary Distribution {isTeamMode && '(Team)'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === 'locations' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Location Distribution {isTeamMode && '(Team)'}
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ location, percent }) => `${location} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
              >
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {/* <Tooltip /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Salary Tab */}
      {activeTab === 'salary' && (
        <div className="space-y-6">
          {/* Salary Statistics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Salary Statistics {isTeamMode && '(Team)'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-900">${salaryStats.min.toLocaleString()}</div>
                <div className="text-sm text-blue-700">Min</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-900">${salaryStats.q1.toLocaleString()}</div>
                <div className="text-sm text-green-700">Q1 (25%)</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-900">${salaryStats.median.toLocaleString()}</div>
                <div className="text-sm text-yellow-700">Median</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-900">${salaryStats.mean.toLocaleString()}</div>
                <div className="text-sm text-orange-700">Mean</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-lg font-bold text-red-900">${salaryStats.q3.toLocaleString()}</div>
                <div className="text-sm text-red-700">Q3 (75%)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-900">${salaryStats.max.toLocaleString()}</div>
                <div className="text-sm text-purple-700">Max</div>
              </div>
            </div>
          </div>

          {/* Salary Distribution Chart */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Salary Range Distribution {isTeamMode && '(Team)'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
                <Area type="monotone" dataKey="count" fill="#82ca9d" fillOpacity={0.3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Availability Tab */}
      {activeTab === 'availability' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Work Availability Distribution {isTeamMode && '(Team)'}
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={availabilityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ availability, percent }) => `${availability} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
              >
                {availabilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Experience Tab */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          {/* Experience Levels Distribution */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Experience Levels Distribution {isTeamMode && '(Team)'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={experienceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Roles per Candidate Distribution */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Number of Roles per Candidate {isTeamMode && '(Team)'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rolesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="roles" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
