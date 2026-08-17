import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, Upload, Check } from 'lucide-react';

export default function TransactionModal({ isOpen, onClose, initialType = 'expense', initialCategory = null }) {
  const { t, addTransaction, settings } = useFinance();
  
  const [type, setType] = useState(initialType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(initialCategory || 'Groceries');
  const [member, setMember] = useState('MohanGowda');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [receiptSimulated, setReceiptSimulated] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
      if (initialCategory === 'Allowance') {
        setTitle(settings.language === 'kn' ? 'ಮೋಹನ್ ಗೌಡ / ವೇದಾವತಿ ಪಾಕೆಟ್ ಮನಿ' : 'Mohan Gowda / Vedavathi Allowance');
      }
    }
  }, [initialCategory, settings.language]);

  if (!isOpen) return null;

  const categories = ['Allowance', 'Groceries', 'Utilities', 'Salary', 'Business', 'Healthcare', 'Education', 'Entertainment', 'Shopping', 'Miscellaneous', 'Milk', 'Cowdung', 'Crops', 'CattleFeed'];
  const members = ['MohanGowda', 'Vedavathi', 'Father', 'Mother', 'Self', 'Spouse', 'Sibling'];
  const paymentMethods = ['UPI', 'Cash', 'BankTransfer', 'DebitCard', 'CreditCard'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    
    const finalTitle = title.trim() || t(`categories.${category}`);

    addTransaction({
      type,
      title: finalTitle,
      amount: Number(amount),
      category,
      member,
      paymentMethod,
      date,
      notes: receiptSimulated ? `${notes} [Receipt Attached]` : notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-800 mobile-bottom-sheet max-h-[90vh] overflow-y-auto">
        
        <div className="w-12 h-1.5 bg-slate-700/60 rounded-full mx-auto mb-3 sm:hidden"></div>

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-lg sm:text-xl font-extrabold text-white">{t('logTransactionTitle')}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2.5 rounded-lg font-bold text-xs sm:text-sm transition ${
                type === 'expense' 
                  ? 'bg-rose-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('spendingExpense')}
            </button>

            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2.5 rounded-lg font-bold text-xs sm:text-sm transition ${
                type === 'income' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('earningIncome')}
            </button>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('transTitleLabel')}</label>
            <input
              type="text"
              placeholder={t('transTitlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl glass-input text-sm"
            />
          </div>

          {/* Amount & Date Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('amountLabel')} ({settings.currency})</label>
              <input
                type="number"
                required
                min="1"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl glass-input text-base font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('dateLabel')}</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-3 rounded-xl glass-input text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Category & Member Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('categoryLabel')}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-3 rounded-xl glass-input text-xs sm:text-sm cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('memberLabel')}</label>
              <select
                value={member}
                onChange={(e) => setMember(e.target.value)}
                className="w-full px-3 py-3 rounded-xl glass-input text-xs sm:text-sm cursor-pointer font-bold text-amber-300"
              >
                {members.map(m => <option key={m} value={m}>{t(`members.${m}`)}</option>)}
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('paymentMethodLabel')}</label>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.slice(0, 3).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2.5 rounded-xl text-xs font-semibold border transition ${
                    paymentMethod === m 
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  {t(`paymentMethods.${m}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Receipt Simulator & Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('notesLabel')}</label>
            <input
              type="text"
              placeholder="Notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="flex items-center justify-between pt-2 pb-safe-bottom sm:pb-0">
            <button
              type="button"
              onClick={() => setReceiptSimulated(!receiptSimulated)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                receiptSimulated ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {receiptSimulated ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{receiptSimulated ? t('receiptAttached') : t('attachReceipt')}</span>
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-md transition"
            >
              {t('saveTransaction')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
