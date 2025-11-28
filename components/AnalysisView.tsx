import React from 'react';
import { AnalysisResult, Dimension } from '../types';
import { FluxRadar } from './FluxRadar';

interface AnalysisViewProps {
  analysis: AnalysisResult;
  onNext: () => void;
  isLastTask: boolean;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis, onNext, isLastTask }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-light text-white">Analysis Complete</h2>
        <div className="flex justify-center items-center space-x-4">
            <span className="text-slate-400 font-mono">Flux Index (FXI)</span>
            <span className="text-4xl font-bold text-flux-glow">{analysis.fluxIndex.toFixed(2)}</span>
        </div>
        <p className="text-sm text-slate-500 font-mono">Integration Factor: x{analysis.integrationFactor}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Chart */}
        <div className="glass-panel p-4 rounded-xl">
          <FluxRadar data={analysis.scores} />
        </div>

        {/* Textual Analysis */}
        <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl space-y-4">
                <h3 className="text-flux-accent font-mono text-sm uppercase">Reflection</h3>
                <p className="text-slate-300 italic leading-relaxed">
                    "{analysis.analysisText}"
                </p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl space-y-4">
                <h3 className="text-emerald-400 font-mono text-sm uppercase">Implications</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                    {analysis.implications}
                </p>
            </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onNext}
          className="bg-slate-200 hover:bg-white text-slate-900 px-10 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
        >
          {isLastTask ? "Finalize Profile" : "Next Module"}
        </button>
      </div>
    </div>
  );
};