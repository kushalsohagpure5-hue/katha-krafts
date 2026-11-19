import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const APP_ICON_ASSET =
  '/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.59.11_AM_a3f8f3c1.jpeg';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] transition-colors cursor-pointer whitespace-nowrap shrink-0"
      >
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#131B3A] bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
            onClick={() => setShowIOSGuide(false)}
          >
            <div
              className="bg-[#FBF9F5] border border-stone-200 rounded-xl max-w-sm w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={APP_ICON_ASSET}
                    alt="Katha Kraft's app icon"
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                  />
                  <div>
                    <h3
                      id="ios-install-title"
                      className="font-display text-lg font-semibold text-[#131B3A]"
                    >
                      Install Katha Kraft&apos;s
                    </h3>
                    <p className="text-xs text-stone-500">Add to Home Screen</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Close install guide"
                  className="p-1.5 text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="mt-4 space-y-2 text-sm text-stone-700 list-decimal list-inside">
                <li>Tap the Share icon in your Safari toolbar.</li>
                <li>Scroll down and tap &ldquo;Add to Home Screen&rdquo;.</li>
                <li>Tap Add to save Katha Kraft&apos;s with its app icon.</li>
              </ol>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
