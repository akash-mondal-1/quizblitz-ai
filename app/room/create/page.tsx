"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Code, FlaskConical, Film, Globe, Cpu, BookOpen, Medal, Sparkles } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { ParticlesBackground } from "@/components/particles-background";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { createRoom } from "@/services/room";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import type { QuizCategory, Difficulty } from "@/types";

const CATEGORIES: { id: QuizCategory; label: string; icon: React.ElementType }[] = [
  { id: 'coding', label: 'Programming', icon: Code },
  { id: 'science', label: 'Science', icon: FlaskConical },
  { id: 'movies', label: 'Movies & TV', icon: Film },
  { id: 'general', label: 'General Knowledge', icon: Globe },
  { id: 'technology', label: 'Technology', icon: Cpu },
  { id: 'history', label: 'History', icon: BookOpen },
  { id: 'sports', label: 'Sports', icon: Medal },
  { id: 'custom', label: 'Custom Topic', icon: Sparkles },
];

const formSchema = z.object({
  topic: z.string().min(2, "Topic must be at least 2 characters").max(50, "Topic too long"),
  category: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  questionCount: z.number().min(5).max(20),
  timePerQuestion: z.number().min(10).max(60),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateRoomPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      category: "general",
      difficulty: "medium",
      questionCount: 10,
      timePerQuestion: 20,
    }
  });

  const selectedCategory = watch("category");
  const selectedDifficulty = watch("difficulty");
  const selectedCount = watch("questionCount");
  const selectedTime = watch("timePerQuestion");

  // Redirect if not logged in after checking auth
  useEffect(() => {
    if (!authLoading && !user) {
      setTimeout(() => router.push('/'), 0);
    }
  }, [authLoading, user, router]);

  if (!authLoading && !user) {
    return null;
  }

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    setIsGenerating(true);
    
    try {
      // 1. Generate Quiz via Gemini
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: data.topic,
          category: data.category,
          difficulty: data.difficulty,
          questionCount: data.questionCount
        })
      });

      const result = await response.json();
      
      if (!result.success || !result.questions || result.questions.length === 0) {
        throw new Error(result.error || "Failed to generate questions");
      }

      if (result.isDemo) {
        toast.info(result.error || "Using demo questions (API fallback).");
      } else {
        toast.success("Quiz generated successfully!");
      }

      // 2. Create Room in Firebase
      const config = {
        topic: data.topic,
        category: data.category as QuizCategory,
        difficulty: data.difficulty as Difficulty,
        questionCount: result.questions.length,
        timePerQuestion: data.timePerQuestion
      };

      const { roomId } = await createRoom(user.uid, user.displayName, user.photoURL, config, result.questions);
      
      // 3. Navigate to Room
      router.push(`/room/${roomId}`);
      
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col pt-20">
      <ParticlesBackground />
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 relative z-10 w-full max-w-3xl mx-auto pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <Button 
            variant="ghost" 
            className="mb-6 text-muted-foreground hover:text-white"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>

          <GlassCard className="p-6 sm:p-10 rounded-3xl border-white/10 glow-blue">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white">Configure Quiz Room</h1>
              <p className="text-muted-foreground mt-2">Customize your AI-generated quiz experience.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Topic */}
              <div className="space-y-3">
                <Label htmlFor="topic" className="text-lg font-bold">What is the topic?</Label>
                <Input 
                  id="topic" 
                  placeholder="e.g. React Hooks, World War II, Marvel Universe..."
                  className="h-14 text-lg bg-black/20 border-white/10 focus:border-neon-blue focus:ring-neon-blue"
                  {...register("topic")}
                />
                {errors.topic && <p className="text-destructive text-sm">{errors.topic.message}</p>}
              </div>

              {/* Category Grid */}
              <div className="space-y-3">
                <Label className="text-lg font-bold">Select Category</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CATEGORIES.map(cat => (
                    <div 
                      key={cat.id}
                      onClick={() => setValue("category", cat.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all",
                        selectedCategory === cat.id 
                          ? "border-neon-blue bg-neon-blue/20 glow-blue" 
                          : "border-white/10 bg-black/20 hover:bg-white/5"
                      )}
                    >
                      <cat.icon className={cn("w-6 h-6", selectedCategory === cat.id ? "text-neon-blue" : "text-muted-foreground")} />
                      <span className={cn("text-xs font-bold uppercase text-center", selectedCategory === cat.id ? "text-white" : "text-muted-foreground")}>
                        {cat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Difficulty */}
                <div className="space-y-3">
                  <Label className="text-lg font-bold">Difficulty</Label>
                  <div className="flex gap-2 bg-black/20 p-1.5 rounded-xl border border-white/10">
                    {['easy', 'medium', 'hard'].map((level) => (
                      <div
                        key={level}
                        onClick={() => setValue("difficulty", level as Difficulty)}
                        className={cn(
                          "flex-1 text-center py-2.5 rounded-lg text-sm font-bold uppercase cursor-pointer transition-all",
                          selectedDifficulty === level 
                            ? level === 'easy' ? "bg-neon-green text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                              : level === 'medium' ? "bg-neon-yellow text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                              : "bg-destructive text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                            : "text-muted-foreground hover:bg-white/5"
                        )}
                      >
                        {level}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Question Count */}
                <div className="space-y-3">
                  <Label className="text-lg font-bold">Number of Questions</Label>
                  <div className="flex gap-2 bg-black/20 p-1.5 rounded-xl border border-white/10">
                    {[5, 10, 15, 20].map((num) => (
                      <div
                        key={num}
                        onClick={() => setValue("questionCount", num)}
                        className={cn(
                          "flex-1 text-center py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-all",
                          selectedCount === num ? "bg-white text-black shadow-lg" : "text-muted-foreground hover:bg-white/5"
                        )}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="space-y-3">
                <Label className="text-lg font-bold">Time Per Question</Label>
                <div className="flex gap-2 bg-black/20 p-1.5 rounded-xl border border-white/10">
                  {[10, 15, 20, 30, 45, 60].map((time) => (
                    <div
                      key={time}
                      onClick={() => setValue("timePerQuestion", time)}
                      className={cn(
                        "flex-1 text-center py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-all",
                        selectedTime === time ? "bg-neon-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]" : "text-muted-foreground hover:bg-white/5"
                      )}
                    >
                      {time}s
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                disabled={isGenerating}
                className="w-full h-16 text-lg font-bold bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:opacity-90 glow-blue transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin mr-3" />
                    Generating AI Quiz...
                  </>
                ) : (
                  "Generate Quiz & Create Room"
                )}
              </Button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </main>
  );
}
