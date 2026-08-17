import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  LayoutDashboard, 
  Receipt, 
  Landmark, 
  HandCoins, 
  PhoneCall, 
  Settings, 
  RefreshCw, 
  UserCheck, 
  ShieldCheck, 
  Sparkles,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAddTransaction }) {
  const { t, settings, updateSettings, toggleParentMode, toggleLanguage, triggerCloudSync } = useFinance();

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'transactions', label: t('spendingsLedger'), icon: Receipt },
    { id: 'loans-owed', label: t('debtsWeOwe'), icon: Landmark },
    { id: 'loans-lent', label: t('moneyLent'), icon: HandCoins },
    { id: 'reminders', label: t('callReminders'), icon: PhoneCall },
  ];

  return (
    <>
      {/* Top Ultra Premium Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Ultra Premium Brand Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3.5 cursor-pointer min-w-0 flex-1 mr-2" onClick={() => setActiveTab('dashboard')}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/30 transition transform hover:scale-105">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-base sm:text-2xl tracking-tight text-white gradient-text-indigo truncate">
                    {t('appName')}
                  </span>
                  <span className="text-[8px] sm:text-[10px] uppercase font-black bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/40 px-1.5 sm:px-2 py-0.5 rounded-full shadow-inner shrink-0 hidden xs:inline-block">
                    {t('appSubName')}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-semibold hidden sm:block">Family Ledger & Debt Velocity Tracker</p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/90 shadow-inner">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-lg shadow-indigo-600/40 border border-indigo-400/30' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
              
              {/* Dedicated Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1.5 px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-500/50 text-indigo-200 shadow-md hover:border-indigo-400 transition active:scale-95 btn-shimmer"
                title="Switch Language (English / ಕನ್ನಡ)"
              >
                <Globe className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline text-xs">{settings.language === 'kn' ? 'ಕನ್ನಡ' : 'English'}</span>
              </button>

              {/* Sunlight Mode Toggle */}
              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-1.5 px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-black transition border active:scale-95 ${
                  settings.theme === 'light'
                    ? 'bg-amber-500/20 text-amber-500 border-amber-500/60 ring-2 ring-amber-500/30 shadow-lg'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:bg-slate-800'
                }`}
                title="Toggle Sunlight Mode"
              >
                {settings.theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-400" />}
                <span className="hidden lg:inline text-xs">{settings.theme === 'light' ? 'ಬೆಳಕು' : 'ಕತ್ತಲೆ'}</span>
              </button>

              {/* Senior Mode Toggle */}
              <button
                onClick={toggleParentMode}
                className={`flex items-center space-x-1.5 px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-black transition border active:scale-95 ${
                  settings.parentMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 ring-2 ring-amber-500/30 shadow-lg'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:bg-slate-800'
                }`}
                title="Toggle Senior Mode"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline text-xs">{settings.parentMode ? t('seniorModeOn') : t('seniorMode')}</span>
              </button>

              {/* Quick Add Button */}
              <button
                onClick={onOpenAddTransaction}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 border border-emerald-400/40 transition active:scale-95 btn-shimmer"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">{t('quickAdd')}</span>
              </button>

              {/* Settings Tab */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`p-2 sm:p-2.5 rounded-xl border transition active:scale-95 ${
                  activeTab === 'settings' 
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md' 
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-400 hover:text-white'
                }`}
                title="Settings"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Ultra Premium Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 py-2 px-2 shadow-2xl">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-extrabold transition active:scale-95 ${
                  isActive 
                    ? 'text-white bg-gradient-to-b from-indigo-600/40 to-purple-600/30 border border-indigo-400/40 shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-indigo-400 scale-110' : 'text-slate-400'} transition-transform`} />
                <span className="w-full text-center leading-[1.1] text-[9.5px] break-words whitespace-normal px-0.5 mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
