import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Dimension } from '../types';

interface FluxRadarProps {
  data: Record<Dimension, number>;
  color?: string;
}

export const FluxRadar: React.FC<FluxRadarProps> = ({ data, color = "#818cf8" }) => {
  // Transform object to array for Recharts
  const chartData = Object.entries(data).map(([key, value]) => ({
    subject: key.split(' ').map(w => w[0]).join(''), // Initials for labels
    fullLabel: key,
    A: value,
    fullMark: 10,
  }));

  return (
    <div className="w-full h-[300px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Flux"
            dataKey="A"
            stroke={color}
            strokeWidth={3}
            fill={color}
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
            formatter={(value: number) => [value.toFixed(1), "Score"]}
            labelFormatter={(label) => {
                const item = chartData.find(d => d.subject === label);
                return item ? item.fullLabel : label;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};