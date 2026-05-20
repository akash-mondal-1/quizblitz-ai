'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GlassCardProps {
  className?: string;
  hover?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

export function GlassCard({
  className,
  hover = false,
  glow = false,
  children,
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'glass rounded-xl p-6',
        glow && 'neon-border',
        className
      )}
      whileHover={
        hover
          ? {
              scale: 1.01,
              borderColor: 'rgba(255, 255, 255, 0.15)',
            }
          : undefined
      }
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
