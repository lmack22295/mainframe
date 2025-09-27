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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">LLM Chat Interface</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          New Chat Session
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        <div className="lg:col-span-1">
          <ChatSessionList
            sessions={sessions}
            currentSession={currentSession}
            onShowCreateForm={() => setShowCreateForm(true)}
          />
        </div>

        <div className="lg:col-span-3">
          {currentSession ? (
            <ChatWindow
              session={currentSession}
              messages={messages}
              loading={loading}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-medium mb-2">No Chat Session Selected</h3>
                <p className="text-sm">Select a chat session from the sidebar or create a new one to get started.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateForm && (
        <CreateSessionForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};