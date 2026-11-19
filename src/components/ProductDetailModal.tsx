import React, { useEffect, useState } from 'react';
import { Heart, Minus, Play, Plus, Star, X } from 'lucide-react';
import { Product, Story } from '../types';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: Product | null;
  stories: Story[];
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
  onPlayStory: (story: Story, bedtimeMode?: boolean) => void;
}

export function ProductDetailModal({
  product,
  stories,
  isWishlisted,
  onClose,
  onAddToCart,
  onToggleWishlist,
  onPlayStory,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product?.id]);

  if (!product) return null;

  const outOfStock = product.stock <= 0;
  const productStories = stories.filter((s) => product.storyIds.includes(s.id));

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FBF9F5] border border-stone-200 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="sticky top-4 float-right mr-4 mt-4 z-10 w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:text-stone-900 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
          {/* Left: Product Gallery */}
          <div className="md:col-span-6">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 md:sticky md:top-6">
              <ResilientImage
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                fallbackTitle={product.name}
              />
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="md:col-span-6 flex flex-col">
            <p className="text-xs text-stone-500 mb-2">
              <span>
                {product.characterSymbol} {product.characterName}
              </span>
              <span aria-hidden="true"> · </span>
              <span>{product.category}</span>
              <span aria-hidden="true"> · </span>
              <span>Ages {product.ageRange}</span>
            </p>

            <h2
              id="pdp-title"
              className="font-display text-2xl sm:text-3xl font-semibold text-[#131B3A] leading-tight"
            >
              {product.name}
            </h2>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-[#131B3A] tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-700 ml-auto tabular-nums">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                {product.rating.toFixed(1)} · {outOfStock ? 'Out of Stock' : `${product.stock} left`}
              </span>
            </div>

            <p className="text-sm text-stone-700 leading-relaxed mt-4">
              {product.description}
            </p>

            <p className="text-xs text-amber-800 font-medium mt-3">
              Values: {product.values.join(' · ')}
            </p>

            {/* Contiguous Quantity + Add to Bag + Wishlist */}
            <div className="mt-6 flex flex-wrap items-center gap-3 pb-6 border-b border-stone-200">
              <div className="inline-flex items-center border border-stone-300 bg-white rounded-lg">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-stone-700 hover:text-stone-900 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-sm font-semibold tabular-nums min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() =>
                    setQuantity((q) => Math.min(Math.max(1, product.stock), q + 1))
                  }
                  className="p-2.5 text-stone-700 hover:text-stone-900 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={outOfStock}
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="flex-1 min-w-[160px] px-6 py-3 text-sm font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] disabled:bg-stone-300 disabled:text-stone-600 transition-colors whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
              >
                {outOfStock ? 'Out of Stock' : 'Add to Bag'}
              </button>

              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                className="p-3 bg-white border border-stone-300 rounded-lg text-stone-700 hover:text-amber-800 transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? 'fill-amber-700 text-amber-700' : ''}`}
                />
              </button>
            </div>

            {/* What will they hear? Story Library */}
            {productStories.length > 0 && (
              <div className="mt-5 pb-5 border-b border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-[#131B3A]">
                    What will they hear?
                  </p>
                  <span className="text-[11px] text-stone-500">
                    7-language demo audio preview
                  </span>
                </div>
                <div className="space-y-2">
                  {productStories.map((story) => (
                    <div
                      key={story.id}
                      className="bg-white border border-stone-200 rounded-lg p-3 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-display text-sm font-semibold text-[#131B3A] truncate">
                          {story.title}
                        </p>
                        <p className="text-xs text-stone-500">
                          {story.durationLabel} · {story.values[0]}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onPlayStory(story, product.bedtimeSuitable)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#131B3A] bg-amber-100 rounded-md hover:bg-amber-200 cursor-pointer shrink-0"
                      >
                        <Play className="w-3 h-3" />
                        <span>Play</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Soft Plush Craft & Toddler Safety Specs */}
            <dl className="mt-5 space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-semibold text-stone-800 sm:w-28 shrink-0">Plush Build</dt>
                <dd className="text-stone-600">{product.materials}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-semibold text-stone-800 sm:w-28 shrink-0">Dimensions</dt>
                <dd className="text-stone-600">{product.dimensions}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-semibold text-stone-800 sm:w-28 shrink-0">Child Safety</dt>
                <dd className="text-stone-600">{product.safetyNote}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
