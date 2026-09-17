import React, { useState } from 'react';
import { StreakData, getWeeklyActivityStats, WeeklyDayActivity } from '../utils/streak';
import { playPlayfulPop } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Trophy,
  Sparkles,
  CheckCircle2,
  Calendar,
  TrendingUp,
  ArrowRight,
  Star,
  Zap,
  Info
} from 'lucide-react';

interface WeeklyActivityChartProps {
  streakData?: StreakData;
  onPracticeClick?: () => void;
  className?: string;
}

export const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({
  streakData,
  onPracticeClick,
  className = ''
}) => {
  const stats = getWeeklyActivityStats(streakData);
  const [activeDay, setActiveDay] = useState<WeeklyDayActivity>(() => {
    // Default to today's entry
    return stats.days.find(d => d.isToday) || stats.days[stats.days.length - 1];
  });
  const [viewMode, setViewMode] = useState<'bars' | 'wave'>('bars');

  const handleSelectDay = (day: WeeklyDayActivity) => {
    setActiveDay(day);
    playPlayfulPop();
  };

  // Generate SVG curve points for the consistency wave
  const wavePoints = stats.days.map((day, idx) => {
    const x = 30 + idx * 70; // 30, 100, 170, 240, 310, 380, 450
    // Invert y: intensity 100 -> y = 25, intensity 0 -> y = 115
    const y = 115 - (day.intensityScore / 100) * 85;
    return { x, y, day };
  });

  const svgPathD = wavePoints.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    const cpY2 = pt.y;
    return `${acc} C ${cpX1},${cpY1} ${cpX2},${cpY2} ${pt.x},${pt.y}`;
  }, '');

  const areaPathD = `${svgPathD} L ${wavePoints[wavePoints.length - 1].x},130 L ${wavePoints[0].x},130 Z`;

  return (
    <div
      id="weekly-activity-consistency-chart"
      className={`w-full rounded-3xl bg-[#FFFDFB] dark:bg-[#18181D] border-2 border-[#FED7AA]/70 dark:border-[#52291B]/80 shadow-lg p-5 sm:p-7 relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Playful Background Decorative Glows */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-gradient-to-br from-[#F97316]/10 to-[#EC4899]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-gradient-to-tr from-[#EC4899]/10 to-[#F97316]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Row: Title, Tag, and View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FCE7F3] dark:border-[#2E1D27] pb-5 mb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFF0E6] to-[#FFF5F7] dark:from-[#2B1B15] dark:to-[#2B1423] border border-[#FED7AA] dark:border-[#52291B] text-xs font-bold text-[#EA580C] dark:text-[#FB923C] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316] animate-pulse" />
              <span>Weekly Consistency Journey</span>
            </span>
            <span className="text-xs font-serif font-bold text-[#22C55E] dark:text-[#4ADE80] bg-[#F0FDF4] dark:bg-[#132B18] border border-[#BBF7D0] dark:border-[#1E4D27] px-2.5 py-0.5 rounded-full">
              {stats.practicedCount} of {stats.weeklyGoal} days target
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-black text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight">
            Your Learning Rhythm & Consistency
          </h2>
          <p className="text-xs font-serif text-[#666] dark:text-[#A1A1AA]">
            {stats.encouragingMessage}
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-[#F5EFE6] dark:bg-[#23232C] border border-[#E8DFC8] dark:border-[#383848] self-start sm:self-center shadow-xs">
          <button
            onClick={() => {
              setViewMode('bars');
              playPlayfulPop();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-serif transition-all cursor-pointer ${
              viewMode === 'bars'
                ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white shadow-xs scale-102'
                : 'text-[#666] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
            }`}
          >
            <span>📊 Bars</span>
          </button>
          <button
            onClick={() => {
              setViewMode('wave');
              playPlayfulPop();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-serif transition-all cursor-pointer ${
              viewMode === 'wave'
                ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white shadow-xs scale-102'
                : 'text-[#666] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
            }`}
          >
            <span>🌊 Wave Trend</span>
          </button>
        </div>
      </div>

      {/* Main Chart Visualization Section */}
      <div className="relative z-10 space-y-6">
        {viewMode === 'bars' ? (
          /* Playful 7-Day Interactive Bar Columns */
          <div className="grid grid-cols-7 gap-2 sm:gap-3.5 pt-4 pb-2 items-end min-h-[170px]">
            {stats.days.map((day) => {
              const isSelected = activeDay.date === day.date;
              return (
                <div
                  key={day.date}
                  onClick={() => handleSelectDay(day)}
                  className="group flex flex-col items-center gap-2 cursor-pointer select-none"
                >
                  {/* Floating Star / Flame Badge for Practiced Days */}
                  <div className="h-6 flex items-center justify-center">
                    {day.isPracticed ? (
                      <motion.div
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: isSelected ? 1.2 : 1, rotate: isSelected ? 0 : -5 }}
                        whileHover={{ scale: 1.25, rotate: 10 }}
                        className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#F97316] to-[#FACC15] flex items-center justify-center text-white shadow-xs"
                        title="Completed practice!"
                      >
                        <Flame className="w-3 h-3 fill-current" />
                      </motion.div>
                    ) : day.isToday ? (
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        className="w-5 h-5 rounded-full bg-[#FFF0E6] dark:bg-[#341F16] border border-[#FED7AA] flex items-center justify-center text-[#EA580C]"
                        title="Today's goal ready!"
                      >
                        <Star className="w-2.5 h-2.5 fill-current" />
                      </motion.div>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E5DDD0] dark:bg-[#33333E]" />
                    )}
                  </div>

                  {/* Vertical Bar Column */}
                  <div className="w-full max-w-[48px] h-28 bg-[#F5ECE1] dark:bg-[#23232C] rounded-2xl p-1 relative flex flex-col justify-end overflow-hidden transition-all duration-300 group-hover:ring-2 group-hover:ring-[#F97316]/50">
                    {day.isToday && (
                      <div className="absolute inset-0 border-2 border-dashed border-[#F97316]/60 rounded-2xl pointer-events-none z-10" />
                    )}

                    {/* Filled progress bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(12, day.intensityScore)}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={`w-full rounded-xl transition-all ${
                        day.isPracticed
                          ? isSelected
                            ? 'bg-gradient-to-t from-[#EC4899] via-[#F97316] to-[#FACC15] shadow-sm'
                            : 'bg-gradient-to-t from-[#F97316] to-[#FB923C]'
                          : day.isToday
                          ? 'bg-[#FED7AA] dark:bg-[#45271D]'
                          : 'bg-[#E3D9CA] dark:bg-[#2E2E3A]'
                      }`}
                    />
                  </div>

                  {/* Day Label & Date Pill */}
                  <div
                    className={`flex flex-col items-center px-1.5 py-1 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#FFF0E6] to-[#FFF5F7] dark:from-[#321C16] dark:to-[#331528] border border-[#FED7AA] dark:border-[#52291B] font-bold text-[#EA580C] dark:text-[#FB923C]'
                        : day.isToday
                        ? 'font-bold text-[#EA580C] dark:text-[#FB923C]'
                        : 'text-[#777] dark:text-[#A1A1AA]'
                    }`}
                  >
                    <span className="text-[11px] font-serif uppercase tracking-wider">
                      {day.dayName}
                    </span>
                    <span className="text-xs font-mono font-bold">
                      {day.dayNumber}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Consistency Wave SVG Chart */
          <div className="w-full h-44 bg-[#FAF4EB] dark:bg-[#1C1C22] rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between border border-[#EFE5D5] dark:border-[#32323E]">
            <svg
              viewBox="0 0 480 140"
              className="w-full h-28 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#EC4899" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="50%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#FACC15" />
                </linearGradient>
              </defs>

              {/* Area fill under wave */}
              <path d={areaPathD} fill="url(#waveGradient)" />

              {/* Smooth curve line */}
              <path
                d={svgPathD}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Interactive nodes along the wave */}
              {wavePoints.map(({ x, y, day }) => {
                const isSelected = activeDay.date === day.date;
                return (
                  <g
                    key={day.date}
                    className="cursor-pointer"
                    onClick={() => handleSelectDay(day)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 8 : day.isPracticed ? 6 : 4}
                      className={`transition-all ${
                        day.isPracticed
                          ? 'fill-[#F97316] stroke-white stroke-2 shadow'
                          : day.isToday
                          ? 'fill-[#FACC15] stroke-[#EA580C] stroke-2'
                          : 'fill-[#D5CABB] stroke-[#EFE5D5] stroke-2'
                      }`}
                    />
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r={12}
                        fill="none"
                        stroke="#EC4899"
                        strokeWidth="2"
                        className="animate-ping opacity-60"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Wave X-Axis Day Markers */}
            <div className="grid grid-cols-7 text-center pt-2 border-t border-[#E8DEC9] dark:border-[#2C2C36]">
              {stats.days.map((day) => (
                <button
                  key={day.date}
                  onClick={() => handleSelectDay(day)}
                  className={`text-xs font-serif transition-colors cursor-pointer ${
                    activeDay.date === day.date
                      ? 'font-bold text-[#EA580C] dark:text-[#FB923C]'
                      : 'text-[#777] dark:text-[#A1A1AA]'
                  }`}
                >
                  <span className="block font-bold">{day.dayName}</span>
                  <span className="text-[10px] font-mono">{day.dayNumber}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Day Micro-Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay.date}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#FFF5F7] via-[#FFFDFB] to-[#FFF7ED] dark:from-[#261520] dark:via-[#1B1B22] dark:to-[#261814] border border-[#FED7AA] dark:border-[#4B2217]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EC4899] text-white flex items-center justify-center shrink-0 shadow-xs font-black text-sm">
                {activeDay.dayShort}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-[#1A1A1A] dark:text-[#F4F4F5]">
                    {activeDay.fullDay}, {activeDay.date}
                  </span>
                  {activeDay.isToday && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EA580C] text-white">
                      Today
                    </span>
                  )}
                </div>
                <p className="text-xs font-serif text-[#666] dark:text-[#A1A1AA]">
                  {activeDay.isPracticed ? (
                    <span className="text-[#16A34A] dark:text-[#4ADE80] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 inline" />
                      Practiced {activeDay.topic || 'Python Topic'} • Daily goal completed!
                    </span>
                  ) : activeDay.isToday ? (
                    <span className="text-[#EA580C] dark:text-[#FB923C] font-semibold">
                      Ready to practice! Complete a short dialogue to lock in today's flame.
                    </span>
                  ) : activeDay.isFuture ? (
                    'Upcoming day on your schedule'
                  ) : (
                    'Rest day — Consistency resumes on active days'
                  )}
                </p>
              </div>
            </div>

            {/* Quick Practice CTA if today not yet completed */}
            {activeDay.isToday && !activeDay.isPracticed && onPracticeClick && (
              <button
                onClick={onPracticeClick}
                className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#EA580C] hover:to-[#DB2777] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
              >
                <span>Practice Today</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Playful Consistency Summary Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Consistency Rate Card */}
          <div className="p-3.5 rounded-2xl bg-[#FAF4EB] dark:bg-[#202028] border border-[#EAE0CE] dark:border-[#353545] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] dark:bg-[#1A3320] text-[#2E7D32] dark:text-[#81C784] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-lg font-black text-[#1A1A1A] dark:text-[#F4F4F5]">
                  {stats.consistencyPercentage}%
                </span>
                <span className="text-[10px] uppercase font-bold text-[#666] dark:text-[#A1A1AA]">
                  Consistency
                </span>
              </div>
              <p className="text-[11px] font-serif text-[#777] dark:text-[#999]">
                {stats.practicedCount} of 7 days active
              </p>
            </div>
          </div>

          {/* Active Streak Card */}
          <div className="p-3.5 rounded-2xl bg-[#FAF4EB] dark:bg-[#202028] border border-[#EAE0CE] dark:border-[#353545] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E6] dark:bg-[#341F16] text-[#EA580C] dark:text-[#FB923C] flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 fill-current animate-bounce" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-lg font-black text-[#EA580C] dark:text-[#FB923C]">
                  {stats.activeStreak} {stats.activeStreak === 1 ? 'Day' : 'Days'}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#666] dark:text-[#A1A1AA]">
                  Current Streak
                </span>
              </div>
              <p className="text-[11px] font-serif text-[#777] dark:text-[#999]">
                {streakData?.todayPracticed ? 'Streak active today!' : 'Complete today to advance'}
              </p>
            </div>
          </div>

          {/* Weekly Goal Trophy Card */}
          <div className="p-3.5 rounded-2xl bg-[#FAF4EB] dark:bg-[#202028] border border-[#EAE0CE] dark:border-[#353545] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5F7] dark:bg-[#321528] text-[#DB2777] dark:text-[#F472B6] flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-lg font-black text-[#1A1A1A] dark:text-[#F4F4F5]">
                  {stats.goalMet ? 'Goal Met! 🎉' : `${stats.practicedCount}/${stats.weeklyGoal} Days`}
                </span>
              </div>
              <p className="text-[11px] font-serif text-[#777] dark:text-[#999]">
                {stats.goalMet
                  ? 'Weekly target unlocked!'
                  : `${stats.weeklyGoal - stats.practicedCount} more to hit weekly goal`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
