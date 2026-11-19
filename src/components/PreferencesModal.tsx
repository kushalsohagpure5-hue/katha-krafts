import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { CoreValue, UserPreference } from '../types';

interface PreferencesModalProps {
  isOpen: boolean;
  initialPreferences: UserPreference | null;
  onClose: () => void;
  onSave: (prefs: Omit<UserPreference, 'userId' | 'updatedAt'>) => Promise<void>;
}

const AGE_OPTIONS = ['3–4 Years', '4–5 Years', '5–6 Years'];
const STORY_INTERESTS = [
  'Adventure',
  'Animals',
  'Heroes',
  'Funny Stories',
  'Bedtime Stories',
  'Moral Stories',
  'Indian Mythology',
];
const VALUE_OPTIONS: CoreValue[] = [
  'Kindness',
  'Curiosity',
  'Courage',
  'Patience',
  'Friendship',
  'Wisdom',
  'Compassion',
  'Determination',
];

export function PreferencesModal({
  isOpen,
  initialPreferences,
  onClose,
  onSave,
}: PreferencesModalProps) {
  const [childAge, setChildAge] = useState('3–4 Years');
  const [storyInterests, setStoryInterests] = useState<string[]>([
    'Indian Mythology',
    'Bedtime Stories',
  ]);
  const [valuesToEncourage, setValuesToEncourage] = useState<CoreValue[]>([
    'Courage',
    'Kindness',
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialPreferences) {
      setChildAge(initialPreferences.childAge || '3–4 Years');
      setStoryInterests(initialPreferences.storyInterests || []);
      setValuesToEncourage(initialPreferences.valuesToEncourage || []);
    }
  }, [initialPreferences, isOpen]);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    setStoryInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const toggleValue = (val: CoreValue) => {
    setValuesToEncourage((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        childAge: childAge.slice(0, 50),
        storyInterests: storyInterests.slice(0, 20),
        valuesToEncourage: valuesToEncourage.slice(0, 24),
        onboardingCompleted: true,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pref-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-[#FBF9F5] border border-stone-200 rounded-xl max-w-lg w-full p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-stone-200">
          <div>
            <p className="text-xs font-medium text-amber-800">Personalized Discovery</p>
            <h2
              id="pref-modal-title"
              className="font-display text-2xl font-semibold text-[#131B3A] mt-1"
            >
              Find a Story for Your Little Explorer
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quiz"
            className="p-2 text-stone-500 hover:text-stone-900 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#131B3A] mb-2">
              Child&apos;s Age
            </label>
            <div className="grid grid-cols-3 gap-2">
              {AGE_OPTIONS.map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setChildAge(age)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    childAge === age
                      ? 'bg-[#131B3A] text-white border-[#131B3A]'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#131B3A] mb-2">
              What kind of stories does your child enjoy?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STORY_INTERESTS.map((interest) => {
                const selected = storyInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-between transition-colors cursor-pointer ${
                      selected
                        ? 'bg-amber-50 text-amber-950 border-amber-700'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <span>{interest}</span>
                    {selected && <Check className="w-3.5 h-3.5 text-amber-800" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#131B3A] mb-2">
              What would you like to encourage?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {VALUE_OPTIONS.map((val) => {
                const selected = valuesToEncourage.includes(val);
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => toggleValue(val)}
                    className={`py-2 px-2.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#131B3A] text-white border-[#131B3A]'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-stone-700 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#131B3A] rounded-lg hover:bg-[#1E2A55] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {saving ? 'Personalizing...' : 'Personalize Feed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
