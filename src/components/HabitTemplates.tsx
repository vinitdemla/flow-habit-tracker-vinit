
import { useState } from 'react';
import { Plus, BookOpen, Dumbbell, Heart, Briefcase, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface HabitTemplate {
  name: string;
  description: string;
  category: string;
  icon: string;
  frequency: string;
}

interface HabitTemplatesProps {
  onSelectTemplate: (template: HabitTemplate) => void;
}

const templates: HabitTemplate[] = [
  {
    name: 'Morning Meditation',
    description: '10 minutes of mindfulness to start the day',
    category: 'Health',
    icon: '🧘',
    frequency: 'Daily'
  },
  {
    name: 'Read for 30 minutes',
    description: 'Read books to expand knowledge',
    category: 'Personal',
    icon: '📚',
    frequency: 'Daily'
  },
  {
    name: 'Exercise',
    description: '30+ minutes of physical activity',
    category: 'Health',
    icon: '💪',
    frequency: 'Daily'
  },
  {
    name: 'Drink 8 glasses of water',
    description: 'Stay hydrated throughout the day',
    category: 'Health',
    icon: '💧',
    frequency: 'Daily'
  },
  {
    name: 'Write Journal',
    description: 'Reflect on the day and express gratitude',
    category: 'Personal',
    icon: '📝',
    frequency: 'Daily'
  },
  {
    name: 'Learn a new skill',
    description: 'Spend time learning something new',
    category: 'Productivity',
    icon: '🎯',
    frequency: 'Weekly'
  }
];

export const HabitTemplates = ({ onSelectTemplate }: HabitTemplatesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectTemplate = (template: HabitTemplate) => {
    onSelectTemplate(template);
    setIsOpen(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Health':
        return <Heart className="h-4 w-4" />;
      case 'Personal':
        return <BookOpen className="h-4 w-4" />;
      case 'Productivity':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Use Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose a Habit Template</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {templates.map((template, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleSelectTemplate(template)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="text-lg">{template.icon}</span>
                  {template.name}
                  {getCategoryIcon(template.category)}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-blue-600">{template.category}</span>
                  <span className="text-gray-500">{template.frequency}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
