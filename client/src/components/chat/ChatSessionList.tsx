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

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Chat Sessions</h2>
          <span className="text-sm text-gray-500">({sessions.length})</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <div className="text-2xl mb-2">💭</div>
            <p className="text-sm">No chat sessions yet</p>
            <button
              onClick={onShowCreateForm}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Create your first session
            </button>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sessions.map(session => (
              <div
                key={session.id}
                className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                  currentSession?.id === session.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => selectSession(session.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {session.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(session.updatedAt)}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearHistory(session.id, session.name);
                      }}
                      className="p-1 text-gray-400 hover:text-orange-600"
                      title="Clear history"
                    >
                      🗑️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(session.id, session.name);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete session"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};