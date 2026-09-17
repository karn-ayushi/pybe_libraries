import React, { useState, useEffect, useRef } from 'react';
import { DUEL_SCENARIOS, DuelScenario } from '../data/duelData';
import { CharacterAvatar } from './CharacterAvatar';
import { playCorrectAnswerSound, playPlayfulPop } from '../utils/audio';
import { fireDelightfulConfetti } from '../utils/confetti';
import {
  Zap,
  Play,
  RotateCcw,
  Timer,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2
} from 'lucide-react';

interface PerformanceDuelViewProps {
  onReturnHome?: () => void;
}

export const PerformanceDuelView: React.FC<PerformanceDuelViewProps> = ({ onReturnHome }) => {
  const [scenarios] = useState<DuelScenario[]>(DUEL_SCENARIOS);
  const [activeIdx, setActiveIdx] = useState(0);
  const current = scenarios[activeIdx];

  const [selectedDataSize, setSelectedDataSize] = useState(current.defaultDataSize);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const [progressA, setProgressA] = useState(0);
  const [progressB, setProgressB] = useState(0);
  const [timeA, setTimeA] = useState<number | null>(null);
  const [timeB, setTimeB] = useState<number | null>(null);

  const animFrameRef = useRef<number | null>(null);

  // When switching scenario, reset state
  useEffect(() => {
    setSelectedDataSize(current.defaultDataSize);
    resetBenchmark();
  }, [activeIdx]);

  const resetBenchmark = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsRunning(false);
    setHasFinished(false);
    setProgressA(0);
    setProgressB(0);
    setTimeA(null);
    setTimeB(null);
  };

  const handleStartDuel = () => {
    playPlayfulPop();
    resetBenchmark();
    setIsRunning(true);

    const sizeRatio = selectedDataSize / current.defaultDataSize;
    const targetMsA = current.contenderA.approxMsPer100k * sizeRatio;
    const targetMsB = current.contenderB.approxMsPer100k * sizeRatio;

    const startTimestamp = performance.now();
    // For visual suspense, we scale the visual animation duration:
    // Contender B completes quickly (e.g. 400ms visual animation)
    // Contender A completes in ~2400ms visual animation
    const visualDurationB = 450;
    const visualDurationA = 2500;

    const tick = (now: number) => {
      const elapsed = now - startTimestamp;

      // Progress B
      const pB = Math.min(100, (elapsed / visualDurationB) * 100);
      setProgressB(pB);

      // Progress A
      const pA = Math.min(100, (elapsed / visualDurationA) * 100);
      setProgressA(pA);

      if (pB >= 100 && timeB === null) {
        setTimeB(Number(targetMsB.toFixed(1)));
      }

      if (pA < 100) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        // Duel finished!
        setTimeA(Number(targetMsA.toFixed(1)));
        setTimeB(Number(targetMsB.toFixed(1)));
        setIsRunning(false);
        setHasFinished(true);
        playCorrectAnswerSound();
        fireDelightfulConfetti();
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
  };

  const speedup = timeA && timeB ? (timeA / timeB).toFixed(1) : (current.contenderA.approxMsPer100k / current.contenderB.approxMsPer100k).toFixed(1);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FFF7ED] via-[#FFFDFB] to-[#F0F9FF] dark:from-[#281813] dark:via-[#191920] dark:to-[#12232E] border-2 border-[#FED7AA]/80 dark:border-[#52291B]/80 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EA580C] text-white text-xs font-bold font-serif shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Live Benchmark Lab</span>
            </span>
            <span className="text-xs font-serif font-bold text-[#0284C7] dark:text-[#38BDF8] bg-[#E0F2FE] dark:bg-[#0C2D48] px-2.5 py-0.5 rounded-full border border-[#BAE6FD] dark:border-[#1E4E79]">
              Vectorized vs Loops
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight">
            Performance Duel
          </h1>
          <p className="text-xs sm:text-sm font-serif text-[#666] dark:text-[#A1A1AA] max-w-2xl">
            Watch interpreted Python loops go head-to-head against hardware-accelerated C & Rust kernels. Witness the raw speedup of vectorization in real time.
          </p>
        </div>

        {/* Duel Category Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {scenarios.map((scen, idx) => {
            const isCurrent = idx === activeIdx;
            return (
              <button
                key={scen.id}
                onClick={() => {
                  playPlayfulPop();
                  setActiveIdx(idx);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer border ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white border-transparent shadow-xs scale-105'
                    : 'bg-[#FFFDFB] dark:bg-[#202028] text-[#666] dark:text-[#A1A1AA] border-[#E5DFD0] dark:border-[#383846] hover:border-[#F97316]'
                }`}
              >
                {scen.category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duel Arena Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFB] dark:bg-[#18181D] border-2 border-[#FED7AA]/80 dark:border-[#52291B]/80 shadow-md space-y-6">
        {/* Scenario Header & Data Size Picker */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#EAE4D5] dark:border-[#2C2C36]">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
              {current.title}
            </h2>
            <p className="font-serif text-xs sm:text-sm text-[#666] dark:text-[#A1A1AA] mt-1">
              {current.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-serif text-[#777] dark:text-[#A1A1AA]">
              Dataset Scale:
            </span>
            <div className="flex items-center gap-1.5">
              {current.dataSizeOptions.map((opt) => (
                <button
                  key={opt.count}
                  onClick={() => {
                    playPlayfulPop();
                    setSelectedDataSize(opt.count);
                    resetBenchmark();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
                    selectedDataSize === opt.count
                      ? 'bg-[#1A1A1A] dark:bg-[#32323E] text-white border-[#1A1A1A]'
                      : 'bg-[#FFFDFE] dark:bg-[#202028] text-[#555] dark:text-[#AAA] border-[#DDD7C8] dark:border-[#383846]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Race Tracks */}
        <div className="space-y-4">
          {/* Contender A (Slow Loop) Track */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F2] dark:bg-[#201814] border border-[#FED7AA]/80 dark:border-[#4B291D] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
                <span className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] dark:text-[#F4F4F5]">
                  {current.contenderA.name}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#FED7AA]/50 dark:bg-[#3E2419] text-[#EA580C] dark:text-[#FB923C] font-bold">
                  {current.contenderA.paradigm}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#EA580C] dark:text-[#FB923C]">
                <Timer className="w-3.5 h-3.5" />
                <span>
                  {timeA !== null
                    ? `${timeA} ms`
                    : isRunning
                    ? `${((progressA / 100) * (current.contenderA.approxMsPer100k * (selectedDataSize / current.defaultDataSize))).toFixed(1)} ms...`
                    : `~${(current.contenderA.approxMsPer100k * (selectedDataSize / current.defaultDataSize)).toFixed(1)} ms`}
                </span>
              </div>
            </div>

            {/* Progress Bar Track */}
            <div className="w-full h-4 bg-[#F2EADB] dark:bg-[#2C221D] rounded-full overflow-hidden p-0.5 relative">
              <div
                className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-full transition-all duration-75 relative flex items-center justify-end pr-1"
                style={{ width: `${progressA}%` }}
              >
                {progressA > 15 && <span className="text-[9px] font-mono text-white font-bold">🐢</span>}
              </div>
            </div>
            <p className="text-[11px] font-serif text-[#777] dark:text-[#A1A1AA] italic">
              {current.contenderA.explanation}
            </p>
          </div>

          {/* Contender B (Vectorized/C/Rust) Track */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F0F9FF] dark:bg-[#10212E] border border-[#BAE6FD]/80 dark:border-[#1E4E79] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                <span className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] dark:text-[#F4F4F5]">
                  {current.contenderB.name}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#BAE6FD]/50 dark:bg-[#183852] text-[#0284C7] dark:text-[#38BDF8] font-bold">
                  {current.contenderB.paradigm}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#0284C7] dark:text-[#38BDF8]">
                <Timer className="w-3.5 h-3.5" />
                <span>
                  {timeB !== null
                    ? `${timeB} ms`
                    : isRunning
                    ? `${((progressB / 100) * (current.contenderB.approxMsPer100k * (selectedDataSize / current.defaultDataSize))).toFixed(1)} ms...`
                    : `~${(current.contenderB.approxMsPer100k * (selectedDataSize / current.defaultDataSize)).toFixed(1)} ms`}
                </span>
              </div>
            </div>

            {/* Progress Bar Track */}
            <div className="w-full h-4 bg-[#DCECF8] dark:bg-[#192E3D] rounded-full overflow-hidden p-0.5 relative">
              <div
                className="h-full bg-gradient-to-r from-[#0284C7] to-[#10B981] rounded-full transition-all duration-75 relative flex items-center justify-end pr-1"
                style={{ width: `${progressB}%` }}
              >
                {progressB > 15 && <span className="text-[9px] font-mono text-white font-bold">🚀</span>}
              </div>
            </div>
            <p className="text-[11px] font-serif text-[#777] dark:text-[#A1A1AA] italic">
              {current.contenderB.explanation}
            </p>
          </div>
        </div>

        {/* Duel Launch Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={handleStartDuel}
            disabled={isRunning}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-serif text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              isRunning
                ? 'bg-[#E5E0D5] text-[#888] cursor-not-allowed'
                : 'bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#EC4899] hover:opacity-95 text-white active:scale-98'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? 'Racing across RAM...' : 'Launch Duel!'}</span>
          </button>

          {/* Speedup Multiplier Badge */}
          {hasFinished && (
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#F0FDF4] dark:bg-[#132A18] border-2 border-[#86EFAC] dark:border-[#22542B] text-[#166534] dark:text-[#86EFAC] shadow-xs">
              <Award className="w-5 h-5 text-[#16A34A]" />
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider block">
                  Speedup Victory
                </span>
                <span className="font-mono text-lg font-black text-[#15803D] dark:text-[#4ADE80]">
                  {speedup}× FASTER
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Side-by-Side Code Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {/* Contender A Code */}
          <div className="rounded-2xl bg-[#1E1E24] text-[#F4F4F5] border border-[#33333E] p-4 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-[#888] border-b border-[#2C2C36] pb-2">
              <span className="text-[#EA580C] font-semibold">{current.contenderA.name}</span>
              <span className="text-[10px]">Interpreted</span>
            </div>
            <pre className="overflow-x-auto whitespace-pre leading-relaxed text-[#DDD]">
              {current.contenderA.code}
            </pre>
          </div>

          {/* Contender B Code */}
          <div className="rounded-2xl bg-[#1E1E24] text-[#F4F4F5] border border-[#33333E] p-4 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-[#888] border-b border-[#2C2C36] pb-2">
              <span className="text-[#0284C7] font-semibold">{current.contenderB.name}</span>
              <span className="text-[10px] text-[#10B981] font-bold">Vectorized ufunc</span>
            </div>
            <pre className="overflow-x-auto whitespace-pre leading-relaxed text-[#DDD]">
              {current.contenderB.code}
            </pre>
          </div>
        </div>

        {/* Character Reactions & Hardware Debrief */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#EAE4D5] dark:border-[#2C2C36]">
          {/* Ayushi's Reaction */}
          <div className="p-4 rounded-2xl bg-[#FFFDFB] dark:bg-[#1F1F26] border border-[#FED7AA]/70 dark:border-[#383846] flex items-start gap-3">
            <CharacterAvatar character="Ayushi" size="sm" className="shrink-0 ring-2 ring-[#EC4899]/30" />
            <div className="space-y-1">
              <span className="text-[11px] font-bold font-serif text-[#DB2777] dark:text-[#F472B6]">
                Ayushi's Takeaway:
              </span>
              <p className="font-serif text-xs text-[#333] dark:text-[#DDD] leading-relaxed italic">
                "{current.ayushiReaction}"
              </p>
            </div>
          </div>

          {/* Ayush's Hardware Explanation */}
          <div className="p-4 rounded-2xl bg-[#FFFDFB] dark:bg-[#1F1F26] border border-[#FED7AA]/70 dark:border-[#383846] flex items-start gap-3">
            <CharacterAvatar character="Ayush" size="sm" className="shrink-0 ring-2 ring-[#F97316]/30" />
            <div className="space-y-1">
              <span className="text-[11px] font-bold font-serif text-[#EA580C] dark:text-[#FB923C] flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> Ayush's Architecture Note:
              </span>
              <p className="font-serif text-xs text-[#333] dark:text-[#DDD] leading-relaxed">
                {current.ayushExplanation.whyFaster}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
