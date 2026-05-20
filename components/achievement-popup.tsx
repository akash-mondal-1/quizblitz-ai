"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Brain, Flame, Trophy, Award, Gamepad2, GraduationCap } from "lucide-react";
import type { Badge } from "@/types";
import { useSound } from "@/hooks/useSound";

const ICONS: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-8 h-8 text-yellow-400" />,
  Brain: <Brain className="w-8 h-8 text-pink-400" />,
  Flame: <Flame className="w-8 h-8 text-orange-500" />,
  Trophy: <Trophy className="w-8 h-8 text-yellow-500" />,
  Award: <Award className="w-8 h-8 text-blue-400" />,
  Gamepad2: <Gamepad2 className="w-8 h-8 text-purple-400" />,
  GraduationCap: <GraduationCap className="w-8 h-8 text-green-400" />,
};

interface AchievementPopupProps {
  badge: Badge | null;
  onClose: () => void;
}

export function AchievementPopup({ badge, onClose }: AchievementPopupProps) {
  const { playAchievement } = useSound();

  useEffect(() => {
    if (badge) {
      playAchievement();
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [badge, onClose, playAchievement]);

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed bottom-24 right-4 z-50 sm:right-8 sm:bottom-8"
        >
          <div className="glass-strong rounded-xl p-4 flex items-center gap-4 glow-purple neon-border relative overflow-hidden min-w-[300px]">
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] animate-shimmer" />
            
            <div className="bg-white/10 p-3 rounded-full shrink-0">
              {ICONS[badge.icon] || <Award className="w-8 h-8 text-yellow-400" />}
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neon-purple uppercase tracking-wider">
                Achievement Unlocked
              </span>
              <span className="text-lg font-bold text-white">
                {badge.name}
              </span>
              <span className="text-sm text-white/70 leading-tight mt-1">
                {badge.description}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
