"use client";

import { motion } from "framer-motion";
import { Users, Timer, SkipForward, Ban, Crown, Play } from "lucide-react";
import { Button } from "./ui/button";
import type { RoomData } from "@/types";
import { cn } from "@/utils/cn";

interface HostControlPanelProps {
  room: RoomData;
  onKickPlayer: (uid: string) => void;
  onSkipQuestion: () => void;
  onEndGame: () => void;
  onStartTimer?: () => void; // Added for testing/manual control if needed
}

export function HostControlPanel({ room, onKickPlayer, onSkipQuestion, onEndGame }: HostControlPanelProps) {
  const players = Object.values(room.players || {});
  const activePlayers = players.filter(p => p.connected && !p.isHost);
  const answeredCount = activePlayers.filter(p => p.answeredCurrent).length;
  
  return (
    <div className="glass-strong rounded-xl p-4 flex flex-col gap-4 border-neon-purple/30">
      <div className="flex items-center gap-2 text-neon-purple pb-2 border-b border-white/10">
        <Crown className="w-5 h-5" />
        <h3 className="font-bold tracking-wider uppercase text-sm">Host Controls</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/5 rounded-lg p-3 flex flex-col items-center justify-center border border-white/5">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Answers</span>
          <div className="flex items-baseline gap-1">
            <span className={cn("text-2xl font-bold", answeredCount === activePlayers.length ? "text-neon-green" : "text-white")}>
              {answeredCount}
            </span>
            <span className="text-sm text-white/50">/ {activePlayers.length}</span>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3 flex flex-col items-center justify-center border border-white/5">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">State</span>
          <span className="text-sm font-medium text-white capitalize">{room.gameState.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs text-muted-foreground uppercase tracking-wider pl-1">Actions</div>
        <div className="flex flex-col gap-2">
          {room.gameState === 'question_result' ? (
            <Button onClick={onSkipQuestion} className="w-full bg-neon-green/20 text-neon-green hover:bg-neon-green/30 hover:glow-green border border-neon-green/30">
              <Play className="w-4 h-4 mr-2" />
              Next Question
            </Button>
          ) : (
            <Button onClick={onSkipQuestion} variant="outline" className="w-full">
              <SkipForward className="w-4 h-4 mr-2" />
              Skip Question
            </Button>
          )}
          
          <Button onClick={onEndGame} variant="destructive" className="w-full opacity-80 hover:opacity-100">
            End Game Early
          </Button>
        </div>
      </div>

      <div className="space-y-2 mt-2">
        <div className="text-xs text-muted-foreground uppercase tracking-wider pl-1 flex items-center justify-between">
          <span>Players</span>
          <Users className="w-3 h-3" />
        </div>
        <div className="max-h-[150px] overflow-y-auto pr-1 space-y-1">
          {activePlayers.length === 0 ? (
            <div className="text-xs text-center py-4 text-white/40">No other players</div>
          ) : (
            activePlayers.map(player => (
              <div key={player.uid} className="flex items-center justify-between bg-white/5 p-2 rounded-md text-sm">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className={cn("w-2 h-2 rounded-full", player.answeredCurrent ? "bg-neon-green glow-green" : "bg-white/20")} />
                  <span className="truncate">{player.displayName}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-white/40 hover:text-destructive hover:bg-destructive/20"
                  onClick={() => onKickPlayer(player.uid)}
                  title="Kick Player"
                >
                  <Ban className="w-3 h-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
