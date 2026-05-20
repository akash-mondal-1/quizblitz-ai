"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { ParticlesBackground } from "@/components/particles-background";
import { RoomCodeDisplay } from "@/components/room-code-display";
import { ShareRoom } from "@/components/share-room";
import { PlayerList } from "@/components/player-list";
import { HostControlPanel } from "@/components/host-control-panel";
import { QuestionCard } from "@/components/question-card";
import { CountdownTimer } from "@/components/countdown-timer";
import { AnswerFeedback } from "@/components/answer-feedback";
import { ResultsOverlay } from "@/components/results-overlay";
import { EmojiReactions } from "@/components/emoji-reactions";
import { Leaderboard } from "@/components/leaderboard";
import { LobbySkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { useAuth } from "@/hooks/useAuth";
import { useRoom } from "@/hooks/useRoom";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAntiCheat } from "@/hooks/useAntiCheat";
import { useSound } from "@/hooks/useSound";
import { calculateScore, calculateStreakBonus, calculateFinalScore } from "@/utils/scoring";
import { toast } from "sonner";
import { 
  joinRoom, leaveRoom, kickPlayer, startGame, 
  submitAnswer, nextQuestion, endGame, updateTimer,
  setupPresence, transitionToPlaying
} from "@/services/room";
import { saveUserStats, saveGameResult } from "@/services/firestore";
import { checkAchievements } from "@/services/achievements";
import type { EmojiReaction, ReactionType } from "@/types";
import { ArrowLeft, Play, AlertCircle } from "lucide-react";

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const roomId = resolvedParams.roomId;

  const router = useRouter();
  const { user, stats: userStats } = useAuth();
  const { room, isHost, players, gameState, currentQuestion, loading } = useRoom(roomId);
  const leaderboard = useLeaderboard(room);
  const { playTick, playCountdown, playGameStart } = useSound();

  const [countdown, setCountdown] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<{ isCorrect: boolean, score: number, streak: number, explanation: string } | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [hasSavedStats, setHasSavedStats] = useState(false);

  // Computed state
  const currentPlayer = user ? players[user.uid] : null;
  const activePlayers = Object.values(players).filter(p => p.connected && !p.isHost);
  const allAnswered = activePlayers.length > 0 && activePlayers.every(p => p.answeredCurrent);

  const [hasJoined, setHasJoined] = useState(false);

  // 1. Room Validation
  useEffect(() => {
    if (!loading && !room) {
      toast.error("Room not found or has been closed.");
      setTimeout(() => router.push('/'), 0);
    }
  }, [room, loading, router]);

  // 2. Auto-Join Logic (Runs once per session)
  useEffect(() => {
    if (!user || !room || loading || hasJoined) return;

    let isMounted = true;

    const initConnection = async () => {
      // If player isn't in the room yet, join them
      if (!room.players || !room.players[user.uid]) {
        console.log(`[Room] Auto-joining room ${room.id} with code ${room.code} for user ${user.uid}`);
        try {
          await joinRoom(room.code, {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
          console.log(`[Room] Successfully joined room ${room.id}`);
        } catch (err) {
          console.error("[Room] Failed to join room:", err);
          if (isMounted) {
            toast.error(err instanceof Error ? err.message : "Failed to join room");
            router.push('/');
          }
          return;
        }
      }

      if (isMounted) {
        setHasJoined(true);
      }
    };

    initConnection();

    return () => {
      isMounted = false;
    };
  }, [user, room, loading, hasJoined, router]);

  // 3. Stable Presence Management (Runs after joined)
  useEffect(() => {
    if (!user || !roomId || !hasJoined) return;
    
    console.log(`[Room] Establishing presence for user ${user.uid}`);
    const unsubscribe = setupPresence(roomId, user.uid);
    
    return () => {
      console.log(`[Room] Unmounting presence effect for user ${user.uid}`);
      unsubscribe();
    };
  }, [user, roomId, hasJoined]);

  useAntiCheat({
    onWarning: (type, warnings) => {
      if (!user || !room || room.gameState !== 'playing' || isHost) return;
      toast.warning(`Warning ${warnings}/3: Please stay on this tab!`);
      // Could send warning to RTDB here
    }
  });

  // --- GAME STATE HANDLERS ---

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setFeedbackData(null);
  }, [room?.currentQuestionIndex]);

  // Handle Starting Countdown
  useEffect(() => {
    if (gameState === 'starting' && room?.timerEnd) {
      let lastTick = -1;

      const updateCountdown = () => {
        const remaining = Math.max(0, Math.ceil((room.timerEnd! - Date.now()) / 1000));
        
        if (remaining > 0 && remaining !== lastTick) {
          playTick();
          lastTick = remaining;
        }

        if (remaining > 0) {
          setCountdown(remaining);
        } else {
          setCountdown(null);
          // Host automatically advances state
          if (isHost && room.config) {
            transitionToPlaying(roomId, room.config.timePerQuestion).catch(console.error);
          }
        }
      };

      updateCountdown(); // Initial run
      const int = setInterval(updateCountdown, 100);
      return () => clearInterval(int);
    } else {
      setCountdown(null);
    }
  }, [gameState, room?.timerEnd, isHost, roomId, room?.config?.timePerQuestion, playTick]);

  // Handle Play Timer
  useEffect(() => {
    if (gameState !== 'playing' || !room?.timerEnd) return;

    let lastSecond = -1;

    const updateTime = () => {
      const remainingMs = room.timerEnd! - Date.now();
      const remaining = Math.max(0, Math.ceil(remainingMs / 1000));
      
      if (remaining !== lastSecond) {
        setTimeRemaining(remaining);
        lastSecond = remaining;

        if (remaining <= 5 && remaining > 0) {
          playCountdown();
        }

        if (remaining === 0) {
          if (!isHost && currentPlayer && !currentPlayer.answeredCurrent) {
            // Auto-submit 0 score if time runs out
            handleAnswerSubmit(-1).catch(console.error);
          }
        }
      }
    };

    updateTime(); // initial
    const int = setInterval(updateTime, 100);
    return () => clearInterval(int);
  }, [gameState, room?.timerEnd, isHost, currentPlayer?.answeredCurrent]);

  // Auto-advance host when everyone answers
  useEffect(() => {
    if (isHost && gameState === 'playing' && allAnswered) {
      handleHostNextState();
    }
  }, [isHost, gameState, allAnswered]);

  // Handle Game End & Stats Saving
  useEffect(() => {
    if (gameState === 'finished' && user && currentPlayer && !hasSavedStats && !isHost && userStats && room) {
      setTimeout(() => setHasSavedStats(true), 0);
      
      const newStats = {
        ...userStats,
        totalGames: userStats.totalGames + 1,
        totalScore: userStats.totalScore + currentPlayer.score,
        highestScore: Math.max(userStats.highestScore, currentPlayer.score),
        bestStreak: Math.max(userStats.bestStreak, currentPlayer.currentStreak),
        // other stats calculated here...
      };

      const newBadges = checkAchievements(newStats, userStats.badges);
      if (newBadges.length > 0) {
        newStats.badges = [...userStats.badges, ...newBadges];
      }

      saveUserStats(user.uid, newStats);
      
      const leaderboardEntry = leaderboard.find(e => e.uid === user.uid);
      if (leaderboardEntry) {
         saveGameResult(user.uid, {
           roomId,
           score: currentPlayer.score,
           correctAnswers: leaderboardEntry.correctCount,
           totalQuestions: room.questions.length,
           rank: leaderboardEntry.rank,
           totalPlayers: activePlayers.length,
           category: room.config.category,
           difficulty: room.config.difficulty,
           playedAt: Date.now()
         });
      }
    }
  }, [gameState, user, currentPlayer, hasSavedStats, isHost, userStats, leaderboard, room, roomId, activePlayers.length]);


  // --- ACTIONS ---

  const handleStartGame = () => {
    if (!isHost) return;
    playGameStart();
    // Establish authoritative countdown timestamp in Firebase
    startGame(roomId, 3).catch(console.error);
  };

  const handleAnswerSubmit = async (optionIndex: number) => {
    console.log(`[DEBUG Interaction] Answer clicked: optionIndex=${optionIndex}, isHost=${isHost}, answeredCurrent=${currentPlayer?.answeredCurrent}`);
    
    if (!user || !room || !currentQuestion || isHost || currentPlayer?.answeredCurrent) {
      console.log(`[DEBUG Interaction] Click blocked! user=${!!user}, room=${!!room}, currentQuestion=${!!currentQuestion}, isHost=${isHost}, answeredCurrent=${currentPlayer?.answeredCurrent}`);
      return;
    }

    setSelectedAnswer(optionIndex);
    
    // Calculate elapsed time (how long they took)
    const duration = room.config.timePerQuestion;
    const timeElapsed = duration - timeRemaining;
    
    const isCorrect = optionIndex === currentQuestion.correctIndex;
    const baseScore = calculateScore(timeElapsed, duration, isCorrect);
    const streakMult = calculateStreakBonus(currentPlayer?.currentStreak || 0);
    const finalScore = calculateFinalScore(baseScore, currentPlayer?.currentStreak || 0);

    await submitAnswer(roomId, currentQuestion.id, user.uid, optionIndex, timeElapsed, isCorrect, finalScore);
    
    // Fetch explanation early while others answer
    setIsLoadingExplanation(true);
    try {
      const res = await fetch('/api/explain-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          correctAnswer: currentQuestion.options[currentQuestion.correctIndex],
          userAnswer: optionIndex >= 0 ? currentQuestion.options[optionIndex] : "No answer"
        })
      });
      const data = await res.json();
      
      setFeedbackData({
        isCorrect,
        score: finalScore,
        streak: isCorrect ? (currentPlayer?.currentStreak || 0) + 1 : 0,
        explanation: data.success ? data.explanation : currentQuestion.explanation || "No explanation available."
      });
    } catch (e) {
      setFeedbackData({
        isCorrect,
        score: finalScore,
        streak: isCorrect ? (currentPlayer?.currentStreak || 0) + 1 : 0,
        explanation: currentQuestion.explanation || "No explanation available."
      });
    }
    setIsLoadingExplanation(false);
  };

  const handleHostNextState = () => {
    if (!isHost || !room) return;

    if (gameState === 'playing') {
      // Transition to result
      // But we don't have a direct RTDB update for this in services, let's just go to next question
      // Wait, we need to show results first. 
      // Workaround: just advance to next question directly for simplicity, or end game if done
      if (room.currentQuestionIndex >= room.questions.length - 1) {
        endGame(roomId);
      } else {
        nextQuestion(roomId);
        const duration = room.config.timePerQuestion;
        updateTimer(roomId, Date.now() + duration * 1000, duration);
      }
    }
  };

  const handleHostEndGame = () => {
    if (isHost) endGame(roomId);
  };


  // --- RENDER ---

  if (loading || !room) {
    return (
      <main className="min-h-screen relative flex flex-col pt-20 px-4">
        <Navbar />
        <ParticlesBackground />
        <LobbySkeleton />
      </main>
    );
  }

  // Effect to show feedback when everyone has answered (if not already shown)
  // Since we don't have a 'question_result' state in RTDB in this implementation,
  // we just show feedback for 4 seconds after answering.
  const shouldShowFeedback = selectedAnswer !== null && feedbackData !== null;

  return (
    <main className="min-h-screen relative flex flex-col pt-20 px-4 pb-20">
      <ParticlesBackground />
      <Navbar />

      {/* BIG COUNTDOWN OVERLAY */}
      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring" as const, duration: 0.5 }}
              className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]"
            >
              {countdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto w-full relative z-10 mt-4">
        
        {/* MAIN CONTENT AREA */}
        <div className="flex-[2] flex flex-col gap-6">
          
          {gameState === 'lobby' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                <GlassCard className="p-8 rounded-3xl flex flex-col items-center flex-1 glow-blue border-white/10">
                  <RoomCodeDisplay code={room.code} size="lg" />
                </GlassCard>
                <GlassCard className="p-8 rounded-3xl flex-1 border-white/10 w-full">
                  <ShareRoom roomCode={room.code} roomId={roomId} />
                </GlassCard>
              </div>

              {isHost ? (
                <div className="flex justify-center mt-4">
                  <Button 
                    size="lg" 
                    className="h-16 px-16 text-xl bg-neon-green hover:bg-neon-green/90 text-black glow-green font-bold w-full md:w-auto"
                    onClick={handleStartGame}
                    disabled={activePlayers.length === 0}
                  >
                    <Play className="w-6 h-6 mr-2" />
                    {activePlayers.length === 0 ? "Waiting for players..." : "Start Game Now"}
                  </Button>
                </div>
              ) : (
                <div className="text-center mt-8 p-6 glass rounded-2xl flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-blue" />
                  <p className="text-xl text-muted-foreground font-medium">Waiting for host to start the game...</p>
                </div>
              )}
            </motion.div>
          )}

          {gameState === 'playing' && currentQuestion && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-6 relative">
              <div className="absolute -top-12 -right-4 md:right-0">
                <CountdownTimer timeRemaining={timeRemaining} totalTime={room.config.timePerQuestion} size={80} />
              </div>
              
              <QuestionCard 
                question={currentQuestion}
                questionIndex={room.currentQuestionIndex}
                totalQuestions={room.questions.length}
                selectedAnswer={selectedAnswer}
                correctAnswer={shouldShowFeedback ? currentQuestion.correctIndex : null}
                onAnswer={handleAnswerSubmit}
                disabled={selectedAnswer !== null || isHost}
              />
              
              <AnimatePresence>
                {shouldShowFeedback && feedbackData && !isHost && (
                  <AnswerFeedback 
                    isCorrect={feedbackData.isCorrect}
                    score={feedbackData.score}
                    streak={feedbackData.streak}
                    explanation={feedbackData.explanation}
                    isHost={false}
                    isLoadingExplanation={isLoadingExplanation}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="flex-1 flex flex-col gap-6 max-w-md w-full">
          {isHost && gameState === 'playing' && (
            <HostControlPanel 
              room={room} 
              onKickPlayer={(uid) => kickPlayer(roomId, user!.uid, uid)}
              onSkipQuestion={handleHostNextState}
              onEndGame={handleHostEndGame}
            />
          )}

          <GlassCard className="p-4 rounded-2xl border-white/10 max-h-[500px] overflow-hidden flex flex-col">
            {gameState === 'lobby' ? (
              <PlayerList 
                players={room.players} 
                hostUid={room.hostUid} 
                currentUid={user?.uid}
                onKick={isHost ? (uid) => kickPlayer(roomId, user!.uid, uid) : undefined}
              />
            ) : (
              <div className="flex flex-col h-full overflow-hidden pb-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Live Leaderboard</h3>
                <div className="overflow-y-auto flex-1 px-2 -mx-2">
                  <Leaderboard entries={leaderboard} currentUid={user?.uid} />
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {gameState === 'finished' && (
        <ResultsOverlay 
          leaderboard={leaderboard}
          currentUid={user?.uid || ""}
          onPlayAgain={() => router.push('/room/create')}
          onGoHome={() => router.push('/')}
          totalQuestions={room.questions.length}
        />
      )}
      
    </main>
  );
}
