
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHabit: (habit: {
    name: string;
    description: string;
    category: string;
    icon: string;
  }) => void;
}

const habitIcons = [
  '💪', '🔥', '📚', '💧', '🏃‍♂️', '🍎', '🎯', '🧘‍♂️', '🥗', '🎵',
  '🌱', '🧠', '💝', '💎', '📝', '🏋️‍♂️', '🍌', '🚶‍♂️', '🍎'
];

export const AddHabitDialog = ({ open, onOpenChange, onAddHabit }: AddHabitDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('💪');
  const [frequency, setFrequency] = useState('Daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !category) return;

    onAddHabit({
      name: name.trim(),
      description: description.trim(),
      category,
      icon: selectedIcon
    });

    // Reset form
    setName('');
    setDescription('');
    setCategory('');
    setSelectedIcon('💪');
    setFrequency('Daily');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Habit</DialogTitle>
          <p className="text-sm text-gray-500">Add a new habit to track</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter habit name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => {}} // This would open icon picker
                >
                  <span className="text-lg mr-2">{selectedIcon}</span>
                  <span className="text-sm text-gray-500">Choose icon</span>
                </Button>
                
                {/* Icon Grid */}
                <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white border rounded-md shadow-lg z-50 grid grid-cols-5 gap-2">
                  {habitIcons.map((icon, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-lg h-10 w-10 p-0"
                      onClick={() => setSelectedIcon(icon)}
                    >
                      {icon}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter habit description (optional)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!name.trim()}
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
