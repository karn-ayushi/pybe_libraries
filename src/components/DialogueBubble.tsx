import React from 'react';
import { Character } from '../types';

interface DialogueBubbleProps {
  dialogue: {
    characterId: string;
    speech: string;
    mood?: 'worried' | 'excited' | 'thinking' | 'triumphant' | 'explaining';
  };
  character?: Character;
}

export const DialogueBubble: React.FC<DialogueBubbleProps> = ({
  dialogue,
  character
}) => {
  const emoji = character?.avatarEmoji || '💬';
  const name = character?.name || 'Story Character';
  const role = character?.role || '';

  const getMoodBadge = (mood?: string) => {
    switch (mood) {
      case 'worried':
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF4EB] text-[#8C6D4F] border border-[#E8D7C2]">Concerned ⚠️</span>;
      case 'excited':
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EBF2EC] text-[#486B4F] border border-[#C8DEC9]">Excited ✨</span>;
      case 'thinking':
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EBF2F7] text-[#48667A] border border-[#C9DCE8]">Thinking 💡</span>;
      case 'triumphant':
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F4ECF5] text-[#78487A] border border-[#DEC4E0]">Triumphant 🏆</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start gap-3.5 my-3 p-4 rounded-2xl bg-[#F7F5EE] border border-[#E9E5D9] shadow-xs max-w-2xl">
      {/* Avatar */}
      <div className="w-11 h-11 rounded-xl bg-[#FDFCF6] border border-[#E9E5D9] flex items-center justify-center text-2xl shrink-0">
        {emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-serif text-sm font-bold text-[#1A1A1A]">{name}</span>
          {role && <span className="text-[11px] text-[#666] font-medium font-sans">({role})</span>}
          {getMoodBadge(dialogue.mood)}
        </div>
        <p className="text-sm text-[#333] leading-relaxed font-serif italic">
          "{dialogue.speech}"
        </p>
      </div>
    </div>
  );
};
