import React from 'react';
import { ConversationPhase, ThemeMode } from '../types';
import { StreakData } from '../utils/streak';
import { StreakBadge } from './StreakBadge';
import { Sparkles, ChevronDown, BookOpen, Home, Settings, Volume2, VolumeX, Moon, Sun, Bug, Zap, Layers, Grid3X3 } from 'lucide-react';

export type AppView = 'landing' | 'conversation' | 'bug-hunt' | 'performance-duel' | 'flip-cards' | 'inspector';

interface ConversationHeaderProps {
  currentTopicTitle: string;
  currentPhase: ConversationPhase;
  onOpenTopicPicker: () => void;
  onOpenGenerator: () => void;
  onGoHome?: () => void;
  onOpenSettings?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
  streakData?: StreakData;
  onPracticeClick?: () => void;
  currentView?: AppView;
  onNavigateView?: (view: AppView) => void;
}

const PHASES: { key: ConversationPhase; label: string }[] = [
  { key: 'problem', label: 'Problem' },
  { key: 'discovery', label: 'Discovery' },
  { key: 'explanation', label: 'Explanation' },
  { key: 'code', label: 'Code' },
  { key: 'practice', label: 'Practice' }
];

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  currentTopicTitle,
  currentPhase,
  onOpenTopicPicker,
  onOpenGenerator,
  onGoHome,
  onOpenSettings,
  soundEnabled = true,
  onToggleSound,
  themeMode,
  onToggleTheme,
  streakData,
  onPracticeClick,
  currentView = 'landing',
  onNavigateView
}) => {
  const currentPhaseIndex = PHASES.findIndex(p => p.key === currentPhase);
  const isDark = themeMode === 'dark';

  return (
    <header className="sticky top-0 z-30 bg-[#FDFCF7]/95 dark:bg-[#121214]/95 backdrop-blur-md border-b border-[#EAE6DA] dark:border-[#262630] px-3 sm:px-6 py-2.5 sm:py-3 transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: App Title, Home Button & Topic Picker Button */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          <div
            onClick={() => onNavigateView ? onNavigateView('landing') : onGoHome?.()}
            className="flex items-center gap-2 cursor-pointer select-none group"
            title="Return to Home Study Desk"
          >
            <span className="text-base group-hover:rotate-12 transition-transform">☕</span>
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight">
                Learn Python
              </h1>
              <span className="text-[10px] font-sans font-semibold text-[#EA580C] dark:text-[#FB923C] bg-[#FEF3C7] dark:bg-[#382618] px-1.5 py-0.5 rounded-full border border-[#FDE68A] dark:border-[#52291B] hidden sm:inline">
                with Ayushi & Ayush 🌸
              </span>
            </div>
          </div>

          {currentView === 'conversation' ? (
            /* Topic Dropdown Trigger during conversation */
            <button
              onClick={onOpenTopicPicker}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FFF9F5] dark:bg-[#1C1613] hover:bg-[#FFF0E6] dark:hover:bg-[#2A1E18] border border-[#FED7AA] dark:border-[#EA580C]/40 text-xs font-semibold text-[#2C2C2C] dark:text-[#F4F4F5] transition-colors cursor-pointer ml-1"
              title="Choose Python topic"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#EA580C] dark:text-[#FB923C]" />
              <span className="max-w-[100px] sm:max-w-[150px] truncate">{currentTopicTitle}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#888] dark:text-[#A1A1AA]" />
            </button>
          ) : (
            /* Quick return home button if inside a lab mode */
            currentView !== 'landing' && (
              <button
                onClick={() => onNavigateView ? onNavigateView('landing') : onGoHome?.()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#F2ECE1] dark:bg-[#1E1E24] hover:bg-[#E8DFC9] dark:hover:bg-[#282832] text-[#1A1A1A] dark:text-[#F4F4F5] text-xs font-semibold font-serif border border-[#DDD7C8] dark:border-[#32323E] transition-colors cursor-pointer"
                title="Return to Home & Topics"
              >
                <Home className="w-3 h-3 text-[#EA580C] dark:text-[#FB923C]" />
                <span className="text-[11px]">Home</span>
              </button>
            )
          )}
        </div>

        {/* Center: When in conversation, show Phase Progress; otherwise show Mode Navigation Pills */}
        {currentView === 'conversation' ? (
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-serif text-[#666] dark:text-[#A1A1AA]">
            {PHASES.map((p, idx) => {
              const isActive = idx === currentPhaseIndex;
              const isCompleted = idx < currentPhaseIndex;

              return (
                <React.Fragment key={p.key}>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full transition-all ${
                        isActive
                          ? 'bg-[#EC4899] ring-4 ring-[#EC4899]/30 scale-125'
                          : isCompleted
                          ? 'bg-[#F97316]'
                          : 'bg-[#DDD7C8] dark:bg-[#2E2E38]'
                      }`}
                    />
                    <span
                      className={`text-[11px] sm:text-xs tracking-wide ${
                        isActive
                          ? 'font-bold text-[#EC4899] dark:text-[#F472B6]'
                          : isCompleted
                          ? 'text-[#C2410C] dark:text-[#FB923C]'
                          : 'text-[#999] dark:text-[#71717A] hidden sm:inline'
                      }`}
                    >
                      {p.label}
                    </span>
                  </div>
                  {idx < PHASES.length - 1 && (
                    <span className="text-[#CCC] dark:text-[#444] text-[10px] select-none">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          /* Top-level Hub Navigation Pills */
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 max-w-full">
            {[
              { id: 'landing', label: 'Lessons', icon: BookOpen },
              { id: 'bug-hunt', label: 'Bug Hunt', icon: Bug },
              { id: 'performance-duel', label: 'Speed Duel', icon: Zap },
              { id: 'flip-cards', label: 'Flip Cards', icon: Layers },
              { id: 'inspector', label: 'Inspector', icon: Grid3X3 }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigateView && onNavigateView(tab.id as AppView)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer shrink-0 border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white border-transparent shadow-xs'
                      : 'bg-[#FFFDFB] dark:bg-[#1C1C22] text-[#666] dark:text-[#A1A1AA] border-[#E8E2D4] dark:border-[#2E2E38] hover:border-[#EA580C] hover:text-[#EA580C] dark:hover:text-[#FB923C]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#EA580C] dark:text-[#FB923C]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Right: Streak Tracker, Dark Mode Toggle, Sound Quick Toggle, Settings, AI Topic Generator */}
        <div className="flex items-center gap-2">
          {/* Quick Streak Badge */}
          {streakData && (
            <StreakBadge
              streakData={streakData}
              compact={true}
              onPracticeClick={onPracticeClick}
            />
          )}

          {/* Theme Quick Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#1E1E24] text-[#FB923C] border-[#32323E] hover:bg-[#282832]'
                  : 'bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA] hover:bg-[#FFEDD5]'
              }`}
              title={isDark ? "Switch to Editorial Warm theme" : "Switch to Deep Charcoal dark mode"}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}

          {onToggleSound && (
            <button
              onClick={onToggleSound}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-[#FFF7ED] dark:bg-[#261B16] text-[#EA580C] dark:text-[#FB923C] border-[#FED7AA] dark:border-[#52291B] hover:bg-[#FFEDD5] dark:hover:bg-[#322019]'
                  : 'bg-[#F2ECE1] dark:bg-[#1E1E24] text-[#999] dark:text-[#71717A] border-[#DDD7C8] dark:border-[#32323E] hover:text-[#555] dark:hover:text-[#AAA]'
              }`}
              title={soundEnabled ? "Sound effects enabled (Click to mute)" : "Sound effects muted (Click to unmute)"}
              aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FDF2F8] dark:bg-[#251520] hover:bg-[#FCE7F3] dark:hover:bg-[#32172A] text-[#DB2777] dark:text-[#F472B6] border border-[#FBCFE8] dark:border-[#521B3A] text-xs font-semibold font-serif transition-colors cursor-pointer"
              title="Open Settings & Theme"
            >
              <Settings className="w-3.5 h-3.5 text-[#EC4899] dark:text-[#F472B6]" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          )}

          <button
            onClick={onOpenGenerator}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#EA580C] hover:to-[#DB2777] text-white border-0 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>New Topic</span>
          </button>
        </div>
      </div>
    </header>
  );
};


