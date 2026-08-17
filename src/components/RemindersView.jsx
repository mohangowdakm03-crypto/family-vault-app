import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { PhoneCall, MessageSquare, AlertCircle, Clock, Bell, Plus, Check } from 'lucide-react';

export default function RemindersView({ onOpenWhatsAppModal }) {
  const { callReminders, borrowers, settings } = useFinance();

  const currency = settings.currency;

  return (
    <div className="space-y-6 pb-20 lg:pb-10">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <PhoneCall className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">Borrower Call & Collection Reminders</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              One-touch direct calling & custom WhatsApp collection message launchers
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1">
              <Bell className="w-3.5 h-3.5" />
              <span>Smart Call Alerts Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Overdue Call Alerts Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1.5" /> Overdue Collection Calls Required
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {borrowers.filter(b => b.activeLoanAmount > 0 && b.status === 'Overdue').map(b => (
            <div key={b.id} className="glass-card border border-rose-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-xl">
                      {b.avatar || '🧔'}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-base">{b.name}</h4>
                      <p className="text-xs text-slate-400">{b.phone} • {b.relation}</p>
                    </div>
                  </div>
                  <span className="bg-rose-500 text-white text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full call-alert-pulse">
                    Overdue
                  </span>
                </div>

                <div className="mt-4 p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Balance Pending</span>
                    <p className="text-base font-extrabold text-rose-400">{currency}{b.activeLoanAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Due Date</span>
                    <p className="text-xs font-bold text-slate-200">{b.expectedReturnDate}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800">
                <a
                  href={`tel:${b.phone}`}
                  className="flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call {b.name.split(' ')[0]} Now</span>
                </a>

                <button
                  onClick={() => onOpenWhatsAppModal(b)}
                  className="flex items-center justify-center space-x-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 py-2.5 rounded-xl font-bold text-xs transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Borrowers Collection Call Schedule */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Upcoming Borrower Collection Schedule</h3>

        <div className="space-y-3">
          {borrowers.filter(b => b.activeLoanAmount > 0 && b.status !== 'Overdue').map(b => (
            <div key={b.id} className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-lg">
                  {b.avatar || '🧔'}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{b.name}</h4>
                  <p className="text-xs text-slate-400">{b.phone} • Return target: {b.expectedReturnDate}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-3">
                <span className="font-extrabold text-white text-sm">{currency}{b.activeLoanAmount.toLocaleString()}</span>
                
                <div className="flex items-center space-x-2">
                  <a
                    href={`tel:${b.phone}`}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>

                  <button
                    onClick={() => onOpenWhatsAppModal(b)}
                    className="p-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
