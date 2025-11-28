import { TaskRecord, Dimension, AnalysisResult } from '../types';

// Helper to create a simulated record
const createRecord = (taskId: number, prompt: string, response: string, scores: Partial<Record<Dimension, number>>, analysisText: string): TaskRecord => {
  const fullScores: Record<Dimension, number> = {
    [Dimension.CV]: 5, [Dimension.SI]: 5, [Dimension.CDT]: 5, [Dimension.CS]: 5,
    [Dimension.RD]: 5, [Dimension.MA]: 5, [Dimension.EPI]: 5, [Dimension.PI]: 5,
    [Dimension.CUA]: 5, [Dimension.SDC]: 5,
    ...scores
  };

  const vals = Object.values(fullScores);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const ifactor = 1.1; 

  return {
    taskId,
    prompt,
    userResponse: response,
    timestamp: Date.now(),
    analysis: {
      scores: fullScores,
      integrationFactor: ifactor,
      fluxIndex: parseFloat((mean * ifactor).toFixed(2)),
      analysisText: analysisText,
      implications: "Simulated example analysis."
    }
  };
};

export const EXAMPLE_PROFILES: { name: string, description: string, history: TaskRecord[] }[] = [
  // 1. EXPLORER
  {
    name: "The Explorer",
    description: "Curiosity-Driven Synthesist (ENFP/INFP)",
    history: [
      createRecord(1, "Generate 20 unique uses for a brick made entirely of ice in 2 minutes.", 
        "1. Ice sun-catcher 2. Temporary igloo brick 3. Slow-melt drink chiller 4. Prism light toy 5. Penguin footstool 6. Snow owl perch 7. Ice lantern mould 8. Winter festival ticket stamp 9. Bird bath cooler 10. Temporary fence post 11. Snow picnic seat 12. Campfire contrast art 13. Ice block printing 14. Melt-based timer 15. Meditation object 16. Glacier model block 17. Ice sound experiment 18. Climate education prop 19. Inuit craft teaching tool 20. Reflection surface for photography",
        {[Dimension.CV]: 9, [Dimension.PI]: 8}, 
        "Shows high divergent thinking with diverse categories."),
      createRecord(2, "Predict system behavior if Workers stop foraging.", 
        "Workers stop foraging → food shortage → queen’s pheromone pattern shifts → drones decrease mating flights → larvae receive less royal jelly → hive becomes heat-rich but resource-poor → behavioural agitation → premature queen cup construction → potential swarm collapse.",
        {[Dimension.SI]: 7, [Dimension.CS]: 8}, "Good chain reaction mapping."),
      createRecord(3, "Explain Inflation using baking metaphors.",
        "Inflation is like bread dough over-proofing: the air pockets (money supply) expand faster than the structure (goods/services), so everything looks bigger, but nothing is sturdier.",
        {[Dimension.CDT]: 9, [Dimension.CS]: 8}, "Excellent metaphorical mapping."),
      createRecord(4, "Merge Existentialism and Aerodynamics.",
        "Existential Aerodynamics: The self is a lifting body, generating meaning the same way wings generate lift — not by seeking a “correct” angle, but by shaping resistance into upward motion.",
        {[Dimension.CS]: 9, [Dimension.CV]: 8}, "Deep conceptual synthesis."),
      createRecord(5, "Reflect on a discarded belief.",
        "I used to believe hard work always led to good outcomes. Watching randomness shape people’s lives dismantled that.",
        {[Dimension.RD]: 7, [Dimension.EPI]: 7}, "Honest reflection."),
      createRecord(6, "Analyze assumptions of previous answer.",
        "My reasoning assumed that fairness was the default expectation.",
        {[Dimension.MA]: 7, [Dimension.RD]: 7}, "Good second-order thought."),
      createRecord(7, "Emotional truth of airport vignette.",
        "He smiles because he’s choosing not to leave. The meaning isn’t in the destination he skipped — it’s in recognising that staying is no longer an act of fear.",
        {[Dimension.EPI]: 8, [Dimension.RD]: 7}, "Insightful interpretation."),
      createRecord(8, "Metaphor for current state of mind.",
        "“My mind is a snow globe someone keeps gently shaking.”",
        {[Dimension.PI]: 9, [Dimension.MA]: 6}, "Playful and evocative."),
      createRecord(9, "Questions for 5 random objects.",
        "1. Which object was found last? 2. Do any share a history of decay? 3. Are these artefacts from one person’s life or many?",
        {[Dimension.CUA]: 10, [Dimension.PI]: 7}, "Highly curiosity-driven."),
      createRecord(10, "Improve a previous answer.",
        "Improved: Meaning is generated the same way lift arises — through the deliberate shaping of one’s interaction with resistance. Neither exists without friction.",
        {[Dimension.SDC]: 7, [Dimension.MA]: 7}, "Demonstrates autonomous revision.")
    ]
  },
  // 2. INNOVATOR
  {
    name: "The Innovator",
    description: "Creativity-Driven Synthesist (ENTP)",
    history: [
        createRecord(1, "Generate 20 unique uses for a brick made entirely of ice in 2 minutes.",
            "1. Ice LEGO 2. Musical chime 3. Temporary sculpture block 4. Drink marker 5. Light diffuser 6. Speed-run ice melt timer 7. Cold stamp for pottery 8. Fog generator 9. Thermal shock experiment 10. Snowball compression mould 11. Ice chess piece 12. Fractal carving 13. Water purification demo 14. Frozen relay race baton 15. Fish-smoker humidity block 16. Quick-melt graffiti art 17. Polar exhibit model 18. Temperature sensor housing 19. Holographic projection stand 20. Ice-lens prototype",
            {[Dimension.CV]: 10, [Dimension.PI]: 9}, "Extremely high velocity and novelty."),
        createRecord(2, "Predict system behavior if Workers stop foraging.",
            "Worker foraging halt → queen increases pheromone distress → drones become restless → larvae starve → emergency foraging attempts disrupt hive temperature → colony attempts risky brood cannibalism → eventual queen replacement.",
            {[Dimension.SI]: 8, [Dimension.CS]: 7}, "Systemic but focuses on disruption."),
        createRecord(3, "Explain Inflation using baking metaphors.",
            "Inflation is bread dough with too much yeast — everything expands, but the flavour doesn’t improve. You get more loaf, not more nourishment.",
            {[Dimension.CDT]: 8, [Dimension.CS]: 7}, "Clear, functional metaphor."),
        createRecord(4, "Merge Existentialism and Aerodynamics.",
            "Existential Lift Mechanics: Human meaning arises from intentional airflow — the choices we make create vortices of responsibility that lift us above inertia.",
            {[Dimension.CS]: 10, [Dimension.CV]: 9}, "Highly novel synthesis."),
        createRecord(5, "Reflect on a discarded belief.",
            "I believed ideas needed to be perfect before sharing. Building prototypes taught me that roughness is the birthplace of innovation.",
            {[Dimension.RD]: 6, [Dimension.EPI]: 6}, "Pragmatic reflection."),
        createRecord(6, "Analyze assumptions of previous answer.",
            "Assumption: That sharing imperfect ideas is inherently risky — which was never true.",
            {[Dimension.MA]: 7, [Dimension.RD]: 6}, "Direct identification of bias."),
        createRecord(7, "Emotional truth of airport vignette.",
            "His smile means the departure isn’t a loss but a liberation — he has outgrown the destination.",
            {[Dimension.EPI]: 7, [Dimension.RD]: 6}, "Liberation focused interpretation."),
        createRecord(8, "Metaphor for current state of mind.",
            "“My brain is juggling sparks and hoping one lands in a fuel tank.”",
            {[Dimension.PI]: 9, [Dimension.MA]: 7}, "Very high playful intelligence."),
        createRecord(9, "Questions for 5 random objects.",
            "1. How do these objects behave under heat? 2. Could they be components of a failed experiment? 3. Which one doesn’t belong — and why?",
            {[Dimension.CUA]: 8, [Dimension.PI]: 8}, "Experimental curiosity."),
        createRecord(10, "Improve a previous answer.",
            "Revision: More precise metaphor: Meaning is thrust. You accelerate through deliberate choice, not external approval.",
            {[Dimension.SDC]: 9, [Dimension.MA]: 7}, "Strong self-correction.")
    ]
  },
  // 3. FRAMEWORKER
  {
      name: "The Frameworker",
      description: "Logic-Driven Synthesist (INTJ)",
      history: [
          createRecord(1, "Generate 20 unique uses for a brick...", "1. Modular ice cube 2. Temperature calibration weight... 20. Reconfigurable cold barrier", {[Dimension.CV]: 6}, "Systematic ideation."),
          createRecord(2, "Predict system behavior...", "Worker halt → system loses intake flow → queen’s output unaffected → drones idle → larvae rationing → hive thermodynamic imbalance.", {[Dimension.SI]: 9, [Dimension.CS]: 8}, "Highly mechanistic."),
          createRecord(3, "Explain Inflation...", "Inflation is dough expanding because gas accumulates faster than gluten strengthens — structure can’t keep pace with expansion.", {[Dimension.CDT]: 8}, "Structural metaphor."),
          createRecord(4, "Merge Existentialism and Aerodynamics.", "Existential Aerodynamic Model: Meaning = Lift Coefficient × Choice Velocity × Angle of Authenticity.", {[Dimension.CS]: 9}, "Formulaic synthesis."),
          createRecord(5, "Reflect on discarded belief.", "I believed productivity equaled worth. Burnout showed me worth exists independently of output.", {[Dimension.RD]: 7}, "Values-based reflection."),
          createRecord(6, "Analyze assumptions.", "Assumption: That personal value is quantifiable.", {[Dimension.MA]: 8}, "Clear identification."),
          createRecord(7, "Emotional truth vignette.", "His smile reflects internal alignment: departure is optional, not compulsory.", {[Dimension.EPI]: 5}, "Analytical emotion."),
          createRecord(8, "Playful metaphor.", "“I’m a spreadsheet trying to relax.”", {[Dimension.PI]: 5}, "Dry humour."),
          createRecord(9, "Curiosity questions.", "1. What system links mechanical, biological, and symbolic degradation? 2. Are these artefacts arranged intentionally?", {[Dimension.CUA]: 7}, "Systemic curiosity."),
          createRecord(10, "Self-improvement.", "Revision: Meaning emerges when the angle between self-concept and action is minimal — reducing existential drag.", {[Dimension.SDC]: 8}, "Refined model.")
      ]
  },
  // 4. PHILOSOPHER-ENGINEER
  {
      name: "The Philosopher-Engineer",
      description: "Insight-Driven Synthesist (INFJ)",
      history: [
          createRecord(1, "Generate 20 unique uses...", "1. Symbol of impermanence 2. Meditation block... 20. Transience sculpture block", {[Dimension.CV]: 6, [Dimension.RD]: 8}, "Symbolic ideation."),
          createRecord(2, "Predict system behavior...", "Workers stop → hive collapses into existential crisis: structure exists, purpose evaporates.", {[Dimension.SI]: 8, [Dimension.CS]: 9}, "Telos-focused."),
          createRecord(3, "Explain Inflation...", "Inflation is bread that rises so quickly you can’t taste the grain anymore — form without substance.", {[Dimension.CDT]: 7}, "Meaning-focused."),
          createRecord(4, "Merge Existentialism and Aerodynamics.", "Aero-Existentialism: Meaning is drag: without resistance, we cannot orient ourselves. Flight requires friction; so does purpose.", {[Dimension.CS]: 9, [Dimension.EPI]: 8}, "Deep insight."),
          createRecord(5, "Reflect on discarded belief.", "I believed discomfort should be avoided. Life taught me discomfort is often the doorway to authenticity.", {[Dimension.RD]: 9}, "Deep reflection."),
          createRecord(6, "Analyze assumptions.", "Assumption: That avoiding discomfort is inherently preserving rather than restricting.", {[Dimension.MA]: 8}, "Insightful."),
          createRecord(7, "Emotional truth vignette.", "He smiles because he recognises the departure represents a life he no longer chooses.", {[Dimension.EPI]: 9}, "High emotional acuity."),
          createRecord(8, "Playful metaphor.", "“My mind is a kite held by a philosophical string.”", {[Dimension.PI]: 6}, "Metaphorical play."),
          createRecord(9, "Curiosity questions.", "1. What stories do these objects carry? 2. Which one contains the most sorrow?", {[Dimension.CUA]: 7}, "Narrative curiosity."),
          createRecord(10, "Self-improvement.", "Revision: More precise: Resistance is not the enemy — it is the surface upon which meaning generates lift.", {[Dimension.SDC]: 8}, "Elegant revision.")
      ]
  },
  // 5. MAPPER
  {
      name: "The Mapper",
      description: "Curiosity-Driven Architect (ENTP/ENFP)",
      history: [
          createRecord(1, "Generate 20 unique uses...", "1. Melt-sequencing marker... 20. Spatial measurement reference", {[Dimension.CV]: 7}, "Cartographic focus."),
          createRecord(2, "Predict system behavior...", "If workers stop foraging: The hive’s intake node collapses... stability replaces expansion.", {[Dimension.SI]: 8}, "Node-based reasoning."),
          createRecord(3, "Explain Inflation...", "Inflation is like dough inflated with too much warm air: it expands beyond the structural grid... the 'map' of bread stretches.", {[Dimension.CDT]: 7}, "Grid metaphor."),
          createRecord(4, "Merge Existentialism and Aerodynamics.", "Existential Aeromap: Meaning is navigation: airflow is uncertainty, and the self must constantly adjust direction.", {[Dimension.CS]: 8}, "Navigational synthesis."),
          createRecord(5, "Reflect on discarded belief.", "I believed life required clear long-term planning. Eventually I realised maps are approximations.", {[Dimension.RD]: 7}, "Planning vs Reality."),
          createRecord(6, "Analyze assumptions.", "I assumed predictability is possible and preferable.", {[Dimension.MA]: 8}, "Assumption of order."),
          createRecord(7, "Emotional truth vignette.", "He smiles because he has chosen a different path. The ticket is a map he no longer wants to follow.", {[Dimension.EPI]: 7}, "Path-based insight."),
          createRecord(8, "Playful metaphor.", "“My mind is a compass that keeps discovering new norths.”", {[Dimension.PI]: 7}, "Directional play."),
          createRecord(9, "Curiosity questions.", "1. Is there a pattern to their materials? 2. Do they map a timeline of decay?", {[Dimension.CUA]: 9}, "Pattern seeking."),
          createRecord(10, "Self-improvement.", "Revision: A clearer synthesis: Life’s map is always redrawn; meaning is an update, not a destination.", {[Dimension.SDC]: 8}, "Refined synthesis.")
      ]
  },
  // 6. DESIGNER
  {
      name: "The Designer",
      description: "Creativity-Driven Architect (ISFP/INFP)",
      history: [
          createRecord(1, "Generate 20 unique uses...", "1. Ice sculpture module... 20. Light-scattering surface", {[Dimension.CV]: 8}, "Aesthetic focus."),
          createRecord(2, "Predict system behavior...", "Worker stoppage collapses the hive’s design proportions... The hive’s balance tilts toward internal maintenance.", {[Dimension.SI]: 7}, "Proportion focused."),
          createRecord(3, "Explain Inflation...", "Inflation is dough expanding unevenly — air pockets grow faster than the dough’s structure can support, warping the design.", {[Dimension.CDT]: 7}, "Form focused."),
          createRecord(4, "Merge Existentialism and Aerodynamics.", "Existential Aesthetic Flow: Life’s meaning emerges from how we shape our motion through resistance.", {[Dimension.CS]: 8}, "Aesthetic synthesis."),
          createRecord(5, "Reflect on discarded belief.", "I used to believe beauty required symmetry. Then I realised asymmetry holds more honesty.", {[Dimension.RD]: 7}, "Aesthetic reflection."),
          createRecord(6, "Analyze assumptions.", "I assumed balance equals harmony, ignoring that irregularity creates character.", {[Dimension.MA]: 7}, "Harmony assumption."),
          createRecord(7, "Emotional truth vignette.", "He smiles because the design of his life has shifted — that flight no longer fits the architecture he wants to inhabit.", {[Dimension.EPI]: 7}, "Architectural emotion."),
          createRecord(8, "Playful metaphor.", "“My mind is a blueprint doodling on itself.”", {[Dimension.PI]: 7}, "Visual metaphor."),
          createRecord(9, "Curiosity questions.", "1. What design principle links these forms? 2. Which object disrupts the pattern?", {[Dimension.CUA]: 7}, "Form curiosity."),
          createRecord(10, "Self-improvement.", "Revision: Aesthetic truth: Meaning isn’t discovered — it’s crafted by shaping resistance elegantly.", {[Dimension.SDC]: 8}, "Elegant crafting.")
      ]
  },
  // 7. SYSTEMS ENGINEER
  {
      name: "The Systems Engineer",
      description: "Logic-Driven Architect (ISTJ/INTJ)",
      history: [
          createRecord(1, "Generate 20 unique uses...", "1. Thermal buffer... 20. Cold-state mechanical dummy", {[Dimension.CV]: 6}, "Functional focus."),
          createRecord(2, "Predict system behavior...", "Workers ceasing foraging eliminates the input channel... System enters degraded mode; thermal instability.", {[Dimension.SI]: 10}, "High systems intuition."),
          createRecord(3, "Explain Inflation...", "Inflation is bread dough with excess gas relative to structural capacity — volume increases, but mechanical integrity decreases.", {[Dimension.CDT]: 7}, "Mechanical metaphor."),
          createRecord(4, "Merge Existentialism and Aerodynamics.", "Existential Load Dynamics: Meaning behaves like lift-to-drag ratio. Purpose emerges from optimising the vector.", {[Dimension.CS]: 7}, "Engineering synthesis."),
          createRecord(5, "Reflect on discarded belief.", "I believed precision prevented mistakes. But experience proved mistakes generate the data precision relies on.", {[Dimension.RD]: 7}, "Process reflection."),
          createRecord(6, "Analyze assumptions.", "Assumption: That error-free operation is optimal; ignoring that iteration is necessary.", {[Dimension.MA]: 8}, "Optimization bias."),
          createRecord(7, "Emotional truth vignette.", "He smiles because his choice recalibrates his life — the flight was misaligned with his internal vector.", {[Dimension.EPI]: 5}, "Vector analysis."),
          createRecord(8, "Playful metaphor.", "“I’m a machine learning model waiting for better training data.”", {[Dimension.PI]: 4}, "Tech humour."),
          createRecord(9, "Curiosity questions.", "1. What system links organic decay and engineered materials? 2. How do their physical properties interact?", {[Dimension.CUA]: 7}, "Physical curiosity."),
          createRecord(10, "Self-improvement.", "Revision: Optimisation metaphor improved: Meaning = alignment between chosen trajectory and available energy.", {[Dimension.SDC]: 9}, "Optimized output.")
      ]
  },
  // 8. META-THEORIST
  {
      name: "The Meta-Theorist",
      description: "Insight-Driven Architect (INTP)",
      history: [
          createRecord(1, "Generate 20 unique uses...", "1. Symbol of entropy... 20. Aesthetic of becoming", {[Dimension.CV]: 7}, "Abstract focus."),
          createRecord(2, "Predict system behavior...", "Workers stopping reveals the hive’s philosophical architecture: function supersedes identity... collapse of its own telos.", {[Dimension.SI]: 8}, "Philosophical systems."),
          createRecord(3, "Explain Inflation...", "Inflation is bread swelling beyond the conceptual framework that names it “bread” — form stretching faster than meaning.", {[Dimension.CDT]: 8}, "Conceptual metaphor."),
          createRecord(4, "Merge Existentialism and Aerodynamics.", "Aerodynamic Absurdism: The self generates lift only by confronting the drag of meaninglessness.", {[Dimension.CS]: 9}, "Absurdist synthesis."),
          createRecord(5, "Reflect on discarded belief.", "I believed meaning could be found. I now understand meaning is constructed.", {[Dimension.RD]: 9}, "Constructivist reflection."),
          createRecord(6, "Analyze assumptions.", "Assumption: That meaning is intrinsic rather than emergent.", {[Dimension.MA]: 9}, "High meta-awareness."),
          createRecord(7, "Emotional truth vignette.", "He smiles because the act of not boarding is a declaration of agency. He transcends the narrative imposed by the ticket.", {[Dimension.EPI]: 7}, "Agency focus."),
          createRecord(8, "Playful metaphor.", "“My mind is Schrödinger’s snowflake — melting and not melting.”", {[Dimension.PI]: 6}, "Quantum play."),
          createRecord(9, "Curiosity questions.", "1. What ontology links material decay to human memory? 2. Do they share a phenomenological origin?", {[Dimension.CUA]: 8}, "Ontological curiosity."),
          createRecord(10, "Self-improvement.", "Revision: More accurate: Meaninglessness is not the absence of lift — it is the atmosphere through which authentic flight is possible.", {[Dimension.SDC]: 9}, "High refinement.")
      ]
  },
  // 9. DREAMER
  {
    name: "The Dreamer",
    description: "Curiosity-Driven Wanderer (INFP)",
    history: [
        createRecord(1, "Generate 20 unique uses...", "1. Ice poem tablet... 20. Cold symbol of passing moments", {[Dimension.CV]: 9, [Dimension.PI]: 9}, "Poetic and imaginative."),
        createRecord(2, "Predict system behavior...", "If workers stop foraging, the hive becomes a womb with no heartbeat...", {[Dimension.SI]: 4, [Dimension.CS]: 6}, "Metaphorical system view."),
        createRecord(3, "Explain Inflation...", "Inflation is dough dreaming itself into a bigger shape — puffing with hope...", {[Dimension.CDT]: 9}, "Abstract transfer."),
        createRecord(4, "Merge Existentialism and Aerodynamics.", "Aero-Existential Drift: The soul glides like a feather in shifting currents...", {[Dimension.CS]: 8}, "Lyrical synthesis."),
        createRecord(5, "Reflect on discarded belief.", "I believed stability meant safety. But the most transformative moments were unstable...", {[Dimension.RD]: 9}, "Deep reflection."),
        createRecord(6, "Analyze assumptions.", "I assumed safety was a fixed location rather than an inner orientation.", {[Dimension.MA]: 8}, "Profound meta-awareness."),
        createRecord(7, "Emotional truth vignette.", "He smiles because the flight takes off without him... He is choosing arrival over departure.", {[Dimension.EPI]: 10}, "Exceptional emotional insight."),
        createRecord(8, "Metaphor for current state.", "“My mind is a soap bubble floating through warm twilight.”", {[Dimension.PI]: 9}, "Beautiful imagery."),
        createRecord(9, "Curiosity questions.", "1. Which of these objects once held someone’s sorrow? 2. What would they whisper?", {[Dimension.CUA]: 10}, "Emotional curiosity."),
        createRecord(10, "Improve answer.", "Revision: More poetic: Stability isn’t a shelter—it’s a rhythm the heart learns...", {[Dimension.SDC]: 6}, "Aesthetic revision.")
    ]
  },
  // 10. ARTIST-INVENTOR
  {
      name: "The Artist-Inventor",
      description: "Creativity-Driven Wanderer (ENFP/ESFP)",
      history: [
          createRecord(1, "Generate 20 unique uses...", "1. Ice brush for painting... 20. Performance art object", {[Dimension.CV]: 10}, "Artistic focus."),
          createRecord(2, "Predict system behavior...", "When workers stop, the hive becomes a badly tuned orchestra... the queen conducts silence.", {[Dimension.SI]: 5}, "Musical metaphor."),
          createRecord(3, "Explain Inflation...", "Inflation is bread that rises like an ego—swelling dramatically, but delivering the same small crumb of truth.", {[Dimension.CDT]: 8}, "Ego metaphor."),
          createRecord(4, "Merge Existentialism and Aerodynamics.", "Existential Aeroperformance: Life is improvisation in turbulent air—the dance between meaning and motion.", {[Dimension.CS]: 7}, "Performance synthesis."),
          createRecord(5, "Reflect on discarded belief.", "I believed art needed to impress others. Now I create to breathe, not to be applauded.", {[Dimension.RD]: 8}, "Artistic growth."),
          createRecord(6, "Analyze assumptions.", "Assumption: That external validation defines artistic worth.", {[Dimension.MA]: 7}, "Validation check."),
          createRecord(7, "Emotional truth vignette.", "The smile is relief—he no longer needs to chase the horizon to feel alive.", {[Dimension.EPI]: 8}, "Relief focus."),
          createRecord(8, "Playful metaphor.", "“I’m a paintbrush dipped in caffeine.”", {[Dimension.PI]: 10}, "High energy."),
          createRecord(9, "Curiosity questions.", "1. What emotional palette do these objects share? 2. Could they be props?", {[Dimension.CUA]: 9}, "Creative curiosity."),
          createRecord(10, "Self-improvement.", "Revision: Art isn’t performed for the wind—it moves with it.", {[Dimension.SDC]: 7}, "Expressive revision.")
      ]
  },
  // 11. PATTERN FORAGER
  {
      name: "The Pattern Forager",
      description: "Logic-Driven Wanderer (INTJ/ISTP)",
      history: [
          createRecord(1, "Generate 20 unique uses...", "1. Pattern echo block... 20. Phase-transition comparator", {[Dimension.CV]: 7}, "Pattern focus."),
          createRecord(2, "Predict system behavior...", "Workers stop → temperature rises → honey stores deplete → chaos oscillates before collapse.", {[Dimension.SI]: 8}, "Oscillation focus."),
          createRecord(3, "Explain Inflation...", "Inflation is dough overfilling its container—expansion surpassing boundaries, distorting patterns.", {[Dimension.CDT]: 8}, "Boundary metaphor."),
          createRecord(4, "Merge Existentialism and Aerodynamics.", "Existential Aeropatterns: A life observed from above shows turbulence that feels random up close.", {[Dimension.CS]: 7}, "Scale-based synthesis."),
          createRecord(5, "Reflect on discarded belief.", "I believed patterns always revealed truth. But some patterns are noise wearing a mask.", {[Dimension.RD]: 7}, "Pattern skepticism."),
          createRecord(6, "Analyze assumptions.", "Assumption: That all correlations imply meaning.", {[Dimension.MA]: 8}, "Correlation check."),
          createRecord(7, "Emotional truth vignette.", "He smiles because his internal model finally aligns with reality— staying is the stable solution.", {[Dimension.EPI]: 6}, "Model alignment."),
          createRecord(8, "Playful metaphor.", "“My mind is sorting snowflakes alphabetically.”", {[Dimension.PI]: 7}, "Sorting play."),
          createRecord(9, "Curiosity questions.", "1. What hidden sequence links their materials? 2. Do decay rates follow a correlation?", {[Dimension.CUA]: 9}, "Sequential curiosity."),
          createRecord(10, "Self-improvement.", "Revision: More accurate: Patterns reveal meaning only when interpreted within the correct frame.", {[Dimension.SDC]: 7}, "Frame adjustment.")
      ]
  },
  // 12. INNER VOYAGER
  {
      name: "The Inner Voyager",
      description: "Insight-Driven Wanderer (INFJ/INFP)",
      history: [
          createRecord(1, "Generate 20 unique uses...", "1. Ice memory stone... 20. Frozen breath metaphor", {[Dimension.CV]: 7}, "Emotional focus."),
          createRecord(2, "Predict system behavior...", "Workers cease → hive enters grief-like stasis... The hive experiences a kind of collective waiting.", {[Dimension.SI]: 5}, "Emotional system."),
          createRecord(3, "Explain Inflation...", "Inflation is bread rising with more air than substance—fullness that feels empty.", {[Dimension.CDT]: 8}, "Feeling metaphor."),
          createRecord(4, "Merge Existentialism and Aerodynamics.", "Existential Aero-Compassion: Meaning is the lift generated when the heart meets resistance tenderly.", {[Dimension.CS]: 8}, "Compassionate synthesis."),
          createRecord(5, "Reflect on discarded belief.", "I believed vulnerability was weakness. Being loved during moments of collapse proved the opposite.", {[Dimension.RD]: 10}, "Deep vulnerability."),
          createRecord(6, "Analyze assumptions.", "Assumption: That strength is defined by self-containment, not connection.", {[Dimension.MA]: 8}, "Connection focus."),
          createRecord(7, "Emotional truth vignette.", "His smile is quiet acceptance—he no longer runs from what he feels. Staying is an act of emotional courage.", {[Dimension.EPI]: 10}, "High courage."),
          createRecord(8, "Playful metaphor.", "“My mind is a lantern glowing under deep water.”", {[Dimension.PI]: 7}, "Deep imagery."),
          createRecord(9, "Curiosity questions.", "1. Which of these objects carries the greatest emotional residue? 2. Could these be offerings?", {[Dimension.CUA]: 8}, "Residue curiosity."),
          createRecord(10, "Self-improvement.", "Revision: Stronger phrasing: Vulnerability wasn’t weakness — it was the aerodynamics of connection.", {[Dimension.SDC]: 7}, "Stronger phrasing.")
      ]
  },
  // 13. RESEARCHER
  {
      name: "The Researcher",
      description: "Curiosity-Driven Analyst (ISTJ/INTJ)",
      history: [
          createRecord(1, "Generate 20 unique uses...", "1. Cold-sterile sample press... 20. Temporary material placeholder", {[Dimension.CV]: 7, [Dimension.PI]: 3}, "Highly structured."),
          createRecord(2, "Predict system behavior...", "Workers stop foraging → food supply becomes fixed... colony survival probability plummets.", {[Dimension.SI]: 9}, "Precise causal chain."),
          createRecord(3, "Explain Inflation...", "Inflation is dough accumulating gas molecules faster than the gluten network can bind them.", {[Dimension.CDT]: 7}, "Technical metaphor."),
          createRecord(4, "Merge Existentialism and Aerodynamics.", "Existential Aerodynamic Model 2.0: Meaning = f(Choice × Velocity × Resistance).", {[Dimension.CS]: 8}, "Formulaic."),
          createRecord(5, "Reflect on discarded belief.", "I used to believe truth was objective and static. Longitudinal studies showed truth is often contextual.", {[Dimension.RD]: 7}, "Analytical reflection."),
          createRecord(6, "Analyze assumptions.", "Assumption: That empirical evidence always maps directly onto lived experience.", {[Dimension.MA]: 7}, "Epistemological bias."),
          createRecord(7, "Emotional truth vignette.", "He smiles because he made a controlled decision: staying aligns better with his internal cost–benefit matrix.", {[Dimension.EPI]: 5}, "Rational analysis."),
          createRecord(8, "Playful metaphor.", "“My mind is a laboratory where the beakers occasionally flirt.”", {[Dimension.PI]: 5}, "Controlled humour."),
          createRecord(9, "Curiosity questions.", "1. What variables link these items? 2. Are their decay rates comparable?", {[Dimension.CUA]: 9}, "Scientific curiosity."),
          createRecord(10, "Self-improvement.", "Revision: More rigorous model: Meaning arises from optimally aligning internal values with external constraints.", {[Dimension.SDC]: 9}, "Enhances precision.")
      ]
  },
  // 14. CONCEPT CRAFTER
  {
      name: "The Concept Crafter",
      description: "Creativity-Driven Analyst (INTP/ENTP)",
      history: [
          createRecord(1, "Generate 20 unique uses...", "1. Ice metaphor cube... 20. Embodied analogy object", {[Dimension.CV]: 8}, "Conceptual focus."),
          createRecord(2, "Predict system behavior...", "Worker halt → system loses external grounding → pantry becomes a metaphor for insufficient epistemic resources.", {[Dimension.SI]: 7}, "Epistemic system."),
          createRecord(3, "Explain Inflation...", "Inflation is bread dough whose metaphorical “meaning density” dilutes — more shape, less substance.", {[Dimension.CDT]: 8}, "Density metaphor."),
          createRecord(4, "Merge Existentialism and Aerodynamics.", "Existential Lift Theory: Aerodynamics teaches that shape meets wind; existentialism teaches that choice meets chaos.", {[Dimension.CS]: 9}, "Theory building."),
          createRecord(5, "Reflect on discarded belief.", "I used to believe contradictions were errors. Now I see they are doorways to deeper concepts.", {[Dimension.RD]: 8}, "Paradox reflection."),
          createRecord(6, "Analyze assumptions.", "Assumption: That coherence is inherently superior to paradox.", {[Dimension.MA]: 8}, "Coherence check."),
          createRecord(7, "Emotional truth vignette.", "He smiles because he realised the departure narrative no longer fits the conceptual story of his life.", {[Dimension.EPI]: 6}, "Narrative fit."),
          createRecord(8, "Playful metaphor.", "“My mind is a thesaurus chasing butterflies.”", {[Dimension.PI]: 7}, "Wordplay."),
          createRecord(9, "Curiosity questions.", "1. Do these items share a thematic resonance? 2. What conceptual framework unites them?", {[Dimension.CUA]: 8}, "Framework curiosity."),
          createRecord(10, "Self-improvement.", "Revision: Paradox isn’t noise — it’s the friction that generates conceptual lift.", {[Dimension.SDC]: 8}, "Conceptual refinement.")
      ]
  },
  // 15. STRATEGIST
  {
      name: "The Strategist",
      description: "Logic-Driven Analyst (ENTJ/INTJ)",
      history: [
          createRecord(1, "Generate 20 unique uses...", "1. Ice boundary marker... 20. Environmental variable marker", {[Dimension.CV]: 6}, "Strategic focus."),
          createRecord(2, "Predict system behavior...", "Worker stoppage creates a systemic choke point... No subsystem can compensate.", {[Dimension.SI]: 9}, "Choke point analysis."),
          createRecord(3, "Explain Inflation...", "Inflation is dough rising out of proportion—volume expansion without structural strategy. More loaf, less leverage.", {[Dimension.CDT]: 7}, "Leverage metaphor."),
          createRecord(4, "Merge Existentialism and Aerodynamics.", "Strategic Aero-Existentialism: Purpose = optimising trajectory under constraint.", {[Dimension.CS]: 7}, "Optimization focus."),
          createRecord(5, "Reflect on discarded belief.", "I used to believe every problem needed a planned solution. Experience taught me some problems require letting go.", {[Dimension.RD]: 7}, "Control reflection."),
          createRecord(6, "Analyze assumptions.", "Assumption: That control always produces better outcomes.", {[Dimension.MA]: 8}, "Control bias."),
          createRecord(7, "Emotional truth vignette.", "He smiles because not boarding is his strategic choice — an optimisation of values over momentum.", {[Dimension.EPI]: 5}, "Strategic choice."),
          createRecord(8, "Playful metaphor.", "“I’m a chessboard where the pieces keep negotiating with each other.”", {[Dimension.PI]: 4}, "Game metaphor."),
          createRecord(9, "Curiosity questions.", "1. What is the governing principle linking their functions? 2. Which object offers leverage?", {[Dimension.CUA]: 7}, "Leverage curiosity."),
          createRecord(10, "Self-improvement.", "Revision: Better phrasing: Sometimes the optimal move is declining to play.", {[Dimension.SDC]: 9}, "Optimal move.")
      ]
  },
  // 16. INTERPRETER
  {
      name: "The Interpreter",
      description: "Insight-Driven Analyst (INFJ)",
      history: [
          createRecord(1, "Generate 20 unique uses...", "1. Ice symbol for suppressed emotion... 20. Water-born meaning carrier", {[Dimension.CV]: 7}, "Interpretive focus."),
          createRecord(2, "Predict system behavior...", "Workers stop → hive enters interpretive crisis. Queen signals urgency but cannot translate function into action.", {[Dimension.SI]: 7}, "Communication focus."),
          createRecord(3, "Explain Inflation...", "Inflation is bread whose rising exaggerates its promise — abundance that feels increasingly hollow.", {[Dimension.CDT]: 8}, "Hollow metaphor."),
          createRecord(4, "Merge Existentialism and Aerodynamics.", "Aero-Interpretive Existentialism: Meaning is reading the wind while resisting its push.", {[Dimension.CS]: 8}, "Reading the wind."),
          createRecord(5, "Reflect on discarded belief.", "I believed emotions should be explained, not experienced. Then I learned that explanation without experience is avoidance.", {[Dimension.RD]: 9}, "Deep experience."),
          createRecord(6, "Analyze assumptions.", "Assumption: That emotional distance equals clarity.", {[Dimension.MA]: 8}, "Clarity bias."),
          createRecord(7, "Emotional truth vignette.", "He smiles because staying is an honest conversation with himself — one he avoided for years.", {[Dimension.EPI]: 9}, "Honest conversation."),
          createRecord(8, "Playful metaphor.", "“My mind is a decoder ring dipped in sentiment.”", {[Dimension.PI]: 6}, "Decoder play."),
          createRecord(9, "Curiosity questions.", "1. What emotional residue do these objects hold? 2. Which one is carrying the heaviest silence?", {[Dimension.CUA]: 8}, "Silence curiosity."),
          createRecord(10, "Self-improvement.", "Revision: Emotional clarity is not analysis — it is allowed presence.", {[Dimension.SDC]: 8}, "Presence focus.")
      ]
  }
];