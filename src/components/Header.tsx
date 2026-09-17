import React from 'react';
import { Sparkles, BookOpen, Code2, Volume2, VolumeX, Flame, ArrowLeft, Layers } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  storyMode: 'story' | 'technical';
  onToggleMode: () => void;
  onOpenGenerator: () => void;
  activeLessonTitle?: string;
  onBackToHome?: () => void;
  completedCount: number;
  totalLessons: number;
}

export const Header: React.FC<HeaderProps> = ({
  storyMode,
  onToggleMode,
  onOpenGenerator,
  activeLessonTitle,
  onBackToHome,
  completedCount,
  totalLessons
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.isMuted);

  const toggleSound = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    sound.playClick();
  };

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-[#FDFCF6]/95 backdrop-blur-md border-b border-[#E9E5D9] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand or Back */}
        <div className="flex items-center gap-3">
          {activeLessonTitle ? (
            <button
              id="header-back-btn"
              onClick={() => {
                sound.playClick();
                if (onBackToHome) onBackToHome();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] hover:bg-[#E9E5D9]/70 border border-transparent hover:border-[#E9E5D9] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4A373]" />
              <span className="hidden sm:inline">All Stories</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] text-[#D4A373] flex items-center justify-center border border-[#D4A373]/30 shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg font-bold text-[#1A1A1A] tracking-tight">Python Tales</span>
                  <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#E9E5D9] text-[#1A1A1A] border border-[#D4A373]/30">
                    Artisan Storytelling
                  </span>
                </div>
                <p className="text-[11px] text-[#555] hidden md:block italic font-serif">Intuitive mental models before code execution</p>
              </div>
            </div>
          )}

          {activeLessonTitle && (
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#E9E5D9]">
              <span className="text-[10px] font-bold text-[#8C6D4F] uppercase tracking-widest">Story:</span>
              <span className="text-sm font-serif font-bold text-[#1A1A1A] truncate max-w-xs">{activeLessonTitle}</span>
            </div>
          )}
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Switcher: Story Mode vs Technical Mode */}
          <div className="flex items-center bg-[#E9E5D9]/70 p-1 rounded-xl border border-[#E9E5D9]">
            <button
              id="mode-story-btn"
              onClick={() => {
                if (storyMode !== 'story') {
                  sound.playToggle();
                  onToggleMode();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                storyMode === 'story'
                  ? 'bg-[#FDFCF6] text-[#1A1A1A] shadow-xs border border-[#E9E5D9]'
                  : 'text-[#666] hover:text-[#1A1A1A]'
              }`}
              title="Story Mode: Intuitive real-world narrative & metaphors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Story Mode</span>
            </button>
            <button
              id="mode-technical-btn"
              onClick={() => {
                if (storyMode !== 'technical') {
                  sound.playToggle();
                  onToggleMode();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                storyMode === 'technical'
                  ? 'bg-[#1A1A1A] text-[#FDFCF6] shadow-xs'
                  : 'text-[#666] hover:text-[#1A1A1A]'
              }`}
              title="Technical Mode: Formal Python syntax & architecture"
            >
              <Code2 className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Technical</span>
            </button>
          </div>

          {/* AI Generator CTA */}
          <button
            id="header-ai-generate-btn"
            onClick={() => {
              sound.playClick();
              onOpenGenerator();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#D4A373] text-[#FDFCF6] hover:text-[#1A1A1A] text-xs font-semibold border border-[#1A1A1A] shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            <span className="hidden sm:inline">AI Story Studio</span>
          </button>

          {/* Progress / Streak */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[#E9E5D9]">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#1A1A1A] px-2.5 py-1 bg-[#F7F5EE] rounded-lg border border-[#E9E5D9]">
              <Layers className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{completedCount}/{totalLessons} Mastered</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C6D4F] px-2.5 py-1 bg-[#FDFCF6] rounded-lg border border-[#D4A373]/40">
              <Flame className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>1 Day Streak</span>
            </div>
          </div>

          {/* Sound Mute Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="p-2 rounded-xl text-[#666] hover:text-[#1A1A1A] hover:bg-[#E9E5D9]/60 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#D4A373]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
