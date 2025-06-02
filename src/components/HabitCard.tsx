
import { CheckCircle2, Circle, Flame, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  streak: number;
  completedToday: boolean;
  totalDays: number;
  completedDays: number;
}

interface HabitCardProps {
  habit: Habit;
  onToggle: () => void;
}

export const HabitCard = ({ habit, onToggle }: HabitCardProps) => {
  const completionPercentage = habit.totalDays > 0 ? (habit.completedDays / habit.totalDays) * 100 : 0;
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Health':
        return 'bg-emerald-100 text-emerald-800';
      case 'Personal':
        return 'bg-blue-100 text-blue-800';
      case 'Productivity':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-md ${
      habit.completedToday 
        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200' 
        : 'hover:shadow-lg habit-card-hover'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 mr-4">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`font-semibold text-lg ${
                habit.completedToday ? 'text-emerald-800' : 'text-gray-800'
              }`}>
                {habit.name}
              </h3>
              <Badge className={getCategoryColor(habit.category)}>
                {habit.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {habit.description}
            </p>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-medium">{habit.streak}</span>
                <span className="text-muted-foreground">day streak</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{habit.completedDays}</span>
                <span className="text-muted-foreground">/ {habit.totalDays} days</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={onToggle}
            variant="ghost"
            size="lg"
            className={`${
              habit.completedToday
                ? 'text-emerald-600 hover:text-emerald-700 animate-success-pulse'
                : 'text-gray-400 hover:text-emerald-600'
            } transition-colors duration-200`}
          >
            {habit.completedToday ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : (
              <Circle className="h-8 w-8" />
            )}
          </Button>
        </div>
        
        {habit.totalDays > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <Progress 
              value={completionPercentage} 
              className="h-2"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
