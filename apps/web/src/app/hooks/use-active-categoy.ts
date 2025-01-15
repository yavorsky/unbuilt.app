'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnalysisKeys } from '@unbuilt/analyzer';
import { getCategoryLabel } from '@/app/utils/get-category-label';

export function useActiveCategory() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    return params.get('category') as AnalysisKeys | null;
  }, [searchParams]);

  const updateActiveCategory = useCallback(
    (categoryId: AnalysisKeys | null) => {
      const params = new URLSearchParams(searchParams);
      if (categoryId) {
        params.set('category', categoryId);
      } else {
        params.delete('category');
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearActiveCategory = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  return useMemo(() => {
    return {
      activeCategory,
      activeCategoryLabel: getCategoryLabel(activeCategory),
      updateActiveCategory,
      clearActiveCategory,
    };
  }, [activeCategory, updateActiveCategory, clearActiveCategory]);
}
