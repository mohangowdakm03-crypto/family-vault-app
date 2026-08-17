import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X } from 'lucide-react';

export default function BorrowerModal({ isOpen, onClose }) {
  const { t, addBorrower, settings } = useFinance();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91');
  const [relation, setRelation] = useState('Friend');
  const [totalLent, setTotalLent] = useState('');
  const [lentDate, setLentDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [notes, setNotes] = useState('');
  const [avatar, setAvatar] = useState('🧔');

  if (!isOpen) return null;

  const avatars = ['🧔', '👨‍💼', '👩‍💼', '👨‍🔧', '👩‍🌾', '🤝', '👤'];
  const relations = ['Friend', 'Relative', 'Contractor', 'Worker', 'BusinessPartner', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = Number(totalLent);
    if (!name || !totalLent || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }

    addBorrower({
      name,
      phone,
      relation: t(`relations.${relation}`) || relation,
      avatar,
      totalLent: Number(totalLent),
      lentDate,
      expectedReturnDate: expectedReturnDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-800 mobile-bottom-sheet max-h-[90vh] overflow-y-auto">
        
        <div className="w-12 h-1.5 bg-slate-700/60 rounded-full mx-auto mb-3 sm:hidden"></div>

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base sm:text-lg font-bold text-white">{t('borrowerFormTitle')}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar</label>
            <div className="flex items-center space-x-2">
              {avatars.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  className={`w-9 h-9 rounded-xl text-lg border flex items-center justify-center transition ${
                    avatar === a ? 'bg-purple-600/30 border-purple-500 ring-2 ring-purple-500/40' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('borrowerNameLabel')}</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl glass-input text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('phoneLabel')}</label>
              <input
                type="text"
                required
                placeholder="+919876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-3 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('relationLabel')}</label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full px-3 py-3 rounded-xl glass-input text-xs cursor-pointer"
              >
                {relations.map(r => <option key={r} value={r}>{t(`relations.${r}`)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('lentAmountLabel')} ({settings.currency})</label>
            <input
              type="number"
              required
              min="1"
              placeholder="10000"
              value={totalLent}
              onChange={(e) => setTotalLent(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl glass-input text-base font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('lentDate')}</label>
              <input
                type="date"
                required
                value={lentDate}
                onChange={(e) => setLentDate(e.target.value)}
                className="w-full px-3 py-3 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('expectedReturnLabel')}</label>
              <input
                type="date"
                required
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                className="w-full px-3 py-3 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

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
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md"
            >
              {t('saveBorrowerRecord')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
