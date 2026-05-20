const BASE_POINTS = 1000;
const MIN_CORRECT_SCORE = 100;

/**
 * Calculate score for a single answer.
 *
 * Formula: score = BASE_POINTS * (remainingTime / totalTime)
 * - Minimum score for a correct answer is 100.
 * - Incorrect answers always score 0.
 *
 * @param timeElapsed - seconds the player took to answer
 * @param totalTime - total seconds allowed for the question
 * @param isCorrect - whether the answer was correct
 */
export function calculateScore(
  timeElapsed: number,
  totalTime: number,
  isCorrect: boolean
): number {
  if (!isCorrect) return 0;
  if (totalTime <= 0) return MIN_CORRECT_SCORE;

  const remainingTime = Math.max(0, totalTime - timeElapsed);
  const rawScore = Math.round(BASE_POINTS * (remainingTime / totalTime));

  return Math.max(MIN_CORRECT_SCORE, rawScore);
}

/**
 * Calculate streak bonus multiplier.
 *
 * - 0–1 correct in a row → 1.0x
 * - 2–4 correct in a row → 1.1x
 * - 5–9 correct in a row → 1.2x
 * - 10+ correct in a row → 1.5x
 */
export function calculateStreakBonus(streak: number): number {
  if (streak >= 10) return 1.5;
  if (streak >= 5) return 1.2;
  if (streak >= 2) return 1.1;
  return 1.0;
}

/**
 * Calculate the final score after applying streak bonuses.
 */
export function calculateFinalScore(baseScore: number, streak: number): number {
  const multiplier = calculateStreakBonus(streak);
  return Math.round(baseScore * multiplier);
}
