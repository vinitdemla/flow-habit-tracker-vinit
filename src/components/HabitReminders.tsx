
import { useState } from 'react';
import { Bell, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Reminder {
  id: string;
  habitId: string;
  habitName: string;
  time: string;
  enabled: boolean;
}

interface HabitRemindersProps {
  habits: Array<{ id: string; name: string }>;
}

export const HabitReminders = ({ habits }: HabitRemindersProps) => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const stored = localStorage.getItem('habit-reminders');
    return stored ? JSON.parse(stored) : [];
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    habitId: '',
    time: '09:00'
  });

  const saveReminders = (updatedReminders: Reminder[]) => {
    setReminders(updatedReminders);
    localStorage.setItem('habit-reminders', JSON.stringify(updatedReminders));
  };

  const addReminder = () => {
    if (!newReminder.habitId) return;
    
    const habit = habits.find(h => h.id === newReminder.habitId);
    if (!habit) return;

    const reminder: Reminder = {
      id: Date.now().toString(),
      habitId: newReminder.habitId,
      habitName: habit.name,
      time: newReminder.time,
      enabled: true
    };

    saveReminders([...reminders, reminder]);
    setNewReminder({ habitId: '', time: '09:00' });
    setIsAddDialogOpen(false);
  };

  const toggleReminder = (reminderId: string) => {
    saveReminders(reminders.map(r => 
      r.id === reminderId ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const deleteReminder = (reminderId: string) => {
    saveReminders(reminders.filter(r => r.id !== reminderId));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Reminders ({reminders.filter(r => r.enabled).length})
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Reminder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="habit">Select Habit</Label>
                  <Select value={newReminder.habitId} onValueChange={(value) => setNewReminder(prev => ({ ...prev, habitId: value }))}>
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
                  <Label htmlFor="time">Reminder Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                <Button onClick={addReminder} className="w-full">Add Reminder</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {reminders.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No reminders set yet.</p>
        ) : (
          <div className="space-y-2">
            {reminders.map(reminder => (
              <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleReminder(reminder.id)}
                    className={reminder.enabled ? 'text-green-600' : 'text-gray-400'}
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                  <div>
                    <p className="font-medium">{reminder.habitName}</p>
                    <p className="text-sm text-muted-foreground">{reminder.time}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteReminder(reminder.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
