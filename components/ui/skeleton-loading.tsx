import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]',
        className
      )}
    />
  );
}

export function SkeletonText({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border bg-card p-6', className)}>
      <Skeleton className="h-48 w-full mb-4" />
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonHero() {
  return (
    <section className="relative bg-gradient-to-br from-fun-blue/20 via-fun-pink/10 to-fun-yellow/20 py-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
          <div className="relative">
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SkeletonProfile() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Skeleton className="h-10 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Skeleton className="h-80 w-full rounded-2xl" />
          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-20 mb-4" />
              <SkeletonText lines={4} />
            </div>
            <div>
              <Skeleton className="h-8 w-20 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="w-2 h-2 rounded-full mt-2" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SkeletonVisionMission() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-8">
            <div className="text-center mb-6">
              <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-8 w-16 mx-auto mb-4" />
            </div>
            <SkeletonText lines={3} className="text-center" />
          </div>
          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-8">
            <div className="text-center mb-6">
              <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-8 w-16 mx-auto mb-6" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-2 h-2 rounded-full mt-2" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SkeletonPrograms() {
  return (
    <section className="py-20 bg-gradient-to-br from-fun-yellow/10 via-white to-fun-pink/10 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-64 mx-auto mb-6" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
        </div>
        <div className="grid md:grid-cols-1 gap-8 max-w-3xl mx-auto">
          <div className="text-center hover:shadow-2xl transition-all duration-500 group fun-hover border-0 overflow-hidden relative rounded-lg">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SkeletonActivities() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="text-center">
          <Skeleton className="h-12 w-48 mx-auto" />
        </div>
      </div>
    </section>
  );
}

export function SkeletonVideoGallery() {
  return (
    <section className="py-16 bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-80 mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-6 w-96 mx-auto mb-8 bg-white/20" />
          <Skeleton className="h-12 w-40 mx-auto bg-white/20" />
        </div>
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-48 mx-auto bg-white/20" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg p-4"
            >
              <Skeleton className="h-32 w-full mb-4 bg-white/20" />
              <Skeleton className="h-6 w-3/4 mb-2 bg-white/20" />
              <Skeleton className="h-4 w-full bg-white/20" />
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <div className="flex justify-center space-x-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-8 h-8 bg-white/20" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SkeletonFooter() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-48 bg-white/20" />
            <SkeletonText lines={3} className="bg-white/20" />
          </div>
          <div>
            <Skeleton className="h-6 w-32 mb-4 bg-white/20" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full bg-white/20" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-6 w-32 mb-4 bg-white/20" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full bg-white/20" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-6 w-32 mb-4 bg-white/20" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-5 h-5 mt-1 bg-white/20" />
                  <Skeleton className="h-4 flex-1 bg-white/20" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <Skeleton className="h-4 w-64 mx-auto bg-white/20" />
        </div>
      </div>
    </footer>
  );
}

// Foundation/Community Page Skeletons
export function SkeletonFoundationHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
          <div className="relative">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <Skeleton className="absolute -top-4 -right-4 h-14 w-14 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SkeletonFoundationPrograms() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-2 border-slate-100">
              <CardContent className="p-6">
                <Skeleton className="w-12 h-12 rounded-full mb-4 bg-gradient-to-r from-fun-blue to-fun-purple" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SkeletonFoundationCTA() {
  return (
    <section className="relative py-20 bg-gradient-to-r from-fun-yellow/20 to-fun-pink/20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/50 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/60 shadow-xl">
          <div className="text-center md:text-left">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    </section>
  );
}
