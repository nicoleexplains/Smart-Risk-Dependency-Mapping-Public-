
import { GoogleGenAI, Type } from "@google/genai";
import { Task, AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


const responseSchema = {
    type: Type.OBJECT,
    properties: {
        criticalPath: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of task IDs representing the critical path of the project."
        },
        healthScore: {
            type: Type.NUMBER,
            description: "A score from 0 to 100 representing the project's health, where 100 is excellent."
        },
        scoreReasoning: {
            type: Type.STRING,
            description: "A brief explanation for the calculated health score."
        },
        riskAnalysis: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    taskId: { type: Type.STRING, description: "The ID of the high-risk task." },
                    taskName: { type: Type.STRING, description: "The name of the high-risk task." },
                    risk: { type: Type.STRING, description: "A description of the identified risk." },
                    recommendation: { type: Type.STRING, description: "A suggested action to mitigate the risk." }
                },
                required: ["taskId", "taskName", "risk", "recommendation"]
            },
            description: "An array of objects, each detailing a specific risk in the project plan."
        }
    },
    required: ["criticalPath", "healthScore", "scoreReasoning", "riskAnalysis"]
};


export const analyzeProject = async (tasks: Task[]): Promise<AnalysisResult> => {
  const model = "gemini-2.5-flash";
  const taskData = JSON.stringify(tasks, null, 2);

  const prompt = `
    You are an expert project management AI assistant. Your task is to analyze the provided project plan and identify potential risks and the critical path.

    Project Data (JSON format):
    ${taskData}

    Please perform the following analysis:
    1.  **Identify the Critical Path:** Determine the sequence of tasks that represents the longest path through the project, which determines the shortest possible project duration.
    2.  **Identify Risks & Weak Links:** Analyze the task distribution, dependencies, and assignees. Look for potential issues such as:
        -   A single person being a bottleneck (e.g., assigned to multiple concurrent critical tasks).
        -   An assignee being overloaded with too many tasks, even if they are not on the critical path.
        -   Complex dependency chains that are fragile to any single delay.
    3.  **Calculate Health Score:** Based on the severity and number of risks, provide a "Critical Path Health Score" from 0 (extremely high risk) to 100 (perfectly healthy).
    4.  **Provide Recommendations:** For each identified risk, suggest a concrete recommendation for a project manager to mitigate it.

    Return your complete analysis in a single, valid JSON object that strictly adheres to the provided schema. Ensure all task IDs and names in your response match the input data exactly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as AnalysisResult;
    
    // Post-processing to ensure task names are included for easier display
    result.riskAnalysis.forEach(risk => {
        const task = tasks.find(t => t.id === risk.taskId);
        if (task && !risk.taskName) {
            risk.taskName = task.name;
        }
    });

    return result;

  } catch (error) {
    console.error("Error analyzing project with Gemini API:", error);
    throw new Error("Failed to get analysis from AI. Please check the API key and project data.");
  }
};
