export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'pythontales_theme_mode_v1';

/**
 * Returns the current theme preference from localStorage or prefers-color-scheme
 */
export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    // Default to light if no saved setting, but respect prefers-color-scheme if user prefers dark
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

/**
 * Applies the given theme by toggling the .dark class on the document root
 * and storing the preference in localStorage
 */
export function applyTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined') return;
  try {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (err) {
    console.warn('Failed to apply theme:', err);
  }
}

/**
 * Helper to toggle between light and dark
 */
export function toggleThemeMode(current: ThemeMode): ThemeMode {
  const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
