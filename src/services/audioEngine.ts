import { LanguageCode } from '../types';

const RAGA_BHOOPALI_DAY = [
  659.25, // E5 (Ga)
  783.99, // G5 (Pa)
  880.0,  // A5 (Dha)
  783.99, // G5 (Pa)
  659.25, // E5 (Ga)
  587.33, // D5 (Re)
  523.25, // C5 (Sa)
  587.33, // D5 (Re)
  659.25, // E5 (Ga)
  783.99, // G5 (Pa)
  1046.5, // C6 (Sa')
  880.0,  // A5 (Dha)
  783.99, // G5 (Pa)
  659.25, // E5 (Ga)
  587.33, // D5 (Re)
  523.25, // C5 (Sa)
];

const RAGA_BHOOPALI_BEDTIME = [
  329.63, // E4
  392.0,  // G4
  440.0,  // A4
  392.0,  // G4
  329.63, // E4
  293.66, // D4
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.0,  // G4
  523.25, // C5
  440.0,  // A4
  392.0,  // G4
  329.63, // E4
  293.66, // D4
  261.63, // C4
];

const FEMALE_VOICE_HINTS = [
  'veena',
  'lekha',
  'heera',
  'priya',
  'neerja',
  'aditi',
  'raveena',
  'kanya',
  'swara',
  'vani',
  'shruti',
  'ananya',
  'samantha',
  'karen',
  'victoria',
  'moira',
  'tessa',
  'fiona',
  'serena',
  'kate',
  'zira',
  'aria',
  'jenny',
  'female',
  'woman',
];

const MALE_VOICE_EXCLUSIONS = [
  'rishi',
  'prabhat',
  'daniel',
  'alex',
  'fred',
  'david',
  'mark',
  'george',
  'oliver',
  'male',
  'guy',
  'ryan',
];

class KathaAudioEngine {
  private ctx: AudioContext | null = null;
  private padOscs: OscillatorNode[] = [];
  private melodyMasterGain: GainNode | null = null;
  private melodyFilter: BiquadFilterNode | null = null;
  private melodyTimer: number | null = null;
  private melodyStep = 0;
  private isMelodyActive = false;

