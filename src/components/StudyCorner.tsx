import React, { useState } from 'react';
import { CharacterAvatar } from './CharacterAvatar';
import { Heart, Coffee, Sparkles, RefreshCw } from 'lucide-react';
import { playChimeSound, playPlayfulPop } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';

interface StudyNote {
  id: string;
  author: 'Ayushi' | 'Ayush' | 'Both';
  avatar: 'ayushi' | 'ayush';
  tag: string;
  text: string;
  subtext: string;
  teaIcon?: string;
}

const STUDY_NOTES: StudyNote[] = [
  {
    id: 'traceback',
    author: 'Ayush',
    avatar: 'ayush',
    tag: 'Python Tip ☕',
    text: 'When Python gives you a 40-line traceback, scan the very bottom line first. That is where the actual error type and explanation live—the rest is just the stack trace.',
    subtext: 'Senior engineers see tracebacks all day. Read bottom-to-top to spot the culprit immediately.'
  },
  {
    id: 'courage',
    author: 'Ayushi',
    avatar: 'ayushi',
    tag: 'From Experience 🌸',
    text: 'Whenever code throws an exception, treat it like an interactive hint rather than a setback. In Python, errors point straight to the line that needs a closer look.',
    subtext: 'Every solid developer built their intuition by debugging unexpected errors.'
  },
  {
    id: 'pace',
    author: 'Both',
    avatar: 'ayushi',
    tag: 'Study Pacing ⏱️',
    text: 'You do not need to memorize every Pandas method or PyTorch parameter at once. Understanding how data flows through one single function provides the intuition for all the others.',
    subtext: 'Focus on one concrete concept at a time and run small experiments in code.'
  },
  {
    id: 'intuition',
    author: 'Ayush',
    avatar: 'ayush',
    tag: 'Engineering Insight 💡',
    text: 'Libraries like NumPy and Polars are fast because of memory layout, not magic. Once you picture how bytes sit next to each other in RAM, vectorized code makes complete sense.',
    subtext: 'Intuition for data structures matters much more than memorizing syntax.'
  },
  {
    id: 'small_wins',
    author: 'Ayushi',
    avatar: 'ayushi',
    tag: 'Quick Wins 🚀',
    text: 'Got your first DataFrame filtered properly or inspected a tensor shape? That is real milestone progress. Real development is made up of these exact small wins chained together.',
    subtext: 'Inspect your variables often and test your hypotheses interactively.'
  }
];

type Mood = 'overwhelmed' | 'curious' | 'relaxed' | 'stuck';

interface MoodResponse {
  speaker: string;
  avatar: 'ayushi' | 'ayush';
  quote: string;
  suggestion: string;
}

const MOOD_RESPONSES: Record<Mood, MoodResponse> = {
  overwhelmed: {
    speaker: 'Ayush',
    avatar: 'ayush',
    quote: 'When data libraries feel huge, pause. We only need a handful of core patterns to solve 95% of real tasks. Let’s tackle one small part at a time.',
    suggestion: 'Try our "Mental Model Flip Cards" for a quick glance at the core concepts.'
  },
  curious: {
    speaker: 'Ayushi',
    avatar: 'ayushi',
    quote: 'Awesome! We were just testing how NumPy runs hundreds of times faster than Python loops. Jump into the code and see it in action!',
    suggestion: 'Check out "Vectorized vs Loops" to run the live comparison.'
  },
  relaxed: {
    speaker: 'Ayushi & Ayush',
    avatar: 'ayushi',
    quote: 'Perfect! We have practical dialogue walkthroughs ready. Pick any library conversation to read through real code discussions.',
    suggestion: 'Explore the Pandas or Seaborn dialogue for real-world scenarios.'
  },
  stuck: {
    speaker: 'Ayushi',
    avatar: 'ayushi',
    quote: 'We have all been there! Debugging SettingWithCopyWarning or tensor dimension mismatches is part of the process. Let’s inspect the data step by step.',
    suggestion: 'Check the "Bug Diagnostic Lab" to troubleshoot common issues.'
  }
};

