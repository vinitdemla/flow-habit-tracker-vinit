
import { useState } from 'react';
import { Target, Plus, Edit3, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDays: number;
  habitId: string;
  habitName: string;
  deadline: string;
  completed: boolean;
}

interface GoalsProps {
  habits: Array<{ id: string; name: string; completedDays: number }>;
}

export const Goals = ({ habits }: GoalsProps) => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const stored = localStorage.getItem('habit-goals');
    return stored ? JSON.parse(stored) : [];
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDays: 30,
    habitId: '',
    deadline: ''
  });

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem('habit-goals', JSON.stringify(updatedGoals));
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.habitId) return;
    
    const habit = habits.find(h => h.id === newGoal.habitId);
    if (!habit) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetDays: newGoal.targetDays,
      habitId: newGoal.habitId,
      habitName: habit.name,
      deadline: newGoal.deadline,
      completed: habit.completedDays >= newGoal.targetDays
    };

    saveGoals([...goals, goal]);
    setNewGoal({ title: '', description: '', targetDays: 30, habitId: '', deadline: '' });
    setIsAddDialogOpen(false);
  };

  const deleteGoal = (goalId: string) => {
    saveGoals(goals.filter(g => g.id !== goalId));
  };

  const getGoalProgress = (goal: Goal) => {
    const habit = habits.find(h => h.id === goal.habitId);
    return habit ? Math.min((habit.completedDays / goal.targetDays) * 100, 100) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals ({goals.length})
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Complete 30 days of meditation"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Build a consistent meditation practice"
                  />
                </div>
                <div>
                  <Label htmlFor="habit">Select Habit</Label>
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
                <div>
                  <Label htmlFor="targetDays">Target Days</Label>
                  <Input
                    id="targetDays"
                    type="number"
                    value={newGoal.targetDays}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetDays: parseInt(e.target.value) || 30 }))}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline (Optional)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
                <Button onClick={addGoal} className="w-full">Create Goal</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No goals set yet. Create your first goal!</p>
        ) : (
          <div className="space-y-3">
            {goals.map(goal => {
              const progress = getGoalProgress(goal);
              const isCompleted = progress >= 100;
              return (
                <div key={goal.id} className={`p-4 border rounded-lg ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{goal.title}</h4>
                    <div className="flex items-center gap-2">
                      {isCompleted && <Badge className="bg-green-600">Completed</Badge>}
                      <Button variant="ghost" size="sm" onClick={() => deleteGoal(goal.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>{goal.habitName}</span>
                    <span>{Math.round(progress)}% ({habits.find(h => h.id === goal.habitId)?.completedDays || 0}/{goal.targetDays} days)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {goal.deadline && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
