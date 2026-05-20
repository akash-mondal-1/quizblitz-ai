'use client';

import { useEffect, useRef, useCallback } from 'react';

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  gravity: number;
  wind: number;
}

const CONFETTI_COLORS = [
  '#3b82f6', // neon-blue
  '#8b5cf6', // neon-purple
  '#ec4899', // neon-pink
  '#10b981', // neon-green
  '#eab308', // neon-yellow
  '#ffffff', // white
  '#06b6d4', // neon-cyan
  '#f97316', // neon-orange
];

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export function Confetti({ active, duration = 5000 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const startTimeRef = useRef<number>(0);

  const createParticles = useCallback(
    (width: number, height: number): ConfettiParticle[] => {
      const count = 160;
      const particles: ConfettiParticle[] = [];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: -20 - Math.random() * 100,
          vx: (Math.random() - 0.5) * 8,
          vy: Math.random() * 4 + 2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          width: Math.random() * 8 + 4,
          height: Math.random() * 4 + 2,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          opacity: 1,
          gravity: 0.12 + Math.random() * 0.08,
          wind: (Math.random() - 0.5) * 0.5,
        });
      }

      return particles;
    },
    []
  );

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(animationRef.current);
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particlesRef.current = createParticles(canvas.width, canvas.height);
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;

      if (elapsed > duration) {
        // Fade out remaining particles
        const allFaded = particlesRef.current.every((p) => p.opacity <= 0);
        if (allFaded) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        // Update physics
        p.vy += p.gravity;
        p.vx += p.wind;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Fade out after duration
        if (elapsed > duration - 1000) {
          p.opacity -= 0.02;
          if (p.opacity < 0) p.opacity = 0;
        }

        // Draw confetti piece
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [active, duration, createParticles]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      aria-hidden="true"
    />
  );
}
