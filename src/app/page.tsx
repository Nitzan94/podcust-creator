import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-background relative grain-texture">
      {/* Organic background accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald/5 organic-blob blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-terracotta/5 organic-blob blur-3xl" />

      <main className="relative z-10">
        {/* Hero Section - Dramatic & Asymmetric */}
        <div className="container mx-auto px-6 pt-20 pb-32 md:pt-32 md:pb-40">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Headline */}
            <div className="space-y-8 opacity-0 animate-fade-in-up">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-emerald/10 rounded-full border border-emerald/20">
                  <span className="text-sm font-bold text-emerald">מופעל ב-AI</span>
                </div>
                <h1 className="font-serif text-7xl md:text-8xl font-bold leading-[0.9] text-foreground">
                  מעקב תזונה
                  <br />
                  <span className="text-emerald">חכם</span>
                </h1>
                <p className="text-xl md:text-2xl text-foreground/70 max-w-lg leading-relaxed">
                  לוג מזון בשפה טבעית, קבל ניתוח תזונתי מדויק, והשג את מטרות הבריאות שלך
                </p>
              </div>

              <div className="flex gap-4 items-center">
                <Link href="/dashboard">
                  <button className="group px-8 py-4 bg-emerald hover:bg-emerald-dark text-white font-bold text-lg rounded-2xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-emerald/20">
                    <span className="flex items-center gap-2">
                      התחל עכשיו
                      <span className="group-hover:translate-x-1 transition-transform">←</span>
                    </span>
                  </button>
                </Link>
                <div className="text-sm text-foreground/50">
                  חינם לחלוטין
                </div>
              </div>
            </div>

            {/* Right: Feature Showcase */}
            <div className="relative opacity-0 animate-fade-in-up delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald/20 to-terracotta/20 rounded-[3rem] rotate-3" />
              <div className="relative bg-cream/50 backdrop-blur-sm p-8 rounded-[3rem] shadow-2xl border border-white/50">
                <div className="space-y-6">
                  <div className="text-center pb-4 border-b border-foreground/10">
                    <div className="text-5xl mb-2">🥗</div>
                    <div className="font-serif text-2xl font-bold">דוגמה חיה</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-sm text-foreground/50 mb-2">הקלד:</div>
                    <div className="font-bold text-lg mb-4 text-foreground/80">"אכלתי 2 ביצים וטוסט עם אבוקדו"</div>
                    <div className="h-px bg-gradient-to-l from-emerald/0 via-emerald/50 to-emerald/0 my-4" />
                    <div className="text-sm text-foreground/50 mb-2">AI מזהה:</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-emerald/5 px-4 py-2 rounded-lg">
                        <span className="font-semibold">ביצים × 2</span>
                        <span className="text-emerald font-bold">140 קלוריות</span>
                      </div>
                      <div className="flex justify-between items-center bg-terracotta/5 px-4 py-2 rounded-lg">
                        <span className="font-semibold">טוסט</span>
                        <span className="text-terracotta font-bold">80 קלוריות</span>
                      </div>
                      <div className="flex justify-between items-center bg-golden/5 px-4 py-2 rounded-lg">
                        <span className="font-semibold">אבוקדו</span>
                        <span className="text-golden font-bold">120 קלוריות</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid - Magazine Style */}
        <div className="bg-cream py-20 md:py-32">
          <div className="container mx-auto px-6">
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-center mb-16 opacity-0 animate-fade-in-up delay-300">
              למה Nutrition Track?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: "🗣️", title: "שפה טבעית", desc: "פשוט כתוב מה אכלת בעברית והמערכת תבין", color: "emerald" },
                { icon: "🤖", title: "AI מתקדם", desc: "מופעל ע\"י Gemini, GPT או Claude", color: "terracotta" },
                { icon: "📊", title: "ניתוח מלא", desc: "עקוב אחר קלוריות, חלבונים ומקרונוטריינטים", color: "golden" },
                { icon: "🎯", title: "השגת מטרות", desc: "הגדר יעדים אישיים וצפה בהתקדמות", color: "sage" },
                { icon: "📖", title: "מתכונים חכמים", desc: "צור מתכונים מותאמים עם AI", color: "emerald" },
                { icon: "⭐", title: "מועדפים", desc: "שמור ארוחות ומזונות שאתה אוהב", color: "terracotta" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 opacity-0 animate-fade-in-up border border-foreground/5"
                  style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                >
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/60 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-6 py-20 md:py-32 text-center">
          <div className="max-w-3xl mx-auto space-y-8 opacity-0 animate-fade-in-up delay-500">
            <h2 className="font-serif text-5xl md:text-6xl font-bold">
              מוכן להתחיל?
            </h2>
            <p className="text-xl text-foreground/70">
              התחל לעקוב אחר התזונה שלך עוד היום
            </p>
            <Link href="/dashboard">
              <button className="group px-12 py-6 bg-gradient-to-l from-emerald to-emerald-dark hover:from-emerald-dark hover:to-emerald text-white font-bold text-xl rounded-2xl transition-all hover:scale-105 hover:shadow-2xl shadow-emerald/30">
                <span className="flex items-center gap-3">
                  לוח הבקרה שלי
                  <span className="group-hover:translate-x-2 transition-transform text-2xl">←</span>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-foreground/10 py-8 text-center text-sm text-foreground/40">
        <p>© 2025 Nutrition Track · בנוי עם Next.js 16 + AI</p>
      </footer>
    </div>
  );
}
