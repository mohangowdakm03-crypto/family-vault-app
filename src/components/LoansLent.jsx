import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import confetti from 'canvas-confetti';
import { 
  HandCoins, 
  Plus, 
  PhoneCall, 
  MessageSquare, 
  Clock, 
  History,
  CheckCircle2,
  ListFilter
} from 'lucide-react';

export default function LoansLent({ onOpenAddBorrower, onOpenWhatsAppModal }) {
  const { t, borrowers, recordPartialRepayment, settings } = useFinance();

  const [activeTabSub, setActiveTabSub] = useState('active'); // 'active' | 'settled'
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [repayAmount, setRepayAmount] = useState('');
  const [repayNote, setRepayNote] = useState('');

  const currency = settings.currency;

  const handlePartialRepay = (e) => {
    e.preventDefault();
    if (!selectedBorrower || !repayAmount) return;

    const amountNum = Number(repayAmount);
    recordPartialRepayment(selectedBorrower.id, amountNum, repayNote || 'Partial Cash Return');

    if (amountNum >= selectedBorrower.activeLoanAmount) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setSelectedBorrower(null);
    setRepayAmount('');
    setRepayNote('');
  };

  const activeBorrowers = borrowers.filter(b => b.activeLoanAmount > 0);
  const settledBorrowers = borrowers.filter(b => b.activeLoanAmount === 0);

  const displayedBorrowers = activeTabSub === 'active' ? activeBorrowers : settledBorrowers;

  return (
    <div className="space-y-6 pb-20 lg:pb-10">
      
      {/* Header Panel */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <HandCoins className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">{t('borrowerVelocityTitle')}</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {t('borrowerSubtitle')}
            </p>
          </div>

          <button
            onClick={onOpenAddBorrower}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addMoneyLent')}</span>
          </button>
        </div>

        {/* Active vs Settled History Sub-Tabs */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTabSub('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTabSub === 'active' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>{t('activeLoansTab')}</span>
            <span className="bg-purple-950 px-2 py-0.5 rounded-full text-[10px]">{activeBorrowers.length}</span>
          </button>

          <button
            onClick={() => setActiveTabSub('settled')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTabSub === 'settled' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('settledHistoryTab')}</span>
            <span className="bg-emerald-950 px-2 py-0.5 rounded-full text-[10px]">{settledBorrowers.length}</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {displayedBorrowers.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center text-slate-400">
          <p className="text-base font-semibold">
            {activeTabSub === 'active' ? t('noBorrowersYet') : 'ಇನ್ನೂ ಯಾವುದೇ ಚುಕ್ತಾ ಮಾಡಿದ ಸಾಲದ ಇತಿಹಾಸವಿಲ್ಲ'}
          </p>
          <p className="text-xs text-slate-500 mt-1">{t('noBorrowersSub')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedBorrowers.map((b) => {
            const total = Number(b.totalLent);
            const repaid = Number(b.totalRepaid);
            const remaining = Number(b.activeLoanAmount);
            const percentPaid = total > 0 ? Math.round((repaid / total) * 100) : 100;

            return (
              <div key={b.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-2xl shadow-inner">
                        {b.avatar || '🧔'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-extrabold text-white text-base sm:text-lg">{b.name}</h3>
                          <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                            {b.relation}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{b.phone}</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      remaining === 0 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : b.status === 'Overdue' 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 call-alert-pulse' 
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {remaining === 0 ? t('settled') : b.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">{t('totalLent')}</span>
                      <p className="text-sm font-bold text-slate-200 mt-0.5">{currency}{total.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">{t('repaidSoFar')}</span>
                      <p className="text-sm font-bold text-emerald-400 mt-0.5">{currency}{repaid.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">{t('balancePending')}</span>
                      <p className="text-sm font-extrabold text-purple-400 mt-0.5">{currency}{remaining.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center space-x-1 text-purple-300 font-medium">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        <span>{t('avgPaybackTurnaround')}</span>
                      </span>
                      <span className="font-extrabold text-white bg-purple-500/20 px-2 py-0.5 rounded">
                        ⚡ {b.avgPaybackDays} {t('days')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{t('lentDate')} <strong>{b.lentDate}</strong></span>
                      <span>{t('expectedReturn')} <strong className={b.status === 'Overdue' ? 'text-rose-400 font-bold' : 'text-slate-200'}>{b.expectedReturnDate}</strong></span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                      <span>{t('repaymentProgress')}</span>
                      <span className="text-emerald-400">{percentPaid}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-500" style={{ width: `${percentPaid}%` }}></div>
                    </div>
                  </div>

                  {b.repaymentHistory && b.repaymentHistory.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80">
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center mb-2">
                        <History className="w-3 h-3 text-indigo-400 mr-1" /> {t('partialPaybackHistory')}
                      </span>
                      <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                        {b.repaymentHistory.map(rep => (
                          <div key={rep.id} className="flex justify-between text-xs bg-slate-900/40 px-2.5 py-1 rounded border border-slate-800">
                            <span className="text-slate-300">{rep.date} - {rep.note}</span>
                            <span className="font-bold text-emerald-400">+{currency}{rep.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedBorrower(b)}
                    disabled={remaining === 0}
                    className="flex-1 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition disabled:opacity-40"
                  >
                    {t('recordPayback')}
                  </button>

                  <a
                    href={`tel:${b.phone}`}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center space-x-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('call')}</span>
                  </a>

                  <button
                    onClick={() => onOpenWhatsAppModal(b)}
                    className="px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 font-bold text-xs transition flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('whatsApp')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Record Payback Modal */}
      {selectedBorrower && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel rounded-2xl p-6 shadow-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-1">
              {settings.language === 'kn' ? `${selectedBorrower.name} ರಿಂದ ಮರಳಿಸಿದ ಹಣ ಬರೆಯಿರಿ` : `Record Payback from ${selectedBorrower.name}`}
            </h3>
            <p className="text-xs text-slate-400 mb-4">{t('balancePending')}: {currency}{selectedBorrower.activeLoanAmount.toLocaleString()}</p>

            <form onSubmit={handlePartialRepay} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {settings.language === 'kn' ? 'ಮರಳಿಸಿದ ಮೊತ್ತ' : 'Amount Returned'} ({currency})
                </label>
                <input
                  type="number"
                  required
                  max={selectedBorrower.activeLoanAmount}
                  placeholder={`Max: ${selectedBorrower.activeLoanAmount}`}
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {settings.language === 'kn' ? 'ಟಿಪ್ಪಣಿ / ವಿವರ' : 'Payment Method / Note'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. GPay UPI or Cash return"
                  value={repayNote}
                  onChange={(e) => setRepayNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBorrower(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                >
                  {t('recordPayback')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
