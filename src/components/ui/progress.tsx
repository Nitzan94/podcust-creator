import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  colorClass?: string;
}

export function Progress({
  value,
  max = 100,
  showLabel = false,
  colorClass = 'bg-green-600',
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={cn('w-full space-y-1', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span>{value}</span>
          <span className="text-zinc-500">/ {max}</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className={cn('h-full transition-all duration-300', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-zinc-500 text-left">
          {percentage}%
        </div>
      )}
    </div>
  );
}
