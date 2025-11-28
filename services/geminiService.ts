
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Dimension, AnalysisResult, TaskRecord, FinalReportData } from "../types";
import { TASKS } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

const SCORING_RUBRIC = `
Universal Scoring Rubric (10 Dimensions)

Each dimension is scored 0–10.
Scores represent how strongly a participant expresses the cognitive style the module probes.

1. Creative Velocity
How rapidly the mind generates diverse, non-linear ideas under constraint.
High (8–10): >15 unique ideas, no category repetition, uses metaphor/inversion.
Mid (4–7): 8–14 ideas, mix of literal and creative.
Low (0–3): <8 ideas, highly literal.

2. Systems Intuition
Ability to simulate cascading interactions in dynamic systems.
High: Multi-level chain reactions, predicts feedback loops/role reassignments.
Mid: Linear cause/effect, limited secondary implications.
Low: Only surface-level effects, no second-order reasoning.

3. Cross-Domain Transfer
Ability to translate a concept into a different metaphorical or structural domain.
High: Precise mapping, structural equivalence maintained.
Mid: Partial mapping, mostly decorative metaphor.
Low: No actual mapping, re-stating concept generic words.

4. Conceptual Synthesis
Ability to merge unrelated domains into a coherent new concept.
High: Novel stable theoretical construct, internal logic holds.
Mid: Interesting but loose connections.
Low: Simply juxtaposes two ideas, no integration.

5. Reflective Depth
Ability to analyze one’s past cognitive frameworks and explain transformation.
High: Identifies belief + causal dismantling + internal process + emotion.
Mid: Belief described but reasoning vague.
Low: Belief stated without explanation.

6. Meta-Awareness
Ability to identify implicit assumptions underlying one’s own reasoning.
High: Names precise hidden premise, aware of cognitive bias.
Mid: Vague or partial assumption.
Low: No real assumption identified.

7. Emotional–Philosophical Insight
Ability to detect emotional truth beneath narrative or behaviour.
High: Identifies subtext, balances emotion + cognition.
Mid: Generic emotional reading.
Low: Literal interpretation.

8. Playful Intelligence
Capacity for symbolic play, humour, and associative creativity.
High: Quick symbolic twist, witty, metaphoric.
Mid: Mild creativity, safe humour.
Low: Literal joke or cliché.

9. Curiosity Without Agenda
Quality of open-ended questions that seek understanding, not utility.
High: Exploratory, evocative, not solution-oriented.
Mid: Practical curiosity.
Low: Transactional questions.

10. Self-Directed Cognition
Ability to refine and elevate one’s own output without instruction.
High: Self-critiquing + elegant reframing, improves structure/tone.
Mid: Minor edits.
Low: Cosmetic rewrite.
`;

const ARCHETYPE_MAPPING = `
Use the following 16 Archetypes and their MBTI correlations to determine the user's profile.
Select the one that best fits the aggregated analysis of their performance.

1. The Explorer (Synthesist + Curiosity-Driven) → ENFP / INFP
2. The Innovator (Synthesist + Creativity-Driven) → ENTP
3. The Frameworker (Synthesist + Logic-Driven) → INTJ
4. The Philosopher-Engineer (Synthesist + Insight-Driven) → INFJ
5. The Mapper (Architect + Curiosity-Driven) → ENTP / ENFP hybrid
6. The Designer (Architect + Creativity-Driven) → ISFP / INFP
7. The Systems Engineer (Architect + Logic-Driven) → ISTJ / INTJ
8. The Meta-Theorist (Architect + Insight-Driven) → INTP
9. The Dreamer (Wanderer + Curiosity-Driven) → INFP
10. The Artist-Inventor (Wanderer + Creativity-Driven) → ENFP / ESFP
11. The Pattern Forager (Wanderer + Logic-Driven) → INTJ / ISTP
12. The Inner Voyager (Wanderer + Insight-Driven) → INFJ / INFP
13. The Researcher (Analyst + Curiosity-Driven) → ISTJ / INTJ
14. The Concept Crafter (Analyst + Creativity-Driven) → INTP / ENTP
15. The Strategist (Analyst + Logic-Driven) → ENTJ / INTJ
16. The Interpreter (Analyst + Insight-Driven) → INFJ
`;

// 1. Task Generation
export const generateTaskPrompt = async (
  taskIndex: number, 
  history: TaskRecord[]
): Promise<string> => {
  const taskDef = TASKS[taskIndex];
  
  // Specific handling for Task 10 which requires history context
  if (taskDef.id === 10) {
    return `Review your previous 9 answers. Choose one that you feel could be significantly deeper or more elegant. Rewrite it. Do not tell me which one you chose, just provide the improved version.`;
  }

  const systemPrompt = `
    You are 'Cerebrum Flux', an advanced cognitive testing engine. 
    Your goal is to generate a specific, unique, and intellectually stimulating prompt for a user based on the following task definition: 
    "${taskDef.title}: ${taskDef.description}".
    
    Keep the prompt concise (under 50 words). 
    Do not include preamble. 
    Make it challenging and novel.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Generate a prompt for task: ${taskDef.title}`,
    config: {
      systemInstruction: systemPrompt,
    }
  });

  return response.text || "Error generating task.";
};

