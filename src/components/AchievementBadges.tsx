
import { Trophy, Target, Flame, Calendar, Star, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Habit {
  id: string;
  name: string;
  streak: number;
  completedDays: number;
  totalDays: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

interface AchievementBadgesProps {
  habits: Habit[];
}

export const AchievementBadges = ({ habits }: AchievementBadgesProps) => {
  const calculateAchievements = (): Achievement[] => {
    const totalHabits = habits.length;
    const totalCompletions = habits.reduce((sum, h) => sum + h.completedDays, 0);
    const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
    const perfectDays = habits.filter(h => h.completedDays === h.totalDays).length;

    return [
      {
        id: 'first-habit',
        title: 'Getting Started',
        description: 'Create your first habit',
        icon: <Target className="h-5 w-5" />,
        unlocked: totalHabits >= 1
      },
      {
        id: 'habit-collector',
        title: 'Habit Collector',
        description: 'Create 5 habits',
        icon: <Star className="h-5 w-5" />,
        unlocked: totalHabits >= 5,
        progress: totalHabits,
        target: 5
      },
      {
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: <Flame className="h-5 w-5" />,
        unlocked: maxStreak >= 7,
        progress: maxStreak,
        target: 7
      },
      {
        id: 'consistency-king',
        title: 'Consistency King',
        description: 'Maintain a 30-day streak',
        icon: <Trophy className="h-5 w-5" />,
        unlocked: maxStreak >= 30,
        progress: maxStreak,
        target: 30
      },
      {
        id: 'century-club',
        title: 'Century Club',
        description: 'Complete 100 habits total',
        icon: <Award className="h-5 w-5" />,
        unlocked: totalCompletions >= 100,
        progress: totalCompletions,
        target: 100
      },
      {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Have 3 habits with 100% completion',
        icon: <Calendar className="h-5 w-5" />,
        unlocked: perfectDays >= 3,
        progress: perfectDays,
        target: 3
      }
    ];
  };

  const achievements = calculateAchievements();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievements ({unlockedCount}/{achievements.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border ${
                achievement.unlocked
                  ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                  : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`${achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'}`}>
                  {achievement.icon}
                </div>
                <span className={`font-medium text-sm ${
                  achievement.unlocked ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </span>
                {achievement.unlocked && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    ✓
                  </Badge>
                )}
              </div>
              <p className={`text-xs ${
                achievement.unlocked ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-400'
              }`}>
                {achievement.description}
              </p>
              {achievement.target && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{Math.min(achievement.progress || 0, achievement.target)}/{achievement.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-blue-600 h-1 rounded-full"
                      style={{
                        width: `${Math.min(((achievement.progress || 0) / achievement.target) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
