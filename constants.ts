
import { Task } from './types';

export const initialTasks: Task[] = [
  { id: 'T1', name: 'Project Kickoff & Planning', duration: 3, assignee: 'Alice', dependencies: [] },
  { id: 'T2', name: 'Setup Development Environment', duration: 2, assignee: 'Bob', dependencies: ['T1'] },
  { id: 'T3', name: 'Design UI/UX Mockups', duration: 5, assignee: 'Charlie', dependencies: ['T1'] },
  { id: 'T4', name: 'Develop Authentication Module', duration: 7, assignee: 'Bob', dependencies: ['T2', 'T3'] },
  { id: 'T5', name: 'Develop Core Feature A', duration: 10, assignee: 'Alice', dependencies: ['T4'] },
  { id: 'T6', name: 'Develop Core Feature B', duration: 8, assignee: 'David', dependencies: ['T4'] },
  { id: 'T7', name: 'Integrate Features A & B', duration: 4, assignee: 'Alice', dependencies: ['T5', 'T6'] },
  { id: 'T8', name: 'Quality Assurance Testing', duration: 6, assignee: 'Eve', dependencies: ['T7'] },
  { id: 'T9', name: 'User Acceptance Testing', duration: 3, assignee: 'Charlie', dependencies: ['T8'] },
  { id: 'T10', name: 'Deploy to Production', duration: 2, assignee: 'Bob', dependencies: ['T9'] },
];
