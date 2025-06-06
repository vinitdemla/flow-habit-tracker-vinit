
import { useState, useEffect } from 'react';
import { Target, Plus, Calendar, TrendingUp, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AddHabitDialog } from './AddHabitDialog';

interface Goal {
  id: string;
  title: string;
  habitId: string;
  habitName: string;
  targetDays: number;
  targetPeriod: 'week' | 'month' | 'year';
  currentProgress: number;
  createdAt: string;
  completed: boolean;
}

interface Habit {
  id: string;
  name: string;
  completions?: Array<{ date: string; completed: boolean }>;
}

interface GoalsProps {
  habits: Habit[];
  onAddHabit?: (habit: {
    name: string;
    description: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    icon: string;
    frequency: string;
    customDays?: string[];
  }) => void;
}

export const Goals = ({ habits, onAddHabit }: GoalsProps) => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const stored = localStorage.getItem('habit-goals');
    return stored ? JSON.parse(stored) : [];
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddHabitDialogOpen, setIsAddHabitDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    habitId: '',
    targetDays: 7,
    targetPeriod: 'week' as 'week' | 'month' | 'year'
  });

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem('habit-goals', JSON.stringify(updatedGoals));
  };

  // Update goal progress based on habit completions
  useEffect(() => {
    const updatedGoals = goals.map(goal => {
      const habit = habits.find(h => h.id === goal.habitId);
      if (!habit || !habit.completions) return goal;

      const now = new Date();
      let startDate = new Date();
      
      switch (goal.targetPeriod) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      const completionsInPeriod = habit.completions.filter(c => 
        c.completed && new Date(c.date) >= startDate
      ).length;

      const completed = completionsInPeriod >= goal.targetDays;

      return {
        ...goal,
        currentProgress: completionsInPeriod,
        completed
      };
    });

    if (JSON.stringify(updatedGoals) !== JSON.stringify(goals)) {
      saveGoals(updatedGoals);
    }
  }, [habits, goals]);

  const createGoal = () => {
    if (!newGoal.title || !newGoal.habitId) return;
    
    const habit = habits.find(h => h.id === newGoal.habitId);
    if (!habit) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      habitId: newGoal.habitId,
      habitName: habit.name,
      targetDays: newGoal.targetDays,
      targetPeriod: newGoal.targetPeriod,
      currentProgress: 0,
      createdAt: new Date().toISOString(),
      completed: false
    };

    saveGoals([...goals, goal]);
    setNewGoal({ title: '', habitId: '', targetDays: 7, targetPeriod: 'week' });
    setIsCreateDialogOpen(false);
  };

  const deleteGoal = (goalId: string) => {
    saveGoals(goals.filter(g => g.id !== goalId));
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.currentProgress / goal.targetDays) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const handleAddHabit = (habit: {
    name: string;
    description: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    icon: string;
    frequency: string;
    customDays?: string[];
  }) => {
    if (onAddHabit) {
      onAddHabit(habit);
    }
    setIsAddHabitDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Target className="h-5 w-5 sm:h-6 sm:w-6" />
              Goals ({goals.filter(g => !g.completed).length} active)
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {habits.length === 0 && (
                <Button 
                  onClick={() => setIsAddHabitDialogOpen(true)}
                  variant="outline" 
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Habit First
                </Button>
              )}
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    disabled={habits.length === 0}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Goal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal-title">Goal Title</Label>
                      <Input
                        id="goal-title"
                        placeholder="e.g., Complete 30 workouts this month"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="habit-select">Select Habit</Label>
                      <Select value={newGoal.habitId} onValueChange={(value) => setNewGoal(prev => ({ ...prev, habitId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a habit" />
                        </SelectTrigger>
                        <SelectContent>
                          {habits.map(habit => (
                            <SelectItem key={habit.id} value={habit.id}>{habit.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="target-days">Target Days</Label>
                        <Input
                          id="target-days"
                          type="number"
                          min="1"
                          value={newGoal.targetDays}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, targetDays: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="time-period">Time Period</Label>
                        <Select value={newGoal.targetPeriod} onValueChange={(value: 'week' | 'month' | 'year') => setNewGoal(prev => ({ ...prev, targetPeriod: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">Per Week</SelectItem>
                            <SelectItem value="month">Per Month</SelectItem>
                            <SelectItem value="year">Per Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={createGoal} className="w-full">
                      Create Goal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {goals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No goals created yet.</p>
              {habits.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Create some habits first, then set goals to track your progress!</p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Set goals to track your habit progress over time.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {goals.map(goal => {
                const progressPercentage = getProgressPercentage(goal);
                return (
                  <Card key={goal.id} className={`${goal.completed ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm sm:text-base truncate">{goal.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">{goal.habitName}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {goal.completed && (
                            <Badge className="bg-green-600 text-white text-xs">Completed!</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteGoal(goal.id)}
                            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>Progress: {goal.currentProgress}/{goal.targetDays} days</span>
                          <span className="font-medium">{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress 
                          value={progressPercentage} 
                          className="h-2"
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Per {goal.targetPeriod}
                          </span>
                          {progressPercentage >= 100 && (
                            <span className="flex items-center text-green-600">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Goal achieved!
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddHabitDialog
        open={isAddHabitDialogOpen}
        onOpenChange={setIsAddHabitDialogOpen}
        onAddHabit={handleAddHabit}
      />
    </div>
  );
};
