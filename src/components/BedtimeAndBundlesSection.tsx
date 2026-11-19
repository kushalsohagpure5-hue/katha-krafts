import React, { useMemo, useState } from 'react';
import { Gift, Moon, Play, Plus } from 'lucide-react';
import { Bundle, OccasionType, Product, Story } from '../types';
import { ResilientImage } from './ResilientImage';

interface BedtimeAndBundlesSectionProps {
  stories: Story[];
  products: Product[];
  bundles: Bundle[];
  onPlayStory: (story: Story, bedtimeMode?: boolean) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onFilterByOccasion: (occasion: OccasionType) => void;
}

const GIFT_OCCASIONS: { label: string; occasion: OccasionType }[] = [
  { label: 'Birthday Gifts', occasion: 'Birthday' },
  { label: 'Janmashtami & Festivals', occasion: 'Janmashtami' },
  { label: 'Ganesh Chaturthi', occasion: 'Ganesh Chaturthi' },
  { label: 'Diwali & Raksha Bandhan', occasion: 'Diwali' },
  { label: "Grandparents' & Return Gifts", occasion: 'Holiday Gifting' },
];

export function BedtimeAndBundlesSection({
  stories,
  products,
  bundles,
  onPlayStory,
  onSelectProduct,
  onAddToCart,
  onFilterByOccasion,
}: BedtimeAndBundlesSectionProps) {
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium'>('all');

  const bedtimeStories = useMemo(() => {
    return stories
      .filter((s) => s.bedtimeSuitable)
      .filter((s) => {
        if (durationFilter === 'short') return s.durationMinutes <= 5;
        if (durationFilter === 'medium') return s.durationMinutes > 5;
        return true;
      });
  }, [stories, durationFilter]);

  return (
    <>
      {/* Bedtime Collection */}
      <section id="bedtime" className="py-16 lg:py-20 bg-[#F7F4EE] border-b border-stone-200/80">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-medium text-amber-800 mb-2">
                Bedtime Collection · Soothing Evening Routine
              </p>
              <h2 className="font-display text-3xl font-semibold text-[#131B3A] tracking-tight">
                Calm stories &amp; warm nightlight plush
              </h2>
              <p className="text-sm text-stone-600 mt-1.5 max-w-xl">
                Designed with a 20-minute auto-fade tummy glow and gentle 0.85x sweet
                melody lullaby narration for screen-free sleep transitions.
              </p>
            </div>

            <div className="inline-flex p-1 bg-stone-200/80 rounded-lg gap-1 self-start">
              <button
                type="button"
                onClick={() => setDurationFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                  durationFilter === 'all' ? 'bg-white text-[#131B3A]' : 'text-stone-600'
                }`}
              >
                All Calm
              </button>
              <button
                type="button"
                onClick={() => setDurationFilter('short')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                  durationFilter === 'short' ? 'bg-white text-[#131B3A]' : 'text-stone-600'
                }`}
              >
                3–5 min
              </button>
              <button
                type="button"
                onClick={() => setDurationFilter('medium')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                  durationFilter === 'medium' ? 'bg-white text-[#131B3A]' : 'text-stone-600'
                }`}
              >
                5–10 min
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bedtimeStories.slice(0, 6).map((story) => {
              const matchingProduct = products.find(
                (p) => p.id === story.recommendedProductId
              );
              return (
                <div
                  key={story.id}
                  className="bg-white border border-stone-200/80 rounded-xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                      <span>
                        {story.characterName} · {story.durationLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#131B3A] font-medium">
                        <Moon className="w-3 h-3 text-amber-800" aria-hidden="true" />
                        Best for bedtime
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#131B3A]">
                      {story.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                      {story.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onPlayStory(story, true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>Play Bedtime Mode</span>
                    </button>
                    {matchingProduct && (
                      <button
                        type="button"
                        onClick={() => onSelectProduct(matchingProduct)}
                        className="text-xs font-medium text-amber-800 hover:underline cursor-pointer"
                      >
                        View Toy
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curated Bundles & Gifting */}
      <section id="gifts" className="py-16 lg:py-20 border-b border-stone-200/80">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-medium text-amber-800 mb-2">
                Curated Sets &amp; Gifting · Sample / Demo Pricing
              </p>
              <h2 className="font-display text-3xl font-semibold text-[#131B3A] tracking-tight">
                Give Them a Story
              </h2>
              <p className="text-sm text-stone-600 mt-1.5 max-w-xl">
                Heirloom plush gift sets wrapped in handloom pouches with complimentary
                recipient notes and direct delivery.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {GIFT_OCCASIONS.map((item) => (
                <a
                  key={item.label}
                  href="#collection"
                  onClick={() => onFilterByOccasion(item.occasion)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-stone-300 rounded-lg text-stone-700 hover:border-amber-700 hover:text-[#131B3A] transition-colors"
                >
                  <Gift className="w-3 h-3 text-amber-800" aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bundles.map((bundle) => {
              const savings = bundle.originalPrice - bundle.bundlePrice;
              const targetProduct = products.find((p) => p.id === bundle.productId);
              return (
                <article
                  key={bundle.id}
                  className="bg-white border border-stone-200/80 rounded-xl overflow-hidden flex flex-col"
                >
                  <div className="aspect-[4/3] bg-stone-100 overflow-hidden">
                    <ResilientImage
                      src={bundle.image}
                      alt={bundle.name}
                      className="w-full h-full object-cover"
                      fallbackTitle={bundle.name}
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-xs text-amber-800 font-medium">
                      {bundle.characterNames} · Save ₹{savings.toLocaleString('en-IN')}
                    </p>
                    <h3 className="font-display text-lg font-semibold text-[#131B3A] mt-1">
                      {bundle.name}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                      {bundle.description}
                    </p>
                    <ul className="mt-3 space-y-1 text-xs text-stone-500">
                      {bundle.includedItems.map((item) => (
                        <li key={item}>· {item}</li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-base font-semibold text-[#131B3A] tabular-nums">
                          ₹{bundle.bundlePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-stone-400 line-through ml-1.5 tabular-nums">
                          ₹{bundle.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {targetProduct && (
                        <button
                          type="button"
                          onClick={() => onAddToCart(targetProduct)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Set</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
