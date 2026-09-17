import React from 'react';
import { ConversationLesson } from '../types';
import { X, BookOpen, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { CharacterAvatar } from './CharacterAvatar';

interface TopicPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: ConversationLesson[];
  activeLessonId: string;
  onSelectLesson: (lesson: ConversationLesson) => void;
  onOpenGenerator: () => void;
}

export const TopicPickerModal: React.FC<TopicPickerModalProps> = ({
  isOpen,
  onClose,
  lessons,
  activeLessonId,
  onSelectLesson,
  onOpenGenerator
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="topic-picker-modal"
        className="relative w-full max-w-xl bg-[#FDFCF7] dark:bg-[#16161A] rounded-3xl border border-[#DDD7C8] dark:border-[#2D2D38] shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] flex flex-col transition-colors"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#EAE4D5] dark:border-[#2A2A34]">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <CharacterAvatar character="Ayushi" size="sm" className="ring-2 ring-[#FDFCF7] dark:ring-[#16161A]" />
              <CharacterAvatar character="Ayush" size="sm" className="ring-2 ring-[#FDFCF7] dark:ring-[#16161A]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                Python Library Dialogues
              </h2>
              <p className="text-xs text-[#666] dark:text-[#A1A1AA] font-serif italic">
                Choose a Python library story to explore with Ayushi & Ayush
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#777] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#EAE4D5] dark:hover:bg-[#25252E] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topics List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {lessons.map((l) => {
            const isSelected = l.id === activeLessonId;
            return (
              <button
                key={l.id}
                onClick={() => {
                  onSelectLesson(l);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#FAF4EB] dark:bg-[#2A1E18] border-[#F97316] shadow-xs ring-2 ring-[#F97316]/30'
                    : 'bg-[#F9F6F0] dark:bg-[#1C1C22] border-[#E8E2D4] dark:border-[#2D2D38] hover:border-[#F97316] hover:bg-[#FAF4EB] dark:hover:bg-[#25252E]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif text-sm font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                      {l.topic}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D4F] dark:text-[#FB923C] bg-[#FAF4EB] dark:bg-[#281814] px-2 py-0.5 rounded-md border border-[#E8D7C2] dark:border-[#4E2412]">
                      {l.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-[#666] dark:text-[#A1A1AA] font-serif line-clamp-1">
                    {l.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-mono text-[#888] dark:text-[#A1A1AA] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{l.estimatedMinutes}m</span>
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-[#EAE4D5] dark:bg-[#2A2A34] flex items-center justify-center text-[#1A1A1A] dark:text-[#F4F4F5]">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Generator Trigger */}
        <div className="pt-4 border-t border-[#EAE4D5] dark:border-[#2A2A34] flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-[#666] dark:text-[#A1A1AA] font-serif">
            Want to learn a different Python library?
          </p>
          <button
            onClick={() => {
              onClose();
              onOpenGenerator();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#EA580C] hover:to-[#DB2777] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Generate Library Dialogue</span>
          </button>
        </div>
      </div>
    </div>
  );
};

