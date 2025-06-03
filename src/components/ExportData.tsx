
import { Download, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  streak: number;
  completedToday: boolean;
  totalDays: number;
  completedDays: number;
  completions?: Array<{ date: string; completed: boolean; completionTime?: string }>;
}

interface ExportDataProps {
  habits: Habit[];
}

export const ExportData = ({ habits }: ExportDataProps) => {
  const exportToCSV = () => {
    const headers = ['Habit Name', 'Category', 'Description', 'Current Streak', 'Total Days', 'Completed Days', 'Completion Rate'];
    const rows = habits.map(habit => [
      habit.name,
      habit.category,
      habit.description,
      habit.streak.toString(),
      habit.totalDays.toString(),
      habit.completedDays.toString(),
      `${habit.totalDays > 0 ? Math.round((habit.completedDays / habit.totalDays) * 100) : 0}%`
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habits-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      habits: habits,
      summary: {
        totalHabits: habits.length,
        totalCompletions: habits.reduce((sum, h) => sum + h.completedDays, 0),
        averageCompletionRate: habits.length > 0 
          ? Math.round(habits.reduce((sum, h) => sum + (h.totalDays > 0 ? (h.completedDays / h.totalDays) : 0), 0) / habits.length * 100)
          : 0
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habits-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={exportToCSV} variant="outline" className="w-full justify-start">
          <FileText className="h-4 w-4 mr-2" />
          Export as CSV
          <span className="ml-auto text-xs text-muted-foreground">Spreadsheet format</span>
        </Button>
        <Button onClick={exportToJSON} variant="outline" className="w-full justify-start">
          <Calendar className="h-4 w-4 mr-2" />
          Export as JSON
          <span className="ml-auto text-xs text-muted-foreground">Full backup</span>
        </Button>
        <p className="text-xs text-muted-foreground">
          Export your habit data for backup or analysis in other tools.
        </p>
      </CardContent>
    </Card>
  );
};
