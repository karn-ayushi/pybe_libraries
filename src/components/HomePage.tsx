import React, { useState, useMemo } from 'react';
import { Lesson, LessonCategory } from '../types';
import { StoryCard } from './StoryCard';
import { Search, Sparkles, Compass, Filter, BookOpen, Layers, CheckCircle2, Flame, Award } from 'lucide-react';
import { sound } from '../utils/audio';

interface HomePageProps {
  lessons: Lesson[];
  onStartStory: (lesson: Lesson) => void;
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  onToggleBookmark: (lessonId: string) => void;
  onOpenGenerator: () => void;
}

const CATEGORIES: ('All' | LessonCategory)[] = [
  'All',
  'Python Basics',
  'Data Science',
  'Web Development',
  'Automation',
  'Data Visualization',
  'Machine Learning'
];

export const HomePage: React.FC<HomePageProps> = ({
  lessons,
  onStartStory,
  completedLessonIds,
  bookmarkedLessonIds,
  onToggleBookmark,
  onOpenGenerator
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      // Category filter
      if (selectedCategory !== 'All' && lesson.category !== selectedCategory) {
        return false;
      }
      // Difficulty filter
      if (difficultyFilter !== 'All' && lesson.difficulty !== difficultyFilter) {
        return false;
      }
      // Bookmarks only
      if (onlyBookmarks && !bookmarkedLessonIds.includes(lesson.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = lesson.title.toLowerCase().includes(q);
        const matchesTopic = lesson.topic.toLowerCase().includes(q);
        const matchesTagline = lesson.tagline.toLowerCase().includes(q);
        const matchesCategory = lesson.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTopic && !matchesTagline && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [lessons, selectedCategory, difficultyFilter, onlyBookmarks, searchQuery, bookmarkedLessonIds]);

  const featuredLesson = lessons[0]; // The Pandas Flagship story

  return (
    <div id="home-page-container" className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-[#1A1A1A] text-[#FDFCF6] p-6 sm:p-10 border border-[#D4A373]/30 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A373]/15 border border-[#D4A373]/40 text-[#D4A373] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Story-First Learning Pedagogy</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[#FDFCF6] leading-tight">
            Learn Python Through Real-World Stories.
          </h1>

          <p className="text-sm sm:text-base text-[#DCD6C8] leading-relaxed max-w-2xl font-normal">
            No dry syntax or abstract definitions. Step into the shoes of engineers, dispatchers, and detectives solving real bottlenecks. Understand <strong className="text-[#D4A373]">WHY</strong> each concept was created before writing code.
          </p>

          {/* Quick Stats Banner */}
          <div className="pt-3 flex items-center gap-6 text-xs text-[#C5BDB0] flex-wrap font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4A373] animate-pulse" />
              <span><strong className="text-[#FDFCF6]">5</strong> Master Stories Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Generate Any Topic with AI</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Interactive 11-Scene Sandbox</span>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Featured Story Card */}
      {featuredLesson && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4A373]" />
              <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">Featured Flagship Story</h2>
            </div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#8C6D4F]">Curated Masterpiece</span>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#F7F5EE] border border-[#E9E5D9] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] bg-[#E9E5D9] px-2.5 py-1 rounded-lg border border-[#D4A373]/30">
                  Topic: {featuredLesson.topic}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A7A60] bg-[#EBF2EC] px-2.5 py-1 rounded-lg border border-[#C8DEC9]">
                  {featuredLesson.difficulty}
                </span>
                <span className="text-xs text-[#666] font-medium">
                  {featuredLesson.estimatedMinutes} min duration
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] leading-snug">
                {featuredLesson.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#555] leading-relaxed italic font-serif">
                "{featuredLesson.tagline}"
              </p>

              {/* Character Avatars */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6D4F]">Cast:</span>
                <div className="flex items-center gap-1.5">
                  {featuredLesson.characters.map((c) => (
                    <span
                      key={c.id}
                      className="px-2.5 py-1 rounded-lg bg-[#FDFCF6] border border-[#E9E5D9] text-xs font-medium text-[#1A1A1A] shadow-2xs"
                    >
                      {c.avatarEmoji} {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              id="featured-start-btn"
              onClick={() => {
                sound.playClick();
                onStartStory(featuredLesson);
              }}
              className="px-6 py-3 rounded-2xl bg-[#1A1A1A] hover:bg-[#D4A373] text-[#FDFCF6] hover:text-[#1A1A1A] font-bold text-xs uppercase tracking-wider border border-[#1A1A1A] shadow-md transition-all shrink-0 cursor-pointer"
            >
              {completedLessonIds.includes(featuredLesson.id) ? 'Replay Flagship' : 'Begin Flagship Story'}
            </button>
          </div>
        </section>
      )}

      {/* Search & Filters Section */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8C6D4F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="library-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search story, topic, or role (e.g. Pandas, Loops, API)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E9E5D9] bg-[#F7F5EE] text-xs font-medium text-[#1A1A1A] placeholder:text-[#999] focus:outline-hidden focus:ring-2 focus:ring-[#D4A373]/30 focus:border-[#D4A373] shadow-2xs transition-all"
            />
          </div>

          {/* Difficulty & Bookmark toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-[#E9E5D9] bg-[#F7F5EE] text-[#1A1A1A] shadow-2xs"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <button
              onClick={() => {
                sound.playClick();
                setOnlyBookmarks(!onlyBookmarks);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                onlyBookmarks
                  ? 'bg-[#E9E5D9] text-[#1A1A1A] border-[#D4A373] shadow-2xs'
                  : 'bg-[#F7F5EE] text-[#666] border-[#E9E5D9] hover:bg-[#E9E5D9]'
              }`}
            >
              Saved ({bookmarkedLessonIds.length})
            </button>

            <button
              id="home-create-story-btn"
              onClick={() => {
                sound.playClick();
                onOpenGenerator();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#D4A373] text-[#FDFCF6] hover:text-[#1A1A1A] text-xs font-bold border border-[#1A1A1A] shadow-2xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Generate Topic</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1A1A] text-[#FDFCF6] shadow-xs border border-[#1A1A1A]'
                    : 'bg-[#F7F5EE] text-[#666] hover:text-[#1A1A1A] border border-[#E9E5D9] hover:bg-[#E9E5D9]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Story Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
            {selectedCategory === 'All' ? 'Master Story Library' : `${selectedCategory} Stories`}
            <span className="text-xs font-sans font-normal text-[#777] ml-2">
              ({filteredLessons.length} {filteredLessons.length === 1 ? 'story' : 'stories'})
            </span>
          </h2>
        </div>

        {filteredLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLessons.map((lesson) => (
              <StoryCard
                key={lesson.id}
                lesson={lesson}
                onStartStory={onStartStory}
                isCompleted={completedLessonIds.includes(lesson.id)}
                isBookmarked={bookmarkedLessonIds.includes(lesson.id)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-[#F7F5EE] rounded-3xl border border-[#E9E5D9] space-y-3">
            <BookOpen className="w-10 h-10 text-[#D4A373] mx-auto" />
            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">No Stories Found</h3>
            <p className="text-xs text-[#666] max-w-sm mx-auto">
              No existing story matches your filters. You can use the AI Story Studio to generate an interactive story on this topic right now!
            </p>
            <button
              onClick={() => onOpenGenerator()}
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#D4A373] text-[#FDFCF6] hover:text-[#1A1A1A] rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Generate Story with AI
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
