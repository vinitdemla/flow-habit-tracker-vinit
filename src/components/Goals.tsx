
import { useState } from 'react';
import { Target, Plus, X, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AddHabitDialog } from '@/components/AddHabitDialog';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  habitId?: string;
  category: string;
  completed: boolean;
}

interface Habit {
  id: string;
  name: string;
  completedDays: number;
  streak: number;
}

interface GoalsProps {
  habits: Habit[];
  onAddHabit?: (newHabit: any) => void;
}

export const Goals = ({ habits, onAddHabit }: GoalsProps) => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const stored = localStorage.getItem('goals');
    return stored ? JSON.parse(stored) : [];
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isHabitDialogOpen, setIsHabitDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetValue: 0,
    unit: 'days',
    deadline: '',
    habitId: 'none',
    category: 'Health'
  });

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetValue: newGoal.targetValue,
      currentValue: 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline,
      habitId: newGoal.habitId || undefined,
      category: newGoal.category,
      completed: false
    };

    saveGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      targetValue: 0,
      unit: 'days',
      deadline: '',
      habitId: '',
      category: 'Health'
    });
    setIsAddDialogOpen(false);
  };

  const updateGoalProgress = (goalId: string, newValue: number) => {
    saveGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const completed = newValue >= goal.targetValue;
        return { ...goal, currentValue: newValue, completed };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId: string) => {
    saveGoals(goals.filter(goal => goal.id !== goalId));
  };

  const getGoalProgress = (goal: Goal) => {
    if (goal.habitId) {
      const habit = habits.find(h => h.id === goal.habitId);
      if (habit) {
        return Math.min((habit.completedDays / goal.targetValue) * 100, 100);
      }
    }
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Target className="h-5 w-5 sm:h-6 sm:w-6" />
              Goals ({goals.filter(g => !g.completed).length} active)
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
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
                        placeholder="e.g., Exercise 30 days"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal-description">Description (Optional)</Label>
                      <Textarea
                        id="goal-description"
                        placeholder="Describe your goal..."
                        value={newGoal.description}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="target-value">Target Value</Label>
                        <Input
                          id="target-value"
                          type="number"
                          placeholder="30"
                          value={newGoal.targetValue || ''}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Select value={newGoal.unit} onValueChange={(value) => setNewGoal(prev => ({ ...prev, unit: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="times">Times</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="points">Points</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="habit">Link to Habit (Optional)</Label>
                      <Select value={newGoal.habitId} onValueChange={(value) => setNewGoal(prev => ({ ...prev, habitId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a habit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No habit linked</SelectItem>
                          {habits.map(habit => (
                            <SelectItem key={habit.id} value={habit.id}>{habit.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addGoal} className="w-full">Create Goal</Button>
                  </div>
                </DialogContent>
              </Dialog>
              {habits.length === 0 && onAddHabit && (
                <Button 
                  onClick={() => setIsHabitDialogOpen(true)}
                  variant="outline" 
                  size="sm" 
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Habit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {goals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No goals set yet.</p>
              <p className="text-sm text-muted-foreground mb-4">
                Set meaningful goals to track your progress and achievements!
              </p>
              {habits.length === 0 && onAddHabit && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Start by creating your first habit:
                  </p>
                  <Button 
                    onClick={() => setIsHabitDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Habit
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map(goal => {
                const progress = getGoalProgress(goal);
                const daysLeft = goal.deadline ? getDaysUntilDeadline(goal.deadline) : null;
                const linkedHabit = goal.habitId && goal.habitId !== 'none' ? habits.find(h => h.id === goal.habitId) : null;
                
                return (
                  <Card key={goal.id} className={`transition-all border ${goal.completed ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' : 'bg-card border-border'}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="font-semibold text-sm sm:text-base truncate">{goal.title}</h3>
                            {goal.completed && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 w-fit">
                                Completed
                              </Badge>
                            )}
                          </div>
                          {goal.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">{goal.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>
                              {linkedHabit ? linkedHabit.completedDays : goal.currentValue} / {goal.targetValue} {goal.unit}
                            </span>
                            {goal.deadline && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {daysLeft !== null && daysLeft >= 0 ? `${daysLeft} days left` : 'Overdue'}
                                </span>
                              </>
                            )}
                            {linkedHabit && (
                              <>
                                <span>•</span>
                                <span>Linked to {linkedHabit.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteGoal(goal.id)}
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Progress
                          </span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      
                      {!linkedHabit && !goal.completed && (
                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                          <Input
                            type="number"
                            placeholder="Update progress"
                            className="flex-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const value = parseInt((e.target as HTMLInputElement).value);
                                if (!isNaN(value)) {
                                  updateGoalProgress(goal.id, value);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                          />
                          <Button 
                            size="sm" 
                            onClick={() => {
                              const input = document.querySelector(`input[type="number"]`) as HTMLInputElement;
                              if (input) {
                                const value = parseInt(input.value);
                                if (!isNaN(value)) {
                                  updateGoalProgress(goal.id, value);
                                  input.value = '';
                                }
                              }
                            }}
                            className="w-full sm:w-auto"
                          >
                            Update
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {(isHabitDialogOpen && onAddHabit) && (
        <AddHabitDialog 
          onAddHabit={onAddHabit}
          open={isHabitDialogOpen}
          onOpenChange={setIsHabitDialogOpen}
        />
      )}
    </div>
  );
};
