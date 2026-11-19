import React from 'react';
import { APP_ICON_ASSET, PWAInstallButton } from './PWAInstallButton';

interface FooterProps {
  onOpenPreferences: () => void;
  onOpenOrders: () => void;
}

export function Footer({ onOpenPreferences, onOpenOrders }: FooterProps) {
  return (
    <footer className="bg-[#F7F4EE] border-t border-stone-200/80 py-12">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-stone-200/80">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <img
                src={APP_ICON_ASSET}
                alt="Katha Kraft's app icon"
                className="w-11 h-11 rounded-xl object-cover border border-stone-200 shrink-0"
              />
              <p className="font-display text-xl font-semibold text-[#131B3A]">
                Katha Kraft&apos;s
              </p>
            </div>
            <p className="text-sm text-stone-600 mt-3 leading-relaxed">
              Every character has a story. Every story carries a value. Handcrafted in India
              for curious children aged 3–6.
            </p>
            <div className="mt-4">
              <PWAInstallButton />
            </div>
          </div>

          <div className="flex flex-wrap gap-10 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-[#131B3A]">Marketplace</p>
              <ul className="space-y-1.5 text-stone-600">
                <li>
                  <a href="#collection" className="hover:text-[#131B3A] transition-colors">
                    All Companions
                  </a>
                </li>
                <li>
                  <a href="#bedtime" className="hover:text-[#131B3A] transition-colors">
                    Bedtime Katha
                  </a>
                </li>
                <li>
                  <a href="#craft" className="hover:text-[#131B3A] transition-colors">
                    Craft &amp; Safety
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-[#131B3A]">Parent Tools</p>
              <ul className="space-y-1.5 text-stone-600">
                <li>
                  <button
                    type="button"
                    onClick={onOpenPreferences}
                    className="hover:text-[#131B3A] transition-colors cursor-pointer"
                  >
                    Child Age &amp; Value Matcher
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenOrders}
                    className="hover:text-[#131B3A] transition-colors cursor-pointer"
                  >
                    Track Orders &amp; Wishlist
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Katha Kraft&apos;s India. All rights reserved.</p>
          <p>BIS IS-9873 &amp; EN71 Child-Safe Certified · Pan-India Dispatch</p>
        </div>
      </div>
    </footer>
  );
}
