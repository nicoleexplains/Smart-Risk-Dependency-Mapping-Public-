
export interface Task {
  id: string;
  name: string;
  duration: number; // in days
  assignee: string;
  dependencies: string[]; // array of task IDs
}

export interface Risk {
  taskId: string;
  taskName?: string;
  risk: string;
  recommendation: string;
}

export interface AnalysisResult {
  criticalPath: string[];
  healthScore: number;
  scoreReasoning: string;
  riskAnalysis: Risk[];
}

// For graph calculation
export interface ProcessedTask extends Task {
  startDate: number;
  endDate: number;
  level: number;
}
