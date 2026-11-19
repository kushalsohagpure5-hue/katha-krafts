import React, { useEffect, useMemo, useState } from 'react';
import {
  browserLocalPersistence,
  getRedirectResult,
  inMemoryPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { X } from 'lucide-react';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { BedtimeAndBundlesSection } from './components/BedtimeAndBundlesSection';
import { CartDrawer } from './components/CartDrawer';
import { CharacterDetailModal } from './components/CharacterDetailModal';
import { CharacterExplorer } from './components/CharacterExplorer';
import { CraftSection } from './components/CraftSection';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LoginModal } from './components/LoginModal';
import { OrdersModal } from './components/OrdersModal';
import { PreferencesModal } from './components/PreferencesModal';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchModal } from './components/SearchModal';
import { StoryFirstShopping } from './components/StoryFirstShopping';
import {
  CATALOG_PRODUCTS,
  CATALOG_STORIES,
  CURATED_BUNDLES,
  FREE_SHIPPING_THRESHOLD,
  INITIAL_CHARACTERS,
  STANDARD_SHIPPING_FEE,
} from './data/catalog';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './firebase';
import {
  mergeProductStock,
  saveUserPreferencesToFirestore,
  saveWishlistToFirestore,
  seedInitialCatalogIfEmpty,
  subscribeToProducts,
  subscribeToUserOrders,
  updateProductStockInFirestore,
} from './services/firebaseDb';
import {
  AgeBracket,
  CartItem,
  Character,
  CoreValue,
  ExperienceCategory,
  OccasionType,
  Order,
  PaymentMethod,
  Product,
  Story,
  UserPreference,
  UserProfile,
} from './types';

const EXPERIENCE_FILTERS: ('All' | ExperienceCategory)[] = [
  'All',
  'Storytelling Toys',
  'Bedtime Stories',
  'Story Sets',
  'Gift Sets',
  'Educational Toys',
];

const AGE_FILTERS: ('All' | AgeBracket)[] = [
  'All',
  '3–4 Years',
  '4–5 Years',
  '5–6 Years',
  '3–6 Years',
];

const OCCASION_FILTERS: ('All' | OccasionType)[] = [
  'All',
  'Birthday',
  'Janmashtami',
  'Ganesh Chaturthi',
  'Diwali',
  'Raksha Bandhan',
  'Holiday Gifting',
  'Everyday Learning',
];

const VALUE_FILTERS: ('All' | CoreValue)[] = [
  'All',
  'Friendship',
  'Courage',
  'Wisdom',
  'Compassion',
  'Kindness',
  'Patience',
  'Determination',
  'Gratitude',
  'Curiosity',
];

