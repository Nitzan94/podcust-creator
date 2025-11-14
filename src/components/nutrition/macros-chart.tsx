import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';

interface MacrosChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

export function MacrosChart({ protein, carbs, fat }: MacrosChartProps) {
  const total = protein + carbs + fat;
  const proteinPercent = total > 0 ? (protein / total) * 100 : 0;
  const carbsPercent = total > 0 ? (carbs / total) * 100 : 0;
  const fatPercent = total > 0 ? (fat / total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>התפלגות מקרו-נוטריינטים</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual Bar */}
        <div className="h-8 w-full flex rounded-lg overflow-hidden">
          <div
            className="bg-blue-500 flex items-center justify-center text-xs text-white font-medium"
            style={{ width: `${proteinPercent}%` }}
          >
            {proteinPercent > 10 && `${Math.round(proteinPercent)}%`}
          </div>
          <div
            className="bg-yellow-500 flex items-center justify-center text-xs text-white font-medium"
            style={{ width: `${carbsPercent}%` }}
          >
            {carbsPercent > 10 && `${Math.round(carbsPercent)}%`}
          </div>
          <div
            className="bg-red-500 flex items-center justify-center text-xs text-white font-medium"
            style={{ width: `${fatPercent}%` }}
          >
            {fatPercent > 10 && `${Math.round(fatPercent)}%`}
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="font-medium">חלבון</span>
            </div>
            <div className="text-2xl font-bold">{formatNumber(protein)}g</div>
            <div className="text-zinc-500">{Math.round(proteinPercent)}%</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="font-medium">פחמימות</span>
            </div>
            <div className="text-2xl font-bold">{formatNumber(carbs)}g</div>
            <div className="text-zinc-500">{Math.round(carbsPercent)}%</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="font-medium">שומנים</span>
            </div>
            <div className="text-2xl font-bold">{formatNumber(fat)}g</div>
            <div className="text-zinc-500">{Math.round(fatPercent)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
