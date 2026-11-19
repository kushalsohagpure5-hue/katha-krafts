import React, { useState } from 'react';
import { ChevronDown, LogOut, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { Character, UserProfile } from '../types';

interface HeaderProps {
  cartCount: number;
  characters: Character[];
  user: UserProfile | null;
  onSelectCharacter: (character: Character) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenLogin: () => void;
  onSignOut: () => void;
}

export function Header({
  cartCount,
  characters,
  user,
  onSelectCharacter,
  onOpenSearch,
  onOpenCart,
  onOpenOrders,
  onOpenLogin,
  onSignOut,
}: HeaderProps) {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName = user?.displayName || 'Parent';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <header
      className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-stone-200/80"
      onMouseLeave={() => setMegaMenuOpen(false)}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand wordmark */}
        <a
          href="#top"
          className="font-display text-xl font-semibold tracking-tight text-[#131B3A] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700"
        >
          Katha Kraft&apos;s
        </a>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700"
        >
          <button
            type="button"
            onClick={() => setMegaMenuOpen((prev) => !prev)}
            onMouseEnter={() => setMegaMenuOpen(true)}
            aria-expanded={megaMenuOpen}
            className="inline-flex items-center gap-1 hover:text-[#131B3A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Characters</span>
            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <a
            href="#collection"
            className="hover:text-[#131B3A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Shop
          </a>
          <a
            href="#story-first"
            className="hover:text-[#131B3A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Stories
          </a>
          <a
            href="#values"
            className="hover:text-[#131B3A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Values
          </a>
          <a
            href="#bedtime"
            className="hover:text-[#131B3A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Bedtime
          </a>
        </nav>

        {/* Zone 3: Search, User Profile / Auth & Primary Bag CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search characters, stories, values, and soft toys"
            className="p-2 text-stone-700 hover:text-[#131B3A] rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {user ? (
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenOrders}
                aria-label="Account, wishlist, and orders"
                className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-[#131B3A] bg-white border border-stone-200 rounded-lg hover:border-stone-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover border border-stone-200 shrink-0"
                  />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-[#131B3A] text-[10px] font-semibold flex items-center justify-center shrink-0">
                    {initials || 'P'}
                  </span>
                )}
                <span className="max-w-[120px] truncate">{displayName}</span>
              </button>

              <button
                type="button"
                onClick={onSignOut}
                aria-label="Sign Out"
                title="Sign Out"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-[#131B3A] hover:bg-stone-200/60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden lg:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#131B3A] bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sign In</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Bag</span>
            <span className="tabular-nums">({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 text-stone-700 border border-stone-200 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Desktop Explore by Character Mega Menu */}
      {megaMenuOpen && (
        <div className="hidden md:block border-t border-stone-200 bg-white shadow-lg">
          <div className="max-w-[1280px] mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-amber-800">
                Explore by Character — Stories, Plush Toys &amp; Values
              </p>
              <a
                href="#characters"
                onClick={() => setMegaMenuOpen(false)}
                className="text-xs font-semibold text-[#131B3A] hover:underline"
              >
                Explore All Characters
              </a>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {characters.slice(0, 5).map((char) => (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => {
                    setMegaMenuOpen(false);
                    onSelectCharacter(char);
                  }}
                  className="text-left p-3 rounded-lg border border-stone-200/80 hover:border-amber-700 bg-[#FBF9F5] transition-colors cursor-pointer"
                >
                  <p className="font-display text-sm font-semibold text-[#131B3A]">
                    {char.symbol} {char.name}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    {char.storyCount} Stories · {char.toyCount} Plush Toys
                  </p>
                  <p className="text-xs text-stone-600 mt-1 truncate">
                    {char.values.slice(0, 3).join(' · ')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#FBF9F5] px-6 py-4 flex flex-col gap-2.5 text-sm font-medium text-stone-800">
          {user && (
            <div className="flex items-center justify-between py-2 border-b border-stone-200/60">
              <div className="flex items-center gap-2.5 min-w-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-stone-200"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-amber-100 text-[#131B3A] text-xs font-semibold flex items-center justify-center">
                    {initials || 'P'}
                  </span>
                )}
                <span className="font-semibold text-[#131B3A] truncate">{displayName}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
                className="text-xs font-semibold text-amber-800 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
          <a
            href="#characters"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-stone-200/60"
          >
            Characters
          </a>
          <a
            href="#collection"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-stone-200/60"
          >
            Shop Plush Toys
          </a>
          <a
            href="#story-first"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-stone-200/60"
          >
            Story-First Discovery
          </a>
          <a
            href="#values"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-stone-200/60"
          >
            Learn by Value
          </a>
          <a
            href="#bedtime"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-stone-200/60"
          >
            Bedtime &amp; Bundles
          </a>
          {user ? (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrders();
              }}
              className="py-2 text-left text-amber-800 font-semibold"
            >
              Orders, Wishlist &amp; Account
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="py-2 text-left text-amber-800 font-semibold"
            >
              Continue with Google / Sign In
            </button>
          )}
        </div>
      )}
    </header>
  );
}
