import React, { useState, useEffect } from 'react';
import { Lesson } from '../types';
import { StoryMap } from './StoryMap';
import { SceneContainer } from './SceneContainer';
import { ArrowLeft, ArrowRight, RotateCcw, Check, Sparkles, Home, Bookmark } from 'lucide-react';
import { sound } from '../utils/audio';

interface StoryPlayerProps {
  lesson: Lesson;
  storyMode: 'story' | 'technical';
  onToggleMode: () => void;
  onBackToHome: () => void;
  onCompleteLesson: (lessonId: string) => void;
  isCompleted?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (lessonId: string) => void;
}

export const StoryPlayer: React.FC<StoryPlayerProps> = ({
  lesson,
  storyMode,
  onToggleMode,
  onBackToHome,
  onCompleteLesson,
  isCompleted,
  isBookmarked,
  onToggleBookmark
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const scenes = lesson.scenes;
  const currentScene = scenes[currentSceneIndex] || scenes[0];

  const hasPrev = currentSceneIndex > 0;
  const hasNext = currentSceneIndex < scenes.length - 1;
  const isFinalScene = currentSceneIndex === scenes.length - 1;

  const goToNext = () => {
    if (hasNext) {
      sound.playClick();
      setCurrentSceneIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrev = () => {
    if (hasPrev) {
      sound.playClick();
      setCurrentSceneIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const restartStory = () => {
    sound.playClick();
    setCurrentSceneIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLessonCompleted = () => {
    onCompleteLesson(lesson.id);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && hasNext) {
        goToNext();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSceneIndex, hasNext, hasPrev]);

  return (
    <div id="story-player-root" className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-[#FDFCF6]">
      {/* Story Map Bar */}
      <StoryMap
        scenes={scenes}
        currentSceneIndex={currentSceneIndex}
        onSelectScene={(idx) => {
          setCurrentSceneIndex(idx);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <SceneContainer
          scene={currentScene}
          lesson={lesson}
          storyMode={storyMode}
          onToggleMode={onToggleMode}
          onLessonCompleted={handleLessonCompleted}
          isLessonCompleted={isCompleted}
        />
      </main>

      {/* Persistent Bottom Controls Bar */}
      <div id="story-bottom-nav" className="sticky bottom-0 z-30 bg-[#FDFCF6]/95 backdrop-blur-md border-t border-[#E9E5D9] shadow-md py-3.5 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Left Actions: Restart & Home */}
          <div className="flex items-center gap-2">
            <button
              id="story-restart-btn"
              onClick={restartStory}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#666] hover:text-[#1A1A1A] hover:bg-[#E9E5D9]/70 transition-colors cursor-pointer"
              title="Restart story from Scene 1"
            >
              <RotateCcw className="w-4 h-4 text-[#8C6D4F]" />
              <span className="hidden sm:inline">Restart</span>
            </button>

            {onToggleBookmark && (
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleBookmark(lesson.id);
                }}
                className={`p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'text-[#8C6D4F] bg-[#E9E5D9] hover:bg-[#E2DDD0]'
                    : 'text-[#888] hover:text-[#1A1A1A] hover:bg-[#E9E5D9]/50'
                }`}
                title={isBookmarked ? 'Saved to bookmarks' : 'Bookmark story'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-[#D4A373]' : ''}`} />
              </button>
            )}
          </div>

          {/* Center: Scene counter */}
          <div className="text-xs font-serif font-semibold text-[#8C6D4F]">
            <span>Scene {currentSceneIndex + 1} of {scenes.length}</span>
          </div>

          {/* Right Actions: Prev & Next */}
          <div className="flex items-center gap-2">
            <button
              id="story-prev-btn"
              disabled={!hasPrev}
              onClick={goToPrev}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                hasPrev
                  ? 'bg-[#F7F5EE] border border-[#E9E5D9] text-[#1A1A1A] hover:bg-[#E9E5D9] shadow-xs'
                  : 'bg-[#E9E5D9]/40 text-[#AAA] border border-[#E9E5D9]/50 cursor-not-allowed'
              }`}
            >
              <ArrowLeft className="w-4 h-4 text-[#8C6D4F]" />
              <span>Previous</span>
            </button>

            {!isFinalScene ? (
              <button
                id="story-next-btn"
                onClick={goToNext}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#D4A373] text-[#FDFCF6] hover:text-[#1A1A1A] border border-[#1A1A1A] shadow-md transition-all cursor-pointer"
              >
                <span>Next Scene</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="story-finish-btn"
                onClick={() => {
                  sound.playSuccess();
                  handleLessonCompleted();
                  onBackToHome();
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#486B4F] hover:bg-[#3C5B42] text-[#FDFCF6] shadow-md transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Finish & Return</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
