import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, increment, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, UserStatus } from '../types';
import { Users, UserPlus, CreditCard, CheckCircle2, XCircle, Search, Filter, MoreVertical, Shield } from 'lucide-react';
import { clsx } from 'clsx';

export function AdminResellers() {
  const [resellers, setResellers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedReseller, setSelectedReseller] = useState<User | null>(null);
  const [creditAmount, setCreditAmount] = useState(0);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [savingApiKey, setSavingApiKey] = useState(false);

  // Check if running in demo mode (demo=true in URL)
  const isDemoMode = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).get('demo') === 'true';

  useEffect(() => {
    // In demo mode, show mock data
    if (isDemoMode) {
      console.log('Demo mode enabled, showing mock reseller data');
      setResellers([
        { uid: '1', username: 'reseller_alpha', name: 'Alpha User', phone: '+1 234 567 8901', email: 'alpha@test.com', role: 'RESELLER', credits: 50, status: 'approved', createdAt: '2024-01-15', apiKey: '', activationUsername: 'act_alpha', activationPassword: 'pass123', pandaUsername: 'reseller_alpha', pandaPassword: 'panda123' },
        { uid: '2', username: 'reseller_beta', name: 'Beta User', phone: '+1 234 567 8902', email: 'beta@test.com', role: 'RESELLER', credits: 25, status: 'approved', createdAt: '2024-02-20', apiKey: 'demo_api_key_123', activationUsername: 'act_beta', activationPassword: 'pass456', pandaUsername: 'reseller_beta', pandaPassword: 'panda456' },
        { uid: '3', username: 'reseller_gamma', name: 'Gamma User', phone: '+1 234 567 8903', email: 'gamma@test.com', role: 'RESELLER', credits: 0, status: 'pending', createdAt: '2024-03-01', apiKey: '', activationUsername: '', activationPassword: '', pandaUsername: 'reseller_gamma', pandaPassword: '' },
      ]);
      setLoading(false);
      return;
    }

    console.log('Loading resellers from Firebase, db:', !!db);
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'users'), where('role', '==', 'RESELLER'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
      setResellers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isDemoMode]);

  const handleStatusChange = async (uid: string, status: UserStatus) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'users', uid), { status });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddCredits = async () => {
    if (!db || !selectedReseller || creditAmount <= 0) return;
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', selectedReseller.uid);
        transaction.update(userRef, {
          credits: increment(creditAmount)
        });

        const txRef = doc(collection(db, 'transactions'));
        transaction.set(txRef, {
          userId: selectedReseller.uid,
          type: 'CREDITADD',
          amount: creditAmount,
          createdAt: new Date().toISOString()
        });
      });
      setIsCreditModalOpen(false);
      setCreditAmount(0);
    } catch (error) {
      console.error('Error adding credits:', error);
    }
  };

  const handleSaveApiKey = async () => {
    if (!db || !selectedReseller || !apiKeyValue.trim()) return;
    setSavingApiKey(true);
    try {
      await updateDoc(doc(db, 'users', selectedReseller.uid), { 
        apiKey: apiKeyValue.trim() 
      });
      setIsApiKeyModalOpen(false);
      setApiKeyValue('');
    } catch (error) {
      console.error('Error saving API key:', error);
    } finally {
      setSavingApiKey(false);
    }
  };

  const openApiKeyModal = (reseller: User) => {
    setSelectedReseller(reseller);
    setApiKeyValue(reseller.apiKey || '');
    setIsApiKeyModalOpen(true);
  };

  const [showAddForm, setShowAddForm] = useState(true); // Show by default
  const [newReseller, setNewReseller] = useState({ 
    username: '', 
    email: '', 
    phone: '',
    name: '',
    apiKey: '', 
    credits: 0,
    activationUsername: '',
    activationPassword: '',
    pandaUsername: '',
    pandaPassword: ''
  });
  const [addingReseller, setAddingReseller] = useState(false);

  const handleAddReseller = async () => {
    if (!newReseller.username.trim() || !newReseller.email.trim()) return;
    
    // In demo mode, add to local state
    if (isDemoMode) {
      const newUser: User = {
        uid: Date.now().toString(),
        username: newReseller.username,
        email: newReseller.email,
        phone: newReseller.phone,
        name: newReseller.name,
        role: 'RESELLER',
        credits: newReseller.credits,
        status: 'approved',
        createdAt: new Date().toISOString().split('T')[0],
        apiKey: newReseller.apiKey,
        activationUsername: newReseller.activationUsername,
        activationPassword: newReseller.activationPassword,
        pandaUsername: newReseller.pandaUsername,
        pandaPassword: newReseller.pandaPassword
      };
      setResellers([...resellers, newUser]);
      setNewReseller({ 
        username: '', 
        email: '', 
        phone: '',
        name: '',
        apiKey: '', 
        credits: 0,
        activationUsername: '',
        activationPassword: '',
        pandaUsername: '',
        pandaPassword: ''
      });
      setShowAddForm(false);
      return;
    }
    
    // Real Firebase implementation would go here
    setShowAddForm(false);
  };

  const filteredResellers = resellers.filter(r => 
    r.username.toLowerCase().includes(search.toLowerCase()) || 
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-8 h-8 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter">
            Reseller <span className="text-cyan">Management</span>
          </h1>
          <p className="text-text-muted font-mono text-xs uppercase tracking-widest">Authorized Agents Network</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan text-void font-display font-bold uppercase tracking-wider text-xs hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,245,255,0.3)]"
          >
            <UserPlus className="w-4 h-4" />
            Add Reseller
          </button>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search resellers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-void border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:border-cyan outline-none transition-all" 
            />
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="glass-panel p-6 rounded-3xl border-cyan/30 space-y-6">
          <h3 className="text-lg font-display font-bold text-white uppercase">Add New Reseller</h3>
          
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Panda Username</label>
              <input 
                type="text" 
                value={newReseller.username}
                onChange={(e) => setNewReseller({...newReseller, username: e.target.value})}
                className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan outline-none transition-all"
                placeholder="panda_username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Panda Password</label>
              <input 
                type="password" 
                value={newReseller.pandaPassword}
                onChange={(e) => setNewReseller({...newReseller, pandaPassword: e.target.value})}
                className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Full Name</label>
              <input 
                type="text" 
                value={newReseller.name}
                onChange={(e) => setNewReseller({...newReseller, name: e.target.value})}
                className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Phone</label>
              <input 
                type="tel" 
                value={newReseller.phone}
                onChange={(e) => setNewReseller({...newReseller, phone: e.target.value})}
                className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan outline-none transition-all"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Email</label>
              <input 
                type="email" 
                value={newReseller.email}
                onChange={(e) => setNewReseller({...newReseller, email: e.target.value})}
                className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan outline-none transition-all"
                placeholder="reseller@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Initial Credits</label>
              <input 
                type="number" 
                value={newReseller.credits}
                onChange={(e) => setNewReseller({...newReseller, credits: parseInt(e.target.value) || 0})}
                className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-cyan outline-none transition-all"
                placeholder="0"
              />
            </div>
          </div>

          {/* Activation Panel Credentials */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm font-display font-bold text-cyan uppercase tracking-wider mb-4">Activation Panel Credentials</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Activation Username</label>
                <input 
                  type="text" 
                  value={newReseller.activationUsername}
                  onChange={(e) => setNewReseller({...newReseller, activationUsername: e.target.value})}
                  className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan outline-none transition-all"
                  placeholder="activation_username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Activation Password</label>
                <input 
                  type="password" 
                  value={newReseller.activationPassword}
                  onChange={(e) => setNewReseller({...newReseller, activationPassword: e.target.value})}
                  className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">API Key (Activation Panel)</label>
                <input 
                  type="text" 
                  value={newReseller.apiKey}
                  onChange={(e) => setNewReseller({...newReseller, apiKey: e.target.value})}
                  className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-cyan outline-none transition-all"
                  placeholder="Enter Activation Panel API key"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              onClick={() => setShowAddForm(false)}
              className="px-6 py-3 rounded-xl border border-white/10 text-text-muted font-display font-bold uppercase tracking-wider text-xs hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddReseller}
              disabled={addingReseller || !newReseller.username.trim() || !newReseller.email.trim()}
              className="px-6 py-3 rounded-xl bg-cyan text-void font-display font-bold uppercase tracking-wider text-xs hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,245,255,0.3)] disabled:opacity-50"
            >
              {addingReseller ? 'Adding...' : 'Add Reseller'}
            </button>
          </div>
        </div>
      )}

      <div className="glass-panel rounded-3xl border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-4 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">Status</th>
              <th className="px-4 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">Panda User</th>
              <th className="px-4 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">Name</th>
              <th className="px-4 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">Phone</th>
              <th className="px-4 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">Email</th>
              <th className="px-4 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">API Key</th>
              <th className="px-4 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">Credits</th>
              <th className="px-4 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">Joined</th>
              <th className="px-4 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredResellers.map((reseller) => (
              <tr key={reseller.uid} className="hover:bg-white/[0.02] transition-all">
                <td className="px-4 py-4">
                  <span className={clsx(
                    "inline-flex items-center px-2 py-1 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider border",
                    reseller.status === 'approved' ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/30" : "bg-orange-400/10 text-orange-400 border-orange-400/30"
                  )}>
                    {reseller.status}
                  </span>
                </td>
                <td className="px-4 py-4 font-bold text-white">{reseller.username}</td>
                <td className="px-4 py-4 text-text-muted text-sm">{reseller.name || '-'}</td>
                <td className="px-4 py-4 text-text-muted text-sm">{reseller.phone || '-'}</td>
                <td className="px-4 py-4 text-text-muted text-sm">{reseller.email}</td>
                <td className="px-4 py-4">
                  <button 
                    onClick={() => openApiKeyModal(reseller)}
                    className={clsx(
                      "px-2 py-1 rounded text-xs font-mono",
                      reseller.apiKey 
                        ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30" 
                        : "bg-orange-400/10 text-orange-400 border border-orange-400/30"
                    )}
                  >
                    {reseller.apiKey ? '✓ Set' : '✗ Missing'}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3 h-3 text-cyan" />
                    <span className="font-mono text-cyan font-bold">{reseller.credits}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-text-muted text-xs font-mono">{reseller.createdAt?.split('T')[0]}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {reseller.status === 'pending' && (
                      <button 
                        onClick={() => handleStatusChange(reseller.uid, 'approved')}
                        className="p-2 rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-all"
                        title="Approve"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setSelectedReseller(reseller);
                        setIsCreditModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan/20 transition-all"
                      title="Add Credits"
                    >
                      <CreditCard className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreditModalOpen && selectedReseller && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-3xl border-cyan/30 w-full max-w-md space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan/10 rounded-xl flex items-center justify-center border border-cyan/30">
                <CreditCard className="w-6 h-6 text-cyan" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white uppercase">Add Credits</h3>
                <p className="text-text-muted text-xs font-mono">To: {selectedReseller.username}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Amount</label>
              <input 
                type="number" 
                value={creditAmount}
                onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-void border border-white/10 rounded-xl px-4 py-4 text-white font-mono focus:border-cyan outline-none transition-all"
                placeholder="Enter amount"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setIsCreditModalOpen(false)}
                className="flex-1 py-4 rounded-xl border border-white/10 text-text-muted font-display font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCredits}
                className="flex-1 py-4 rounded-xl bg-cyan text-void font-display font-bold uppercase tracking-widest text-xs hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,245,255,0.3)]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {isApiKeyModalOpen && selectedReseller && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-3xl border-cyan/30 w-full max-w-md space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan/10 rounded-xl flex items-center justify-center border border-cyan/30">
                <Shield className="w-6 h-6 text-cyan" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white uppercase">Set API Key</h3>
                <p className="text-text-muted text-xs font-mono">For: {selectedReseller.username}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Activation Panel API Key</label>
              <input 
                type="text" 
                value={apiKeyValue}
                onChange={(e) => setApiKeyValue(e.target.value)}
                className="w-full bg-void border border-white/10 rounded-xl px-4 py-4 text-white font-mono focus:border-cyan outline-none transition-all"
                placeholder="Enter reseller's API key"
              />
              <p className="text-text-muted text-xs">Get this from activationpanel.net reseller account</p>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setIsApiKeyModalOpen(false)}
                className="flex-1 py-4 rounded-xl border border-white/10 text-text-muted font-display font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveApiKey}
                disabled={savingApiKey || !apiKeyValue.trim()}
                className="flex-1 py-4 rounded-xl bg-cyan text-void font-display font-bold uppercase tracking-widest text-xs hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,245,255,0.3)] disabled:opacity-50"
              >
                {savingApiKey ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
