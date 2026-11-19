import React, { useState } from 'react';
import { ArrowRight, Bell, Check } from 'lucide-react';
import { FUTURE_CHARACTERS } from '../data/catalog';
import { Character } from '../types';
import { ResilientImage } from './ResilientImage';

interface CharacterExplorerProps {
  characters: Character[];
  onSelectCharacter: (character: Character) => void;
}

export function CharacterExplorer({
  characters,
  onSelectCharacter,
}: CharacterExplorerProps) {
  const [notifiedIds, setNotifiedIds] = useState<string[]>([]);

  const toggleNotify = (id: string) => {
    setNotifiedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="characters" className="py-16 lg:py-20 border-b border-stone-200/80">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-medium text-amber-800 mb-2">
              The Katha Kraft&apos;s Universe
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#131B3A] tracking-tight">
              Meet the Characters
            </h2>
          </div>
          <p className="text-sm text-stone-600 max-w-md">
            Choose a character to explore their story library, moral values, and matching
            soft plush companions.
          </p>
        </div>

        {/* Available Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {characters.map((char) => (
            <article
              key={char.id}
              className="bg-white border border-stone-200/80 rounded-xl overflow-hidden flex flex-col transition-transform duration-200 ease-out hover:-translate-y-0.5"
            >
              <button
                type="button"
                onClick={() => onSelectCharacter(char)}
                className="aspect-[4/3] bg-stone-100 overflow-hidden block text-left cursor-pointer"
              >
                <ResilientImage
                  src={char.image}
                  alt={`${char.name} soft plush storytelling character`}
                  className="w-full h-full object-cover"
                  fallbackTitle={`${char.symbol} ${char.name}`}
                />
              </button>

              <div className="p-6 flex-1 flex flex-col">
                <p className="text-xs text-stone-500 mb-1.5">
                  <span>{char.storyCount} Stories</span>
                  <span aria-hidden="true"> · </span>
                  <span>{char.toyCount} Plush Toys</span>
                  <span aria-hidden="true"> · </span>
                  <span>Ages {char.ageSuitability}</span>
                </p>

                <h3 className="font-display text-xl font-semibold text-[#131B3A]">
                  {char.symbol} {char.name}
                </h3>

                <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                  {char.tagline}
                </p>

                <p className="text-xs text-stone-500 mt-3">
                  Values: {char.values.slice(0, 4).join(' · ')}
                </p>

                <div className="mt-auto pt-5">
                  <button
                    type="button"
                    onClick={() => onSelectCharacter(char)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#131B3A] hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    <span>Explore {char.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Extensible Future Character Architecture */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h3 className="font-display text-lg font-semibold text-[#131B3A]">
                Coming Soon to Katha Kraft&apos;s
              </h3>
              <p className="text-xs text-stone-600">
                Our storytelling universe is expanding. Tap to be notified when new plush
                companions launch.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FUTURE_CHARACTERS.map((fc) => {
              const isNotified = notifiedIds.includes(fc.id);
              return (
                <div
                  key={fc.id}
                  className="bg-[#F7F4EE] border border-stone-200/80 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <p className="font-display text-base font-semibold text-[#131B3A]">
                      {fc.symbol} {fc.name}
                    </p>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {fc.tagline}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotify(fc.id)}
                    className={`mt-4 inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                      isNotified ? 'text-emerald-800' : 'text-amber-800 hover:underline'
                    }`}
                  >
                    {isNotified ? (
                      <>
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Launch Alert Saved</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Notify Me</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
