import React, { useState } from 'react';
import { X, Copy, Check, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { iptvService } from '../services/iptvService';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'mag' | 'm3u';
  userData: any;
}

export function QuickAddModal({ isOpen, onClose, type, userData }: QuickAddModalProps) {
  const [macOrUsername, setMacOrUsername] = useState('');
  const [duration, setDuration] = useState('1');
  const [subType, setSubType] = useState<'NEW' | 'RENEW' | 'DEMO'>('NEW');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{url: string; username: string; password: string} | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!macOrUsername) return;
    setLoading(true);
    setError('');

    try {
      const identifier = type === 'mag' ? macOrUsername : macOrUsername;
      const pack = 'PANDA SPECIAL'.toLowerCase().replace(' ', '_');
      
      const apiResult = await iptvService.provision(
        type,
        identifier,
        subType === 'DEMO' ? '0' : duration,
        pack,
        userData?.uid || ''
      );

      if (apiResult.status !== 'true') {
        throw new Error(apiResult.message || 'Failed to provision line');
      }

      setResult({
        url: apiResult.url || 'http://tv.pandapanel.tv:8080/c/',
        username: apiResult.username || macOrUsername.toUpperCase(),
        password: apiResult.password || Math.random().toString(36).substring(2, 10).toUpperCase()
      });
    } catch (err: any) {
      setError(err.message || 'Failed to provision line');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClose = () => {
    setMacOrUsername('');
    setResult(null);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-void border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,245,255,0.2)] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white uppercase">Quick Add {type.toUpperCase()}</h3>
              <p className="text-[10px] text-text-muted font-mono uppercase">Instant Provision</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!result ? (
            <>
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* MAC/Username Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                  {type === 'mag' ? 'MAC Address' : 'Username'}
                </label>
                <input
                  type="text"
                  value={macOrUsername}
                  onChange={(e) => setMacOrUsername(type === 'mag' ? e.target.value.toUpperCase() : e.target.value)}
                  placeholder={type === 'mag' ? '00:1A:79:XX:XX:XX' : 'Enter username'}
                  className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan outline-none transition-all font-mono"
                />
              </div>

              {/* Sub Type */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Action Type</label>
                <div className="flex gap-2">
                  {(['NEW', 'RENEW', 'DEMO'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSubType(t)}
                      className={clsx(
                        "flex-1 py-2 rounded-lg border text-[10px] font-bold uppercase transition-all",
                        subType === t 
                          ? "bg-cyan/10 border-cyan text-cyan" 
                          : "border-white/10 text-text-muted hover:border-white/30"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={subType === 'DEMO'}
                  className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan outline-none transition-all text-sm disabled:opacity-50"
                >
                  {subType === 'DEMO' ? (
                    <option value="0">24H Trial (0 CR)</option>
                  ) : (
                    <>
                      <option value="1">1 Month</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">12 Months</option>
                    </>
                  )}
                </select>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!macOrUsername || loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-xl font-bold text-black uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Provisioning...' : 'Generate Line'}
              </button>
            </>
          ) : (
            /* Result Display */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-sm">
                  <Check className="w-4 h-4" />
                  Line Provisioned Successfully!
                </div>
              </div>

              {/* Credentials */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-text-muted uppercase">URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={result.url}
                      className="flex-1 bg-void/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(result.url, 'url')}
                      className="p-2 bg-cyan-500/20 rounded-lg hover:bg-cyan-500/30 transition-colors"
                    >
                      {copied === 'url' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-text-muted uppercase">Username</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={result.username}
                      className="flex-1 bg-void/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(result.username, 'username')}
                      className="p-2 bg-cyan-500/20 rounded-lg hover:bg-cyan-500/30 transition-colors"
                    >
                      {copied === 'username' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-text-muted uppercase">Password</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={result.password}
                      className="flex-1 bg-void/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(result.password, 'password')}
                      className="p-2 bg-cyan-500/20 rounded-lg hover:bg-cyan-500/30 transition-colors"
                    >
                      {copied === 'password' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Done Button */}
              <button
                onClick={handleClose}
                className="w-full py-3 bg-white/10 border border-white/20 rounded-xl font-bold text-white uppercase tracking-wider hover:bg-white/20 transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
