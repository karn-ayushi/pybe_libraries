import React from 'react';
import { Lesson } from '../types';
import { Clock, Briefcase, CheckCircle, ArrowRight, Bookmark, Sparkles, Database, Repeat, BookOpen, Globe, Cpu } from 'lucide-react';
import { sound } from '../utils/audio';

interface StoryCardProps {
  lesson: Lesson;
  onStartStory: (lesson: Lesson) => void;
  isCompleted?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (lessonId: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  lesson,
  onStartStory,
  isCompleted,
  isBookmarked,
  onToggleBookmark
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Database': return <Database className="w-5 h-5 text-[#D4A373]" />;
      case 'Repeat': return <Repeat className="w-5 h-5 text-[#D4A373]" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-[#D4A373]" />;
      case 'Globe': return <Globe className="w-5 h-5 text-[#D4A373]" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-[#D4A373]" />;
      default: return <Sparkles className="w-5 h-5 text-[#D4A373]" />;
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EBF2EC] text-[#486B4F] border border-[#C8DEC9]">Beginner</span>;
      case 'Intermediate':
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF4EB] text-[#8C6D4F] border border-[#E8D7C2]">Intermediate</span>;
      case 'Advanced':
        return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F4ECF5] text-[#78487A] border border-[#DEC4E0]">Advanced</span>;
      default:
        return null;
    }
  };

  return (
    <div
      id={`story-card-${lesson.id}`}
      className="group relative bg-[#F7F5EE] rounded-3xl border border-[#E9E5D9] shadow-xs hover:shadow-xl hover:border-[#D4A373] transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FDFCF6] border border-[#E9E5D9] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              {getIcon(lesson.icon)}
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#8C6D4F] uppercase tracking-wider block">
                Learn: {lesson.topic}
              </span>
              <span className="text-[11px] text-[#777] font-medium">
                {lesson.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {getDifficultyBadge(lesson.difficulty)}
            {onToggleBookmark && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  onToggleBookmark(lesson.id);
                }}
                className="p-1.5 rounded-lg text-[#888] hover:text-[#D4A373] hover:bg-[#E9E5D9]/70 transition-colors cursor-pointer"
                title="Bookmark"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#D4A373] text-[#D4A373]' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] group-hover:text-[#8C6D4F] transition-colors leading-snug mb-1.5">
          {lesson.title}
        </h3>
        <p className="text-xs text-[#555] italic font-serif leading-relaxed mb-4 line-clamp-2">
          "{lesson.tagline}"
        </p>

        {/* Characters Preview Avatars */}
        <div className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-[#FDFCF6] border border-[#E9E5D9] mb-3">
          <span className="text-[10px] font-bold text-[#8C6D4F] uppercase tracking-widest mr-1">Cast:</span>
          <div className="flex items-center -space-x-1.5">
            {lesson.characters.map((char) => (
              <span
                key={char.id}
                className="w-6 h-6 rounded-full bg-[#F7F5EE] border border-[#E9E5D9] flex items-center justify-center text-xs shadow-2xs"
                title={`${char.name} (${char.role})`}
              >
                {char.avatarEmoji}
              </span>
            ))}
          </div>
          <span className="text-[11px] text-[#666] ml-2 font-medium">
            {lesson.characters.length} characters
          </span>
        </div>

        {/* Job role pill if available */}
        {lesson.jobRole && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#666]">
            <Briefcase className="w-3.5 h-3.5 text-[#8C6D4F] shrink-0" />
            <span className="truncate">Role: {lesson.jobRole.title} ({lesson.jobRole.industry})</span>
          </div>
        )}
      </div>

      {/* Footer / CTA */}
      <div className="p-4 bg-[#E9E5D9]/50 border-t border-[#E9E5D9] flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-[#666] font-medium">
          <Clock className="w-3.5 h-3.5 text-[#8C6D4F]" />
          <span>{lesson.estimatedMinutes} min story</span>
          {isCompleted && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#486B4F] bg-[#EBF2EC] border border-[#C8DEC9] px-2 py-0.5 rounded-full ml-1">
              <CheckCircle className="w-3 h-3" />
              <span>Mastered</span>
            </span>
          )}
        </div>

        <button
          id={`start-story-btn-${lesson.id}`}
          onClick={() => {
            sound.playClick();
            onStartStory(lesson);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A1A1A] group-hover:bg-[#D4A373] text-[#FDFCF6] group-hover:text-[#1A1A1A] text-xs font-bold border border-[#1A1A1A] group-hover:border-[#D4A373] shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <span>{isCompleted ? 'Replay' : 'Start Story'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
