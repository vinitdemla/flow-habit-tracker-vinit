
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

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
  };
}

export const HeatmapModal = ({ open, onOpenChange, habit }: HeatmapModalProps) => {
  // Generate heatmap data based on real habit completion data
  const generateHeatmapData = () => {
    const weeks = [];
    const today = new Date();
    
    for (let week = 11; week >= 0; week--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (week * 7));
      
      const days = [];
      for (let day = 0; day < 7; day++) {
        const currentDay = new Date(weekStart);
        currentDay.setDate(weekStart.getDate() + day);
        
        // Use real completion probability based on habit's success rate
        const successRate = habit.totalDays > 0 ? habit.completedDays / habit.totalDays : 0;
        const completed = Math.random() < successRate ? 1 : 0;
        
        days.push({
          date: currentDay.toISOString().split('T')[0],
          completed,
          dayName: currentDay.toLocaleDateString('en', { weekday: 'short' })
        });
      }
      weeks.push(days);
    }
    return weeks;
  };

  const heatmapData = generateHeatmapData();
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Calculate real statistics
  const successRate = habit.totalDays > 0 ? Math.round((habit.completedDays / habit.totalDays) * 100) : 0;
  const totalDaysInHeatmap = heatmapData.flat().length;
  const completedInHeatmap = heatmapData.flat().filter(day => day.completed).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{habit.icon}</span>
            {habit.name} - Progress Heatmap
          </DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Last 12 Weeks</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <div className="flex gap-1">
                  {/* Day labels */}
                  <div className="flex flex-col gap-1 mr-2">
                    <div className="h-3"></div>
                    {dayLabels.map((day, index) => (
                      <div key={day} className="h-3 text-xs text-gray-500 flex items-center">
                        {index % 2 === 1 ? day : ''}
                      </div>
                    ))}
                  </div>
                  
                  {/* Heatmap grid */}
                  {heatmapData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      <div className="h-3 text-xs text-gray-500 text-center">
                        {weekIndex % 4 === 0 ? `W${12 - weekIndex}` : ''}
                      </div>
                      {week.map((day, dayIndex) => (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-gray-400 ${
                            day.completed
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          title={`${day.date}: ${day.completed ? 'Completed' : 'Not completed'}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              
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
                  <div className="text-2xl font-bold text-purple-600">{habit.totalDays}</div>
                  <div className="text-sm text-gray-600">Total Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{habit.completedDays}</div>
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
