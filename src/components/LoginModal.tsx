import React from 'react';
import { Loader2, ShieldCheck, X } from 'lucide-react';
import { APP_ICON_ASSET } from './PWAInstallButton';

interface LoginModalProps {
  isOpen: boolean;
  isSigningIn: boolean;
  authError: string;
  onClose: () => void;
  onGoogleSignIn: () => void;
}

export function LoginModal({
  isOpen,
  isSigningIn,
  authError,
  onClose,
  onGoogleSignIn,
}: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-[#FBF9F5] border border-stone-200 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sign in screen"
          className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <img
            src={APP_ICON_ASSET}
            alt="Katha Krafts icon"
            className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-sm mb-4"
          />
          <p className="text-xs font-medium text-amber-800 tracking-wide">
            Katha Kraft&apos;s Parent Account
          </p>
          <h2
            id="login-modal-title"
            className="font-display text-2xl font-semibold text-[#131B3A] mt-1"
          >
            Sign in to Katha Krafts
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            Sync your child&apos;s story profile, saved wishlist companions, and order
            history across desktop, mobile browser, and installed app.
          </p>
        </div>

        {authError && (
          <div className="mt-5 p-3 text-xs text-amber-950 bg-amber-50 border border-amber-200 rounded-lg leading-relaxed">
            {authError}
          </div>
        )}

        <div className="mt-6 space-y-3">
          <button
            type="button"
            disabled={isSigningIn}
            onClick={onGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 text-sm font-semibold text-[#131B3A] bg-white border border-stone-300 rounded-xl hover:bg-stone-50 hover:border-stone-400 disabled:opacity-60 transition-colors shadow-xs cursor-pointer"
          >
            {isSigningIn ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#131B3A]" />
            ) : (
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                />
              </svg>
            )}
            <span>{isSigningIn ? 'Connecting with Google...' : 'Continue with Google'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-medium text-stone-600 hover:text-[#131B3A] cursor-pointer"
          >
            Continue browsing as guest
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-stone-200 flex items-center justify-center gap-2 text-xs text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
          <span>Secured by Firebase Authentication</span>
        </div>
      </div>
    </div>
  );
}
