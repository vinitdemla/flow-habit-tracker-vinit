
import { useState } from 'react';
import { CheckCircle2, Circle, Flame, Target, Edit, Trash2, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  completions?: Array<{ date: string; completed: boolean; completionTime?: string; note?: string }>;
}

interface HabitCardProps {
  habit: Habit;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, updatedHabit: Omit<Habit, 'id' | 'streak' | 'completedToday' | 'totalDays' | 'completedDays' | 'completions'>) => void;
  onDelete: (id: string) => void;
  onAddNote: (habitId: string, date: string, note: string) => void;
}

export const HabitCard = ({ habit, onToggleComplete, onEdit, onDelete, onAddNote }: HabitCardProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [editData, setEditData] = useState({
    name: habit.name,
    description: habit.description,
    category: habit.category,
    icon: habit.icon,
    frequency: habit.frequency
  });

  const completionPercentage = habit.totalDays > 0 ? (habit.completedDays / habit.totalDays) * 100 : 0;
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Health':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'Personal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Productivity':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleEdit = () => {
    onEdit(habit.id, editData);
    setShowEditDialog(false);
  };

  const categories = ['Health', 'Personal', 'Productivity', 'Finance', 'Social'];
  const icons = ['💪', '🏃‍♂️', '🧘‍♀️', '📚', '🎨', '🎵', '🌱', '🍳', '🤝', '💡'];

  return (
    <>
      <Card className={`transition-all duration-300 hover:shadow-md ${
        habit.completedToday 
          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800' 
          : 'hover:shadow-lg'
      }`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 mr-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                <span className="text-xl sm:text-2xl">{habit.icon}</span>
                <h3 className={`font-semibold text-sm sm:text-lg ${
                  habit.completedToday ? 'text-emerald-800 dark:text-emerald-200' : 'text-gray-800 dark:text-gray-200'
                }`}>
                  {habit.name}
                </h3>
                <Badge className={`text-xs ${getCategoryColor(habit.category)}`}>
                  {habit.category}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                {habit.description}
              </p>
              
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm flex-wrap">
                <div className="flex items-center gap-1">
                  <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                  <span className="font-medium">{habit.streak}</span>
                  <span className="text-muted-foreground hidden sm:inline">day streak</span>
                  <span className="text-muted-foreground sm:hidden">streak</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                  <span className="font-medium">{habit.completedDays}</span>
                  <span className="text-muted-foreground">/ {habit.totalDays}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-1 sm:gap-2">
              <Button
                onClick={() => onToggleComplete(habit.id)}
                variant="ghost"
                size="sm"
                className={`${
                  habit.completedToday
                    ? 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400'
                    : 'text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                } transition-colors duration-200 p-2`}
              >
                {habit.completedToday ? (
                  <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8" />
                ) : (
                  <Circle className="h-6 w-6 sm:h-8 sm:w-8" />
                )}
              </Button>
              
              <div className="flex gap-1">
                <Button
                  onClick={() => setShowHeatmap(true)}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 sm:h-8 sm:w-8"
                >
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  onClick={() => setShowEditDialog(true)}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 sm:h-8 sm:w-8"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  onClick={() => onDelete(habit.id)}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 sm:h-8 sm:w-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select value={editData.category} onValueChange={(value) => setEditData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Icon</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {icons.map(icon => (
                  <Button
                    key={icon}
                    type="button"
                    variant="outline"
                    className={`h-10 ${editData.icon === icon ? 'bg-blue-100 border-blue-500' : ''}`}
                    onClick={() => setEditData(prev => ({ ...prev, icon }))}
                  >
                    <span className="text-lg">{icon}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEdit} className="flex-1">Save</Button>
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
