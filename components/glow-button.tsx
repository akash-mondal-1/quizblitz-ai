'use client';

import React, { useRef, useCallback } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/utils/cn';

const GLOW_COLORS = {
  blue: {
    shadow: 'rgba(59, 130, 246, 0.5)',
    border: 'rgba(59, 130, 246, 0.6)',
    bg: 'from-neon-blue to-neon-purple',
  },
  purple: {
    shadow: 'rgba(139, 92, 246, 0.5)',
    border: 'rgba(139, 92, 246, 0.6)',
    bg: 'from-neon-purple to-neon-pink',
  },
  green: {
    shadow: 'rgba(16, 185, 129, 0.5)',
    border: 'rgba(16, 185, 129, 0.6)',
    bg: 'from-neon-green to-neon-cyan',
  },
  pink: {
    shadow: 'rgba(236, 72, 153, 0.5)',
    border: 'rgba(236, 72, 153, 0.6)',
    bg: 'from-neon-pink to-neon-purple',
  },
} as const;

interface GlowButtonProps extends Omit<ButtonProps, 'ref'> {
  glowColor?: keyof typeof GLOW_COLORS;
  children: React.ReactNode;
}

export function GlowButton({
  glowColor = 'blue',
  className,
  children,
  onClick,
  ...props
}: GlowButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const colors = GLOW_COLORS[glowColor];

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // Create ripple effect
      const button = buttonRef.current;
      if (button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: ripple-expand 0.6s ease-out forwards;
        `;
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }
      onClick?.(e);
    },
    [onClick]
  );

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="relative inline-flex"
    >
      {/* Animated glow background */}
      <motion.div
        className="absolute -inset-0.5 rounded-xl opacity-0"
        style={{
          background: `linear-gradient(45deg, ${colors.border}, transparent, ${colors.border})`,
          filter: `blur(4px)`,
        }}
        whileHover={{
          opacity: 0.8,
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          backgroundPosition: {
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      />
      <Button
        ref={buttonRef}
        className={cn(
          'relative z-10 bg-gradient-to-r',
          colors.bg,
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
      <style jsx global>{`
        @keyframes ripple-expand {
          to {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
      `}</style>
    </motion.div>
  );
}
