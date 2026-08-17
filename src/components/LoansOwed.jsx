import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Landmark, Plus, Calendar, Percent, CheckCircle2 } from 'lucide-react';

export default function LoansOwed({ onOpenAddLoanModal }) {
  const { t, loansOwed, recordLoanOwedPayment, settings } = useFinance();
  
  const [activeTabSub, setActiveTabSub] = useState('active'); // 'active' | 'settled'
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payNote, setPayNote] = useState('');

  const currency = settings.currency;

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!selectedLoan || !payAmount) return;

    recordLoanOwedPayment(selectedLoan.id, Number(payAmount), payNote || 'EMI Repayment');
    setSelectedLoan(null);
    setPayAmount('');
    setPayNote('');
  };

  const activeLoans = loansOwed.filter(l => l.remainingAmount > 0);
  const settledLoans = loansOwed.filter(l => l.remainingAmount === 0);

  const displayedLoans = activeTabSub === 'active' ? activeLoans : settledLoans;

  return (
    <div className="space-y-6 pb-20 lg:pb-10">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Landmark className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">{t('debtsTitle')}</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{t('debtsSubtitle')}</p>
          </div>

          <button
            onClick={onOpenAddLoanModal}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addDebt')}</span>
          </button>
        </div>

        {/* Active vs Settled Sub-Tabs */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTabSub('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTabSub === 'active' 
                ? 'bg-amber-600 text-white shadow-md' 
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>{t('activeLoansTab')}</span>
            <span className="bg-amber-950 px-2 py-0.5 rounded-full text-[10px]">{activeLoans.length}</span>
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
            <span className="bg-emerald-950 px-2 py-0.5 rounded-full text-[10px]">{settledLoans.length}</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {displayedLoans.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center text-slate-400">
          <p className="text-base font-semibold">
            {activeTabSub === 'active' ? t('noLoansOwedYet') : 'ಇನ್ನೂ ಯಾವುದೇ ತೀರಿಸಿದ ಸಾಲಗಳ ಇತಿಹಾಸವಿಲ್ಲ'}
          </p>
          <p className="text-xs text-slate-500 mt-1">{t('noLoansOwedSub')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayedLoans.map((loan) => {
            const paidAmount = loan.originalAmount - loan.remainingAmount;
            const progress = Math.round((paidAmount / loan.originalAmount) * 100);

            return (
              <div key={loan.id} className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                        {t(`lenderTypes.${loan.lenderType}`) || loan.lenderType}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1.5">{loan.lenderName}</h3>
                      <p className="text-xs text-slate-400">{loan.notes}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      loan.remainingAmount === 0 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {loan.remainingAmount === 0 ? t('settled') : 'Active'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">{t('remainingBalance')}</span>
                      <p className="text-lg font-extrabold text-amber-400 mt-0.5">{currency}{loan.remainingAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">{t('originalLoan')}</span>
                      <p className="text-base font-bold text-slate-300 mt-0.5">{currency}{loan.originalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">{t('payoffProgress')}</span>
                      <span className="text-emerald-400">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800/80">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{t('nextDue')} {loan.nextDueDate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Percent className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('emi')} {currency}{loan.monthlyEMI.toLocaleString()}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedLoan(loan)}
                    disabled={loan.remainingAmount === 0}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                  >
                    {t('recordPayment')}
                  </button>

                  <span className="text-[10px] text-slate-500">{loan.history?.length || 0} {t('paymentsLogged')}</span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Record Payment Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel rounded-2xl p-6 shadow-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-2">{selectedLoan.lenderName} - {t('recordPayment')}</h3>
            <p className="text-xs text-slate-400 mb-4">{t('remainingBalance')}: {currency}{selectedLoan.remainingAmount.toLocaleString()}</p>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('amountLabel')} ({currency})</label>
                <input
                  type="number"
                  required
                  max={selectedLoan.remainingAmount}
                  placeholder={`EMI: ${selectedLoan.monthlyEMI}`}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('notesLabel')}</label>
                <input
                  type="text"
                  placeholder="e.g. August EMI Paid"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLoan(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                >
                  {t('recordPayment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
