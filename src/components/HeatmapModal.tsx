
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HeatmapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: {
    id: string;
    name: string;
    icon: string;
    streak: number;
    completedDays: number;
    totalDays: number;
    completions?: Array<{
      date: string;
      completed: boolean;
      completionTime?: string;
    }>;
  };
}

export const HeatmapModal = ({ open, onOpenChange, habit }: HeatmapModalProps) => {
  const generateHeatmapData = (timeRange: 'month' | '6months' | 'year') => {
    const weeks = [];
    const today = new Date();
    let startDate = new Date();
    let totalWeeks = 4;
    
    switch (timeRange) {
      case 'month':
        // Start from first day of current month
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        // Calculate weeks needed to show the full month
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const firstDayOfWeek = startDate.getDay();
        totalWeeks = Math.ceil((daysInMonth + firstDayOfWeek) / 7);
        break;
      case '6months':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 6);
        startDate.setDate(1);
        totalWeeks = 26;
        break;
      case 'year':
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        startDate.setMonth(today.getMonth());
        startDate.setDate(today.getDate());
        totalWeeks = 53;
        break;
    }
    
    // Adjust start date to beginning of week (Sunday = 0)
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    for (let week = 0; week < totalWeeks; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (week * 7) + day);
        
        // Only show dates up to today
        if (currentDate <= today) {
          const dateStr = currentDate.toISOString().split('T')[0];
          const completion = habit.completions?.find(c => c.date === dateStr);
          const isCompleted = completion?.completed || false;
          const isToday = dateStr === today.toISOString().split('T')[0];
          
          // Check if date is in current month for month view
          const isCurrentMonth = timeRange === 'month' ? 
            currentDate.getMonth() === today.getMonth() && 
            currentDate.getFullYear() === today.getFullYear() : true;
          
          weekData.push({
            date: dateStr,
            completed: isCompleted,
            dayOfMonth: currentDate.getDate(),
            month: currentDate.getMonth(),
            isCurrentMonth,
            isToday,
            dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
            completionTime: completion?.completionTime
          });
        } else {
          weekData.push(null);
        }
      }
      weeks.push(weekData);
    }
    return weeks;
  };

  const getIntensityLevel = (completed: boolean, isToday: boolean) => {
    if (isToday && !completed) return 1; // Light highlight for today
    if (!completed) return 0;
    return 4; // Full intensity for completed days
  };

  const getHeatmapColor = (level: number, isToday: boolean) => {
    if (isToday && level === 1) {
      return 'bg-blue-200 dark:bg-blue-800 border-2 border-blue-500 dark:border-blue-400 shadow-sm';
    }
    
    const colors = [
      'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600', // 0 - no activity
      'bg-green-100 dark:bg-green-900 border border-gray-200 dark:border-gray-600', // 1 - low
      'bg-green-200 dark:bg-green-800 border border-gray-200 dark:border-gray-600', // 2 - medium-low  
      'bg-green-400 dark:bg-green-700 border border-gray-200 dark:border-gray-600', // 3 - medium-high
      'bg-green-600 dark:bg-green-600 border border-green-700 dark:border-green-500'  // 4 - high
    ];
    
    if (isToday && level === 4) {
      return colors[level] + ' ring-2 ring-blue-400 dark:ring-blue-500';
    }
    
    return colors[level];
  };

  const HeatmapGrid = ({ timeRange }: { timeRange: 'month' | '6months' | 'year' }) => {
    const heatmapData = generateHeatmapData(timeRange);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Current period indicator */}
        <div className="text-center">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {timeRange === 'month' ? 
              `${months[today.getMonth()]} ${today.getFullYear()}` :
              timeRange === '6months' ?
              'Last 6 Months' :
              'Last Year'
            }
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Today: {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Month labels for longer periods */}
        {timeRange !== 'month' && (
          <div className="flex justify-start ml-8">
            <div className={`grid gap-4 text-xs text-gray-500 dark:text-gray-400 ${
              timeRange === '6months' ? 'grid-cols-6' : 'grid-cols-12'
            }`}>
              {(timeRange === '6months' ? 
                months.slice(Math.max(0, today.getMonth() - 5), today.getMonth() + 1) :
                months
              ).map((month, index) => (
                <div key={month} className="text-center min-w-[40px]">
                  {timeRange === 'year' && index % 3 === 0 ? month : month}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Heatmap grid */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-2 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
            <div className="h-4"></div>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={day} className="h-4 flex items-center text-right pr-1 min-w-[24px]">
                {index % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>
          
          {/* Heatmap cells */}
          <div className="flex gap-1 min-w-0">
            {heatmapData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1" style={{ animationDelay: `${weekIndex * 10}ms` }}>
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-4 h-4 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 ${
                      day 
                        ? getHeatmapColor(getIntensityLevel(day.completed, day.isToday), day.isToday)
                        : 'bg-transparent'
                    }`}
                    title={day ? 
                      `${new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}: ${day.completed ? `Completed${day.completionTime ? ` at ${day.completionTime}` : ''}` : 'Not completed'}${day.isToday ? ' (Today)' : ''}` : 
                      ''
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Calculate statistics
  const totalCompletions = habit.completions?.filter(c => c.completed).length || 0;
  const totalDays = habit.completions?.length || 0;
  const successRate = totalDays > 0 ? Math.round((totalCompletions / totalDays) * 100) : 0;

  // Check if completed today
  const today = new Date().toISOString().split('T')[0];
  const completedToday = habit.completions?.some(c => c.date === today && c.completed) || false;

  // Calculate weekly completion for this week
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const weeklyCompletions = habit.completions?.filter(c => {
    const completionDate = new Date(c.date);
    return completionDate >= startOfWeek && c.completed;
  }).length || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <span className="text-2xl">{habit.icon}</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span>{habit.name} - Activity Heatmap</span>
              {completedToday && (
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                  ✓ Completed Today
                </span>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{successRate}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{habit.streak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalCompletions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Completed</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{weeklyCompletions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">This Week</div>
                </div>
              </div>

              {/* Tabs for different time periods */}
              <Tabs defaultValue="month" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="month">This Month</TabsTrigger>
                  <TabsTrigger value="6months">6 Months</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>

                <TabsContent value="month" className="space-y-4">
                  <HeatmapGrid timeRange="month" />
                </TabsContent>

                <TabsContent value="6months" className="space-y-4">
                  <HeatmapGrid timeRange="6months" />
                </TabsContent>

                <TabsContent value="year" className="space-y-4">
                  <HeatmapGrid timeRange="year" />
                </TabsContent>
              </Tabs>
              
              {/* Legend */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-600 dark:text-gray-400 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-600"></div>
                    <div className="w-3 h-3 bg-green-100 dark:bg-green-900 rounded-sm border border-gray-200 dark:border-gray-600"></div>
                    <div className="w-3 h-3 bg-green-200 dark:bg-green-800 rounded-sm border border-gray-200 dark:border-gray-600"></div>
                    <div className="w-3 h-3 bg-green-400 dark:bg-green-700 rounded-sm border border-gray-200 dark:border-gray-600"></div>
                    <div className="w-3 h-3 bg-green-600 dark:bg-green-600 rounded-sm border border-green-700 dark:border-green-500"></div>
                  </div>
                  <span>More</span>
                  <div className="ml-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-200 dark:bg-blue-800 rounded-sm border-2 border-blue-500 dark:border-blue-400"></div>
                    <span className="text-xs">Today</span>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {totalCompletions} total completions tracked
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
