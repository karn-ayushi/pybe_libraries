export interface StreakData {
  streakDays: number;
  lastPracticeDate: string; // 'YYYY-MM-DD'
  todayPracticed: boolean;
  practiceHistory: string[]; // List of 'YYYY-MM-DD'
  lastTopicPracticed?: string;
  totalPracticedDays: number;
}

const STREAK_STORAGE_KEY = 'pythontales_streak_v1';
const STREAK_CHANGE_EVENT = 'pythontales_streak_changed';

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates calendar day difference between two 'YYYY-MM-DD' strings.
 * Returns > 0 if dateStr2 is after dateStr1.
 */
export function getDayDifference(dateStr1: string, dateStr2: string): number {
  if (!dateStr1 || !dateStr2) return 0;
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((utc2 - utc1) / msPerDay);
}

/**
 * Loads current streak data from localStorage, recalculating today's status
 * and streak preservation based on elapsed days.
 */
export function getStreakData(): StreakData {
  const today = getLocalDateString();
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) {
      // First visit: initialize with 1-day streak for today's initial session
      const initial: StreakData = {
        streakDays: 1,
        lastPracticeDate: today,
        todayPracticed: true,
        practiceHistory: [today],
        lastTopicPracticed: 'Pandas',
        totalPracticedDays: 1
      };
      try {
        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(initial));
      } catch {}
      return initial;
    }

    const parsed: Partial<StreakData> = JSON.parse(raw);
    const lastDate = parsed.lastPracticeDate || '';
    const storedStreak = typeof parsed.streakDays === 'number' ? parsed.streakDays : 1;
    const history = Array.isArray(parsed.practiceHistory) ? parsed.practiceHistory : (lastDate ? [lastDate] : [today]);
    const totalDays = typeof parsed.totalPracticedDays === 'number' ? parsed.totalPracticedDays : Math.max(1, history.length);

    if (!lastDate) {
      return {
        streakDays: 1,
        lastPracticeDate: today,
        todayPracticed: true,
        practiceHistory: [today],
        lastTopicPracticed: parsed.lastTopicPracticed || 'Pandas',
        totalPracticedDays: 1
      };
    }

    const diff = getDayDifference(lastDate, today);

    if (diff === 0) {
      // Practiced today!
      return {
        streakDays: Math.max(1, storedStreak),
        lastPracticeDate: today,
        todayPracticed: true,
        practiceHistory: history.includes(today) ? history : [...history, today],
        lastTopicPracticed: parsed.lastTopicPracticed,
        totalPracticedDays: totalDays
      };
    } else if (diff === 1) {
      // Practiced yesterday; streak is intact, but today is not yet practiced
      return {
        streakDays: Math.max(1, storedStreak),
        lastPracticeDate: lastDate,
        todayPracticed: false,
        practiceHistory: history,
        lastTopicPracticed: parsed.lastTopicPracticed,
        totalPracticedDays: totalDays
      };
    } else {
      // Missed more than 1 day; streak reset
      return {
        streakDays: 0,
        lastPracticeDate: lastDate,
        todayPracticed: false,
        practiceHistory: history,
        lastTopicPracticed: parsed.lastTopicPracticed,
        totalPracticedDays: totalDays
      };
    }
  } catch (err) {
    console.error('Failed to parse streak data', err);
    return {
      streakDays: 1,
      lastPracticeDate: today,
      todayPracticed: true,
      practiceHistory: [today],
      totalPracticedDays: 1
    };
  }
}

/**
 * Records a practice action for a Python topic today.
 * Advances streak if consecutive day, or initializes/preserves streak.
 */
export function recordPractice(topicName?: string): StreakData {
  const today = getLocalDateString();
  const current = getStreakData();
  const diff = current.lastPracticeDate ? getDayDifference(current.lastPracticeDate, today) : 0;

  let newStreak = current.streakDays;
  let newTotal = current.totalPracticedDays;
  const historySet = new Set(current.practiceHistory);

  if (current.todayPracticed) {
    // Already counted today
    newStreak = Math.max(1, current.streakDays);
  } else {
    // First practice today
    if (diff === 1) {
      // Consecutive from yesterday
      newStreak = current.streakDays + 1;
    } else {
      // Restart streak
      newStreak = 1;
    }
    newTotal += 1;
  }

  historySet.add(today);

  const updated: StreakData = {
    streakDays: newStreak,
    lastPracticeDate: today,
    todayPracticed: true,
    practiceHistory: Array.from(historySet).sort(),
    lastTopicPracticed: topicName || current.lastTopicPracticed || 'Python',
    totalPracticedDays: Math.max(newStreak, newTotal)
  };

  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(STREAK_CHANGE_EVENT, { detail: updated }));
  } catch (err) {
    console.error('Failed to save streak', err);
  }

  return updated;
}

/**
 * Helper to get status of the last 7 days for the mini-calendar preview.
 */
