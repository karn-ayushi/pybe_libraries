import React, { useState } from 'react';
import { SoundSettings, SoundEffectType, ThemeMode } from '../types';
import { saveSoundSettings, playSpeechSound, getSoundSettings, DEFAULT_SETTINGS } from '../utils/audio';
import { getInitialTheme, applyTheme, toggleThemeMode } from '../utils/theme';
import {
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Sliders,
  Check,
  Music,
  Palette,
  Play,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: SoundSettings;
  onUpdateSettings?: (newSettings: SoundSettings) => void;
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
}

const SOUND_EFFECT_OPTIONS: {
  id: SoundEffectType;
  title: string;
  description: string;
  iconName: string;
}[] = [
  {
    id: 'soft-pop',
    title: 'Soft Pop',
    description: 'A soft, organic wooden bubble pop when speech appears',
    iconName: '🫧'
  },
  {
    id: 'typewriter',
    title: 'Typewriter Click',
    description: 'A delicate tactile vintage typewriter mechanical key stroke',
    iconName: '⌨️'
  },
  {
    id: 'soft-chime',
    title: 'Soft Chime',
    description: 'A clear harmonic chime bell tone',
    iconName: '🔔'
  }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  themeMode: propThemeMode,
  onToggleTheme: propOnToggleTheme
}) => {
  const [currentSettings, setCurrentSettings] = useState<SoundSettings>(() => settings || getSoundSettings());
  const [localTheme, setLocalTheme] = useState<ThemeMode>(() => propThemeMode || getInitialTheme());

  // Sync when prop changes or modal opens
  React.useEffect(() => {
    if (settings) {
      setCurrentSettings(settings);
    } else {
      setCurrentSettings(getSoundSettings());
    }
    if (propThemeMode) {
      setLocalTheme(propThemeMode);
    } else {
      setLocalTheme(getInitialTheme());
    }
  }, [settings, propThemeMode, isOpen]);

  if (!isOpen) return null;

  const safeSettings = currentSettings || DEFAULT_SETTINGS;
  const isSoundEnabled = Boolean(safeSettings.enabled);
  const activeEffect = safeSettings.soundEffect || 'soft-pop';
  const activeVolume = safeSettings.volume ?? 0.5;
  const isDark = localTheme === 'dark';

  const handleSelectTheme = (newTheme: ThemeMode) => {
    setLocalTheme(newTheme);
    applyTheme(newTheme);
    if (propOnToggleTheme && newTheme !== localTheme) {
      propOnToggleTheme();
    }
    if (isSoundEnabled) {
      playSpeechSound(activeEffect);
    }
  };

  const handleToggleThemeSwitch = () => {
    const nextTheme: ThemeMode = isDark ? 'light' : 'dark';
    handleSelectTheme(nextTheme);
  };

  const handleToggleEnabled = () => {
    const updated: SoundSettings = {
      ...safeSettings,
      enabled: !isSoundEnabled
    };
    setCurrentSettings(updated);
    saveSoundSettings(updated);
    onUpdateSettings?.(updated);
    if (updated.enabled) {
      playSpeechSound(updated.soundEffect);
    }
  };

  const handleSelectEffect = (effect: SoundEffectType) => {
    const updated: SoundSettings = {
      ...safeSettings,
      soundEffect: effect
    };
    setCurrentSettings(updated);
    saveSoundSettings(updated);
    onUpdateSettings?.(updated);
    // Instant preview sound
    playSpeechSound(effect);
  };

  const handleChangeVolume = (vol: number) => {
    const updated: SoundSettings = {
      ...safeSettings,
      volume: vol
    };
    setCurrentSettings(updated);
    saveSoundSettings(updated);
    onUpdateSettings?.(updated);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
    >
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-lg bg-[#FAF7F0] dark:bg-[#16161A] border border-[#E2DAC9] dark:border-[#2D2D38] text-[#1A1A1A] dark:text-[#F4F4F5] rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden z-10 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#EAE4D5] dark:border-[#2A2A34] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EC4899] text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 id="settings-title" className="font-serif text-xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                Settings & Appearance
              </h2>
              <p className="text-xs text-[#666] dark:text-[#A1A1AA] font-serif">
                Configure theme palette and dialogue audio feedback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#777] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#EAE4D5] dark:hover:bg-[#25252E] transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Global Theme & Dark Mode Toggle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-[#2F1C16] text-[#EA580C] dark:text-[#FB923C] flex items-center justify-center">
                {isDark ? <Moon className="w-4 h-4 text-[#FB923C]" /> : <Sun className="w-4 h-4 text-[#EA580C]" />}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D4F] dark:text-[#FB923C]">
                  Display Theme
                </span>
                <p className="text-xs text-[#666] dark:text-[#A1A1AA] font-serif">
                  {isDark ? 'Deep Charcoal dark mode active' : 'Editorial Warm light mode active'}
                </p>
              </div>
            </div>

            {/* Quick Switch Button */}
            <button
              id="settings-dark-mode-switch"
              onClick={handleToggleThemeSwitch}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isDark
                  ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899]'
                  : 'bg-[#CCC5B8]'
              }`}
              role="switch"
              aria-checked={isDark}
              aria-label="Toggle dark mode"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isDark ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Theme Mode Cards: Light vs Deep Charcoal */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Editorial Warm (Light) */}
            <button
              type="button"
              onClick={() => handleSelectTheme('light')}
              className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                !isDark
                  ? 'bg-[#FFFDFB] border-[#F97316] ring-2 ring-[#F97316]/35 shadow-xs'
                  : 'bg-[#1E1E24] hover:bg-[#25252E] border-[#2E2E38]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-[#FAF4EB] text-[#EA580C] flex items-center justify-center border border-[#E8DCCB]">
                  <Sun className="w-3.5 h-3.5" />
                </div>
                {!isDark && (
                  <span className="w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] dark:text-[#F4F4F5]">
                Editorial Warm
              </p>
              <p className="text-[11px] text-[#777] dark:text-[#999] font-serif leading-tight mt-0.5">
                Ivory paper canvas
              </p>
              <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#EDE6D8] dark:border-[#32323E]">
                <span className="w-2 h-2 rounded-full bg-[#FDFCF7] border border-[#DDD]" />
                <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
                <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                <span className="text-[10px] text-[#888] font-mono ml-auto">#FDFCF7</span>
              </div>
            </button>

            {/* Deep Charcoal (Dark) */}
            <button
              type="button"
              id="theme-deep-charcoal-button"
              onClick={() => handleSelectTheme('dark')}
              className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                isDark
                  ? 'bg-[#18181D] border-[#EC4899] ring-2 ring-[#EC4899]/35 shadow-xs'
                  : 'bg-[#FDFCF7] hover:bg-[#F2ECE1] border-[#E2DAC9]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-[#271E24] text-[#F472B6] flex items-center justify-center border border-[#4A2536]">
                  <Moon className="w-3.5 h-3.5" />
                </div>
                {isDark && (
                  <span className="w-5 h-5 rounded-full bg-[#EC4899] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] dark:text-[#F4F4F5]">
                Deep Charcoal
              </p>
              <p className="text-[11px] text-[#777] dark:text-[#A1A1AA] font-serif leading-tight mt-0.5">
                Obsidian dark theme
              </p>
              <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#EDE6D8] dark:border-[#32323E]">
                <span className="w-2 h-2 rounded-full bg-[#121214] border border-[#444]" />
                <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
                <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                <span className="text-[10px] text-[#888] font-mono ml-auto">#121214</span>
              </div>
            </button>
          </div>

          {/* Accent Palette Showcase (Preserved Orange & Pink) */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-[#F97316]/5 to-pink-500/10 border border-orange-500/20 dark:border-orange-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#EA580C] dark:text-[#FB923C]">
                <Palette className="w-3.5 h-3.5 text-[#EC4899]" />
                <span>Protected Accents</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/70 dark:bg-[#1E1E24] text-[#C2410C] dark:text-[#F472B6] border border-orange-200 dark:border-pink-900/50 font-bold">
                Orange & Pink Maintained
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-serif">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-[#1E1E24] border border-pink-200 dark:border-[#4D1D36]">
                <span className="w-3 h-3 rounded-full bg-[#EC4899] shadow-2xs shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold text-[#DB2777] dark:text-[#F472B6] block truncate">Ayushi Pink</span>
                  <p className="text-[10px] text-[#888] dark:text-[#A1A1AA] truncate">Rose Blossom</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-[#1E1E24] border border-orange-200 dark:border-[#4E2412]">
                <span className="w-3 h-3 rounded-full bg-[#F97316] shadow-2xs shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold text-[#EA580C] dark:text-[#FB923C] block truncate">Ayush Orange</span>
                  <p className="text-[10px] text-[#888] dark:text-[#A1A1AA] truncate">Sunset Amber</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Sound Effects Toggle */}
        <div className="space-y-4 pt-2 border-t border-[#EAE4D5] dark:border-[#2A2A34]">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FDFCF7] dark:bg-[#1E1E24] border border-[#E6E0D2] dark:border-[#2E2E38] shadow-2xs">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isSoundEnabled
                    ? 'bg-gradient-to-br from-orange-100 to-pink-100 text-[#EC4899] border border-[#FED7AA]'
                    : 'bg-[#EEE8DB] dark:bg-[#282832] text-[#999]'
                }`}
              >
                {isSoundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#EA580C]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#888]" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold font-serif text-[#1A1A1A] dark:text-[#F4F4F5]">
                  Speech Bubble Sound Effects
                </p>
                <p className="text-xs text-[#666] dark:text-[#A1A1AA] font-serif">
                  Subtle, non-intrusive sound as each dialogue turn appears
                </p>
              </div>
            </div>

            {/* Switch button */}
            <button
              onClick={handleToggleEnabled}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isSoundEnabled
                  ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899]'
                  : 'bg-[#CCC5B8] dark:bg-[#3D3D48]'
              }`}
              role="switch"
              aria-checked={isSoundEnabled}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isSoundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Style Picker (Enabled when sound is ON) */}
          <AnimatePresence>
            {isSoundEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 overflow-hidden pt-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D4F] dark:text-[#FB923C]">
                    Sound Style
                  </span>
                  <span className="text-[11px] text-[#777] dark:text-[#A1A1AA] font-serif">
                    Click to test sound
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {SOUND_EFFECT_OPTIONS.map((opt) => {
                    const isSelected = activeEffect === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectEffect(opt.id)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-orange-50/70 to-pink-50/70 dark:from-[#2F1C16] dark:to-[#381527] border-[#F97316] ring-1 ring-[#F97316]/50 shadow-xs'
                            : 'bg-[#FDFCF7] dark:bg-[#1E1E24] hover:bg-[#F4EFE6] dark:hover:bg-[#25252E] border-[#E5DFD0] dark:border-[#2E2E38]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl select-none">{opt.iconName}</span>
                          <div>
                            <p className="text-xs sm:text-sm font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] flex items-center gap-1.5">
                              <span>{opt.title}</span>
                              {isSelected && (
                                <span className="text-[10px] font-mono font-bold text-[#EC4899] bg-pink-100 dark:bg-[#4D1532] px-1.5 py-0.5 rounded">
                                  Active
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-[#666] dark:text-[#A1A1AA] font-serif">
                              {opt.description}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectEffect(opt.id);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/80 dark:bg-[#2A2A34] hover:bg-white dark:hover:bg-[#323240] text-[#EA580C] hover:text-[#EC4899] dark:text-[#FB923C] text-xs font-serif font-bold border border-[#E8DFC9] dark:border-[#383848] transition-all shadow-2xs cursor-pointer active:scale-95"
                          title="Preview sound effect"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Test</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Volume Level */}
                <div className="p-3.5 rounded-2xl bg-[#FDFCF7] dark:bg-[#1E1E24] border border-[#E6E0D2] dark:border-[#2E2E38] space-y-2 mt-2">
                  <div className="flex items-center justify-between text-xs font-serif">
                    <span className="font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">Sound Volume</span>
                    <span className="text-[#8C6D4F] dark:text-[#FB923C] font-mono font-bold">
                      {Math.round(activeVolume * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[0.25, 0.5, 0.75, 1.0].map((level) => {
                      const isActive = activeVolume === level;
                      const labels: Record<number, string> = {
                        0.25: 'Soft',
                        0.5: 'Balanced',
                        0.75: 'Crisp',
                        1.0: 'Full'
                      };
                      return (
                        <button
                          key={level}
                          onClick={() => {
                            handleChangeVolume(level);
                            playSpeechSound(activeEffect);
                          }}
                          className={`flex-1 py-1 px-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white shadow-xs'
                              : 'bg-[#F2ECE1] dark:bg-[#282832] hover:bg-[#EAE4D5] dark:hover:bg-[#32323E] text-[#555] dark:text-[#AAA]'
                          }`}
                        >
                          {labels[level]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Done button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#EA580C] hover:to-[#DB2777] text-white font-serif font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-98"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};

