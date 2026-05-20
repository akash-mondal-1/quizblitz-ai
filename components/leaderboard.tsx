'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Crown, TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { LeaderboardEntry } from '@/types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUid?: string;
  compact?: boolean;
}

const rankColors: Record<number, { bg: string; border: string; text: string; glow: string }> = {
  1: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    glow: 'shadow-[0_0_15px_rgba(234,179,8,0.2)]',
  },
  2: {
    bg: 'bg-gray-300/10',
    border: 'border-gray-400/30',
    text: 'text-gray-300',
    glow: '',
  },
  3: {
    bg: 'bg-amber-700/10',
    border: 'border-amber-700/30',
    text: 'text-amber-600',
    glow: '',
  },
};

export function Leaderboard({
  entries,
  currentUid,
  compact = false,
}: LeaderboardProps) {
  const displayEntries = compact ? entries.slice(0, 5) : entries;

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {displayEntries.map((entry, index) => {
          const rankStyle = rankColors[entry.rank];
          const isCurrentUser = entry.uid === currentUid;
          const rankChange =
            entry.previousRank !== null
              ? entry.previousRank - entry.rank
              : null;

          return (
            <motion.div
              key={entry.uid}
              layout
              layoutId={`leaderboard-${entry.uid}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{
                layout: { type: 'spring', stiffness: 300, damping: 30 },
                delay: index * 0.05,
              }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border transition-colors',
                rankStyle?.bg || 'bg-white/[0.02]',
                rankStyle?.border || 'border-white/5',
                rankStyle?.glow,
                isCurrentUser && 'border-neon-blue/40 bg-neon-blue/5 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
              )}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                {entry.rank === 1 ? (
                  <Crown className="h-5 w-5 text-yellow-400" />
                ) : (
                  <span
                    className={cn(
                      'text-sm font-bold tabular-nums',
                      rankStyle?.text || 'text-muted'
                    )}
                  >
                    {entry.rank}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                {entry.photoURL ? (
                  <img
                    src={entry.photoURL}
                    alt={entry.displayName}
                    className="h-8 w-8 rounded-full border border-white/10"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-xs font-bold text-white">
                    {entry.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-medium truncate',
                  isCurrentUser ? 'text-neon-blue' : 'text-foreground'
                )}>
                  {entry.displayName}
                  {isCurrentUser && (
                    <span className="text-xs text-muted ml-1">(You)</span>
                  )}
                </p>
              </div>

              {/* Streak */}
              {entry.streak > 1 && (
                <div className="flex items-center gap-0.5 text-neon-orange">
                  <Flame className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold">{entry.streak}</span>
                </div>
              )}

              {/* Score */}
              <motion.div
                key={entry.score}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="text-sm font-bold tabular-nums text-foreground"
              >
                {entry.score.toLocaleString()}
              </motion.div>

              {/* Rank change */}
              {rankChange !== null && rankChange !== 0 && (
                <div className="flex-shrink-0">
                  {rankChange > 0 ? (
                    <TrendingUp className="h-4 w-4 text-neon-green" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
