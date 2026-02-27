import React, { useState } from 'react';
import { VOD_LIST, PACKAGE_LIST } from '../constants';
import { Save, X, Search, CheckSquare, Square, Wallet, Clock, Tag, DollarSign, Zap, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

interface DeviceFormProps {
  type: 'mag' | 'm3u';
}

const PANDA_SPECIAL_PACKAGES = [
  'Netflix Premium 4K/ASIA', 'HBO Max', 'Hulu', 'Disney+/Pixar', 'Marvel MCU', 'Paramount+', 'Criterion Collection', 'Sony Pictures Core',
  'HBO Originals', 'AMC+', 'Apple TV+', 'BritBox', 'Starz', 'Peacock',
  'UFC & Fight Pass', 'ESPN Unlimited', 'Sky Sports (UK)', 'TNT Sports', 'DAZN', 'F1 TV Pro', 'NFL Sunday Ticket', 'NBA League Pass',
  'National Geographic', 'BBC News', 'CNN', 'Al Jazeera', 'Sky News', 'Smithsonian', 'Discovery 4K',
  'Disney Kids', 'Netflix 4K Kids', 'Pixar', 'PBS Kids', 'Nick Jr', 'Cartoon Network', 'Gulli',
  'BroadwayHD', 'Mezzo Live', 'Stingray Classica'
];

export function DeviceForm({ type }: DeviceFormProps) {
  const [selectedPackages, setSelectedPackages] = useState<string[]>(PANDA_SPECIAL_PACKAGES);
  const [selectedVODs, setSelectedVODs] = useState<string[]>([]);
  const [packageSearch, setPackageSearch] = useState('');
  const [vodSearch, setVodSearch] = useState('');
  const [macAddress, setMacAddress] = useState('');

  const handleMacChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '');
    if (value.length > 12) value = value.slice(0, 12);
    
    // Auto-format with colons
    const formatted = value.match(/.{1,2}/g)?.join(':') || value;
    setMacAddress(formatted);
  };

  const togglePackage = (pkg: string) => {
    if (PANDA_SPECIAL_PACKAGES.includes(pkg)) return; // Locked
    setSelectedPackages(prev => 
      prev.includes(pkg) ? prev.filter(p => p !== pkg) : [...prev, pkg]
    );
  };

  const toggleVOD = (vod: string) => {
    setSelectedVODs(prev => 
      prev.includes(vod) ? prev.filter(v => v !== vod) : [...prev, vod]
    );
  };

  const filteredPackages = PACKAGE_LIST.filter(p => p.toLowerCase().includes(packageSearch.toLowerCase()));
  const filteredVODs = VOD_LIST.filter(v => v.toLowerCase().includes(vodSearch.toLowerCase()));

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-3xl font-display font-black text-white tracking-tighter uppercase italic">
            Cyberpunk Reseller <span className="text-cyan">User Panel</span>
          </h1>
          <p className="text-text-muted font-mono text-xs uppercase tracking-[0.2em] mt-2">
            Add New | <span className="text-violet">{type === 'mag' ? 'MAG DEVICE' : 'LINES'}</span>
          </p>
        </div>
        <div className="flex gap-4">
          <select className="bg-void border border-white/10 rounded-lg px-4 py-2 text-xs text-white outline-none focus:border-cyan transition-all">
            <option>All Resellers</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-9 space-y-8">
          {/* Information Card */}
          <div className="glass-panel rounded-2xl p-8 border-orange-400/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-transparent" />
            <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider mb-6">Add New | Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Username / MAC</label>
                  <input 
                    type="text" 
                    value={type === 'mag' ? macAddress : undefined}
                    onChange={type === 'mag' ? handleMacChange : undefined}
                    placeholder={type === 'mag' ? '00:1A:79:XX:XX:XX' : 'Enter username'}
                    className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan outline-none transition-all font-mono shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Subscription</label>
                    <select className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan outline-none transition-all text-xs">
                      <option>All</option>
                      <option>1 Month</option>
                      <option>12 Months</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Select Country</label>
                    <select className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan outline-none transition-all text-xs">
                      <option>Select Country</option>
                      <option>United Kingdom</option>
                      <option>USA</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-4 bg-orange-400/20 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-2 h-2 bg-orange-400 rounded-full" />
                    </div>
                    <span className="text-xs text-text-primary">Use Custom Template</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-4 bg-orange-400/20 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-2 h-2 bg-orange-400 rounded-full" />
                    </div>
                    <span className="text-xs text-text-primary uppercase font-bold text-orange-400">VOD ONLY</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Notes</label>
                <textarea 
                  rows={8}
                  placeholder="Enter internal notes here..."
                  className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan outline-none transition-all resize-none shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Sort Packages Pills */}
          <div className="space-y-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-widest">Sort Packages</h3>
            <div className="flex gap-4">
              <button className="px-8 py-2 rounded-lg bg-violet/20 text-violet border border-violet/40 text-xs font-bold shadow-[0_0_15px_rgba(139,0,255,0.2)]">Europe</button>
              <button className="px-8 py-2 rounded-lg bg-cyan/10 text-cyan border border-cyan/40 text-xs font-bold">Middle East</button>
              <button className="px-8 py-2 rounded-lg bg-cyan/10 text-cyan border border-cyan/40 text-xs font-bold">US</button>
            </div>
          </div>

          {/* Package & VOD Selection Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Packages */}
            <div className="glass-panel rounded-2xl p-6 border-cyan/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">Select Package</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded bg-violet/20 text-violet text-[10px] font-bold">All</button>
                  <select className="bg-void border border-white/10 rounded px-2 py-1 text-[10px] text-text-muted outline-none">
                    <option>No Adult</option>
                  </select>
                </div>
              </div>
              <button className="w-full py-2 bg-white/5 rounded-lg text-xs text-text-muted hover:text-white transition-all border border-white/5">Select All</button>
              <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {filteredPackages.map(pkg => {
                  const isPandaSpecial = PANDA_SPECIAL_PACKAGES.includes(pkg);
                  return (
                    <div 
                      key={pkg} 
                      className={clsx(
                        "flex items-center gap-3 p-2 rounded-lg transition-all group cursor-pointer",
                        isPandaSpecial ? "bg-white/5 opacity-60 cursor-not-allowed" : "hover:bg-white/5"
                      )} 
                      onClick={() => togglePackage(pkg)}
                    >
                      <div className={clsx(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all",
                        selectedPackages.includes(pkg) ? "bg-cyan border-cyan" : "border-white/20 group-hover:border-white/40",
                        isPandaSpecial && "bg-white/20 border-white/10"
                      )}>
                        {selectedPackages.includes(pkg) && <CheckSquare className={clsx("w-3 h-3", isPandaSpecial ? "text-text-muted" : "text-void")} />}
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className={clsx("text-xs transition-colors", selectedPackages.includes(pkg) ? (isPandaSpecial ? "text-text-muted" : "text-cyan font-bold") : "text-text-muted group-hover:text-white")}>{pkg}</span>
                        {isPandaSpecial && (
                          <span className="text-[8px] font-black text-text-muted uppercase tracking-tighter border border-white/10 px-1 rounded">Panda Special (Locked)</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* VODs */}
            <div className="glass-panel rounded-2xl p-6 border-cyan/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">Select VOD</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded bg-violet/20 text-violet text-[10px] font-bold">All</button>
                  <select className="bg-void border border-white/10 rounded px-2 py-1 text-[10px] text-text-muted outline-none">
                    <option>No Adult</option>
                  </select>
                </div>
              </div>
              <button className="w-full py-2 bg-white/5 rounded-lg text-xs text-text-muted hover:text-white transition-all border border-white/5">Select All</button>
              <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {filteredVODs.map(vod => (
                  <div key={vod} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-all group cursor-pointer" onClick={() => toggleVOD(vod)}>
                    <div className={clsx(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all",
                      selectedVODs.includes(vod) ? "bg-violet border-violet" : "border-white/20 group-hover:border-white/40"
                    )}>
                      {selectedVODs.includes(vod) && <CheckSquare className="w-3 h-3 text-void" />}
                    </div>
                    <span className={clsx("text-xs transition-colors", selectedVODs.includes(vod) ? "text-violet font-bold" : "text-text-muted group-hover:text-white")}>{vod}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar KPIs */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-4">
            {[
              { label: 'Balance', value: '91.0', icon: Wallet, color: 'text-green', bg: 'bg-green/10', border: 'border-green/30' },
              { label: 'Remaining Demo', value: '147', icon: RefreshCw, color: 'text-cyan', bg: 'bg-cyan/10', border: 'border-cyan/30' },
              { label: 'Expire', value: 'Expire', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
              { label: 'Price', value: 'Price', icon: DollarSign, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
            ].map((kpi, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
                <div>
                  <h4 className="text-2xl font-display font-bold text-white mb-1 tracking-tight">{kpi.value}</h4>
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{kpi.label}</p>
                </div>
                <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner", kpi.bg, kpi.border, kpi.color)}>
                  <kpi.icon className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-6 rounded-2xl bg-gradient-to-r from-cyan to-violet text-void font-black text-xl uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(0,245,255,0.4)] hover:scale-[1.02] transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            Confirm
          </button>

          <div className="pt-8 flex flex-col items-center">
             <div className="w-full h-[200px] relative">
                {/* Stylized Particle Effect Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-cyan/10 blur-3xl animate-pulse" />
                  <div className="w-16 h-16 rounded-full bg-violet/10 blur-2xl animate-pulse delay-700" />
                </div>
                <div className="absolute inset-0 flex flex-wrap gap-2 justify-center content-center opacity-40">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-cyan animate-ping" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

