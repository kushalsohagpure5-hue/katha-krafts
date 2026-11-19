import React, { useMemo, useState } from 'react';
import { Play, Plus, Search, X } from 'lucide-react';
import { Bundle, Character, Product, Story } from '../types';
import { ResilientImage } from './ResilientImage';

interface SearchModalProps {
  isOpen: boolean;
  characters: Character[];
  stories: Story[];
  products: Product[];
  bundles: Bundle[];
  onClose: () => void;
  onSelectCharacter: (char: Character) => void;
  onPlayStory: (story: Story) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function SearchModal({
  isOpen,
  characters,
  stories,
  products,
  bundles,
  onClose,
  onSelectCharacter,
  onPlayStory,
  onSelectProduct,
  onAddToCart,
}: SearchModalProps) {
  const [queryText, setQueryText] = useState('');

  const results = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) {
      return {
        characters: characters.slice(0, 5),
        stories: stories.slice(0, 4),
        products: products.slice(0, 4),
        bundles: bundles.slice(0, 2),
      };
    }

    return {
      characters: characters.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q) ||
          c.values.some((v) => v.toLowerCase().includes(q))
      ),
      stories: stories.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.characterName.toLowerCase().includes(q) ||
          s.values.some((v) => v.toLowerCase().includes(q)) ||
          s.description.toLowerCase().includes(q)
      ),
      products: products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.characterName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.values.some((v) => v.toLowerCase().includes(q))
      ),
      bundles: bundles.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.characterNames.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      ),
    };
  }, [queryText, characters, stories, products, bundles]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-start justify-center p-4 sm:pt-16 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Global Marketplace Search"
      onClick={onClose}
    >
      <div
        className="bg-[#FBF9F5] border border-stone-200 rounded-xl max-w-3xl w-full max-h-[82vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-white border-b border-stone-200 flex items-center gap-3">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="search"
            autoFocus
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Search Krishna, Courage, Krishna and Sudama, Bedtime Plush..."
            className="flex-1 text-sm bg-transparent focus:outline-none text-stone-900"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 text-stone-500 hover:text-stone-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Characters Group */}
          {results.characters.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-500 mb-2.5">Characters</p>
              <div className="flex flex-wrap gap-2">
                {results.characters.map((char) => (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectCharacter(char);
                    }}
                    className="px-3.5 py-2 text-xs font-medium bg-white border border-stone-200 rounded-lg hover:border-amber-700 text-[#131B3A] cursor-pointer"
                  >
                    {char.symbol} {char.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stories Group */}
          {results.stories.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-500 mb-2.5">Stories</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.stories.map((story) => (
                  <div
                    key={story.id}
                    className="bg-white border border-stone-200 rounded-lg p-3 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="font-display text-sm font-semibold text-[#131B3A] truncate">
                        {story.title}
                      </p>
                      <p className="text-xs text-stone-500">
                        {story.characterName} · {story.values[0]}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onPlayStory(story);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 rounded-md cursor-pointer shrink-0"
                    >
                      <Play className="w-3 h-3" />
                      <span>Play</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Soft Plush Toys Group */}
          {results.products.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-500 mb-2.5">
                Soft Plush Toys
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-stone-200 rounded-lg p-3 flex items-center gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                      className="w-14 h-14 rounded-md overflow-hidden bg-stone-100 shrink-0 cursor-pointer"
                    >
                      <ResilientImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        fallbackTitle={product.characterName}
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectProduct(product);
                        }}
                        className="text-left cursor-pointer"
                      >
                        <p className="font-display text-sm font-semibold text-[#131B3A] truncate">
                          {product.name}
                        </p>
                      </button>
                      <p className="text-xs text-stone-500 tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')} · {product.characterName}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddToCart(product)}
                      aria-label={`Add ${product.name}`}
                      className="p-2 bg-[#131B3A] text-white rounded-md cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collections / Bundles Group */}
          {results.bundles.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-500 mb-2.5">Collections</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.bundles.map((bundle) => {
                  const target = products.find((p) => p.id === bundle.productId);
                  return (
                    <div
                      key={bundle.id}
                      className="bg-white border border-stone-200 rounded-lg p-3 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="font-display text-sm font-semibold text-[#131B3A] truncate">
                          {bundle.name}
                        </p>
                        <p className="text-xs text-stone-500 tabular-nums">
                          ₹{bundle.bundlePrice.toLocaleString('en-IN')} · {bundle.characterNames}
                        </p>
                      </div>
                      {target && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectProduct(target);
                          }}
                          className="text-xs font-semibold text-amber-800 hover:underline cursor-pointer shrink-0"
                        >
                          View Set
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {results.characters.length === 0 &&
            results.stories.length === 0 &&
            results.products.length === 0 &&
            results.bundles.length === 0 && (
              <p className="text-sm text-stone-600 text-center py-8">
                No characters, stories, or soft plush toys matched &ldquo;{queryText}&rdquo;.
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
