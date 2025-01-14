'use client';

import React, { useCallback, useMemo } from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import * as features from '@unbuilt/features';
import { LogoIcon } from '../icons/logo';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { GithubIcon } from '../icons/github';
import { useActiveAnalysis } from '@/app/contexts/active-analysis';
import { URLBreadcrumb } from '../analysis-result/url-breadcrumb';
import { useActiveCategory } from '@/app/contexts/active-category';
import { useParams, usePathname } from 'next/navigation';
import { ToggleTheme } from '../toggle-theme';
import { CopyIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisTechnologies } from '@unbuilt/analyzer';

export const AppNavigation = () => {
  const { activeAnalysis } = useActiveAnalysis();
  const { activeCategoryLabel } = useActiveCategory();
  const pathname = usePathname();
  const params = useParams<{ name: string; type: AnalysisTechnologies }>();
  const { toast } = useToast();

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

  const activeRoute = useMemo(() => {
    if (pathname === '/' || pathname.startsWith('/analysis')) {
      return 'ANALYZE';
    }
    if (pathname.startsWith('/technologies')) {
      return 'TECHNOLOGIES';
    }
  }, [pathname]);

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
          <BreadcrumbItem className={activeCategoryLabel ? 'ml-2' : '-ml-2'}>
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
    <div className="fixed inset-x-0 top-0 z-50">
      <header className="w-full bg-gray-900/30 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
            </div>

            <NavigationMenu className="py-3">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={`inline-flex h-9 rounded-md px-4 py-2 text-sm text-foreground/70 data-[active=true]:text-foreground hover:text-foreground`}
                    data-active={activeRoute === 'ANALYZE'}
                    href="/"
                  >
                    Analyze
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={`inline-flex h-9 px-4 py-2 text-sm text-foreground/70  data-[active=true]:text-foreground hover:text-foreground`}
                    data-active={activeRoute === 'TECHNOLOGIES'}
                    href="/technologies"
                  >
                    Technologies
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="inline-flex h-9 px-4 py-2 text-sm"
                    href="https://github.com/yavorsky/unbuilt.app"
                    target="_blank"
                  >
                    <GithubIcon
                      size={20}
                      className="fill-foreground/80 hover:fill-foreground"
                    />
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <ToggleTheme />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </header>
    </div>
  );
};
