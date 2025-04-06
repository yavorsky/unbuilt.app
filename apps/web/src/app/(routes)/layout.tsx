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
          <footer className="w-full p-4 mt-auto text-sm">
            <div className="max-w-3xl mx-auto flex justify-center items-center text-foreground/50 gap-1">
              <a
                href="/about"
                className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                About Unbuilt.app
              </a>{' '}
              | Maintained with ❤️ by{' '}
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
