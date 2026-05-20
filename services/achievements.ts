import type { UserStats, BadgeId } from '@/types';
import { BADGES } from '@/types';

/**
 * Check which achievements (badges) have been newly unlocked
 * based on the player's current stats.
 *
 * @param stats - Current user stats to evaluate against badge conditions
 * @param currentBadges - Badges the user already has
 * @returns Array of newly unlocked BadgeId values
 */
export function checkAchievements(
  stats: UserStats,
  currentBadges: BadgeId[]
): BadgeId[] {
  const currentBadgeSet = new Set<BadgeId>(currentBadges);

  const newlyUnlocked: BadgeId[] = [];

  for (const badge of BADGES) {
    // Skip badges the player already has
    if (currentBadgeSet.has(badge.id)) continue;

    // Check if the condition is now met
    if (badge.condition(stats)) {
      newlyUnlocked.push(badge.id);
    }
  }

  return newlyUnlocked;
}
