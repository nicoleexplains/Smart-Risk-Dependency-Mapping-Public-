
import React, { useState } from 'react';
import { Task } from '../types';

interface TaskFormProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ tasks, onAddTask }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(1);
  const [assignee, setAssignee] = useState('');
  const [dependencies, setDependencies] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !assignee) return;
    onAddTask({ name, duration, assignee, dependencies });
    setName('');
    setDuration(1);
    setAssignee('');
    setDependencies([]);
  };
  
  const toggleDependency = (taskId: string) => {
    setDependencies(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <h3 className="text-xl font-semibold text-sky-400 border-b border-slate-600 pb-2">Add New Task</h3>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300">Task Name</label>
        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
      </div>
       <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-300">Duration (days)</label>
            <input type="number" id="duration" value={duration} onChange={e => setDuration(Math.max(1, parseInt(e.target.value, 10)))} min="1" required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-slate-300">Assignee</label>
            <input type="text" id="assignee" value={assignee} onChange={e => setAssignee(e.target.value)} required className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
          </div>
       </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Dependencies</label>
        <div className="mt-2 max-h-32 overflow-y-auto bg-slate-900/50 p-2 rounded-md border border-slate-600 space-y-1">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center">
              <input id={`dep-${task.id}`} type="checkbox" checked={dependencies.includes(task.id)} onChange={() => toggleDependency(task.id)} className="h-4 w-4 text-sky-600 bg-slate-700 border-slate-500 rounded focus:ring-sky-500" />
              <label htmlFor={`dep-${task.id}`} className="ml-2 text-sm text-slate-300">{task.name} ({task.id})</label>
            </div>
          ))}
        </div>
      </div>
      <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">Add Task</button>
    </form>
  );
};


interface TaskListProps {
  tasks: Task[];
  onSelectTask: (taskId: string | null) => void;
  selectedTask: string | null;
  criticalPathTasks: Set<string>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onSelectTask, selectedTask, criticalPathTasks }) => {
  return (
    <div>
        <h3 className="text-xl font-semibold text-sky-400 border-b border-slate-600 pb-2 mb-4">Task List</h3>
        <ul className="space-y-2 max-h-[calc(100vh-450px)] overflow-y-auto">
            {tasks.map(task => {
                const isCritical = criticalPathTasks.has(task.id);
                const isSelected = selectedTask === task.id;
                return (
                    <li 
                        key={task.id} 
                        onClick={() => onSelectTask(isSelected ? null : task.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                          isSelected ? 'bg-sky-500/20 border-sky-500' : 'bg-slate-700/50 border-slate-700 hover:bg-slate-700'
                        }`}
                    >
                        <div className="flex justify-between items-center">
                            <p className={`font-semibold ${isCritical ? 'text-red-400' : 'text-slate-100'}`}>
                                {task.name}
                            </p>
                            {isCritical && <span className="text-xs font-bold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">CRITICAL</span>}
                        </div>
                        <p className="text-sm text-slate-400">
                            {task.assignee} - {task.duration} days
                        </p>
                    </li>
                );
            })}
        </ul>
    </div>
  )
}


interface TaskPanelProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onSelectTask: (taskId: string | null) => void;
  selectedTask: string | null;
  criticalPathTasks: Set<string>;
}

const TaskPanel: React.FC<TaskPanelProps> = ({ tasks, onAddTask, onSelectTask, selectedTask, criticalPathTasks }) => {
    return (
        <div>
            <TaskForm tasks={tasks} onAddTask={onAddTask} />
            <TaskList tasks={tasks} onSelectTask={onSelectTask} selectedTask={selectedTask} criticalPathTasks={criticalPathTasks} />
        </div>
    );
};

export default TaskPanel;
