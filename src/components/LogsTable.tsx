import React from 'react';
import { History, ArrowRightLeft, CreditCard, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

interface LogsTableProps {
  type: 'subscription' | 'transfer' | 'transaction' | 'refund';
}

export function LogsTable({ type }: LogsTableProps) {
  const titles = {
    subscription: { label: 'Subscription Logs', icon: History, color: 'text-cyan-400' },
    transfer: { label: 'Transfer Logs', icon: ArrowRightLeft, color: 'text-violet-400' },
    transaction: { label: 'Transaction Logs', icon: CreditCard, color: 'text-orange-400' },
    refund: { label: 'Refund Logs', icon: RefreshCw, color: 'text-pink-400' },
  };

  const { label, icon: Icon, color } = titles[type];

  const mockLogs = [
    { id: 1, user: 'user_882', action: 'Renewed 12 Months', date: '2024-03-20 14:22', amount: '-12 Credits' },
    { id: 2, user: 'admin', action: 'Transfer to reseller_2', date: '2024-03-19 09:15', amount: '-50 Credits' },
    { id: 3, user: 'system', action: 'Auto-refund failed order', date: '2024-03-18 22:10', amount: '+1 Credit' },
    { id: 4, user: 'user_123', action: 'New MAG Device', date: '2024-03-18 11:05', amount: '-1 Credit' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">{label}</h2>
          <p className="text-text-muted text-sm font-mono">System event history and audit trail</p>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4 text-xs font-mono text-text-muted uppercase tracking-widest">ID</th>
              <th className="px-6 py-4 text-xs font-mono text-text-muted uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-xs font-mono text-text-muted uppercase tracking-widest">Action</th>
              <th className="px-6 py-4 text-xs font-mono text-text-muted uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-mono text-text-muted uppercase tracking-widest text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockLogs.map((log) => (
              <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs text-text-muted">#{log.id.toString().padStart(4, '0')}</td>
                <td className="px-6 py-4 text-sm text-text-primary font-medium">{log.user}</td>
                <td className="px-6 py-4 text-sm text-text-muted group-hover:text-white transition-colors">{log.action}</td>
                <td className="px-6 py-4 text-sm text-text-muted font-mono">{log.date}</td>
                <td className={clsx(
                  "px-6 py-4 text-sm font-bold text-right",
                  log.amount.startsWith('+') ? 'text-green' : 'text-red'
                )}>
                  {log.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
