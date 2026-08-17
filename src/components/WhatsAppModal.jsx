import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, MessageSquare, ExternalLink, Send } from 'lucide-react';

export default function WhatsAppModal({ borrower, isOpen, onClose }) {
  const { t, settings } = useFinance();
  const [template, setTemplate] = useState('gentle');

  if (!isOpen || !borrower) return null;

  const currency = settings.currency;
  const amount = borrower.activeLoanAmount;
  const name = borrower.name.split(' ')[0];
  const lang = settings.language || 'kn';

  const templatesEn = {
    gentle: `Hi ${name}, hope you are doing well! 😊 Just a soft reminder regarding the remaining balance of ${currency}${amount.toLocaleString()} for the loan taken on ${borrower.lentDate}. Let us know whenever convenient for you. Thank you! - Family Vault`,
    standard: `Hello ${name}, this is a friendly reminder that your payment installment of ${currency}${amount.toLocaleString()} was due on ${borrower.expectedReturnDate}. Please transfer via UPI or call us. Thank you!`,
    firm: `Dear ${name}, following up regarding the outstanding balance of ${currency}${amount.toLocaleString()}. Please clear this payment or give us a quick call today to discuss. Thank you.`
  };

  const templatesKn = {
    gentle: `ನಮಸ್ಕಾರ ${name}, ಆರಾಮಾಗಿದ್ದೀರಾ? 😊 ${borrower.lentDate} ರಂದು ನೀಡಿದ ಸಾಲದ ಬಾಕಿ ಹಣ ${currency}${amount.toLocaleString()} ನೆನಪಿಸಲು ಈ ಸಂದೇಶ. ನಿಮ್ಮ ಅನುಕೂಲಕ್ಕೆ ತಕ್ಕಂತೆ ನೀಡಿ, ಧನ್ಯವಾದಗಳು! - ಕುಟುಂಬ ಫೈನಾನ್ಸ್`,
    standard: `ನಮಸ್ಕಾರ ${name}, ನಿಮ್ಮ ಸಾಲದ ಕಂತು ${currency}${amount.toLocaleString()} ${borrower.expectedReturnDate} ರೊಳಗೆ ನೀಡಬೇಕಾಗಿತ್ತು. ದಯವಿಟ್ಟು ಯುಪಿಐ ಅಥವಾ ನಗದಿನ ಮೂಲಕ ನೀಡಿ, ಧನ್ಯವಾದಗಳು!`,
    firm: `ನಮಸ್ಕಾರ ${name}, ನಿಮ್ಮ ಬಳಿ ಬಾಕಿ ಇರುವ ${currency}${amount.toLocaleString()} ಹಣವನ್ನು ತಕ್ಷಣವೇ ನೀಡಲು ಕೋರಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಇಂದು ಕರೆ ಮಾಡಿ.`
  };

  const templates = lang === 'kn' ? templatesKn : templatesEn;
  const currentMessage = templates[template];

  const handleSendWhatsApp = () => {
    const cleanPhone = borrower.phone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(currentMessage);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg glass-panel rounded-2xl p-6 shadow-2xl border border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">
              {lang === 'kn' ? 'ವಾಟ್ಸಾಪ್ ನೆನಪಿನ ಸಂದೇಶ ಕಳುಹಿಸಿ' : 'Send WhatsApp Collection Reminder'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mt-4">
          
          {/* Borrower info pill */}
          <div className="flex items-center justify-between p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
            <div>
              <span className="font-bold text-white text-sm">{borrower.name}</span>
              <p className="text-xs text-slate-400">{borrower.phone}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-slate-400">{t('balancePending')}</span>
              <p className="text-base font-extrabold text-emerald-400">{currency}{amount.toLocaleString()}</p>
            </div>
          </div>

          {/* Template Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('waTemplateTone')}</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemplate('gentle')}
                className={`py-2 rounded-xl text-xs font-semibold border transition ${
                  template === 'gentle' ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {t('waGentle')}
              </button>

              <button
                type="button"
                onClick={() => setTemplate('standard')}
                className={`py-2 rounded-xl text-xs font-semibold border transition ${
                  template === 'standard' ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {t('waStandard')}
              </button>

              <button
                type="button"
                onClick={() => setTemplate('firm')}
                className={`py-2 rounded-xl text-xs font-semibold border transition ${
                  template === 'firm' ? 'bg-rose-600/30 border-rose-500 text-rose-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {t('waFirm')}
              </button>
            </div>
          </div>

          {/* Message Preview Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('waPreview')}</label>
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-mono">
              "{currentMessage}"
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition"
            >
              <Send className="w-4 h-4" />
              <span>{t('waLaunch')}</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
