'use client';

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import api from '@/lib/api-client';

interface QuickFoodLogProps {
  onSuccess?: () => void;
}

export function QuickFoodLog({ onSuccess }: QuickFoodLogProps) {
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleQuickAdd = () => {
    if (!input.trim()) return;

    startTransition(async () => {
      try {
        // Parse with AI/REGEX
        const parsed = await api.meals.parse(input);

        // Create meal immediately
        await api.meals.create({
          parsedText: input,
          items: parsed.mealData.items,
        });

        setInput('');
        onSuccess?.();
      } catch (error) {
        console.error('Quick add error:', error);
        alert('שגיאה בהוספה מהירה');
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isPending) {
      handleQuickAdd();
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald/10 to-emerald/5 rounded-2xl p-4 border-2 border-emerald/20 flex gap-3 items-center">
      <div className="text-2xl">⚡</div>
      <Input
        placeholder='הוספה מהירה: "2 ביצים" או "כוס אורז"...'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isPending}
        className="flex-1 border-0 bg-white/50 focus:bg-white"
      />
      <button
        onClick={handleQuickAdd}
        disabled={!input.trim() || isPending}
        className="px-6 py-2 bg-emerald hover:bg-emerald-dark text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {isPending ? '...' : 'הוסף'}
      </button>
    </div>
  );
}
