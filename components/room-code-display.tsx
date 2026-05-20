"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

interface RoomCodeDisplayProps {
  code: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RoomCodeDisplay({ code, size = 'lg' }: RoomCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Room code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    }
  };

  return (
    <div 
      className="flex flex-col items-center gap-3 cursor-pointer group"
      onClick={handleCopy}
      title="Click to copy code"
    >
      <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
        Room Code
        {copied ? <Check className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />}
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex items-center gap-1 sm:gap-2"
      >
        {code.split('').map((char, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className={cn(
              "glass font-mono font-bold flex items-center justify-center text-white border-white/20 transition-colors group-hover:border-neon-blue/50 group-hover:bg-white/10",
              size === 'sm' && "w-8 h-10 text-xl rounded-md",
              size === 'md' && "w-10 h-12 sm:w-12 sm:h-14 text-2xl sm:text-3xl rounded-lg",
              size === 'lg' && "w-12 h-16 sm:w-16 sm:h-20 text-3xl sm:text-5xl rounded-xl shadow-lg"
            )}
          >
            {char}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
