import React, { useState } from 'react';
import { BUG_HUNT_SCENARIOS, BugScenario } from '../data/bugHuntData';
import { CharacterAvatar } from './CharacterAvatar';
import { playCorrectAnswerSound, playWrongAnswerSound, playPlayfulPop } from '../utils/audio';
import { fireDelightfulConfetti } from '../utils/confetti';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bug,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Terminal,
  ShieldCheck,
  ChevronRight,
  Cpu,
  HelpCircle,
  Flame
} from 'lucide-react';

interface BugHuntViewProps {
  onReturnHome?: () => void;
  onSelectTopic?: (topic: string) => void;
}

export const BugHuntView: React.FC<BugHuntViewProps> = ({ onReturnHome, onSelectTopic }) => {
  const [scenarios] = useState<BugScenario[]>(BUG_HUNT_SCENARIOS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasTested, setHasTested] = useState(false);
  const [showTraceback, setShowTraceback] = useState(true);
  const [solvedScenarios, setSolvedScenarios] = useState<Record<string, boolean>>({});

  const current = scenarios[activeIndex];
  const selectedOption = current.options.find(o => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  const handleSelectOption = (optId: string) => {
    playPlayfulPop();
    setSelectedOptionId(optId);
    setHasTested(false);
  };

  const handleTestFix = () => {
    if (!selectedOption) return;
    setHasTested(true);
    if (selectedOption.isCorrect) {
      playCorrectAnswerSound();
      fireDelightfulConfetti();
      setSolvedScenarios(prev => ({ ...prev, [current.id]: true }));
    } else {
      playWrongAnswerSound();
    }
  };

  const handleNextBug = () => {
    playPlayfulPop();
    const nextIdx = (activeIndex + 1) % scenarios.length;
    setActiveIndex(nextIdx);
    setSelectedOptionId(null);
    setHasTested(false);
    setShowTraceback(true);
  };

  const solvedCount = Object.keys(solvedScenarios).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FFF5F7] via-[#FFFDFB] to-[#FFF7ED] dark:from-[#261520] dark:via-[#1B1B22] dark:to-[#261814] border-2 border-[#FED7AA]/80 dark:border-[#52291B]/80 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4E6] dark:bg-[#4C1D24] text-[#BE123C] dark:text-[#FDA4AF] text-xs font-bold font-serif shadow-xs">
              <Bug className="w-3.5 h-3.5" />
              <span>Interactive Diagnostic Lab</span>
            </span>
            <span className="text-xs font-mono font-bold text-[#EA580C] dark:text-[#FB923C] bg-[#FFF0E6] dark:bg-[#341F16] px-2.5 py-0.5 rounded-full border border-[#FED7AA] dark:border-[#52291B]">
              {solvedCount} of {scenarios.length} Bugs Defeated
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight">
            Bug Hunt with Ayushi
          </h1>
          <p className="text-xs sm:text-sm font-serif text-[#666] dark:text-[#A1A1AA] max-w-2xl">
            Ayushi hit a classic production pitfall! Help her diagnose the root cause, test the fix in the simulated terminal, and explore Ayush's architectural debrief.
          </p>
        </div>

        {/* Quick Scenario Navigator Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {scenarios.map((scen, idx) => {
            const isSolved = solvedScenarios[scen.id];
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={scen.id}
                onClick={() => {
                  playPlayfulPop();
                  setActiveIndex(idx);
                  setSelectedOptionId(null);
                  setHasTested(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white border-transparent shadow-xs scale-105'
                    : isSolved
                    ? 'bg-[#F0FDF4] dark:bg-[#152B18] text-[#16A34A] dark:text-[#4ADE80] border-[#BBF7D0] dark:border-[#22542B]'
                    : 'bg-[#FFFDFB] dark:bg-[#202028] text-[#666] dark:text-[#A1A1AA] border-[#E5DFD0] dark:border-[#383846] hover:border-[#F97316]'
                }`}
              >
                {isSolved ? <CheckCircle2 className="w-3 h-3 text-[#16A34A] dark:text-[#4ADE80]" /> : <span>#{idx + 1}</span>}
                <span>{scen.library}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Diagnostic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Story, Code and Traceback (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Ayushi's Hurdle Card */}
          <div className="p-5 rounded-2xl bg-[#FFFDFB] dark:bg-[#1A1A20] border border-[#FED7AA]/70 dark:border-[#3E2419] shadow-xs flex items-start gap-4">
            <CharacterAvatar character="Ayushi" size="md" className="shrink-0 ring-2 ring-[#EC4899]/30" />
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#DB2777] dark:text-[#F472B6]">
                  Ayushi's Hurdle
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF0E6] dark:bg-[#2B1B15] text-[#EA580C] dark:text-[#FB923C] font-semibold">
                  {current.library} Issue
                </span>
              </div>
              <p className="font-serif text-sm text-[#1A1A1A] dark:text-[#E4E4E7] leading-relaxed italic">
                "{current.ayushiStory}"
              </p>
            </div>
          </div>

          {/* Buggy Code Terminal */}
          <div className="rounded-2xl bg-[#1E1E24] text-[#F4F4F5] border border-[#33333E] shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#17171C] border-b border-[#2C2C36] text-xs font-mono text-[#888]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="ml-2 text-[#DDD] font-semibold flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-[#F97316]" />
                  script.py — {current.title}
                </span>
              </div>
              <span className="text-[11px] text-[#EF4444] font-semibold">
                ⚠️ Defect near line {current.faultyLineNumber}
              </span>
            </div>

            {/* Code Lines with Line Numbers */}
            <div className="p-4 font-mono text-xs overflow-x-auto leading-relaxed">
              {current.buggyCode.split('\n').map((line, i) => {
                const lineNum = i + 1;
                const isFaulty = lineNum === current.faultyLineNumber;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-2 py-0.5 rounded ${
                      isFaulty ? 'bg-[#EF4444]/20 border-l-4 border-[#EF4444] text-[#FECDD3]' : 'hover:bg-white/5'
                    }`}
                  >
                    <span className="text-[#666] select-none w-6 text-right shrink-0">{lineNum}</span>
                    <span className="whitespace-pre">{line}</span>
                    {isFaulty && (
                      <span className="ml-auto text-[10px] text-[#EF4444] uppercase font-bold shrink-0">
                        ← Faulty
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Traceback Warning Panel */}
          <div className="rounded-2xl bg-[#281318] dark:bg-[#200E12] border border-[#EF4444]/50 p-4 text-xs font-mono text-[#FCA5A5] space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#F87171]">
                <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                Terminal Traceback Output
              </span>
              <button
                onClick={() => setShowTraceback(!showTraceback)}
                className="text-[11px] underline text-[#FECDD3] hover:text-white cursor-pointer"
              >
                {showTraceback ? 'Hide' : 'Show'}
              </button>
            </div>
            {showTraceback && (
              <pre className="whitespace-pre-wrap leading-relaxed text-[11px] bg-[#1A0A0E] p-3 rounded-xl border border-[#4C1D24] overflow-x-auto">
                {current.errorTraceback}
              </pre>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Fix Selector & Testing (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl bg-[#FFFDFB] dark:bg-[#18181D] border-2 border-[#FED7AA]/80 dark:border-[#52291B]/80 shadow-md space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-serif uppercase tracking-wider font-bold text-[#EA580C] dark:text-[#FB923C]">
                Step 1: Choose Ayushi's Fix
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                How should we fix line {current.faultyLineNumber}?
              </h3>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5">
              {current.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer font-serif text-xs flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#1A1A1A] dark:bg-[#2A2A34] text-white border-[#1A1A1A] shadow-md ring-2 ring-[#EC4899]'
                        : 'bg-[#FFFDFE] dark:bg-[#202028] hover:bg-[#FFF7ED] dark:hover:bg-[#28221D] text-[#1A1A1A] dark:text-[#E4E4E7] border-[#E8DFC8] dark:border-[#383846]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-[#EC4899] bg-[#EC4899] text-white font-bold'
                          : 'border-[#CCC] dark:border-[#555]'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                    <div className="space-y-1">
                      <code className="font-mono text-[11px] font-semibold block break-all">
                        {opt.label}
                      </code>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Test Fix Action Button */}
            <div className="pt-2">
              <button
                onClick={handleTestFix}
                disabled={!selectedOptionId}
                className={`w-full py-3.5 px-4 rounded-2xl font-serif text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                  !selectedOptionId
                    ? 'bg-[#E5E0D5] text-[#999] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#EC4899] hover:opacity-95 text-white active:scale-98'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Test Fix in Terminal</span>
              </button>
            </div>

            {/* Test Results Feedback Box */}
            <AnimatePresence>
              {hasTested && selectedOption && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border text-xs font-serif space-y-2 ${
                    isCorrect
                      ? 'bg-[#F0FDF4] dark:bg-[#132A18] border-[#86EFAC] text-[#166534] dark:text-[#86EFAC]'
                      : 'bg-[#FEF2F2] dark:bg-[#2B1215] border-[#FCA5A5] text-[#991B1B] dark:text-[#FCA5A5]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                        <span>Bug Squashed! Terminal Output:</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-[#EF4444]" />
                        <span>Not quite right!</span>
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed">{selectedOption.explanation}</p>

                  {isCorrect && (
                    <div className="mt-3 font-mono text-[11px] p-3 rounded-xl bg-[#0F2012] dark:bg-[#0A170C] text-[#86EFAC] whitespace-pre-wrap border border-[#22542B]">
                      {current.outputSuccessSnippet}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Bug Button */}
            {hasTested && isCorrect && (
              <button
                onClick={handleNextBug}
                className="w-full py-3 px-4 rounded-2xl bg-[#1A1A1A] dark:bg-[#32323E] hover:bg-[#333] text-white text-xs font-bold font-serif flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <span>Next Bug Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Ayush's Architectural Debrief Card */}
          <div className="p-5 rounded-3xl bg-[#FFFDFB] dark:bg-[#18181D] border border-[#FED7AA]/80 dark:border-[#4B291D] shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <CharacterAvatar character="Ayush" size="sm" className="ring-2 ring-[#F97316]/30" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] dark:text-[#FB923C] block">
                  Ayush's Engineering Debrief
                </span>
                <span className="font-serif text-xs text-[#666] dark:text-[#A1A1AA]">
                  Why this library behaves this way in memory
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-serif text-[#333] dark:text-[#DDD] leading-relaxed">
              <div className="p-3 rounded-xl bg-[#FFF9F2] dark:bg-[#201A16] border border-[#FED7AA]/50 dark:border-[#3E2419]">
                <strong className="text-[#EA580C] dark:text-[#FB923C] block mb-0.5 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 inline" /> C & Memory Layer:
                </strong>
                {current.ayushDebrief.cLevelInsight}
              </div>

              <div className="p-3 rounded-xl bg-[#FFF5F7] dark:bg-[#20131B] border border-[#FCE7F3] dark:border-[#4B1E37]">
                <strong className="text-[#DB2777] dark:text-[#F472B6] block mb-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 inline" /> Production Rule of Thumb:
                </strong>
                {current.ayushDebrief.proRuleOfThumb}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
