import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../i18n/translations';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const FinanceContext = createContext();

// Clear any old legacy dummy data stored in browser localStorage
if (typeof window !== 'undefined') {
  try {
    const legacyKeys = ['kv_transactions', 'kv_loans_owed', 'kv_borrowers', 'kv_reminders', 'kv_settings'];
    legacyKeys.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    // Silently ignore storage errors in private browsing or when storage is full
  }
}

const DEFAULT_SETTINGS = {
  currency: '₹',
  currencyCode: 'INR',
  parentMode: false,
  language: 'kn', // 100% KANNADA DEFAULT OUT OF THE BOX
  theme: 'dark',
  familyVaultId: 'FAM-8842-KUTUMB',
  lastSynced: 'Just now',
  syncStatus: 'synced',
};

// FIX #4: Safe JSON parse with fallback to prevent crash on corrupt localStorage
function safeJsonParse(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null || saved === undefined) return fallback;
    const parsed = JSON.parse(saved);
    // Validate arrays are actually arrays; objects are objects
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    if (typeof fallback === 'object' && !Array.isArray(fallback) && (typeof parsed !== 'object' || Array.isArray(parsed))) return fallback;
    return parsed;
  } catch (e) {
    // Corrupt JSON — wipe the key and return clean default
    try { localStorage.removeItem(key); } catch (_) {}
    return fallback;
  }
}

