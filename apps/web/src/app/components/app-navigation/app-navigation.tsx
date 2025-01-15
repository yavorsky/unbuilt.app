'use client';

import React, { useMemo } from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { GithubIcon } from '../icons/github';
import { usePathname } from 'next/navigation';
import { ToggleTheme } from '../toggle-theme';
import { NavigationBreadcrumb } from './navigation-breadcrumb';

export const AppNavigation = () => {
  const pathname = usePathname();

  const activeRoute = useMemo(() => {
    if (pathname === '/' || pathname.startsWith('/analysis')) {
      return 'ANALYZE';
    }
    if (pathname.startsWith('/technologies')) {
      return 'TECHNOLOGIES';
    }
  }, [pathname]);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <header className="w-full bg-muted/80 backdrop-blur-sm border-b border-border">
        <div className="lg:container mx-auto">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <NavigationBreadcrumb activeRoute={activeRoute} />
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
