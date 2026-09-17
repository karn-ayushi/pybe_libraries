import { SoundEffectType, SoundSettings } from '../types';

const SOUND_STORAGE_KEY = 'pythontales_sound_settings_v1';

export const DEFAULT_SETTINGS: SoundSettings = {
  enabled: true,
  soundEffect: 'soft-pop',
  volume: 0.5
};

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function getSoundSettings(): SoundSettings {
  if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(SOUND_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_SETTINGS };
    return {
      enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : DEFAULT_SETTINGS.enabled,
      soundEffect: parsed.soundEffect || DEFAULT_SETTINGS.soundEffect,
      volume: typeof parsed.volume === 'number' ? parsed.volume : DEFAULT_SETTINGS.volume
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSoundSettings(settings: SoundSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save sound settings', err);
  }
}

/**
 * Plays a soft, subtle bubble pop
 */
function playSoftPop(ctx: AudioContext, masterVolume: number): void {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, now);

  // Smooth upward glide for an organic air bubble sound
  osc.type = 'sine';
  osc.frequency.setValueAtTime(420, now);
  osc.frequency.exponentialRampToValueAtTime(580, now + 0.05);

  // Soft, smooth volume envelope (non-intrusive)
  const vol = Math.max(0.01, Math.min(1, masterVolume)) * 0.18;
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(vol, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.08);
}

/**
 * Plays a vintage, tactile typewriter click
 */
function playTypewriter(ctx: AudioContext, masterVolume: number): void {
  const now = ctx.currentTime;

  // 1. Noise transient for typewriter striker impact
  const bufferSize = ctx.sampleRate * 0.015; // 15ms
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(2600, now);
  bandpass.Q.setValueAtTime(2.2, now);

  const noiseGain = ctx.createGain();
  const vol = Math.max(0.01, Math.min(1, masterVolume)) * 0.14;
  noiseGain.gain.setValueAtTime(vol, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

  noise.connect(bandpass);
  bandpass.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  // 2. Subtle wooden platen resonance tap
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(740, now);
  osc.frequency.exponentialRampToValueAtTime(360, now + 0.025);

  oscGain.gain.setValueAtTime(vol * 0.6, now);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  noise.start(now);
  osc.start(now);
  osc.stop(now + 0.04);
}

/**
 * Plays a warm, subtle chime ping
 */
function playSoftChime(ctx: AudioContext, masterVolume: number): void {
  const now = ctx.currentTime;
  const vol = Math.max(0.01, Math.min(1, masterVolume)) * 0.12;

  const freqs = [784, 1175]; // G5, D6 harmonic
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const delay = idx * 0.018;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(vol / (idx + 1), now + delay + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + delay);
    osc.stop(now + delay + 0.23);
  });
}

/**
 * Triggers the speech bubble sound effect if enabled in settings
 */
export function playSpeechSound(overrideType?: SoundEffectType): void {
  const settings = getSoundSettings();
  if (!settings?.enabled && !overrideType) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const effect = overrideType || settings?.soundEffect || 'soft-pop';
  const volume = settings?.volume ?? 0.5;

  try {
    if (effect === 'typewriter') {
      playTypewriter(ctx, volume);
    } else if (effect === 'soft-chime') {
      playSoftChime(ctx, volume);
    } else {
      playSoftPop(ctx, volume);
    }
  } catch (err) {
    console.debug('Speech sound suppressed or unsupported:', err);
  }
}

/**
 * Pleasant success chime for completing quizzes or finishing dialogues
 */
export function playSuccessChime(): void {
  playCorrectAnswerSound();
}

/**
 * Joyful, sparkling fanfare sound when an answer is CORRECT!
 * Multi-note ascending arpeggio with shimmering chime sparkles.
 */
export function playCorrectAnswerSound(): void {
  const settings = getSoundSettings();
  if (!settings?.enabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const masterVol = (settings?.volume ?? 0.5);

    // Uplifting triumphant progression: C5 -> E5 -> G5 -> B5 -> C6 -> E6 sparkle
    const notes = [
      { freq: 523.25, time: 0.00, dur: 0.22, vol: 0.16 }, // C5
      { freq: 659.25, time: 0.07, dur: 0.24, vol: 0.17 }, // E5
      { freq: 783.99, time: 0.14, dur: 0.28, vol: 0.19 }, // G5
      { freq: 987.77, time: 0.21, dur: 0.32, vol: 0.20 }, // B5
      { freq: 1046.50, time: 0.28, dur: 0.45, vol: 0.22 }, // C6
      { freq: 1318.51, time: 0.35, dur: 0.50, vol: 0.15 }  // E6 sparkle
    ];

    notes.forEach(({ freq, time, dur, vol }) => {
      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Warm lowpass filter to keep chime silky and pleasant
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, now + time);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);

      // Sweet overtone for glitter effect
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2, now + time);

      const computedVol = vol * masterVol;
      gain.gain.setValueAtTime(0.0001, now + time);
      gain.gain.linearRampToValueAtTime(computedVol, now + time + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(filter);
      overtone.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      overtone.start(now + time);
      osc.stop(now + time + dur + 0.02);
      overtone.stop(now + time + dur + 0.02);
    });
  } catch (err) {
    console.debug('Correct answer chime suppressed:', err);
  }
}

