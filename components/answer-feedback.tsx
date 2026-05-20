"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Zap, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/utils/cn";

interface AnswerFeedbackProps {
  isCorrect: boolean;
  score: number;
  streak: number;
  explanation: string;
  onContinue?: () => void;
  isHost: boolean;
  isLoadingExplanation?: boolean;
}

export function AnswerFeedback({ 
  isCorrect, 
  score, 
  streak, 
  explanation, 
  onContinue,
  isHost,
  isLoadingExplanation
}: AnswerFeedbackProps) {
  // Auto advance after a delay if host
  useEffect(() => {
    if (isHost && onContinue) {
      const timer = setTimeout(onContinue, 6000);
      return () => clearTimeout(timer);
    }
  }, [isHost, onContinue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-40"
    >
      <div className={cn(
        "rounded-2xl p-6 border shadow-2xl relative overflow-hidden backdrop-blur-xl",
        isCorrect 
          ? "bg-neon-green/10 border-neon-green/50 glow-green" 
          : "bg-destructive/10 border-destructive/50 glow-pink"
      )}>
        {/* Background gradient */}
        <div className={cn(
          "absolute inset-0 opacity-20 pointer-events-none",
          isCorrect 
            ? "bg-gradient-to-t from-neon-green to-transparent" 
            : "bg-gradient-to-t from-destructive to-transparent"
        )} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
          {/* Icon & Result Status */}
          <div className="flex items-center gap-4 shrink-0">
            {isCorrect ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring" as const, stiffness: 200, damping: 15 }}
              >
                <CheckCircle2 className="w-16 h-16 text-neon-green" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring" as const, stiffness: 200, damping: 15 }}
              >
                <XCircle className="w-16 h-16 text-destructive" />
              </motion.div>
            )}
            
            <div className="flex flex-col">
              <span className={cn(
                "text-2xl font-black uppercase tracking-wider",
                isCorrect ? "text-neon-green" : "text-destructive"
              )}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </span>
              
              {isCorrect && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mt-1"
                >
                  <span className="text-xl font-bold text-white">+{score}</span>
                  {streak > 2 && (
                    <span className="text-xs font-bold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full flex items-center gap-1 border border-orange-500/30">
                      <Zap className="w-3 h-3" /> Streak x{streak}
                    </span>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Explanation */}
          <div className="flex-1 bg-black/40 rounded-xl p-4 border border-white/5 w-full">
            <span className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1 block">
              AI Explanation
            </span>
            {isLoadingExplanation ? (
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-neon-blue" />
                Generating explanation...
              </div>
            ) : (
              <p className="text-sm text-white/90 leading-relaxed">
                {explanation}
              </p>
            )}
          </div>

          {/* Host Action */}
          {isHost && (
            <div className="shrink-0 w-full sm:w-auto">
              <Button 
                onClick={onContinue} 
                className="w-full sm:w-auto h-12"
                variant={isCorrect ? "default" : "destructive"}
              >
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Shimmer effect for correct */}
        {isCorrect && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] animate-shimmer pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
}
