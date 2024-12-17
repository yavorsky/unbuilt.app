import { Button } from '@/components/ui/button';
import { Loader2, Globe } from 'lucide-react';
import { FC } from 'react';

export const SubmitButton: FC<{ isPending: boolean }> = ({ isPending }) => {
  return (
    <Button
      type="submit"
      disabled={isPending}
      size="icon"
      className="bg-blue-700 hover:bg-blue-600 disabled:bg-blue-300 w-12 h-10.5"
      aria-label={isPending ? 'Analyzing...' : 'Analyze Website'}
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin text-white" />
      ) : (
        <Globe className="h-5 w-5 text-white" />
      )}
    </Button>
  );
};
