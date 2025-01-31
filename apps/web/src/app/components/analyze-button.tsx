import { Button } from '@/components/ui';
import { useStartNewAnalysis } from '../hooks/use-start-analysis';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

export const AnalyzeButton = ({
  label = 'Analyze',
  url,
  className,
}: {
  label?: ReactNode;
  url: string;
  className?: string;
}) => {
  const { startNewAnalysis, isPending } = useStartNewAnalysis();
  return (
    <Button
      variant="link"
      onClick={() => startNewAnalysis(url)}
      className={className}
      disabled={isPending}
    >
      {!isPending ? (
        label
      ) : (
        <Loader2 className="h-4 w-4 animate-spin text-white" />
      )}
    </Button>
  );
};
