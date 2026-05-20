'use client';

import { motion } from 'framer-motion';
import { Zap, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import type { UserProfile } from '@/types';

interface NavbarProps {
  user?: UserProfile | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export function Navbar({ user, onSignIn, onSignOut }: NavbarProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Zap className="h-7 w-7 text-neon-blue" />
              <div className="absolute inset-0 blur-lg bg-neon-blue/30" />
            </div>
            <span className="text-xl font-bold text-gradient">
              QuizBlitz AI
            </span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="h-8 w-8 rounded-full border border-white/10"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-sm font-semibold text-white">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground hidden sm:block">
                    {user.displayName}
                  </span>
                </div>

                {/* Sign Out */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onSignOut}
                  className="text-muted hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={onSignIn} size="sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
