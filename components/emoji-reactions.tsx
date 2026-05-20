"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EmojiReaction, ReactionType } from "@/types";

interface EmojiReactionsProps {
  reactions: EmojiReaction[];
  onReact: (type: ReactionType) => void;
}

const EMOJI_OPTIONS: ReactionType[] = ["🔥", "😂", "😱", "🎉", "💀", "🧠"];

export function EmojiReactions({ reactions, onReact }: EmojiReactionsProps) {
  const [localReactions, setLocalReactions] = useState<{ id: string; type: string; left: number }[]>([]);

  const handleReact = useCallback(
    (type: ReactionType) => {
      onReact(type);
      const newLocal = {
        id: `local-${Date.now()}-${Math.random()}`,
        type,
        left: 20 + Math.random() * 60, // 20% to 80% left
      };
      setLocalReactions((prev) => [...prev, newLocal]);
      setTimeout(() => {
        setLocalReactions((prev) => prev.filter((r) => r.id !== newLocal.id));
      }, 2000);
    },
    [onReact]
  );

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center z-50 pointer-events-none">
      <div className="flex gap-2 p-2 rounded-full glass-strong pointer-events-auto">
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleReact(emoji)}
            className="w-10 h-10 flex items-center justify-center text-xl rounded-full hover:bg-white/10 transition-colors active:scale-95 no-select"
          >
            {emoji}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {[...reactions, ...localReactions].map((reaction) => (
          <motion.div
            key={reaction.id}
            initial={{ opacity: 0, y: 0, scale: 0.5, x: "-50%" }}
            animate={{ opacity: [0, 1, 1, 0], y: -200, scale: 1.5, x: "-50%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute bottom-16 text-3xl pointer-events-none drop-shadow-lg"
            style={{ left: `${(reaction as EmojiReaction & { left?: number }).left || 50}%` }}
          >
            {reaction.type}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
