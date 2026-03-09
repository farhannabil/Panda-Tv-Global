import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { DollarSign, Users, Activity, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';

const subscriptionData = [
  { name: 'Nov', new: 150, renew: 80, demo: 40 },
  { name: 'Dec', new: 220, renew: 120, demo: 60 },
  { name: 'Jan', new: 180, renew: 100, demo: 50 },
  { name: 'Feb', new: 250, renew: 140, demo: 70 },
];

const resellerStats = [
  { name: 'codexcipher', value: 2.0, color: 'text-cyan' },
  { name: 'reseller_alpha', value: 3.5, color: 'text-violet' },
  { name: 'reseller_beta', value: 1.8, color: 'text-pink' },
];

const subTypeData = [
  { name: 'New', value: 45, color: '#00f5ff' },
  { name: 'Renew', value: 35, color: '#8b00ff' },
  { name: 'Demo', value: 20, color: '#ff0080' },
];

export function Statistics() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-black text-white tracking-tighter uppercase italic">Statistics</h1>
          <p className="text-text-muted font-mono text-xs uppercase tracking-[0.2em] mt-2">Detailed system performance metrics</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-3 border-white/10">
            <DollarSign className="w-4 h-4 text-green" />
            <div>
              <p className="text-[8px] font-mono text-text-muted uppercase">Credit Spent</p>
              <p className="text-sm font-bold text-white">16</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-8 border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">Subscriptions</h3>
            <div className="flex gap-4 text-[10px] font-mono text-text-muted">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan" /> New</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-violet" /> Renew</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pink" /> Demo</div>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subscriptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10}} />
                <YAxis stroke="rgba(255,255,255,0.1)" tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10}} />
                <Tooltip
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'rgba(6,8,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="new" fill="#00f5ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="renew" fill="#8b00ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="demo" fill="#ff0080" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Stats */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-panel rounded-2xl p-6 border-white/5">
            <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider mb-6">Today's Reseller Statistics</h3>
            <div className="space-y-6">
              {resellerStats.map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono uppercase">
                    <span className="text-text-muted">{stat.name}</span>
                    <span className={stat.color}>{stat.value}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={clsx("h-full rounded-full", stat.color.replace('text', 'bg'))} style={{ width: `${(stat.value / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border-white/5">
            <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider mb-6">Subscription Types</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(6,8,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {subTypeData.map((type, i) => (
                <div key={i} className="text-center">
                  <p className="text-[10px] font-mono text-text-muted uppercase mb-1">{type.name}</p>
                  <p className="text-xs font-bold text-white">{type.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
