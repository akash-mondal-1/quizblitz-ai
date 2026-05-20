"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, RotateCcw, Home, Star, Target, Zap } from "lucide-react";
import { Button } from "./ui/button";
import type { LeaderboardEntry } from "@/types";
import { Confetti } from "./confetti";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/utils/cn";

interface ResultsOverlayProps {
  leaderboard: LeaderboardEntry[];
  currentUid: string;
  onPlayAgain: () => void;
  onGoHome: () => void;
  totalQuestions: number;
}

export function ResultsOverlay({ leaderboard, currentUid, onPlayAgain, onGoHome, totalQuestions }: ResultsOverlayProps) {
  const { playGameEnd } = useSound();
  
  const top3 = leaderboard.slice(0, 3);
  const currentUserEntry = leaderboard.find(e => e.uid === currentUid);
  
  useEffect(() => {
    playGameEnd();
  }, [playGameEnd]);

  // Framer motion variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.5 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-3xl overflow-y-auto p-4 sm:p-8">
      <Confetti active={true} duration={10000} />
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-5xl flex flex-col items-center gap-12 relative z-10 py-12"
      >
        <motion.div variants={item} className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink tracking-tight drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            Match Finished!
          </h1>
          <p className="text-xl text-muted-foreground uppercase tracking-widest font-bold">
            Final Standings
          </p>
        </motion.div>

        {/* Podium Display */}
        <motion.div variants={item} className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 h-[300px] md:h-[400px] w-full mt-10 md:mt-0">
          
          {/* 2nd Place */}
          {top3[1] && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '60%', opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8, type: "spring" as const }}
              className="flex-1 w-full md:w-auto max-w-[200px] relative flex flex-col items-center justify-end"
            >
              <div className="absolute -top-16 flex flex-col items-center">
                <div className="text-xl font-bold truncate w-24 text-center">{top3[1].displayName}</div>
                <div className="text-sm text-muted-foreground font-mono">{top3[1].score} pts</div>
              </div>
              <div className="w-full bg-gradient-to-t from-slate-400/20 to-slate-400/50 rounded-t-2xl border-t-4 border-slate-300 h-full flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <span className="text-6xl font-black text-slate-300/50">2</span>
              </div>
            </motion.div>
          )}

          {/* 1st Place */}
          {top3[0] && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '100%', opacity: 1 }}
              transition={{ delay: 2, duration: 1, type: "spring" as const }}
              className="flex-[1.2] w-full md:w-auto max-w-[220px] relative flex flex-col items-center justify-end z-10"
            >
              <motion.div 
                animate={{ y: [-10, 0, -10] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -top-28 flex flex-col items-center"
              >
                <Trophy className="w-12 h-12 text-yellow-400 mb-2 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                <div className="text-2xl font-black truncate w-32 text-center text-yellow-400 drop-shadow-md">
                  {top3[0].displayName}
                </div>
                <div className="text-lg font-mono font-bold text-yellow-200">{top3[0].score} pts</div>
              </motion.div>
              <div className="w-full bg-gradient-to-t from-yellow-500/20 to-yellow-500/50 rounded-t-2xl border-t-4 border-yellow-400 h-full flex items-center justify-center relative overflow-hidden glow-purple">
                <div className="absolute inset-0 bg-grid opacity-30" />
                <span className="text-8xl font-black text-yellow-400/50">1</span>
              </div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '40%', opacity: 1 }}
              transition={{ delay: 1, duration: 0.8, type: "spring" as const }}
              className="flex-1 w-full md:w-auto max-w-[200px] relative flex flex-col items-center justify-end"
            >
              <div className="absolute -top-16 flex flex-col items-center">
                <div className="text-lg font-bold truncate w-24 text-center">{top3[2].displayName}</div>
                <div className="text-sm text-muted-foreground font-mono">{top3[2].score} pts</div>
              </div>
              <div className="w-full bg-gradient-to-t from-amber-700/20 to-amber-700/50 rounded-t-2xl border-t-4 border-amber-600 h-full flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <span className="text-5xl font-black text-amber-600/50">3</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Current User Stats */}
        {currentUserEntry && (
          <motion.div variants={item} className="w-full max-w-2xl glass-strong p-6 rounded-3xl mt-8 grid grid-cols-3 gap-4 border-white/10">
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl">
              <Medal className="w-6 h-6 text-neon-blue mb-2" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Your Rank</span>
              <span className="text-3xl font-black">#{currentUserEntry.rank}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl">
              <Target className="w-6 h-6 text-neon-green mb-2" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Accuracy</span>
              <span className="text-3xl font-black">{Math.round((currentUserEntry.correctCount / totalQuestions) * 100)}%</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl">
              <Zap className="w-6 h-6 text-neon-pink mb-2" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Fastest</span>
              <span className="text-3xl font-black">{currentUserEntry.fastestAnswer ? `${currentUserEntry.fastestAnswer.toFixed(1)}s` : '-'}</span>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md">
          <Button onClick={onPlayAgain} className="flex-1 h-14 text-lg">
            <RotateCcw className="w-5 h-5 mr-2" /> Play Again
          </Button>
          <Button onClick={onGoHome} variant="outline" className="flex-1 h-14 text-lg border-white/20 glass">
            <Home className="w-5 h-5 mr-2" /> Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
