// components/ui/outdated-badge.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { cn } from '@/app/utils';
import {
  statuses,
  useExistingAnalysisMeta,
} from '@/app/hooks/use-existing-analysis';

interface OutdatedBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  url: string;
  variant?: 'subtle' | 'warning' | 'critical';
}

/**
 * Outdated Badge component
 * Displays a badge indicating that content is outdated
 */
export function OutdatedBadge({
  className,
  url,
  variant = 'subtle',
  ...props
}: OutdatedBadgeProps) {
  const variantStyles = {
    subtle: 'bg-muted text-muted-foreground hover:bg-muted/80',
    warning:
      'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-100/80 dark:hover:bg-amber-900/80',
    critical:
      'bg-destructive/15 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30',
  };

  const existingAnalysis = useExistingAnalysisMeta(url);

  if (!url || existingAnalysis.status !== statuses.OUTDATED) {
    return null;
  }

  return (
    <Badge
      className={cn(
        'gap-1 px-2 py-1 font-medium',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <Clock className="h-3 w-3" />
      Outdated
    </Badge>
  );
}
