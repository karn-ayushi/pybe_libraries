import { Lesson } from '../types';
import { PANDAS_LESSON, LOOPS_LESSON, DICTIONARY_LESSON } from './lessons';
import { REQUESTS_API_LESSON, NUMPY_LESSON } from './extraLessons';

export const MASTER_LESSONS: Lesson[] = [
  PANDAS_LESSON,
  LOOPS_LESSON,
  DICTIONARY_LESSON,
  REQUESTS_API_LESSON,
  NUMPY_LESSON
];

export function getLessonById(id: string): Lesson | undefined {
  return MASTER_LESSONS.find(l => l.id === id || l.slug === id);
}

export function getLessonsByCategory(category: string): Lesson[] {
  if (category === 'All') return MASTER_LESSONS;
  return MASTER_LESSONS.filter(l => l.category === category);
}
