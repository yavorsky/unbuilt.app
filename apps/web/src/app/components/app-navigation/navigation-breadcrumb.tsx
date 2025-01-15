import { useToast } from '@/hooks/use-toast';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import * as features from '@unbuilt/features';
import { LogoIcon } from '../icons/logo';
import { URLBreadcrumb } from '../analysis-result/url-breadcrumb';
import { FC, useCallback, useMemo } from 'react';
import { AnalysisTechnologies } from '@unbuilt/analyzer';
import { useParams } from 'next/navigation';
import { useActiveAnalysis } from '@/app/contexts/active-analysis';
import { CopyIcon } from 'lucide-react';
import { useActiveCategory } from '@/app/hooks/use-active-categoy';

export const NavigationBreadcrumb: FC<{
  activeRoute: 'ANALYZE' | 'TECHNOLOGIES' | undefined;
}> = ({ activeRoute }) => {
  const params = useParams<{ name: string; type: AnalysisTechnologies }>();
  const { toast } = useToast();
  const { activeAnalysis } = useActiveAnalysis();

  const { activeCategoryLabel } = useActiveCategory();

  const truncatedUrl = useMemo(() => {
    if (!activeAnalysis?.url) {
      return null;
    }
    const url = new URL(activeAnalysis?.url);
    return `${url.host}${url.pathname === '/' ? '' : url.pathname}`;
  }, [activeAnalysis]);

  const handleCopyUrl = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast({
      description: 'Analysis URL copied to clipboard',
      duration: 2000,
    });
  }, [toast]);

  const breadcrumbForRoute = useMemo(() => {
    if (activeRoute === 'ANALYZE' && truncatedUrl) {
      return (
        <div className="flex items-center gap-2">
          <BreadcrumbSeparator className="hidden md:inline" />
          <URLBreadcrumb
            className="hidden md:inline"
            skipSubmit={!!activeCategoryLabel}
            skipBackground
            variant="medium"
            url={truncatedUrl}
          />
          {activeCategoryLabel && (
            <>
              <BreadcrumbSeparator className="-ml-3 hidden md:inline" />
              <BreadcrumbItem className="text-foreground text-lg hidden md:inline">
                {activeCategoryLabel}
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbItem
            className={`hidden md:inline ${activeCategoryLabel ? 'ml-2' : '-ml-2'}`}
          >
            <CopyIcon
              className="cursor-pointer transition-colors hover:text-blue-500"
              size={14}
              onClick={handleCopyUrl}
            />
          </BreadcrumbItem>
        </div>
      );
    }
    const meta = features[params.type]?.meta;
    if (activeRoute === 'TECHNOLOGIES') {
      const subTechnologyRoute = (
        meta?.[params.name as keyof typeof meta] as features.Meta
      )?.name;
      return (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-foreground text-lg hidden md:inline">
            <BreadcrumbLink href="/technologies">Technologies</BreadcrumbLink>
          </BreadcrumbItem>
          {subTechnologyRoute && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-foreground text-lg hidden md:inline">
                {subTechnologyRoute}
              </BreadcrumbItem>
            </>
          )}
        </>
      );
    }
  }, [activeRoute, activeCategoryLabel, truncatedUrl, handleCopyUrl, params]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="text-xl">
          <BreadcrumbLink asChild>
            <Link
              href="/"
              className="flex items-center justify-center text-lg font-semibold text-foreground"
            >
              <LogoIcon size={40} />
              <span className="ml-2 hidden sm:inline">
                Unbuilt
                <span className="text-foreground/80">.app</span>
              </span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbForRoute}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
