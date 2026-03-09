import React, { useState } from 'react';
import { Background } from './components/Background';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './components/Dashboard';
import { ProfileAPI } from './components/ProfileAPI';
import { Statistics } from './components/Statistics';
import { Customers } from './components/Customers';
import { SystemPanel } from './components/SystemPanel';
import { LandingPage } from './components/LandingPage';
import { Chatbot } from './components/Chatbot';
import { DeviceForm } from './components/DeviceForm';
import { LogsTable } from './components/LogsTable';
import { Activity, Send, Download, Ticket, Wrench, UserPlus, CreditCard, Server, Layers } from 'lucide-react';
import { clsx } from 'clsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSystemPanelOpen, setIsSystemPanelOpen] = useState(false);
  const [isGlassmorphic, setIsGlassmorphic] = useState(true);

  if (!isLoggedIn) {
    return <LandingPage onEnter={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    if (activeTab.startsWith('logs-')) {
      const type = activeTab.split('-')[1] as any;
      return <LogsTable type={type === 'sub' ? 'subscription' : type} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <ProfileAPI isGlassmorphic={isGlassmorphic} setIsGlassmorphic={setIsGlassmorphic} />;
      case 'statistics':
        return <Statistics />;
      case 'mag-add':
        return <DeviceForm type="mag" />;
      case 'm3u-add':
        return <DeviceForm type="m3u" />;
      case 'mag-list':
      case 'm3u-list':
        return <Customers />;
      case 'mag-quick':
      case 'm3u-quick':
        return (
          <div className="p-8 max-w-xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Quick Add New</h2>
            <div className="glass-panel p-8 rounded-2xl space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase">{activeTab.startsWith('mag') ? 'MAC Address' : 'Username'}</label>
                <input type="text" className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400 font-mono" placeholder={activeTab.startsWith('mag') ? '00:1A:79:...' : 'username'} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase">Duration</label>
                <select className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400">
                  <option>24H Trial</option>
                  <option>1 Month</option>
                </select>
              </div>
              <button className="w-full py-4 bg-cyan-500 text-void font-bold rounded-xl hover:bg-cyan-400 transition-all">
                Quick Create
              </button>
            </div>
          </div>
        );
      case 'tools-credit':
        return (
          <div className="p-8 max-w-xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Request Credit</h2>
            <div className="glass-panel p-8 rounded-2xl space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-400/10 flex items-center justify-center mx-auto mb-4 border border-orange-400/30">
                <CreditCard className="w-8 h-8 text-orange-400" />
              </div>
              <p className="text-text-muted mb-6">Enter the amount of credits you wish to purchase. Our team will review and send payment instructions.</p>
              <div className="space-y-2 text-left">
                <label className="text-xs font-mono text-text-muted uppercase">Amount</label>
                <input type="number" className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-400" placeholder="50" />
              </div>
              <button className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-400 transition-all">
                Request Credits
              </button>
            </div>
          </div>
        );
      case 'tools-templates':
        return (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-white">Custom Templates</h2>
              <button className="px-4 py-2 bg-cyan-500 text-void font-bold rounded-lg flex items-center gap-2">
                <Activity className="w-4 h-4" /> Add Template
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Basic Package', desc: 'Includes 500+ channels, UK/US/CA focus.', packages: ['UK Sports', 'US Entertainment', 'CA News'], vods: ['Action 2024', 'Drama Series'] },
                { name: 'Premium Sports', desc: 'All major sports leagues in 4K.', packages: ['Sky Sports', 'TNT Sports', 'DAZN', 'F1 TV'], vods: ['Sports Documentaries'] }
              ].map((template, i) => (
                <div key={i} className="glass-panel p-6 rounded-xl border-l-4 border-l-cyan-400 group relative">
                  <h3 className="text-white font-bold mb-2 cursor-help">{template.name}</h3>
                  <p className="text-text-muted text-sm mb-4">{template.desc}</p>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute left-0 bottom-full mb-2 w-64 glass-panel p-4 rounded-xl border-cyan-400/30 shadow-2xl z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2">Template Summary</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[8px] font-mono text-text-muted uppercase mb-1">Packages</p>
                        <div className="flex flex-wrap gap-1">
                          {template.packages.map(p => <span key={p} className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] text-white">{p}</span>)}
                        </div>
                      </div>
                      <div>
                        <p className="text-[8px] font-mono text-text-muted uppercase mb-1">VOD Categories</p>
                        <div className="flex flex-wrap gap-1">
                          {template.vods.map(v => <span key={v} className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] text-white">{v}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="text-xs text-cyan-400 hover:underline">Edit</button>
                    <button className="text-xs text-red hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'tools-updates':
        return (
          <div className="p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Latest Updates</h2>
            <div className="space-y-4">
              {[
                { date: '2024-03-15', title: 'New 4K Channels Added', desc: 'Added 50+ new 4K channels to the Ultimate package.' },
                { date: '2024-03-10', title: 'System Maintenance', desc: 'Server optimization completed successfully.' },
                { date: '2024-03-05', title: 'VOD Library Expansion', desc: 'Added 200+ new movies and series.' },
              ].map((update, i) => (
                <div key={i} className="glass-panel p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400" />
                  <span className="text-[10px] font-mono text-cyan-400 uppercase mb-1 block">{update.date}</span>
                  <h3 className="text-white font-bold mb-1">{update.title}</h3>
                  <p className="text-text-muted text-sm">{update.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'ticket':
        return (
          <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Open a Ticket</h2>
            <div className="glass-panel p-8 rounded-2xl space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase">Subject</label>
                <input type="text" className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400" placeholder="Brief description of the issue" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase">Priority</label>
                <select className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase">Message</label>
                <textarea rows={5} className="w-full bg-void border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400 resize-none" placeholder="Describe your problem in detail..." />
              </div>
              <button className="w-full py-4 bg-cyan-500 text-void font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,245,255,0.2)]">
                Submit Ticket
              </button>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={clsx(
      "flex h-screen w-screen overflow-hidden bg-void selection:bg-cyan-400/30 selection:text-cyan-100 transition-all duration-700",
      isGlassmorphic ? "glass-mode" : "standard-mode"
    )}>
      <Background />
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <Topbar setActiveTab={setActiveTab} setIsLoggedIn={setIsLoggedIn} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          {renderContent()}
          
          {/* Toggle System Panel Button */}
          {!isSystemPanelOpen && (
            <button 
              onClick={() => setIsSystemPanelOpen(true)}
              className="fixed right-0 top-1/2 -translate-y-1/2 w-8 h-24 bg-panel border-l border-y border-border-glow rounded-l-xl flex items-center justify-center hover:bg-white/5 transition-all z-20 group"
            >
              <Activity className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </main>
      </div>

      <SystemPanel isOpen={isSystemPanelOpen} onClose={() => setIsSystemPanelOpen(false)} />
      <Chatbot />
    </div>
  );
}




