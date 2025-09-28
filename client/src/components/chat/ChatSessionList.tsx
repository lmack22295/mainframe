import React from 'react';
import type { ChatSession } from '../../../../shared/types';
import { useChatStore } from '../../stores/chatStore';

interface ChatSessionListProps {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  onShowCreateForm: () => void;
}

export const ChatSessionList: React.FC<ChatSessionListProps> = ({
  sessions,
  currentSession,
  onShowCreateForm
}) => {
  const { selectSession, deleteSession, clearHistory } = useChatStore();

  const handleDelete = async (sessionId: string, sessionName: string) => {
    if (window.confirm(`Are you sure you want to delete "${sessionName}"?`)) {
      await deleteSession(sessionId);
    }
  };

  const handleClearHistory = async (sessionId: string, sessionName: string) => {
    if (window.confirm(`Are you sure you want to clear all messages in "${sessionName}"?`)) {
      await clearHistory(sessionId);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (date: Date | string) => {
    const now = new Date();
    const sessionDate = new Date(date);
    const diffInHours = Math.abs(now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return formatDate(date);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h2 className="font-semibold text-slate-900">Conversations</h2>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {sessions.length}
          </span>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-slate-900 mb-2">No conversations yet</h3>
            <p className="text-sm text-slate-500 mb-4">Start your first AI conversation</p>
            <button
              onClick={onShowCreateForm}
              className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Chat
            </button>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {sessions.map(session => (
              <div
                key={session.id}
                className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  currentSession?.id === session.id
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 shadow-sm'
                    : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                }`}
                onClick={() => selectSession(session.id)}
              >
                {/* Active Indicator */}
                {currentSession?.id === session.id && (
                  <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r-full"></div>
                )}

                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 pl-2">
                    <h3 className={`font-medium truncate ${
                      currentSession?.id === session.id ? 'text-slate-900' : 'text-slate-800'
                    }`}>
                      {session.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatRelativeTime(session.updatedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearHistory(session.id, session.name);
                      }}
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                      title="Clear history"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(session.id, session.name);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete session"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Message Preview (placeholder) */}
                <div className="mt-2 pl-2">
                  <p className="text-xs text-slate-400 truncate">
                    Ready for conversation...
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {sessions.length > 0 && (
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onShowCreateForm}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-300 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Conversation
          </button>
        </div>
      )}
    </div>
  );
};