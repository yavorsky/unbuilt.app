import React from 'react';
import Link from 'next/link';
import { LogoIcon } from '../icons/logo';
import { AppNavigationMenu } from './app-navigation-menu';
import { NavigationBreadcrumb } from './navigation-breadcrumb';

export const AppNavigation = () => {
  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <header className="w-full bg-muted/80 backdrop-blur-sm border-b border-border">
        <div className="lg:container mx-auto">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
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
              <NavigationBreadcrumb />
            </div>

            <AppNavigationMenu />
          </div>
        </div>
      </header>
    </div>
  );
};
