import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Loader2,
  Moon,
  Music,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { STORY_NARRATIONS, SUPPORTED_LANGUAGES } from '../data/storyNarrations';
import { kathaAudio } from '../services/audioEngine';
import { LanguageCode, Story } from '../types';

interface AudioPlayerBarProps {
  story: Story | null;
  initialBedtimeMode?: boolean;
  onClose: () => void;
}

interface CachedTtsAudio {
  audioBase64: string;
  mimeType: string;
}

export function AudioPlayerBar({
  story,
  initialBedtimeMode = false,
  onClose,
}: AudioPlayerBarProps) {
  const [language, setLanguage] = useState<LanguageCode>('en-IN');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [usingDeviceVoice, setUsingDeviceVoice] = useState(false);
  const [bedtimeMode, setBedtimeMode] = useState(initialBedtimeMode);
  const [speed, setSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(0.85);
  const [muted, setMuted] = useState(false);
  const [melodyOn, setMelodyOn] = useState(true);
  const [readAlongOpen, setReadAlongOpen] = useState(false);
  const [activeParagraph, setActiveParagraph] = useState(0);

  const clientCacheRef = useRef<Map<string, CachedTtsAudio>>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const hasStudioAudioRef = useRef(false);

  useEffect(() => {
    setBedtimeMode(initialBedtimeMode);
  }, [initialBedtimeMode, story?.id]);

  const narration = useMemo(() => {
    if (!story) return null;
    const localized = STORY_NARRATIONS[story.id]?.[language];
    if (localized) {
      return localized;
    }
    const enFallback = STORY_NARRATIONS[story.id]?.['en-IN'];
    if (enFallback) {
      return enFallback;
    }
    return {
      title: story.title,
      paragraphs: story.chapters.map((c) => `${c.title}. ${c.text}`),
      moral: `Value carried: ${story.values.join(', ')}.`,
    };
  }, [story, language]);

  const startStudioStory = async () => {
    if (!story || !narration) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    hasStudioAudioRef.current = false;
    setUsingDeviceVoice(false);
    setVoiceError('');
    setIsLoadingVoice(true);
    setIsPlaying(true);

    if (melodyOn && !muted) {
      kathaAudio.startSweetMelody(volume * 0.13, bedtimeMode);
    }

    const cacheKey = `${story.id}::${language}::${bedtimeMode ? 'bed' : 'day'}`;
    const allSegments = [...narration.paragraphs, narration.moral];
    const paragraphLengths = allSegments.map((s) => s.length);

    try {
      let cached = clientCacheRef.current.get(cacheKey);
      if (!cached) {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            storyId: story.id,
            title: narration.title,
            paragraphs: narration.paragraphs,
            moral: narration.moral,
            language,
            bedtimeMode,
          }),
        });

        const data = (await res.json()) as {
          audioBase64?: string;
          mimeType?: string;
          error?: string;
        };

        if (!res.ok || !data.audioBase64) {
          throw new Error(data.error || 'Could not load lady storyteller voice.');
        }

        cached = {
          audioBase64: data.audioBase64,
          mimeType: data.mimeType || 'audio/wav',
        };
        clientCacheRef.current.set(cacheKey, cached);
      }

      if (controller.signal.aborted) return;

      setIsLoadingVoice(false);
      hasStudioAudioRef.current = true;

      kathaAudio.playStudioNarration({
        base64Audio: cached.audioBase64,
        mimeType: cached.mimeType,
        rate: speed,
        bedtimeMode,
        volume: muted ? 0 : volume,
        paragraphLengths,
        onParagraphChange: (idx) => setActiveParagraph(idx),
        onComplete: () => {
          setIsPlaying(false);
          hasStudioAudioRef.current = false;
          kathaAudio.stopSweetMelody();
        },
        onError: (msg) => {
          setVoiceError(msg);
          setIsPlaying(false);
          hasStudioAudioRef.current = false;
        },
      });
    } catch (err) {
      if (controller.signal.aborted) return;
      setIsLoadingVoice(false);
      setIsPlaying(false);
      kathaAudio.stopSweetMelody();
      setVoiceError(
        err instanceof Error ? err.message : 'Unable to reach storyteller voice service.'
      );
    }
  };

  const playWithDeviceFemaleVoice = () => {
    if (!narration) return;
    setVoiceError('');
    setUsingDeviceVoice(true);
    setIsPlaying(true);
    if (melodyOn && !muted) {
      kathaAudio.startSweetMelody(volume * 0.13, bedtimeMode);
    }
    kathaAudio.speakFemaleDeviceVoice({
      paragraphs: [...narration.paragraphs, narration.moral],
      language,
      rate: speed,
      bedtimeMode,
      volume: muted ? 0 : volume,
      onParagraphChange: (idx) => setActiveParagraph(idx),
      onComplete: () => {
        setIsPlaying(false);
        kathaAudio.stopSweetMelody();
      },
    });
  };

  useEffect(() => {
    if (story) {
      void startStudioStory();
    }
    return () => {
      abortRef.current?.abort();
      kathaAudio.stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id, language, bedtimeMode]);

  useEffect(() => {
    kathaAudio.setVoiceRate(speed, bedtimeMode);
  }, [speed, bedtimeMode]);

  if (!story || !narration) return null;

  const togglePlay = () => {
    if (isLoadingVoice) return;
    if (isPlaying) {
      kathaAudio.pauseVoice();
      kathaAudio.stopSweetMelody();
      setIsPlaying(false);
      return;
    }
    if (hasStudioAudioRef.current && kathaAudio.resumeVoice()) {
      if (melodyOn && !muted) {
        kathaAudio.startSweetMelody(volume * 0.13, bedtimeMode);
      }
      setIsPlaying(true);
    } else if (usingDeviceVoice) {
      playWithDeviceFemaleVoice();
    } else {
      void startStudioStory();
    }
  };

  const handleClose = () => {
    abortRef.current?.abort();
    kathaAudio.stopAll();
    setIsPlaying(false);
    setIsLoadingVoice(false);
    hasStudioAudioRef.current = false;
    onClose();
  };

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 border-t transition-colors ${
        bedtimeMode
          ? 'bg-[#0B1026] text-stone-100 border-indigo-900'
          : 'bg-[#131B3A] text-white border-white/15'
      }`}
      role="region"
      aria-label="Audio Story Player"
    >
      {/* Voice Error Notice (when API key or TTS service reports an error) */}
      {voiceError && (
        <div className="bg-amber-950/90 border-b border-amber-700/60 px-6 py-2">
          <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-amber-100">
            <span>{voiceError}</span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => void startStudioStory()}
                className="px-2.5 py-1 bg-amber-500 text-[#131B3A] font-semibold rounded cursor-pointer"
              >
                Retry Storyteller
              </button>
              <button
                type="button"
                onClick={playWithDeviceFemaleVoice}
                className="px-2.5 py-1 bg-white/15 hover:bg-white/25 text-white rounded cursor-pointer"
              >
                Use Device Lady Voice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Read-Along Drawer */}
      {readAlongOpen && (
        <div className="max-w-[1280px] mx-auto px-6 py-4 border-b border-white/15 max-h-56 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-amber-300">
              Read Along · {narration.title} (Sole Lady Storyteller &amp; Sweet Melody)
            </p>
            <button
              type="button"
              onClick={() => setReadAlongOpen(false)}
              className="text-xs text-stone-300 hover:text-white cursor-pointer"
            >
              Hide Script
            </button>
          </div>
          <div className="space-y-2 text-sm">
            {narration.paragraphs.map((p, idx) => (
              <p
                key={idx}
                className={
                  idx === activeParagraph ? 'text-amber-200 font-medium' : 'text-stone-300'
                }
              >
                {p}
              </p>
            ))}
            <p
              className={`text-xs pt-1 ${
                activeParagraph >= narration.paragraphs.length
                  ? 'text-amber-200 font-semibold'
                  : 'text-amber-300'
              }`}
            >
              Moral: {narration.moral}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Track Info + Play/Pause */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={
              isLoadingVoice
                ? 'Preparing lady storyteller'
                : isPlaying
                  ? 'Pause story'
                  : 'Play story'
            }
            className="w-10 h-10 rounded-full bg-amber-500 text-[#131B3A] flex items-center justify-center hover:bg-amber-400 transition-colors shrink-0 cursor-pointer"
          >
            {isLoadingVoice ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>

          <div className="min-w-0">
            <p className="font-display text-sm font-semibold truncate">{narration.title}</p>
            <p className="text-xs text-stone-300 truncate">
              {isLoadingVoice
                ? 'Preparing sole lady voice & sweet melody...'
                : `${story.characterName} · Lady Storyteller${melodyOn ? ' + Sweet Melody' : ''} · ${story.durationLabel}`}
            </p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                language === lang.code
                  ? 'bg-amber-500 text-[#131B3A] font-semibold'
                  : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              {lang.nativeLabel}
            </button>
          ))}
        </div>

        {/* Controls: Sound Check, Bedtime, Speed, Sweet Melody, Read Along, Volume, Close */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => kathaAudio.playSoundCheck()}
            className="px-2.5 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-md cursor-pointer whitespace-nowrap"
          >
            Sound Check
          </button>

          <button
            type="button"
            onClick={() => setBedtimeMode((b) => !b)}
            aria-pressed={bedtimeMode}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md cursor-pointer whitespace-nowrap ${
              bedtimeMode ? 'bg-indigo-700 text-amber-200' : 'bg-white/10 text-stone-200'
            }`}
          >
            <Moon className="w-3 h-3" />
            <span>Bedtime</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setSpeed((s) => (s === 1.0 ? 0.85 : s === 0.85 ? 1.2 : 1.0))
            }
            className="px-2.5 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-md tabular-nums cursor-pointer"
          >
            {speed}x
          </button>

          <button
            type="button"
            onClick={() => {
              const next = !melodyOn;
              setMelodyOn(next);
              if (!next) {
                kathaAudio.stopSweetMelody();
              } else if (isPlaying && !muted) {
                kathaAudio.startSweetMelody(volume * 0.13, bedtimeMode);
              }
            }}
            aria-pressed={melodyOn}
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md cursor-pointer whitespace-nowrap ${
              melodyOn ? 'bg-white/20 text-amber-200' : 'bg-white/10 text-stone-300'
            }`}
          >
            <Music className="w-3 h-3" aria-hidden="true" />
            <span>Sweet Melody</span>
          </button>

          <button
            type="button"
            onClick={() => setReadAlongOpen((r) => !r)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-md cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-3 h-3" />
            <span>Read Along</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const nextMuted = !muted;
              setMuted(nextMuted);
              kathaAudio.setVoiceVolume(nextMuted ? 0 : volume);
              if (nextMuted) {
                kathaAudio.stopSweetMelody();
              } else if (melodyOn && isPlaying) {
                kathaAudio.startSweetMelody(volume * 0.13, bedtimeMode);
              }
            }}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="p-1.5 text-stone-200 hover:text-white cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (!muted) {
                kathaAudio.setVoiceVolume(v);
                kathaAudio.setMelodyVolume(v * 0.13);
              }
            }}
            aria-label="Volume"
            className="hidden lg:block w-16 accent-amber-400"
          />

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close audio player"
            className="p-1.5 text-stone-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
