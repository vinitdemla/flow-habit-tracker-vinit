
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Habit {
  id: string;
  name: string;
  completions?: Array<{ date: string; completed: boolean }>;
}

interface HabitAnalyticsProps {
  habits: Habit[];
}

export const HabitAnalytics = ({ habits }: HabitAnalyticsProps) => {
  const generateWeeklyData = () => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7) - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      let totalCompletions = 0;
      habits.forEach(habit => {
        if (habit.completions) {
          totalCompletions += habit.completions.filter(c => {
            const completionDate = new Date(c.date);
            return completionDate >= weekStart && completionDate <= weekEnd && c.completed;
          }).length;
        }
      });
      
      weeks.push({
        week: `Week ${12 - i}`,
        completions: totalCompletions,
        date: weekStart.toLocaleDateString()
      });
    }
    
    return weeks;
  };

  const generateMonthlyData = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      
      let totalCompletions = 0;
      habits.forEach(habit => {
        if (habit.completions) {
          totalCompletions += habit.completions.filter(c => {
            const completionDate = new Date(c.date);
            return completionDate >= monthStart && completionDate <= monthEnd && c.completed;
          }).length;
        }
      });
      
      months.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        completions: totalCompletions
      });
    }
    
    return months;
  };

  const getHabitPerformance = () => {
    return habits.map(habit => {
      const totalDays = habit.completions?.length || 0;
      const completedDays = habit.completions?.filter(c => c.completed).length || 0;
      const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
      
      return {
        name: habit.name,
        completions: completedDays,
        rate: Math.round(completionRate)
      };
    }).sort((a, b) => b.completions - a.completions);
  };

  const weeklyData = generateWeeklyData();
  const monthlyData = generateMonthlyData();
  const habitPerformance = getHabitPerformance();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Analytics & Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="completions" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {weeklyData[weeklyData.length - 1]?.completions || 0}
                </div>
                <div className="text-sm text-muted-foreground">This Week</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(weeklyData.reduce((sum, week) => sum + week.completions, 0) / weeklyData.length)}
                </div>
                <div className="text-sm text-muted-foreground">Avg. per Week</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completions" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="space-y-3">
              {habitPerformance.map((habit, index) => (
                <div key={habit.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{habit.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{habit.completions} completions</div>
                    <div className="text-sm text-muted-foreground">{habit.rate}% rate</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
