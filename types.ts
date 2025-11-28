
export enum AppStage {
  WELCOME = 'WELCOME',
  GENERATING_TASK = 'GENERATING_TASK',
  TASK_ACTIVE = 'TASK_ACTIVE',
  ANALYZING = 'ANALYZING',
  TASK_RESULT = 'TASK_RESULT',
  FINAL_REPORT = 'FINAL_REPORT',
}

export enum Dimension {
  CV = 'Creative Velocity',
  SI = 'Systems Intuition',
  CDT = 'Cross-Domain Transfer',
  CS = 'Conceptual Synthesis',
  RD = 'Reflective Depth',
  MA = 'Meta-Awareness',
  EPI = 'Emotional & Philosophical Insight',
  PI = 'Playful Intelligence',
  CUA = 'Curiosity Without Agenda',
  SDC = 'Self-Directed Cognition',
}

export interface TaskDefinition {
  id: number;
  title: string;
  description: string;
  dimensionFocus: Dimension[];
  timeLimit?: number; // in seconds, if applicable
}

export interface AnalysisResult {
  scores: Record<Dimension, number>; // 0-10
  integrationFactor: number; // Multiplier, e.g., 0.8 - 1.5
  fluxIndex: number; // Calculated score
  analysisText: string;
  implications: string;
}

export interface TaskRecord {
  taskId: number;
  prompt: string;
  userResponse: string;
  analysis: AnalysisResult;
  timestamp: number;
}

export interface AppState {
  stage: AppStage;
  currentTaskIndex: number;
  history: TaskRecord[];
  currentPrompt: string | null;
}

export type EnergyType = 'Energizing' | 'Draining' | 'Neutral';

// Final Report Interfaces
export interface FinalReportData {
  executiveSummary: {
    primaryArchetype: {
      name: string;
      description: string;
      quadrant: string;
      mbti: string;
    };
    secondaryTendencies: string[];
    topStrengths: string[];
    growthEdges: string[];
    quadrantDescription: string;
  };
  dimensionalAnalysis: Record<string, {
    score: number;
    interpretation: string;
    deepDive: string;
    energyType: EnergyType;
  }>;
  cognitiveClusters: {
    creative: string;
    analytical: string;
    reflective: string;
    curiosity: string;
  };
  archetypeProfile: {
    coreTraits: string[];
    strengthPatterns: string[];
    challenges: string[];
    environmentsExcel: string[];
    environmentsDrain: string[];
  };
  cognitiveDynamics: {
    processingStyle: string;
    ideaPattern: string;
    reflectiveEmotionalIntegration: string;
    learningPreference: string;
    decisionMakingStyle: string;
    ratios: {
      genVsAna: string;
      refVsExp: string;
      divVsConv: string;
    }
  };
  archetypeInteractions: {
    secondaryInfluences: string[];
    blendQuality: string[];
    blendTraits: string[];
  };
  appliedInsight: {
    leverage: string[];
    support: string[];
    practices: string[];
    growthDomains: string[];
  };
  mbtiMapping: {
    pattern: string;
    similarities: string[];
    differences: string[];
  };
  narrativeSummary: string;
  socraticReflection: string[];
}
