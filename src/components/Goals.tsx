import { useState } from 'react';
import { Target, Plus, X, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface Goal {
  id: string;
  habitId: string;
  title: string;
  targetDays: number;
  currentDays: number;
  deadline: string;
  completed: boolean;
}

interface GoalsProps {
  habits: Array<{ id: string; name: string }>;
}

export const Goals = ({ habits }: GoalsProps) => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const stored = localStorage.getItem('habit-goals');
    return stored ? JSON.parse(stored) : [];
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    habitId: '',
    title: '',
    targetDays: 30,
    deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
  });

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem('habit-goals', JSON.stringify(updatedGoals));
  };

  const addGoal = () => {
    if (!newGoal.habitId || !newGoal.title || !newGoal.targetDays || !newGoal.deadline) return;

    const goal: Goal = {
      id: Date.now().toString(),
      habitId: newGoal.habitId,
      title: newGoal.title,
      targetDays: newGoal.targetDays,
      currentDays: 0,
      deadline: newGoal.deadline,
      completed: false
    };

    saveGoals([...goals, goal]);
    setNewGoal({
      habitId: '',
      title: '',
      targetDays: 30,
      deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
    });
    setIsAddDialogOpen(false);
  };

  const deleteGoal = (goalId: string) => {
    saveGoals(goals.filter(g => g.id !== goalId));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Target className="h-5 w-5 sm:h-6 sm:w-6" />
              Goals ({goals.filter(g => !g.completed).length} active)
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {habits.length === 0 && (
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Habit First
                </Button>
              )}
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    disabled={habits.length === 0}
                    className="w-full sm:w-auto"
                  >
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
                        placeholder="e.g., Exercise for 30 days"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal-habit">Select Habit</Label>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="goal-target">Target Days</Label>
                        <Input
                          id="goal-target"
                          type="number"
                          min="1"
                          max="365"
                          value={newGoal.targetDays}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, targetDays: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="goal-deadline">Deadline</Label>
                        <Input
                          id="goal-deadline"
                          type="date"
                          value={newGoal.deadline}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button onClick={addGoal} className="w-full">Create Goal</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {goals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No goals set yet.</p>
              {habits.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Create some habits first, then set goals to achieve them!
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Set goals to stay motivated and track your progress!
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map(goal => {
                const habit = habits.find(h => h.id === goal.habitId);
                const progress = goal.targetDays > 0 ? (goal.currentDays / goal.targetDays) * 100 : 0;
                const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
                
                return (
                  <Card key={goal.id} className={`transition-all ${goal.completed ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'hover:shadow-md'}`}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 min-w-0 flex-1">
                            <h3 className="font-semibold text-sm sm:text-base leading-tight">{goal.title}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{habit?.name}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteGoal(goal.id)}
                            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>{goal.currentDays} / {goal.targetDays} days</span>
                            <span className={goal.completed ? 'text-green-600' : progress >= 75 ? 'text-green-600' : progress >= 50 ? 'text-yellow-600' : 'text-gray-600'}>
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                          </span>
                          {goal.completed && (
                            <span className="text-green-600 font-medium">✓ Completed</span>
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
    </div>
  );
};
