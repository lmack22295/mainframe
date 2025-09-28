import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: 'tasks' | 'chat';
  onTabChange: (tab: 'tasks' | 'chat') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentTab, onTabChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
                <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="transition-all duration-300 group-hover:translate-x-1">
                <h1 className="text-xl font-semibold text-slate-900 transition-colors duration-300 group-hover:text-purple-700">TaskFlow</h1>
                <p className="text-xs text-slate-500 hidden sm:block transition-colors duration-300 group-hover:text-purple-600">AI-Powered Task Management</p>
              </div>
            </div>

            <nav className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1 shadow-inner">
              <button
                onClick={() => onTabChange('tasks')}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 group overflow-hidden ${
                  currentTab === 'tasks'
                    ? 'bg-white text-slate-900 shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 hover:scale-105'
                }`}
              >
                {currentTab === 'tasks' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-md"></div>
                )}
                <div className="relative flex items-center space-x-2">
                  <svg className={`w-4 h-4 transition-all duration-300 ${
                    currentTab === 'tasks' ? 'text-purple-600 scale-110' : 'group-hover:scale-110 group-hover:text-purple-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="transition-all duration-300 group-hover:font-semibold">Tasks</span>
                </div>
                {currentTab === 'tasks' && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => onTabChange('chat')}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 group overflow-hidden ${
                  currentTab === 'chat'
                    ? 'bg-white text-slate-900 shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 hover:scale-105'
                }`}
              >
                {currentTab === 'chat' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-md"></div>
                )}
                <div className="relative flex items-center space-x-2">
                  <svg className={`w-4 h-4 transition-all duration-300 ${
                    currentTab === 'chat' ? 'text-purple-600 scale-110' : 'group-hover:scale-110 group-hover:text-purple-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="transition-all duration-300 group-hover:font-semibold">Chat</span>
                </div>
                {currentTab === 'chat' && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};