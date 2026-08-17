import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TransactionsList from './components/TransactionsList';
import TransactionModal from './components/TransactionModal';
import LoansOwed from './components/LoansOwed';
import LoanOwedModal from './components/LoanOwedModal';
import LoansLent from './components/LoansLent';
import BorrowerModal from './components/BorrowerModal';
import RemindersView from './components/RemindersView';
import WhatsAppModal from './components/WhatsAppModal';
import ParentModeView from './components/ParentModeView';
import SettingsModal from './components/SettingsModal';

function MainApp() {
  const { settings } = useFinance();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal States
  const [txModal, setTxModal] = useState({ isOpen: false, type: 'expense', category: null });
  const [isLoanOwedModalOpen, setIsLoanOwedModalOpen] = useState(false);
  const [isBorrowerModalOpen, setIsBorrowerModalOpen] = useState(false);
  const [whatsAppBorrower, setWhatsAppBorrower] = useState(null);

  const openTxModal = (type = 'expense', category = null) => {
    setTxModal({ isOpen: true, type, category });
  };

  const closeTxModal = () => {
    setTxModal({ isOpen: false, type: 'expense', category: null });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Header Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenAddTransaction={() => openTxModal('expense')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Render Senior / Parent Mode if enabled */}
        {settings.parentMode ? (
          <ParentModeView 
            onOpenAddTransaction={openTxModal}
            onOpenAddBorrower={() => setIsBorrowerModalOpen(true)}
            onOpenAddDebt={() => setIsLoanOwedModalOpen(true)}
            setActiveTab={setActiveTab}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard 
                setActiveTab={setActiveTab}
                onOpenAddTransaction={openTxModal}
                onOpenAddBorrower={() => setIsBorrowerModalOpen(true)}
                onOpenAddDebt={() => setIsLoanOwedModalOpen(true)}
                onOpenWhatsAppModal={(b) => setWhatsAppBorrower(b)}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsList 
                onOpenAddModal={openTxModal}
              />
            )}

            {activeTab === 'loans-owed' && (
              <LoansOwed 
                onOpenAddLoanModal={() => setIsLoanOwedModalOpen(true)}
              />
            )}

            {activeTab === 'loans-lent' && (
              <LoansLent 
                onOpenAddBorrower={() => setIsBorrowerModalOpen(true)}
                onOpenWhatsAppModal={(b) => setWhatsAppBorrower(b)}
              />
            )}

            {activeTab === 'reminders' && (
              <RemindersView 
                onOpenWhatsAppModal={(b) => setWhatsAppBorrower(b)}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsModal 
                isOpen={true} 
                onClose={() => setActiveTab('dashboard')} 
              />
            )}
          </>
        )}

      </main>

      {/* Modals Orchestration */}
      <TransactionModal 
        isOpen={txModal.isOpen}
        initialType={txModal.type}
        initialCategory={txModal.category}
        onClose={closeTxModal}
      />

      <LoanOwedModal 
        isOpen={isLoanOwedModalOpen}
        onClose={() => setIsLoanOwedModalOpen(false)}
      />

      <BorrowerModal 
        isOpen={isBorrowerModalOpen}
        onClose={() => setIsBorrowerModalOpen(false)}
      />

      <WhatsAppModal 
        borrower={whatsAppBorrower}
        isOpen={!!whatsAppBorrower}
        onClose={() => setWhatsAppBorrower(null)}
      />

    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <MainApp />
    </FinanceProvider>
  );
}
