
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

  // Convert 24-hour time to 12-hour AM/PM format
  const formatTime12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Convert 12-hour time back to 24-hour format
  const formatTime24Hour = (time12: string) => {
    const [time, ampm] = time12.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    
    if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }
    
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
              Reminders ({reminders.filter(r => r.enabled).length} active)
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Reminder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
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
                  <div className="space-y-2">
                    <Label htmlFor="time">Reminder Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newReminder.time}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Selected time: {formatTime12Hour(newReminder.time)}
                    </p>
                  </div>
                  <Button onClick={addReminder} className="w-full">Add Reminder</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No reminders set yet.</p>
              <p className="text-sm text-muted-foreground">
                Set up reminders to help you stay consistent with your habits!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map(reminder => (
                <Card key={reminder.id} className={`transition-all border ${reminder.enabled ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800' : 'bg-muted border-border'}`}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReminder(reminder.id)}
                          className={`h-8 w-8 p-0 ${reminder.enabled ? 'text-blue-600 hover:text-blue-700 dark:text-blue-400' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          <Bell className={`h-4 w-4 ${reminder.enabled ? 'fill-current' : ''}`} />
                        </Button>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{reminder.habitName}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                            <span className="font-mono text-blue-600 dark:text-blue-400 font-medium">
                              {formatTime12Hour(reminder.time)}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className={reminder.enabled ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                              {reminder.enabled ? 'Active' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteReminder(reminder.id)}
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
