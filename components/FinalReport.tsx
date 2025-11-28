
import React, { useEffect, useState } from 'react';
import { TaskRecord, Dimension, FinalReportData, EnergyType } from '../types';
import { FluxRadar } from './FluxRadar';
import { generateFinalSummary } from '../services/geminiService';
import { generateReportHtml } from '../services/htmlGenerator';

interface FinalReportProps {
  history: TaskRecord[];
  onReset: () => void;
  preLoadedReport?: FinalReportData; // Allow passing existing report
}

const EnergyBadge: React.FC<{ type: EnergyType }> = ({ type }) => {
    const styles = {
        'Energizing': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/50', icon: '⚡' },
        'Draining': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/50', icon: '🔋' },
        'Neutral': { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/50', icon: '○' },
    };
    const s = styles[type] || styles['Neutral'];

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono border ${s.bg} ${s.text} ${s.border} flex items-center gap-1`}>
            <span>{s.icon}</span>
            <span>{type}</span>
        </span>
    );
};

export const FinalReport: React.FC<FinalReportProps> = ({ history, onReset, preLoadedReport }) => {
  const [report, setReport] = useState<FinalReportData | null>(preLoadedReport || null);
  const [loading, setLoading] = useState(!preLoadedReport);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  // Calculate aggregated scores locally for chart visualization (always available from history)
  const aggregatedScores = history.reduce((acc, curr) => {
    Object.entries(curr.analysis.scores).forEach(([key, value]) => {
      const dim = key as Dimension;
      acc[dim] = (acc[dim] || 0) + value;
    });
    return acc;
  }, {} as Record<Dimension, number>);

  // Average them
  Object.keys(aggregatedScores).forEach(key => {
    const dim = key as Dimension;
    aggregatedScores[dim] = aggregatedScores[dim] / history.length;
  });

  const finalFXI = history.reduce((acc, curr) => acc + curr.analysis.fluxIndex, 0) / history.length;

  useEffect(() => {
    if (!report && history.length > 0) {
      generateFinalSummary(history)
        .then(setReport)
        .finally(() => setLoading(false));
    }
  }, [history, report]);

  const downloadJson = () => {
    if (!report) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        timestamp: new Date().toISOString(),
        finalFXI,
        aggregatedScores,
        history,
        report
    }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `cerebrum_flux_${report.executiveSummary.primaryArchetype.name.replace(/\s/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const downloadHtml = () => {
    if (!report) return;
    const htmlContent = generateReportHtml(report, aggregatedScores, finalFXI, history);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", url);
    downloadAnchorNode.setAttribute("download", `cerebrum_flux_${report.executiveSummary.primaryArchetype.name.replace(/\s/g, '_')}.html`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 animate-fade-in">
             <div className="w-12 h-12 border-4 border-flux-accent border-t-transparent rounded-full animate-spin"></div>
             <p className="text-slate-400 font-mono animate-pulse">Synthesizing Comprehensive Profile...</p>
        </div>
    );
  }

  if (!report) return null;

  const { executiveSummary, dimensionalAnalysis, cognitiveClusters, archetypeProfile, cognitiveDynamics, appliedInsight, narrativeSummary, socraticReflection } = report;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-fade-in font-sans">
      
      {/* Header */}
      <header className="text-center space-y-6">
        <div className="inline-block px-4 py-1 rounded-full border border-slate-700 bg-slate-900/50 text-slate-400 text-xs font-mono uppercase tracking-widest mb-4">
            Profile ID: CF-{Date.now().toString().slice(-6)}
        </div>
        <h1 className="text-5xl md:text-7xl font-thin text-white tracking-tighter">
            {executiveSummary.primaryArchetype.name}
        </h1>
        <p className="text-xl text-flux-glow font-light italic">
            {executiveSummary.primaryArchetype.description}
        </p>
        <div className="flex justify-center gap-4 mt-4">
             <span className="px-4 py-2 bg-slate-800 rounded-lg text-sm text-slate-300 font-mono border border-slate-700">
                Quadrant: {executiveSummary.primaryArchetype.quadrant}
             </span>
             <span className="px-4 py-2 bg-slate-800 rounded-lg text-sm text-flux-accent font-mono border border-flux-accent/30">
                Type Alignment: {executiveSummary.primaryArchetype.mbti}
             </span>
             <span className="px-4 py-2 bg-flux-accent/20 rounded-lg text-sm text-white font-mono border border-flux-accent">
                FXI: {finalFXI.toFixed(2)}
             </span>
        </div>
      </header>

      {/* Accordion: Session Transcript */}
      <section className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-900/50">
        <button 
            onClick={() => setTranscriptOpen(!transcriptOpen)}
            className="w-full flex justify-between items-center p-6 bg-slate-800/80 hover:bg-slate-800 transition-colors text-left"
        >
            <span className="text-white font-serif text-lg">I. Session Transcript (Questions & Answers)</span>
            <span className="text-slate-400">{transcriptOpen ? '−' : '+'}</span>
        </button>
        {transcriptOpen && (
            <div className="p-6 space-y-8 bg-slate-900/50">
                {history.map((record, idx) => (
                    <div key={idx} className="border-b border-slate-800 pb-6 last:border-0 last:pb-0">
                         <div className="flex justify-between items-baseline mb-2">
                             <h4 className="text-flux-accent text-xs font-mono uppercase">Module {record.taskId}</h4>
                             <span className="text-slate-500 text-xs font-mono">FXI: {record.analysis.fluxIndex.toFixed(2)}</span>
                         </div>
                         <p className="text-slate-300 font-medium mb-3">{record.prompt}</p>
                         <div className="bg-slate-800 p-4 rounded-lg text-slate-400 text-sm font-light italic leading-relaxed">
                            "{record.userResponse}"
                         </div>
                    </div>
                ))}
            </div>
        )}
      </section>

      {/* Main Report Body */}
      <div className="space-y-16">
          {/* 1. Executive Summary & Narrative */}
          <section className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 glass-panel p-8 rounded-2xl border-l-4 border-flux-accent">
                <h2 className="text-2xl font-light text-white mb-6 font-serif">Narrative Summary</h2>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                    {narrativeSummary}
                </p>
            </div>
            <div className="space-y-6">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-emerald-400 font-mono text-xs uppercase mb-3">Core Strengths</h3>
                    <ul className="space-y-2">
                        {executiveSummary.topStrengths.map((s, i) => (
                            <li key={i} className="flex items-start text-slate-300 text-sm">
                                <span className="mr-2 text-emerald-500">▸</span> {s}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-amber-400 font-mono text-xs uppercase mb-3">Growth Edges</h3>
                    <ul className="space-y-2">
                        {executiveSummary.growthEdges.map((s, i) => (
                            <li key={i} className="flex items-start text-slate-300 text-sm">
                                <span className="mr-2 text-amber-500">▸</span> {s}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
          </section>

          {/* 2. Visualization & Clusters */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h3 className="text-slate-400 font-mono uppercase text-sm mb-6 text-center">Flux Map (Radial)</h3>
                <FluxRadar data={aggregatedScores} color="#6366f1" />
            </div>
            <div className="space-y-6">
                <h3 className="text-white font-serif text-2xl mb-4">Cognitive Clusters</h3>
                <div className="space-y-4">
                    {[
                        { label: "Creative Cluster", val: cognitiveClusters.creative, color: "bg-indigo-500" },
                        { label: "Analytical Cluster", val: cognitiveClusters.analytical, color: "bg-cyan-500" },
                        { label: "Reflective Cluster", val: cognitiveClusters.reflective, color: "bg-purple-500" },
                        { label: "Curiosity Cluster", val: cognitiveClusters.curiosity, color: "bg-emerald-500" },
                    ].map((cluster, i) => (
                        <div key={i} className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-slate-300 font-medium">{cluster.label}</span>
                            </div>
                            <p className="text-xs text-slate-400">{cluster.val}</p>
                        </div>
                    ))}
                </div>
            </div>
          </section>

          {/* 3. Deep Dive Dimensions */}
          <section>
            <h2 className="text-3xl font-light text-white mb-8 border-b border-slate-800 pb-4">Dimensional Analysis</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(dimensionalAnalysis).map(([key, data]) => (
                    <div key={key} className="group hover:bg-slate-800/40 transition-colors p-6 rounded-xl border border-slate-800 hover:border-slate-600">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-flux-accent font-mono uppercase text-sm max-w-[50%] leading-tight">{key}</h4>
                            <div className="flex items-center gap-3">
                                <EnergyBadge type={data.energyType} />
                                <div className="flex items-center space-x-2">
                                    <div className="h-1 w-12 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-flux-accent" style={{width: `${data.score * 10}%`}}></div>
                                    </div>
                                    <span className="text-white font-bold text-sm w-4 text-right">{data.score}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm mb-3 font-medium">{data.interpretation}</p>
                        <p className="text-slate-500 text-xs leading-relaxed">{data.deepDive}</p>
                    </div>
                ))}
            </div>
          </section>

          {/* 4. Cognitive Dynamics & Insights */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-2xl">
                <h2 className="text-xl font-light text-white mb-6">Cognitive Dynamics</h2>
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-700/50">
                        <span className="text-slate-400">Processing Style</span>
                        <span className="text-white text-right">{cognitiveDynamics.processingStyle}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-700/50">
                        <span className="text-slate-400">Idea Formation</span>
                        <span className="text-white text-right">{cognitiveDynamics.ideaPattern}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-700/50">
                        <span className="text-slate-400">Reflective Integration</span>
                        <span className="text-white text-right">{cognitiveDynamics.reflectiveEmotionalIntegration}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-700/50">
                        <span className="text-slate-400">Decision Style</span>
                        <span className="text-white text-right">{cognitiveDynamics.decisionMakingStyle}</span>
                    </div>
                </div>
                <div className="mt-6 space-y-2">
                    <h4 className="text-flux-accent font-mono text-xs uppercase">Strength Ratios</h4>
                    <div className="flex justify-between text-xs text-slate-300">
                        <span>Generative : Analytical</span>
                        <span>{cognitiveDynamics.ratios.genVsAna}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-300">
                        <span>Divergent : Convergent</span>
                        <span>{cognitiveDynamics.ratios.divVsConv}</span>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
                <h2 className="text-xl font-light text-white mb-6">Applied Insight</h2>
                <div className="space-y-6">
                    <div>
                        <h4 className="text-emerald-400 font-mono text-xs uppercase mb-2">How to Leverage</h4>
                        <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                            {appliedInsight.leverage.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-indigo-400 font-mono text-xs uppercase mb-2">Recommended Practices</h4>
                        <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                            {appliedInsight.practices.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-amber-400 font-mono text-xs uppercase mb-2">Growth Domains</h4>
                        <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                            {appliedInsight.growthDomains.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
          </section>

          {/* 5. Socratic Reflection */}
          {socraticReflection && socraticReflection.length > 0 && (
             <section className="max-w-4xl mx-auto text-center space-y-8 py-10">
                 <div>
                    <h2 className="text-2xl font-light text-white mb-2 font-serif">Socratic Reflection</h2>
                    <p className="text-slate-400 text-sm">Questions to ask yourself to deepen this inquiry.</p>
                 </div>
                 <div className="grid gap-6">
                     {socraticReflection.map((q, i) => (
                         <div key={i} className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-xl hover:bg-slate-800/50 transition-colors">
                             <h3 className="text-flux-glow text-lg italic font-light">"{q}"</h3>
                         </div>
                     ))}
                 </div>
             </section>
          )}
      </div>

      {/* Accordion: Methodology & Framework */}
      <section className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-900/50 mt-12">
        <button 
            onClick={() => setMethodologyOpen(!methodologyOpen)}
            className="w-full flex justify-between items-center p-6 bg-slate-800/80 hover:bg-slate-800 transition-colors text-left"
        >
            <span className="text-white font-serif text-lg">III. Methodology & Framework</span>
            <span className="text-slate-400">{methodologyOpen ? '−' : '+'}</span>
        </button>
        {methodologyOpen && (
            <div className="p-8 space-y-8 bg-slate-900 text-slate-300 leading-relaxed">
                <div>
                    <h4 className="text-white font-bold mb-2">1. The 10 Cognitive Dimensions</h4>
                    <p className="text-sm text-slate-400 mb-4">Each module targets specific cognitive mechanisms rather than knowledge.</p>
                    <ul className="grid md:grid-cols-2 gap-4 text-sm">
                        <li><strong className="text-flux-accent">Creative Velocity:</strong> Speed of divergent ideation.</li>
                        <li><strong className="text-flux-accent">Systems Intuition:</strong> Predicting dynamic cascades.</li>
                        <li><strong className="text-flux-accent">Cross-Domain Transfer:</strong> Metaphorical mapping accuracy.</li>
                        <li><strong className="text-flux-accent">Conceptual Synthesis:</strong> Merging disparate concepts.</li>
                        <li><strong className="text-flux-accent">Reflective Depth:</strong> Analysis of own belief shifts.</li>
                        <li><strong className="text-flux-accent">Meta-Awareness:</strong> Identifying hidden assumptions.</li>
                        <li><strong className="text-flux-accent">Emotional Insight:</strong> Reading subtext and motive.</li>
                        <li><strong className="text-flux-accent">Playful Intelligence:</strong> Wit and symbolic flexibility.</li>
                        <li><strong className="text-flux-accent">Curiosity:</strong> Quality of inquiry.</li>
                        <li><strong className="text-flux-accent">Self-Directed Cognition:</strong> Autonomous revision.</li>
                    </ul>
                </div>
                
                <div>
                    <h4 className="text-white font-bold mb-2">2. Scoring Architecture</h4>
                    <p className="text-sm mb-2">
                        <strong>Raw Score (0-10):</strong> Evaluated against a rubric of complexity, novelty, and coherence.
                    </p>
                    <p className="text-sm mb-2">
                        <strong>Integration Factor (IF):</strong> A multiplier (0.5x – 1.5x) assessing how well different dimensions blend. A high IF indicates elegance and nested reasoning.
                    </p>
                    <p className="text-sm">
                        <strong>Flux Index (FXI):</strong> The final composite score. <em className="font-mono">FXI = Mean(Dimensions) × Integration Factor</em>.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-2">3. Archetype Allocation</h4>
                    <p className="text-sm mb-4">
                        Users are mapped to one of 16 archetypes based on their Quadrant (primary cognitive mode) and Driver (secondary motivation).
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 text-sm">
                        <div className="bg-slate-800 p-4 rounded-lg">
                            <h5 className="text-flux-accent font-bold mb-2">The Quadrants</h5>
                            <ul className="space-y-1">
                                <li><strong>Synthesist:</strong> Big-picture, systems, meaning.</li>
                                <li><strong>Architect:</strong> Structure, design, coherence.</li>
                                <li><strong>Wanderer:</strong> Intuition, feeling, narrative.</li>
                                <li><strong>Analyst:</strong> Logic, precision, data.</li>
                            </ul>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg">
                            <h5 className="text-flux-accent font-bold mb-2">The Drivers</h5>
                            <ul className="space-y-1">
                                <li><strong>Curiosity-Driven:</strong> Seeks understanding.</li>
                                <li><strong>Creativity-Driven:</strong> Seeks novelty.</li>
                                <li><strong>Logic-Driven:</strong> Seeks order.</li>
                                <li><strong>Insight-Driven:</strong> Seeks depth.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </section>

      {/* Footer Actions */}
      <div className="flex flex-col md:flex-row justify-center gap-4 pt-12 border-t border-slate-800">
        <button
            onClick={downloadJson}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span>Save JSON</span>
        </button>
        <button
            onClick={downloadHtml}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-flux-accent hover:bg-indigo-500 text-white rounded-lg transition-colors border border-transparent shadow-lg"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>Save Report (HTML)</span>
        </button>
        <button
            onClick={onReset}
            className="px-6 py-4 text-slate-400 hover:text-white transition-colors"
        >
            {preLoadedReport ? "Return to Home" : "Start New Session"}
        </button>
      </div>
    </div>
  );
};
