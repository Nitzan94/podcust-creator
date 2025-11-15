'use client';

import { useState, useTransition } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createMealFromText } from '@/app/meals/actions';
import { useRouter } from 'next/navigation';

export function AddMealForm({ onCancel }: { onCancel: () => void }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = () => {
    if (!input.trim()) {
      setError('אנא הכנס מה אכלת');
      return;
    }

    setError('');
    startTransition(async () => {
      try {
        await createMealFromText(input);
        setInput('');
        onCancel();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'אירעה שגיאה');
      }
    });
  };

  return (
    <div className="bg-gradient-to-br from-cream/50 to-emerald/5 rounded-3xl p-8 border-2 border-emerald/20 shadow-2xl shadow-emerald/5">
      <div className="mb-6">
        <h2 className="font-serif text-3xl font-bold mb-2">מה אכלת?</h2>
        <p className="text-foreground/60">
          פשוט כתוב, והמערכת תזהה את המזונות והכמויות
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="meal-input">רשום כאן 🗣️</Label>
          <Textarea
            id="meal-input"
            placeholder='לדוגמה: "2 ביצים וטוסט" או "200 גרם חזה עוף עם כוס אורז"'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            className="text-lg"
            disabled={isPending}
          />
          <p className="text-sm text-zinc-500">
            💡 המערכת תנסה קודם זיהוי מהיר (REGEX), ורק במידת הצורך תשתמש ב-AI
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSubmit}
            disabled={isPending || !input.trim()}
            className="flex-1 px-8 py-4 bg-emerald hover:bg-emerald-dark text-white font-bold text-lg rounded-2xl transition-all hover:scale-105 hover:shadow-xl shadow-emerald/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                <span>מעבד...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>⚡</span>
                <span>הוסף</span>
              </span>
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isPending}
            className="px-6 py-4 bg-white hover:bg-foreground/5 border-2 border-foreground/10 hover:border-foreground/20 font-bold rounded-2xl transition-all"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
}
