
import { useState, useEffect } from 'react';
import { Plus, Flame, Check, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { HabitCard } from '@/components/HabitCard';
import { HabitReminders } from '@/components/HabitReminders';
import { Goals } from '@/components/Goals';
import { Header } from '@/components/Header';

interface HabitCompletion {
  date: string;
  completed: boolean;
  completionTime?: string;
  note?: string;
}

interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  streak: number;
  completedToday: boolean;
  totalDays: number;
  completedDays: number;
  icon: string;
  frequency: string;
  customDays?: string[];
  completions?: HabitCompletion[];
}

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: 'target' | 'check' | 'flame' | 'trending-up';
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, className }) => {
  let IconComponent;
  switch (icon) {
    case 'target':
      IconComponent = Target;
      break;
    case 'check':
      IconComponent = Check;
      break;
    case 'flame':
      IconComponent = Flame;
      break;
    case 'trending-up':
      IconComponent = TrendingUp;
      break;
    default:
      IconComponent = Target;
  }

  return (
    <Card className={`flex flex-col justify-between p-3 sm:p-4 rounded-lg ${className}`}>
      <div>
        <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
      </div>
      <div className="flex items-center justify-between mt-3 sm:mt-4">
        <div className="text-xl sm:text-2xl font-bold">{value}</div>
        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
      </div>
    </Card>
  );
};

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const storedHabits = localStorage.getItem('habits');
    return storedHabits ? JSON.parse(storedHabits) : [];
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      const parsedHabits = JSON.parse(storedHabits);
      const resetHabits = resetDailyHabitsAtMidnight(parsedHabits);
      setHabits(resetHabits);
      localStorage.setItem('habits', JSON.stringify(resetHabits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const resetDailyHabitsAtMidnight = (habits: Habit[]) => {
    const today = new Date().toISOString().split('T')[0];
    const lastResetDate = localStorage.getItem('lastResetDate');
    
    if (lastResetDate !== today) {
      const resetHabits = habits.map(habit => {
        if (habit.frequency === 'daily') {
          return {
            ...habit,
            completedToday: false
          };
        }
        return habit;
      });
      
      localStorage.setItem('lastResetDate', today);
      return resetHabits;
    }
    
    return habits;
  };

  const addHabit = (newHabit: Omit<Habit, 'id' | 'streak' | 'completedToday' | 'totalDays' | 'completedDays' | 'completions'>) => {
    const habit: Habit = {
      id: Date.now().toString(),
      streak: 0,
      completedToday: false,
      totalDays: 0,
      completedDays: 0,
      completions: [],
      ...newHabit
    };
    setHabits([...habits, habit]);
    setIsAddDialogOpen(false);
  };

  const toggleHabitComplete = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const completionTime = `${hours}:${minutes}`;

    setHabits(habits.map(habit => {
      if (habit.id === id) {
        let updatedCompletions = habit.completions ? [...habit.completions] : [];
        const existingCompletion = updatedCompletions.find(c => c.date === today);

        if (existingCompletion) {
          updatedCompletions = updatedCompletions.map(c =>
            c.date === today ? { ...c, completed: !c.completed, completionTime: !c.completed ? completionTime : undefined } : c
          );
        } else {
          updatedCompletions = [...updatedCompletions, { date: today, completed: true, completionTime: completionTime }];
        }

        const completedToday = !habit.completedToday;
        const streak = completedToday
          ? (updatedCompletions.filter(c => c.completed).length > 0 ? habit.streak + 1 : habit.streak)
          : (habit.streak > 0 ? habit.streak - 1 : 0);
        
        return {
          ...habit,
          completedToday: !habit.completedToday,
          streak: streak,
          totalDays: habit.totalDays + 1,
          completedDays: habit.completedDays + (completedToday ? 1 : -1),
          completions: updatedCompletions
        };
      }
      return habit;
    }));
  };

  const editHabit = (id: string, updatedHabit: Omit<Habit, 'id' | 'streak' | 'completedToday' | 'totalDays' | 'completedDays' | 'completions'>) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, ...updatedHabit } : habit
    ));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const addCompletionNote = (habitId: string, date: string, note: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const updatedCompletions = habit.completions?.map(completion => {
          if (completion.date === date) {
            return { ...completion, note: note };
          }
          return completion;
        }) || [];
        return { ...habit, completions: updatedCompletions };
      }
      return habit;
    }));
  };

  const calculateOverallSuccessRate = () => {
    const totalPossibleDays = habits.reduce((sum, habit) => sum + habit.totalDays, 0);
    const totalCompletedDays = habits.reduce((sum, habit) => sum + habit.completedDays, 0);
    
    if (totalPossibleDays === 0) return 0;
    
    return Math.round((totalCompletedDays / totalPossibleDays) * 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <AddHabitDialog 
              onAddHabit={addHabit}
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
            />
            <ThemeToggle />
          </div>
        </div>

        <Tabs defaultValue="habits" className="space-y-4 sm:space-y-6">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList className="grid w-full min-w-[300px] grid-cols-3 bg-muted">
              <TabsTrigger value="habits" className="text-xs sm:text-sm px-2 py-2">Your Habits</TabsTrigger>
              <TabsTrigger value="reminders" className="text-xs sm:text-sm px-2 py-2">Reminders</TabsTrigger>
              <TabsTrigger value="goals" className="text-xs sm:text-sm px-2 py-2">Goals</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="habits" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <StatsCard 
                title="Total Habits" 
                value={habits.length} 
                icon="target"
                className="bg-card border"
              />
              <StatsCard 
                title="Completed Today" 
                value={habits.filter(h => h.completedToday).length} 
                icon="check"
                className="bg-card border"
              />
              <StatsCard 
                title="Current Streaks" 
                value={habits.reduce((sum, h) => sum + h.streak, 0)} 
                icon="flame"
                className="bg-card border"
              />
              <StatsCard 
                title="Success Rate" 
                value={`${calculateOverallSuccessRate()}%`} 
                icon="trending-up"
                className="bg-card border"
              />
            </div>

            {habits.length === 0 ? (
              <Card className="text-center py-8 sm:py-12">
                <CardContent className="px-4 sm:px-6">
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base">No habits yet. Start building better habits today!</p>
                  <AddHabitDialog 
                    onAddHabit={addHabit}
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {habits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={toggleHabitComplete}
                    onEdit={editHabit}
                    onDelete={deleteHabit}
                    onAddNote={addCompletionNote}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reminders">
            <HabitReminders habits={habits.map(h => ({ id: h.id, name: h.name }))} />
          </TabsContent>

          <TabsContent value="goals">
            <Goals habits={habits} onAddHabit={addHabit} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
