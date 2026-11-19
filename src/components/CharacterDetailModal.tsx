import React from 'react';
import { Play, Plus, X } from 'lucide-react';
import { Character, Product, Story } from '../types';
import { ResilientImage } from './ResilientImage';

interface CharacterDetailModalProps {
  character: Character | null;
  stories: Story[];
  products: Product[];
  onClose: () => void;
  onPlayStory: (story: Story) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function CharacterDetailModal({
  character,
  stories,
  products,
  onClose,
  onPlayStory,
  onSelectProduct,
  onAddToCart,
}: CharacterDetailModalProps) {
  if (!character) return null;

  const charStories = stories.filter((s) => s.characterId === character.id);
  const charProducts = products.filter(
    (p) =>
      p.characterId === character.id ||
      p.characterName.toLowerCase().includes(character.name.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="char-detail-title"
      onClick={onClose}
    >
      <div
        className="bg-[#FBF9F5] border border-stone-200 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500">
              /characters/{character.id} · Ages {character.ageSuitability}
            </p>
            <h2
              id="char-detail-title"
              className="font-display text-xl font-semibold text-[#131B3A]"
            >
              {character.symbol} {character.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close character detail"
            className="p-2 text-stone-500 hover:text-stone-900 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-10">
          {/* Hero Intro */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <ResilientImage
                src={character.image}
                alt={character.name}
                className="w-full h-full object-cover"
                fallbackTitle={character.name}
              />
            </div>
            <div className="md:col-span-7">
              <p className="text-xs font-medium text-amber-800 mb-2">
                Core Values: {character.values.join(' · ')}
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#131B3A]">
                {character.tagline}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed mt-3">
                {character.description}
              </p>
            </div>
          </div>

          {/* Story Library */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200">
              <h3 className="font-display text-xl font-semibold text-[#131B3A]">
                {character.name}&apos;s Story Library
              </h3>
              <span className="text-xs text-stone-500">
                Prototype read-aloud &amp; multilingual audio stories
              </span>
            </div>

            {charStories.length === 0 ? (
              <p className="text-sm text-stone-600">
                Stories for {character.name} are being crafted.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {charStories.map((story) => (
                  <div
                    key={story.id}
                    className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-xs text-stone-500">
                        {story.durationLabel} · {story.values.join(', ')}
                        {story.bedtimeSuitable ? ' · Bedtime Calm' : ''}
                      </p>
                      <h4 className="font-display text-base font-semibold text-[#131B3A] mt-1">
                        {story.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                        {story.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onPlayStory(story)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Listen Story</span>
                      </button>
                      <span className="text-[11px] text-stone-400">Demo Script</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Plush Toys */}
          <div>
            <h3 className="font-display text-xl font-semibold text-[#131B3A] mb-4 pb-2 border-b border-stone-200">
              Soft Plush Companions &amp; Sets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {charProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-stone-200 rounded-xl p-4 flex gap-4 items-center"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                    className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 shrink-0 cursor-pointer"
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
                      <h4 className="font-display text-sm font-semibold text-[#131B3A] truncate">
                        {product.name}
                      </h4>
                    </button>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Ages {product.ageRange} · ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    <button
                      type="button"
                      onClick={() => onAddToCart(product)}
                      className="mt-2.5 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#131B3A] rounded-md hover:bg-[#1E2A55] cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
