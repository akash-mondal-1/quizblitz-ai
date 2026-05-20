"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface ShareRoomProps {
  roomCode: string;
  roomId: string;
}

export function ShareRoom({ roomCode, roomId }: ShareRoomProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/room/${roomId}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Room link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold">
        Invite Players
      </div>
      <div className="flex items-center gap-2">
        <div className="glass px-6 py-3 rounded-xl font-mono text-2xl tracking-[0.3em] font-bold text-white border-white/20 select-all">
          {roomCode}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-xl border-white/20 glass hover:bg-white/10"
          onClick={handleCopy}
          title="Copy Link"
        >
          {copied ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <Check className="w-6 h-6 text-green-400" />
            </motion.div>
          ) : (
            <Copy className="w-6 h-6 text-neon-blue" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground max-w-xs text-center">
        Share this code or copy the link to invite friends to your quiz room.
      </p>
    </div>
  );
}
