
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  LineChart, 
  Line 
} from 'recharts';
import { useState, useEffect } from 'react';

interface HabitCompletion {
  date: string;
  completed: boolean;
  completionTime?: string; // Format: "HH:MM"
}

interface Habit {
  id: string;
  name: string;
  completions?: HabitCompletion[];
}

const Analytics = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    // Get habits from localStorage
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    }
  }, []);

  // Generate weekly data based on actual completion days
  const generateWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(day => {
      let totalCompletions = 0;
      
      habits.forEach(habit => {
        if (habit.completions) {
          const dayCompletions = habit.completions.filter(completion => {
            if (!completion.completed) return false;
            const completionDate = new Date(completion.date);
            const dayOfWeek = completionDate.getDay();
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return dayNames[dayOfWeek] === day;
          }).length;
          totalCompletions += dayCompletions;
        }
      });

      return {
        day,
        completions: totalCompletions
      };
    });
  };

  const generateCompletionRateData = () => {
    const weeks = [];
    for (let i = 5; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      
      let weekCompletions = 0;
      let weekTotal = 0;
      
      habits.forEach(habit => {
        if (habit.completions) {
          const weekHabitCompletions = habit.completions.filter(completion => {
            const completionDate = new Date(completion.date);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return completionDate >= weekStart && completionDate <= weekEnd;
          });
          
          weekCompletions += weekHabitCompletions.filter(c => c.completed).length;
          weekTotal += weekHabitCompletions.length;
        }
      });
      
      const rate = weekTotal > 0 ? Math.round((weekCompletions / weekTotal) * 100) : 0;
      weeks.push({ week: `Week ${6-i}`, rate });
    }
    return weeks;
  };

  // Generate time of day data based on actual completion times
  const generateTimeOfDayData = () => {
    const timeSlots = [
      { label: '6AM', start: 6, end: 8 },
      { label: '8AM', start: 8, end: 10 },
      { label: '10AM', start: 10, end: 12 },
      { label: '12PM', start: 12, end: 14 },
      { label: '2PM', start: 14, end: 16 },
      { label: '4PM', start: 16, end: 18 },
      { label: '6PM', start: 18, end: 20 },
      { label: '8PM', start: 20, end: 22 },
      { label: '10PM', start: 22, end: 24 }
    ];

    return timeSlots.map(slot => {
      let completionsInSlot = 0;
      let totalCompletions = 0;

      habits.forEach(habit => {
        if (habit.completions) {
          habit.completions.forEach(completion => {
            if (completion.completed) {
              totalCompletions++;
              if (completion.completionTime) {
                const [hours] = completion.completionTime.split(':').map(Number);
                if (hours >= slot.start && hours < slot.end) {
                  completionsInSlot++;
                }
              }
            }
          });
        }
      });

      const rate = totalCompletions > 0 ? Math.round((completionsInSlot / totalCompletions) * 100) : 0;
      return { time: slot.label, rate };
    });
  };

  const weeklyData = generateWeeklyData();
  const completionRateData = generateCompletionRateData();
  const timeOfDayData = generateTimeOfDayData();

  const chartConfig = {
    rate: {
      label: 'Success Rate (%)',
      color: '#3B82F6',
    },
    completions: {
      label: 'Completions',
      color: '#10B981',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <Select defaultValue="weekly">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly View</SelectItem>
              <SelectItem value="monthly">Monthly View</SelectItem>
              <SelectItem value="yearly">Yearly View</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Completion Rate Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <LineChart data={completionRateData}>
                  <XAxis 
                    dataKey="week" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    domain={['0', '100']}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`${value}%`, 'Success Rate']}
                  />
                  <Line 
                    dataKey="rate" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                    type="monotone"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Success Rate by Time of Day</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <BarChart data={timeOfDayData}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    domain={['0', '100']}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`${value}%`, 'Success Rate']}
                  />
                  <Bar 
                    dataKey="rate" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <BarChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  domain={[0, 'dataMax']}
                  tickFormatter={(value) => Math.round(value).toString()}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [Math.round(value as number), 'Completions']}
                />
                <Bar 
                  dataKey="completions" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
