import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { RefreshCw, X } from 'lucide-react';

export default function UpdatePrompt() {
  const { t } = useFinance();
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (!reg) return;

        // If there's already a waiting worker, we need to update
        if (reg.waiting) {
          setNeedsUpdate(true);
          setWorker(reg.waiting);
        }

        // Listen for new workers being installed
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New update is available
              setNeedsUpdate(true);
              setWorker(newWorker);
            }
          });
        });
      });

      // When the new worker takes over, reload the page
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (worker) {
      // Send message to the waiting worker to take control
      worker.postMessage('SKIP_WAITING');
    }
  };

  if (!needsUpdate) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[100]">
      <div className="bg-indigo-900 border-2 border-indigo-500 rounded-2xl p-4 shadow-2xl flex flex-col space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 text-indigo-100">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <RefreshCw className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h4 className="font-bold">New Update Available!</h4>
              <p className="text-xs text-indigo-200 mt-0.5">We've fixed some bugs and added new features.</p>
            </div>
          </div>
          <button onClick={() => setNeedsUpdate(false)} className="p-1 hover:bg-white/10 rounded-lg transition text-indigo-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <button
          onClick={handleUpdate}
          className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm shadow-md transition"
        >
          Update App Now
        </button>
      </div>
    </div>
  );
}
