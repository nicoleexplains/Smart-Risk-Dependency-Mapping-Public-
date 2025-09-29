
import React, { useState, useCallback, useMemo } from 'react';
import { Task, AnalysisResult } from './types';
import { analyzeProject } from './services/geminiService';
import Header from './components/Header';
import TaskPanel from './components/TaskPanel';
import DependencyGraph from './components/DependencyGraph';
import AnalysisPanel from './components/AnalysisPanel';
import { initialTasks } from './constants';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    setTasks(prevTasks => [
      ...prevTasks,
      { ...newTask, id: `T${prevTasks.length + 1}` },
    ]);
  };

  const handleTriggerAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeProject(tasks);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [tasks]);

  const criticalPathTasks = useMemo(() => new Set(analysis?.criticalPath ?? []), [analysis]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <AnalysisPanel 
          analysis={analysis} 
          isLoading={isLoading} 
          error={error}
          onAnalyze={handleTriggerAnalysis}
          taskCount={tasks.length}
        />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
            <TaskPanel 
              tasks={tasks} 
              onAddTask={handleAddTask} 
              onSelectTask={setSelectedTask}
              selectedTask={selectedTask}
              criticalPathTasks={criticalPathTasks}
            />
          </div>
          <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 min-h-[400px]">
            <h2 className="text-2xl font-bold text-sky-400 mb-4">Project Timeline & Dependencies</h2>
            <DependencyGraph 
              tasks={tasks} 
              criticalPathTasks={criticalPathTasks} 
              selectedTask={selectedTask}
              onSelectTask={setSelectedTask}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
