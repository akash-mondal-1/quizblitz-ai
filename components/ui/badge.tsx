import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border',
  {
    variants: {
      variant: {
        default:
          'bg-neon-blue/10 text-neon-blue border-neon-blue/20 shadow-[0_0_10px_rgba(59,130,246,0.15)]',
        secondary:
          'bg-neon-purple/10 text-neon-purple border-neon-purple/20 shadow-[0_0_10px_rgba(139,92,246,0.15)]',
        destructive:
          'bg-destructive/10 text-destructive border-destructive/20 shadow-[0_0_10px_rgba(239,68,68,0.15)]',
        success:
          'bg-neon-green/10 text-neon-green border-neon-green/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]',
        outline:
          'bg-transparent text-foreground border-white/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
