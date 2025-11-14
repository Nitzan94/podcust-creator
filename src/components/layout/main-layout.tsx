import { ReactNode } from 'react';
import { Header } from './header';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 mt-auto">
        <div className="container px-4 text-center text-sm text-zinc-500">
          <p>© 2025 Nutrition Track - מעקב תזונה חכם</p>
          <p className="mt-1">
            Powered by Next.js 16 + React 19 + TOON Format 💰
          </p>
        </div>
      </footer>
    </div>
  );
}
