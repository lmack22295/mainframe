import React, { useState } from 'react';
import type { Task, TaskStatus } from '../../../../shared/types';
import { TaskStatus as TaskStatusValues } from '../../../../shared/types';
import { useTaskStore } from '../../stores/taskStore';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { updateTask, deleteTask, toggleTaskPriority } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [notes, setNotes] = useState(task.notes || '');

  const handleSave = async () => {
    await updateTask(task.id, {
      title,
      description: description || undefined,
      notes: notes || undefined
    });
    setIsEditing(false);
  };

  const handleStatusChange = async (status: TaskStatus) => {
    await updateTask(task.id, { status });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatusValues.TODO:
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case TaskStatusValues.IN_PROGRESS:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case TaskStatusValues.DONE:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatusValues.TODO:
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case TaskStatusValues.IN_PROGRESS:
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case TaskStatusValues.DONE:
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatRelativeTime = (date: Date | string) => {
    const now = new Date();
    const taskDate = new Date(date);
    const diffInHours = Math.abs(now.getTime() - taskDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return formatDate(date);
    }
  };

  return (
    <div className={`group relative bg-white border rounded-xl p-4 hover:shadow-md transition-all duration-200 ${
      task.priority
        ? 'border-amber-200 bg-gradient-to-r from-amber-50/50 to-white ring-1 ring-amber-100'
        : 'border-slate-200 hover:border-slate-300'
    }`}>
      {/* Priority Indicator */}
      {task.priority && (
        <div className="absolute top-0 left-4 w-8 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-b-sm"></div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
            {getStatusIcon(task.status)}
            {task.status.replace('_', ' ')}
          </span>
          {task.priority && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Priority
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button
            onClick={() => toggleTaskPriority(task.id)}
            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
              task.priority
                ? 'text-amber-600 hover:bg-amber-100 hover:shadow-md'
                : 'text-slate-400 hover:bg-slate-100 hover:text-amber-600 hover:shadow-md'
            }`}
            title={task.priority ? 'Remove from priority' : 'Add to priority'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-md"
            title="Edit task"
          >
            <svg className="w-4 h-4 transition-all duration-300 hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg text-slate-400 hover:bg-red-100 hover:text-red-600 transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-md"
            title="Delete task"
          >
            <svg className="w-4 h-4 transition-all duration-300 hover:rotate-12 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Task title"
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg h-20 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Description"
            />
          </div>
          <div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg h-16 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Notes"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setTitle(task.title);
                setDescription(task.description || '');
                setNotes(task.notes || '');
              }}
              className="inline-flex items-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="font-semibold text-slate-900 leading-tight">{task.title}</h3>

          {task.description && (
            <p className="text-slate-600 text-sm leading-relaxed">{task.description}</p>
          )}

          {task.notes && (
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-slate-600 text-xs leading-relaxed italic">{task.notes}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Created {formatRelativeTime(task.createdAt)}
            </span>

            <div className="flex gap-1">
              {Object.values(TaskStatusValues).map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    task.status === status
                      ? getStatusColor(status)
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent hover:border-slate-300'
                  }`}
                  title={`Mark as ${status.replace('_', ' ')}`}
                >
                  <div className="flex items-center gap-1">
                    {getStatusIcon(status)}
                    {status.replace('_', ' ')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};