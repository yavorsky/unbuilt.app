'use client';

import { ReactNode, useCallback, useMemo } from 'react';
import { ActiveCategoryContext } from './active-category-context';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnalysisKeys } from '@unbuilt/analyzer';
import { getCategoryLabel } from '@/app/utils/get-category-label';

export function ActiveCategoryProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    return params.get('category') as AnalysisKeys;
  }, [searchParams]);

  const updateActiveCategory = useCallback(
    (categoryId: AnalysisKeys) => {
      const params = new URLSearchParams(searchParams);
      params.set('category', categoryId);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearActiveCategory = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const value = useMemo(() => {
    return {
      activeCategory,
      activeCategoryLabel: getCategoryLabel(activeCategory),
      updateActiveCategory,
      clearActiveCategory,
    };
  }, [activeCategory, updateActiveCategory, clearActiveCategory]);

  return (
    <ActiveCategoryContext.Provider value={value}>
      {children}
    </ActiveCategoryContext.Provider>
  );
}
