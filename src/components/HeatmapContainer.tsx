
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { HeatmapModal } from './HeatmapModal';

interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completedDays: number;
  totalDays: number;
  completions?: Array<{
    date: string;
    completed: boolean;
    completionTime?: string;
  }>;
}

interface HeatmapContainerProps {
  habits: Habit[];
}

export const HeatmapContainer = ({ habits }: HeatmapContainerProps) => {
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">No habits to display heatmap for.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Habit Heatmaps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {habits.map(habit => (
              <Button
                key={habit.id}
                variant="outline"
                className="flex items-center gap-3 p-4 h-auto justify-start"
                onClick={() => setSelectedHabit(habit)}
              >
                <span className="text-xl">{habit.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{habit.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {habit.completedDays} completions
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedHabit && (
        <HeatmapModal
          open={!!selectedHabit}
          onOpenChange={(open) => !open && setSelectedHabit(null)}
          habit={selectedHabit}
        />
      )}
    </>
  );
};
