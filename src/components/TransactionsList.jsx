import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Trash2, 
  Tag, 
  User, 
  Calendar, 
  CreditCard 
} from 'lucide-react';

export default function TransactionsList({ onOpenAddModal }) {
  const { t, transactions, deleteTransaction, settings } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMember, setFilterMember] = useState('all');

  const currency = settings.currency;

  const categories = ['Allowance', 'Groceries', 'Utilities', 'Salary', 'Business', 'Healthcare', 'Education', 'Entertainment', 'Shopping', 'Miscellaneous', 'Milk', 'Cowdung', 'Crops', 'CattleFeed'];
  const members = ['MohanGowda', 'Vedavathi', 'Father', 'Mother', 'Self', 'Spouse', 'Sibling'];

  const filteredTransactions = transactions.filter(tItem => {
    const matchesSearch = (tItem.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (tItem.notes || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (tItem.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || tItem.type === filterType;
    const matchesCategory = filterCategory === 'all' || tItem.category === filterCategory;
    const matchesMember = filterMember === 'all' || tItem.member === filterMember;

    return matchesSearch && matchesType && matchesCategory && matchesMember;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-10">
      
      {/* Header & Controls */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">{t('spendingsLedger')}</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">ಕುಟುಂಬದ ಒಟ್ಟು ಖರ್ಚು ಮತ್ತು ಆದಾಯದ ದಿನಚರಿ</p>
          </div>

          <button
            onClick={() => onOpenAddModal('expense')}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('quickAdd')}</span>
          </button>
        </div>

        {/* Filters & Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs sm:text-sm"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs sm:text-sm cursor-pointer"
          >
            <option value="all">ಎಲ್ಲವೂ (All Types)</option>
            <option value="income">ಆದಾಯ (Earnings Only)</option>
            <option value="expense">ಖರ್ಚು (Spendings Only)</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs sm:text-sm cursor-pointer"
          >
            <option value="all">ಎಲ್ಲಾ ವರ್ಗಗಳು (All Categories)</option>
            {categories.map(c => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
          </select>

          {/* Family Member Filter */}
          <select
            value={filterMember}
            onChange={(e) => setFilterMember(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs sm:text-sm cursor-pointer"
          >
            <option value="all">ಎಲ್ಲಾ ಸದಸ್ಯರು (All Members)</option>
            {members.map(m => <option key={m} value={m}>{t(`members.${m}`)}</option>)}
          </select>

        </div>
      </div>

      {/* Transactions List / Empty State */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="glass-panel rounded-2xl p-10 text-center text-slate-400">
            <p className="text-base font-semibold">{t('noTransactionsYet')}</p>
            <p className="text-xs text-slate-500 mt-1">{t('noTransactionsSub')}</p>
          </div>
        ) : (
          filteredTransactions.map((tItem) => (
            <div key={tItem.id} className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className={`p-3 rounded-xl shrink-0 ${
                  tItem.type === 'income' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {tItem.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>

                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg">{tItem.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="flex items-center space-x-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                      <Tag className="w-3 h-3 text-indigo-400" />
                      <span>{t(`categories.${tItem.category}`) || tItem.category}</span>
                    </span>
                    <span className="flex items-center space-x-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                      <User className="w-3 h-3 text-amber-400" />
                      <span>{t(`members.${tItem.member}`) || tItem.member}</span>
                    </span>
                    <span className="flex items-center space-x-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                      <Calendar className="w-3 h-3 text-purple-400" />
                      <span>{tItem.date}</span>
                    </span>
                    <span className="flex items-center space-x-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                      <CreditCard className="w-3 h-3 text-teal-400" />
                      <span>{t(`paymentMethods.${tItem.paymentMethod}`) || tItem.paymentMethod}</span>
                    </span>
                  </div>
                  {tItem.notes && <p className="text-xs text-slate-400 mt-2 italic">"{tItem.notes}"</p>}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-right">
                  <span className={`text-lg sm:text-xl font-extrabold ${tItem.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
                    {tItem.type === 'income' ? '+' : '-'}{currency}{Number(tItem.amount).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => deleteTransaction(tItem.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
