import React, { useState } from 'react';
import { ConversationTurn, CharacterProfile, DialogueChoiceOption } from '../types';
import { Play, Check, Copy, Sparkles, Terminal, Heart } from 'lucide-react';
import { CharacterAvatar } from './CharacterAvatar';
import { motion, AnimatePresence } from 'motion/react';
import { playPlayfulPop, playChimeSound } from '../utils/audio';

interface SpeechCardProps {
  turn: ConversationTurn;
  learner: CharacterProfile;
  guide: CharacterProfile;
  isLatest: boolean;
  selectedChoiceId?: string;
  onSelectChoice?: (option: DialogueChoiceOption) => void;
}

export const SpeechCard: React.FC<SpeechCardProps> = ({
  turn,
  learner,
  guide,
  isLatest,
  selectedChoiceId,
  onSelectChoice
}) => {
  const isLearner = turn.speaker === 'learner';
  const speakerProfile = isLearner ? learner : guide;
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isHearted, setIsHearted] = useState(false);
  const [floatingHeart, setFloatingHeart] = useState(false);

  const handleRunCode = () => {
    playPlayfulPop();
    setIsRunningCode(true);
    setTimeout(() => {
      setIsRunningCode(false);
      setShowOutput(true);
    }, 400);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleToggleHeart = () => {
    playChimeSound();
    setIsHearted(!isHearted);
    setFloatingHeart(true);
    setTimeout(() => setFloatingHeart(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isLearner ? -18 : 18, y: 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -4 }}
      transition={{
        duration: 0.36,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={`w-full flex ${
        isLearner ? 'justify-start' : 'justify-end'
      } my-3 sm:my-4`}
    >
      <div
        className={`max-w-xl sm:max-w-2xl w-full rounded-3xl p-5 sm:p-6 border transition-all duration-300 relative ${
          isLearner
            ? 'bg-[#FFFDFE] dark:bg-[#1C161D] border-[#FCE7F3] dark:border-[#4B1E37] shadow-xs'
            : 'bg-[#FFFDF9] dark:bg-[#1D1917] border-[#FFEDD5] dark:border-[#4E291C] shadow-xs'
        } ${
          isLatest
            ? isLearner
              ? 'ring-2 ring-[#EC4899]/40 dark:ring-[#EC4899]/60 shadow-md'
              : 'ring-2 ring-[#F97316]/40 dark:ring-[#F97316]/60 shadow-md'
            : 'opacity-95'
        }`}
      >
        {/* Card Header: Avatar, Name, Role & Heart Reaction */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <CharacterAvatar
              character={speakerProfile.name}
              size="sm"
              isSpeaking={isLatest}
              className="shadow-xs"
            />
            <span className="font-serif text-sm font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
              {speakerProfile.name}
            </span>
            <span className="text-xs select-none" title={isLearner ? 'Ayushi' : 'Ayush'}>
              {isLearner ? '🌸' : '☕'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {turn.secondaryNote && (
              <span className="text-[11px] text-[#888] dark:text-[#999] font-serif italic hidden sm:inline">
                {turn.secondaryNote}
              </span>
            )}

            {/* Heart Button */}
            <div className="relative">
              <button
                onClick={handleToggleHeart}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  isHearted
                    ? 'text-[#E11D48] bg-[#FFE4E6] dark:bg-[#3B1522] scale-110'
                    : 'text-[#BBB] dark:text-[#666] hover:text-[#E11D48] hover:bg-[#FFF1F2] dark:hover:bg-[#29131C]'
                }`}
                title={isHearted ? "Loved this explanation! Click to remove" : "Love this explanation"}
              >
                <Heart className={`w-3.5 h-3.5 ${isHearted ? 'fill-current' : ''}`} />
              </button>

              <AnimatePresence>
                {floatingHeart && (
                  <motion.span
                    initial={{ opacity: 1, y: 0, scale: 0.8 }}
                    animate={{ opacity: 0, y: -25, scale: 1.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute -top-3 left-1 pointer-events-none text-xs"
                  >
                    💖
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Spoken Text */}
        <p className="font-serif text-base sm:text-lg text-[#1A1A1A] dark:text-[#F4F4F5] leading-relaxed mb-1 whitespace-pre-line">
          "{turn.text}"
        </p>

        {/* Embedded Code Snippet (if present in turn) */}
        {turn.codeSnippet && (
          <div className="mt-4 rounded-2xl bg-[#1A1A1A] dark:bg-[#141416] text-[#FDFCF7] border border-[#3A3A3A] dark:border-[#2C2C35] overflow-hidden shadow-md">
            {/* Code Header */}
            <div className="px-4 py-2.5 bg-[#121212] dark:bg-[#0E0E10] border-b border-[#2C2C2C] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="text-xs font-mono text-[#AAA] ml-2">
                  {turn.codeSnippet.filename || 'solution.py'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(turn.codeSnippet!.code)}
                  className="flex items-center gap-1 text-[11px] font-mono text-[#AAA] hover:text-[#FDFCF7] transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-[#2A2A2A]"
                  title="Copy code"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
                {turn.codeSnippet.runnable && (
                  <button
                    onClick={handleRunCode}
                    disabled={isRunningCode}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isRunningCode ? 'Running...' : 'Run Code'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 font-mono text-xs sm:text-sm text-[#EAE4D5] overflow-x-auto leading-6">
              <pre>
                <code>{turn.codeSnippet.code}</code>
              </pre>
            </div>

            {/* Simulated Live Output */}
            {(showOutput || turn.codeSnippet.output) && (
              <div className="border-t border-[#2C2C2C] bg-[#141414] p-3.5 text-xs font-mono text-[#34D399]">
                <div className="flex items-center gap-1.5 text-[11px] text-[#AAA] mb-1.5 select-none">
                  <Terminal className="w-3 h-3 text-[#F97316]" />
                  <span>Output Console</span>
                </div>
                <pre className="whitespace-pre-wrap leading-5">
                  <code>{turn.codeSnippet.output}</code>
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Interactive Choice Moment (if present in turn) */}
        {turn.interactiveChoice && (
          <div className="mt-4 pt-3 border-t border-[#F1E9DC] dark:border-[#382D26] space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#DB2777] dark:text-[#F472B6] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
              <span>{turn.interactiveChoice.prompt}</span>
            </p>
            <div className="grid grid-cols-1 gap-2">
              {turn.interactiveChoice.options.map((opt) => {
                const isSelected = selectedChoiceId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      playPlayfulPop();
                      onSelectChoice && onSelectChoice(opt);
                    }}
                    className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer font-serif text-xs sm:text-sm ${
                      isSelected
                        ? 'bg-[#1A1A1A] dark:bg-[#F4F4F5] text-[#FDFCF7] dark:text-[#1A1A1A] border-[#1A1A1A] shadow-md ring-2 ring-[#EC4899]'
                        : 'bg-[#FFF9F5] dark:bg-[#241B18] hover:bg-[#FFF0E6] dark:hover:bg-[#32231E] text-[#1A1A1A] dark:text-[#F4F4F5] border-[#FED7AA]/60 dark:border-[#52291B]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#EC4899] shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
