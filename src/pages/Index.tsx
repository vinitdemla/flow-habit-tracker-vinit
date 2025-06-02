
import { useState } from 'react';
import { Plus, Flame, Calendar, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HabitCard } from '@/components/HabitCard';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { StatsCard } from '@/components/StatsCard';

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

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Morning Meditation',
      description: '10 minutes of mindfulness to start the day',
      category: 'Health',
      streak: 7,
      completedToday: true,
      totalDays: 30,
      completedDays: 23
    },
    {
      id: '2',
      name: 'Read for 30 minutes',
      description: 'Read books to expand knowledge and imagination',
      category: 'Personal',
      streak: 12,
      completedToday: false,
      totalDays: 30,
      completedDays: 18
    },
    {
      id: '3',
      name: 'Exercise',
      description: 'Any form of physical activity for 30+ minutes',
      category: 'Health',
      streak: 5,
      completedToday: true,
      totalDays: 30,
      completedDays: 20
    },
    {
      id: '4',
      name: 'Write Journal',
      description: 'Reflect on the day and express gratitude',
      category: 'Personal',
      streak: 3,
      completedToday: false,
      totalDays: 30,
      completedDays: 15
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const toggleHabit = (habitId: string) => {
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const newCompletedToday = !habit.completedToday;
          return {
            ...habit,
            completedToday: newCompletedToday,
            streak: newCompletedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1),
            completedDays: newCompletedToday ? habit.completedDays + 1 : Math.max(0, habit.completedDays - 1)
          };
        }
        return habit;
      })
    );
  };

  const addHabit = (newHabit: Omit<Habit, 'id' | 'streak' | 'completedToday' | 'totalDays' | 'completedDays'>) => {
    const habit: Habit = {
      ...newHabit,
      id: Date.now().toString(),
      streak: 0,
      completedToday: false,
      totalDays: 0,
      completedDays: 0
    };
    setHabits(prev => [...prev, habit]);
  };

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const currentStreak = Math.max(...habits.map(h => h.streak), 0);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-habit-gradient bg-clip-text text-transparent mb-4">
            HabitFlow
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Build better habits, one day at a time
          </p>
          <Badge variant="outline" className="text-sm">
            {today}
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Today's Progress"
            value={`${completedToday}/${totalHabits}`}
            icon={<CheckCircle2 className="h-6 w-6" />}
            description={`${completionRate}% completed`}
            gradient="from-emerald-500 to-teal-500"
          />
          <StatsCard
            title="Current Streak"
            value={currentStreak.toString()}
            icon={<Flame className="h-6 w-6" />}
            description="days in a row"
            gradient="from-orange-500 to-red-500"
          />
          <StatsCard
            title="Total Habits"
            value={totalHabits.toString()}
            icon={<TrendingUp className="h-6 w-6" />}
            description="being tracked"
            gradient="from-blue-500 to-purple-500"
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Habits List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Today's Habits</h2>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-habit-gradient hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            </div>

            {habits.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Circle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start building better habits today!
                  </p>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-habit-gradient hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Habit
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={() => toggleHabit(habit.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Health Habits</span>
                  <Badge variant="secondary">
                    {habits.filter(h => h.category === 'Health').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Personal Habits</span>
                  <Badge variant="secondary">
                    {habits.filter(h => h.category === 'Personal').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Productivity Habits</span>
                  <Badge variant="secondary">
                    {habits.filter(h => h.category === 'Productivity').length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Motivation</CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-sm italic text-muted-foreground">
                  "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
                </blockquote>
                <p className="text-xs text-muted-foreground mt-2">- Aristotle</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <AddHabitDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddHabit={addHabit}
        />
      </div>
    </div>
  );
};

export default Index;
