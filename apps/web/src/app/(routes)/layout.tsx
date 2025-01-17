import { ReactNode, Suspense } from 'react';
import { AppNavigation } from '../components/app-navigation';
import { ActiveAnalysisProvider } from '../contexts/active-analysis';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';

export default function RoutesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
      <ActiveAnalysisProvider>
        <Suspense>
          <AppNavigation />
        </Suspense>
        <div className="flex-1 flex flex-col">
          {children}
          <footer className="w-full p-4 mt-auto">
            <div className="max-w-3xl mx-auto flex justify-center items-center mb-2 text-foreground/50 gap-1">
              Free and Open Source. Currently collecting data and improving
              algorithms.{' '}
              <a
                href="https://github.com/yavorsky/unbuilt.app/pulls"
                target="_blank"
                className="hover:text-foreground"
                rel="noopener noreferrer"
              >
                Join contribution efforts!
              </a>
            </div>
            <div className="max-w-3xl mx-auto flex justify-center items-center text-foreground/50 gap-1">
              Maintained with ❤️ by{' '}
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
      </ActiveAnalysisProvider>
    </div>
  );
}
