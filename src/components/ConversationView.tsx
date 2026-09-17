import React, { useState, useEffect, useRef } from 'react';
import { ConversationLesson, DialogueChoiceOption } from '../types';
import { TwoCharacterStage } from './TwoCharacterStage';
import { SpeechCard } from './SpeechCard';
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, XCircle, Sparkles, BookOpen } from 'lucide-react';
import { saveRecentConversation } from '../utils/storage';
import { recordPractice } from '../utils/streak';
import { AnimatePresence, motion } from 'motion/react';
import { fireDelightfulConfetti } from '../utils/confetti';
import { playSpeechSound, playCorrectAnswerSound, playWrongAnswerSound, playPlayfulPop, playSuccessChime } from '../utils/audio';

interface ConversationViewProps {
  lesson: ConversationLesson;
  initialTurnIndex?: number;
  onOpenTopicPicker: () => void;
  onOpenGenerator: () => void;
  onPhaseChange?: (phase: import('../types').ConversationPhase) => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  lesson,
  initialTurnIndex = 0,
  onOpenTopicPicker,
  onOpenGenerator,
  onPhaseChange
}) => {
  const [currentTurnIndex, setCurrentTurnIndex] = useState(initialTurnIndex);
  const [userChoices, setUserChoices] = useState<Record<string, string>>({});
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<string | null>(null);
  const [hasSubmittedPractice, setHasSubmittedPractice] = useState(false);
  const conversationBottomRef = useRef<HTMLDivElement>(null);
  const hasFiredConfettiRef = useRef<boolean>(false);
  const isFirstRender = useRef<boolean>(true);
  const prevTurnIndexRef = useRef<number>(initialTurnIndex);

  const totalTurns = lesson.turns.length;
  const isFinished = currentTurnIndex >= totalTurns;
  const currentTurn = isFinished ? null : lesson.turns[currentTurnIndex];
  const activeSpeaker = currentTurn ? currentTurn.speaker : 'guide';

  // Automatically persist progress to local storage and record streak activity on turn update
  useEffect(() => {
    saveRecentConversation(lesson, currentTurnIndex, isFinished);
    if (currentTurnIndex > 0 || isFinished) {
      recordPractice(lesson.topic);
    }
  }, [lesson, currentTurnIndex, isFinished]);

  // Play subtle sound effect when dialogue advances
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (currentTurnIndex > prevTurnIndexRef.current) {
      playSpeechSound();
    }
    prevTurnIndexRef.current = currentTurnIndex;
  }, [currentTurnIndex]);

  // Subtle confetti burst and celebratory chime when user successfully completes all turns
  useEffect(() => {
    if (isFinished && !hasFiredConfettiRef.current) {
      hasFiredConfettiRef.current = true;
      playSuccessChime();
      const timer = setTimeout(() => {
        fireDelightfulConfetti();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isFinished]);

  // Number of turns completed out of total available
  const completedTurns = isFinished ? totalTurns : currentTurnIndex;
  const progressPercent = totalTurns > 0 ? Math.round((completedTurns / totalTurns) * 100) : 0;

  // Inform parent of phase changes
  useEffect(() => {
    if (onPhaseChange) {
      if (isFinished) {
        onPhaseChange('practice');
      } else if (currentTurn?.phase) {
        onPhaseChange(currentTurn.phase);
      }
    }
  }, [currentTurnIndex, isFinished, currentTurn, onPhaseChange]);

  // Visible turns up to currentTurnIndex
  const visibleTurns = lesson.turns.slice(0, currentTurnIndex + 1);

  // Auto-scroll on new message
  useEffect(() => {
    if (conversationBottomRef.current) {
      conversationBottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentTurnIndex, isFinished]);

  // Reset or set initial progress when lesson or initial turn changes
  useEffect(() => {
    hasFiredConfettiRef.current = false;
    setCurrentTurnIndex(initialTurnIndex);
    prevTurnIndexRef.current = initialTurnIndex;
    setUserChoices({});
    setSelectedPracticeOption(null);
    setHasSubmittedPractice(false);
  }, [lesson.id, initialTurnIndex]);

  const handleNext = () => {
    if (currentTurnIndex < totalTurns) {
      setCurrentTurnIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentTurnIndex > 0) {
      setCurrentTurnIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    hasFiredConfettiRef.current = false;
    setCurrentTurnIndex(0);
    prevTurnIndexRef.current = 0;
    setUserChoices({});
    setSelectedPracticeOption(null);
    setHasSubmittedPractice(false);
    playSpeechSound();
  };

  const handleSelectChoice = (turnId: string, option: DialogueChoiceOption) => {
    setUserChoices(prev => ({ ...prev, [turnId]: option.id }));
  };

  // Keyboard navigation: Space / Enter / ArrowRight to advance, ArrowLeft to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        if (!isFinished) {
          e.preventDefault();
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentTurnIndex > 0) {
          e.preventDefault();
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTurnIndex, isFinished]);

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* Two Character Stage */}
      <TwoCharacterStage
        learner={lesson.learner}
        guide={lesson.guide}
        activeSpeaker={activeSpeaker}
      />

      {/* Visual Conversation Progress Bar */}
      <section
        id="conversation-turns-progress"
        aria-label="Conversation Progress"
        className="p-4 sm:p-5 rounded-2xl bg-[#FDFCF7] border border-[#E2DAC9] shadow-xs space-y-3 transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                isFinished ? 'bg-[#486B4F]' : 'bg-[#D4A373] animate-pulse'
              }`}
            />
            <span className="font-serif text-xs uppercase tracking-wider font-bold text-[#8C6D4F]">
              Conversation Progress
            </span>
            <span className="text-[#C5BEB0] select-none">•</span>
            <span className="text-xs font-serif text-[#555] font-medium">
              {lesson.topic}
            </span>
            {isFinished ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EBF2EC] text-[#2F5236] border border-[#C8DEC9]">
                <CheckCircle2 className="w-3 h-3" />
                All Turns Completed
              </span>
            ) : (
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#FAF4EB] text-[#8C6D4F] border border-[#E8DCCB]">
                Turn {currentTurnIndex + 1} of {totalTurns} active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-serif">
            <span className="font-bold text-[#1A1A1A]">
              {completedTurns} of {totalTurns} turns completed
            </span>
            <span
              id="progress-percentage-badge"
              className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold border transition-colors ${
                isFinished
                  ? 'bg-[#EBF2EC] text-[#2F5236] border-[#C8DEC9]'
                  : 'bg-[#FAF4EB] text-[#8C6D4F] border-[#E8DCCB]'
              }`}
            >
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Main Visual Progress Bar */}
        <div
          className="w-full h-3 bg-[#FFF0E6] rounded-full overflow-hidden p-0.5 shadow-inner border border-[#FED7AA]/60"
          role="progressbar"
          aria-valuenow={completedTurns}
          aria-valuemin={0}
          aria-valuemax={totalTurns}
          aria-valuetext={`${completedTurns} of ${totalTurns} turns completed (${progressPercent}%)`}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out shadow-xs ${
              isFinished
                ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899]'
                : 'bg-gradient-to-r from-[#F97316] via-[#FB7185] to-[#EC4899]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Turn Step Markers */}
        <div
          className="grid gap-1.5 pt-0.5"
          style={{ gridTemplateColumns: `repeat(${totalTurns}, minmax(0, 1fr))` }}
        >
          {lesson.turns.map((t, idx) => {
            const isCompleted = idx < completedTurns;
            const isActive = idx === currentTurnIndex && !isFinished;
            const speakerName = t.speaker === 'learner' ? lesson.learner.name : lesson.guide.name;

            return (
              <div
                key={t.id || idx}
                className="group relative flex flex-col items-center cursor-default"
              >
                <div
                  className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#F97316]'
                      : isActive
                      ? 'bg-[#EC4899] ring-2 ring-[#EC4899]/40'
                      : 'bg-[#F1E9DC]'
                  }`}
                />
                <span className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -bottom-7 bg-[#1A1A1A] text-[#FDFCF7] text-[10px] font-serif px-2 py-0.5 rounded whitespace-nowrap z-30 transition-opacity shadow-md">
                  Turn {idx + 1}: {speakerName} ({t.phase})
                </span>
              </div>
            );
          })}
        </div>

        {/* Descriptive Footer of Progress Bar */}
        <div className="flex items-center justify-between text-[11px] font-serif text-[#777] pt-0.5 flex-wrap gap-2">
          <span>
            {isFinished
              ? 'Dialogue finished — practice question and recap ready below'
              : `Current speaker: ${currentTurn?.speaker === 'learner' ? lesson.learner.name : lesson.guide.name} (${currentTurn?.phase || 'dialogue'})`}
          </span>
          <span className="font-mono text-[10px] text-[#888]">
            {isFinished
              ? '100% completed'
              : `${totalTurns - completedTurns} turn${totalTurns - completedTurns === 1 ? '' : 's'} to go`}
          </span>
        </div>
      </section>

      {/* Main Conversation Container */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {visibleTurns.map((turn, index) => {
            const isLatest = index === currentTurnIndex;
            return (
              <SpeechCard
                key={turn.id}
                turn={turn}
                learner={lesson.learner}
                guide={lesson.guide}
                isLatest={isLatest}
                selectedChoiceId={userChoices[turn.id]}
                onSelectChoice={(opt) => handleSelectChoice(turn.id, opt)}
              />
            );
          })}
        </AnimatePresence>

        {/* Practice Question & Recap (Unlocks when conversation completes) */}
        {isFinished && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Lesson Completion and Practice"
            className="space-y-6 pt-6"
          >
            {/* Practice Question Card */}
            {lesson.practiceQuestion && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFB] border border-[#FED7AA] shadow-md space-y-5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#F97316] to-[#EC4899]" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#EA580C]">
                      Dialogue Completed • Quick Check
                    </span>
                  </div>
                  <span className="text-[11px] font-serif text-[#777]">
                    All {totalTurns} turns finished
                  </span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A] leading-snug">
                  {lesson.practiceQuestion.question}
                </h3>

                {/* Options */}
                <div className="space-y-2.5">
                  {lesson.practiceQuestion.options.map((opt, idx) => {
                    const isSelected = selectedPracticeOption === opt.id;
                    const letter = String.fromCharCode(65 + idx);

                    let btnStyle = 'bg-[#FFFDFE] border-[#FED7AA]/60 hover:border-[#F97316] text-[#1A1A1A]';
                    if (isSelected) {
                      btnStyle = 'bg-[#1A1A1A] text-[#FDFCF7] border-[#1A1A1A] shadow-sm';
                    }
                    if (hasSubmittedPractice) {
                      if (opt.isCorrect) {
                        btnStyle = 'bg-[#F0FDF4] border-[#22C55E] text-[#14532D] ring-2 ring-[#22C55E]/30';
                      } else if (isSelected && !opt.isCorrect) {
                        btnStyle = 'bg-[#FFF1F2] border-[#F43F5E] text-[#881337]';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSelectedPracticeOption(opt.id);
                          setHasSubmittedPractice(true);
                          if (opt.isCorrect) {
                            playCorrectAnswerSound();
                            fireDelightfulConfetti();
                          } else {
                            playWrongAnswerSound();
                          }
                        }}
                        className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer font-serif text-xs sm:text-sm flex items-start gap-3 ${btnStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white' : 'bg-[#FFF0E6] text-[#C2410C]'
                        }`}>
                          {letter}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold">{opt.text}</p>
                          {hasSubmittedPractice && (
                            <p className={`mt-2 pt-2 border-t text-xs ${
                              opt.isCorrect ? 'border-[#BBF7D0] text-[#15803D]' : 'border-[#FECDD3] text-[#BE123C]'
                            }`}>
                              {opt.explanation}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Summary Takeaway Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1A1A1A] text-[#FDFCF7] border border-[#3A3A3A] shadow-xl space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FB923C]" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FDFCF7]">
                    What Ayushi & Ayush Uncovered
                  </h3>
                </div>
                <button
                  onClick={() => {
                    playSuccessChime();
                    fireDelightfulConfetti();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2A2A2A] hover:bg-[#383838] border border-[#555] hover:border-[#F97316] text-xs font-serif text-[#FB923C] hover:text-[#FFA07A] transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="Trigger celebratory confetti"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FB923C]" />
                  <span>Celebrate</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-serif leading-relaxed">
                <div className="p-4 rounded-2xl bg-[#262626] border border-[#3E3E3E] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#FB923C] tracking-wider block">
                    The Problem
                  </span>
                  <p className="text-[#DCD6C8]">{lesson.summaryTakeaway.problem}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#262626] border border-[#3E3E3E] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#FB923C] tracking-wider block">
                    The Intuition
                  </span>
                  <p className="text-[#DCD6C8]">{lesson.summaryTakeaway.intuition}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#262626] border border-[#3E3E3E] space-y-1 sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-[#FB923C] tracking-wider block">
                    Technical Pattern
                  </span>
                  <p className="text-[#DCD6C8] mb-2">{lesson.summaryTakeaway.technicalConcept}</p>
                  <pre className="bg-[#121212] p-2.5 rounded-xl font-mono text-[11px] text-[#34D399] overflow-x-auto">
                    <code>{lesson.summaryTakeaway.codePattern}</code>
                  </pre>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#333] flex-wrap gap-3">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2C2C2C] hover:bg-[#3C3C3C] text-xs font-semibold text-[#E5E0D5] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Conversation</span>
                </button>

                <button
                  onClick={onOpenTopicPicker}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#EA580C] hover:to-[#DB2777] text-white font-bold text-xs transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Explore Next Conversation →</span>
                </button>
              </div>
            </div>
          </motion.section>
        )}

        <div ref={conversationBottomRef} />
      </div>

      {/* Sticky/Fixed Minimal Bottom Controls */}
      {!isFinished && (
        <div className="sticky bottom-4 z-20 pt-4 flex flex-col items-center justify-center gap-2">
          <div className="bg-[#FDFCF7]/95 backdrop-blur-md px-5 py-3 rounded-2xl border border-[#FED7AA] shadow-lg flex items-center justify-between gap-4 sm:gap-6 w-full max-w-lg">
            {/* Back Button */}
            <button
              onClick={handlePrev}
              disabled={currentTurnIndex === 0}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                currentTurnIndex === 0
                  ? 'text-[#AAA] cursor-not-allowed opacity-50'
                  : 'text-[#555] hover:text-[#1A1A1A] hover:bg-[#FFF0E6]'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* Main Action: Continue Conversation */}
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#EA580C] hover:to-[#DB2777] text-white font-serif text-sm font-bold transition-all cursor-pointer shadow-md active:scale-98"
            >
              <span>Continue conversation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Step Counter & Mini Progress */}
            <div className="flex flex-col items-end shrink-0 min-w-[76px]">
              <div className="text-[11px] font-mono text-[#555] select-none text-right font-semibold">
                {completedTurns}/{totalTurns} turns
              </div>
              <div className="w-16 h-1.5 bg-[#FFF0E6] rounded-full overflow-hidden mt-1 shadow-inner border border-[#FED7AA]/40">
                <div
                  className="h-full bg-gradient-to-r from-[#F97316] to-[#EC4899] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <span className="text-[10px] text-[#888] font-serif italic select-none">
            Tip: Press Space or Enter to continue
          </span>
        </div>
      )}
    </main>
  );
};
