import React, { useEffect, useState } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { TaskItem } from './TaskItem';
import { CreateTaskForm } from './CreateTaskForm';
import type { TaskStatus } from '../../../../shared/types';
import { TaskStatus as TaskStatusValues } from '../../../../shared/types';

export const TaskList: React.FC = () => {
  const { tasks, loading, error, fetchTasks, clearError } = useTaskStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'priority' | 'status'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'priority') return task.priority;
    if (filter === 'status' && statusFilter !== 'all') return task.status === statusFilter;
    return true;
  });

  const priorityTasks = filteredTasks.filter(task => task.priority);
  const backlogTasks = filteredTasks.filter(task => !task.priority);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Task
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

      <div className="mb-6 flex gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'priority' | 'status')}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="all">All Tasks</option>
          <option value="priority">Priority Only</option>
          <option value="status">By Status</option>
        </select>

        {filter === 'status' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">All Statuses</option>
            <option value={TaskStatusValues.TODO}>Todo</option>
            <option value={TaskStatusValues.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatusValues.DONE}>Done</option>
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Weekly Priority ({priorityTasks.length})
          </h2>
          <div className="space-y-3">
            {priorityTasks.length === 0 ? (
              <p className="text-gray-500 italic">No priority tasks</p>
            ) : (
              priorityTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Backlog ({backlogTasks.length})
          </h2>
          <div className="space-y-3">
            {backlogTasks.length === 0 ? (
              <p className="text-gray-500 italic">No backlog tasks</p>
            ) : (
              backlogTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))
            )}
          </div>
        </div>
      </div>

      {showCreateForm && (
        <CreateTaskForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};