import React, { useMemo, useState } from 'react';
import { ArrowRight, Play, Plus } from 'lucide-react';
import { Character, CoreValue, Product, Story } from '../types';
import { ResilientImage } from './ResilientImage';

interface StoryFirstShoppingProps {
  characters: Character[];
  stories: Story[];
  products: Product[];
  onPlayStory: (story: Story, bedtimeMode?: boolean) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onSelectCharacter: (character: Character) => void;
}

const VALUE_OPTIONS: { value: CoreValue; symbol: string }[] = [
  { value: 'Kindness', symbol: '❤️' },
  { value: 'Courage', symbol: '🦁' },
  { value: 'Wisdom', symbol: '🧠' },
  { value: 'Friendship', symbol: '🤝' },
  { value: 'Respect', symbol: '🙏' },
  { value: 'Determination', symbol: '💪' },
  { value: 'Patience', symbol: '🌱' },
  { value: 'Compassion', symbol: '💛' },
];

export function StoryFirstShopping({
  characters,
  stories,
  products,
  onPlayStory,
  onAddToCart,
  onSelectProduct,
  onSelectCharacter,
}: StoryFirstShoppingProps) {
  const [storyCharFilter, setStoryCharFilter] = useState<string>('all');
  const [selectedStoryId, setSelectedStoryId] = useState<string>(stories[2]?.id || stories[0]?.id || '');
  const [selectedValue, setSelectedValue] = useState<CoreValue>('Courage');

  const visibleStories = useMemo(() => {
    if (storyCharFilter === 'all') {
      // Pick one featured story per character first, then remaining up to 6
      const seen = new Set<string>();
      const diverse: Story[] = [];
      for (const s of stories) {
        if (!seen.has(s.characterId)) {
          seen.add(s.characterId);
          diverse.push(s);
        }
      }
      for (const s of stories) {
        if (!diverse.some((d) => d.id === s.id) && diverse.length < 6) {
          diverse.push(s);
        }
      }
      return diverse;
    }
    return stories.filter((s) => s.characterId === storyCharFilter);
  }, [stories, storyCharFilter]);

  const selectedStory = stories.find((s) => s.id === selectedStoryId) || visibleStories[0] || stories[0];
  const recommendedToy =
    products.find((p) => p.id === selectedStory?.recommendedProductId) || products[0];

  const valueMatches = useMemo(() => {
    const matchedStories = stories.filter((s) => s.values.includes(selectedValue));
    const matchedChars = characters.filter((c) => c.values.includes(selectedValue));
    const matchedToys = products.filter((p) => p.values.includes(selectedValue));
    return { matchedStories, matchedChars, matchedToys };
  }, [stories, characters, products, selectedValue]);

  const handleStoryCharChange = (charId: string) => {
    setStoryCharFilter(charId);
    if (charId !== 'all') {
      const firstForChar = stories.find((s) => s.characterId === charId);
      if (firstForChar) setSelectedStoryId(firstForChar.id);
    }
  };

  return (
    <>
      {/* Section A: Choose a Story. Find the Toy. */}
      <section id="story-first" className="py-16 lg:py-20 bg-[#131B3A] text-stone-100">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-amber-300 mb-2">
                Story-First Shopping
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight text-balance">
                Choose a Story. Find the Toy.
              </h2>
              <p className="text-sm text-stone-300 mt-2">
                Begin with the fable or moral lesson you want to share tonight, then pair it
                with its physical organic plush companion.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleStoryCharChange('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  storyCharFilter === 'all'
                    ? 'bg-amber-400 text-[#131B3A] border-amber-400 font-semibold'
                    : 'bg-white/5 text-stone-200 border-white/15 hover:bg-white/10'
                }`}
              >
                All Highlights
              </button>
              {characters.slice(0, 5).map((char) => (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => handleStoryCharChange(char.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    storyCharFilter === char.id
                      ? 'bg-amber-400 text-[#131B3A] border-amber-400 font-semibold'
                      : 'bg-white/5 text-stone-200 border-white/15 hover:bg-white/10'
                  }`}
                >
                  {char.symbol} {char.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Step 1: Story list */}
            <div className="lg:col-span-5 space-y-2.5">
              {visibleStories.map((story) => {
                const active = story.id === selectedStory?.id;
                return (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => setSelectedStoryId(story.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      active
                        ? 'bg-white text-[#131B3A] border-white'
                        : 'bg-white/5 text-stone-200 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <p
                      className={`text-xs ${
                        active ? 'text-amber-800 font-semibold' : 'text-stone-400'
                      }`}
                    >
                      {story.characterName} · {story.durationLabel} · Value: {story.values[0]}
                    </p>
                    <p className="font-display text-base font-semibold mt-0.5">
                      {story.title}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Step 2 & 3: Story -> Value -> Recommended Plush Companion */}
            {selectedStory && recommendedToy && (
              <div className="lg:col-span-7 bg-white text-stone-900 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
                    <div>
                      <p className="text-xs font-medium text-amber-800">
                        {selectedStory.characterName} · Demo Story Preview
                      </p>
                      <h3 className="font-display text-2xl font-semibold text-[#131B3A] mt-0.5">
                        {selectedStory.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => onPlayStory(selectedStory, false)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#131B3A] bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Listen Audio</span>
                    </button>
                  </div>

                  <p className="text-sm text-stone-700 leading-relaxed mt-4">
                    {selectedStory.chapters[0]?.text}
                  </p>

                  <p className="text-xs font-medium text-stone-600 mt-4">
                    Values carried: {selectedStory.values.join(' · ')} · Ages{' '}
                    {selectedStory.ageRange}
                  </p>
                </div>

                {/* Recommended Plush Box */}
                <div className="mt-6 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(recommendedToy)}
                    className="w-24 h-20 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0 cursor-pointer"
                  >
                    <ResilientImage
                      src={recommendedToy.image}
                      alt={recommendedToy.name}
                      className="w-full h-full object-cover"
                      fallbackTitle={recommendedToy.characterName}
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-stone-500">Recommended Plush Companion</p>
                    <button
                      type="button"
                      onClick={() => onSelectProduct(recommendedToy)}
                      className="text-left cursor-pointer"
                    >
                      <h4 className="font-display text-lg font-semibold text-[#131B3A] hover:text-amber-900">
                        {recommendedToy.name}
                      </h4>
                    </button>
                    <p className="text-xs text-stone-600 mt-0.5 tabular-nums">
                      ₹{recommendedToy.price.toLocaleString('en-IN')} · {recommendedToy.shortHook}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddToCart(recommendedToy)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section B: Value-Based Discovery */}
      <section id="values" className="py-16 lg:py-20 border-b border-stone-200/80">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-medium text-amber-800 mb-2">
              Value-Based Discovery
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#131B3A] tracking-tight text-balance">
              What would you like your child to learn today?
            </h2>
          </div>

          {/* Interactive Value Selector */}
          <div className="flex flex-wrap gap-2.5 mb-10">
            {VALUE_OPTIONS.map((opt) => {
              const active = selectedValue === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedValue(opt.value)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#131B3A] text-white border-[#131B3A]'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                  }`}
                >
                  <span aria-hidden="true">{opt.symbol}</span>
                  <span>{opt.value}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Output for Selected Value */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-stone-200">
            {/* Characters & Stories teaching this value */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-display text-lg font-semibold text-[#131B3A]">
                Stories &amp; Characters for {selectedValue}
              </h3>

              <div className="flex flex-wrap gap-2">
                {valueMatches.matchedChars.map((char) => (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => onSelectCharacter(char)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-[#131B3A] rounded-lg cursor-pointer"
                  >
                    <span>
                      {char.symbol} {char.name}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>

              <div className="space-y-2.5 pt-2">
                {valueMatches.matchedStories.slice(0, 3).map((story) => (
                  <div
                    key={story.id}
                    className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs text-stone-500">
                        {story.characterName} · {story.durationLabel}
                      </p>
                      <p className="font-display text-sm font-semibold text-[#131B3A]">
                        {story.title}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onPlayStory(story)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 rounded-lg hover:bg-amber-100 cursor-pointer shrink-0"
                    >
                      <Play className="w-3 h-3" />
                      <span>Play</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Matching Plush Toys */}
            <div className="lg:col-span-7">
              <h3 className="font-display text-lg font-semibold text-[#131B3A] mb-4">
                Companion Plush Toys for {selectedValue}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {valueMatches.matchedToys.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-stone-200 rounded-xl p-4 flex gap-4 items-center"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
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
                        onClick={() => onSelectProduct(product)}
                        className="text-left cursor-pointer"
                      >
                        <p className="font-display text-sm font-semibold text-[#131B3A] truncate">
                          {product.name}
                        </p>
                      </button>
                      <p className="text-xs text-stone-500 mt-0.5 tabular-nums">
                        {product.characterSymbol} {product.characterName} · ₹
                        {product.price.toLocaleString('en-IN')}
                      </p>
                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
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
      </section>
    </>
  );
}
