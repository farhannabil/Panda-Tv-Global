import React, { useEffect, useRef, useState } from 'react';
import { Shield, Zap, Sparkles, Check } from 'lucide-react';
import { Background } from './Background';
import { CyberPanelSection } from './CyberPanelSection';
import { Logo } from './Logo';

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [strength, setStrength] = useState(0);

  const openModal = (tab: 'signin' | 'signup') => {
    setAuthTab(tab);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const checkStrength = (v: string) => {
    let score = 0;
    if (v.length >= 8) score++;
    if (v.length >= 12) score++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    setStrength(score);
  };

  const simulateLogin = (e: React.MouseEvent) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const originalText = btn.textContent;
    btn.textContent = '◉ AUTHENTICATING...';
    btn.style.background = 'linear-gradient(135deg,#00e676,#00b0ff)';
    
    setTimeout(() => {
      btn.textContent = '✓ ACCESS GRANTED';
      btn.style.background = 'linear-gradient(135deg,#00e676,#00f5ff)';
      setTimeout(() => {
        onEnter();
      }, 800);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-void text-text-primary font-sans overflow-x-hidden">
      <Background />
      
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 padding-18-48 flex items-center justify-between px-12 py-6 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
        <Logo size="sm" />
        <ul className="hidden md:flex gap-9 list-none">
          <li><a href="#features" className="text-text-muted hover:text-cyan font-semibold text-sm tracking-widest uppercase transition-colors">Features</a></li>
          <li><a href="#plans" className="text-text-muted hover:text-cyan font-semibold text-sm tracking-widest uppercase transition-colors">Plans</a></li>
          <li><a href="#reseller" className="text-text-muted hover:text-cyan font-semibold text-sm tracking-widest uppercase transition-colors">Resellers</a></li>
        </ul>
        <div className="flex gap-3">
          <button onClick={() => openModal('signin')} className="font-display text-[0.75rem] font-bold tracking-[0.15em] uppercase px-6 py-2.5 rounded-[3px] border border-cyan/35 text-cyan hover:bg-cyan/10 hover:border-cyan hover:shadow-[0_0_20px_rgba(0,245,255,0.2)] transition-all">Sign In</button>
          <button onClick={() => openModal('signup')} className="font-display text-[0.75rem] font-bold tracking-[0.15em] uppercase px-6 py-2.5 rounded-[3px] bg-gradient-to-br from-cyan to-violet text-void hover:translate-y-[-2px] hover:shadow-[0_8px_40px_rgba(0,245,255,0.4)] transition-all">
            <span>⚡ Join Now</span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[120px] pb-20 relative z-10">
        <div className="inline-flex items-center gap-2 border border-cyan/25 bg-cyan/5 px-4 py-1.5 rounded-[2px] font-mono text-[0.7rem] text-cyan tracking-[0.2em] uppercase mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
          Live · 57,000+ Channels · 4K Ultra HD
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12 animate-in fade-in zoom-in duration-1000">
          <Logo size="xl" />
        </div>

        <p className="text-[clamp(1rem,2vw,1.2rem)] font-normal text-text-muted max-w-[800px] leading-[1.7] mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          The most powerful IPTV reseller platform in the galaxy. Deploy. Profit. Dominate. Zero latency. Infinite content. One network to rule them all.
        </p>
        <div className="flex gap-6 flex-wrap justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <button onClick={() => openModal('signup')} className="font-display text-[1rem] font-black tracking-[0.2em] uppercase px-12 py-5 rounded-[4px] bg-gradient-to-br from-cyan to-violet text-void hover:translate-y-[-2px] hover:shadow-[0_8px_40px_rgba(0,245,255,0.4)] transition-all">
            <span>⚡ Become a Reseller</span>
          </button>
          <button onClick={() => openModal('signin')} className="font-display text-[1rem] font-bold tracking-[0.2em] uppercase px-12 py-5 rounded-[4px] border border-cyan/35 text-cyan hover:bg-cyan/10 hover:border-cyan hover:shadow-[0_0_20px_rgba(0,245,255,0.2)] transition-all">
            ▶ Access Dashboard
          </button>
        </div>

        <div className="flex gap-0 justify-center flex-wrap mt-24 border-t border-cyan/10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          {[
            { n: '57K+', l: 'Live Channels' },
            { n: '181K+', l: 'VOD Titles' },
            { n: '99.9%', l: 'Uptime SLA' },
            { n: '33+', l: 'Active Resellers' }
          ].map((s, i) => (
            <div key={i} className="px-16 py-10 text-center border-r border-cyan/10 last:border-none group">
              <div className="font-display text-[2.8rem] font-black bg-clip-text text-transparent bg-gradient-to-br from-cyan to-violet group-hover:scale-110 transition-transform">{s.n}</div>
              <div className="text-[0.85rem] tracking-[0.2em] text-text-muted uppercase mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="py-[120px] px-12 max-w-[1300px] mx-auto relative z-10">
        <div className="mb-16">
          <div className="font-mono text-[0.7rem] text-cyan tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
            <div className="w-8 h-[1px] bg-cyan" /> Capabilities
          </div>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-[1.2] mb-6">
            Built for <em className="not-italic text-cyan">Resellers</em> Who<br />Demand the Edge
          </h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[2px] border border-cyan/10">
          {[
            { i: '📡', t: 'Anti-Freeze Technology', d: 'Proprietary buffer protocol eliminates freeze frames and artifacts even on congested networks.' },
            { i: '⚡', t: 'Instant Activation', d: 'Spin up new customer lines in under 3 seconds from your dashboard. Fully automated provisioning.' },
            { i: '🛡', t: 'DDoS Shield', d: 'Enterprise-grade infrastructure absorbs attacks up to 3Tbps, keeping every stream alive.' },
            { i: '🌍', t: 'Global CDN Edge', d: '55 edge nodes across 6 continents. Content served from the nearest node, always.' },
            { i: '💰', t: 'Margin Control', d: 'You set the price. You keep the profit. Full white-label branding included at every tier.' },
            { i: '🤖', t: 'AI Analytics', d: 'Predictive churn alerts, revenue optimization, and viewer behavior intelligence built-in.' }
          ].map((f, i) => (
            <div key={i} className="bg-panel p-10 relative overflow-hidden group hover:bg-[#060828f2] transition-colors">
              <span className="absolute top-4 right-5 font-mono text-[0.65rem] text-cyan/15 tracking-[0.1em]">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[2.4rem] mb-5 block transition-transform group-hover:scale-110 group-hover:rotate-[-5deg] drop-shadow-[0_0_12px_#00f5ff]">{f.i}</span>
              <h3 className="font-display text-base font-bold tracking-wider mb-3 text-text-primary">{f.t}</h3>
              <p className="text-[0.95rem] text-text-muted leading-[1.6] font-light">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="py-[120px] px-12 max-w-[1300px] mx-auto relative z-10">
        <div className="mb-16">
          <div className="font-mono text-[0.7rem] text-cyan tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
            <div className="w-8 h-[1px] bg-cyan" /> Reseller Plans
          </div>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-[1.2] mb-6">
            Choose Your <em className="not-italic text-cyan">Power Level</em>
          </h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-12 mt-20">
          {[
            { 
              t: 'Initiate', 
              p: '29', 
              d: 'Perfect for starting your IPTV empire from ground zero.', 
              f: ['Up to 50 credits', '24/7 Support', 'HD + FHD streams', 'Custom portal branding'],
              icon: Shield,
              aura: 'aura-blue',
              color: 'text-blue-500',
              btn: 'bg-gradient-to-r from-blue-600 to-indigo-600'
            },
            { 
              t: 'Commander', 
              p: '79', 
              d: 'Scale fast with dedicated infrastructure and premium channels.', 
              f: ['Up to 250 credits', 'Priority 24/7 Support', '4K Ultra HD streams', 'Full white-label suite', 'AI analytics'], 
              featured: true,
              icon: Zap,
              aura: 'aura-cyan',
              color: 'text-cyan',
              btn: 'bg-gradient-to-r from-cyan to-blue-500'
            },
            { 
              t: 'Overlord', 
              p: '199', 
              d: 'Unlimited power. Run your own IPTV empire at scale.', 
              f: ['Unlimited credits', 'Dedicated account manager', '8K ready streams', 'Multi-tier resellers'],
              icon: Sparkles,
              aura: 'aura-orange',
              color: 'text-orange',
              btn: 'bg-gradient-to-r from-orange to-red-600'
            }
          ].map((p, i) => (
            <div key={i} className={`relative group ${p.featured ? 'scale-105 z-10' : ''}`}>
              {/* Floating Sentinel */}
              <div className={`absolute -top-12 left-1/2 -translate-x-1/2 z-20 floating-sentinel`} style={{ animationDelay: `${i * -1}s` }}>
                <div className={`w-20 h-20 bg-void rounded-2xl border-2 flex items-center justify-center ${p.aura} ${p.featured ? 'border-cyan' : p.t === 'Initiate' ? 'border-blue-500' : 'border-orange'}`}>
                  <p.icon className={`w-10 h-10 ${p.color}`} />
                </div>
              </div>

              <div className={`h-full bg-panel/40 backdrop-blur-xl rounded-2xl p-10 pt-16 flex flex-col transition-all duration-300 hover:bg-panel/60 border ${p.featured ? 'lightning-border border-cyan/50 shadow-2xl shadow-cyan/20' : 'border-white/10'}`}>
                <h3 className={`font-display text-2xl font-black italic tracking-wider text-center mb-2 uppercase ${p.color}`}>{p.t}</h3>
                <div className="flex items-end justify-center gap-1 mb-8">
                  <span className="text-4xl font-black text-white">${p.p}</span>
                  <span className="text-text-muted font-bold mb-1">/mo</span>
                </div>
                
                <ul className="space-y-4 mb-10 flex-grow">
                  {p.f.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-text-muted">
                      <Check className={`w-4 h-4 ${p.color}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => openModal('signup')} 
                  className={`w-full py-4 rounded-xl text-white font-black uppercase tracking-widest text-xs transition-all hover:scale-105 shadow-lg ${p.btn} ${p.featured ? 'shadow-cyan/30' : ''}`}
                >
                  {p.featured ? 'Activate Now' : p.t === 'Initiate' ? 'Get Started' : 'Claim Dominance'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CyberPanelSection />

      <footer className="border-t border-cyan/10 py-10 px-12 flex items-center justify-between flex-wrap gap-4 relative z-10">
        <div className="font-display text-base font-black tracking-widest text-gradient">PANDA<span className="text-pink-500">⬡</span>IPTV</div>
        <p className="text-[0.8rem] text-text-muted">© 2025 Panda IPTV. All streams reserved. Reseller Network v4.2</p>
        <div className="flex gap-5">
          <a href="#" className="text-text-muted text-[0.8rem] no-underline">Privacy</a>
          <a href="#" className="text-text-muted text-[0.8rem] no-underline">Terms</a>
          <a href="#" className="text-text-muted text-[0.8rem] no-underline">Contact</a>
        </div>
      </footer>

      {/* AUTH MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#040618fa] border border-cyan/20 rounded-lg w-full max-w-[480px] p-12 relative shadow-[0_0_100px_rgba(0,245,255,0.1)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(0,245,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,255,0.5)_1px,transparent_1px)] bg-[length:32px_32px]" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan to-transparent" />
            
            <button onClick={closeModal} className="absolute top-4 right-4 bg-none border border-white/10 text-text-muted w-8 h-8 rounded-full flex items-center justify-center hover:border-pink-500 hover:text-pink-500 transition-all">✕</button>

            <div className="flex border-b border-cyan/15 mb-9">
              <div onClick={() => setAuthTab('signin')} className={`flex-1 py-3 text-center cursor-pointer font-display text-[0.7rem] tracking-[0.15em] transition-all border-b-2 ${authTab === 'signin' ? 'text-cyan border-cyan' : 'text-text-muted border-transparent'}`}>Sign In</div>
              <div onClick={() => setAuthTab('signup')} className={`flex-1 py-3 text-center cursor-pointer font-display text-[0.7rem] tracking-[0.15em] transition-all border-b-2 ${authTab === 'signup' ? 'text-cyan border-cyan' : 'text-text-muted border-transparent'}`}>Reseller Access</div>
            </div>

            {authTab === 'signin' ? (
              <div className="animate-in fade-in duration-300">
                <h2 className="font-display text-[1.4rem] font-black mb-1.5">Welcome Back</h2>
                <p className="text-[0.85rem] text-text-muted mb-8">Access your reseller dashboard</p>

                <div className="flex gap-3 mb-6">
                  <button className="flex-1 py-2.5 border border-white/10 bg-white/5 rounded-[3px] text-text-muted text-[0.85rem] font-semibold tracking-wider hover:border-cyan/30 hover:text-text-primary hover:bg-cyan/5 transition-all">🔷 Microsoft</button>
                  <button className="flex-1 py-2.5 border border-white/10 bg-white/5 rounded-[3px] text-text-muted text-[0.85rem] font-semibold tracking-wider hover:border-cyan/30 hover:text-text-primary hover:bg-cyan/5 transition-all">◉ Google</button>
                </div>
                <div className="flex items-center gap-4 my-6 text-text-muted text-[0.75rem]">
                  <div className="flex-1 h-[1px] bg-white/10" /> or continue with credentials <div className="flex-1 h-[1px] bg-white/10" />
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block font-mono text-[0.65rem] tracking-[0.2em] uppercase text-text-muted">Reseller ID / Email</label>
                    <input type="text" placeholder="panda_reseller@domain.com" className="w-full px-4 py-3.5 bg-cyan/5 border border-cyan/15 rounded-[3px] text-text-primary outline-none focus:border-cyan focus:bg-cyan/10 focus:ring-2 focus:ring-cyan/10 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-mono text-[0.65rem] tracking-[0.2em] uppercase text-text-muted">Access Key</label>
                    <input type="password" placeholder="••••••••••••••••" className="w-full px-4 py-3.5 bg-cyan/5 border border-cyan/15 rounded-[3px] text-text-primary outline-none focus:border-cyan focus:bg-cyan/10 focus:ring-2 focus:ring-cyan/10 transition-all" />
                  </div>
                  <button onClick={simulateLogin} className="w-full py-4 mt-2 bg-gradient-to-br from-cyan to-violet rounded-[3px] font-display text-[0.8rem] font-black tracking-[0.2em] text-void uppercase hover:translate-y-[-2px] hover:shadow-[0_8px_40px_rgba(0,245,255,0.5)] transition-all">◈ ENTER THE NETWORK</button>
                </div>
                <div className="text-center mt-5 text-[0.85rem] text-text-muted">
                  No account? <a onClick={() => setAuthTab('signup')} className="text-cyan cursor-pointer hover:underline">Apply for reseller access →</a>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <h2 className="font-display text-[1.4rem] font-black mb-1.5">Join the Grid</h2>
                <p className="text-[0.85rem] text-text-muted mb-8">Become an authorized Panda IPTV reseller</p>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="space-y-2">
                    <label className="block font-mono text-[0.65rem] tracking-[0.2em] uppercase text-text-muted">First Name</label>
                    <input type="text" placeholder="Alex" className="w-full px-4 py-3.5 bg-cyan/5 border border-cyan/15 rounded-[3px] text-text-primary outline-none focus:border-cyan focus:bg-cyan/10 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-mono text-[0.65rem] tracking-[0.2em] uppercase text-text-muted">Last Name</label>
                    <input type="text" placeholder="Nova" className="w-full px-4 py-3.5 bg-cyan/5 border border-cyan/15 rounded-[3px] text-text-primary outline-none focus:border-cyan focus:bg-cyan/10 transition-all" />
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block font-mono text-[0.65rem] tracking-[0.2em] uppercase text-text-muted">Business Email</label>
                    <input type="email" placeholder="you@business.com" className="w-full px-4 py-3.5 bg-cyan/5 border border-cyan/15 rounded-[3px] text-text-primary outline-none focus:border-cyan focus:bg-cyan/10 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-mono text-[0.65rem] tracking-[0.2em] uppercase text-text-muted">Create Password</label>
                    <input type="password" placeholder="••••••••••••" onChange={(e) => checkStrength(e.target.value)} className="w-full px-4 py-3.5 bg-cyan/5 border border-cyan/15 rounded-[3px] text-text-primary outline-none focus:border-cyan focus:bg-cyan/10 transition-all" />
                    <div className="h-[3px] bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${strength < 2 ? 'bg-pink-500' : strength < 4 ? 'bg-orange-500' : 'bg-cyan'}`} style={{ width: `${(strength / 5) * 100}%` }} />
                    </div>
                  </div>
                  <button onClick={simulateLogin} className="w-full py-4 mt-2 bg-gradient-to-br from-cyan to-violet rounded-[3px] font-display text-[0.8rem] font-black tracking-[0.2em] text-void uppercase hover:translate-y-[-2px] hover:shadow-[0_8px_40px_rgba(0,245,255,0.5)] transition-all">⚡ ACTIVATE RESELLER ACCOUNT</button>
                </div>
                <div className="text-center mt-5 text-[0.85rem] text-text-muted">
                  Already a reseller? <a onClick={() => setAuthTab('signin')} className="text-cyan cursor-pointer hover:underline">Sign in →</a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
