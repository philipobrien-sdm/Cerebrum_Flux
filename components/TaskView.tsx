import React, { useState, useEffect, useRef } from 'react';
import { TaskDefinition } from '../types';

interface TaskViewProps {
  taskDef: TaskDefinition;
  prompt: string;
  onResponse: (response: string) => void;
  isGenerating: boolean;
}

export const TaskView: React.FC<TaskViewProps> = ({ taskDef, prompt, onResponse, isGenerating }) => {
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(taskDef.timeLimit || null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Reset state when task changes
    setInput('');
    setTimeLeft(taskDef.timeLimit || null);
    
    if (taskDef.timeLimit) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev !== null && prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [taskDef, prompt]);

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onResponse(input);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-flux-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-mono text-sm">Synthesizing Task Vector...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-end border-b border-slate-700 pb-4">
        <div>
            <h3 className="text-flux-accent font-mono text-xs tracking-widest uppercase mb-1">Module {taskDef.id} / 10</h3>
            <h2 className="text-2xl font-bold text-white">{taskDef.title}</h2>
        </div>
        {timeLeft !== null && (
          <div className={`font-mono text-xl ${timeLeft < 10 ? 'text-red-400' : 'text-slate-400'}`}>
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        <p className="text-lg text-slate-200 leading-relaxed font-light">{prompt}</p>
      </div>

      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your response here..."
          className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-100 focus:ring-2 focus:ring-flux-accent focus:border-transparent outline-none resize-none font-sans leading-relaxed"
          spellCheck={false}
        />
        <div className="absolute bottom-4 right-4 text-xs text-slate-500 font-mono">
            {input.length} chars
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={input.trim().length === 0}
          className="bg-flux-accent hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(99,102,241,0.5)]"
        >
          Submit Response
        </button>
      </div>
    </div>
  );
};