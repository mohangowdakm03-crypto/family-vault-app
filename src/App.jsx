import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.replace('/', '') || 'dashboard';

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
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-slate-950 text-slate-100">
      
      {/* Header Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => navigate(`/${tab}`)}
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
            setActiveTab={(tab) => navigate(`/${tab}`)}
          />
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={
              <Dashboard 
                setActiveTab={(tab) => navigate(`/${tab}`)}
                onOpenAddTransaction={openTxModal}
                onOpenAddBorrower={() => setIsBorrowerModalOpen(true)}
                onOpenAddDebt={() => setIsLoanOwedModalOpen(true)}
                onOpenWhatsAppModal={(b) => setWhatsAppBorrower(b)}
              />
            } />

            <Route path="/transactions" element={
              <TransactionsList 
                onOpenAddModal={openTxModal}
              />
            } />

            <Route path="/loans-owed" element={
              <LoansOwed 
                onOpenAddLoanModal={() => setIsLoanOwedModalOpen(true)}
              />
            } />

            <Route path="/loans-lent" element={
              <LoansLent 
                onOpenAddBorrower={() => setIsBorrowerModalOpen(true)}
                onOpenWhatsAppModal={(b) => setWhatsAppBorrower(b)}
              />
            } />

            <Route path="/reminders" element={
              <RemindersView 
                onOpenWhatsAppModal={(b) => setWhatsAppBorrower(b)}
              />
            } />

            <Route path="/settings" element={
              <SettingsModal 
                isOpen={true} 
                onClose={() => navigate('/dashboard')} 
              />
            } />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
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
    <BrowserRouter>
      <FinanceProvider>
        <MainApp />
      </FinanceProvider>
    </BrowserRouter>
  );
}
