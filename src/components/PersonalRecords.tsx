
import { Trophy, Target, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Habit {
  id: string;
  name: string;
  streak: number;
  completedDays: number;
  totalDays: number;
  completions?: Array<{ date: string; completed: boolean }>;
}

interface PersonalRecordsProps {
  habits: Habit[];
}

export const PersonalRecords = ({ habits }: PersonalRecordsProps) => {
  const calculateRecords = () => {
    if (habits.length === 0) {
      return {
        longestStreak: { value: 0, habitName: 'None' },
        mostCompleted: { value: 0, habitName: 'None' },
        bestCompletionRate: { value: 0, habitName: 'None' },
        totalDaysTracked: 0
      };
    }

    const longestStreak = habits.reduce((max, habit) => 
      habit.streak > max.value ? { value: habit.streak, habitName: habit.name } : max
    , { value: 0, habitName: '' });

    const mostCompleted = habits.reduce((max, habit) => 
      habit.completedDays > max.value ? { value: habit.completedDays, habitName: habit.name } : max
    , { value: 0, habitName: '' });

    const bestCompletionRate = habits.reduce((best, habit) => {
      const rate = habit.totalDays > 0 ? (habit.completedDays / habit.totalDays) * 100 : 0;
      return rate > best.value ? { value: Math.round(rate), habitName: habit.name } : best;
    }, { value: 0, habitName: '' });

    const totalDaysTracked = habits.reduce((sum, habit) => sum + habit.totalDays, 0);

    return {
      longestStreak,
      mostCompleted,
      bestCompletionRate,
      totalDaysTracked
    };
  };

  const records = calculateRecords();

  const recordItems = [
    {
      title: 'Longest Streak',
      value: `${records.longestStreak.value} days`,
      subtitle: records.longestStreak.habitName,
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      gradient: 'from-yellow-400 to-orange-400'
    },
    {
      title: 'Most Completed',
      value: `${records.mostCompleted.value} times`,
      subtitle: records.mostCompleted.habitName,
      icon: <Target className="h-5 w-5 text-blue-500" />,
      gradient: 'from-blue-400 to-purple-400'
    },
    {
      title: 'Best Rate',
      value: `${records.bestCompletionRate.value}%`,
      subtitle: records.bestCompletionRate.habitName,
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      gradient: 'from-green-400 to-emerald-400'
    },
    {
      title: 'Total Days',
      value: records.totalDaysTracked.toString(),
      subtitle: 'Days tracked',
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
      gradient: 'from-purple-400 to-pink-400'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Personal Records
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {recordItems.map((record, index) => (
            <div key={index} className="text-center p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <div className="flex justify-center mb-2">
                {record.icon}
              </div>
              <div className="font-bold text-lg">{record.value}</div>
              <div className="text-xs text-muted-foreground font-medium">{record.title}</div>
              <div className="text-xs text-muted-foreground truncate" title={record.subtitle}>
                {record.subtitle}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
