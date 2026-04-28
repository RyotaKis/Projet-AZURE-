import React, { useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
  Cell,
  PieChart, Pie
} from 'recharts';

// Mock data for analytics
const timeData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  fraud: Math.floor(Math.random() * 20 + 5),
  volume: Math.floor(Math.random() * 500 + 1000)
}));

const timeData7Days = Array.from({ length: 7 }, (_, i) => ({
  time: `Day ${i+1}`,
  fraud: Math.floor(Math.random() * 100 + 20),
  volume: Math.floor(Math.random() * 3000 + 5000)
}));

const scoreDistribution = [
  { score: '0-20', count: 450, color: '#30D158' },
  { score: '21-40', count: 320, color: '#4CAF50' },
  { score: '41-60', count: 210, color: '#FFEB3B' },
  { score: '61-80', count: 85, color: '#FF9F0A' },
  { score: '81-100', count: 42, color: '#FF3B30' },
];

export const AnalyticsGrid: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const currentData = timeRange === '24h' ? timeData : timeData7Days;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Fraud Over Time */}
      <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border-subtle)] shadow-sm h-[320px] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Tendance des Fraudes</h4>
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-300">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> FRAUDE</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> VOLUME</div>
          </div>
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData}>
              <defs>
                <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#FF3B30" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} hide />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)', fontSize: '11px', fontWeight: 'bold', color: '#fff' }}
              />
              <Area type="monotone" dataKey="fraud" stroke="#FF3B30" strokeWidth={2} fillOpacity={1} fill="url(#colorFraud)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Volume */}
      <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border-subtle)] shadow-sm h-[320px] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Volume Global ({timeRange})</h4>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-[10px] bg-[var(--color-bg-main)] border border-[var(--color-border-subtle)] rounded px-2 py-1 outline-none font-bold text-slate-300"
          >
            <option value="24h">DERNIÈRES 24 HEURES</option>
            <option value="7d">7 DERNIERS JOURS</option>
          </select>
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
              />
              <Bar dataKey="volume" fill="#0A84FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border-subtle)] shadow-sm h-[320px] flex flex-col">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Distribution Score AI</h4>
        <div className="flex-1 flex gap-4">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="score" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)', fontSize: '11px', fontWeight: 'bold', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="w-24 flex flex-col justify-center space-y-3">
            {scoreDistribution.map((item) => (
              <div key={item.score} className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase">{item.score}</span>
                <span className="text-xs font-mono font-bold" style={{ color: item.color }}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Activity Heatmap Mockup with Bar Distribution */}
      <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-[var(--color-border-subtle)] shadow-sm h-[320px] flex flex-col">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Heatmap Activité Globale</h4>
        <div className="flex-1 grid grid-cols-7 gap-1 h-full">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, dIdx) => (
            <div key={dIdx} className="flex flex-col gap-1 h-full">
              <span className="text-[9px] font-bold text-center text-slate-500 py-1">{day}</span>
              {Array.from({ length: 12 }).map((_, hIdx) => {
                const opacity = Math.random() * 0.9 + 0.1;
                return (
                  <div 
                    key={hIdx}
                    className="flex-1 rounded-sm bg-blue-600"
                    style={{ opacity }}
                    title={`Activity: ${Math.round(opacity * 100)}%`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3 text-[9px] font-bold text-slate-400 justify-end">
          <span>FAIBLE</span>
          <div className="flex gap-0.5">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => <div key={o} className="w-3 h-3 bg-blue-600 rounded-sm" style={{ opacity: o }} />)}
          </div>
          <span>PIC</span>
        </div>
      </div>
    </div>
  );
};
