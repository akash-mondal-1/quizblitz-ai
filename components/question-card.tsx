"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { QuizQuestion } from "@/types";
import { Progress } from "./ui/progress";

interface QuestionCardProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  correctAnswer: number | null;
  onAnswer: (index: number) => void;
  disabled: boolean;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  correctAnswer,
  onAnswer,
  disabled
}: QuestionCardProps) {
  const progress = ((questionIndex) / totalQuestions) * 100;
  
  // DEBUG LOG
  console.log(`[DEBUG QuestionCard] disabled: ${disabled}, selectedAnswer: ${selectedAnswer}, correctAnswer: ${correctAnswer}`);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="glass px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-neon-blue border-neon-blue/20">
            {question.category}
          </div>
          <div className={cn(
            "glass px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
            question.difficulty === 'easy' && "text-neon-green border-neon-green/20",
            question.difficulty === 'medium' && "text-neon-yellow border-neon-yellow/20",
            question.difficulty === 'hard' && "text-destructive border-destructive/20"
          )}>
            {question.difficulty}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 w-full sm:w-48">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Question {questionIndex + 1} / {totalQuestions}
          </div>
          <Progress value={progress} className="h-1.5 w-full bg-white/10" />
        </div>
      </div>

      {/* Question Text */}
      <motion.div 
        key={`q-${question.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-8 sm:p-12 text-center min-h-[200px] flex items-center justify-center border-white/10 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <h2 className="text-2xl sm:text-4xl font-bold leading-tight md:leading-snug text-white z-10 drop-shadow-md">
          {question.question}
        </h2>
      </motion.div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = correctAnswer === index;
          const isWrongSelection = isSelected && correctAnswer !== null && correctAnswer !== index;
          const showAsCorrect = correctAnswer !== null && isCorrect;

          return (
            <motion.button
              key={`${question.id}-opt-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !disabled && onAnswer(index)}
              disabled={disabled}
              className={cn(
                "relative group text-left p-6 rounded-2xl glass border-2 transition-all duration-300 overflow-hidden",
                !disabled && !isSelected && "hover:border-white/30 hover:bg-white/10 active:scale-[0.98]",
                isSelected && correctAnswer === null && "border-neon-blue bg-neon-blue/10 glow-blue",
                showAsCorrect && "answer-correct z-10 scale-[1.02]",
                isWrongSelection && "answer-wrong opacity-50",
                disabled && !isSelected && !showAsCorrect && "opacity-50"
              )}
            >
              {/* Option Label Letter */}
              <div className={cn(
                "absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                isSelected && correctAnswer === null ? "bg-neon-blue text-white" : 
                showAsCorrect ? "bg-neon-green text-white" :
                isWrongSelection ? "bg-destructive text-white" :
                "bg-white/10 text-white/50 group-hover:bg-white/20 group-hover:text-white"
              )}>
                {OPTION_LABELS[index]}
              </div>
              
              <div className="pl-12 pr-4 font-medium sm:text-lg text-white/90 group-hover:text-white transition-colors">
                {option}
              </div>
              
              {/* Shimmer effect on correct answer */}
              {showAsCorrect && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] animate-shimmer" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
