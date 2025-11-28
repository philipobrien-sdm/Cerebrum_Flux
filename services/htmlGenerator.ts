
import { FinalReportData, Dimension, TaskRecord, EnergyType } from '../types';

export const generateReportHtml = (
  report: FinalReportData, 
  scores: Record<Dimension, number>, 
  fxi: number,
  history: TaskRecord[]
): string => {
  const date = new Date().toLocaleDateString();
  const profile = report.executiveSummary.primaryArchetype;
  
  // Generate Radar Chart SVG
  const radarSvg = generateRadarSvg(scores);

  const getEnergyColor = (type: EnergyType) => {
      switch(type) {
          case 'Energizing': return '#10b981'; // Emerald
          case 'Draining': return '#f43f5e'; // Rose
          default: return '#94a3b8'; // Slate
      }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cerebrum Flux Report - ${profile.name}</title>
    <style>
        :root {
            --bg: #0f172a;
            --card-bg: #1e293b;
            --text-main: #e2e8f0;
            --text-muted: #94a3b8;
            --accent: #6366f1;
            --glow: #818cf8;
            --border: #334155;
        }
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: var(--bg);
            color: var(--text-main);
            line-height: 1.6;
            margin: 0;
            padding: 40px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        header {
            text-align: center;
            margin-bottom: 60px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 40px;
        }
        h1 { font-weight: 200; font-size: 3rem; margin: 0; letter-spacing: -1px; }
        h2 { font-weight: 300; color: var(--glow); margin-top: 0; }
        h3 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); margin-bottom: 1rem; }
        .badge {
            display: inline-block;
            padding: 6px 12px;
            background: rgba(99,102,241,0.1);
            border: 1px solid var(--accent);
            color: var(--accent);
            border-radius: 4px;
            font-size: 0.8rem;
            margin: 0 5px;
            font-family: monospace;
        }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        .narrative { font-size: 1.1rem; color: #cbd5e1; white-space: pre-wrap; }
        .chart-container { display: flex; justify-content: center; margin: 40px 0; }
        .dimension-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .bar-bg { flex-grow: 1; height: 6px; background: #334155; margin: 0 15px; border-radius: 3px; }
        .bar-fill { height: 100%; background: var(--accent); border-radius: 3px; }
        ul { list-style-type: none; padding: 0; }
        li { margin-bottom: 8px; position: relative; padding-left: 20px; }
        li::before { content: "▸"; position: absolute; left: 0; color: var(--accent); }
        .footer { text-align: center; margin-top: 80px; font-size: 0.8rem; color: var(--text-muted); }
        details { margin-bottom: 20px; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
        summary { background: rgba(30, 41, 59, 0.5); padding: 15px 20px; cursor: pointer; font-weight: bold; color: var(--text-main); }
        summary:hover { background: rgba(30, 41, 59, 1); }
        .details-content { padding: 20px; background: var(--card-bg); font-size: 0.9rem; }
        .energy-tag { font-size: 0.7rem; text-transform: uppercase; border: 1px solid; padding: 2px 6px; border-radius: 3px; margin-right: 10px; }
        .socratic-q { font-style: italic; color: var(--glow); margin-bottom: 15px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 6px; }

        @media print {
            body { background: white; color: black; }
            .card { border: 1px solid #ddd; background: none; }
            svg text { fill: black !important; }
            svg path, svg line { stroke: #666 !important; }
            details { display: block; border: none; }
            summary { display: none; }
            .details-content { display: block; padding: 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div style="font-family: monospace; color: var(--text-muted); margin-bottom: 10px;">CEREBRUM FLUX ANALYSIS</div>
            <h1>${profile.name}</h1>
            <h2>${profile.description}</h2>
            <div style="margin-top: 20px;">
                <span class="badge">FXI: ${fxi.toFixed(2)}</span>
                <span class="badge">${profile.quadrant}</span>
                <span class="badge">MBTI Align: ${profile.mbti}</span>
                <span class="badge">${date}</span>
            </div>
        </header>

        <!-- Transcript Section -->
        <details>
            <summary>I. Session Transcript (Questions & Answers)</summary>
            <div class="details-content">
                ${history.map((h, i) => `
                    <div style="margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid var(--border);">
                        <div style="color: var(--accent); font-family: monospace; font-size: 0.8rem; text-transform: uppercase;">Module ${h.taskId} | Score: ${h.analysis.fluxIndex.toFixed(2)}</div>
                        <div style="margin: 5px 0; font-weight: bold;">${h.prompt}</div>
                        <div style="font-style: italic; color: var(--text-muted); background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px;">"${h.userResponse}"</div>
                    </div>
                `).join('')}
            </div>
        </details>

        <section class="grid" style="grid-template-columns: 2fr 1fr;">
            <div class="card">
                <h3>Narrative Summary</h3>
                <div class="narrative">${report.narrativeSummary}</div>
            </div>
            <div>
                <div class="card">
                    <h3>Core Strengths</h3>
                    <ul>${report.executiveSummary.topStrengths.map(s => `<li>${s}</li>`).join('')}</ul>
                </div>
                <div class="card">
                    <h3>Growth Edges</h3>
                    <ul>${report.executiveSummary.growthEdges.map(s => `<li>${s}</li>`).join('')}</ul>
                </div>
            </div>
        </section>

        <section class="card">
            <h3>Cognitive Architecture Map</h3>
            <div class="grid" style="align-items: center;">
                <div class="chart-container">
                    ${radarSvg}
                </div>
                <div>
                    ${Object.entries(scores).map(([key, value]) => `
                        <div class="dimension-row">
                            <span style="font-size: 0.85rem; width: 140px;">${key}</span>
                            <div class="bar-bg">
                                <div class="bar-fill" style="width: ${value * 10}%"></div>
                            </div>
                            <span style="font-family: monospace; width: 30px; text-align: right;">${value.toFixed(1)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <section>
            <h3>Dimensional Deep Dive</h3>
            <div class="grid">
                ${Object.entries(report.dimensionalAnalysis).map(([key, data]) => `
                    <div class="card">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                            <div style="display:flex; align-items:center;">
                                <strong style="color:var(--accent); text-transform:uppercase; font-size:0.8rem; margin-right:10px;">${key}</strong>
                            </div>
                            <div style="display:flex; align-items:center;">
                                <span class="energy-tag" style="color: ${getEnergyColor(data.energyType)}; border-color: ${getEnergyColor(data.energyType)}">${data.energyType}</span>
                                <strong style="font-family:monospace;">${data.score}</strong>
                            </div>
                        </div>
                        <div style="font-style: italic; font-size: 0.9rem; margin-bottom: 10px; color: #cbd5e1;">${data.interpretation}</div>
                        <div style="font-size: 0.85rem; color: var(--text-muted);">${data.deepDive}</div>
                    </div>
                `).join('')}
            </div>
        </section>

         <section class="card">
            <h3>Applied Insights</h3>
            <div class="grid" style="grid-template-columns: 1fr 1fr 1fr;">
                 <div>
                    <h4 style="color:var(--glow); font-size:0.8rem; text-transform:uppercase;">Leverage</h4>
                    <ul>${report.appliedInsight.leverage.map(s => `<li>${s}</li>`).join('')}</ul>
                </div>
                <div>
                    <h4 style="color:var(--glow); font-size:0.8rem; text-transform:uppercase;">Practices</h4>
                    <ul>${report.appliedInsight.practices.map(s => `<li>${s}</li>`).join('')}</ul>
                </div>
                <div>
                    <h4 style="color:var(--glow); font-size:0.8rem; text-transform:uppercase;">Growth</h4>
                    <ul>${report.appliedInsight.growthDomains.map(s => `<li>${s}</li>`).join('')}</ul>
                </div>
            </div>
        </section>

        ${report.socraticReflection && report.socraticReflection.length > 0 ? `
        <section class="card" style="text-align:center;">
            <h3>Socratic Reflection</h3>
            <p style="color:var(--text-muted); margin-bottom:20px;">Questions to deepen your inquiry.</p>
            ${report.socraticReflection.map(q => `<div class="socratic-q">"${q}"</div>`).join('')}
        </section>
        ` : ''}

        <!-- Methodology Section -->
        <details>
            <summary>III. Methodology & Framework</summary>
            <div class="details-content">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h4 style="color: white; margin-bottom: 10px;">The 10 Dimensions</h4>
                        <ul style="font-size: 0.8rem;">
                            <li><strong>Creative Velocity:</strong> Speed of divergent ideation.</li>
                            <li><strong>Systems Intuition:</strong> Predicting dynamic cascades.</li>
                            <li><strong>Cross-Domain Transfer:</strong> Metaphorical mapping.</li>
                            <li><strong>Conceptual Synthesis:</strong> Merging concepts.</li>
                            <li><strong>Reflective Depth:</strong> Analysis of belief shifts.</li>
                            <li><strong>Meta-Awareness:</strong> Identifying assumptions.</li>
                            <li><strong>Emotional Insight:</strong> Reading subtext.</li>
                            <li><strong>Playful Intelligence:</strong> Wit/flexibility.</li>
                            <li><strong>Curiosity:</strong> Inquiry quality.</li>
                            <li><strong>Self-Directed Cognition:</strong> Autonomous revision.</li>
                        </ul>
                    </div>
                    <div>
                         <h4 style="color: white; margin-bottom: 10px;">Scoring & Allocation</h4>
                         <p><strong>Flux Index (FXI):</strong> Composite score derived from the mean of dimension scores multiplied by an Integration Factor (coherence/elegance).</p>
                         <p style="margin-top: 10px;"><strong>Archetypes</strong> are determined by Quadrant (Synthesist, Architect, Wanderer, Analyst) and Driver (Curiosity, Creativity, Logic, Insight).</p>
                    </div>
                </div>
            </div>
        </details>

        <div class="footer">
            Generated by Cerebrum Flux Cognitive Engine
        </div>
    </div>
</body>
</html>`;
};

// SVG Generator Helper
const generateRadarSvg = (data: Record<string, number>): string => {
  const size = 400;
  const center = size / 2;
  const radius = 150;
  const labels = Object.keys(data);
  const count = labels.length;
  const angleStep = (Math.PI * 2) / count;

  // Helper to get coordinates
  const getPoint = (index: number, value: number, max: number = 10) => {
    const angle = index * angleStep - Math.PI / 2; // Start at top
    const r = (value / max) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Generate Grid Lines (webs)
  let gridSvg = '';
  [2, 4, 6, 8, 10].forEach(level => {
    const points = labels.map((_, i) => {
      const p = getPoint(i, level);
      return `${p.x},${p.y}`;
    }).join(' ');
    gridSvg += `<polygon points="${points}" fill="none" stroke="#334155" stroke-width="1" />`;
  });

  // Generate Axis Lines
  let axisSvg = '';
  labels.forEach((_, i) => {
    const p = getPoint(i, 10);
    axisSvg += `<line x1="${center}" y1="${center}" x2="${p.x}" y2="${p.y}" stroke="#334155" stroke-width="1" />`;
  });

  // Generate Data Polygon
  const dataPoints = Object.values(data).map((val, i) => {
    const p = getPoint(i, val);
    return `${p.x},${p.y}`;
  }).join(' ');
  const dataPoly = `<polygon points="${dataPoints}" fill="rgba(99, 102, 241, 0.4)" stroke="#6366f1" stroke-width="2" />`;

  // Generate Labels
  let labelSvg = '';
  labels.forEach((label, i) => {
    const p = getPoint(i, 12.5); // Push labels out slightly
    // Split acronyms for cleaner look in small SVG
    const shortLabel = label.split(' ').map(w=>w[0]).join(''); 
    labelSvg += `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle" fill="#94a3b8" font-size="12" font-family="monospace">${shortLabel}</text>`;
  });

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="transparent" />
    ${gridSvg}
    ${axisSvg}
    ${dataPoly}
    ${labelSvg}
  </svg>`;
};
