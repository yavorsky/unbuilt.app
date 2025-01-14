import { ReactNode, Suspense } from 'react';
import { AppNavigation } from '../components/app-navigation';
import { ActiveAnalysisProvider } from '../contexts/active-analysis';
import { ActiveCategoryProvider } from '../contexts/active-category';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';

export default function RoutesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <Suspense>
      <div className="min-h-screen flex flex-col">
        <Toaster />
        <ActiveAnalysisProvider>
          <ActiveCategoryProvider>
            <AppNavigation />
            <div className="flex-1 flex flex-col">
              {children}
              <footer className="w-full p-4 mt-auto">
                <div className="max-w-md mx-auto flex justify-between items-center">
                  <Link
                    href="mailto:aqson@me.com"
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <span>aqson@me.com</span>
                  </Link>

                  <Link
                    href="https://x.com/yavorsky_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <span>@yavorsky_</span>
                  </Link>
                </div>
              </footer>
            </div>
          </ActiveCategoryProvider>
        </ActiveAnalysisProvider>
      </div>
    </Suspense>
  );
}
