import { cn } from "@/utils/cn";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/5", className)}
      {...props}
    />
  );
}

export function QuestionSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="space-y-4 text-center">
        <Skeleton className="h-4 w-32 mx-auto rounded-full" />
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-12 w-2/3 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function LobbySkeleton() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 mt-12 w-full max-w-md mx-auto">
      <Skeleton className="h-8 w-48 rounded-full" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="space-y-4 w-full mt-8">
        <Skeleton className="h-6 w-32" />
        <LeaderboardSkeleton />
      </div>
    </div>
  );
}