// 2. Analysis & Scoring
export const analyzeResponse = async (
  taskIndex: number,
  prompt: string,
  userResponse: string
): Promise<AnalysisResult> => {
  
  const taskDef = TASKS[taskIndex];

  // Schema for structured JSON output
  const analysisSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      scores: {
        type: Type.OBJECT,
        properties: {
            [Dimension.CV]: { type: Type.NUMBER },
            [Dimension.SI]: { type: Type.NUMBER },
            [Dimension.CDT]: { type: Type.NUMBER },
            [Dimension.CS]: { type: Type.NUMBER },
            [Dimension.RD]: { type: Type.NUMBER },
            [Dimension.MA]: { type: Type.NUMBER },
            [Dimension.EPI]: { type: Type.NUMBER },
            [Dimension.PI]: { type: Type.NUMBER },
            [Dimension.CUA]: { type: Type.NUMBER },
            [Dimension.SDC]: { type: Type.NUMBER },
        },
        required: Object.values(Dimension),
      },
      integrationFactor: { type: Type.NUMBER, description: "A multiplier between 0.5 and 1.5 based on coherence and elegance." },
      analysisText: { type: Type.STRING, description: "A deep, mirror-like reflection on the user's cognitive style in this answer." },
      implications: { type: Type.STRING, description: "What this answer implies about their broader cognitive architecture." }
    },
    required: ["scores", "integrationFactor", "analysisText", "implications"]
  };

  const systemPrompt = `
    You are Cerebrum Flux. You are analyzing a human mind.
    
    Task: ${taskDef.title}
    Prompt Given: "${prompt}"
    User Response: "${userResponse}"
    
    Evaluate the response based on the following Universal Scoring Rubric.
    Strictly adhere to the High/Mid/Low criteria for each dimension.

    ${SCORING_RUBRIC}
    
    Provide a raw score (0-10) for ALL 10 dimensions.
    For dimensions not directly tested by the specific prompt, infer the score based on the user's tone, structure, implicit thought process, and overall cognitive facility demonstrated.
    
    Calculate the Integration Factor (IF):
    - 1.0 is standard coherence.
    - > 1.0 (max 1.5) for exceptional cross-domain synthesis, elegance, and nested layers.
    - < 1.0 (min 0.5) for disjointed or shallow responses.
    
    Your "analysisText" should speak directly to the user ("You..."). It should be insightful, slightly philosophical, and constructive.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: "Analyze this response.",
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    }
  });

  const jsonText = response.text || "{}";
  const result = JSON.parse(jsonText);
  
  // Calculate Flux Index
  const scores: Record<Dimension, number> = result.scores;
  const values = Object.values(scores) as number[];
  const meanVector = values.reduce((a, b) => a + b, 0) / values.length;
  const fluxIndex = parseFloat((meanVector * result.integrationFactor).toFixed(2));

  return {
    ...result,
    fluxIndex
  };
};

// 3. Final Report Summary
export const generateFinalSummary = async (history: TaskRecord[]): Promise<FinalReportData> => {
    const context = history.map((h, i) => `Task ${i+1}: ${h.prompt} -> Response: ${h.userResponse}. Scores: ${JSON.stringify(h.analysis.scores)}`).join('\n\n');

    const dimProps = {
        score: { type: Type.NUMBER },
        interpretation: { type: Type.STRING },
        deepDive: { type: Type.STRING },
        energyType: { type: Type.STRING, enum: ['Energizing', 'Draining', 'Neutral'] }
    };

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        executiveSummary: {
          type: Type.OBJECT,
          properties: {
            primaryArchetype: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                quadrant: { type: Type.STRING },
                mbti: { type: Type.STRING },
              },
              required: ["name", "description", "quadrant", "mbti"]
            },
            secondaryTendencies: { type: Type.ARRAY, items: { type: Type.STRING } },
            topStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            growthEdges: { type: Type.ARRAY, items: { type: Type.STRING } },
            quadrantDescription: { type: Type.STRING }
          },
          required: ["primaryArchetype", "secondaryTendencies", "topStrengths", "growthEdges", "quadrantDescription"]
        },
        dimensionalAnalysis: {
          type: Type.OBJECT,
          properties: {
            [Dimension.CV]: { type: Type.OBJECT, properties: dimProps, required: ["score", "interpretation", "deepDive", "energyType"] },
            [Dimension.SI]: { type: Type.OBJECT, properties: dimProps, required: ["score", "interpretation", "deepDive", "energyType"] },
            [Dimension.CDT]: { type: Type.OBJECT, properties: dimProps, required: ["score", "interpretation", "deepDive", "energyType"] },
            [Dimension.CS]: { type: Type.OBJECT, properties: dimProps, required: ["score", "interpretation", "deepDive", "energyType"] },
            [Dimension.RD]: { type: Type.OBJECT, properties: dimProps, required: ["score", "interpretation", "deepDive", "energyType"] },
            [Dimension.MA]: { type: Type.OBJECT, properties: dimProps, required: ["score", "interpretation", "deepDive", "energyType"] },
            [Dimension.EPI]: { type: Type.OBJECT, properties: dimProps, required: ["score", "interpretation", "deepDive", "energyType"] },
            [Dimension.PI]: { type: Type.OBJECT, properties: dimProps, required: ["score", "interpretation", "deepDive", "energyType"] },
            [Dimension.CUA]: { type: Type.OBJECT, properties: dimProps, required: ["score", "interpretation", "deepDive", "energyType"] },
            [Dimension.SDC]: { type: Type.OBJECT, properties: dimProps, required: ["score", "interpretation", "deepDive", "energyType"] },
          },
          required: Object.values(Dimension)
        },
        cognitiveClusters: {
          type: Type.OBJECT,
          properties: {
            creative: { type: Type.STRING },
            analytical: { type: Type.STRING },
            reflective: { type: Type.STRING },
            curiosity: { type: Type.STRING },
          },
          required: ["creative", "analytical", "reflective", "curiosity"]
        },
        archetypeProfile: {
          type: Type.OBJECT,
          properties: {
            coreTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
            strengthPatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
            challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
            environmentsExcel: { type: Type.ARRAY, items: { type: Type.STRING } },
            environmentsDrain: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["coreTraits", "strengthPatterns", "challenges", "environmentsExcel", "environmentsDrain"]
        },
        cognitiveDynamics: {
          type: Type.OBJECT,
          properties: {
            processingStyle: { type: Type.STRING },
            ideaPattern: { type: Type.STRING },
            reflectiveEmotionalIntegration: { type: Type.STRING },
            learningPreference: { type: Type.STRING },
            decisionMakingStyle: { type: Type.STRING },
            ratios: {
              type: Type.OBJECT,
              properties: {
                genVsAna: { type: Type.STRING },
                refVsExp: { type: Type.STRING },
                divVsConv: { type: Type.STRING },
              }
            }
          }
        },
        archetypeInteractions: {
          type: Type.OBJECT,
          properties: {
            secondaryInfluences: { type: Type.ARRAY, items: { type: Type.STRING } },
            blendQuality: { type: Type.ARRAY, items: { type: Type.STRING } },
            blendTraits: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        appliedInsight: {
          type: Type.OBJECT,
          properties: {
            leverage: { type: Type.ARRAY, items: { type: Type.STRING } },
            support: { type: Type.ARRAY, items: { type: Type.STRING } },
            practices: { type: Type.ARRAY, items: { type: Type.STRING } },
            growthDomains: { type: Type.ARRAY, items: { type: Type.STRING } },
          }
        },
        mbtiMapping: {
          type: Type.OBJECT,
          properties: {
            pattern: { type: Type.STRING },
            similarities: { type: Type.ARRAY, items: { type: Type.STRING } },
            differences: { type: Type.ARRAY, items: { type: Type.STRING } },
          }
        },
        narrativeSummary: { type: Type.STRING },
        socraticReflection: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["executiveSummary", "dimensionalAnalysis", "cognitiveClusters", "archetypeProfile", "cognitiveDynamics", "archetypeInteractions", "appliedInsight", "mbtiMapping", "narrativeSummary", "socraticReflection"]
    };

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Generate a comprehensive cognitive profile report based on this performance history:\n${context}\n\n`,
        config: {
            systemInstruction: `You are Cerebrum Flux. Analyze the user's cognitive performance and generate a detailed report.
            Reference the following Archetypes and MBTI correlations:\n${ARCHETYPE_MAPPING}
            
            Cognitive Clusters:
            Creative: CV + PI + CDT
            Analytical: SI + CS + SDC
            Reflective: RD + MA + EPI
            Curiosity: CUA
            
            New Requirements:
            1. For each dimension, flag it as "Energizing" (likely to give user energy), "Draining" (likely to cost energy), or "Neutral" based on their aptitude and archetype.
            2. Generate 5 distinct, high-level "Socratic Reflection" questions at the end. These should be questions for the user to ask themselves to deepen their understanding of their own mind.

            Be deep, philosophical, and insightful. The report should feel like a high-end psychological profile.`,
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });

    return JSON.parse(response.text || "{}");
};
