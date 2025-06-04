import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHabit: (habit: {
    name: string;
    description: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    icon: string;
    frequency: string;
    customDays?: string[];
  }) => void;
}

export const AddHabitDialog = ({ open, onOpenChange, onAddHabit }: AddHabitDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Health',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    icon: '💪',
    frequency: 'daily',
    customDays: [] as string[]
  });

  const icons = ['💪', '🏃‍♂️', '🧘‍♀️', '📚', '🎨', '🎵', '🌱', '🍳', '🤝', '💡'];
  const categories = ['Health', 'Personal', 'Productivity', 'Finance', 'Social'];
  const frequencies = ['daily', 'weekly', 'monthly', 'custom'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onAddHabit(formData);
      setFormData({
        name: '',
        description: '',
        category: 'Health',
        difficulty: 'Medium',
        icon: '💪',
        frequency: 'daily',
        customDays: []
      });
      onOpenChange(false);
    }
  };

  const getDifficultyDescription = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'Simple to maintain, low effort required';
      case 'Medium': return 'Moderate effort, balanced challenge';
      case 'Hard': return 'High effort, significant commitment';
      default: return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              placeholder="Drink Water"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Make sure to drink 8 glasses of water each day"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex gap-2">
              {icons.map(icon => (
                <Button
                  key={icon}
                  variant="outline"
                  className={`w-10 h-10 ${formData.icon === icon ? 'bg-secondary' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, icon: icon }))}
                >
                  <span className="text-xl">{icon}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-3">
            <Label>Difficulty Level</Label>
            <RadioGroup
              value={formData.difficulty}
              onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as 'Easy' | 'Medium' | 'Hard' }))}
              className="grid grid-cols-3 gap-4"
            >
              {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                <div key={difficulty} className="flex items-center space-x-2">
                  <RadioGroupItem value={difficulty} id={difficulty} />
                  <Label htmlFor={difficulty} className="text-sm">
                    <div className="font-medium">{difficulty}</div>
                    <div className="text-xs text-muted-foreground">
                      {getDifficultyDescription(difficulty)}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map(frequency => (
                  <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Add Habit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
