import React, { useState } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import type { CreateTaskRequest } from '../../../../shared/types';

interface CreateTaskFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onClose, onSuccess }) => {
  const { createTask, loading } = useTaskStore();
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    notes: '',
    priority: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    await createTask({
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined,
      notes: formData.notes?.trim() || undefined,
      priority: formData.priority
    });

    onSuccess();
  };

  const handleChange = (field: keyof CreateTaskRequest, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="priority"
              checked={formData.priority}
              onChange={(e) => handleChange('priority', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="priority" className="text-sm text-gray-700">
              Add to weekly priority list
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 rounded-lg transition-colors"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};