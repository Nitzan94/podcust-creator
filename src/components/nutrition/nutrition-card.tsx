import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatNumber, getProgressBarColor } from '@/lib/utils';

interface NutritionCardProps {
  title: string;
  current: number;
  goal: number;
  unit: string;
  icon: string;
}

export function NutritionCard({ title, current, goal, unit, icon }: NutritionCardProps) {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  const colorClass = getProgressBarColor(percentage);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span>{icon}</span>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{formatNumber(current)}</span>
            <span className="text-zinc-500">/ {formatNumber(goal)} {unit}</span>
          </div>
          <Progress
            value={current}
            max={goal}
            colorClass={colorClass}
          />
          <div className="text-sm text-zinc-500">
            {percentage}% מהיעד היומי
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
