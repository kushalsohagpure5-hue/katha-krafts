import React from 'react';

export function CraftSection() {
  return (
    <section id="craft" className="py-16 lg:py-20 border-b border-stone-200/80">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-medium text-amber-800 mb-2">
            Cultural &amp; Parent Trust
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#131B3A] tracking-tight text-balance">
            Rooted in Stories. Designed for Modern Childhood.
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
            Katha Kraft&apos;s is more than a toy store—it is a welcoming space for Indian
            storytelling traditions, moral values, and screen-free play. Stories are shared
            as timeless fables of kindness, courage, and curiosity to inspire conversation at
            home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-stone-200">
          <div>
            <p className="text-xs font-medium text-stone-500 mb-2">01. Soft Plush Craft</p>
            <h3 className="font-display text-xl font-semibold text-[#131B3A] mb-2">
              Organic Cotton &amp; Velvet
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Hypoallergenic GOTS-certified organic cotton, soft muslin, and plush velvet with
              cloud-soft fiber fill. Outer covers unzip safely for gentle machine washing.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-stone-500 mb-2">02. Concealed Audio</p>
            <h3 className="font-display text-xl font-semibold text-[#131B3A] mb-2">
              Squeeze-to-Play Sound Module
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              A soft-touch silicone module rests inside the plush tummy—zero hard corners,
              zero plastic eyes, and a gentle 20-minute breathing bedtime glow on sleep sets.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-stone-500 mb-2">03. Multilingual Play</p>
            <h3 className="font-display text-xl font-semibold text-[#131B3A] mb-2">
              7 Indian Languages
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Hear stories in English, Hindi, Gujarati, Marathi, Tamil, Telugu, and Bengali—so
              grandparents and parents alike can share bedtime fables effortlessly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
