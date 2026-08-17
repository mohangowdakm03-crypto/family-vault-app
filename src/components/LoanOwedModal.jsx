import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X } from 'lucide-react';

export default function LoanOwedModal({ isOpen, onClose }) {
  const { t, addLoanOwed, settings } = useFinance();

  const [lenderName, setLenderName] = useState('');
  const [lenderType, setLenderType] = useState('Bank');
  const [originalAmount, setOriginalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('0');
  const [monthlyEMI, setMonthlyEMI] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const lenderTypes = ['Bank', 'Relative', 'Friend', 'CreditCard', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = Number(originalAmount);
    if (!lenderName || !originalAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }

    addLoanOwed({
      lenderName,
      lenderType,
      originalAmount: Number(originalAmount),
      remainingAmount: Number(originalAmount),
      interestRate: Number(interestRate),
      monthlyEMI: Number(monthlyEMI || 0),
      nextDueDate: nextDueDate || new Date().toISOString().split('T')[0],
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-800 mobile-bottom-sheet max-h-[90vh] overflow-y-auto">
        
        <div className="w-12 h-1.5 bg-slate-700/60 rounded-full mx-auto mb-3 sm:hidden"></div>

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base sm:text-lg font-bold text-white">{t('debtFormTitle')}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('lenderNameLabel')}</label>
            <input
              type="text"
              required
              placeholder="e.g. SBI Home Loan"
              value={lenderName}
              onChange={(e) => setLenderName(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl glass-input text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('lenderTypeLabel')}</label>
              <select
                value={lenderType}
                onChange={(e) => setLenderType(e.target.value)}
                className="w-full px-3 py-3 rounded-xl glass-input text-xs cursor-pointer"
              >
                {lenderTypes.map(lt => (
                  <option key={lt} value={lt}>{t(`lenderTypes.${lt}`)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('amountLabel')} ({settings.currency})</label>
              <input
                type="number"
                required
                min="1"
                placeholder="50000"
                value={originalAmount}
                onChange={(e) => setOriginalAmount(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl glass-input text-base font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('emi')} ({settings.currency})</label>
              <input
                type="number"
                placeholder="5000"
                value={monthlyEMI}
                onChange={(e) => setMonthlyEMI(e.target.value)}
                className="w-full px-3 py-3 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('nextDue')}</label>
              <input
                type="date"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="w-full px-3 py-3 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('notesLabel')}</label>
            <input
              type="text"
              placeholder="e.g. Borrowed for house construction"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 pb-safe-bottom sm:pb-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md"
            >
              {t('saveDebtRecord')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
