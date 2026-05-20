'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface AntiCheatOptions {
  /** Callback fired when a cheat-like event is detected. */
  onWarning?: (type: 'tab_switch' | 'focus_loss', count: number) => void;
  /** Whether the anti-cheat detection is active (e.g., only during gameplay). */
  enabled?: boolean;
}

interface AntiCheatReturn {
  /** Number of warnings accumulated. */
  warnings: number;
  /** Whether the tab is currently active/visible. */
  isTabActive: boolean;
}

/**
 * Custom hook for basic anti-cheat detection during gameplay.
 *
 * Detects:
 * - Tab visibility changes (user switches tabs)
 * - Window blur (user switches to another application)
 *
 * Does NOT detect:
 * - Multi-monitor setups where the user never leaves the tab
 * - Dev tools open (intentionally, since this is educational)
 */
export function useAntiCheat({
  onWarning,
  enabled = true,
}: AntiCheatOptions = {}): AntiCheatReturn {
  const [warnings, setWarnings] = useState(0);
  const [isTabActive, setIsTabActive] = useState(true);
  const onWarningRef = useRef(onWarning);

  // Keep the callback ref in sync without causing re-subscriptions
  useEffect(() => {
    onWarningRef.current = onWarning;
  }, [onWarning]);

  const addWarning = useCallback(
    (type: 'tab_switch' | 'focus_loss') => {
      setWarnings((prev) => {
        const newCount = prev + 1;
        onWarningRef.current?.(type, newCount);
        return newCount;
      });
    },
    []
  );

  useEffect(() => {
    if (!enabled) return;

    // Tab visibility change (user switched tabs or minimized)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabActive(false);
        addWarning('tab_switch');
      } else {
        setIsTabActive(true);
      }
    };

    // Window blur (user clicked on another app)
    const handleBlur = () => {
      setIsTabActive(false);
      addWarning('focus_loss');
    };

    const handleFocus = () => {
      setIsTabActive(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [enabled, addWarning]);

  return { warnings, isTabActive };
}
