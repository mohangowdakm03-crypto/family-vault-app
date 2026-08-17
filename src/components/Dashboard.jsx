import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Landmark, 
  HandCoins, 
  PhoneCall, 
  MessageSquare, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  ChevronRight, 
  PieChart as PieIcon,
  BarChart3,
  FileText
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard({ setActiveTab, onOpenAddTransaction, onOpenAddBorrower, onOpenAddDebt, onOpenWhatsAppModal }) {
  const { 
    t,
    settings, 
    transactions, 
    totalIncome, 
    totalExpense, 
    netBalance, 
    totalDebtsOwed, 
    totalMoneyLentPending, 
    borrowers 
  } = useFinance();

  const currency = settings.currency;

  const urgentBorrowers = borrowers.filter(b => b.activeLoanAmount > 0 && b.status === 'Overdue');

  const categoryData = transactions
    .filter(tItem => tItem.type === 'expense')
    .reduce((acc, tItem) => {
      const catLabel = t(`categories.${tItem.category}`) || tItem.category;
      const existing = acc.find(c => c.name === catLabel);
      if (existing) {
        existing.value += Number(tItem.amount);
      } else {
        acc.push({ name: catLabel, value: Number(tItem.amount) });
      }
      return acc;
    }, []);

  const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

  const cashflowData = [
    { name: t('totalEarnings'), amount: totalIncome, fill: '#10b981' },
    { name: t('logSpending'), amount: totalExpense, fill: '#f43f5e' },
    { name: t('debtsOwedToPay'), amount: totalDebtsOwed, fill: '#f59e0b' },
    { name: t('moneyLentPending'), amount: totalMoneyLentPending, fill: '#8b5cf6' }
  ];

  const hasData = transactions.length > 0 || totalDebtsOwed > 0 || totalMoneyLentPending > 0;

  return (
    <div className="space-y-8 sm:space-y-10 pb-28 sm:pb-12">
      
      {/* Urgent Call Reminder Banner */}
      {urgentBorrowers.length > 0 && (
        <div className="call-alert-pulse bg-gradient-to-r from-rose-950 via-rose-900/90 to-slate-900 border border-rose-500/50 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl shrink-0 mt-0.5">
                <AlertTriangle className="w-7 h-7 text-rose-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-rose-200 text-lg sm:text-xl">
                    ⚠️ {t('overdueCallsRequired')}
                  </h3>
                  <span className="bg-rose-500 text-white text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full">
                    Urgent
                  </span>
                </div>
                <p className="text-sm sm:text-base text-rose-300 font-medium mt-1">
                  {urgentBorrowers[0].name} {t('overdueSubtitle')} <strong className="text-white font-extrabold text-lg">{currency}{urgentBorrowers[0].activeLoanAmount.toLocaleString()}</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <a
                href={`tel:${urgentBorrowers[0].phone}`}
                className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-extrabold text-sm sm:text-base shadow-md transition"
              >
                <PhoneCall className="w-5 h-5" />
                <span>{t('callNow')}</span>
              </a>

              <button
                onClick={() => onOpenWhatsAppModal(urgentBorrowers[0])}
                className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 px-4 py-3 rounded-xl font-extrabold text-sm sm:text-base transition"
              >
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>{t('sendWhatsApp')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Summary Cards Grid - High Contrast Extra Large Numbers for Eye Problems */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Net Balance Card */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between border border-indigo-500/25">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-300 break-words whitespace-normal leading-tight pr-2">{t('totalNetBalance')}</span>
            <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl shrink-0">
              <Wallet className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {currency}{netBalance.toLocaleString()}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-1 flex items-center flex-wrap">
              <span className={`font-extrabold ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'} inline-flex items-center mr-1`}>
                {netBalance >= 0 ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownLeft className="w-4 h-4 mr-0.5" />}
                {totalIncome > 0 ? `${Math.round((netBalance / totalIncome) * 100)}%` : '0%'} {t('retained')}
              </span>
              {t('overallSavingsRate')}
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        </div>

        {/* Monthly Income Card */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between border border-emerald-500/25">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-300 break-words whitespace-normal leading-tight pr-2">{t('totalEarnings')}</span>
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl shrink-0">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
              {currency}{totalIncome.toLocaleString()}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-1">{t('loggedEarnings')}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
        </div>

        {/* Debts We Owe Card */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between border border-amber-500/25">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-300 break-words whitespace-normal leading-tight pr-2">{t('debtsOwedToPay')}</span>
            <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-xl shrink-0">
              <Landmark className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
              {currency}{totalDebtsOwed.toLocaleString()}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-1">{t('toBanksLenders')}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500"></div>
        </div>

        {/* Money Lent Card */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between border border-purple-500/25">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-300 break-words whitespace-normal leading-tight pr-2">{t('moneyLentPending')}</span>
            <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-xl shrink-0">
              <HandCoins className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl sm:text-4xl font-black text-purple-300 tracking-tight">
              {currency}{totalMoneyLentPending.toLocaleString()}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-1">{t('toCollectFromBorrowers')}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        </div>

      </div>

      {/* QUICK FAMILY ACTIONS — 2x2 GRID WITH GENEROUS SPACING */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8">
        <h3 className="text-base font-extrabold uppercase tracking-wider text-slate-300 mb-6">{t('quickActions')}</h3>
        <div className="grid grid-cols-2 gap-5 sm:gap-6">
          
          {/* 1. Log Spending */}
          <button
            onClick={() => onOpenAddTransaction('expense')}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-rose-500/30 hover:border-rose-400 hover:bg-rose-500/10 transition-all duration-200 flex flex-col items-center text-center group justify-center shadow-lg active:scale-[0.97]"
          >
            <div className="p-4 rounded-2xl bg-rose-500/15 text-rose-400 mb-3 group-hover:scale-110 transition-transform">
              <TrendingDown className="w-7 h-7" />
            </div>
            <span className="text-sm sm:text-base font-extrabold text-white leading-tight">{t('logSpending')}</span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 mt-1.5 leading-snug">{t('logSpendingSub')}</span>
          </button>

          {/* 2. Log Income */}
          <button
            onClick={() => onOpenAddTransaction('income')}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all duration-200 flex flex-col items-center text-center group justify-center shadow-lg active:scale-[0.97]"
          >
            <div className="p-4 rounded-2xl bg-emerald-500/15 text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7" />
            </div>
            <span className="text-sm sm:text-base font-extrabold text-white leading-tight">{t('logIncome')}</span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 mt-1.5 leading-snug">{t('logIncomeSub')}</span>
          </button>

          {/* 4. Add Debt We Owe */}
          <button
            onClick={onOpenAddDebt}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10 transition-all duration-200 flex flex-col items-center text-center group justify-center shadow-lg active:scale-[0.97]"
          >
            <div className="p-4 rounded-2xl bg-amber-500/15 text-amber-400 mb-3 group-hover:scale-110 transition-transform">
              <Landmark className="w-7 h-7" />
            </div>
            <span className="text-sm sm:text-base font-extrabold text-white leading-tight">{t('addDebt')}</span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 mt-1.5 leading-snug">{t('toBanksLenders')}</span>
          </button>

          {/* 5. Add Money Lent */}
          <button
            onClick={onOpenAddBorrower}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-200 flex flex-col items-center text-center group justify-center shadow-lg active:scale-[0.97]"
          >
            <div className="p-4 rounded-2xl bg-purple-500/15 text-purple-400 mb-3 group-hover:scale-110 transition-transform">
              <HandCoins className="w-7 h-7" />
            </div>
            <span className="text-sm sm:text-base font-extrabold text-white leading-tight">{t('addMoneyLent')}</span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 mt-1.5 leading-snug">{t('addMoneyLentSub')}</span>
          </button>

          {/* 6. Call Reminders */}
          <button
            onClick={() => setActiveTab('reminders')}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-500/10 transition-all duration-200 flex flex-col items-center text-center group justify-center shadow-lg active:scale-[0.97]"
          >
            <div className="p-4 rounded-2xl bg-indigo-500/15 text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-7 h-7" />
            </div>
            <span className="text-sm sm:text-base font-extrabold text-white leading-tight">{t('callBorrowers')}</span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 mt-1.5 leading-snug">{t('callBorrowersSub')}</span>
          </button>

        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-200 text-base sm:text-lg">{t('cashflowOverview')}</h3>
            </div>
            {hasData ? (
              <div className="h-56 sm:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashflowData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                      formatter={(value) => [`${currency}${value.toLocaleString()}`, 'Amount']}
                    />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-center space-y-2 p-4">
                <BarChart3 className="w-12 h-12 text-slate-600" />
                <p className="text-sm font-extrabold">{t('noTransactionsYet')}</p>
                <p className="text-xs text-slate-400">{t('noTransactionsSub')}</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-200 text-base sm:text-lg">{t('spendingsByCategory')}</h3>
            </div>
            {categoryData.length > 0 ? (
              <div className="h-56 sm:h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                      formatter={(value) => [`${currency}${value.toLocaleString()}`, 'Spent']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-center space-y-2 p-4">
                <PieIcon className="w-12 h-12 text-slate-600" />
                <p className="text-sm font-extrabold">{t('noTransactionsYet')}</p>
              </div>
            )}
          </div>

          {categoryData.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800">
              {categoryData.slice(0, 4).map((c, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                  <span className="text-slate-300 font-semibold truncate">{c.name}:</span>
                  <span className="font-extrabold text-white">{currency}{c.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
