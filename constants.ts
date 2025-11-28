import { Dimension, TaskDefinition } from './types';

export const DIMENSIONS_LIST = Object.values(Dimension);

export const TASKS: TaskDefinition[] = [
  {
    id: 1,
    title: "Creative Velocity Test",
    description: "Generate 20 ideas in 2 minutes on a specific topic.",
    dimensionFocus: [Dimension.CV, Dimension.PI],
    timeLimit: 120,
  },
  {
    id: 2,
    title: "Systems Intuition Task",
    description: "Predict behavior in a complex system when a component fails.",
    dimensionFocus: [Dimension.SI, Dimension.CS],
  },
  {
    id: 3,
    title: "Cross-Domain Transfer",
    description: "Explain a concept using a metaphor from a completely unrelated domain.",
    dimensionFocus: [Dimension.CDT, Dimension.CS],
  },
  {
    id: 4,
    title: "Conceptual Synthesis",
    description: "Merge two unrelated domains into a new stable concept.",
    dimensionFocus: [Dimension.CS, Dimension.CV],
  },
  {
    id: 5,
    title: "Reflective Depth Assessment",
    description: "Analyze a past belief shift.",
    dimensionFocus: [Dimension.RD, Dimension.EPI],
  },
  {
    id: 6,
    title: "Meta-Awareness Challenge",
    description: "Analyze the assumptions of your previous answer.",
    dimensionFocus: [Dimension.MA, Dimension.RD],
  },
  {
    id: 7,
    title: "Emotional–Philosophical Insight",
    description: "Identify the emotional truth within a vignette.",
    dimensionFocus: [Dimension.EPI, Dimension.RD],
  },
  {
    id: 8,
    title: "Playful Intelligence Test",
    description: "A joke, riddle, or metaphor reflecting your current state.",
    dimensionFocus: [Dimension.PI, Dimension.MA],
  },
  {
    id: 9,
    title: "Curiosity Without Agenda",
    description: "Formulate questions about random objects.",
    dimensionFocus: [Dimension.CUA, Dimension.PI],
  },
  {
    id: 10,
    title: "Self-Directed Cognition",
    description: "Choose a previous answer and improve it autonomously.",
    dimensionFocus: [Dimension.SDC, Dimension.MA],
  },
];

export const INITIAL_SCORES: Record<Dimension, number> = {
  [Dimension.CV]: 0,
  [Dimension.SI]: 0,
  [Dimension.CDT]: 0,
  [Dimension.CS]: 0,
  [Dimension.RD]: 0,
  [Dimension.MA]: 0,
  [Dimension.EPI]: 0,
  [Dimension.PI]: 0,
  [Dimension.CUA]: 0,
  [Dimension.SDC]: 0,
};