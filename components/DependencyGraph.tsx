
import React, { useMemo } from 'react';
import { Task, ProcessedTask } from '../types';

const calculateTaskPositions = (tasks: Task[]): { processedTasks: ProcessedTask[], totalDays: number } => {
  if (tasks.length === 0) {
    return { processedTasks: [], totalDays: 0 };
  }

  const taskMap = new Map<string, Task>(tasks.map(t => [t.id, t]));
  const processedTasksMap = new Map<string, ProcessedTask>();

  function processTask(taskId: string): ProcessedTask {
    if (processedTasksMap.has(taskId)) {
      return processedTasksMap.get(taskId)!;
    }

    const task = taskMap.get(taskId);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    let startDate = 0;
    let level = 0;

    if (task.dependencies.length > 0) {
      const parentEndDates = task.dependencies.map(depId => {
        const parentTask = processTask(depId);
        return parentTask.endDate;
      });
      const parentLevels = task.dependencies.map(depId => processTask(depId).level);
      startDate = Math.max(...parentEndDates);
      level = Math.max(...parentLevels) + 1;
    }

    const processedTask: ProcessedTask = {
      ...task,
      startDate,
      endDate: startDate + task.duration,
      level,
    };

    processedTasksMap.set(taskId, processedTask);
    return processedTask;
  }

  tasks.forEach(task => processTask(task.id));

  const processedTasks = Array.from(processedTasksMap.values()).sort((a,b) => a.startDate - b.startDate || a.level - b.level);
  const totalDays = Math.max(...processedTasks.map(t => t.endDate), 0);
  
  return { processedTasks, totalDays };
};


interface DependencyGraphProps {
  tasks: Task[];
  criticalPathTasks: Set<string>;
  selectedTask: string | null;
  onSelectTask: (taskId: string | null) => void;
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({ tasks, criticalPathTasks, selectedTask, onSelectTask }) => {
  const { processedTasks, totalDays } = useMemo(() => calculateTaskPositions(tasks), [tasks]);

  if (tasks.length === 0) {
    return <div className="text-center text-slate-400">Add tasks to see the project timeline.</div>
  }

  const DAY_WIDTH = 40;
  const ROW_HEIGHT = 50;
  const BAR_HEIGHT = 24;
  const PADDING = 20;

  const width = totalDays * DAY_WIDTH + PADDING * 2;
  const height = processedTasks.length * ROW_HEIGHT + PADDING * 2;

  const taskPositions = new Map(processedTasks.map((task, i) => [task.id, {
    x: task.startDate * DAY_WIDTH + PADDING,
    y: i * ROW_HEIGHT + PADDING,
    width: task.duration * DAY_WIDTH
  }]));

  return (
    <div className="w-full h-full overflow-auto">
      <svg width={width} height={height} className="font-sans">
        {/* Grid Lines */}
        <g className="grid-lines">
          {Array.from({ length: totalDays + 1 }).map((_, i) => (
            <g key={`day-${i}`}>
              <line
                x1={i * DAY_WIDTH + PADDING}
                y1={PADDING - 10}
                x2={i * DAY_WIDTH + PADDING}
                y2={height}
                className="stroke-slate-700"
                strokeWidth="1"
              />
               <text x={i * DAY_WIDTH + PADDING + 5} y={PADDING-5} className="text-xs fill-slate-500">Day {i}</text>
            </g>
          ))}
        </g>
        
        {/* Dependency Lines */}
        <g className="dependency-lines">
          {processedTasks.map(task => {
            const taskPos = taskPositions.get(task.id);
            if (!taskPos) return null;
            
            return task.dependencies.map(depId => {
              const depPos = taskPositions.get(depId);
              if (!depPos) return null;

              const isCritical = criticalPathTasks.has(task.id) && criticalPathTasks.has(depId);
              const isSelected = selectedTask === task.id || selectedTask === depId;

              const pathData = `M ${depPos.x + depPos.width} ${depPos.y + BAR_HEIGHT / 2} 
                                C ${depPos.x + depPos.width + DAY_WIDTH/2} ${depPos.y + BAR_HEIGHT / 2},
                                  ${taskPos.x - DAY_WIDTH/2} ${taskPos.y + BAR_HEIGHT / 2},
                                  ${taskPos.x} ${taskPos.y + BAR_HEIGHT / 2}`;
              
              return (
                <path
                  key={`${depId}-${task.id}`}
                  d={pathData}
                  className={`
                    stroke-2 fill-none transition-all
                    ${isCritical ? 'stroke-red-500/80' : 'stroke-slate-500/80'}
                    ${isSelected ? 'stroke-[3px] stroke-sky-400' : ''}
                  `}
                  markerEnd="url(#arrowhead)"
                />
              );
            });
          })}
        </g>
        
        {/* Task Bars */}
        <g className="task-bars">
          {processedTasks.map((task, i) => {
            const isCritical = criticalPathTasks.has(task.id);
            const isSelected = selectedTask === task.id;
            const pos = taskPositions.get(task.id);
            if (!pos) return null;
            
            return (
              <g key={task.id} transform={`translate(${pos.x}, ${pos.y})`} className="cursor-pointer" onClick={() => onSelectTask(isSelected ? null : task.id)}>
                <rect
                  width={pos.width}
                  height={BAR_HEIGHT}
                  rx="6"
                  ry="6"
                  className={`
                    transition-all duration-200
                    ${isCritical ? 'fill-red-500/50 stroke-red-400' : 'fill-sky-500/30 stroke-sky-400'}
                    ${isSelected ? 'stroke-2 stroke-white' : 'stroke-1'}
                  `}
                />
                <text x="10" y={BAR_HEIGHT / 2 + 5} className="text-sm fill-white font-medium select-none" style={{pointerEvents: "none"}}>
                  {task.name}
                </text>
              </g>
            );
          })}
        </g>
        
        <defs>
          <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5"
              markerUnits="strokeWidth" markerWidth="8" markerHeight="6"
              orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default DependencyGraph;
