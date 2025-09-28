import React, { useEffect, useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { ChatSessionList } from './ChatSessionList';
import { ChatWindow } from './ChatWindow';
import { CreateSessionForm } from './CreateSessionForm';

export const ChatInterface: React.FC = () => {
  const {
    sessions,
    currentSession,
    messages,
    loading,
    error,
    fetchSessions,
    clearError
  } = useChatStore();
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  if (loading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AI Chat</h1>
          <p className="text-slate-600 mt-1">Have conversations with AI assistants</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-280px)]">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ChatSessionList
            sessions={sessions}
            currentSession={currentSession}
            onShowCreateForm={() => setShowCreateForm(true)}
          />
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          {currentSession ? (
            <ChatWindow
              session={currentSession}
              messages={messages}
              loading={loading}
            />
          ) : (
            <div className="h-full bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md mx-auto p-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Start a Conversation</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Select an existing chat session from the sidebar or create a new one to begin chatting with AI assistants.
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Your First Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Session Modal */}
      {showCreateForm && (
        <CreateSessionForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};