const CHEERS_STORAGE_KEY = 'pythontales_cheers_count_v1';

export const StudyCorner: React.FC = () => {
  const [noteIndex, setNoteIndex] = useState(0);
  const [activeMood, setActiveMood] = useState<Mood | null>(null);
  const [cheersCount, setCheersCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(CHEERS_STORAGE_KEY);
      return saved ? parseInt(saved, 10) : 12;
    } catch {
      return 12;
    }
  });
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; x: number }[]>([]);
  const [showCheerToast, setShowCheerToast] = useState(false);

  const currentNote = STUDY_NOTES[noteIndex];

  const handleNextNote = () => {
    playPlayfulPop();
    setNoteIndex((prev) => (prev + 1) % STUDY_NOTES.length);
  };

  const handleSendCheer = () => {
    playChimeSound();
    const newCount = cheersCount + 1;
    setCheersCount(newCount);
    try {
      localStorage.setItem(CHEERS_STORAGE_KEY, newCount.toString());
    } catch {}

    const heartId = Date.now() + Math.random();
    setFloatingParticles((prev) => [...prev, { id: heartId, x: Math.random() * 40 - 20 }]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((h) => h.id !== heartId));
    }, 1200);

    setShowCheerToast(true);
    setTimeout(() => setShowCheerToast(false), 2400);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-3">
      {/* Paper Board */}
      <div className="relative overflow-hidden rounded-3xl bg-[#FFFDF9] dark:bg-[#1A191E] border-2 border-[#F6E7D2] dark:border-[#3D2D24] shadow-md p-5 sm:p-7 transition-colors">
        {/* Subtle background decorative accents */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#FEF3C7]/40 dark:bg-[#382618]/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#FCE7F3]/40 dark:bg-[#341628]/30 blur-2xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#F5EAD9] dark:border-[#2D2622]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FFF7ED] dark:bg-[#2C1C14] border border-[#FED7AA] dark:border-[#52291B] flex items-center justify-center text-[#EA580C] dark:text-[#FB923C] shadow-2xs">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm font-bold text-[#2B2118] dark:text-[#F4F4F5]">
                  Ayushi & Ayush’s Study Corner
                </span>
                <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#FEF3C7] dark:bg-[#362512] text-[#B45309] dark:text-[#FBBF24] border border-[#FDE68A] dark:border-[#533418]">
                  Study Notes
                </span>
              </div>
              <p className="text-[11px] font-serif text-[#786C5E] dark:text-[#A1A1AA]">
                Two friends discussing Python libraries and code together over tea.
              </p>
            </div>
          </div>

          {/* Cheer Button */}
          <div className="relative self-end sm:self-auto">
            <button
              onClick={handleSendCheer}
              className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1F2] dark:bg-[#28131B] border border-[#FECDD3] dark:border-[#5B1F2C] hover:bg-[#FFE4E6] dark:hover:bg-[#371624] text-xs font-serif font-bold text-[#BE123C] dark:text-[#FDA4AF] transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              title="Cheer on Ayushi & Ayush"
            >
              <Heart className="w-3.5 h-3.5 text-[#E11D48] fill-[#E11D48] group-hover:scale-125 transition-transform" />
              <span>Cheer ({cheersCount})</span>
            </button>

            {/* Floating Particles */}
            <AnimatePresence>
              {floatingParticles.map((h) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 1, y: 0, x: h.x, scale: 0.8 }}
                  animate={{ opacity: 0, y: -45, scale: 1.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute left-1/2 -top-2 pointer-events-none text-base"
                >
                  ✨
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {showCheerToast && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-3 px-3.5 py-1.5 rounded-2xl bg-[#FFF1F2] dark:bg-[#301621] border border-[#FECDD3] dark:border-[#541E2F] text-xs font-serif text-[#BE123C] dark:text-[#FDA4AF] flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
              <span>Ayushi & Ayush: "Thanks! Happy coding!"</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Middle Section: Study Sticky Note */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-8">
            <div className="relative p-5 rounded-2xl bg-[#FFFDF7] dark:bg-[#201F25] border border-[#F2E5D0] dark:border-[#38332F] shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <CharacterAvatar
                    character={currentNote.avatar}
                    size="sm"
                    className="ring-2 ring-[#EA580C]/20"
                  />
                  <div>
                    <span className="font-serif text-xs font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                      {currentNote.author === 'Both' ? 'Ayushi & Ayush' : `${currentNote.author}'s Note`}
                    </span>
                    <span className="text-[10px] text-[#A89F91] dark:text-[#8E877D] block font-sans">
                      {currentNote.tag}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleNextNote}
                  className="flex items-center gap-1 text-[11px] font-serif font-semibold text-[#B45309] dark:text-[#FBBF24] hover:text-[#92400E] dark:hover:text-[#FDE68A] transition-colors px-2.5 py-1 rounded-xl bg-[#FEF3C7]/60 dark:bg-[#362512]/60 hover:bg-[#FEF3C7] dark:hover:bg-[#452B14] cursor-pointer"
                  title="Read next study note"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Next Note ({noteIndex + 1}/{STUDY_NOTES.length})</span>
                </button>
              </div>

              {/* Note body */}
              <blockquote className="font-serif text-sm sm:text-[15px] text-[#2D251E] dark:text-[#E4E4E7] leading-relaxed mb-2">
                "{currentNote.text}"
              </blockquote>

              <p className="font-serif text-xs text-[#827568] dark:text-[#9CA3AF] leading-relaxed border-t border-[#F2E5D0]/80 dark:border-[#332E2A] pt-2 mt-2">
                💡 <span className="font-sans font-medium">{currentNote.subtext}</span>
              </p>
            </div>
          </div>

          {/* Right Column: Mood / Study Status */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full bg-[#FFF9F2] dark:bg-[#1E1B22] p-4 rounded-2xl border border-[#F5EAD9] dark:border-[#382D26]">
            <div>
              <span className="text-[11px] font-serif uppercase tracking-wider font-bold text-[#B45309] dark:text-[#FBBF24] block mb-1">
                How is your coding session going?
              </span>
              <p className="text-xs font-serif text-[#6B5E51] dark:text-[#A1A1AA] mb-3">
                Select your current focus for quick recommendations:
              </p>

              {/* Mood Buttons Grid */}
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {(
                  [
                    { id: 'overwhelmed', label: 'Overwhelmed 📚', color: 'hover:border-[#F472B6]' },
                    { id: 'curious', label: 'Curious 💡', color: 'hover:border-[#F59E0B]' },
                    { id: 'relaxed', label: 'Relaxed ☕', color: 'hover:border-[#10B981]' },
                    { id: 'stuck', label: 'Stuck on Bug 🐛', color: 'hover:border-[#EF4444]' }
                  ] as { id: Mood; label: string; color: string }[]
                ).map((m) => {
                  const isSelected = activeMood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        playPlayfulPop();
                        setActiveMood(isSelected ? null : m.id);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all text-left cursor-pointer border ${
                        isSelected
                          ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-2xs'
                          : `bg-[#FFFDF9] dark:bg-[#25222B] text-[#554A3E] dark:text-[#D1D5DB] border-[#E8DCCB] dark:border-[#3B342F] ${m.color}`
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Mood Message */}
            <AnimatePresence>
              {activeMood && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-2 border-t border-[#E8DCCB] dark:border-[#382D26]"
                >
                  <div className="flex items-start gap-2">
                    <CharacterAvatar
                      character={MOOD_RESPONSES[activeMood].avatar}
                      size="xs"
                      className="shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-[#EA580C] dark:text-[#FB923C] block">
                        {MOOD_RESPONSES[activeMood].speaker}:
                      </span>
                      <p className="text-[11px] font-serif text-[#332A22] dark:text-[#E5E7EB] leading-snug">
                        "{MOOD_RESPONSES[activeMood].quote}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
