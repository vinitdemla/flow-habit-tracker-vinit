import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useState, useEffect } from 'react';
import { AchievementBadges } from '@/components/AchievementBadges';
import { PersonalRecords } from '@/components/PersonalRecords';
import { ExportData } from '@/components/ExportData';

interface HabitCompletion {
  date: string;
  completed: boolean;
  completionTime?: string;
}

interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  streak: number;
  completedToday: boolean;
  totalDays: number;
  completedDays: number;
  icon: string;
  frequency: string;
  customDays?: string[];
  completions?: HabitCompletion[];
}

const Analytics = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [timeRange, setTimeRange] = useState('weekly');

  useEffect(() => {
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      const parsedHabits = JSON.parse(storedHabits);
      // Reset daily habits at midnight
      const resetHabits = resetDailyHabitsAtMidnight(parsedHabits);
      setHabits(resetHabits);
      // Save the reset habits back to localStorage
      localStorage.setItem('habits', JSON.stringify(resetHabits));
    }
  }, []);

  // Function to reset daily habits at midnight
  const resetDailyHabitsAtMidnight = (habits: Habit[]) => {
    const today = new Date().toISOString().split('T')[0];
    const lastResetDate = localStorage.getItem('lastResetDate');
    
    if (lastResetDate !== today) {
      // It's a new day, reset daily habits
      const resetHabits = habits.map(habit => {
        if (habit.frequency === 'daily') {
          return {
            ...habit,
            completedToday: false
          };
        }
        return habit;
      });
      
      localStorage.setItem('lastResetDate', today);
      return resetHabits;
    }
    
    return habits;
  };

  // Generate 7-day average completion rate data
  const generateCompletionRateData = () => {
    const weeks = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      
      let totalCompletions = 0;
      let totalPossible = 0;
      
      // Calculate for each day in the week
      for (let day = 0; day < 7; day++) {
        const currentDay = new Date(weekStart);
        currentDay.setDate(weekStart.getDate() + day);
        const dateStr = currentDay.toISOString().split('T')[0];
        
        habits.forEach(habit => {
          if (habit.completions) {
            const dayCompletion = habit.completions.find(c => c.date === dateStr);
            if (dayCompletion) {
              totalPossible++;
              if (dayCompletion.completed) {
                totalCompletions++;
              }
            }
          }
        });
      }
      
      const rate = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;
      weeks.push({ week: `Week ${12-i}`, rate });
    }
    return weeks;
  };

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

      habits.forEach(habit => {
        if (habit.completions) {
          habit.completions.forEach(completion => {
            if (completion.completed && completion.completionTime) {
              const [hours] = completion.completionTime.split(':').map(Number);
              if (hours >= slot.start && hours < slot.end) {
                completionsInSlot++;
              }
            }
          });
        }
      });

      return { time: slot.label, completions: completionsInSlot };
    });
  };

  // Generate category distribution data
  const generateCategoryData = () => {
    const categories = habits.reduce((acc, habit) => {
      const category = habit.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
    
    return Object.entries(categories).map(([category, count], index) => ({
      name: category,
      value: count,
      fill: colors[index % colors.length]
    }));
  };

  // Generate monthly data
  const generateMonthlyData = () => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      
      let totalCompletions = 0;
      habits.forEach(habit => {
        if (habit.completions) {
          const monthCompletions = habit.completions.filter(c => 
            c.completed && c.date.startsWith(monthKey)
          ).length;
          totalCompletions += monthCompletions;
        }
      });

      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        completions: totalCompletions
      });
    }
    return months;
  };

  const weeklyData = generateWeeklyData();
  const completionRateData = generateCompletionRateData();
  const timeOfDayData = generateTimeOfDayData();
  const categoryData = generateCategoryData();
  const monthlyData = generateMonthlyData();

  const chartConfig = {
    rate: {
      label: 'Success Rate (%)',
      color: '#3B82F6',
    },
    completions: {
      label: 'Completions',
      color: '#10B981',
    },
    month: {
      label: 'Month',
      color: '#3B82F6',
    },
    week: {
      label: 'Week',
      color: '#3B82F6',
    },
    time: {
      label: 'Time',
      color: '#3B82F6',
    },
    day: {
      label: 'Day',
      color: '#10B981',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-48 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="weekly" className="dark:text-gray-100 dark:hover:bg-gray-700">Weekly View</SelectItem>
              <SelectItem value="monthly" className="dark:text-gray-100 dark:hover:bg-gray-700">Monthly View</SelectItem>
              <SelectItem value="yearly" className="dark:text-gray-100 dark:hover:bg-gray-700">Yearly View</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid w-full min-w-[320px] grid-cols-4 dark:bg-gray-800">
              <TabsTrigger value="overview" className="text-xs sm:text-sm dark:text-gray-100 dark:data-[state=active]:bg-gray-700">Overview</TabsTrigger>
              <TabsTrigger value="patterns" className="text-xs sm:text-sm dark:text-gray-100 dark:data-[state=active]:bg-gray-700">Patterns</TabsTrigger>
              <TabsTrigger value="achievements" className="text-xs sm:text-sm dark:text-gray-100 dark:data-[state=active]:bg-gray-700">Achievements</TabsTrigger>
              <TabsTrigger value="export" className="text-xs sm:text-sm dark:text-gray-100 dark:data-[state=active]:bg-gray-700">Export</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base dark:text-gray-100">Completion Rate Trend</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-6">
                  <div className="w-full h-60 sm:h-80">
                    <ChartContainer config={chartConfig}>
                      <LineChart data={timeRange === 'monthly' ? monthlyData : completionRateData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <XAxis 
                          dataKey={timeRange === 'monthly' ? 'month' : 'week'}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9CA3AF', fontSize: 10 }}
                          domain={[0, timeRange === 'monthly' ? 'dataMax' : 100]}
                          tickFormatter={(value) => timeRange === 'monthly' ? value.toString() : `${value}%`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          dataKey={timeRange === 'monthly' ? 'completions' : 'rate'}
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                          type="monotone"
                        />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base dark:text-gray-100">Habit Categories</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-6">
                  <div className="w-full h-60 sm:h-80">
                    <ChartContainer config={chartConfig}>
                      <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius="80%"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <PersonalRecords habits={habits} />
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base dark:text-gray-100">Completions by Time of Day</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-6">
                  <div className="w-full h-60 sm:h-80">
                    <ChartContainer config={chartConfig}>
                      <BarChart data={timeOfDayData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <XAxis 
                          dataKey="time" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9CA3AF', fontSize: 10 }}
                          domain={[0, 'dataMax']}
                          tickFormatter={(value) => Math.round(value).toString()}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar 
                          dataKey="completions" 
                          fill="#3B82F6" 
                          radius={[4, 4, 0, 0]}
                          maxBarSize={40}
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base dark:text-gray-100">Weekly Completion Pattern</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-6">
                  <div className="w-full h-60 sm:h-80">
                    <ChartContainer config={chartConfig}>
                      <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <XAxis 
                          dataKey="day" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#9CA3AF', fontSize: 10 }}
                          domain={[0, 'dataMax']}
                          tickFormatter={(value) => Math.round(value).toString()}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar 
                          dataKey="completions" 
                          fill="#10B981" 
                          radius={[4, 4, 0, 0]}
                          maxBarSize={60}
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementBadges habits={habits} />
          </TabsContent>

          <TabsContent value="export">
            <ExportData habits={habits} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