function MarketplaceApp() {
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem('kathakrafts_custom_characters_v1');
      if (saved) {
        const custom: Character[] = JSON.parse(saved);
        if (Array.isArray(custom) && custom.length > 0) {
          return [
            ...INITIAL_CHARACTERS,
            ...custom.filter((cc) => !INITIAL_CHARACTERS.some((m) => m.id === cc.id)),
          ];
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_CHARACTERS;
  });
  const [products, setProducts] = useState<Product[]>(CATALOG_PRODUCTS);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState('');

  // Marketplace Filters
  const [selectedCharacterFilter, setSelectedCharacterFilter] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<'All' | ExperienceCategory>('All');
  const [selectedAge, setSelectedAge] = useState<'All' | AgeBracket>('All');
  const [selectedValue, setSelectedValue] = useState<'All' | CoreValue>('All');
  const [selectedOccasion, setSelectedOccasion] = useState<'All' | OccasionType>('All');

  // Persisted user collections
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kathakrafts_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kathakrafts_wishlist_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [preferences, setPreferences] = useState<UserPreference | null>(() => {
    try {
      const saved = localStorage.getItem('kathakrafts_prefs_v2');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('kathakrafts_guest_orders_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Audio state
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeAudioStory, setActiveAudioStory] = useState<Story | null>(null);
  const [audioBedtimeMode, setAudioBedtimeMode] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('kathakrafts_cart_v2', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('kathakrafts_wishlist_v2', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  // Support deep-link URL hash like #/characters/krishna
  useEffect(() => {
    const syncFromHash = () => {
      const match = window.location.hash.match(/^#\/characters\/([a-z0-9-]+)$/i);
      if (match) {
        const found = characters.find((c) => c.id === match[1].toLowerCase());
        if (found) setActiveCharacter(found);
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [characters]);

  const openCharacterPage = (char: Character) => {
    setActiveCharacter(char);
    if (window.location.hash !== `#/characters/${char.id}`) {
      window.history.replaceState(null, '', `#/characters/${char.id}`);
    }
  };

  const closeCharacterPage = () => {
    setActiveCharacter(null);
    if (window.location.hash.startsWith('#/characters/')) {
      window.history.replaceState(null, '', '#characters');
    }
  };

  // Firebase Auth & Persistence Setup
  useEffect(() => {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    setPersistence(auth, browserLocalPersistence).catch(() =>
      setPersistence(auth, inMemoryPersistence).catch(() => undefined)
    );
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setIsLoginOpen(false);
          showToast('Signed in with Google');
        }
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : '';
        if (msg.includes('unauthorized-domain')) {
          setAuthError(
            `Add "${window.location.hostname}" in Firebase Console → Authentication → Settings → Authorized domains.`
          );
        }
      });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          displayName: (firebaseUser.displayName || 'Parent').slice(0, 150),
          email: (firebaseUser.email || '').slice(0, 200),
          photoURL: (firebaseUser.photoURL || '').slice(0, 1000),
          providerId: (firebaseUser.providerData[0]?.providerId || 'google.com').slice(0, 64),
          lastLoginAt: new Date().toISOString().slice(0, 64),
        };
        setUser(profile);
        setAuthError('');

        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              ...profile,
              createdAt: new Date().toISOString().slice(0, 64),
            });
          } else {
            await updateDoc(userRef, {
              displayName: profile.displayName,
              email: profile.email,
              photoURL: profile.photoURL,
              providerId: profile.providerId,
              lastLoginAt: profile.lastLoginAt,
            });
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`, true);
        }
      } else {
        setUser(null);
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Firestore Realtime Catalog
  useEffect(() => {
    void seedInitialCatalogIfEmpty();
    const unsubProducts = subscribeToProducts((stockMap) => {
      setProducts(mergeProductStock(CATALOG_PRODUCTS, stockMap));
    });

    return () => {
      unsubProducts();
    };
  }, []);

  // Sync user's Orders, Wishlist & Preferences once signed in
  useEffect(() => {
    if (!authReady || !user) return;

    const unsubOrders = subscribeToUserOrders(user.uid, (fetched) => {
      setOrders(fetched);
    });

    const unsubWishlist = onSnapshot(
      doc(db, 'wishlists', user.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data.productIds)) {
            setWishlistIds(data.productIds);
          }
        } else if (wishlistIds.length > 0) {
          void saveWishlistToFirestore(user.uid, wishlistIds);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, `wishlists/${user.uid}`, true);
      }
    );

    const unsubPrefs = onSnapshot(
      doc(db, 'user_preferences', user.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          setPreferences(docSnap.data() as UserPreference);
        } else if (preferences?.onboardingCompleted) {
          void saveUserPreferencesToFirestore(user.uid, {
            ...preferences,
            userId: user.uid,
          });
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, `user_preferences/${user.uid}`, true);
      }
    );

    return () => {
      unsubOrders();
      unsubWishlist();
      unsubPrefs();
    };
  }, [authReady, user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? '' : curr));
    }, 2600);
  };

  const handleSignIn = async () => {
    setAuthError('');
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoginOpen(false);
      showToast('Signed in with Google');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      const isWebViewOrBlocked =
        msg.includes('popup-blocked') ||
        msg.includes('operation-not-supported-in-this-environment');
      if (isWebViewOrBlocked) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch {
          // fall through to readable message
        }
      }
      if (msg.includes('unauthorized-domain')) {
        setAuthError(
          `Add "${window.location.hostname}" in Firebase Console → Authentication → Settings → Authorized domains. Guest checkout and browsing still work fully.`
        );
      } else if (msg.includes('popup-closed-by-user')) {
        setAuthError('Sign-in popup was closed before completing.');
      } else {
        setAuthError(
          msg ||
            'Google Sign-In could not complete right now. Guest checkout and local wishlist remain active.'
        );
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    showToast('Signed out');
  };

  const handleAddToCart = (product: Product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + qty) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, qty) }];
    });
    showToast(`Added ${product.name} to Bag`);
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(item.product.stock, quantity) }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleToggleWishlist = async (productId: string) => {
    const next = wishlistIds.includes(productId)
      ? wishlistIds.filter((id) => id !== productId)
      : [...wishlistIds, productId].slice(0, 100);
    setWishlistIds(next);

    if (user) {
      await saveWishlistToFirestore(user.uid, next);
    }
    showToast(
      wishlistIds.includes(productId) ? 'Removed from wishlist' : 'Saved to wishlist'
    );
  };

  const handleSavePreferences = async (
    prefs: Omit<UserPreference, 'userId' | 'updatedAt'>
  ) => {
    const nextPrefs: UserPreference = {
      userId: user?.uid || 'guest',
      childAge: prefs.childAge.slice(0, 50),
      storyInterests: prefs.storyInterests.slice(0, 20),
      valuesToEncourage: prefs.valuesToEncourage.slice(0, 24),
      onboardingCompleted: true,
      updatedAt: new Date().toISOString().slice(0, 64),
    };
    setPreferences(nextPrefs);
    try {
      localStorage.setItem('kathakrafts_prefs_v2', JSON.stringify(nextPrefs));
    } catch {
      // ignore
    }

    if (user) {
      await saveUserPreferencesToFirestore(user.uid, nextPrefs);
    }
    showToast('Personalized discovery updated');
  };

  const handlePlaceOrder = async (checkoutData: {
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    paymentMethod: PaymentMethod;
    isGift: boolean;
    giftMessage: string;
  }): Promise<Order> => {
    const orderId = `KK-${Date.now().toString().slice(-6)}`;
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    const total = subtotal + shipping;

    const newOrder: Order = {
      id: orderId,
      userId: user?.uid || 'guest',
      date: new Date().toISOString(),
      items: cart.slice(0, 50).map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        characterName: item.product.characterName,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      subtotal,
      discount: 0,
      shipping,
      total,
      customerName: checkoutData.customerName,
      email: checkoutData.email,
      phone: checkoutData.phone,
      address: checkoutData.address,
      city: checkoutData.city,
      pincode: checkoutData.pincode,
      paymentMethod: checkoutData.paymentMethod,
      isGift: checkoutData.isGift,
      giftMessage: checkoutData.giftMessage,
      status: 'Confirmed',
    };

    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
      await Promise.all(
        cart.map((item) =>
          updateProductStockInFirestore(
            item.product.id,
            Math.max(0, item.product.stock - item.quantity)
          )
        )
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `orders/${orderId}`, true);
    }

    setProducts((prev) =>
      prev.map((p) => {
        const bought = cart.find((c) => c.product.id === p.id);
        return bought ? { ...p, stock: Math.max(0, p.stock - bought.quantity) } : p;
      })
    );
    setOrders((prev) => {
      const updated = [newOrder, ...prev.filter((o) => o.id !== newOrder.id)];
      if (!user) {
        try {
          localStorage.setItem('kathakrafts_guest_orders_v2', JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return updated;
    });
    setCart([]);

    return newOrder;
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
    await updateProductStockInFirestore(productId, newStock);
    showToast('Stock updated');
  };

  const handleAddCharacter = async (char: Character) => {
    setCharacters((prev) => {
      const next = [...prev.filter((c) => c.id !== char.id), char];
      try {
        const customOnly = next.filter(
          (c) => !INITIAL_CHARACTERS.some((base) => base.id === c.id)
        );
        localStorage.setItem(
          'kathakrafts_custom_characters_v1',
          JSON.stringify(customOnly)
        );
      } catch {
        // ignore
      }
      return next;
    });
    showToast(`${char.name} added to Katha Kraft's universe`);
  };

  const handlePlayStory = (story: Story, bedtime = false) => {
    setAudioBedtimeMode(bedtime);
    setActiveAudioStory(story);
  };

  const isRecommendedProduct = (product: Product): boolean => {
    if (!preferences?.onboardingCompleted) return false;
    return (
      preferences.valuesToEncourage.length === 0 ||
      product.values.some((v) => preferences.valuesToEncourage.includes(v))
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchChar =
        selectedCharacterFilter === 'All' ||
        product.characterId === selectedCharacterFilter ||
        product.characterName.toLowerCase().includes(selectedCharacterFilter.toLowerCase());
      const matchExp =
        selectedExperience === 'All' || product.category === selectedExperience;
      const matchAge =
        selectedAge === 'All' ||
        selectedAge === '3–6 Years' ||
        product.ageRange === selectedAge ||
        product.ageRange === '3–6 Years' ||
        (product.ageRange === '3–5 Years' &&
          (selectedAge === '3–4 Years' || selectedAge === '4–5 Years'));
      const matchVal =
        selectedValue === 'All' || product.values.includes(selectedValue);
      const matchOccasion =
        selectedOccasion === 'All' || product.occasions.includes(selectedOccasion);
      return matchChar && matchExp && matchAge && matchVal && matchOccasion;
    });
  }, [
    products,
    selectedCharacterFilter,
    selectedExperience,
    selectedAge,
    selectedValue,
    selectedOccasion,
  ]);

  const wishlistProducts = useMemo(
    () => products.filter((p) => wishlistIds.includes(p.id)),
    [products, wishlistIds]
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900 ${activeAudioStory ? 'pb-20' : ''}`}>
      <Header
        cartCount={cartCount}
        characters={characters}
        user={user}
        onSelectCharacter={openCharacterPage}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenLogin={() => {
          setAuthError('');
          setIsLoginOpen(true);
        }}
        onSignOut={() => void handleSignOut()}
      />

      <main className="flex-1">
        <HeroSection
          onOpenPreferences={() => setIsPreferencesOpen(true)}
          hasActivePreferences={Boolean(preferences?.onboardingCompleted)}
        />

        {/* Personalized Picks Banner when onboarding preferences exist */}
        {preferences?.onboardingCompleted && (
          <section className="bg-amber-50/70 border-b border-amber-200/70 py-6">
            <div className="max-w-[1280px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-amber-800">
                  Personalized Discovery · {preferences.childAge}
                </p>
                <h2 className="font-display text-xl font-semibold text-[#131B3A]">
                  Stories picked for your little explorer
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  Encouraging: {preferences.valuesToEncourage.join(' · ') || 'All Values'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPreferencesOpen(true)}
                  className="px-3.5 py-2 text-xs font-medium text-[#131B3A] bg-white border border-stone-300 rounded-lg cursor-pointer"
                >
                  Edit Preferences
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const cleared: UserPreference = {
                      userId: user?.uid || 'guest',
                      childAge: preferences?.childAge || '3–4 Years',
                      storyInterests: [],
                      valuesToEncourage: [],
                      onboardingCompleted: false,
                      updatedAt: new Date().toISOString().slice(0, 64),
                    };
                    setPreferences(null);
                    localStorage.removeItem('kathakrafts_prefs_v2');
                    if (user) {
                      void saveUserPreferencesToFirestore(user.uid, cleared);
                    }
                  }}
                  aria-label="Clear personalized preferences"
                  className="p-2 text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        <CharacterExplorer
          characters={characters}
          onSelectCharacter={openCharacterPage}
        />

        {/* Soft Plush Collection Marketplace Grid */}
        <section id="collection" className="py-16 lg:py-20 border-b border-stone-200/80">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-200">
              <div>
                <p className="text-xs font-medium text-amber-800 mb-2">
                  Soft Plush Storytelling Marketplace
                </p>
                <h2 className="font-display text-3xl font-semibold text-[#131B3A] tracking-tight">
                  Shop by Character, Age, Value &amp; Occasion
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  aria-label="Shop by Character"
                  value={selectedCharacterFilter}
                  onChange={(e) => setSelectedCharacterFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-medium bg-white border border-stone-300 rounded-lg text-stone-800 cursor-pointer"
                >
                  <option value="All">Character: All</option>
                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.symbol} {c.name}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Shop by Age"
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value as 'All' | AgeBracket)}
                  className="px-3 py-2 text-xs font-medium bg-white border border-stone-300 rounded-lg text-stone-800 cursor-pointer"
                >
                  {AGE_FILTERS.map((age) => (
                    <option key={age} value={age}>
                      {age === 'All' ? 'Age: 3–6 Years' : age}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Shop by Value"
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value as 'All' | CoreValue)}
                  className="px-3 py-2 text-xs font-medium bg-white border border-stone-300 rounded-lg text-stone-800 cursor-pointer"
                >
                  {VALUE_FILTERS.map((v) => (
                    <option key={v} value={v}>
                      {v === 'All' ? 'Value: All' : v}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Shop by Occasion"
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value as 'All' | OccasionType)}
                  className="px-3 py-2 text-xs font-medium bg-white border border-stone-300 rounded-lg text-stone-800 cursor-pointer"
                >
                  {OCCASION_FILTERS.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ === 'All' ? 'Occasion: All' : occ}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shop by Experience Segmented Tabs */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div
                className="inline-flex flex-wrap items-center gap-1 p-1 bg-stone-200/70 rounded-lg"
                role="tablist"
                aria-label="Shop by Experience"
              >
                {EXPERIENCE_FILTERS.map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    role="tab"
                    aria-selected={selectedExperience === exp}
                    onClick={() => setSelectedExperience(exp)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedExperience === exp
                        ? 'bg-white text-[#131B3A]'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {exp === 'All' ? 'All Experiences' : exp}
                  </button>
                ))}
              </div>

              {(selectedCharacterFilter !== 'All' ||
                selectedExperience !== 'All' ||
                selectedAge !== 'All' ||
                selectedValue !== 'All' ||
                selectedOccasion !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCharacterFilter('All');
                    setSelectedExperience('All');
                    setSelectedAge('All');
                    setSelectedValue('All');
                    setSelectedOccasion('All');
                  }}
                  className="text-xs font-medium text-amber-800 hover:underline cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center border border-stone-200 rounded-xl bg-white mt-8">
                <p className="font-display text-lg font-medium text-[#131B3A]">
                  No plush companions match all selected filters
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCharacterFilter('All');
                    setSelectedExperience('All');
                    setSelectedAge('All');
                    setSelectedValue('All');
                    setSelectedOccasion('All');
                  }}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#131B3A] rounded-lg cursor-pointer"
                >
                  Show All Companions
                </button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    isRecommended={isRecommendedProduct(product)}
                    onSelect={setSelectedProduct}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <StoryFirstShopping
          characters={characters}
          stories={CATALOG_STORIES}
          products={products}
          onPlayStory={handlePlayStory}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          onSelectProduct={setSelectedProduct}
          onSelectCharacter={openCharacterPage}
        />

        <BedtimeAndBundlesSection
          stories={CATALOG_STORIES}
          products={products}
          bundles={CURATED_BUNDLES}
          onPlayStory={handlePlayStory}
          onSelectProduct={setSelectedProduct}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          onFilterByOccasion={(occ) => setSelectedOccasion(occ)}
        />

        <CraftSection />
      </main>

      <Footer
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      {/* Interactive Modals & Drawers */}
      <CharacterDetailModal
        character={activeCharacter}
        stories={CATALOG_STORIES}
        products={products}
        onClose={closeCharacterPage}
        onPlayStory={(story) => handlePlayStory(story, false)}
        onSelectProduct={setSelectedProduct}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      <ProductDetailModal
        product={selectedProduct}
        stories={CATALOG_STORIES}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onPlayStory={handlePlayStory}
      />

      <SearchModal
        isOpen={isSearchOpen}
        characters={characters}
        stories={CATALOG_STORIES}
        products={products}
        bundles={CURATED_BUNDLES}
        onClose={() => setIsSearchOpen(false)}
        onSelectCharacter={openCharacterPage}
        onPlayStory={(story) => handlePlayStory(story, false)}
        onSelectProduct={setSelectedProduct}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        user={user}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onPlaceOrder={handlePlaceOrder}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        user={user}
        orders={orders}
        products={products}
        wishlistProducts={wishlistProducts}
        authError={authError}
        onClose={() => setIsOrdersOpen(false)}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onRemoveWishlist={handleToggleWishlist}
        onUpdateStock={handleUpdateStock}
        onAddCharacter={handleAddCharacter}
      />

      <LoginModal
        isOpen={isLoginOpen}
        isSigningIn={isSigningIn}
        authError={authError}
        onClose={() => setIsLoginOpen(false)}
        onGoogleSignIn={() => void handleSignIn()}
      />

      <PreferencesModal
        isOpen={isPreferencesOpen}
        initialPreferences={preferences}
        onClose={() => setIsPreferencesOpen(false)}
        onSave={handleSavePreferences}
      />

      <AudioPlayerBar
        story={activeAudioStory}
        initialBedtimeMode={audioBedtimeMode}
        onClose={() => setActiveAudioStory(null)}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-5 z-50 px-4 py-2.5 text-xs font-medium text-white bg-[#131B3A] rounded-lg shadow-lg ${
            activeAudioStory ? 'bottom-20' : 'bottom-5'
          }`}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MarketplaceApp />
    </ErrorBoundary>
  );
}
