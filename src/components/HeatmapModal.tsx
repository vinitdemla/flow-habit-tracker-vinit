
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  // Generate 52 weeks of data (1 year)
  const generateYearHeatmapData = () => {
    const weeks = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // Start from the beginning of the week one year ago
    const startDate = new Date(oneYearAgo);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    for (let week = 0; week < 53; week++) {
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

  const heatmapData = generateYearHeatmapData();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Calculate statistics
  const totalCompletions = habit.completions?.filter(c => c.completed).length || 0;
  const totalDays = habit.completions?.length || 0;
  const successRate = totalDays > 0 ? Math.round((totalCompletions / totalDays) * 100) : 0;

  // Get intensity level for heatmap coloring
  const getIntensityLevel = (completed: boolean) => {
    if (!completed) return 0;
    return 4; // Full intensity for completed days
  };

  const getHeatmapColor = (level: number) => {
    const colors = [
      'bg-gray-100', // 0 - no activity
      'bg-green-100', // 1 - low
      'bg-green-200', // 2 - medium-low  
      'bg-green-400', // 3 - medium-high
      'bg-green-600'  // 4 - high
    ];
    return colors[level];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{habit.icon}</span>
              {habit.name} - Activity Heatmap
            </DialogTitle>
            <Select defaultValue="last-year">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Month labels */}
              <div className="flex justify-start ml-8">
                <div className="grid grid-cols-12 gap-0 text-xs text-gray-500">
                  {months.map((month, index) => (
                    <div key={month} className="w-[52px] text-center">
                      {index % 3 === 0 ? month : ''}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Heatmap grid */}
              <div className="flex gap-1">
                {/* Day labels */}
                <div className="flex flex-col gap-1 mr-2 text-xs text-gray-500">
                  <div className="h-3"></div>
                  <div className="h-3 flex items-center">Mon</div>
                  <div className="h-3"></div>
                  <div className="h-3 flex items-center">Wed</div>
                  <div className="h-3"></div>
                  <div className="h-3 flex items-center">Fri</div>
                  <div className="h-3"></div>
                </div>
                
                {/* Heatmap cells */}
                <div className="flex gap-1 overflow-x-auto">
                  {heatmapData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day, dayIndex) => (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`w-3 h-3 rounded-sm border border-gray-200 cursor-pointer transition-all hover:ring-2 hover:ring-gray-400 ${
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
              
              {/* Legend */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-100 rounded-sm border border-gray-200"></div>
                    <div className="w-3 h-3 bg-green-100 rounded-sm border border-gray-200"></div>
                    <div className="w-3 h-3 bg-green-200 rounded-sm border border-gray-200"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-sm border border-gray-200"></div>
                    <div className="w-3 h-3 bg-green-600 rounded-sm border border-gray-200"></div>
                  </div>
                  <span>More</span>
                </div>
                <div className="text-sm">
                  {totalCompletions} completions in the last year
                </div>
              </div>
              
              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{successRate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{habit.streak}</div>
                  <div className="text-sm text-gray-600">Current Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{totalDays}</div>
                  <div className="text-sm text-gray-600">Total Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{totalCompletions}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