export function FinanceProvider({ children }) {
  // Always start with 100% CLEAN EMPTY ARRAYS - ZERO DUMMY DATA!
  const [transactions, setTransactions] = useState(() => safeJsonParse('kv_v3_transactions', []));
  const [loansOwed, setLoansOwed] = useState(() => safeJsonParse('kv_v3_loans_owed', []));
  const [borrowers, setBorrowers] = useState(() => safeJsonParse('kv_v3_borrowers', []));
  const [settings, setSettings] = useState(() => safeJsonParse('kv_v3_settings', DEFAULT_SETTINGS));
  const [callReminders, setCallReminders] = useState(() => safeJsonParse('kv_v3_reminders', []));

  // Check URL params for PWA language or vault ID override
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get('lang');
      const vaultParam = params.get('vault');

      if (langParam === 'kn' || langParam === 'en') {
        setSettings(prev => ({ ...prev, language: langParam }));
      }
      // FIX: Sanitize vault param — only allow alphanumeric, hyphens, and underscores
      if (vaultParam && /^[A-Za-z0-9_-]{1,50}$/.test(vaultParam)) {
        setSettings(prev => ({ ...prev, familyVaultId: vaultParam }));
      }
    } catch (e) {
      // Silently ignore URL parsing errors
    }
  }, []);

  // FIX #3: Cross-tab sync — listen for localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (!event.key || !event.key.startsWith('kv_v3_')) return;
      
      try {
        const newValue = event.newValue ? JSON.parse(event.newValue) : null;
        if (newValue === null) return;

        switch (event.key) {
          case 'kv_v3_transactions':
            if (Array.isArray(newValue)) setTransactions(newValue);
            break;
          case 'kv_v3_loans_owed':
            if (Array.isArray(newValue)) setLoansOwed(newValue);
            break;
          case 'kv_v3_borrowers':
            if (Array.isArray(newValue)) setBorrowers(newValue);
            break;
          case 'kv_v3_settings':
            if (typeof newValue === 'object' && !Array.isArray(newValue)) setSettings(newValue);
            break;
          case 'kv_v3_reminders':
            if (Array.isArray(newValue)) setCallReminders(newValue);
            break;
        }
      } catch (e) {
        // Ignore corrupt cross-tab data
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Firebase Real-time Sync Listener
  useEffect(() => {
    if (!settings.familyVaultId) return;

    const unsub = onSnapshot(doc(db, "vaults", settings.familyVaultId), (docSnap) => {
      if (docSnap.exists() && !docSnap.metadata.hasPendingWrites) {
        const data = docSnap.data();
        window.__preventSync = true;
        
        if (data.transactions) setTransactions(data.transactions);
        if (data.loansOwed) setLoansOwed(data.loansOwed);
        if (data.borrowers) setBorrowers(data.borrowers);
        if (data.callReminders) setCallReminders(data.callReminders);
        
        // Let React finish re-rendering before allowing outgoing syncs again
        setTimeout(() => { window.__preventSync = false; }, 500);
      }
    }, (err) => {
      console.error("Firebase sync error:", err);
    });

    return () => unsub();
  }, [settings.familyVaultId]);


  // Save changes to local storage v3 keys AND Firebase
  useEffect(() => {
    try { localStorage.setItem('kv_v3_transactions', JSON.stringify(transactions)); } catch (e) {}
    if (settings.familyVaultId && window.__preventSync !== true) {
      setDoc(doc(db, "vaults", settings.familyVaultId), { transactions }, { merge: true }).catch(console.error);
    }
  }, [transactions, settings.familyVaultId]);

  useEffect(() => {
    try { localStorage.setItem('kv_v3_loans_owed', JSON.stringify(loansOwed)); } catch (e) {}
    if (settings.familyVaultId && window.__preventSync !== true) {
      setDoc(doc(db, "vaults", settings.familyVaultId), { loansOwed }, { merge: true }).catch(console.error);
    }
  }, [loansOwed, settings.familyVaultId]);

  useEffect(() => {
    try { localStorage.setItem('kv_v3_borrowers', JSON.stringify(borrowers)); } catch (e) {}
    if (settings.familyVaultId && window.__preventSync !== true) {
      setDoc(doc(db, "vaults", settings.familyVaultId), { borrowers }, { merge: true }).catch(console.error);
    }
  }, [borrowers, settings.familyVaultId]);

  useEffect(() => {
    try {
      localStorage.setItem('kv_v3_settings', JSON.stringify(settings));
      if (settings.parentMode) {
        document.body.classList.add('parent-mode');
      } else {
        document.body.classList.remove('parent-mode');
      }

      if (settings.theme === 'light') {
        document.body.classList.add('light-mode');
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.body.classList.remove('light-mode');
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    } catch (e) {}
  }, [settings]);

  useEffect(() => {
    try { localStorage.setItem('kv_v3_reminders', JSON.stringify(callReminders)); } catch (e) {}
    if (settings.familyVaultId && window.__preventSync !== true) {
      setDoc(doc(db, "vaults", settings.familyVaultId), { callReminders }, { merge: true }).catch(console.error);
    }
  }, [callReminders, settings.familyVaultId]);

  // Translation helper function - Defaults to Kannada ('kn')
  const t = useCallback((key) => {
    const lang = settings.language || 'kn';
    const langDict = translations[lang] || translations.kn;
    
    const keys = key.split('.');
    let val = langDict;
    for (let k of keys) {
      if (val && val[k] !== undefined) {
        val = val[k];
      } else {
        let fallbackVal = translations.kn;
        for (let fk of keys) {
          if (fallbackVal && fallbackVal[fk] !== undefined) fallbackVal = fallbackVal[fk];
        }
        return typeof fallbackVal === 'string' ? fallbackVal : key;
      }
    }
    return typeof val === 'string' ? val : key;
  }, [settings.language]);

  const toggleLanguage = () => {
    const newLang = settings.language === 'kn' ? 'en' : 'kn';
    setSettings(prev => ({ ...prev, language: newLang }));
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Transaction Helpers
  const addTransaction = (tx) => {
    // FIX: Sanitize inputs — trim strings, ensure amount is positive number
    const sanitizedTitle = String(tx.title || '').trim().slice(0, 200);
    const sanitizedAmount = Math.max(0, Number(tx.amount) || 0);
    if (!sanitizedTitle || sanitizedAmount <= 0) return;

    const newTx = {
      ...tx,
      title: sanitizedTitle,
      amount: sanitizedAmount,
      notes: String(tx.notes || '').trim().slice(0, 500),
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id) => {
    if (!id) return;
    setTransactions(prev => prev.filter(tItem => tItem.id !== id));
  };

  // Loans Owed Helpers
  const addLoanOwed = (loan) => {
    const sanitizedName = String(loan.lenderName || '').trim().slice(0, 200);
    const sanitizedAmount = Math.max(0, Number(loan.originalAmount) || 0);
    if (!sanitizedName || sanitizedAmount <= 0) return;

    const newLoan = {
      ...loan,
      lenderName: sanitizedName,
      originalAmount: sanitizedAmount,
      remainingAmount: Number(loan.remainingAmount) || sanitizedAmount,
      id: `owed-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: 'Active',
      history: []
    };
    setLoansOwed(prev => [newLoan, ...prev]);
  };

  const recordLoanOwedPayment = (loanId, amount, note) => {
    const sanitizedAmount = Math.max(0, Number(amount) || 0);
    if (!loanId || sanitizedAmount <= 0) return;

    setLoansOwed(prev => prev.map(loan => {
      if (loan.id === loanId) {
        const newRemaining = Math.max(0, Number(loan.remainingAmount) - sanitizedAmount);
        const isFullyPaid = newRemaining === 0;
        const newHistory = [
          {
            id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            date: new Date().toISOString().split('T')[0],
            amount: sanitizedAmount,
            note: String(note || '').trim().slice(0, 300)
          },
          ...(loan.history || [])
        ];
        return {
          ...loan,
          remainingAmount: newRemaining,
          status: isFullyPaid ? 'Fully Paid' : 'Active',
          history: newHistory
        };
      }
      return loan;
    }));
  };

  // Loans Lent / Borrower Helpers
  const addBorrower = (borrower) => {
    const sanitizedName = String(borrower.name || '').trim().slice(0, 200);
    const sanitizedAmount = Math.max(0, Number(borrower.totalLent) || 0);
    if (!sanitizedName || sanitizedAmount <= 0) return;

    const newBorrower = {
      ...borrower,
      name: sanitizedName,
      phone: String(borrower.phone || '').replace(/[^0-9+\-\s]/g, '').trim().slice(0, 20),
      totalLent: sanitizedAmount,
      id: `bor-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      totalRepaid: 0,
      activeLoanAmount: sanitizedAmount,
      status: 'Active',
      avgPaybackDays: 0,
      totalCompletedLoans: 0,
      repaymentHistory: []
    };
    setBorrowers(prev => [newBorrower, ...prev]);
  };

  const recordPartialRepayment = (borrowerId, amount, note) => {
    const sanitizedAmount = Math.max(0, Number(amount) || 0);
    if (!borrowerId || sanitizedAmount <= 0) return;

    setBorrowers(prev => prev.map(b => {
      if (b.id === borrowerId) {
        const newRepaid = Number(b.totalRepaid || 0) + sanitizedAmount;
        const newActive = Math.max(0, Number(b.totalLent || 0) - newRepaid);
        const isSettled = newActive === 0;

        const newHistory = [
          {
            id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            date: new Date().toISOString().split('T')[0],
            amount: sanitizedAmount,
            note: String(note || '').trim().slice(0, 300)
          },
          ...(b.repaymentHistory || [])
        ];

        const daysTaken = Math.max(1, Math.round((new Date() - new Date(b.lentDate)) / (1000 * 60 * 60 * 24)));
        const newAvg = b.avgPaybackDays ? Math.round((b.avgPaybackDays + daysTaken) / 2) : daysTaken;

        return {
          ...b,
          totalRepaid: newRepaid,
          activeLoanAmount: newActive,
          status: isSettled ? 'Settled' : 'Active',
          avgPaybackDays: isSettled ? newAvg : b.avgPaybackDays,
          totalCompletedLoans: isSettled ? (b.totalCompletedLoans || 0) + 1 : b.totalCompletedLoans,
          repaymentHistory: newHistory
        };
      }
      return b;
    }));
  };

  const toggleParentMode = () => {
    setSettings(prev => ({ ...prev, parentMode: !prev.parentMode }));
  };

  const updateCurrency = (currencySymbol, code) => {
    setSettings(prev => ({ ...prev, currency: currencySymbol, currencyCode: code }));
  };

  const triggerCloudSync = () => {
    setSettings(prev => ({ ...prev, syncStatus: 'syncing' }));
    setTimeout(() => {
      setSettings(prev => ({
        ...prev,
        syncStatus: 'synced',
        lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }, 1200);
  };

  // FIX #16: clearAllData only wipes data keys, preserves settings (language preference!)
  const clearAllData = () => {
    if (!window.confirm(
      settings.language === 'kn'
        ? 'ಎಲ್ಲಾ ಡೇಟಾವನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂತಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ!'
        : 'Are you sure you want to delete ALL data? This cannot be undone!'
    )) return;

    setTransactions([]);
    setLoansOwed([]);
    setBorrowers([]);
    setCallReminders([]);
    // Only clear data keys, NOT settings (preserves language, currency, vault ID)
    try {
      localStorage.removeItem('kv_v3_transactions');
      localStorage.removeItem('kv_v3_loans_owed');
      localStorage.removeItem('kv_v3_borrowers');
      localStorage.removeItem('kv_v3_reminders');
    } catch (e) {}
  };

  const totalIncome = transactions.filter(tItem => tItem.type === 'income').reduce((acc, tItem) => acc + Number(tItem.amount || 0), 0);
  const totalExpense = transactions.filter(tItem => tItem.type === 'expense').reduce((acc, tItem) => acc + Number(tItem.amount || 0), 0);
  const netBalance = totalIncome - totalExpense;
  
  const totalDebtsOwed = loansOwed.filter(l => (Number(l.remainingAmount) || 0) > 0).reduce((acc, l) => acc + Number(l.remainingAmount || 0), 0);
  const totalMoneyLentPending = borrowers.filter(b => (Number(b.activeLoanAmount) || 0) > 0).reduce((acc, b) => acc + Number(b.activeLoanAmount || 0), 0);

  // FIX #5: Compute effective borrower status — check if overdue based on expectedReturnDate
  const borrowersWithStatus = borrowers.map(b => {
    if (b.status === 'Settled') return b;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (b.expectedReturnDate) {
      const dueDate = new Date(b.expectedReturnDate);
      dueDate.setHours(0, 0, 0, 0);
      
      if (dueDate < today && (Number(b.activeLoanAmount) || 0) > 0) {
        return { ...b, status: 'Overdue' };
      }
    }
    return b;
  });

  return (
    <FinanceContext.Provider value={{
      t,
      transactions,
      loansOwed,
      borrowers: borrowersWithStatus,
      settings,
      callReminders,
      totalIncome,
      totalExpense,
      netBalance,
      totalDebtsOwed,
      totalMoneyLentPending,
      addTransaction,
      deleteTransaction,
      addLoanOwed,
      recordLoanOwedPayment,
      addBorrower,
      recordPartialRepayment,
      toggleParentMode,
      toggleLanguage,
      updateSettings,
      updateCurrency,
      triggerCloudSync,
      clearAllData
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
