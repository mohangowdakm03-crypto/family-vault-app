import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Settings, 
  Download, 
  Smartphone, 
  Globe, 
  Copy, 
  Check, 
  Trash2,
  Share2,
  AlertTriangle,
  Sun,
  Moon
} from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const { 
    t,
    settings, 
    updateCurrency, 
    toggleLanguage, 
    triggerCloudSync, 
    clearAllData,
    transactions,
    loansOwed,
    borrowers
  } = useFinance();

  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const pwaParentsLink = `${window.location.origin}/?lang=kn&vault=${encodeURIComponent(settings.familyVaultId)}`;

  const copyParentsLink = () => {
    navigator.clipboard.writeText(pwaParentsLink).catch(() => {
      // Fallback for browsers that block clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = pwaParentsLink;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // FIX #17: Revoke object URL after download to prevent memory leak
  const handleExportJSON = () => {
    const exportData = {
      transactions,
      loansOwed,
      borrowers,
      settings,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family_vault_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    // Cleanup: revoke object URL to free memory
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl glass-panel rounded-2xl p-6 shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-extrabold text-white">{t('settings')}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            ✕
          </button>
        </div>

        <div className="space-y-6 mt-5">
          
          {/* Language Switcher */}
          <div className="p-4 bg-indigo-950/30 border border-indigo-500/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-indigo-200 text-sm flex items-center">
                  <Globe className="w-4 h-4 text-indigo-400 mr-1.5" /> Language / ಭಾಷೆ
                </h4>
                <p className="text-xs text-slate-400">Switch app language between English and 100% Kannada</p>
              </div>

              <button
                onClick={toggleLanguage}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-extrabold shadow-md hover:from-indigo-500 hover:to-purple-500 transition btn-shimmer"
              >
                {settings.language === 'kn' ? '🌐 Switch to English' : '🌐 ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ'}
              </button>
            </div>
          </div>

          {/* Parents Zero-Login PWA Share Link Generator */}
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-3">
            <div>
              <h4 className="font-extrabold text-emerald-300 text-sm flex items-center">
                <Share2 className="w-4 h-4 text-emerald-400 mr-1.5" /> Parents Zero-Login PWA Link (Kannada Default)
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Send this link to your parents on WhatsApp. When they open it, it opens in <strong>100% Kannada (ಕನ್ನಡ)</strong> with the shared family account active — <strong>no passwords or login credentials needed!</strong>
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="font-mono text-xs text-emerald-300 truncate flex-1">{pwaParentsLink}</span>
              <button
                onClick={copyParentsLink}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shrink-0 shadow-md"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied Link ✓' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Add to Home Screen Instructions */}
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center">
              <Smartphone className="w-4 h-4 text-indigo-400 mr-1.5" /> How Parents "Add to Screen" as Mobile App
            </h4>
            <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 pl-1 leading-relaxed">
              <li>Send the link above to your parents' phone on WhatsApp.</li>
              <li>Open the link in Chrome or Safari on their phone.</li>
              <li>Tap the menu button (⋮ on Android or Share ⎋ on iPhone).</li>
              <li>Tap <strong>"Add to Home screen"</strong> (ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ಗೆ ಸೇರಿಸಿ).</li>
              <li>An app icon will appear on their phone's screen that launches full screen in 100% Kannada!</li>
            </ol>
          </div>

          {/* Data Backup & Reset */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm">Data Backup & Management</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportJSON}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export Family Backup (JSON)</span>
              </button>

              {/* FIX #1: Replaced resetToSampleData (undefined) with clearAllData (with built-in confirmation) */}
              <button
                onClick={clearAllData}
                className="px-4 py-2 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border border-rose-500/30"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>{settings.language === 'kn' ? 'ಎಲ್ಲಾ ಡೇಟಾ ಅಳಿಸಿ' : 'Clear All Data'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span>{settings.language === 'kn' ? 'ಎಚ್ಚರಿಕೆ: ಎಲ್ಲಾ ಡೇಟಾ ಅಳಿಸಿದ ನಂತರ ಹಿಂತಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.' : 'Warning: Clearing data cannot be undone. Export a backup first.'}</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
