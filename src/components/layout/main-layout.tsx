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
      <footer className="border-t border-foreground/10 py-8 mt-auto bg-cream/30">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🥗</div>
              <span className="font-serif text-lg font-bold text-emerald">
                Nutrition Track
              </span>
            </div>
            <div className="text-sm text-foreground/50 text-center md:text-right">
              <p>© 2025 · מעקב תזונה חכם · בנוי עם ❤️</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
