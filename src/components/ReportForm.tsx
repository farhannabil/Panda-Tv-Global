import React, { useState } from 'react';
import { AlertTriangle, Send, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { User } from '../types';

interface ReportFormProps {
  userData: User;
}

export function ReportForm({ userData }: ReportFormProps) {
  const [category, setCategory] = useState('');
  const [stream, setStream] = useState('');
  const [problem, setProblem] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Demo mode check
  const isDemoMode = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).get('demo') === 'true';

  const categories = [
    { value: 'no_signal', label: 'No Signal / No Stream' },
    { value: 'buffering', label: 'Buffering / Freezing' },
    { value: 'wrong_channel', label: 'Wrong Channel' },
    { value: 'audio_issue', label: 'Audio Issue' },
    { value: 'video_issue', label: 'Video Issue (Pixelation/Blur)' },
    { value: 'connection_error', label: 'Connection Error' },
    { value: 'auth_error', label: 'Authentication Error' },
    { value: 'expired', label: 'Line Expired' },
    { value: 'other', label: 'Other Issue' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!category) {
      setError('Please select a category');
      return;
    }
    if (!stream.trim()) {
      setError('Please enter the stream identifier (MAC/Username)');
      return;
    }
    if (!problem.trim()) {
      setError('Please describe the problem');
      return;
    }

    setSubmitting(true);

    try {
      // In demo mode, simulate API call
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate successful submission
        console.log('Demo mode - Report submitted:', {
          category,
          stream: stream.trim(),
          problem: problem.trim(),
          resellerId: userData.uid,
          username: userData.username,
          timestamp: new Date().toISOString()
        });
        
        setSubmitted(true);
        setSubmitting(false);
        return;
      }

      // Real API call (curl equivalent)
      // This would connect to the activation panel's report endpoint
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.apiKey || ''}`
        },
        body: JSON.stringify({
          category,
          stream: stream.trim(),
          problem: problem.trim(),
          reseller_id: userData.uid,
          reseller_username: userData.username,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Report submission error:', err);
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setCategory('');
    setStream('');
    setProblem('');
    setSubmitted(false);
    setError('');
  };

  if (submitted) {
    return (
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter">
            Report <span className="text-cyan">Submitted</span>
          </h1>
          <p className="text-text-muted font-mono text-xs uppercase tracking-widest">Support Ticket Created</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border-emerald-500/30 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="w-20 h-20 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            Report Submitted Successfully!
          </h2>
          <p className="text-text-muted">
            Your report has been submitted. Our team will review it shortly.
          </p>
          <div className="bg-void rounded-xl p-4 text-left space-y-2">
            <p className="text-sm text-text-muted">
              <span className="text-cyan font-mono">Category:</span> {categories.find(c => c.value === category)?.label}
            </p>
            <p className="text-sm text-text-muted">
              <span className="text-cyan font-mono">Stream:</span> {stream}
            </p>
          </div>
          <button 
            onClick={handleReset}
            className="px-6 py-3 rounded-xl bg-cyan text-void font-display font-bold uppercase tracking-wider text-xs hover:bg-cyan-400 transition-all"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter">
          Report <span className="text-cyan">Issue</span>
        </h1>
        <p className="text-text-muted font-mono text-xs uppercase tracking-widest">Submit a support ticket</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl border-white/5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Category */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan outline-none transition-all appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="" className="bg-void">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-void">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Stream Identifier */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
              Stream (MAC / Username) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              placeholder="Enter MAC address or username"
              className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-cyan outline-none transition-all"
            />
          </div>

          {/* Problem Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
              What is the Problem? <span className="text-red-400">*</span>
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={5}
              className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan outline-none transition-all resize-none"
            />
          </div>

          {/* Info Box */}
          <div className="bg-cyan/10 border border-cyan/20 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
            <div className="text-sm text-cyan/80">
              <p className="font-bold mb-1">Before submitting:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Check if the line is active and not expired</li>
                <li>Verify the MAC/Username is correct</li>
                <li>Try restarting the device</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-cyan text-void font-display font-bold uppercase tracking-wider text-sm hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,245,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting Report...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Report
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
