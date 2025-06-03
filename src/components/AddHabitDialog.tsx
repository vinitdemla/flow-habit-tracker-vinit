
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown } from 'lucide-react';

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
  '🌱', '🧠', '💝', '💎', '📝', '🏋️‍♂️', '🍌', '🚶‍♂️', '🚭', '⚡',
  '🌟', '🎨', '💻', '📱', '🎮', '🛏️', '🌅', '🌙', '☕', '🍃',
  '🎪', '🎭', '🎬', '📖', '✍️', '🔬', '🎯', '🏆', '🎊', '🎈'
];

const daysOfWeek = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' }
];

export const AddHabitDialog = ({ open, onOpenChange, onAddHabit }: AddHabitDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('💪');
  const [frequency, setFrequency] = useState('Daily');
  const [customDays, setCustomDays] = useState<string[]>([]);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

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
    setCustomDays([]);
    onOpenChange(false);
  };

  const handleCustomDayToggle = (dayId: string) => {
    setCustomDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
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
              <Popover open={isIconPickerOpen} onOpenChange={setIsIconPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <span className="text-lg mr-2">{selectedIcon}</span>
                    <span className="text-sm text-gray-500 flex-1">Choose icon</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3" align="start">
                  <div className="grid grid-cols-8 gap-2">
                    {habitIcons.map((icon, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-lg h-10 w-10 p-0 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedIcon(icon);
                          setIsIconPickerOpen(false);
                        }}
                      >
                        {icon}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
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

          {frequency === 'Custom' && (
            <div className="space-y-3">
              <Label>Custom Days</Label>
              <div className="grid grid-cols-2 gap-3">
                {daysOfWeek.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.id}
                      checked={customDays.includes(day.id)}
                      onCheckedChange={() => handleCustomDayToggle(day.id)}
                    />
                    <Label htmlFor={day.id} className="text-sm font-normal">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Productivity">Productivity</SelectItem>
                <SelectItem value="Fitness">Fitness</SelectItem>
                <SelectItem value="Learning">Learning</SelectItem>
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
              disabled={!name.trim() || !category}
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
