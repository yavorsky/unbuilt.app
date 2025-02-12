import React from 'react';
import Link from 'next/link';
import { LogoIcon } from '../icons/logo';
import { AppNavigationMenu } from './app-navigation-menu';
import { NavigationBreadcrumb } from './navigation-breadcrumb';
import { LogoText } from './logo-text';

export const AppNavigation = () => {
  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <header className="w-full  backdrop-blur-sm border-b border-border">
        <div className="lg:container mx-auto">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center justify-center text-lg font-semibold text-foreground"
              >
                <LogoIcon size={40} />
                <LogoText />
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
