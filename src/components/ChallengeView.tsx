import React, { useState } from 'react';
import { LessonChallenge } from '../types';
import { CheckCircle2, XCircle, HelpCircle, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface ChallengeViewProps {
  challenge: LessonChallenge;
  onLessonCompleted: () => void;
  isAlreadyCompleted?: boolean;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  challenge,
  onLessonCompleted,
  isAlreadyCompleted
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const selectedOption = challenge.options.find(o => o.id === selectedOptionId);

  const handleSelectOption = (optionId: string) => {
    if (hasSubmitted) return;
    sound.playClick();
    setSelectedOptionId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    const opt = challenge.options.find(o => o.id === selectedOptionId);
    if (!opt) return;

    setHasSubmitted(true);

    if (opt.isCorrect) {
      sound.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
      onLessonCompleted();
    } else {
      sound.playError();
    }
  };

  const handleRetry = () => {
    sound.playClick();
    setHasSubmitted(false);
    setSelectedOptionId(null);
  };

  return (
    <div id="challenge-container" className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#1A1A1A] text-[#FDFCF6] border border-[#D4A373]/30 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#D4A373]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4A373]">
            Understanding Check
          </span>
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FDFCF6] leading-snug">
          {challenge.question}
        </h3>
        {challenge.scenarioContext && (
          <p className="text-xs text-[#DCD6C8] font-serif italic mt-2 bg-[#262626] p-3 rounded-2xl border border-[#3E3E3E]">
            {challenge.scenarioContext}
          </p>
        )}
      </section>

      {/* Options List */}
      <div className="space-y-3">
        {challenge.options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;
          const letter = String.fromCharCode(65 + idx); // A, B, C, D

          let optionStyle = 'bg-[#F7F5EE] border-[#E9E5D9] hover:border-[#D4A373] hover:bg-[#FDFCF6]';
          if (isSelected) {
            optionStyle = 'bg-[#FDFCF6] border-[#D4A373] ring-2 ring-[#D4A373]/30 shadow-xs';
          }
          if (hasSubmitted) {
            if (option.isCorrect) {
              optionStyle = 'bg-[#EBF2EC] border-[#486B4F] text-[#1E3B24] ring-2 ring-[#486B4F]/30';
            } else if (isSelected && !option.isCorrect) {
              optionStyle = 'bg-[#FDF2F0] border-[#8C3A32] text-[#5C1A14]';
            }
          }

          return (
            <div
              key={option.id}
              id={`challenge-option-${option.id}`}
              onClick={() => handleSelectOption(option.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${optionStyle}`}
            >
              <span className={`w-8 h-8 rounded-xl text-xs font-serif font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                isSelected
                  ? 'bg-[#1A1A1A] text-[#FDFCF6]'
                  : 'bg-[#E9E5D9] text-[#1A1A1A]'
              }`}>
                {letter}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A] leading-relaxed">
                  {option.text}
                </p>

                {/* Immediate feedback if submitted */}
                {hasSubmitted && (
                  <div className={`mt-3 pt-2.5 border-t text-xs leading-relaxed ${
                    option.isCorrect ? 'border-[#C8DEC9] text-[#2F5236] font-medium' : 'border-[#F0CEC7] text-[#8C3A32]'
                  }`}>
                    <div className="flex items-start gap-1.5">
                      {option.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-[#486B4F] shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#8C3A32] shrink-0 mt-0.5" />
                      )}
                      <span>{option.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-[#777] flex items-center gap-1.5 font-serif">
          <HelpCircle className="w-4 h-4 text-[#8C6D4F]" />
          <span>Select the most idiomatic Python approach</span>
        </div>

        {!hasSubmitted ? (
          <button
            id="submit-challenge-btn"
            disabled={!selectedOptionId}
            onClick={handleSubmit}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              selectedOptionId
                ? 'bg-[#1A1A1A] hover:bg-[#D4A373] text-[#FDFCF6] hover:text-[#1A1A1A] border border-[#1A1A1A] shadow-md'
                : 'bg-[#E9E5D9] text-[#AAA] cursor-not-allowed'
            }`}
          >
            <span>Verify Answer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {!selectedOption?.isCorrect && (
              <button
                onClick={handleRetry}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F7F5EE] border border-[#E9E5D9] text-[#1A1A1A] hover:bg-[#E9E5D9] transition-colors cursor-pointer"
              >
                Try Again
              </button>
            )}

            {selectedOption?.isCorrect && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EBF2EC] text-[#486B4F] text-xs font-bold border border-[#C8DEC9]">
                <Sparkles className="w-4 h-4 text-[#486B4F]" />
                <span>Story Mastered!</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Conceptual Takeaway Box on Success */}
      {hasSubmitted && selectedOption?.isCorrect && (
        <div className="p-5 rounded-3xl bg-[#FAF4EB] border border-[#E8D7C2] text-[#5A4532] text-xs leading-relaxed flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
          <div>
            <strong className="block text-[#1A1A1A] font-serif font-bold text-sm mb-0.5">Core Engineering Takeaway:</strong>
            <span className="font-serif text-[#5A4532] text-xs leading-relaxed">{challenge.conceptualTakeaway}</span>
          </div>
        </div>
      )}
    </div>
  );
};