/**
 * Playful bounce sound when an answer needs review.
 */
export function playWrongAnswerSound(): void {
  const settings = getSoundSettings();
  if (!settings?.enabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const masterVol = (settings?.volume ?? 0.5);

    // Two friendly, rounded descending bounce tones: 310Hz -> 240Hz, then 220Hz -> 180Hz
    const bounces = [
      { startFreq: 311.13, endFreq: 246.94, time: 0.00, dur: 0.16, vol: 0.20 }, // Eb4 -> B3
      { startFreq: 233.08, endFreq: 174.61, time: 0.14, dur: 0.22, vol: 0.22 }  // Bb3 -> F3
    ];

    bounces.forEach(({ startFreq, endFreq, time, dur, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Lowpass filter to keep sound soft, rounded, and non-jarring
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now + time);

      osc.type = 'sine';
      // Slight playful pitch drop glide ("boing / womp")
      osc.frequency.setValueAtTime(startFreq, now + time);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + time + dur * 0.7);

      const computedVol = vol * masterVol;
      gain.gain.setValueAtTime(0.0001, now + time);
      gain.gain.linearRampToValueAtTime(computedVol, now + time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur + 0.02);
    });
  } catch (err) {
    console.debug('Wrong answer sound suppressed:', err);
  }
}

/**
 * Playful micro-interaction pop/tap (great for avatars, chips, badges)
 */
export function playPlayfulPop(): void {
  const settings = getSoundSettings();
  if (!settings?.enabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const masterVol = (settings?.volume ?? 0.5);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(820, now + 0.04);

    const vol = 0.14 * masterVol;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.065);
  } catch {}
}

/**
 * Play a resonant music-box kalimba chord for milestone moments.
 */
export function playChimeSound(): void {
  const settings = getSoundSettings();
  if (!settings?.enabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const masterVol = (settings?.volume ?? 0.5);

    // Harmonic chord: F4 -> A4 -> C5 -> E5 -> A5
    const chord = [
      { freq: 349.23, time: 0.00, dur: 0.55, vol: 0.18 }, // F4
      { freq: 440.00, time: 0.04, dur: 0.58, vol: 0.20 }, // A4
      { freq: 523.25, time: 0.08, dur: 0.62, vol: 0.22 }, // C5
      { freq: 659.25, time: 0.12, dur: 0.70, vol: 0.24 }, // E5
      { freq: 880.00, time: 0.16, dur: 0.85, vol: 0.18 }  // A5
    ];

    chord.forEach(({ freq, time, dur, vol }) => {
      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Lowpass filter for smooth kalimba timbre
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now + time);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, now + time);

      const computedVol = vol * masterVol;
      gain.gain.setValueAtTime(0.0001, now + time);
      gain.gain.linearRampToValueAtTime(computedVol, now + time + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(filter);
      overtone.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      overtone.start(now + time);
      osc.stop(now + time + dur + 0.03);
      overtone.stop(now + time + dur + 0.03);
    });
  } catch (err) {
    console.debug('Chime suppressed:', err);
  }
}

/**
 * Toggles sound enabled state and persists it
 */
export function toggleSoundEnabled(): SoundSettings {
  const current = getSoundSettings() || DEFAULT_SETTINGS;
  const next: SoundSettings = { ...current, enabled: !current.enabled };
  saveSoundSettings(next);
  return next;
}

/**
 * Backwards-compatible sound controller object
 */
export const sound = {
  get isMuted(): boolean {
    return !getSoundSettings()?.enabled;
  },
  set isMuted(val: boolean) {
    const current = getSoundSettings() || DEFAULT_SETTINGS;
    saveSoundSettings({ ...current, enabled: !val });
  },
  playClick: () => playPlayfulPop(),
  playToggle: () => playPlayfulPop(),
  playSuccess: () => playCorrectAnswerSound(),
  playCorrect: () => playCorrectAnswerSound(),
  playWrong: () => playWrongAnswerSound(),
  playError: () => playWrongAnswerSound(),
  playPop: () => playPlayfulPop(),
  playLevelUp: () => playCorrectAnswerSound(),
  playStep: () => playSpeechSound(),
};

