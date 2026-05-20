"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, Crown, Ban } from "lucide-react";
import type { Player } from "@/types";
import { Button } from "./ui/button";
import { cn } from "@/utils/cn";

interface PlayerListProps {
  players: Record<string, Player>;
  hostUid: string;
  currentUid?: string;
  onKick?: (uid: string) => void;
  showStatus?: boolean; // Whether to show online/offline status or answered status
}

export function PlayerList({ players, hostUid, currentUid, onKick, showStatus = false }: PlayerListProps) {
  const playersList = Object.values(players || {});
  const isCurrentUserHost = currentUid === hostUid;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between px-2 mb-2">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Players ({playersList.filter(p => p.connected).length})
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {playersList.map((player) => (
            <motion.div
              key={player.uid}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
              className={cn(
                "glass p-3 rounded-xl flex items-center justify-between border transition-colors",
                player.uid === currentUid ? "border-neon-blue/50 bg-neon-blue/5" : "border-white/5",
                !player.connected && "opacity-50"
              )}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="relative shrink-0">
                  {player.photoURL ? (
                    <img src={player.photoURL} alt={player.displayName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <UserCircle className="w-10 h-10 text-white/50" />
                  )}
                  {/* Status Indicator */}
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-background",
                    player.connected ? "bg-neon-green" : "bg-muted"
                  )} />
                </div>
                
                <div className="flex flex-col truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold truncate">
                      {player.displayName}
                    </span>
                    {player.uid === currentUid && (
                      <span className="text-[10px] uppercase font-bold text-neon-blue bg-neon-blue/20 px-1.5 rounded-sm">You</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    {player.uid === hostUid ? (
                      <span className="flex items-center text-neon-purple"><Crown className="w-3 h-3 mr-1" /> Host</span>
                    ) : (
                      <span>Player</span>
                    )}
                    {showStatus && player.answeredCurrent && (
                      <span className="text-neon-green ml-2">Answered</span>
                    )}
                  </div>
                </div>
              </div>

              {isCurrentUserHost && player.uid !== currentUid && onKick && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onKick(player.uid)}
                  className="shrink-0 text-white/30 hover:text-destructive hover:bg-destructive/20 h-8 w-8 ml-2"
                  title="Kick player"
                >
                  <Ban className="w-4 h-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {playersList.length === 0 && (
          <div className="col-span-full text-center py-8 text-white/30 text-sm">
            No players joined yet
          </div>
        )}
      </div>
    </div>
  );
}
