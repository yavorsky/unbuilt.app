import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalysisTechnologies } from '@unbuilt/analyzer';
import { Github, Sparkles, Twitter } from 'lucide-react';

export function ComingSoonCard<N extends AnalysisTechnologies>({
  isLoading,
}: {
  isLoading: boolean;
}) {
  const className =
    'max-w-md backdrop-blur-sm border-border group transition-opacity duration-300 min-h-40 opacity-70 hover:opacity-100';

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="py-4 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-400"></p>
            </div>
          </div>
          <div className="flex items-center space-x-4 pt-1">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-[150px]" />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="space-y-1 py-4">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex justify-center items-center">
                <Sparkles className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="font-semibold text-xl tracking-tight text-foreground">
                More is coming
              </h3>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Stay tuned & shape what&apos;s next with us!
        </p>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <a
            href="https://twitter.com/yavorsky_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-indigo-500 transition-colors"
          >
            <Twitter className="w-4 h-4" />
            <span>Follow updates</span>
          </a>
          <a
            href="https://github.com/yavorsky/unbuilt.app/contribution-guide"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-indigo-500 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>Contribute</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
