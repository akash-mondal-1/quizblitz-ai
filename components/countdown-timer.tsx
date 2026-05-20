'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface CountdownTimerProps {
  timeRemaining: number;
  totalTime: number;
  size?: number;
}

export function CountdownTimer({
  timeRemaining,
  totalTime,
  size = 120,
}: CountdownTimerProps) {
  const displayTime = timeRemaining;

  const progress = totalTime > 0 ? displayTime / totalTime : 0;
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Determine color based on percentage
  const getColor = () => {
    if (progress > 0.5) return '#10b981'; // green
    if (progress > 0.25) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  const color = getColor();
  const isUrgent = displayTime <= 5 && displayTime > 0;

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
      transition={isUrgent ? { duration: 0.5, repeat: Infinity } : {}}
    >
      {/* Background circle */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="6"
        />
        {/* Indicator */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-linear"
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>

      {/* Center number */}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={displayTime}
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'text-2xl font-bold tabular-nums',
            isUrgent ? 'text-destructive' : 'text-foreground'
          )}
          style={{
            fontSize: size * 0.28,
          }}
        >
          {displayTime}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}
