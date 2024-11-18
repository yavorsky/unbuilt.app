import { Button } from '@/components/ui/button';
import { FC } from 'react';

export const SubmitButton: FC<{ isPending: boolean }> = ({ isPending }) => {
  return (
    <Button
      type="submit"
      disabled={isPending}
      className="px-4 p-5 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:bg-blue-300"
    >
      {isPending ? 'Analyzing...' : 'Analyze Website'}
    </Button>
  );
}
