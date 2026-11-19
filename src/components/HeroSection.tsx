import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { HERO_COLLECTIVE_IMAGE } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onOpenPreferences: () => void;
  hasActivePreferences: boolean;
}

export function HeroSection({
  onOpenPreferences,
  hasActivePreferences,
}: HeroSectionProps) {
  return (
    <section id="top" className="border-b border-stone-200/80">
      <div className="max-w-[1280px] mx-auto px-6 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left editorial column */}
          <div className="lg:col-span-5 flex flex-col justify-center py-2">
            <p className="text-xs font-medium tracking-wide text-amber-800 mb-3">
              Every character has a story · Every story carries a value
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#131B3A] tracking-tight leading-[1.08] text-balance mb-5">
              Stories That Grow With Them.
            </h1>
            <p className="text-base text-stone-600 leading-relaxed max-w-prose mb-8">
              Discover Indian stories, characters, and values through screen-free play.
              Handcrafted organic soft plush companions featuring Krishna, Radha, Shiva,
              Ganesha, and Hanuman.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#collection"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={onOpenPreferences}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-[#131B3A] bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              >
                <Compass className="w-4 h-4 text-amber-800" aria-hidden="true" />
                <span>{hasActivePreferences ? 'Update Story Profile' : 'Find a Story'}</span>
              </button>
            </div>
          </div>

          {/* Right collective multi-character plush photograph */}
          <div className="lg:col-span-7">
            <div className="h-full min-h-[280px] sm:min-h-[380px] rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80">
              <ResilientImage
                src={HERO_COLLECTIVE_IMAGE}
                alt="Katha Kraft's soft plush companions Krishna, Radha, Shiva, Ganesha, and Hanuman sitting together beside a storybook"
                className="w-full h-full lg:h-full object-cover"
                fallbackTitle="Katha Kraft's Character Collection"
              />
            </div>
          </div>
        </div>

        {/* Full-width 4-column trust strip */}
        <div className="mt-10 pt-8 border-t border-stone-200/80 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-semibold text-[#131B3A]">Screen-Free</p>
            <p className="text-xs text-stone-600 mt-1">
              Tactile organic plush play with squeeze-activated audio stories
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#131B3A]">Story-Based Learning</p>
            <p className="text-xs text-stone-600 mt-1">
              Mythology and fables paired with timeless values and conversation guides
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#131B3A]">Made for Ages 3–6</p>
            <p className="text-xs text-stone-600 mt-1">
              BIS &amp; EN71 tested, zero plastic eyes, machine-washable cotton covers
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#131B3A]">Parent-Friendly</p>
            <p className="text-xs text-stone-600 mt-1">
              7-language audio narrations and 20-minute bedtime wind-down timers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