export function getRecentDaysStatus(history: string[] = []): {
  date: string;
  dayName: string;
  dayShort: string;
  dayNumber: number;
  isPracticed: boolean;
  isToday: boolean;
}[] {
  const days = [];
  const todayStr = getLocalDateString();
  const historySet = new Set(history);

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getLocalDateString(d);
    const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
    const dayShort = dayName.slice(0, 1);
    const dayNumber = d.getDate();
    const isToday = dateStr === todayStr;
    const isPracticed = historySet.has(dateStr);

    days.push({
      date: dateStr,
      dayName,
      dayShort,
      dayNumber,
      isPracticed,
      isToday
    });
  }

  return days;
}

export interface WeeklyDayActivity {
  date: string;
  dayName: string;
  fullDay: string;
  dayShort: string;
  dayNumber: number;
  isPracticed: boolean;
  isToday: boolean;
  isFuture: boolean;
  intensityScore: number; // 0 to 100
  label: string;
  topic?: string;
}

export interface WeeklyActivityStats {
  days: WeeklyDayActivity[];
  practicedCount: number;
  weeklyGoal: number; // e.g. 5 days
  consistencyPercentage: number;
  activeStreak: number;
  totalPracticedDays: number;
  goalMet: boolean;
  encouragingMessage: string;
  recentTopics: string[];
}

/**
 * Calculates current week's activity consistency stats (Monday through Sunday)
 * using the user's recorded streak history.
 */
export function getWeeklyActivityStats(streakData?: StreakData): WeeklyActivityStats {
  const currentStreak = streakData || getStreakData();
  const historySet = new Set(currentStreak.practiceHistory || []);
  const todayStr = getLocalDateString();
  const now = new Date();

  // Find Monday of the current week (Sunday is 0, Monday is 1, etc.)
  const currentDayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat
  // Convert so Monday = 0, Sunday = 6
  const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);

  const days: WeeklyDayActivity[] = [];
  let practicedCount = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = getLocalDateString(d);
    const isToday = dateStr === todayStr;
    const isFuture = d > now && !isToday;
    const isPracticed = historySet.has(dateStr);

    if (isPracticed) {
      practicedCount++;
    }

    const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
    const fullDay = d.toLocaleDateString(undefined, { weekday: 'long' });
    const dayShort = dayName.slice(0, 1);
    const dayNumber = d.getDate();

    // Calculate joyful intensity score
    let intensityScore = 0;
    if (isPracticed) {
      // Days practiced get a full healthy 85-100% bar
      intensityScore = isToday ? 100 : 90;
    } else if (isToday) {
      // Today not yet practiced: dashed 30% placeholder bar encouraging action
      intensityScore = 25;
    } else if (isFuture) {
      intensityScore = 0;
    } else {
      // Past unpracticed day
      intensityScore = 10;
    }

    let label = 'Rest Day';
    if (isPracticed) {
      label = isToday ? 'Completed Today! 🔥' : 'Practiced ⭐';
    } else if (isToday) {
      label = 'Ready to practice!';
    } else if (isFuture) {
      label = 'Upcoming';
    }

    days.push({
      date: dateStr,
      dayName,
      fullDay,
      dayShort,
      dayNumber,
      isPracticed,
      isToday,
      isFuture,
      intensityScore,
      label,
      topic: isPracticed ? (currentStreak.lastTopicPracticed || 'Python') : undefined
    });
  }

  const weeklyGoal = 5;
  const consistencyPercentage = Math.min(100, Math.round((practicedCount / weeklyGoal) * 100));
  const goalMet = practicedCount >= weeklyGoal;

  let encouragingMessage = 'Every line of code counts! Start a conversation today.';
  if (currentStreak.todayPracticed) {
    if (currentStreak.streakDays >= 7) {
      encouragingMessage = '🏆 Incredible dedication! A full week of consistency!';
    } else if (currentStreak.streakDays >= 3) {
      encouragingMessage = `🔥 You're unstoppable! ${currentStreak.streakDays}-day streak in motion!`;
    } else {
      encouragingMessage = '✨ Fantastic work! You kept your practice active today!';
    }
  } else {
    encouragingMessage = `⚡ Complete 1 conversation today to keep your ${currentStreak.streakDays || 1}-day streak alive!`;
  }

  return {
    days,
    practicedCount,
    weeklyGoal,
    consistencyPercentage,
    activeStreak: currentStreak.streakDays,
    totalPracticedDays: currentStreak.totalPracticedDays,
    goalMet,
    encouragingMessage,
    recentTopics: currentStreak.lastTopicPracticed ? [currentStreak.lastTopicPracticed] : ['Pandas', 'FastAPI']
  };
}

/**
 * Subscribe to streak changes across tabs or inside the app.
 */
export function subscribeToStreak(callback: (streak: StreakData) => void): () => void {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<StreakData>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      callback(getStreakData());
    }
  };

  window.addEventListener(STREAK_CHANGE_EVENT, handler);
  window.addEventListener('storage', (e) => {
    if (e.key === STREAK_STORAGE_KEY) {
      callback(getStreakData());
    }
  });

  return () => {
    window.removeEventListener(STREAK_CHANGE_EVENT, handler);
  };
}
