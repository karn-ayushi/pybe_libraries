import React from 'react';
import { Character } from '../types';
import { Info, Target, Cpu } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  isFocused?: boolean;
  onSelect?: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isFocused,
  onSelect
}) => {
  return (
    <div
      id={`character-card-${character.id}`}
      onClick={onSelect}
      className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${
        isFocused
          ? 'bg-[#FDFCF6] border-[#D4A373] ring-2 ring-[#D4A373]/30 shadow-md'
          : 'bg-[#F7F5EE] border-[#E9E5D9] hover:border-[#D4A373] hover:shadow-xs'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar badge */}
        <div className="w-14 h-14 rounded-2xl bg-[#FDFCF6] flex items-center justify-center text-3xl shadow-2xs border border-[#E9E5D9] shrink-0">
          {character.avatarEmoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">{character.name}</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold border bg-[#E9E5D9] text-[#1A1A1A] border-[#D4A373]/30">
              {character.role}
            </span>
          </div>

          {/* Represents Technically */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C6D4F] mb-2.5 bg-[#FAF4EB] px-2.5 py-1 rounded-lg border border-[#E8D7C2] w-fit">
            <Cpu className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>Represents: {character.represents}</span>
          </div>

          {/* Goal / Responsibility */}
          <div className="text-xs text-[#555] space-y-1 font-normal">
            <div className="flex items-start gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#8C6D4F] shrink-0 mt-0.5" />
              <span><strong className="text-[#1A1A1A]">Mission:</strong> {character.whatTheyNeedToAccomplish}</span>
            </div>
          </div>

          {/* Quote if any */}
          {character.quote && (
            <div className="mt-3 pt-2.5 border-t border-[#E9E5D9] text-xs italic font-serif text-[#666] flex items-center gap-1.5">
              <span>"{character.quote}"</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
