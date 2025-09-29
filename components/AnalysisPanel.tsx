
import React from 'react';
import { AnalysisResult } from '../types';

const AlertTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const HealthScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  
  const getColor = () => {
    if (score > 75) return 'stroke-green-400';
    if (score > 40) return 'stroke-yellow-400';
    return 'stroke-red-500';
  };

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle className="text-slate-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
        <circle
          className={`transform -rotate-90 origin-center ${getColor()}`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
      </svg>
      <span className="absolute text-3xl font-bold">{score}</span>
    </div>
  );
};


interface AnalysisPanelProps {
  analysis: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  onAnalyze: () => void;
  taskCount: number;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isLoading, error, onAnalyze, taskCount }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-sky-400">AI Risk Analysis</h2>
          <p className="text-slate-400 mt-1">
            Proactively identify weak links and bottlenecks in your project plan.
          </p>
        </div>
        <button
          onClick={onAnalyze}
          disabled={isLoading || taskCount === 0}
          className="px-6 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-md hover:bg-sky-700 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            <span>Analyze Project Plan</span>
          )}
        </button>
      </div>

      {error && <div className="mt-4 bg-red-500/20 text-red-300 p-4 rounded-lg">{error}</div>}

      {!isLoading && !analysis && !error && (
        <div className="mt-6 text-center text-slate-400 bg-slate-900/40 p-6 rounded-lg">
          Click "Analyze Project Plan" to get an AI-powered health score and risk assessment.
        </div>
      )}
      
      {analysis && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center justify-center bg-slate-900/40 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-300 mb-2">Health Score</h3>
            <HealthScoreGauge score={analysis.healthScore} />
            <p className="text-sm text-slate-400 text-center mt-3">{analysis.scoreReasoning}</p>
          </div>
          <div className="md:col-span-2 bg-slate-900/40 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center">
              <AlertTriangleIcon className="w-5 h-5 mr-2 text-yellow-400" />
              High Priority Risks
            </h3>
            {analysis.riskAnalysis.length > 0 ? (
            <ul className="space-y-4 max-h-48 overflow-y-auto">
              {analysis.riskAnalysis.map((risk, index) => (
                <li key={index} className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-semibold text-slate-100">{risk.taskName || risk.taskId}</p>
                  <p className="text-sm text-yellow-300">{risk.risk}</p>
                  <p className="text-sm text-slate-400 mt-1">
                    <span className="font-medium text-slate-300">Recommendation:</span> {risk.recommendation}
                  </p>
                </li>
              ))}
            </ul>
            ) : (
                 <p className="text-slate-400">No major risks identified. Project looks healthy!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
