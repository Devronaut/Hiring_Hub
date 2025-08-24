import React, { useState } from 'react';
import { Menu, X, Star, BarChart3, Users } from 'lucide-react';

interface HeaderProps {
  onShowScoringSystem?: () => void;
  onShowBookmarks?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowScoringSystem, onShowBookmarks }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg relative">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hiring Hub</h1>
              <p className="text-blue-100 text-lg">Build Your Dream Engineering Team</p>
            </div>
          </div>

          {/* Right side - Sidebar Toggle */}
          <div className="relative">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Toggle navigation sidebar"
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>

            {/* Toggleable Sidebar */}
            {isSidebarOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    Navigation
                  </h3>
                  
                  {/* Scoring System Link */}
                  <button
                    onClick={() => {
                      onShowScoringSystem?.();
                      setIsSidebarOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-blue-50 rounded-lg transition-colors group"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Scoring System</div>
                      <div className="text-sm text-gray-500">How candidates are evaluated</div>
                    </div>
                  </button>

                  {/* Bookmarks Link */}
                  <button
                    onClick={() => {
                      onShowBookmarks?.();
                      setIsSidebarOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-blue-50 rounded-lg transition-colors group mt-2"
                  >
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Saved Candidates</div>
                      <div className="text-sm text-gray-500">View your bookmarks</div>
                    </div>
                  </button>

                  {/* Quick Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">Quick Stats</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded text-center">
                        <div className="font-medium text-gray-900">Total</div>
                        <div className="text-blue-600">975</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded text-center">
                        <div className="font-medium text-gray-900">Selected</div>
                        <div className="text-green-600">0/5</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </header>
  );
};
