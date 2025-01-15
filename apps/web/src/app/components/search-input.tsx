// components/search-input.tsx
import { Input } from '@/components/ui/input';
import { useDebounceCallback } from 'usehooks-ts';

interface SearchInputProps {
  onSearch: (value: string) => void;
  initialValue: string | undefined;
}

export function SearchInput({ onSearch, initialValue }: SearchInputProps) {
  const debounced = useDebounceCallback(onSearch, 300);

  return (
    <Input
      placeholder="Search websites..."
      onChange={(e) => debounced(e.target.value)}
      className="max-w-sm border-border text-foreground"
      defaultValue={initialValue ?? ''}
    />
  );
}
