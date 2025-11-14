import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-zinc-50 dark:to-zinc-900">
      <main className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Nutrition Track
          </h1>
          <h2 className="text-3xl font-semibold text-foreground/90">
            מעקב תזונה חכם
          </h2>
          <p className="text-lg text-foreground/70 max-w-xl mx-auto">
            לוג מזון בשפה טבעית, קבל ניתוח תזונתי מדויק, והשג את מטרות הבריאות שלך
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-green-500 transition-colors">
            <div className="text-3xl mb-3">🗣️</div>
            <h3 className="font-semibold text-lg mb-2">שפה טבעית</h3>
            <p className="text-sm text-foreground/60">
              פשוט כתוב מה אכלת: "2 ביצים וטוסט עם אבוקדו"
            </p>
          </div>

          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-green-500 transition-colors">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold text-lg mb-2">AI מתקדם</h3>
            <p className="text-sm text-foreground/60">
              מופעל על ידי Gemini, GPT, או Claude
            </p>
          </div>

          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-green-500 transition-colors">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-lg mb-2">ניתוח תזונתי</h3>
            <p className="text-sm text-foreground/60">
              עקוב אחר קלוריות, חלבונים, פחמימות ושומנים
            </p>
          </div>

          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-green-500 transition-colors">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-lg mb-2">מעקב אחר מטרות</h3>
            <p className="text-sm text-foreground/60">
              הגדר מטרות אישיות והשג אותן
            </p>
          </div>

          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-green-500 transition-colors">
            <div className="text-3xl mb-3">📖</div>
            <h3 className="font-semibold text-lg mb-2">מתכונים אישיים</h3>
            <p className="text-sm text-foreground/60">
              צור וחפש מתכונים מותאמים אישית עם AI
            </p>
          </div>

          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-green-500 transition-colors">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-semibold text-lg mb-2">מועדפים</h3>
            <p className="text-sm text-foreground/60">
              שמור ארוחות ומתכונים נפוצים
            </p>
          </div>
        </div>

        <div className="pt-8 space-y-4">
          <Link href="/dashboard">
            <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
              התחל עכשיו →
            </button>
          </Link>

          <div className="text-xs text-foreground/50">
            <p>Powered by TOON Format - חוסך עד 60% בעלויות AI! 💰</p>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-center text-sm text-foreground/40">
        <p>
          Built with Next.js 16 + React 19 + Tailwind 4 + NeonDB + AI
        </p>
      </footer>
    </div>
  );
}
