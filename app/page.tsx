"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Users, Trophy, Shield, Zap, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Navbar } from "@/components/navbar";
import { ParticlesBackground } from "@/components/particles-background";
import { GlassCard } from "@/components/glass-card";
import { GlowButton } from "@/components/glow-button";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const FEATURES = [
  { icon: Brain, title: "AI-Powered", description: "Questions generated dynamically by Gemini 2.0 Flash." },
  { icon: Users, title: "Real-Time Multiplayer", description: "Sync instantly with friends via Firebase." },
  { icon: Trophy, title: "Live Leaderboard", description: "Watch your rank climb in real-time as you score." },
  { icon: Shield, title: "Anti-Cheat System", description: "Detects tab switching and inactivity." },
  { icon: Zap, title: "Smart Scoring", description: "Earn bonuses for faster answers and streaks." },
  { icon: Award, title: "Achievements", description: "Unlock cool badges to show off your skills." },
];

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [pendingAction, setPendingAction] = useState<'create' | 'join' | null>(null);

  const handleCreateRoom = () => {
    if (!user) {
      setPendingAction('create');
      setIsAuthOpen(true);
    } else {
      router.push('/room/create');
    }
  };

  const handleJoinClick = () => {
    if (!user) {
      setPendingAction('join');
      setIsAuthOpen(true);
    } else {
      setIsJoinOpen(true);
    }
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.length === 6) {
      try {
        console.log(`[Join] Looking up room code: ${joinCode}`);
        const { getRoomByCode } = await import("@/services/room");
        const room = await getRoomByCode(joinCode);
        
        if (room) {
          console.log(`[Join] Room found, ID: ${room.id}. Redirecting...`);
          router.push(`/room/${room.id}`);
        } else {
          console.error(`[Join] Room not found for code: ${joinCode}`);
          toast.error("Room not found");
        }
      } catch (err) {
        console.error("[Join] Error looking up room:", err);
        toast.error("Failed to lookup room");
      }
    }
  };

  // If user signs in while a modal was pending
  useEffect(() => {
    if (user && pendingAction) {
      if (pendingAction === 'create') {
        setPendingAction(null);
        setTimeout(() => router.push('/room/create'), 0);
      } else if (pendingAction === 'join') {
        setPendingAction(null);
        setIsJoinOpen(true);
      }
    }
  }, [user, pendingAction, router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col">
      <ParticlesBackground />
      <Navbar />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-20 mt-16">
        
        {/* Hero Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl w-full text-center space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-block glass-strong px-4 py-1.5 rounded-full border-neon-purple/30 text-neon-purple text-sm font-bold uppercase tracking-wider mb-4 glow-purple">
            Powered by Google Gemini 2.0
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 tracking-tight leading-tight drop-shadow-lg">
            QuizBlitz <span className="text-gradient">AI</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Think Fast. Rank Faster. The ultimate real-time AI-powered multiplayer quiz experience.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <GlowButton 
              size="lg" 
              className="text-lg w-full sm:w-auto px-8 h-14"
              onClick={handleCreateRoom}
            >
              Create Room <ArrowRight className="ml-2 w-5 h-5" />
            </GlowButton>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg w-full sm:w-auto px-8 h-14 glass border-white/20 hover:bg-white/10"
              onClick={handleJoinClick}
            >
              Join Room
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-32"
        >
          {[
            { label: "Questions Generated", value: "10,000+" },
            { label: "Games Played", value: "5,000+" },
            { label: "Players Online", value: "500+" }
          ].map((stat, i) => (
            <GlassCard key={i} className="text-center p-6 rounded-2xl border-white/5">
              <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
              <div className="text-sm uppercase tracking-wider text-muted-foreground font-bold">{stat.label}</div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Features Section */}
        <div className="w-full max-w-6xl mt-32 space-y-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Why QuizBlitz AI?</h2>
            <p className="text-muted-foreground text-lg">Next-generation features for an unbeatable quiz experience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard hover glow className="p-6 h-full flex flex-col gap-4 items-start rounded-2xl border-white/10 bg-white/5">
                  <div className="p-3 rounded-xl bg-neon-blue/10 text-neon-blue">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 text-center space-y-8 relative radial-glow w-full max-w-4xl py-20"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white">Ready to Play?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <GlowButton size="lg" className="w-full sm:w-auto px-10 h-14 text-lg" onClick={handleCreateRoom}>
              Start Hosting Now
            </GlowButton>
          </div>
        </motion.div>

      </div>

      {/* Modals */}
      <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} />
      
      <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
        <DialogContent className="sm:max-w-md border-white/10 glass-strong">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center font-bold">Join Room</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleJoinSubmit} className="flex flex-col gap-4 py-4">
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit code"
              className="text-center text-2xl tracking-[0.5em] font-mono h-16 uppercase glass border-white/20"
              maxLength={6}
            />
            <Button 
              type="submit" 
              disabled={joinCode.length !== 6}
              className="h-12 w-full bg-white text-black hover:bg-white/90 font-bold"
            >
              Join Game
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
