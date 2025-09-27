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
        return 'bg-gray-100 text-gray-800';
      case TaskStatusValues.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatusValues.DONE:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`border rounded-lg p-4 ${task.priority ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {task.priority && (
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => toggleTaskPriority(task.id)}
            className={`p-1 rounded ${task.priority ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 hover:text-gray-600'}`}
            title={task.priority ? 'Remove from priority' : 'Add to priority'}
          >
            ⭐
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-600"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Task title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 h-20"
            placeholder="Description"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 h-16"
            placeholder="Notes"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setTitle(task.title);
                setDescription(task.description || '');
                setNotes(task.notes || '');
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm mb-2">{task.description}</p>
          )}
          {task.notes && (
            <p className="text-gray-500 text-xs mb-2 italic">{task.notes}</p>
          )}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Created: {formatDate(task.createdAt)}</span>
            <div className="flex gap-1">
              {Object.values(TaskStatusValues).map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-2 py-1 rounded text-xs ${
                    task.status === status
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};