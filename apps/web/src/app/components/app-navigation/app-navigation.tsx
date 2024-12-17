'use client';

import React, { useMemo } from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
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
import { capitalize } from 'lodash-es';

export const AppNavigation = () => {
  const { activeAnalysis } = useActiveAnalysis();
  const { activeCategory } = useActiveCategory();

  const truncatedUrl = useMemo(() => {
    if (!activeAnalysis?.url) {
      return null;
    }
    const url = new URL(activeAnalysis?.url);
    return `${url.host}${url.pathname === '/' ? '' : url.pathname}`;
  }, [activeAnalysis]);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <header className="w-full bg-gray-900/30 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4">
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
                  {truncatedUrl && (
                    <>
                      <BreadcrumbSeparator className="hidden md:inline" />
                      <URLBreadcrumb
                        className="hidden md:inline"
                        skipSubmit={!!activeCategory}
                        skipBackground
                        variant="medium"
                        url={truncatedUrl}
                      />
                      {activeCategory && (
                        <>
                          <BreadcrumbSeparator className="-ml-3 hidden md:inline" />
                          <span className="text-foreground text-lg hidden md:inline">
                            {capitalize(activeCategory)}
                          </span>
                        </>
                      )}
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <NavigationMenu className="py-3">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800"
                    href="/"
                  >
                    Analyze
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800"
                    href="/technologies"
                  >
                    Technologies
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    href="https://github.com/yavorsky/unbuilt.app"
                    target="_blank"
                  >
                    <GithubIcon size={20} />
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </header>
    </div>
  );
};
