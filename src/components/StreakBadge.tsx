import React, { useState, useRef, useEffect } from 'react';
import { StreakData, getRecentDaysStatus } from '../utils/streak';
import { Flame, Check, Calendar, Sparkles, ChevronRight, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StreakBadgeProps {
  streakData: StreakData;
  onPracticeClick?: () => void;
  className?: string;
  compact?: boolean;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  streakData,
  onPracticeClick,
  className = '',
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const { streakDays, todayPracticed, practiceHistory, lastTopicPracticed, totalPracticedDays } = streakData;
  const recentDays = getRecentDaysStatus(practiceHistory);

  if (compact) {
    return (
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-serif font-bold transition-all cursor-pointer shadow-2xs ${
            todayPracticed
              ? 'bg-gradient-to-r from-orange-50 to-pink-50 dark:from-[#2A1713] dark:to-[#331424] text-[#EA580C] dark:text-[#FB923C] border-orange-200 dark:border-[#52291B] hover:border-orange-300'
              : 'bg-[#F2ECE1] dark:bg-[#1E1E24] text-[#777] dark:text-[#A1A1AA] border-[#DDD7C8] dark:border-[#32323E] hover:text-[#EA580C]'
          } ${className}`}
          title={`${streakDays} Day Practice Streak • Click for streak details`}
          aria-expanded={isOpen}
          aria-label="View streak details"
        >
          <Flame
            className={`w-3.5 h-3.5 ${
              todayPracticed
                ? 'fill-[#F97316] text-[#EC4899] animate-pulse'
                : 'text-[#999] dark:text-[#777]'
            }`}
          />
          <span className="font-mono">{streakDays}</span>
          <span className="hidden sm:inline font-sans text-[11px] font-semibold">
            {streakDays === 1 ? 'day' : 'days'}
          </span>
        </button>

        {/* Dropdown Modal/Card */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#FDFCF7] dark:bg-[#18181D] border border-[#E5DFD0] dark:border-[#2D2D38] shadow-2xl p-4 z-50 text-left font-sans"
            >
              <StreakCardContent
                streakData={streakData}
                recentDays={recentDays}
                onClose={() => setIsOpen(false)}
                onPracticeClick={() => {
                  setIsOpen(false);
                  onPracticeClick?.();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full Landing Page Header Badge
  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        id="landing-streak-badge"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer shadow-xs ${
          todayPracticed
            ? 'bg-gradient-to-r from-orange-50/90 via-[#FFF8F3] to-pink-50/90 dark:from-[#261713] dark:via-[#1F171B] dark:to-[#2B1423] border-[#FED7AA] dark:border-[#52291B] hover:border-[#F97316] text-[#1A1A1A] dark:text-[#F4F4F5]'
            : 'bg-[#FAF7F0] dark:bg-[#1C1C22] border-[#E2DAC9] dark:border-[#2D2D38] hover:border-[#F97316] text-[#1A1A1A] dark:text-[#F4F4F5]'
        }`}
        aria-expanded={isOpen}
        aria-label="Daily Python practice streak details"
      >
        {/* Flame Icon with Gradient Glow */}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
            todayPracticed
              ? 'bg-gradient-to-br from-[#F97316] to-[#EC4899] text-white shadow-2xs'
              : 'bg-[#EAE4D5] dark:bg-[#282832] text-[#888] dark:text-[#999]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 fill-current" />
        </div>

        {/* Streak Number and Label */}
        <div className="flex items-center gap-1.5 text-xs font-serif font-bold">
          <span className="font-mono text-sm font-extrabold text-[#EA580C] dark:text-[#FB923C]">
            {streakDays}
          </span>
          <span className="text-[#1A1A1A] dark:text-[#F4F4F5]">
            {streakDays === 1 ? 'Day Streak' : 'Days Streak'}
          </span>
        </div>

        {/* Status Indicator */}
        <span
          className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full ${
            todayPracticed
              ? 'bg-[#ECFDF5] dark:bg-[#064E3B]/40 text-[#059669] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#065F46]'
              : 'bg-[#FFFBEB] dark:bg-[#451A03]/30 text-[#D97706] dark:text-[#FBBF24] border border-[#FDE68A] dark:border-[#78350F]'
          }`}
        >
          {todayPracticed ? (
            <>
              <Check className="w-2.5 h-2.5 stroke-[3]" />
              <span>Practiced Today</span>
            </>
          ) : (
            <span>Practice today</span>
          )}
        </span>
      </button>

      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 sm:w-88 rounded-3xl bg-[#FDFCF7] dark:bg-[#16161A] border border-[#E5DFD0] dark:border-[#2D2D38] shadow-2xl p-5 z-50 text-left"
          >
            <StreakCardContent
              streakData={streakData}
              recentDays={recentDays}
              onClose={() => setIsOpen(false)}
              onPracticeClick={() => {
                setIsOpen(false);
                onPracticeClick?.();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface StreakCardContentProps {
  streakData: StreakData;
  recentDays: ReturnType<typeof getRecentDaysStatus>;
  onClose: () => void;
  onPracticeClick: () => void;
}

const StreakCardContent: React.FC<StreakCardContentProps> = ({
  streakData,
  recentDays,
  onClose,
  onPracticeClick
}) => {
  const { streakDays, todayPracticed, lastTopicPracticed, totalPracticedDays } = streakData;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EAE4D5] dark:border-[#262630] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EC4899] text-white flex items-center justify-center shadow-xs">
            <Flame className="w-4 h-4 fill-white" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#1A1A1A] dark:text-[#F4F4F5]">
              Python Practice Streak
            </h4>
            <p className="text-[11px] text-[#777] dark:text-[#A1A1AA] font-serif">
              Consecutive days learning Python
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-[#888] hover:text-[#1A1A1A] dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Stats Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-50/70 via-white to-pink-50/70 dark:from-[#261713] dark:via-[#1A1A22] dark:to-[#2C1424] border border-[#FED7AA]/70 dark:border-[#52291B] flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-extrabold text-[#EA580C] dark:text-[#FB923C]">
              {streakDays}
            </span>
            <span className="font-serif font-bold text-sm text-[#1A1A1A] dark:text-[#F4F4F5]">
              {streakDays === 1 ? 'Day' : 'Days'}
            </span>
          </div>
          <p className="text-xs font-serif text-[#666] dark:text-[#A1A1AA]">
            {todayPracticed
              ? 'Great job! You kept your streak burning today.'
              : 'Complete a conversation turn today to keep your streak!'}
          </p>
        </div>

        <div className="text-right pl-3 border-l border-[#EAE4D5] dark:border-[#2E2E38]">
          <span className="block text-[10px] uppercase font-bold tracking-wider text-[#8C6D4F] dark:text-[#FB923C]">
            Total Days
          </span>
          <span className="font-mono text-base font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
            {totalPracticedDays}
          </span>
        </div>
      </div>

      {/* 7-Day Activity Calendar Matrix */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D4F] dark:text-[#FB923C] flex items-center gap-1 font-serif">
            <Calendar className="w-3 h-3" />
            <span>Past 7 Days</span>
          </span>
          {lastTopicPracticed && (
            <span className="text-[10px] text-[#888] dark:text-[#A1A1AA] font-mono">
              Last: {lastTopicPracticed}
            </span>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {recentDays.map((d) => (
            <div
              key={d.date}
              className={`flex flex-col items-center py-2 rounded-xl border text-center transition-all ${
                d.isPracticed
                  ? 'bg-gradient-to-b from-orange-100/70 to-pink-100/70 dark:from-[#3D1A10] dark:to-[#40122B] border-[#F97316] text-[#EA580C] dark:text-[#FB923C]'
                  : d.isToday
                  ? 'bg-[#FFF9F5] dark:bg-[#1E1E24] border-dashed border-[#F97316]/70 text-[#999]'
                  : 'bg-[#F9F6F0] dark:bg-[#1C1C22] border-[#E8E2D4] dark:border-[#2D2D38] text-[#999] dark:text-[#666]'
              }`}
            >
              <span className="text-[10px] font-medium uppercase">{d.dayShort}</span>
              <div className="my-1">
                {d.isPracticed ? (
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white flex items-center justify-center shadow-2xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : (
                  <span className="text-xs font-mono font-semibold">{d.dayNumber}</span>
                )}
              </div>
              <span className="text-[9px] font-serif opacity-75">
                {d.isToday ? 'Today' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Dialogue Tip from Characters */}
      <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#1C1C22] border border-[#EAE4D5] dark:border-[#262630] flex items-start gap-2.5 text-xs font-serif text-[#666] dark:text-[#A1A1AA]">
        <Sparkles className="w-4 h-4 text-[#EC4899] shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong className="text-[#EC4899]">Ayushi</strong>: &ldquo;Practicing one library dialogue a day keeps the syntax fresh in mind!&rdquo;
        </p>
      </div>

      {/* Action CTA */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onPracticeClick}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#EA580C] hover:to-[#DB2777] text-white text-xs font-bold font-serif shadow-md transition-all cursor-pointer active:scale-98"
        >
          <span>{todayPracticed ? 'Practice Another Topic' : 'Practice Today to Keep Streak'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
