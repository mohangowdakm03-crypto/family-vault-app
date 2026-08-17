import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  TrendingDown, 
  TrendingUp, 
  HandCoins, 
  PhoneCall, 
  Volume2,
  Landmark
} from 'lucide-react';

export default function ParentModeView({ onOpenAddTransaction, onOpenAddBorrower, onOpenAddDebt, setActiveTab }) {
  const { 
    t,
    netBalance, 
    totalMoneyLentPending, 
    totalDebtsOwed, 
    settings 
  } = useFinance();

  const currency = settings.currency;

  const speakSummary = () => {
    if ('speechSynthesis' in window) {
      const text = settings.language === 'kn'
        ? `ನಮ್ಮ ಕುಟುಂಬದ ಒಟ್ಟು ಉಳಿಮೆ ಬಾಕಿ ${netBalance} ರೂಪಾಯಿಗಳು. ನಾವು ಜನರಿಗೆ ಕೊಟ್ಟ ಸಾಲ ${totalMoneyLentPending} ರೂಪಾಯಿಗಳು.`
        : `Family balance is ${currency}${netBalance.toLocaleString()}. You have lent ${currency}${totalMoneyLentPending.toLocaleString()} to others.`;
      
      const utterance = new SpeechSynthesisUtterance(text);
      if (settings.language === 'kn') {
        utterance.lang = 'kn-IN';
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-28 sm:pb-12">
      
      {/* Senior Mode Greeting & Voice Button */}
      <div className="glass-panel border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 bg-slate-900/95 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-3xl">👴</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{t('parentModeTitle')}</h2>
            </div>
            <p className="text-base sm:text-lg text-amber-300 font-extrabold mt-1">
              {t('parentModeSub')}
            </p>
          </div>

          <button
            onClick={speakSummary}
            className="flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-base sm:text-lg shadow-xl transition active:scale-95 border-2 border-amber-300"
          >
            <Volume2 className="w-6 h-6" />
            <span>{t('readOutLoud')}</span>
          </button>
        </div>
      </div>

      {/* Oversized Family Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="glass-panel border-2 border-emerald-500/50 rounded-3xl p-6 bg-emerald-950/30 shadow-lg">
          <span className="text-base font-extrabold uppercase tracking-wider text-emerald-300">{t('totalAvailable')}</span>
          <h3 className="text-4xl sm:text-5xl font-black text-white mt-2">{currency}{netBalance.toLocaleString()}</h3>
          <p className="text-sm font-semibold text-slate-300 mt-2">ಕುಟುಂಬದ ಬ್ಯಾಂಕ್ + ನಗದು ಉಳಿಮೆ</p>
        </div>

        <div className="glass-panel border-2 border-purple-500/50 rounded-3xl p-6 bg-purple-950/30 shadow-lg">
          <span className="text-base font-extrabold uppercase tracking-wider text-purple-300">{t('lentToPeople')}</span>
          <h3 className="text-4xl sm:text-5xl font-black text-purple-300 mt-2">{currency}{totalMoneyLentPending.toLocaleString()}</h3>
          <p className="text-sm font-semibold text-slate-300 mt-2">ಜನರು ಈ ಹಣವನ್ನು ಮರಳಿಸಬೇಕು</p>
        </div>

        <div className="glass-panel border-2 border-amber-500/50 rounded-3xl p-6 bg-amber-950/30 shadow-lg">
          <span className="text-base font-extrabold uppercase tracking-wider text-amber-300">{t('billsAndDebts')}</span>
          <h3 className="text-4xl sm:text-5xl font-black text-amber-300 mt-2">{currency}{totalDebtsOwed.toLocaleString()}</h3>
          <p className="text-sm font-semibold text-slate-300 mt-2">ನಾವು ಸಾಲ/ಇಎಂಐ ತೀರಿಸಬೇಕಾದ ಹಣ</p>
        </div>

      </div>

      {/* 4 GIANT ACTION BUTTONS (2 IN A ROW ON MOBILE) FOR PARENTS WITH EYE PROBLEMS */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white">{t('whatWouldYouLikeToDo')}</h3>

        <div className="grid grid-cols-2 gap-4">
          
          {/* 1. Log Spending */}
          <button
            onClick={() => onOpenAddTransaction('expense')}
            className="p-5 sm:p-7 rounded-3xl bg-rose-600 hover:bg-rose-500 text-white font-black text-lg sm:text-2xl shadow-2xl transition flex flex-col items-center justify-center text-center group border-2 border-rose-300 active:scale-95 min-h-[140px]"
          >
            <div className="p-3 rounded-2xl bg-white/20 text-white mb-2 shrink-0">
              <TrendingDown className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <span>{t('parentLogSpending')}</span>
            <p className="text-xs sm:text-sm font-bold text-rose-100 mt-1">{t('parentLogSpendingSub')}</p>
          </button>

          {/* 2. Log Income */}
          <button
            onClick={() => onOpenAddTransaction('income')}
            className="p-5 sm:p-7 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg sm:text-2xl shadow-2xl transition flex flex-col items-center justify-center text-center group border-2 border-emerald-300 active:scale-95 min-h-[140px]"
          >
            <div className="p-3 rounded-2xl bg-white/20 text-white mb-2 shrink-0">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <span>{t('parentLogIncome')}</span>
            <p className="text-xs sm:text-sm font-bold text-emerald-100 mt-1">{t('parentLogIncomeSub')}</p>
          </button>

          {/* 3. Add Money Lent */}
          <button
            onClick={onOpenAddBorrower}
            className="p-5 sm:p-7 rounded-3xl bg-purple-600 hover:bg-purple-500 text-white font-black text-lg sm:text-2xl shadow-2xl transition flex flex-col items-center justify-center text-center group border-2 border-purple-300 active:scale-95 min-h-[140px]"
          >
            <div className="p-3 rounded-2xl bg-white/20 text-white mb-2 shrink-0">
              <HandCoins className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <span>{t('parentAddMoneyLent')}</span>
            <p className="text-xs sm:text-sm font-bold text-purple-100 mt-1">{t('parentAddMoneyLentSub')}</p>
          </button>

          {/* 4. Add Debt */}
          <button
            onClick={onOpenAddDebt}
            className="p-5 sm:p-7 rounded-3xl bg-amber-600 hover:bg-amber-500 text-white font-black text-lg sm:text-2xl shadow-2xl transition flex flex-col items-center justify-center text-center group border-2 border-amber-300 active:scale-95 min-h-[140px]"
          >
            <div className="p-3 rounded-2xl bg-white/20 text-white mb-2 shrink-0">
              <Landmark className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <span>{t('parentAddDebt')}</span>
            <p className="text-xs sm:text-sm font-bold text-amber-100 mt-1">{t('parentAddDebtSub')}</p>
          </button>

          {/* 5. Call Borrowers */}
          <button
            onClick={() => setActiveTab('reminders')}
            className="p-5 sm:p-7 rounded-3xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg sm:text-2xl shadow-2xl transition flex flex-col items-center justify-center text-center group border-2 border-indigo-300 active:scale-95 min-h-[140px]"
          >
            <div className="p-3 rounded-2xl bg-white/20 text-white mb-2 shrink-0">
              <PhoneCall className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <span>{t('parentCallBorrowers')}</span>
            <p className="text-xs sm:text-sm font-bold text-indigo-100 mt-1">{t('parentCallBorrowersSub')}</p>
          </button>

        </div>
      </div>

    </div>
  );
}
