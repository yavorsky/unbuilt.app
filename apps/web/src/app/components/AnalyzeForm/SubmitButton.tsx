import { Button } from '@/components/ui/button';
import { FC } from 'react';

export const SubmitButton: FC<{ isPending: boolean }> = ({ isPending }) => {
  return (
    <Button
      type="submit"
      disabled={isPending}
      className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
    >
      {isPending ? 'Analyzing...' : 'Analyze Website'}
    </Button>
  );
}
