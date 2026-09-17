import confetti from 'canvas-confetti';

/**
 * Fires a subtle, warm-palette confetti burst celebrating conversation completion.
 * Matches the application's natural parchment, terracotta, and sage green tones.
 */
export function fireDelightfulConfetti(): void {
  if (typeof window === 'undefined') return;

  // Respect user preference for reduced motion
  try {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;
  } catch {
    // Graceful fallback if matchMedia is unavailable
  }

  const baseColors = ['#F97316', '#EC4899', '#FB923C', '#F472B6', '#FF8A65', '#E11D48', '#FFB703'];

  // Subtle burst from the left
  confetti({
    particleCount: 28,
    angle: 60,
    spread: 50,
    origin: { x: 0.28, y: 0.72 },
    colors: baseColors,
    scalar: 0.85,
    gravity: 0.9,
    ticks: 170,
    disableForReducedMotion: true
  });

  // Soft delayed burst from the right for a rhythmic celebratory feel
  setTimeout(() => {
    confetti({
      particleCount: 28,
      angle: 120,
      spread: 50,
      origin: { x: 0.72, y: 0.72 },
      colors: baseColors,
      scalar: 0.85,
      gravity: 0.9,
      ticks: 170,
      disableForReducedMotion: true
    });
  }, 150);
}
