
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    let startDate = new Date(today);
    let totalWeeks = 4;
    
    switch (timeRange) {
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        totalWeeks = 5;
        break;
      case '6months':
        startDate.setMonth(today.getMonth() - 6);
        totalWeeks = 26;
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        totalWeeks = 53;
        break;
    }
    
    // Start from the beginning of the week
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    for (let week = 0; week < totalWeeks; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (week * 7) + day);
        
        if (currentDate <= today) {
          const dateStr = currentDate.toISOString().split('T')[0];
          const completion = habit.completions?.find(c => c.date === dateStr);
          const isCompleted = completion?.completed || false;
          
          weekData.push({
            date: dateStr,
            completed: isCompleted,
            dayOfMonth: currentDate.getDate(),
            month: currentDate.getMonth(),
            isCurrentMonth: currentDate <= today
          });
        } else {
          weekData.push(null);
        }
      }
      weeks.push(weekData);
    }
    return weeks;
  };

  const getIntensityLevel = (completed: boolean) => {
    if (!completed) return 0;
    return 4; // Full intensity for completed days
  };

  const getHeatmapColor = (level: number) => {
    const colors = [
      'bg-gray-100 dark:bg-gray-800', // 0 - no activity
      'bg-green-100 dark:bg-green-900', // 1 - low
      'bg-green-200 dark:bg-green-800', // 2 - medium-low  
      'bg-green-400 dark:bg-green-700', // 3 - medium-high
      'bg-green-600 dark:bg-green-600'  // 4 - high
    ];
    return colors[level];
  };

  const HeatmapGrid = ({ timeRange }: { timeRange: 'month' | '6months' | 'year' }) => {
    const heatmapData = generateHeatmapData(timeRange);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Month labels - responsive */}
        {timeRange !== 'month' && (
          <div className="flex justify-start ml-6 sm:ml-8">
            <div className={`grid gap-0 text-xs text-gray-500 dark:text-gray-400 ${
              timeRange === '6months' ? 'grid-cols-6' : 'grid-cols-12'
            }`}>
              {months.slice(0, timeRange === '6months' ? 6 : 12).map((month, index) => (
                <div key={month} className="w-8 sm:w-[52px] text-center">
                  {timeRange === 'year' && index % 3 === 0 ? month : timeRange === '6months' ? month : ''}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Heatmap grid */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-2 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
            <div className="h-2 sm:h-3"></div>
            <div className="h-2 sm:h-3 flex items-center">Mon</div>
            <div className="h-2 sm:h-3"></div>
            <div className="h-2 sm:h-3 flex items-center">Wed</div>
            <div className="h-2 sm:h-3"></div>
            <div className="h-2 sm:h-3 flex items-center">Fri</div>
            <div className="h-2 sm:h-3"></div>
          </div>
          
          {/* Heatmap cells */}
          <div className="flex gap-1 min-w-0">
            {heatmapData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1 animate-fade-in" style={{ animationDelay: `${weekIndex * 20}ms` }}>
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-sm border border-gray-200 dark:border-gray-600 cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-gray-400 dark:hover:ring-gray-300 hover:scale-110 ${
                      day 
                        ? getHeatmapColor(getIntensityLevel(day.completed))
                        : 'bg-transparent border-transparent'
                    }`}
                    title={day ? `${day.date}: ${day.completed ? 'Completed' : 'Not completed'}` : ''}
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{habit.icon}</span>
            <span className="text-lg sm:text-xl">{habit.name} - Activity Heatmap</span>
          </DialogTitle>
        </DialogHeader>
        
        <Card className="animate-fade-in">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Tabs for different time periods */}
              <Tabs defaultValue="year" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
                  <TabsTrigger value="month" className="text-xs sm:text-sm">Month</TabsTrigger>
                  <TabsTrigger value="6months" className="text-xs sm:text-sm">6 Months</TabsTrigger>
                  <TabsTrigger value="year" className="text-xs sm:text-sm">Year</TabsTrigger>
                </TabsList>

                <TabsContent value="month" className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Last Month</h3>
                  <HeatmapGrid timeRange="month" />
                </TabsContent>

                <TabsContent value="6months" className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Last 6 Months</h3>
                  <HeatmapGrid timeRange="6months" />
                </TabsContent>

                <TabsContent value="year" className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Last Year</h3>
                  <HeatmapGrid timeRange="year" />
                </TabsContent>
              </Tabs>
              
              {/* Legend */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-600 dark:text-gray-400 gap-4">
                <div className="flex items-center gap-2">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-100 dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-600"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-100 dark:bg-green-900 rounded-sm border border-gray-200 dark:border-gray-600"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-200 dark:bg-green-800 rounded-sm border border-gray-200 dark:border-gray-600"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 dark:bg-green-700 rounded-sm border border-gray-200 dark:border-gray-600"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-600 dark:bg-green-600 rounded-sm border border-gray-200 dark:border-gray-600"></div>
                  </div>
                  <span>More</span>
                </div>
                <div className="text-sm">
                  {totalCompletions} completions tracked
                </div>
              </div>
              
              {/* Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{successRate}%</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{habit.streak}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
                  <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">{totalDays}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Days</div>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg animate-fade-in" style={{ animationDelay: '500ms' }}>
                  <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">{totalCompletions}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Completed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
