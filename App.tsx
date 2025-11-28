import React, { useState, useEffect } from 'react';
import { AppStage, AppState, TaskRecord, Dimension, FinalReportData } from './types';
import { TASKS, INITIAL_SCORES } from './constants';
import { generateTaskPrompt, analyzeResponse } from './services/geminiService';
import { TaskView } from './components/TaskView';
import { AnalysisView } from './components/AnalysisView';
import { FinalReport } from './components/FinalReport';
import { EXAMPLE_PROFILES } from './data/examples';

const STORAGE_KEY = 'cerebrum_flux_state';

// Helper Component for Guide Content
const GuideContent = () => (
  <div className="space-y-12 text-slate-300 leading-relaxed font-light text-left">
    
    {/* 01. Philosophy */}
    <section>
      <h3 className="text-xl text-white font-medium mb-4 border-b border-slate-700 pb-2 flex items-center">
        <span className="text-flux-accent mr-2">01.</span> Philosophy
      </h3>
      <p>
        Standard intelligence tests measure processing speed, working memory, and pattern recognition within fixed rule sets. 
        <strong className="text-white"> Cerebrum Flux</strong> measures <strong>Cognitive Agility</strong>—the ability to shift frameworks, 
        generate novel connections, and integrate disparate types of reasoning (logic, emotion, systems, creativity).
      </p>
      <p className="mt-2 text-flux-glow italic">It is not a test of what you know, but how you think.</p>
    </section>

    {/* 02. Key Features */}
    <section>
        <h3 className="text-xl text-white font-medium mb-4 border-b border-slate-700 pb-2 flex items-center">
            <span className="text-flux-accent mr-2">02.</span> Key Features
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50">
                <strong className="text-white block mb-2 text-base">🧠 The 10-Dimension Cognitive Engine</strong>
                <p className="text-slate-400">Guides users through 10 interactive modules probing specific "muscles" of the mind like Creative Velocity, Systems Intuition, and Reflective Depth.</p>
            </div>
            <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50">
                <strong className="text-white block mb-2 text-base">📊 Dynamic Analysis & Scoring</strong>
                <p className="text-slate-400">Uses a unique Flux Metric (Raw Score × Integration Factor) rather than bell curves. Provides real-time philosophical feedback and dynamic radar visualizations.</p>
            </div>
            <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50">
                <strong className="text-white block mb-2 text-base">🧬 Archetype Profiling</strong>
                <p className="text-slate-400">Maps users to 16 Unique Profiles based on Quadrants (Synthesist, Architect, etc.) and Drivers. Outputs comprehensive narrative reports.</p>
            </div>
            <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50">
                <strong className="text-white block mb-2 text-base">📝 Exportable Artifacts</strong>
                <p className="text-slate-400">Download self-contained HTML reports with interactive charts and full session transcripts, or raw JSON data for archival.</p>
            </div>
        </div>
    </section>

    {/* 03. The 10 Dimensions & Table */}
    <section>
      <h3 className="text-xl text-white font-medium mb-4 border-b border-slate-700 pb-2 flex items-center">
        <span className="text-flux-accent mr-2">03.</span> The 10 Dimensions & Tasks
      </h3>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm mb-8">
        <div><strong className="text-white block mb-1">1. Creative Velocity (CV)</strong><p className="text-slate-400">Speed and diversity of divergent thinking.</p></div>
        <div><strong className="text-white block mb-1">2. Systems Intuition (SI)</strong><p className="text-slate-400">Modeling complex dynamic cascades.</p></div>
        <div><strong className="text-white block mb-1">3. Cross-Domain Transfer (CDT)</strong><p className="text-slate-400">Mapping metaphors across unrelated fields.</p></div>
        <div><strong className="text-white block mb-1">4. Conceptual Synthesis (CS)</strong><p className="text-slate-400">Merging opposing ideas into new concepts.</p></div>
        <div><strong className="text-white block mb-1">5. Reflective Depth (RD)</strong><p className="text-slate-400">Analyzing personal belief shifts and causality.</p></div>
        <div><strong className="text-white block mb-1">6. Meta-Awareness (MA)</strong><p className="text-slate-400">Identifying implicit assumptions in reasoning.</p></div>
        <div><strong className="text-white block mb-1">7. Emotional Insight (EPI)</strong><p className="text-slate-400">Reading subtext, intent, and emotional truth.</p></div>
        <div><strong className="text-white block mb-1">8. Playful Intelligence (PI)</strong><p className="text-slate-400">Wit, symbolic play, and cognitive flexibility.</p></div>
        <div><strong className="text-white block mb-1">9. Curiosity Without Agenda (CUA)</strong><p className="text-slate-400">Quality of inquiry vs utility.</p></div>
        <div><strong className="text-white block mb-1">10. Self-Directed Cognition (SDC)</strong><p className="text-slate-400">Autonomous revision and self-critique.</p></div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-left border-collapse bg-slate-800/30">
            <thead>
                <tr className="border-b border-slate-700 text-slate-400 bg-slate-800">
                    <th className="py-3 px-4 font-medium uppercase tracking-wider text-xs">Module</th>
                    <th className="py-3 px-4 font-medium uppercase tracking-wider text-xs">Example Task Evidence</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr><td className="py-3 px-4 text-flux-accent font-mono">Creative Velocity</td><td className="py-3 px-4">20 unique uses for an ice brick</td></tr>
                <tr><td className="py-3 px-4 text-flux-accent font-mono">Systems Intuition</td><td className="py-3 px-4">Predicting hive behavior cascade</td></tr>
                <tr><td className="py-3 px-4 text-flux-accent font-mono">Cross-Domain Transfer</td><td className="py-3 px-4">Inflation explained via baking metaphor</td></tr>
                <tr><td className="py-3 px-4 text-flux-accent font-mono">Conceptual Synthesis</td><td className="py-3 px-4">Merging Existentialism + Aerodynamics</td></tr>
                <tr><td className="py-3 px-4 text-flux-accent font-mono">Reflective Depth</td><td className="py-3 px-4">Analysis of discarded belief</td></tr>
                <tr><td className="py-3 px-4 text-flux-accent font-mono">Meta-Awareness</td><td className="py-3 px-4">Analysis of assumptions & self-correction</td></tr>
                <tr><td className="py-3 px-4 text-flux-accent font-mono">Emotional Insight</td><td className="py-3 px-4">Airport vignette interpretation</td></tr>
                <tr><td className="py-3 px-4 text-flux-accent font-mono">Playful Intelligence</td><td className="py-3 px-4">Snow globe metaphor, playful ideation</td></tr>
                <tr><td className="py-3 px-4 text-flux-accent font-mono">Curiosity (No Agenda)</td><td className="py-3 px-4">Questions for random objects</td></tr>
                <tr><td className="py-3 px-4 text-flux-accent font-mono">Self-Directed Cognition</td><td className="py-3 px-4">Revision of prior answers</td></tr>
            </tbody>
        </table>
      </div>
    </section>

    {/* 04. Scoring Architecture */}
    <section>
      <h3 className="text-xl text-white font-medium mb-4 border-b border-slate-700 pb-2 flex items-center">
        <span className="text-flux-accent mr-2">04.</span> Scoring Architecture
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <h4 className="text-flux-accent font-mono text-xs uppercase mb-2">Raw Scores (0–10)</h4>
          <p className="text-sm text-slate-400">Evaluated against complexity, novelty, and coherence. <br/>0-3 (Literal) · 4-7 (Competent) · 8-10 (Transformative)</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <h4 className="text-flux-accent font-mono text-xs uppercase mb-2">Integration Factor</h4>
          <p className="text-sm text-slate-400">Multiplier (0.5x – 1.5x) assessing how well different dimensions blend. Rewards holistic reasoning.</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <h4 className="text-flux-accent font-mono text-xs uppercase mb-2">Flux Index (FXI)</h4>
          <p className="text-sm text-slate-400">Final composite score.<br/><span className="font-mono text-xs bg-slate-900 px-1 py-0.5 rounded text-slate-300">Mean(Dims) × Integration</span></p>
        </div>
      </div>
    </section>

    {/* 05. The Archetype System */}
    <section>
      <h3 className="text-xl text-white font-medium mb-4 border-b border-slate-700 pb-2 flex items-center">
        <span className="text-flux-accent mr-2">05.</span> The Archetype System
      </h3>
      <p className="mb-6">Users are mapped to one of 16 Archetypes based on the intersection of their <strong>Quadrant</strong> (Primary Mode) and <strong>Driver</strong> (Motivation).</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-white font-bold text-sm mb-3">The Four Quadrants</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start"><span className="text-flux-accent mr-2">▸</span> <span><strong>Synthesist:</strong> Big-picture, systems, meaning.</span></li>
            <li className="flex items-start"><span className="text-flux-accent mr-2">▸</span> <span><strong>Architect:</strong> Structure, design, coherence.</span></li>
            <li className="flex items-start"><span className="text-flux-accent mr-2">▸</span> <span><strong>Wanderer:</strong> Intuition, narrative, feeling.</span></li>
            <li className="flex items-start"><span className="text-flux-accent mr-2">▸</span> <span><strong>Analyst:</strong> Logic, precision, optimization.</span></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-3">The Four Drivers</h4>
           <ul className="space-y-2 text-sm">
            <li className="flex items-start"><span className="text-flux-glow mr-2">▸</span> <span><strong>Curiosity:</strong> "Why?" / "What if?"</span></li>
            <li className="flex items-start"><span className="text-flux-glow mr-2">▸</span> <span><strong>Creativity:</strong> "What new thing can exist?"</span></li>
            <li className="flex items-start"><span className="text-flux-glow mr-2">▸</span> <span><strong>Logic:</strong> "Does this make sense?"</span></li>
            <li className="flex items-start"><span className="text-flux-glow mr-2">▸</span> <span><strong>Insight:</strong> "What is the deeper truth?"</span></li>
          </ul>
        </div>
      </div>
    </section>
  </div>
);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    stage: AppStage.WELCOME,
    currentTaskIndex: 0,
    history: [],
    currentPrompt: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleStart = () => {
    setState(prev => ({
      ...prev,
      stage: AppStage.GENERATING_TASK,
      currentTaskIndex: 0,
      history: []
    }));
    triggerTaskGeneration(0, []);
  };

  const handleResume = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if(data.history) {
            setState({
                stage: AppStage.FINAL_REPORT,
                currentTaskIndex: data.history.length,
                history: data.history,
                currentPrompt: null
            });
        }
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const loadExample = (example: typeof EXAMPLE_PROFILES[0]) => {
    setState({
        stage: AppStage.FINAL_REPORT,
        currentTaskIndex: example.history.length,
        history: example.history,
        currentPrompt: null
    });
    setShowExamples(false);
  };

  const triggerTaskGeneration = async (index: number, history: TaskRecord[]) => {
    setIsLoading(true);
    try {
      const prompt = await generateTaskPrompt(index, history);
      setState(prev => ({
        ...prev,
        stage: AppStage.TASK_ACTIVE,
        currentPrompt: prompt
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to generate task. Please check API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskSubmit = async (response: string) => {
    setIsLoading(true);
    setState(prev => ({ ...prev, stage: AppStage.ANALYZING }));
    
    try {
      const taskDef = TASKS[state.currentTaskIndex];
      const analysis = await analyzeResponse(state.currentTaskIndex, state.currentPrompt!, response);
      
      const newRecord: TaskRecord = {
        taskId: taskDef.id,
        prompt: state.currentPrompt!,
        userResponse: response,
        analysis,
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        stage: AppStage.TASK_RESULT,
        history: [...prev.history, newRecord]
      }));

    } catch (error) {
      console.error(error);
      alert("Analysis failed.");
      setState(prev => ({ ...prev, stage: AppStage.TASK_ACTIVE })); // Revert
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextTask = () => {
    const nextIndex = state.currentTaskIndex + 1;
    if (nextIndex >= TASKS.length) {
      setState(prev => ({ ...prev, stage: AppStage.FINAL_REPORT }));
    } else {
      setState(prev => ({
        ...prev,
        currentTaskIndex: nextIndex,
        stage: AppStage.GENERATING_TASK
      }));
      triggerTaskGeneration(nextIndex, state.history);
    }
  };

  const handleReset = () => {
      localStorage.removeItem(STORAGE_KEY);
      setState({
          stage: AppStage.WELCOME,
          currentTaskIndex: 0,
          history: [],
          currentPrompt: null
      });
  };

  // Render Logic
  const renderContent = () => {
    switch (state.stage) {
      case AppStage.WELCOME:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in relative z-10">
            <h1 className="text-6xl md:text-8xl font-thin tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
              Cerebrum Flux
            </h1>
            <p className="max-w-xl text-slate-400 text-lg leading-relaxed">
              Not a test. A mirror. <br/>
              Explore your Creative Velocity, Systems Intuition, and Conceptual Synthesis through 10 AI-driven modules.
            </p>
            
            {showGuide && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md" onClick={() => setShowGuide(false)}>
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4 sticky top-0 bg-slate-900 pt-2 z-10">
                            <div className="text-left">
                                <h2 className="text-2xl font-light text-white tracking-tight">Cerebrum Flux Framework</h2>
                                <p className="text-slate-500 text-sm mt-1">Methodology & Mechanics</p>
                            </div>
                            <button onClick={() => setShowGuide(false)} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <GuideContent />
                    </div>
                 </div>
            )}

            {!showExamples ? (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button 
                    onClick={handleStart}
                    className="bg-flux-accent hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                >
                    Begin Assessment
                </button>
                <div className="flex flex-wrap justify-center gap-4">
                     <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-4 rounded-full font-medium transition-all border border-slate-700 flex items-center justify-center hover:border-flux-accent/50">
                        <span>Load JSON</span>
                        <input type="file" accept=".json" onChange={(e) => e.target.files && handleResume(e.target.files[0])} className="hidden" />
                    </label>
                    <button 
                        onClick={() => setShowExamples(true)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-4 rounded-full font-medium transition-all border border-slate-700 hover:border-flux-accent/50"
                    >
                        View Examples
                    </button>
                    <button 
                        onClick={() => setShowGuide(true)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-4 rounded-full font-medium transition-all border border-slate-700 hover:border-flux-accent/50"
                    >
                        About & Methodology
                    </button>
                </div>
                </div>
            ) : (
                <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full animate-fade-in backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl text-white font-light">Select an Archetype to Explore</h3>
                        <button onClick={() => setShowExamples(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
                    </div>
                    {/* Added max-height and scrolling here */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                        {EXAMPLE_PROFILES.map((ex, i) => (
                            <button 
                                key={i} 
                                onClick={() => loadExample(ex)}
                                className="text-left p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-flux-accent hover:bg-slate-700 transition-all group"
                            >
                                <div className="text-flux-accent font-medium group-hover:text-white transition-colors">{ex.name}</div>
                                <div className="text-xs text-slate-500 mt-1">{ex.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>
        );

      case AppStage.GENERATING_TASK:
      case AppStage.TASK_ACTIVE:
      case AppStage.ANALYZING:
        return (
          <TaskView 
            taskDef={TASKS[state.currentTaskIndex]} 
            prompt={state.currentPrompt || "Initializing..."} 
            onResponse={handleTaskSubmit}
            isGenerating={state.stage === AppStage.GENERATING_TASK || state.stage === AppStage.ANALYZING}
          />
        );

      case AppStage.TASK_RESULT:
        const lastRecord = state.history[state.history.length - 1];
        return (
          <AnalysisView 
            analysis={lastRecord.analysis} 
            onNext={handleNextTask} 
            isLastTask={state.currentTaskIndex === TASKS.length - 1}
          />
        );

      case AppStage.FINAL_REPORT:
        return <FinalReport history={state.history} onReset={handleReset} />;
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-flux-900 text-slate-100 selection:bg-flux-accent selection:text-white overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-flux-900 via-flux-accent to-flux-900 opacity-50 z-50"></div>
      
      <main className="container mx-auto px-6 py-12 relative">
        {/* Background Decorative Elements */}
        <div className="fixed top-20 left-10 w-64 h-64 bg-flux-accent rounded-full filter blur-[128px] opacity-10 pointer-events-none"></div>
        <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full filter blur-[128px] opacity-10 pointer-events-none"></div>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;