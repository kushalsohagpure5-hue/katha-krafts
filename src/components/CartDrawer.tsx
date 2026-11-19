import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '../data/catalog';
import { CartItem, Order, PaymentMethod, UserProfile } from '../types';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  user: UserProfile | null;
  onClose: () => void;
  onUpdateQty: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onPlaceOrder: (checkoutData: {
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    paymentMethod: PaymentMethod;
    isGift: boolean;
    giftMessage: string;
  }) => Promise<Order>;
}

type DrawerStep = 'bag' | 'checkout' | 'confirmed';

export function CartDrawer({
  isOpen,
  items,
  user,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onPlaceOrder,
}: CartDrawerProps) {
  const [step, setStep] = useState<DrawerStep>('bag');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery (COD)');
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      setCustomerName((prev) => prev || user.displayName || '');
      setEmail((prev) => prev || user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (!isOpen && step === 'confirmed') {
      setStep('bag');
      setConfirmedOrder(null);
    }
  }, [isOpen, step]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!customerName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      setFormError('Please complete all delivery fields before confirming.');
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      setFormError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setSubmitting(true);
    try {
      const order = await onPlaceOrder({
        customerName: customerName.trim().slice(0, 200),
        email: email.trim().slice(0, 200),
        phone: phone.trim().slice(0, 50),
        address: address.trim().slice(0, 500),
        city: city.trim().slice(0, 100),
        pincode: pincode.trim().slice(0, 20),
        paymentMethod,
        isGift,
        giftMessage: isGift ? giftMessage.trim().slice(0, 500) : '',
      });
      setConfirmedOrder(order);
      setStep('confirmed');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to place order right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Checkout"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FBF9F5] h-full flex flex-col border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-2">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                aria-label="Back to bag"
                className="p-1.5 text-stone-600 hover:text-stone-900 rounded-md cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display text-xl font-semibold text-[#131B3A]">
              {step === 'bag' && `Your Bag (${items.reduce((s, i) => s + i.quantity, 0)})`}
              {step === 'checkout' && 'Delivery & Payment'}
              {step === 'confirmed' && 'Order Confirmed'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag"
            className="p-2 text-stone-500 hover:text-stone-900 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Bag */}
        {step === 'bag' && (
          <>
            {items.length > 0 && (
              <div className="px-6 py-3 bg-stone-100 border-b border-stone-200 text-xs text-stone-700">
                {remainingForFreeShipping === 0
                  ? 'Complimentary Pan-India delivery unlocked.'
                  : `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} more for free delivery.`}
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {items.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-display text-lg font-medium text-[#131B3A]">
                    Your storytelling bag is empty
                  </p>
                  <p className="text-sm text-stone-600 mt-1.5 mb-6">
                    Choose an organic plush companion to begin your child&apos;s collection.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] transition-colors cursor-pointer"
                  >
                    Browse Companions
                  </button>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-4 pb-5 border-b border-stone-200/80"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      <ResilientImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        fallbackTitle={product.characterName}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-sm font-semibold text-[#131B3A] truncate">
                          {product.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="text-stone-400 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {product.characterName} · Ages {product.ageRange}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-stone-300 bg-white rounded-md">
                          <button
                            type="button"
                            aria-label="Decrease item quantity"
                            onClick={() => onUpdateQty(product.id, quantity - 1)}
                            className="p-1.5 text-stone-700 hover:text-stone-900 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase item quantity"
                            onClick={() => onUpdateQty(product.id, quantity + 1)}
                            className="p-1.5 text-stone-700 hover:text-stone-900 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-[#131B3A] tabular-nums">
                          ₹{(product.price * quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {items.length > 0 && (
                <div className="pt-1">
                  <label className="flex items-center gap-2.5 text-xs font-medium text-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                      className="rounded border-stone-300 text-[#131B3A]"
                    />
                    <span>Wrap in handloom gift pouch with handwritten note</span>
                  </label>
                  {isGift && (
                    <textarea
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      maxLength={500}
                      rows={2}
                      placeholder="Write a birthday or naming ceremony message..."
                      className="mt-2.5 w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#131B3A]"
                    />
                  )}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-stone-200 space-y-3">
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Shipping</span>
                  <span className="tabular-nums font-medium">
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#131B3A] pt-2 border-t border-stone-100">
                  <span>Total</span>
                  <span className="tabular-nums">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="w-full py-3 text-sm font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] transition-colors cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

        {/* Step 2: Checkout Form */}
        {step === 'checkout' && (
          <form onSubmit={handleCheckoutSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {formError && (
                <div className="p-3 text-xs text-red-900 bg-red-50 border border-red-200 rounded-lg">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Parent / Recipient Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ananya Sharma"
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#131B3A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={200}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#131B3A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={50}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#131B3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Delivery Address
                </label>
                <textarea
                  required
                  rows={2}
                  maxLength={500}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Flat no., Street, Landmark"
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#131B3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#131B3A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="560001"
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#131B3A] tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {(
                    [
                      'Cash on Delivery (COD)',
                      'UPI',
                      'Credit / Debit Card',
                    ] as PaymentMethod[]
                  ).map((method) => (
                    <label
                      key={method}
                      className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-lg border cursor-pointer transition-colors ${
                        paymentMethod === method
                          ? 'bg-amber-50 border-amber-700 text-[#131B3A]'
                          : 'bg-white border-stone-300 text-stone-700'
                      }`}
                    >
                      <span>{method}</span>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="text-[#131B3A]"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-stone-200 space-y-3">
              <div className="flex justify-between text-sm font-semibold text-[#131B3A]">
                <span>Amount Payable</span>
                <span className="tabular-nums">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 text-sm font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] disabled:opacity-60 transition-colors cursor-pointer"
              >
                {submitting ? 'Confirming Order...' : `Confirm Order · ₹${total.toLocaleString('en-IN')}`}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation Receipt */}
        {step === 'confirmed' && confirmedOrder && (
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="text-center pb-6 border-b border-stone-200">
              <CheckCircle2
                className="w-10 h-10 text-emerald-700 mx-auto mb-3"
                strokeWidth={1.75}
              />
              <p className="text-xs font-medium text-emerald-800">
                Order #{confirmedOrder.id} Confirmed — Preparing Shipment
              </p>
              <h3 className="font-display text-2xl font-semibold text-[#131B3A] mt-1">
                Thank you, {confirmedOrder.customerName.split(' ')[0]}
              </h3>
              <p className="text-xs text-stone-600 mt-1.5">
                A confirmation receipt has been saved to your Katha Kraft&apos;s orders.
              </p>
            </div>

            <dl className="mt-6 space-y-3 text-xs">
              <div className="flex justify-between">
                <dt className="text-stone-500">Order ID</dt>
                <dd className="font-semibold text-[#131B3A] tabular-nums">{confirmedOrder.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Payment</dt>
                <dd className="font-medium text-stone-800">{confirmedOrder.paymentMethod}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Delivering to</dt>
                <dd className="font-medium text-stone-800 text-right max-w-[220px]">
                  {confirmedOrder.address}, {confirmedOrder.city} – {confirmedOrder.pincode}
                </dd>
              </div>
              <div className="flex justify-between pt-3 border-t border-stone-200 text-sm font-semibold text-[#131B3A]">
                <dt>Total</dt>
                <dd className="tabular-nums">₹{confirmedOrder.total.toLocaleString('en-IN')}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={onClose}
              className="mt-8 w-full py-3 text-sm font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] transition-colors cursor-pointer"
            >
              Continue Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
