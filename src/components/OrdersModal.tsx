import React, { useState } from 'react';
import { LogOut, Package, Plus, Trash2, X } from 'lucide-react';
import { INITIAL_CHARACTERS } from '../data/catalog';
import { Character, CoreValue, Order, Product, UserProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { ResilientImage } from './ResilientImage';

interface OrdersModalProps {
  isOpen: boolean;
  user: UserProfile | null;
  orders: Order[];
  products: Product[];
  wishlistProducts: Product[];
  authError: string;
  onClose: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onAddToCart: (product: Product) => void;
  onRemoveWishlist: (productId: string) => void;
  onUpdateStock: (productId: string, newStock: number) => Promise<void>;
  onAddCharacter: (character: Character) => Promise<void>;
}

export function OrdersModal({
  isOpen,
  user,
  orders,
  products,
  wishlistProducts,
  authError,
  onClose,
  onSignIn,
  onSignOut,
  onAddToCart,
  onRemoveWishlist,
  onUpdateStock,
  onAddCharacter,
}: OrdersModalProps) {
  const [tab, setTab] = useState<'orders' | 'wishlist' | 'admin'>('orders');
  const [newCharName, setNewCharName] = useState('');
  const [newCharSymbol, setNewCharSymbol] = useState('🪷');
  const [newCharTagline, setNewCharTagline] = useState('');
  const [newCharValue, setNewCharValue] = useState<CoreValue>('Kindness');
  const [savingChar, setSavingChar] = useState(false);

  if (!isOpen) return null;

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharName.trim()) return;
    setSavingChar(true);
    try {
      const id = newCharName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 64);
      await onAddCharacter({
        id: id || `char-${Date.now()}`,
        name: newCharName.trim().slice(0, 100),
        symbol: newCharSymbol.trim() || '✨',
        tagline:
          newCharTagline.trim() ||
          `Stories of ${newCharValue.toLowerCase()} and joyful discovery.`,
        description:
          newCharTagline.trim() ||
          `${newCharName.trim()} brings new cultural stories of ${newCharValue.toLowerCase()} to Katha Kraft's.`,
        image: INITIAL_CHARACTERS[0].image,
        values: [newCharValue, 'Wisdom'],
        ageSuitability: '3–6 Years',
        storyCount: 1,
        toyCount: 1,
        available: true,
      });
      setNewCharName('');
      setNewCharTagline('');
    } finally {
      setSavingChar(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-[#FBF9F5] border border-stone-200 rounded-xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between gap-4">
          <div>
            <h2
              id="account-modal-title"
              className="font-display text-xl font-semibold text-[#131B3A]"
            >
              Account, Orders &amp; Operations
            </h2>
            {user && (
              <p className="text-xs text-stone-500 mt-0.5">
                Signed in as {user.displayName} ({user.email})
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account modal"
            className="p-2 text-stone-500 hover:text-stone-900 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth bar */}
        <div className="px-6 py-3.5 bg-stone-100/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border border-stone-300 object-cover"
                  />
                )}
                <div className="text-xs">
                  <p className="font-semibold text-[#131B3A]">{user.displayName}</p>
                  <p className="text-stone-500">Synced with Katha Kraft&apos;s Firestore</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <p className="text-xs text-stone-700">
                Continue with Google to sync orders, wishlist, and child story preferences.
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <PWAInstallButton />
                <button
                  type="button"
                  onClick={onSignIn}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Continue with Google
                </button>
              </div>
            </>
          )}
        </div>

        {authError && (
          <div className="mx-6 mt-4 p-3 text-xs text-amber-950 bg-amber-50 border border-amber-200 rounded-lg">
            {authError}
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="inline-flex p-1 bg-stone-200/70 rounded-lg gap-1">
            <button
              type="button"
              onClick={() => setTab('orders')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                tab === 'orders' ? 'bg-white text-[#131B3A]' : 'text-stone-600'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('wishlist')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                tab === 'wishlist' ? 'bg-white text-[#131B3A]' : 'text-stone-600'
              }`}
            >
              Wishlist ({wishlistProducts.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('admin')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                tab === 'admin' ? 'bg-white text-[#131B3A]' : 'text-stone-600'
              }`}
            >
              Studio Admin
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab === 'orders' &&
            (orders.length === 0 ? (
              <div className="py-12 text-center">
                <Package className="w-8 h-8 text-stone-400 mx-auto mb-2" strokeWidth={1.5} />
                <p className="font-display text-lg font-medium text-[#131B3A]">
                  No orders placed yet
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Confirmed orders and delivery receipts appear here.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-stone-200 rounded-xl p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div>
                      <p className="text-xs font-semibold text-[#131B3A] tabular-nums">
                        Order #{order.id}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {new Date(order.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        · {order.paymentMethod}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-800">
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.productId}`}
                        className="flex items-center justify-between text-xs text-stone-700"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="tabular-nums font-medium">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500">
                      {order.city}, {order.pincode}
                    </span>
                    <span className="font-semibold text-[#131B3A] tabular-nums">
                      Total ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))
            ))}

          {tab === 'wishlist' &&
            (wishlistProducts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-display text-lg font-medium text-[#131B3A]">
                  Your wishlist is empty
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Tap the heart icon on any plush companion to save it here.
                </p>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    <ResilientImage
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      fallbackTitle={product.characterName}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-semibold text-[#131B3A] truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5 tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')} · Ages {product.ageRange}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onAddToCart(product)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveWishlist(product.id)}
                      aria-label={`Remove ${product.name}`}
                      className="p-2 text-stone-400 hover:text-red-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ))}

          {tab === 'admin' && (
            <div className="space-y-6">
              {/* Summary Metrics */}
              <div className="grid grid-cols-3 gap-4 pb-5 border-b border-stone-200">
                <div className="bg-white border border-stone-200 rounded-lg p-3.5">
                  <p className="text-xs text-stone-500">Orders Recorded</p>
                  <p className="font-display text-xl font-semibold text-[#131B3A] tabular-nums mt-0.5">
                    {orders.length}
                  </p>
                </div>
                <div className="bg-white border border-stone-200 rounded-lg p-3.5">
                  <p className="text-xs text-stone-500">Order Volume</p>
                  <p className="font-display text-xl font-semibold text-[#131B3A] tabular-nums mt-0.5">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-white border border-stone-200 rounded-lg p-3.5">
                  <p className="text-xs text-stone-500">Plush SKUs</p>
                  <p className="font-display text-xl font-semibold text-[#131B3A] tabular-nums mt-0.5">
                    {products.length}
                  </p>
                </div>
              </div>

              {/* Add Character to Firestore */}
              <form
                onSubmit={handleCreateCharacter}
                className="bg-white border border-stone-200 rounded-xl p-4 space-y-3"
              >
                <p className="font-display text-base font-semibold text-[#131B3A]">
                  Add New Character to Universe
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    required
                    value={newCharName}
                    onChange={(e) => setNewCharName(e.target.value)}
                    placeholder="Character name (e.g. Saraswati)"
                    className="px-3 py-2 text-xs border border-stone-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newCharSymbol}
                    onChange={(e) => setNewCharSymbol(e.target.value)}
                    placeholder="Symbol (e.g. 🎶)"
                    className="px-3 py-2 text-xs border border-stone-300 rounded-lg"
                  />
                  <select
                    value={newCharValue}
                    onChange={(e) => setNewCharValue(e.target.value as CoreValue)}
                    className="px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="Kindness">Kindness</option>
                    <option value="Wisdom">Wisdom</option>
                    <option value="Courage">Courage</option>
                    <option value="Friendship">Friendship</option>
                    <option value="Patience">Patience</option>
                  </select>
                </div>
                <div className="flex gap-2.5">
                  <input
                    type="text"
                    value={newCharTagline}
                    onChange={(e) => setNewCharTagline(e.target.value)}
                    placeholder="Short story tagline..."
                    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg"
                  />
                  <button
                    type="submit"
                    disabled={savingChar}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] cursor-pointer whitespace-nowrap"
                  >
                    {savingChar ? 'Adding...' : 'Add Character'}
                  </button>
                </div>
              </form>

              {/* Live Inventory Stock Adjustment */}
              <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-2.5">
                <p className="font-display text-base font-semibold text-[#131B3A] mb-2">
                  Live Plush Stock Levels
                </p>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 py-2 border-b border-stone-100 last:border-0 text-xs"
                  >
                    <span className="font-medium text-stone-800 truncate">{product.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          void onUpdateStock(product.id, Math.max(0, product.stock - 1))
                        }
                        className="px-2 py-1 border border-stone-300 rounded hover:bg-stone-50 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold tabular-nums">
                        {product.stock}
                      </span>
                      <button
                        type="button"
                        onClick={() => void onUpdateStock(product.id, product.stock + 1)}
                        className="px-2 py-1 border border-stone-300 rounded hover:bg-stone-50 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
