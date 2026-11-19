export type CoreValue =
  | 'Courage'
  | 'Kindness'
  | 'Wisdom'
  | 'Friendship'
  | 'Compassion'
  | 'Patience'
  | 'Determination'
  | 'Respect'
  | 'Discipline'
  | 'Devotion'
  | 'Leadership'
  | 'Playfulness'
  | 'Gratitude'
  | 'Curiosity';

export type ExperienceCategory =
  | 'Storytelling Toys'
  | 'Bedtime Stories'
  | 'Audio Stories'
  | 'Character Toys'
  | 'Story Sets'
  | 'Gift Sets'
  | 'Educational Toys';

export type AgeBracket = '3–4 Years' | '3–5 Years' | '4–5 Years' | '5–6 Years' | '3–6 Years';

export type OccasionType =
  | 'Birthday'
  | 'Janmashtami'
  | 'Ganesh Chaturthi'
  | 'Diwali'
  | 'Raksha Bandhan'
  | 'Holiday Gifting'
  | 'Everyday Learning';

export type LanguageCode =
  | 'en-IN'
  | 'hi-IN'
  | 'gu-IN'
  | 'mr-IN'
  | 'ta-IN'
  | 'te-IN'
  | 'bn-IN';

export interface Character {
  id: string;
  name: string;
  symbol: string;
  tagline: string;
  description: string;
  image: string;
  values: CoreValue[];
  ageSuitability: string;
  storyCount: number;
  toyCount: number;
  available: boolean;
  featuredStoryId?: string;
}

export interface Story {
  id: string;
  title: string;
  characterId: string;
  characterName: string;
  description: string;
  values: CoreValue[];
  ageRange: string;
  durationMinutes: number;
  durationLabel: string;
  bedtimeSuitable: boolean;
  isDemoPrototype: boolean;
  recommendedProductId: string;
  chapters: {
    title: string;
    text: string;
  }[];
}

export interface Product {
  id: string;
  name: string;
  characterId: string;
  characterName: string;
  characterSymbol: string;
  description: string;
  shortHook: string;
  price: number;
  originalPrice?: number;
  category: ExperienceCategory;
  ageRange: AgeBracket;
  values: CoreValue[];
  occasions: OccasionType[];
  storyIds: string[];
  image: string;
  features: string[];
  materials: string;
  dimensions: string;
  safetyNote: string;
  bedtimeSuitable: boolean;
  stock: number;
  rating: number;
  reviews: number;
  isFeatured?: boolean;
  featuredTag?: string;
}

export interface Bundle {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  characterNames: string;
  includedItems: string[];
  originalPrice: number;
  bundlePrice: number;
  image: string;
  productId: string;
  isBedtime?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  characterName: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'Confirmed' | 'Dispatched' | 'Delivered';

export type PaymentMethod = 'Cash on Delivery (COD)' | 'UPI' | 'Credit / Debit Card';

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: PaymentMethod;
  isGift: boolean;
  giftMessage: string;
  status: OrderStatus;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  providerId: string;
  createdAt?: string;
  lastLoginAt: string;
}

export interface UserPreference {
  userId: string;
  childAge: string;
  storyInterests: string[];
  valuesToEncourage: CoreValue[];
  onboardingCompleted: boolean;
  updatedAt: string;
}
