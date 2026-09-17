import { UserProgress, RecentConversation, ConversationLesson } from '../types';

const STORAGE_KEY = 'pythontales_progress_v1';
const RECENTS_STORAGE_KEY = 'python_recent_conversations_v2';
const CUSTOM_LESSONS_STORAGE_KEY = 'python_custom_lessons_v1';

const DEFAULT_PROGRESS: UserProgress = {
  completedLessonIds: [],
  storyMode: 'story',
  challengeScores: {},
  bookmarkedLessonIds: [],
  completedCustomTopics: [],
  streakDays: 1
};

// Seed initial recent conversation if user has never visited
const INITIAL_SEED_RECENTS: RecentConversation[] = [
  {
    lessonId: 'pandas-conversation',
    topic: 'Pandas',
    title: 'Data Wrangling & Analysis',
    tagline: 'How Ayushi learned to query 10,000 customer records in 1 line of Python.',
    category: 'Data Science',
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    currentTurnIndex: 2,
    totalTurns: 6,
    isFinished: false,
    lastAccessedAt: Date.now() - 1000 * 60 * 14 // 14 mins ago
  }
];

export function loadRecentConversations(): RecentConversation[] {
  try {
    const raw = localStorage.getItem(RECENTS_STORAGE_KEY);
    if (raw === null) {
      // First-time visit: seed initial recent item so user immediately experiences pick up where left off
      try {
        localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify(INITIAL_SEED_RECENTS));
      } catch {}
      return INITIAL_SEED_RECENTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => (b.lastAccessedAt || 0) - (a.lastAccessedAt || 0));
  } catch {
    return [];
  }
}

export function saveRecentConversation(
  lesson: ConversationLesson,
  currentTurnIndex: number,
  isFinished?: boolean
): RecentConversation[] {
  try {
    const currentList = loadRecentConversations();
    const existingIndex = currentList.findIndex(item => item.lessonId === lesson.id);

    const updatedItem: RecentConversation = {
      lessonId: lesson.id,
      topic: lesson.topic,
      title: lesson.title,
      tagline: lesson.tagline,
      category: lesson.category,
      difficulty: lesson.difficulty,
      estimatedMinutes: lesson.estimatedMinutes,
      currentTurnIndex: Math.max(0, currentTurnIndex),
      totalTurns: lesson.turns.length,
      isFinished: isFinished !== undefined ? isFinished : currentTurnIndex >= lesson.turns.length,
      lastAccessedAt: Date.now(),
      // If it's a custom-generated lesson, preserve it in the record
      customLesson: lesson.id.startsWith('conv-') ? lesson : undefined
    };

    let nextList: RecentConversation[];
    if (existingIndex >= 0) {
      nextList = [...currentList];
      nextList[existingIndex] = updatedItem;
    } else {
      nextList = [updatedItem, ...currentList];
    }

    // Sort by most recently accessed and keep at most 8 items
    nextList.sort((a, b) => b.lastAccessedAt - a.lastAccessedAt);
    nextList = nextList.slice(0, 8);

    localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify(nextList));
    return nextList;
  } catch (err) {
    console.error('Failed to save recent conversation', err);
    return [];
  }
}

export function removeRecentConversation(lessonId: string): RecentConversation[] {
  try {
    const currentList = loadRecentConversations();
    const nextList = currentList.filter(item => item.lessonId !== lessonId);
    localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify(nextList));
    return nextList;
  } catch {
    return [];
  }
}

export function clearRecentConversations(): void {
  try {
    localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear recent conversations', err);
  }
}

export function getSavedTurnIndex(lessonId: string): number | null {
  try {
    const list = loadRecentConversations();
    const found = list.find(item => item.lessonId === lessonId);
    if (!found) return null;
    return typeof found.currentTurnIndex === 'number' ? found.currentTurnIndex : 0;
  } catch {
    return null;
  }
}

export function loadCustomLessons(): ConversationLesson[] {
  try {
    const raw = localStorage.getItem(CUSTOM_LESSONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomLesson(lesson: ConversationLesson): void {
  try {
    const existing = loadCustomLessons();
    const filtered = existing.filter(l => l.id !== lesson.id);
    const updated = [lesson, ...filtered].slice(0, 10);
    localStorage.setItem(CUSTOM_LESSONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save custom lesson', err);
  }
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }
}

export function markLessonComplete(lessonId: string): UserProgress {
  const current = loadProgress();
  if (!current.completedLessonIds.includes(lessonId)) {
    current.completedLessonIds.push(lessonId);
    saveProgress(current);
  }
  return current;
}

export function toggleBookmark(lessonId: string): UserProgress {
  const current = loadProgress();
  if (current.bookmarkedLessonIds.includes(lessonId)) {
    current.bookmarkedLessonIds = current.bookmarkedLessonIds.filter(id => id !== lessonId);
  } else {
    current.bookmarkedLessonIds.push(lessonId);
  }
  saveProgress(current);
  return current;
}
