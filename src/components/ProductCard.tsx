import React from 'react';
import { Heart, Plus, Star } from 'lucide-react';
import { Product } from '../types';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  isRecommended?: boolean;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
}

export function ProductCard({
  product,
  isWishlisted,
  isRecommended,
  onSelect,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const outOfStock = product.stock <= 0;

  return (
    <article className="group bg-white border border-stone-200/80 rounded-xl overflow-hidden flex flex-col transition-transform duration-200 ease-out hover:-translate-y-0.5">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <button
          type="button"
          onClick={() => onSelect(product)}
          className="w-full h-full block text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-700"
          aria-label={`View details for ${product.name}`}
        >
          <ResilientImage
            src={product.image}
            alt={`${product.name} handcrafted organic cotton plush toy`}
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            fallbackTitle={product.name}
          />
        </button>

        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs border border-stone-200/80 flex items-center justify-center text-stone-700 hover:text-amber-800 transition-colors cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-amber-700 text-amber-700' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Clean unboxed metadata */}
        <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-1.5">
          <p className="truncate">
            <span>
              {product.characterSymbol} {product.characterName}
            </span>
            <span aria-hidden="true"> · </span>
            <span>Ages {product.ageRange}</span>
          </p>
          {(isRecommended || product.featuredTag) && (
            <span className="text-amber-800 font-medium whitespace-nowrap shrink-0">
              {isRecommended ? 'Picked for You' : product.featuredTag}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelect(product)}
          className="text-left cursor-pointer"
        >
          <h3 className="font-display text-lg font-semibold text-[#131B3A] group-hover:text-amber-900 transition-colors">
            {product.name}
          </h3>
        </button>

        <p className="text-sm text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
          {product.shortHook}
        </p>

        <div className="mt-2.5 flex items-center justify-between text-xs text-stone-500">
          <span className="truncate">{product.values.slice(0, 2).join(' · ')}</span>
          <span className="inline-flex items-center gap-1 text-stone-700 font-medium tabular-nums shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
            {product.rating.toFixed(1)} ({product.reviews})
          </span>
        </div>

        {/* Bottom Price & Action Baseline */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-stone-100">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-[#131B3A] tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={outOfStock}
            onClick={() => onAddToCart(product)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] disabled:bg-stone-300 disabled:text-stone-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{outOfStock ? 'Sold Out' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
