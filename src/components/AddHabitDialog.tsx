
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus } from 'lucide-react';

interface AddHabitDialogProps {
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

export const AddHabitDialog = ({ onAddHabit }: AddHabitDialogProps) => {
  const [open, setOpen] = useState(false);
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
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto mx-auto my-4">
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
              rows={3}
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
            <div className="grid grid-cols-5 gap-2">
              {icons.map(icon => (
                <Button
                  key={icon}
                  type="button"
                  variant="outline"
                  className={`w-full h-12 ${formData.icon === icon ? 'bg-blue-100 border-blue-500' : ''}`}
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
              className="space-y-3"
            >
              {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                <div key={difficulty} className="flex items-start space-x-2">
                  <RadioGroupItem value={difficulty} id={difficulty} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={difficulty} className="text-sm font-medium">
                      {difficulty}
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      {getDifficultyDescription(difficulty)}
                    </p>
                  </div>
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
                  <SelectItem key={frequency} value={frequency}>
                    {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                  </SelectItem>
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
