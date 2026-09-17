import React from 'react';
import { CharacterProfile } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { Coffee, Heart, Sparkles } from 'lucide-react';

interface TwoCharacterStageProps {
  learner: CharacterProfile;
  guide: CharacterProfile;
  activeSpeaker: 'learner' | 'guide';
}

export const TwoCharacterStage: React.FC<TwoCharacterStageProps> = ({
  learner,
  guide,
  activeSpeaker
}) => {
  const isLearnerSpeaking = activeSpeaker === 'learner';
  const isGuideSpeaking = activeSpeaker === 'guide';

  return (
    <section aria-label="Conversation Participants" className="w-full max-w-4xl mx-auto px-4 py-3 sm:py-5">
      <div className="p-4 sm:p-5 rounded-3xl bg-[#FFFDF9]/80 dark:bg-[#1A191E]/80 backdrop-blur-sm border border-[#F5E8D6] dark:border-[#382E26] shadow-xs">
        <div className="flex items-center justify-between gap-3">
          {/* Character 1 — Ayushi */}
          <div
            className={`flex items-center gap-3 transition-all duration-300 ${
              isLearnerSpeaking
                ? 'scale-102 opacity-100'
                : 'opacity-75'
            }`}
          >
            <div className="relative">
              <CharacterAvatar
                character={learner.name}
                size="lg"
                isSpeaking={isLearnerSpeaking}
                className="shadow-xs"
              />
              {isLearnerSpeaking && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EC4899] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EC4899]" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                  {learner.name}
                </h2>
                <span className="text-[10px] font-sans font-semibold text-[#DB2777] dark:text-[#F472B6] bg-[#FDF2F8] dark:bg-[#2A1522] px-2 py-0.5 rounded-full border border-[#FBCFE8] dark:border-[#521B3A]">
                  Friend 🌸
                </span>
              </div>
              <p className="text-xs text-[#786C5E] dark:text-[#A1A1AA] font-serif italic">
                {isLearnerSpeaking ? 'Discussing with Ayush...' : 'Listening intently...'}
              </p>
            </div>
          </div>

          {/* Center Connection: Tea Break & Mutual Friendship */}
          <div className="hidden sm:flex flex-col items-center gap-1 text-center select-none">
            <div className="flex items-center gap-1.5 text-xs text-[#EA580C] dark:text-[#FB923C] font-serif">
              <span className="w-8 h-[1px] bg-[#FED7AA] dark:bg-[#52291B]" />
              <Coffee className="w-3.5 h-3.5 text-[#EA580C] dark:text-[#FB923C]" />
              <span className="text-[11px] font-bold tracking-wide">Friends' Python Desk</span>
              <span className="w-8 h-[1px] bg-[#FED7AA] dark:bg-[#52291B]" />
            </div>
            <span className="text-[10px] text-[#888] dark:text-[#777] italic font-serif">
              Two friends discussing Python • Learning together
            </span>
          </div>

          {/* Character 2 — Ayush */}
          <div
            className={`flex items-center gap-3 flex-row-reverse text-right transition-all duration-300 ${
              isGuideSpeaking
                ? 'scale-102 opacity-100'
                : 'opacity-75'
            }`}
          >
            <div className="relative">
              <CharacterAvatar
                character={guide.name}
                size="lg"
                isSpeaking={isGuideSpeaking}
                className="shadow-xs"
              />
              {isGuideSpeaking && (
                <span className="absolute -top-1 -left-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F97316]" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-[10px] font-sans font-semibold text-[#C2410C] dark:text-[#FB923C] bg-[#FFF7ED] dark:bg-[#281812] px-2 py-0.5 rounded-full border border-[#FED7AA] dark:border-[#52291B]">
                  Friend ☕
                </span>
                <h2 className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                  {guide.name}
                </h2>
              </div>
              <p className="text-xs text-[#786C5E] dark:text-[#A1A1AA] font-serif italic">
                {isGuideSpeaking ? 'Discussing with Ayushi...' : 'Listening intently...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

