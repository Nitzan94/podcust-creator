'use client';

import { useState } from 'react';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const today = new Date();
  const isToday = selectedDate.toDateString() === today.toDateString();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-foreground/10 flex items-center justify-between gap-4">
      <button
        onClick={goToPreviousDay}
        className="p-2 hover:bg-foreground/5 rounded-xl transition-colors"
        aria-label="יום קודם"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex-1 text-center">
        <div className="font-bold text-lg">{formatDate(selectedDate)}</div>
        {!isToday && (
          <button
            onClick={goToToday}
            className="text-sm text-emerald hover:underline mt-1"
          >
            חזור להיום
          </button>
        )}
      </div>

      <button
        onClick={goToNextDay}
        disabled={isToday}
        className="p-2 hover:bg-foreground/5 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="יום הבא"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