  private audioEl: HTMLAudioElement | null = null;
  private activeObjectUrl: string | null = null;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public playSoundCheck(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    // Gentle 4-note Raga Bhoopali chime (Sa - Ga - Pa - Sa)
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    const now = ctx.currentTime;
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);
      gain.gain.setValueAtTime(0.001, now + idx * 0.14);
      gain.gain.linearRampToValueAtTime(0.11, now + idx * 0.14 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 0.75);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 0.8);
    });
  }

  private pluckMelodyNote(freq: number, bedtimeMode: boolean): void {
    if (!this.ctx || !this.melodyFilter || !this.isMelodyActive) return;
    const now = this.ctx.currentTime;
    const duration = bedtimeMode ? 2.1 : 1.55;

    const fundOsc = this.ctx.createOscillator();
    const overtoneOsc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const overtoneGain = this.ctx.createGain();

    fundOsc.type = 'sine';
    fundOsc.frequency.setValueAtTime(freq, now);

    overtoneOsc.type = 'triangle';
    overtoneOsc.frequency.setValueAtTime(freq * 2, now);
    overtoneGain.gain.value = 0.12;

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(bedtimeMode ? 0.24 : 0.28, now + 0.055);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    fundOsc.connect(noteGain);
    overtoneOsc.connect(overtoneGain);
    overtoneGain.connect(noteGain);
    noteGain.connect(this.melodyFilter);

    fundOsc.start(now);
    overtoneOsc.start(now);
    fundOsc.stop(now + duration + 0.05);
    overtoneOsc.stop(now + duration + 0.05);
  }

  public startSweetMelody(volume = 0.12, bedtimeMode = false): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (this.isMelodyActive) {
      this.stopSweetMelody();
    }

    const masterGain = ctx.createGain();
    const clamped = Math.max(0, Math.min(0.22, volume));
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(clamped, ctx.currentTime + 0.9);
    masterGain.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(bedtimeMode ? 980 : 1450, ctx.currentTime);
    filter.Q.setValueAtTime(0.7, ctx.currentTime);
    filter.connect(masterGain);

    // Subtle, warm harmonic drone bed underneath the sweet melody
    const padFreqs = bedtimeMode ? [130.81, 196.0] : [196.0, 261.63];
    const oscs = padFreqs.map((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      const subGain = ctx.createGain();
      subGain.gain.value = idx === 0 ? 0.16 : 0.12;
      osc.connect(subGain);
      subGain.connect(filter);
      osc.start();
      return osc;
    });

    this.padOscs = oscs;
    this.melodyMasterGain = masterGain;
    this.melodyFilter = filter;
    this.isMelodyActive = true;
    this.melodyStep = 0;

    const scale = bedtimeMode ? RAGA_BHOOPALI_BEDTIME : RAGA_BHOOPALI_DAY;
    const intervalMs = bedtimeMode ? 1150 : 780;

    // Play the opening note gently
    this.pluckMelodyNote(scale[0], bedtimeMode);
    this.melodyStep = 1;

    this.melodyTimer = window.setInterval(() => {
      if (!this.isMelodyActive) return;
      const note = scale[this.melodyStep % scale.length];
      this.pluckMelodyNote(note, bedtimeMode);
      this.melodyStep += 1;
    }, intervalMs);
  }

  public setMelodyVolume(volume: number): void {
    if (this.ctx && this.melodyMasterGain) {
      this.melodyMasterGain.gain.setTargetAtTime(
        Math.max(0, Math.min(0.22, volume)),
        this.ctx.currentTime,
        0.12
      );
    }
  }

  public stopSweetMelody(): void {
    if (this.melodyTimer !== null) {
      window.clearInterval(this.melodyTimer);
      this.melodyTimer = null;
    }
    this.isMelodyActive = false;
    try {
      this.padOscs.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.melodyFilter?.disconnect();
      this.melodyMasterGain?.disconnect();
    } finally {
      this.padOscs = [];
      this.melodyFilter = null;
      this.melodyMasterGain = null;
    }
  }

  public playStudioNarration(params: {
    base64Audio: string;
    mimeType: string;
    rate: number;
    bedtimeMode: boolean;
    volume: number;
    paragraphLengths: number[];
    onParagraphChange: (index: number) => void;
    onComplete: () => void;
    onError: (message: string) => void;
  }): void {
    this.stopVoiceOnly();

    try {
      const binary = atob(params.base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: params.mimeType || 'audio/wav' });
      const url = URL.createObjectURL(blob);
      this.activeObjectUrl = url;

      const audio = new Audio(url);
      this.audioEl = audio;
      audio.volume = Math.max(0, Math.min(1, params.volume));
      audio.playbackRate = params.bedtimeMode
        ? Math.min(0.88, params.rate)
        : params.rate;

      const totalChars = Math.max(
        1,
        params.paragraphLengths.reduce((sum, len) => sum + Math.max(1, len), 0)
      );
      const cumulativeThresholds: number[] = [];
      let running = 0;
      params.paragraphLengths.forEach((len) => {
        running += Math.max(1, len);
        cumulativeThresholds.push(running / totalChars);
      });

      audio.ontimeupdate = () => {
        if (!audio.duration || Number.isNaN(audio.duration)) return;
        const progress = audio.currentTime / audio.duration;
        const idx = cumulativeThresholds.findIndex((threshold) => progress <= threshold);
        params.onParagraphChange(idx === -1 ? Math.max(0, cumulativeThresholds.length - 1) : idx);
      };

      audio.onended = () => {
        params.onComplete();
      };

      audio.onerror = () => {
        params.onError('Unable to decode lady storyteller audio stream.');
      };

      params.onParagraphChange(0);
      void audio.play().catch((err) => {
        params.onError(
          err instanceof Error ? err.message : 'Browser blocked automatic audio playback.'
        );
      });
    } catch (err) {
      params.onError(
        err instanceof Error ? err.message : 'Failed to initialize storyteller audio.'
      );
    }
  }

  public pauseVoice(): void {
    if (this.audioEl && !this.audioEl.paused) {
      this.audioEl.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resumeVoice(): boolean {
    if (this.audioEl && this.audioEl.paused) {
      void this.audioEl.play();
      return true;
    }
    return false;
  }

  public setVoiceVolume(volume: number): void {
    if (this.audioEl) {
      this.audioEl.volume = Math.max(0, Math.min(1, volume));
    }
  }

  public setVoiceRate(rate: number, bedtimeMode: boolean): void {
    if (this.audioEl) {
      this.audioEl.playbackRate = bedtimeMode ? Math.min(0.88, rate) : rate;
    }
  }

  private pickFemaleVoice(language: LanguageCode): SpeechSynthesisVoice | undefined {
    const voices = window.speechSynthesis.getVoices();
    const langLower = language.toLowerCase();
    const langPrefix = langLower.split('-')[0];

    const isFemale = (v: SpeechSynthesisVoice) => {
      const n = v.name.toLowerCase();
      if (MALE_VOICE_EXCLUSIONS.some((m) => n.includes(m))) return false;
      return FEMALE_VOICE_HINTS.some((f) => n.includes(f));
    };

    const langVoices = voices.filter(
      (v) =>
        v.lang.toLowerCase() === langLower ||
        v.lang.toLowerCase().startsWith(langPrefix)
    );

    return (
      langVoices.find(isFemale) ||
      langVoices.find((v) => !MALE_VOICE_EXCLUSIONS.some((m) => v.name.toLowerCase().includes(m))) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('en') && isFemale(v)) ||
      voices.find(isFemale) ||
      langVoices[0] ||
      voices.find((v) => v.lang.toLowerCase().startsWith('en'))
    );
  }

  public speakFemaleDeviceVoice(params: {
    paragraphs: string[];
    language: LanguageCode;
    rate: number;
    bedtimeMode: boolean;
    volume: number;
    onParagraphChange: (index: number) => void;
    onComplete: () => void;
  }): void {
    this.stopVoiceOnly();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      params.onComplete();
      return;
    }

    const matchingVoice = this.pickFemaleVoice(params.language);
    let current = 0;

    const speakNext = () => {
      if (current >= params.paragraphs.length) {
        params.onComplete();
        return;
      }
      params.onParagraphChange(current);
      const utterance = new SpeechSynthesisUtterance(params.paragraphs[current]);
      utterance.lang = params.language;
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
      utterance.rate = params.bedtimeMode ? Math.min(0.84, params.rate) : params.rate;
      utterance.pitch = params.bedtimeMode ? 1.04 : 1.08;
      utterance.volume = params.volume;

      utterance.onend = () => {
        current += 1;
        speakNext();
      };
      utterance.onerror = () => {
        params.onComplete();
      };
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  }

  public stopVoiceOnly(): void {
    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.src = '';
      } catch {
        // ignore
      }
      this.audioEl = null;
    }
    if (this.activeObjectUrl) {
      URL.revokeObjectURL(this.activeObjectUrl);
      this.activeObjectUrl = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public stopAll(): void {
    this.stopVoiceOnly();
    this.stopSweetMelody();
  }
}

export const kathaAudio = new KathaAudioEngine();
